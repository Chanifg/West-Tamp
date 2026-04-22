<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TubingSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_date',
        'shift',
        'max_capacity',
        'booked_capacity',
        'status'
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
