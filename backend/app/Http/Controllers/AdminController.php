<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\TubingSession;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboardStats()
    {
        // Total Tickets Sold (success payments)
        $totalTickets = Booking::where('payment_status', 'success')->sum('ticket_qty');
        
        // Total Revenue (only from successful bookings, specific to tubing)
        $totalRevenue = Booking::where('payment_status', 'success')->sum('total_price');

        // Revenue by Package
        $revenueByPackage = Booking::where('payment_status', 'success')
            ->select('tubing_package_id')
            ->selectRaw('SUM(total_price) as revenue')
            ->with('package')
            ->groupBy('tubing_package_id')
            ->get()
            ->map(function ($item) {
                return [
                    'package' => $item->package->name,
                    'revenue' => $item->revenue
                ];
            });

        // Current Visitors Arrived vs Expected (for today)
        $today = date('Y-m-d');
        $todaysSessions = TubingSession::where('session_date', $today)->pluck('id');
        
        $expectedToday = Booking::whereIn('tubing_session_id', $todaysSessions)
            ->where('payment_status', 'success')
            ->sum('ticket_qty');
            
        $arrivedToday = Booking::whereIn('tubing_session_id', $todaysSessions)
            ->where('payment_status', 'success')
            ->where('arrival_status', 'arrived')
            ->sum('ticket_qty');

        return response()->json([
            'total_tickets' => $totalTickets,
            'total_revenue' => $totalRevenue,
            'revenue_by_package' => $revenueByPackage,
            'today_visitors' => [
                'expected' => $expectedToday,
                'arrived' => $arrivedToday
            ]
        ]);
    }

    public function verifyQr(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string'
        ]);

        $booking = Booking::with(['package', 'session'])->where('qr_code', $request->qr_code)->first();

        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'QR Code tidak valid atau tidak ditemukan.'], 404);
        }

        if ($booking->arrival_status === 'arrived') {
            return response()->json(['success' => false, 'message' => 'Pengunjung ini sudah diverifikasi sebelumnya.'], 400);
        }

        // Verify it's the correct date and shift. Usually, admin scans on the spot
        // Optional logic: Check if today is the booked date

        $booking->arrival_status = 'arrived';
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil!',
            'data' => [
                'customer_name' => $booking->customer_name,
                'package' => $booking->package->name,
                'qty' => $booking->ticket_qty,
                'session' => $booking->session->session_date . ' (' . $booking->session->shift . ')'
            ]
        ]);
    }

    public function weatherEmergency(Request $request)
    {
        $request->validate([
            'session_id' => 'required|exists:tubing_sessions,id'
        ]);

        $session = TubingSession::findOrFail($request->session_id);
        $session->status = 'cancelled';
        $session->save();

        // Get all successful bookings for this session
        $bookings = Booking::where('tubing_session_id', $session->id)
            ->where('payment_status', 'success')
            ->get();

        $waCount = 0;
        foreach ($bookings as $b) {
            // Generate auto-reschedule link (this would point to frontend reschedule page)
            $rescheduleUrl = env('FRONTEND_URL', 'http://localhost:5173') . "/reschedule?booking_ref=" . $b->booking_ref;

            // SIMULATE WA EMERGENCY SENDING
            $msg = "INFO DARURAT: Mohon maaf, akibat kondisi cuaca buruk (arus Sungai Elo membahayakan), sesi Tubing Anda hari ini DIBATALKAN demi keselamatan. Silakan atur ulang kuota kedatangan Anda (Berlaku 30 hari): {$rescheduleUrl}";
            
            Log::info("[EMERGENCY WA] To: {$b->customer_phone}, Message: {$msg}");
            $waCount++;
        }

        return response()->json([
            'success' => true,
            'message' => "Sesi dibatalkan. Link reschedule telah dikirim ke {$waCount} pengunjung."
        ]);
    }
}
