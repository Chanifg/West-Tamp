<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Booking;
use App\Models\TubingPackage;
use App\Models\TubingSession;
use Carbon\Carbon;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin()
    {
        $admin = User::factory()->make();
        $admin->role = 'admin';
        $admin->save();
        return $admin;
    }

    private function createUser()
    {
        $user = User::factory()->make();
        $user->role = 'user';
        $user->save();
        return $user;
    }

    public function test_statistics_blocks_unauthenticated_users()
    {
        $response = $this->getJson('/api/admin/reports/statistics');
        $response->assertStatus(401);
    }

    public function test_statistics_blocks_non_admin_users()
    {
        $user = $this->createUser();
        $response = $this->actingAs($user)->getJson('/api/admin/reports/statistics');
        $response->assertStatus(403);
    }

    public function test_statistics_returns_valid_data_for_this_year()
    {
        $admin = $this->createAdmin();

        $package = TubingPackage::create([
            'name' => 'Paket Premium',
            'price' => 150000,
            'description' => 'Test Description'
        ]);

        $session = TubingSession::create([
            'session_date' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'max_capacity' => 100,
            'booked_capacity' => 10,
            'status' => 'active'
        ]);

        $booking = Booking::create([
            'booking_ref' => 'REFSTAT1',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $session->id,
            'customer_name' => 'Aditya',
            'customer_phone' => '081234567890',
            'customer_email' => 'aditya@example.com',
            'ticket_qty' => 10,
            'total_price' => 1500000
        ]);
        $booking->payment_status = 'success';
        $booking->save();

        $response = $this->actingAs($admin)->getJson('/api/admin/reports/statistics?range=this_year');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'range',
                'start_date',
                'revenue_trend' => [
                    '*' => ['month', 'total']
                ],
                'popular_packages' => [
                    '*' => ['package_name', 'tickets_sold']
                ],
                'session_occupancy' => [
                    '*' => ['shift', 'average_occupancy']
                ]
            ]
        ]);

        $response->assertJsonFragment([
            'range' => 'this_year',
            'package_name' => 'Paket Premium',
            'tickets_sold' => 10
        ]);
    }
}
