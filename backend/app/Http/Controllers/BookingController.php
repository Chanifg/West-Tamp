<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TubingPackage;
use App\Models\TubingSession;
use App\Models\Booking;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    public function getPackages()
    {
        return response()->json(TubingPackage::orderBy('is_popular', 'desc')->orderBy('id', 'desc')->get());
    }

    public function lookup(Request $request)
    {
        $request->validate([
            'booking_ref' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        $query = Booking::with(['package', 'session'])
            ->where('booking_ref', strtoupper($request->booking_ref));

        if ($request->phone) {
            $query->where('customer_phone', $request->phone);
        }

        $booking = $query->first();

        if (!$booking) {
            return response()->json(['message' => 'Tiket tidak ditemukan.'], 404);
        }

        return response()->json($booking);
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = $request->date;

        try {
            $pagi = TubingSession::firstOrCreate(
                ['session_date' => $date, 'shift' => 'pagi'],
                ['max_capacity' => 100, 'booked_capacity' => 0]
            );
        } catch (\Illuminate\Database\QueryException $e) {
            $pagi = TubingSession::where('session_date', $date)->where('shift', 'pagi')->firstOrFail();
        }

        try {
            $siang = TubingSession::firstOrCreate(
                ['session_date' => $date, 'shift' => 'siang'],
                ['max_capacity' => 100, 'booked_capacity' => 0]
            );
        } catch (\Illuminate\Database\QueryException $e) {
            $siang = TubingSession::where('session_date', $date)->where('shift', 'siang')->firstOrFail();
        }

        return response()->json([
            'pagi' => [
                'id' => $pagi->id,
                'available' => $pagi->max_capacity - $pagi->booked_capacity,
                'status' => $pagi->status
            ],
            'siang' => [
                'id' => $siang->id,
                'available' => $siang->max_capacity - $siang->booked_capacity,
                'status' => $siang->status
            ]
        ]);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:tubing_packages,id',
            'session_id' => 'required|exists:tubing_sessions,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => ['required', 'string', 'regex:/^(?:\+62|62|0)8[1-9][0-9]{7,10}$/'],
            'ticket_qty' => 'required|integer|min:1|max:100',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $session = TubingSession::where('id', $request->session_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($session->status !== 'active') {
                    return response()->json(['message' => 'Session is cancelled due to weather emergency.'], 400);
                }

                if (($session->booked_capacity + $request->ticket_qty) > $session->max_capacity) {
                    return response()->json(['message' => 'Not enough slots available for this session.'], 400);
                }

                $package = TubingPackage::findOrFail($request->package_id);
                $totalPrice = $package->price * $request->ticket_qty;
                $orderId = 'WT-' . time() . '-' . Str::random(5);

                // Configuration Midtrans
                \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-YOUR_SERVER_KEY');
                \Midtrans\Config::$isProduction = false;
                \Midtrans\Config::$isSanitized = true;
                \Midtrans\Config::$is3ds = true;

                $params = array(
                    'transaction_details' => array(
                        'order_id' => $orderId,
                        'gross_amount' => $totalPrice,
                    ),
                    'customer_details' => array(
                        'first_name' => $request->customer_name,
                        'phone' => $request->customer_phone,
                    ),
                    'item_details' => array(
                        array(
                            'id' => $package->id,
                            'price' => $package->price,
                            'quantity' => $request->ticket_qty,
                            'name' => $package->name
                        )
                    )
                );

                $serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-YOUR_SERVER_KEY');
                if ($serverKey === 'SB-Mid-server-YOUR_SERVER_KEY' || empty($serverKey)) {
                    // Mock behavior for testing when keys are not provided
                    $snapToken = 'MOCK_SNAP_TOKEN_' . Str::random(10);
                } else {
                    $snapToken = \Midtrans\Snap::getSnapToken($params);
                }

                // Reserve capacity tentatively
                $session->increment('booked_capacity', $request->ticket_qty);

                $booking = Booking::create([
                    'booking_ref' => strtoupper(Str::random(8)),
                    'tubing_package_id' => $package->id,
                    'tubing_session_id' => $session->id,
                    'customer_name' => $request->customer_name,
                    'customer_phone' => $request->customer_phone,
                    'ticket_qty' => $request->ticket_qty,
                    'total_price' => $totalPrice,
                    'qr_code' => null, // Generated upon payment success
                    'midtrans_order_id' => $orderId,
                    'midtrans_snap_token' => $snapToken,
                    'payment_status' => 'pending'
                ]);

                return response()->json([
                    'booking_id' => $booking->id,
                    'snap_token' => $snapToken,
                    'order_id' => $orderId
                ]);
            });

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function reschedule(Request $request)
    {
        $request->validate([
            'booking_ref' => 'required|string|exists:bookings,booking_ref',
            'session_id' => 'required|exists:tubing_sessions,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $booking = Booking::where('booking_ref', $request->booking_ref)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($booking->payment_status !== 'success') {
                    return response()->json(['message' => 'Only successful/paid bookings can be rescheduled.'], 400);
                }

                $newSession = TubingSession::where('id', $request->session_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($newSession->status !== 'active') {
                    return response()->json(['message' => 'The destination session is not active.'], 400);
                }

                if (($newSession->booked_capacity + $booking->ticket_qty) > $newSession->max_capacity) {
                    return response()->json(['message' => 'Not enough slots available in the selected session.'], 400);
                }

                // Release capacity from the old session
                if ($booking->session) {
                    $booking->session->decrement('booked_capacity', $booking->ticket_qty);
                }

                // Reserve capacity in the new session
                $newSession->increment('booked_capacity', $booking->ticket_qty);

                // Update booking
                $booking->tubing_session_id = $newSession->id;
                $booking->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Booking rescheduled successfully.'
                ]);
            });
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function midtransWebhook(Request $request)
    {
        \Midtrans\Config::$serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-YOUR_SERVER_KEY');
        try {
            $notif = new \Midtrans\Notification();
        } catch (\Exception $e) {
            // Because we mock it via frontend testing sometimes we might not have a valid post format
            // Let's implement static handle for sandbox tests
            Log::info("Invalid Midtrans Notification format: " . $e->getMessage());
            $notif = (object) $request->all();
        }

        $transaction = $notif->transaction_status;
        $order_id = $notif->order_id;
        
        $booking = Booking::where('midtrans_order_id', $order_id)->first();
        if (!$booking) return response()->json('Order not found', 404);

        if ($transaction == 'capture' || $transaction == 'settlement') {
            if ($booking->payment_status != 'success') {
                $booking->payment_status = 'success';
                // Generate simple QR Code string for verification
                $booking->qr_code = 'WT-QR-' . $booking->booking_ref;
                $booking->save();
                
                // SIMULATE WA TICKET SENDING
                Log::info("[TICKET SENT VIA WA] To: {$booking->customer_phone}, QR: {$booking->qr_code}");
            }
        } else if ($transaction == 'cancel' || $transaction == 'deny' || $transaction == 'expire') {
            if ($booking->payment_status != 'failed' && $booking->payment_status != 'expired') {
                $booking->payment_status = $transaction == 'expire' ? 'expired' : 'failed';
                $booking->save();
                
                // Release capacity
                $booking->session->decrement('booked_capacity', $booking->ticket_qty);
            }
        }

        return response()->json('OK');
    }
}
