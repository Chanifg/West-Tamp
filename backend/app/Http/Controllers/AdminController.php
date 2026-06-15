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
            $b->payment_status = 'pending_reschedule';
            $b->save();

            // Generate auto-reschedule link (this would point to frontend reschedule page)
            $rescheduleUrl = config('app.frontend_url') . "/reschedule?booking_ref=" . $b->booking_ref;

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

    public function listSessions()
    {
        $sessions = TubingSession::orderBy('session_date', 'desc')
            ->orderBy('shift', 'asc')
            ->get();

        return response()->json($sessions);
    }

    public function exportReport(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d',
            'format' => 'nullable|string|in:csv,pdf',
        ]);

        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $format = $request->query('format', 'csv');

        $query = Booking::with(['package', 'session'])
            ->whereIn('payment_status', ['success', 'pending_reschedule']);

        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $bookings = $query->orderBy('created_at', 'asc')->get();

        $totalRevenue = $bookings->sum('total_price');
        $totalTickets = $bookings->sum('ticket_qty');

        $revenueByPackage = [];
        $groupedPackage = $bookings->groupBy('tubing_package_id');
        foreach ($groupedPackage as $pkgId => $items) {
            $pkgName = $items->first()->package->name ?? 'Unknown';
            $revenueByPackage[] = [
                'package' => $pkgName,
                'qty' => $items->sum('ticket_qty'),
                'revenue' => $items->sum('total_price')
            ];
        }

        $revenueByShift = [
            'pagi' => ['shift' => 'pagi', 'qty' => 0, 'revenue' => 0],
            'siang' => ['shift' => 'siang', 'qty' => 0, 'revenue' => 0],
        ];
        foreach ($bookings as $b) {
            $shift = $b->session->shift ?? 'pagi';
            if (isset($revenueByShift[$shift])) {
                $revenueByShift[$shift]['qty'] += $b->ticket_qty;
                $revenueByShift[$shift]['revenue'] += $b->total_price;
            }
        }

        if ($format === 'pdf') {
            $data = [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'bookings' => $bookings,
                'total_revenue' => $totalRevenue,
                'total_tickets' => $totalTickets,
                'revenue_by_package' => $revenueByPackage,
                'revenue_by_shift' => array_values($revenueByShift)
            ];

            $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('reports.report', $data);
            return $pdf->download('financial_report_' . date('Ymd_His') . '.pdf');
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="financial_report_' . date('Ymd_His') . '.csv"',
        ];

        $callback = function () use ($bookings, $startDate, $endDate, $totalRevenue, $totalTickets, $revenueByPackage, $revenueByShift) {
            $file = fopen('php://output', 'w');
            
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            fputcsv($file, ['WESTTAMP WELLNESS & RIVER TUBING - LAPORAN KEUANGAN']);
            fputcsv($file, ['Periode', ($startDate ?? 'Semua') . ' s/d ' . ($endDate ?? 'Semua')]);
            fputcsv($file, ['Tanggal Ekspor', date('Y-m-d H:i:s')]);
            fputcsv($file, []);

            fputcsv($file, ['RINGKASAN EKSEKUTIF']);
            fputcsv($file, ['Total Transaksi Sukses', count($bookings)]);
            fputcsv($file, ['Total Tiket Terjual', $totalTickets]);
            fputcsv($file, ['Total Pendapatan (Rp)', $totalRevenue]);
            fputcsv($file, []);

            fputcsv($file, ['PENDAPATAN PER PAKET']);
            fputcsv($file, ['Nama Paket', 'Jumlah Tiket', 'Pendapatan (Rp)']);
            foreach ($revenueByPackage as $item) {
                fputcsv($file, [$item['package'], $item['qty'], $item['revenue']]);
            }
            fputcsv($file, []);

            fputcsv($file, ['PENDAPATAN PER SESI/SHIFT']);
            fputcsv($file, ['Sesi/Shift', 'Jumlah Tiket', 'Pendapatan (Rp)']);
            foreach ($revenueByShift as $item) {
                fputcsv($file, [ucfirst($item['shift']), $item['qty'], $item['revenue']]);
            }
            fputcsv($file, []);

            fputcsv($file, ['RINCIAN TRANSAKSI']);
            fputcsv($file, [
                'Kode Booking',
                'Tanggal Transaksi',
                'Nama Pelanggan',
                'Paket Wisata',
                'Tanggal Sesi',
                'Sesi/Shift',
                'Jumlah Tiket',
                'Total Harga (Rp)',
                'Status Pembayaran'
            ]);

            foreach ($bookings as $b) {
                fputcsv($file, [
                    $b->booking_ref,
                    $b->created_at->format('Y-m-d H:i:s'),
                    $b->customer_name,
                    $b->package->name ?? '-',
                    $b->session->session_date ?? '-',
                    $b->session->shift ?? '-',
                    $b->ticket_qty,
                    $b->total_price,
                    $b->payment_status
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
