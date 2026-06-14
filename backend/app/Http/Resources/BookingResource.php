<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'booking_ref' => $this->booking_ref,
            'customer_name' => $this->customer_name,
            'ticket_qty' => $this->ticket_qty,
            'total_price' => $this->total_price,
            'payment_status' => $this->payment_status,
            'arrival_status' => $this->arrival_status,
            'qr_code' => $this->qr_code,
            'package' => $this->whenLoaded('package', function () {
                return [
                    'id' => $this->package->id,
                    'name' => $this->package->name,
                    'price' => $this->package->price,
                ];
            }),
            'session' => $this->whenLoaded('session', function () {
                return [
                    'id' => $this->session->id,
                    'session_date' => $this->session->session_date,
                    'shift' => $this->session->shift,
                    'status' => $this->session->status,
                ];
            }),
        ];
    }
}
