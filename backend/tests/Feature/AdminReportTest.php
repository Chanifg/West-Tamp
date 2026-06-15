<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Booking;
use App\Models\TubingPackage;
use App\Models\TubingSession;

class AdminReportTest extends TestCase
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

    public function test_export_report_blocks_unauthenticated_users()
    {
        $response = $this->getJson('/api/admin/reports/export');
        $response->assertStatus(401);
    }

    public function test_export_report_blocks_non_admin_users()
    {
        $user = $this->createUser();
        $response = $this->actingAs($user)->getJson('/api/admin/reports/export');
        $response->assertStatus(403);
    }

    public function test_export_report_as_csv_successfully()
    {
        $admin = $this->createAdmin();

        $package = TubingPackage::create([
            'name' => 'Paket A',
            'price' => 150000,
            'description' => 'Description'
        ]);

        $session = TubingSession::create([
            'session_date' => now()->format('Y-m-d'),
            'shift' => 'pagi',
            'max_capacity' => 100,
            'booked_capacity' => 5,
            'status' => 'active'
        ]);

        $booking = Booking::create([
            'booking_ref' => 'REFCSV01',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $session->id,
            'customer_name' => 'John Doe',
            'customer_phone' => '081234567890',
            'customer_email' => 'john@example.com',
            'ticket_qty' => 5,
            'total_price' => 750000
        ]);
        $booking->payment_status = 'success';
        $booking->save();

        $response = $this->actingAs($admin)->get('/api/admin/reports/export?format=csv');
        
        $response->assertStatus(200);
        $this->assertStringContainsString('text/csv', $response->headers->get('Content-Type'));
        
        $content = $response->streamedContent();
        $this->assertStringContainsString('WESTTAMP WELLNESS & RIVER TUBING - LAPORAN KEUANGAN', $content);
        $this->assertStringContainsString('REFCSV01', $content);
        $this->assertStringContainsString('John Doe', $content);
        $this->assertStringContainsString('Paket A', $content);
    }

    public function test_export_report_as_pdf_successfully()
    {
        $admin = $this->createAdmin();

        $package = TubingPackage::create([
            'name' => 'Paket B',
            'price' => 150000,
            'description' => 'Description'
        ]);

        $session = TubingSession::create([
            'session_date' => now()->format('Y-m-d'),
            'shift' => 'siang',
            'max_capacity' => 100,
            'booked_capacity' => 2,
            'status' => 'active'
        ]);

        $booking = Booking::create([
            'booking_ref' => 'REFPDF01',
            'tubing_package_id' => $package->id,
            'tubing_session_id' => $session->id,
            'customer_name' => 'Jane Smith',
            'customer_phone' => '081234567890',
            'customer_email' => 'jane@example.com',
            'ticket_qty' => 2,
            'total_price' => 300000
        ]);
        $booking->payment_status = 'success';
        $booking->save();

        $response = $this->actingAs($admin)->get('/api/admin/reports/export?format=pdf');

        $response->assertStatus(200);
        $this->assertStringContainsString('application/pdf', $response->headers->get('Content-Type'));
    }
}
