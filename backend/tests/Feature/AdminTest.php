<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\TubingSession;
use Laravel\Sanctum\Sanctum;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_endpoints_block_unauthenticated_users()
    {
        $response = $this->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(401);
    }

    public function test_admin_endpoints_block_non_admin_users()
    {
        $user = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => bcrypt('password')
        ]);
        // Default role is 'user' which is constrained by EnsuringIsAdmin
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(403);
        $response->assertJsonFragment(['message' => 'Forbidden: Admin access only.']);
    }

    public function test_admin_endpoints_allow_admin_users()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password')
        ]);
        $admin->role = 'admin';
        $admin->save();

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard-stats');
        $response->assertStatus(200);
    }

    public function test_admin_can_list_sessions()
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password')
        ]);
        $admin->role = 'admin';
        $admin->save();

        Sanctum::actingAs($admin);

        TubingSession::create([
            'session_date' => '2026-06-15',
            'shift' => 'pagi',
            'max_capacity' => 100,
            'booked_capacity' => 10,
            'status' => 'active'
        ]);

        $response = $this->getJson('/api/admin/sessions');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment([
            'session_date' => '2026-06-15',
            'shift' => 'pagi',
            'status' => 'active'
        ]);
    }
}
