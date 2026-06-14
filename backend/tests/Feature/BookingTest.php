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
            'customer_email' => 'adhi@example.com',
            'ticket_qty' => 5
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['booking_id', 'snap_token', 'order_id']);

        $this->assertEquals(5, $session->fresh()->booked_capacity);
        
        $this->assertDatabaseHas('bookings', [
            'customer_name' => 'Adhi Mulya',
            'customer_email' => 'adhi@example.com',
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
            'customer_email' => 'budi@example.com',
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
            'customer_email' => 'chandra@example.com',
            'ticket_qty' => 1
        ]);

        $response->assertStatus(422); // Validation error
        $response->assertJsonValidationErrors(['customer_phone']);
    }

    public function test_reschedule_updates_session_capacities_successfully()
    {
        $package = $this->createPackage();
        $oldSession = $this->createSession(now()->addDay()->format('Y-m-d'), 'pagi', 100, 5, 'cancelled');
        $newSession = $this->createSession(now()->addDays(2)->format('Y-m-d'), 'siang', 100, 0, 'active');

        $booking = Booking::create([
            'booking_ref' => 'REFTEST1',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $oldSession->id,
            'customer_name' => 'Dwi',
            'customer_phone' => '081234567890',
            'customer_email' => 'dwi@example.com',
            'ticket_qty' => 5,
            'total_price' => 750000,
            'payment_status' => 'success' // Must be success to reschedule
        ]);

        // 1. Verify reschedule
        $verifyResponse = $this->getJson('/api/bookings/verify-reschedule?booking_ref=REFTEST1');
        $verifyResponse->assertStatus(200);
        $verifyResponse->assertJsonFragment(['success' => true]);

        // 2. Process reschedule
        $response = $this->postJson('/api/bookings/reschedule', [
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

    public function test_midtrans_webhook_sends_ticket_email()
    {
        \Illuminate\Support\Facades\Mail::fake();

        $package = $this->createPackage();
        $session = $this->createSession();

        $booking = Booking::create([
            'booking_ref' => 'REFWEBHOOK',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $session->id,
            'customer_name' => 'Eko',
            'customer_phone' => '081234567890',
            'customer_email' => 'eko@example.com',
            'ticket_qty' => 2,
            'total_price' => 300000,
            'midtrans_order_id' => 'WT-ORDER-WEBHOOK',
            'payment_status' => 'pending'
        ]);

        $response = $this->postJson('/api/webhooks/midtrans', [
            'transaction_status' => 'settlement',
            'order_id' => 'WT-ORDER-WEBHOOK'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('success', $booking->fresh()->payment_status);
        $this->assertNotNull($booking->fresh()->qr_code);

        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\ETicketMail::class, function ($mail) use ($booking) {
            return $mail->hasTo('eko@example.com') && $mail->booking->id === $booking->id;
        });
    }

    public function test_weather_emergency_sends_emails_to_all_bookings()
    {
        \Illuminate\Support\Facades\Mail::fake();

        $user = \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => bcrypt('password')
        ]);
        \Laravel\Sanctum\Sanctum::actingAs($user);

        $package = $this->createPackage();
        $session = $this->createSession();

        $booking = Booking::create([
            'booking_ref' => 'REFWEATHER',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $session->id,
            'customer_name' => 'Feri',
            'customer_phone' => '081234567890',
            'customer_email' => 'feri@example.com',
            'ticket_qty' => 2,
            'total_price' => 300000,
            'payment_status' => 'success'
        ]);

        $response = $this->postJson('/api/admin/weather-emergency', [
            'session_id' => $session->id
        ]);

        $response->assertStatus(200);
        $this->assertEquals('cancelled', $session->fresh()->status);

        \Illuminate\Support\Facades\Mail::assertSent(\App\Mail\WeatherEmergencyMail::class, function ($mail) use ($booking) {
            return $mail->hasTo('feri@example.com') && $mail->booking->id === $booking->id;
        });
    }

    public function test_reschedule_fails_if_session_not_cancelled()
    {
        $package = $this->createPackage();
        $oldSession = $this->createSession(now()->addDay()->format('Y-m-d'), 'pagi', 100, 5, 'active');
        $newSession = $this->createSession(now()->addDays(2)->format('Y-m-d'), 'siang', 100, 0, 'active');

        $booking = Booking::create([
            'booking_ref' => 'REFTEST2',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $oldSession->id,
            'customer_name' => 'Gita',
            'customer_phone' => '081234567890',
            'customer_email' => 'gita@example.com',
            'ticket_qty' => 5,
            'total_price' => 750000,
            'payment_status' => 'success'
        ]);

        // Verify should fail
        $verifyResponse = $this->getJson('/api/bookings/verify-reschedule?booking_ref=REFTEST2');
        $verifyResponse->assertStatus(400);

        // Process should fail
        $response = $this->postJson('/api/bookings/reschedule', [
            'booking_ref' => 'REFTEST2',
            'session_id' => $newSession->id
        ]);

        $response->assertStatus(400);
    }

    public function test_reschedule_fails_if_exceeds_30_days()
    {
        $package = $this->createPackage();
        $oldSession = $this->createSession(now()->subDays(31)->format('Y-m-d'), 'pagi', 100, 5, 'cancelled');
        $newSession = $this->createSession(now()->addDays(2)->format('Y-m-d'), 'siang', 100, 0, 'active');

        $booking = Booking::create([
            'booking_ref' => 'REFTEST3',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $oldSession->id,
            'customer_name' => 'Hari',
            'customer_phone' => '081234567890',
            'customer_email' => 'hari@example.com',
            'ticket_qty' => 5,
            'total_price' => 750000,
            'payment_status' => 'success'
        ]);

        // Verify should fail
        $verifyResponse = $this->getJson('/api/bookings/verify-reschedule?booking_ref=REFTEST3');
        $verifyResponse->assertStatus(400);

        // Process should fail
        $response = $this->postJson('/api/bookings/reschedule', [
            'booking_ref' => 'REFTEST3',
            'session_id' => $newSession->id
        ]);

        $response->assertStatus(400);
    }
}
