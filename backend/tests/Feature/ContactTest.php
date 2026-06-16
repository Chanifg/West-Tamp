<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Contact;
use Illuminate\Support\Facades\Log;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_validation_fails_with_invalid_data()
    {
        $response = $this->postJson('/api/contact', [
            'name' => '',
            'email' => 'invalid-email',
            'subject' => '',
            'message' => ''
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }

    public function test_contact_form_submits_successfully_with_valid_data()
    {
        Log::shouldReceive('info')
            ->once()
            ->withArgs(function ($message) {
                return str_contains($message, 'Pesan kontak baru diterima dari bayu@example.com');
            });

        $response = $this->postJson('/api/contact', [
            'name' => 'Bayu',
            'email' => 'bayu@example.com',
            'phone' => '081234567890',
            'subject' => 'Tanya Paket Outbound',
            'message' => 'Halo, apakah ada diskon paket outbound rombongan?'
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'success' => true,
            'message' => 'Pesan Anda berhasil terkirim. Terima kasih!'
        ]);

        $this->assertDatabaseHas('contacts', [
            'name' => 'Bayu',
            'email' => 'bayu@example.com',
            'subject' => 'Tanya Paket Outbound'
        ]);
    }
}
