<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use App\Mail\RatingReminderMail;

class SendRatingReminder extends Command
{
    protected $signature = 'ratings:send-reminders';

    protected $description = 'Send email rating reminders to visitors';

    public function handle()
    {
        $bookings = Booking::where('arrival_status', 'arrived')
            ->where('rating_request_sent', false)
            ->whereNotNull('arrived_at')
            ->where('arrived_at', '<=', Carbon::now()->subDay())
            ->get();

        $this->info(
            "Found {$bookings->count()} bookings."
        );

        foreach ($bookings as $booking) {

            try {

                $ratingUrl =
                    rtrim(env('FRONTEND_URL'), '/')
                    . '/rating/'
                    . $booking->booking_ref;


                Mail::to(
                    $booking->customer_email
                )->send(
                    new RatingReminderMail(
                        $booking,
                        $ratingUrl
                    )
                );

                $booking->rating_request_sent = true;
                $booking->save();

                Log::info(
                    'Rating reminder email sent',
                    [
                        'booking_ref' => $booking->booking_ref,
                        'email' => $booking->customer_email
                    ]
                );

                $this->info(
                    "Sent: {$booking->booking_ref}"
                );
            } catch (\Exception $e) {

                Log::error(
                    'Rating reminder email failed',
                    [
                        'booking_ref' => $booking->booking_ref,
                        'email' => $booking->customer_email,
                        'error' => $e->getMessage()
                    ]
                );

                $this->error(
                    "Failed: {$booking->booking_ref}"
                );
            }
        }

        return Command::SUCCESS;
    }
}
