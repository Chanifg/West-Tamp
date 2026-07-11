<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;

    /**
     * Create a new message instance.
     */
    public function __construct(Booking $booking)
    {
        // Load relasi yang dibutuhkan untuk email
        $this->booking = $booking->load([
            'package',
            'session'
        ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Konfirmasi Booking West Tamp Tubing - ' . $this->booking->booking_ref,
        );
    }
    
    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-confirmation',
        );
    }

    /**
     * Get the attachments.
     */
    public function attachments(): array
    {
        return [];
    }
}