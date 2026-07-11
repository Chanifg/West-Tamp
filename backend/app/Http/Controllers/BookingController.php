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
use Illuminate\Support\Facades\Mail;
use App\Mail\ETicketMail;
use App\Mail\RescheduleSuccessMail;
use App\Http\Resources\BookingResource;
use App\Mail\BookingConfirmationMail;


class BookingController extends Controller
{
    public function getPackages()
{
    return response()->json(
        TubingPackage::with('features') // <-- Tambahkan with('features') di sini
            ->orderBy('is_popular', 'desc')
            ->orderBy('id', 'desc')
            ->get()
    );
}

    public function show($booking_ref)
    {
        $booking = Booking::with([
            'package',
            'session'
        ])->where('booking_ref', $booking_ref)->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking tidak ditemukan.'
            ], 404);
        }

        if (
            $booking->payment_status === 'expired' ||
            now()->greaterThan($booking->expired_at)
        ) {

            return response()->json([
                'message' => 'Booking sudah kedaluwarsa.'
            ], 410);
        }

        return response()->json([
            'booking_ref' => $booking->booking_ref,
            'customer_name' => $booking->customer_name,
            'customer_email' => $booking->customer_email,
            'customer_phone' => $booking->customer_phone,

            'package' => [
                'id' => $booking->package->id,
                'name' => $booking->package->name,
                'price' => $booking->package->price,
            ],

            'session' => [
                'id' => $booking->session->id,
                'shift' => $booking->session->shift,
                'session_date' => $booking->session->session_date,
            ],

            'ticket_qty' => $booking->ticket_qty,
            'total_price' => $booking->total_price,

            'payment_status' => $booking->payment_status,
            'snap_token' => $booking->midtrans_snap_token,
            'expired_at' => $booking->expired_at,
        ]);
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

        return new BookingResource($booking);
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
        'package_id'      => 'required|exists:tubing_packages,id',
        'session_id'      => 'required|exists:tubing_sessions,id',
        'customer_name'   => 'required|string|max:255',
        'customer_phone'  => ['required', 'string', 'regex:/^(?:\+62|62|0)8[1-9][0-9]{7,10}$/'],
        'customer_email'  => 'required|email|max:255',
        'ticket_qty'      => 'required|integer|min:1|max:100',
    ]);

    try {

        $booking = DB::transaction(function () use ($request) {

            $session = TubingSession::where('id', $request->session_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($session->status !== 'active') {
                throw new \Exception('Session is cancelled due to weather emergency.');
            }

            if (($session->booked_capacity + $request->ticket_qty) > $session->max_capacity) {
                throw new \Exception('Not enough slots available for this session.');
            }

            $package = TubingPackage::findOrFail($request->package_id);

            $totalPrice = $package->price * $request->ticket_qty;

            $orderId = 'ORDER-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(5));

            $expiredAt = now()->addHours(24);

            \Midtrans\Config::$serverKey = config('services.midtrans.server_key');
            \Midtrans\Config::$isProduction = config('services.midtrans.is_production', false);
            \Midtrans\Config::$isSanitized = config('services.midtrans.is_sanitized', true);
            \Midtrans\Config::$is3ds = config('services.midtrans.is_3ds', true);

            $params = [
                'transaction_details' => [
                    'order_id' => $orderId,
                    'gross_amount' => $totalPrice,
                ],

                'customer_details' => [
                    'first_name' => $request->customer_name,
                    'email' => $request->customer_email,
                    'phone' => $request->customer_phone,
                ],

                'item_details' => [[
                    'id' => $package->id,
                    'price' => $package->price,
                    'quantity' => $request->ticket_qty,
                    'name' => $package->name,
                ]],

                'expiry' => [
                    'unit' => 'hour',
                    'duration' => 24,
                ],
            ];

            $serverKey = config('services.midtrans.server_key');

            if (
                empty($serverKey)
            ) {
                $snapToken = 'MOCK_SNAP_TOKEN_' . Str::random(12);
            } else {
                $snapToken = \Midtrans\Snap::getSnapToken($params);
            }

            return Booking::create([
                'booking_ref' => strtoupper(Str::random(8)),
                'tubing_package_id' => $package->id,
                'tubing_session_id' => $session->id,
                'customer_name' => $request->customer_name,
                'customer_phone' => $request->customer_phone,
                'customer_email' => $request->customer_email,
                'ticket_qty' => $request->ticket_qty,
                'total_price' => $totalPrice,
                'payment_status' => 'pending',
                'arrival_status' => 'expected',
                'midtrans_order_id' => $orderId,
                'midtrans_snap_token' => $snapToken,
                'expired_at' => $expiredAt,
                'qr_code' => null,
            ]);
        });

        try {

            Mail::to($booking->customer_email)
                ->send(new BookingConfirmationMail($booking));

        } catch (\Exception $e) {

            Log::error('Failed Send Booking Email', [
                'booking_id' => $booking->id,
                'email' => $booking->customer_email,
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Booking created successfully.',
            'data' => [
                'booking_ref' => $booking->booking_ref,
                'snap_token' => $booking->midtrans_snap_token,
                'payment_status' => $booking->payment_status,
                'expired_at' => $booking->expired_at,
            ]
        ], 201);

    } catch (\Exception $e) {

        Log::error('Checkout Error', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        $status = 500;

        if (
            $e->getMessage() === 'Session is cancelled due to weather emergency.' ||
            $e->getMessage() === 'Not enough slots available for this session.'
        ) {
            $status = 400;
        }

        return response()->json([
            'message' => $e->getMessage(),
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], $status);
    }
}

    public function verifyReschedule(Request $request)
    {
        $request->validate([
            'booking_ref' => 'required|string',
        ]);

        $booking = Booking::with(['package', 'session'])
            ->where('booking_ref', strtoupper($request->booking_ref))
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Tiket tidak ditemukan.'], 404);
        }

        if (!in_array($booking->payment_status, ['success', 'pending_reschedule'])) {
            return response()->json(['message' => 'Hanya tiket yang sudah dibayar yang dapat dijadwalkan ulang.'], 400);
        }

        $sessionDate = Carbon::parse($booking->session->session_date);
        if ($sessionDate->copy()->addDays(30)->lt(Carbon::today())) {
            return response()->json(['message' => 'Batas waktu reschedule (30 hari dari sesi asli) telah kedaluwarsa.'], 400);
        }

        if ($booking->session->status === 'active') {
            if (Carbon::today()->diffInDays($sessionDate, false) < 1) {
                return response()->json(['message' => 'Penjadwalan ulang mandiri hanya dapat dilakukan maksimal H-1 sebelum tanggal kunjungan.'], 400);
            }
        }

        return response()->json([
            'success' => true,
            'booking' => new BookingResource($booking)
        ]);
    }

    public function processReschedule(Request $request)
    {
        $request->validate([
            'booking_ref' => 'required|string|exists:bookings,booking_ref',
            'session_id' => 'required|exists:tubing_sessions,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $booking = Booking::where('booking_ref', strtoupper($request->booking_ref))
                    ->lockForUpdate()
                    ->firstOrFail();

                if (!in_array($booking->payment_status, ['success', 'pending_reschedule'])) {
                    return response()->json(['message' => 'Hanya tiket yang sudah dibayar yang dapat dijadwalkan ulang.'], 400);
                }

                $sessionDate = Carbon::parse($booking->session->session_date);
                if ($sessionDate->copy()->addDays(30)->lt(Carbon::today())) {
                    return response()->json(['message' => 'Batas waktu reschedule (30 hari) telah kedaluwarsa.'], 400);
                }

                if ($booking->session->status === 'active') {
                    if (Carbon::today()->diffInDays($sessionDate, false) < 1) {
                        return response()->json(['message' => 'Penjadwalan ulang mandiri hanya dapat dilakukan maksimal H-1 sebelum tanggal kunjungan.'], 400);
                    }
                }

                $newSession = TubingSession::where('id', $request->session_id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($newSession->status !== 'active') {
                    return response()->json(['message' => 'Sesi tujuan tidak aktif.'], 400);
                }

                if (($newSession->booked_capacity + $booking->ticket_qty) > $newSession->max_capacity) {
                    return response()->json(['message' => 'Kuota tidak mencukupi pada sesi yang dipilih.'], 400);
                }

               
                if ($booking->session) {
                    $booking->session->decrement('booked_capacity', $booking->ticket_qty);
                }

                // Reserve capacity in the new session
                $newSession->increment('booked_capacity', $booking->ticket_qty);

                // Update booking
                $booking->tubing_session_id = $newSession->id;
                $booking->payment_status = 'success';
                $booking->save();

                // Send reschedule success email
                try {
                    Mail::to($booking->customer_email)->send(new RescheduleSuccessMail($booking));
                } catch (\Exception $e) {
                    Log::error("Failed to send Reschedule Success email for booking ref {$booking->booking_ref}: " . $e->getMessage());
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Booking rescheduled successfully.'
                ]);
            });
        } catch (\Exception $e) {
            Log::error("Reschedule error: " . $e->getMessage(), ['exception' => $e]);
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses reschedule.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function midtransWebhook(Request $request)
{
    Log::info('MIDTRANS WEBHOOK', $request->all());

    $serverKey = config('services.midtrans.server_key');

    $orderId = $request->input('order_id');
    $statusCode = $request->input('status_code');
    $grossAmount = $request->input('gross_amount');
    $signatureKey = $request->input('signature_key');
    $transactionStatus = $request->input('transaction_status');
    $fraudStatus = $request->input('fraud_status');

    $mySignature = hash('sha512',
        $orderId . $statusCode . $grossAmount . $serverKey
    );

    if (!hash_equals($mySignature, $signatureKey)) {
        return response()->json(['message' => 'Invalid Signature'], 403);
    }

    DB::beginTransaction();

    try {

        $booking = Booking::where('midtrans_order_id', $orderId)
            ->lockForUpdate()
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        switch ($transactionStatus) {

            case 'capture':
                $booking->payment_status = ($fraudStatus == 'challenge')
                    ? 'pending'
                    : 'success';
                break;

            case 'settlement':
                $booking->payment_status = 'success';
                break;

            case 'pending':
                $booking->payment_status = 'pending';
                break;

            case 'deny':
            case 'cancel':
                $booking->payment_status = 'failed';
                break;

            case 'expire':
                $booking->payment_status = 'expired';
                break;
        }

        if ($booking->payment_status === 'success' && empty($booking->qr_code)) {

            $booking->qr_code = 'QR-' . $booking->booking_ref;

            $session = $booking->session;

            if ($session) {
                $session->increment('booked_capacity', $booking->ticket_qty);
            }

            try {
                Mail::to($booking->customer_email)
                    ->send(new ETicketMail($booking));
            } catch (\Exception $e) {
                Log::error('Email failed', [$e->getMessage()]);
            }
        }

        if (in_array($booking->payment_status, ['failed', 'expired'])) {

            $session = $booking->session;

            if ($session) {
                $session->decrement('booked_capacity', $booking->ticket_qty);
            }
        }

        $booking->save();

        DB::commit();

        return response()->json(['success' => true]);

    } catch (\Exception $e) {
        DB::rollBack();

        Log::error('Webhook Error', [
            'message' => $e->getMessage()
        ]);

        return response()->json(['message' => 'Server error'], 500);
    }
}
}
