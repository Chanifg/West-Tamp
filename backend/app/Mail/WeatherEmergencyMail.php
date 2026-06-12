<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WeatherEmergencyMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $rescheduleUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking, string $rescheduleUrl)
    {
        $this->booking = $booking;
        $this->rescheduleUrl = $rescheduleUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'PEMBERITAHUAN DARURAT: Pembatalan Sesi Tubing Westtamp Wellness',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.weather_emergency',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
