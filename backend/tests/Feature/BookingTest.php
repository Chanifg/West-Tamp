<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\TubingSession;
use App\Models\TubingPackage;
use App\Models\Booking;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    private function createPackage()
    {
        return TubingPackage::create([
            'name' => 'Standard Adventure',
            'description' => 'Test Description',
            'price' => 150000,
            'is_popular' => false
        ]);
    }

    private function createSession($date = null, $shift = 'pagi', $max = 100, $booked = 0, $status = 'active')
    {
        return TubingSession::create([
            'session_date' => $date ?: now()->addDay()->format('Y-m-d'),
            'shift' => $shift,
            'max_capacity' => $max,
            'booked_capacity' => $booked,
            'status' => $status
        ]);
    }

    public function test_booking_checkout_successfully_reserves_capacity()
    {
        $package = $this->createPackage();
        $session = $this->createSession();

        $response = $this->postJson('/api/bookings/checkout', [
            'package_id' => $package->id,
            'session_id' => $session->id,
            'customer_name' => 'Adhi Mulya',
            'customer_phone' => '081234567890',
            'ticket_qty' => 5
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['booking_id', 'snap_token', 'order_id']);

        $this->assertEquals(5, $session->fresh()->booked_capacity);
        
        $this->assertDatabaseHas('bookings', [
            'customer_name' => 'Adhi Mulya',
            'ticket_qty' => 5,
            'payment_status' => 'pending'
        ]);
    }

    public function test_booking_checkout_fails_if_insufficient_capacity()
    {
        $package = $this->createPackage();
        $session = $this->createSession(null, 'pagi', 10, 8); // 8/10 booked, only 2 left

        $response = $this->postJson('/api/bookings/checkout', [
            'package_id' => $package->id,
            'session_id' => $session->id,
            'customer_name' => 'Budi',
            'customer_phone' => '081234567890',
            'ticket_qty' => 3 // Requesting 3 when only 2 are left
        ]);

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'Not enough slots available for this session.']);
        $this->assertEquals(8, $session->fresh()->booked_capacity); // unchanged
    }

    public function test_booking_checkout_fails_with_invalid_phone_format()
    {
        $package = $this->createPackage();
        $session = $this->createSession();

        $response = $this->postJson('/api/bookings/checkout', [
            'package_id' => $package->id,
            'session_id' => $session->id,
            'customer_name' => 'Chandra',
            'customer_phone' => '123456', // Invalid phone format
            'ticket_qty' => 1
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['customer_phone']);
    }

    public function test_reschedule_updates_session_capacities_successfully()
    {
        $package = $this->createPackage();
        $oldSession = $this->createSession(now()->addDay()->format('Y-m-d'), 'pagi', 100, 5);
        $newSession = $this->createSession(now()->addDays(2)->format('Y-m-d'), 'siang', 100, 0);

        $booking = Booking::create([
            'booking_ref' => 'REFTEST1',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $oldSession->id,
            'customer_name' => 'Dwi',
            'customer_phone' => '081234567890',
            'ticket_qty' => 5,
            'total_price' => 750000,
            'payment_status' => 'success' // Must be success to reschedule
        ]);

        $response = $this->putJson('/api/bookings/reschedule', [
            'booking_ref' => 'REFTEST1',
            'session_id' => $newSession->id
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['success' => true]);

        // Old session capacity should be decremented: 5 - 5 = 0
        $this->assertEquals(0, $oldSession->fresh()->booked_capacity);
        
        // New session capacity should be incremented: 0 + 5 = 5
        $this->assertEquals(5, $newSession->fresh()->booked_capacity);

        // Booking should point to the new session
        $this->assertEquals($newSession->id, $booking->fresh()->tubing_session_id);
    }
}
