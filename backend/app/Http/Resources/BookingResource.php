<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'booking_ref' => $this->booking_ref,

            'customer_name' => $this->customer_name,
            'customer_email' => $this->customer_email,
            'customer_phone' => $this->customer_phone,

            'ticket_qty' => $this->ticket_qty,

            'total_price' => $this->total_price,

            'payment_status' => $this->payment_status,
            'arrival_status' => $this->arrival_status,

            'midtrans_snap_token' => $this->midtrans_snap_token,

            'created_at' => $this->created_at,

            'qr_code' => $this->qr_code,

            'qr_code_url' => $this->qr_code
                ? asset('storage/qrcodes/'.$this->booking_ref.'.svg')
                : null,

            'package' => $this->whenLoaded('package', function () {
                return [
                    'id' => $this->package->id,
                    'name' => $this->package->name,
                    'price' => $this->package->price,
                    'description' => $this->package->description,
                ];
            }),

            'session' => $this->whenLoaded('session', function () {
                return [
                    'id' => $this->session->id,
                    'session_date' => $this->session->session_date,
                    'shift' => $this->session->shift,
                    'status' => $this->session->status,
                    'start_time' => $this->session->start_time,
                    'end_time' => $this->session->end_time,
                ];
            }),

        ];
    }
}