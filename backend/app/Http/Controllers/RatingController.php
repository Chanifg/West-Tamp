<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Booking;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Submit rating dari pengunjung
     */
    public function store(Request $request)
    {
        $request->validate([
            'booking_ref' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000'
        ]);

        $booking = Booking::where(
            'booking_ref',
            $request->booking_ref
        )->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        $existing = Rating::where(
            'booking_id',
            $booking->id
        )->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Rating sudah pernah diberikan'
            ], 422);
        }

        $rating = Rating::create([
            'booking_id' => $booking->id,
            'rating' => $request->rating,
            'review' => $request->review,
            'is_published' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih atas ulasannya!',
            'data' => $rating
        ]);
    }

    /**
     * Data booking untuk halaman form rating
     */
    public function showFormData($bookingRef)
    {
        $booking = Booking::with([
            'package',
            'session'
        ])
            ->where('booking_ref', $bookingRef)
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'booking_ref' => $booking->booking_ref,
                'customer_name' => $booking->customer_name,
                'package_name' => $booking->package->name,
                'session_date' => $booking->session->session_date,
                'already_rated' => $booking->rating ? true : false,
            ]
        ]);
    }

    /**
     * Admin lihat semua rating
     */
    public function index()
    {
        $ratings = Rating::with([
            'booking'
        ])
            ->latest()
            ->get();

        return response()->json($ratings);
    }

    /**
     * Admin publish testimonial
     */
    public function publish($id)
    {
        $rating = Rating::findOrFail($id);

        $rating->is_published = true;

        $rating->save();

        return response()->json([
            'success' => true,
            'message' => 'Testimoni berhasil dipublish'
        ]);
    }

    /**
     * Public testimonial
     */
    public function publicRatings()
    {
        $ratings = Rating::with([
            'booking'
        ])
            ->where('is_published', true)
            ->latest()
            ->take(20)
            ->get();

        return response()->json($ratings);
    }

    public function unpublish(Rating $rating)
    {
        $rating->update(['is_published' => false]);
        return response()->json(['message' => 'Rating unpublished successfully']);
    }
}
