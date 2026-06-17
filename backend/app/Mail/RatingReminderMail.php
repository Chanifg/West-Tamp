<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class RatingReminderMail extends Mailable
{
    public $booking;
    public $ratingUrl;

    public function __construct(
        Booking $booking,
        string $ratingUrl
    ) {
        $this->booking = $booking;
        $this->ratingUrl = $ratingUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⭐ Bagaimana Pengalaman Anda di WestTamp Wellness?'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.rating-reminder'
        );
    }
}