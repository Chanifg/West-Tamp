<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ReleasePendingBookings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:release-pending-bookings';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membatalkan booking pending yang sudah kedaluwarsa (> 15 menit) dan mengembalikan kuota ban.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredTime = Carbon::now()->subMinutes(15);

        // Select bookings that are still pending and created before the expired time
        $bookingIds = Booking::where('payment_status', 'pending')
            ->where('created_at', '<', $expiredTime)
            ->pluck('id');

        $count = 0;
        foreach ($bookingIds as $id) {
            DB::transaction(function () use ($id, &$count) {
                $booking = Booking::where('id', $id)
                    ->lockForUpdate()
                    ->first();

                if ($booking && $booking->payment_status === 'pending') {
                    $booking->payment_status = 'expired';
                    $booking->save();

                    // Release the capacity back to the session
                    if ($booking->session) {
                        $booking->session->decrement('booked_capacity', $booking->ticket_qty);
                    }

                    $count++;
                    $this->info("Booking {$booking->booking_ref} has been marked as expired and capacity released.");
                }
            });
        }

        if ($count > 0) {
            Log::info("Expired bookings released: {$count} bookings.");
            $this->info("Successfully released {$count} expired pending bookings.");
        } else {
            $this->info("No expired pending bookings found.");
        }
    }
}
