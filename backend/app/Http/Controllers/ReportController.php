<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\TubingSession;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getStatistics(Request $request)
    {
        $request->validate([
            'range' => 'nullable|string|in:this_year,last_3_months,last_6_months',
        ]);

        $range = $request->query('range', 'this_year');

        // Determine start date based on range
        switch ($range) {
            case 'last_3_months':
                $startDate = Carbon::now()->subMonths(3)->startOfDay();
                break;
            case 'last_6_months':
                $startDate = Carbon::now()->subMonths(6)->startOfDay();
                break;
            case 'this_year':
            default:
                $startDate = Carbon::now()->startOfYear();
                break;
        }

        // 1. Tren Pendapatan Bulanan (Total total_price dikelompokkan per bulan)
        $revenueTrendRaw = Booking::whereIn('payment_status', ['success', 'pending_reschedule'])
            ->where('created_at', '>=', $startDate)
            ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, SUM(total_price) as total")
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $revenueTrend = [];
        foreach ($revenueTrendRaw as $item) {
            $revenueTrend[] = [
                'month' => $item->month,
                'total' => (float) $item->total,
            ];
        }

        // 2. Distribusi Paket Terpopuler (Penjualan tiket per package_id)
        $popularPackages = Booking::whereIn('payment_status', ['success', 'pending_reschedule'])
            ->where('created_at', '>=', $startDate)
            ->select('tubing_package_id')
            ->selectRaw('SUM(ticket_qty) as tickets_sold')
            ->with('package')
            ->groupBy('tubing_package_id')
            ->get()
            ->map(function ($b) {
                return [
                    'package_name' => $b->package->name ?? 'Unknown',
                    'tickets_sold' => (int) $b->tickets_sold
                ];
            });

        // 3. Rasio Okupansi Sesi (Rata-rata keterisian kuota ban sesi Pagi vs Siang)
        $sessionsOccupancyRaw = TubingSession::where('session_date', '>=', $startDate->format('Y-m-d'))
            ->where('session_date', '<=', Carbon::today()->format('Y-m-d'))
            ->select('shift')
            ->selectRaw('AVG(CASE WHEN max_capacity > 0 THEN (booked_capacity / max_capacity) * 100 ELSE 0 END) as average_occupancy')
            ->groupBy('shift')
            ->get();

        $sessionOccupancy = [
            'pagi' => 0.0,
            'siang' => 0.0
        ];
        foreach ($sessionsOccupancyRaw as $item) {
            $sessionOccupancy[$item->shift] = round((float) $item->average_occupancy, 2);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'range' => $range,
                'start_date' => $startDate->format('Y-m-d'),
                'revenue_trend' => $revenueTrend,
                'popular_packages' => $popularPackages,
                'session_occupancy' => [
                    [
                        'shift' => 'pagi',
                        'average_occupancy' => $sessionOccupancy['pagi']
                    ],
                    [
                        'shift' => 'siang',
                        'average_occupancy' => $sessionOccupancy['siang']
                    ]
                ]
            ]
        ]);
    }
}
