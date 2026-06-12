<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Console\Scheduling\Schedule;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->call(function () {
            DB::transaction(function () {
                $expiredBookings = Booking::where('payment_status', 'pending')
                    ->where('created_at', '<', Carbon::now()->subMinutes(30))
                    ->with('session')
                    ->lockForUpdate()
                    ->get();

                foreach ($expiredBookings as $booking) {
                    $booking->payment_status = 'expired';
                    $booking->save();
                    
                    if ($booking->session) {
                        $booking->session->decrement('booked_capacity', $booking->ticket_qty);
                    }
                }
            });
        })->everyFiveMinutes();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
