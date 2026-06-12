<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\TubingSession;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\WeatherEmergencyMail;

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
        $tomorrow = date('Y-m-d', strtotime('+1 day'));
        $todaysSessions = TubingSession::where('session_date', $today)->pluck('id');
        
        $expectedToday = Booking::whereIn('tubing_session_id', $todaysSessions)
            ->where('payment_status', 'success')
            ->sum('ticket_qty');
            
        $arrivedToday = Booking::whereIn('tubing_session_id', $todaysSessions)
            ->where('payment_status', 'success')
            ->where('arrival_status', 'arrived')
            ->sum('ticket_qty');

        $activeSessions = TubingSession::whereIn('session_date', [$today, $tomorrow])
            ->orderBy('session_date', 'asc')
            ->orderBy('shift', 'asc')
            ->get();

        return response()->json([
            'total_tickets' => $totalTickets,
            'total_revenue' => $totalRevenue,
            'revenue_by_package' => $revenueByPackage,
            'today_visitors' => [
                'expected' => $expectedToday,
                'arrived' => $arrivedToday
            ],
            'active_sessions' => $activeSessions
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

        $emailCount = 0;
        foreach ($bookings as $b) {
            // Generate auto-reschedule link (this would point to frontend reschedule page)
            $rescheduleUrl = env('FRONTEND_URL', 'http://localhost:5173') . "/reschedule?booking_ref=" . $b->booking_ref;

            // Send Email Weather Emergency
            try {
                Mail::to($b->customer_email)->send(new WeatherEmergencyMail($b, $rescheduleUrl));
                $emailCount++;
            } catch (\Exception $e) {
                Log::error("Failed to send weather emergency email to {$b->customer_email} for booking {$b->booking_ref}: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => "Sesi dibatalkan. Link reschedule telah dikirim ke {$emailCount} pengunjung."
        ]);
    }
}
