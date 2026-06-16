<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        Log::info("Pesan kontak baru diterima dari {$contact->email}: {$contact->subject}");

        return response()->json([
            'success' => true,
            'message' => 'Pesan Anda berhasil terkirim. Terima kasih!',
            'data' => $contact
        ], 201);
    }
}
