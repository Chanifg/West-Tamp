<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_ref',
        'tubing_package_id',
        'tubing_session_id',
        'customer_name',
        'customer_phone',
        'ticket_qty',
        'total_price',
        'qr_code',
        'midtrans_order_id',
        'midtrans_snap_token',
        'payment_status',
        'arrival_status'
    ];

    public function package()
    {
        return $this->belongsTo(TubingPackage::class, 'tubing_package_id');
    }

    public function session()
    {
        return $this->belongsTo(TubingSession::class, 'tubing_session_id');
    }
}
