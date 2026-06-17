<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    public function sendText(string $phone, string $message): bool
    {
        try {

            $response = Http::withHeaders([
                'Authorization' => env('FONNTE_TOKEN')
            ])->post(
                'https://api.fonnte.com/send',
                [
                    'target' => $phone,
                    'message' => $message,
                ]
            );

            if (!$response->successful()) {

                Log::error(
                    'Fonnte send failed',
                    [
                        'phone' => $phone,
                        'response' => $response->json()
                    ]
                );

                return false;
            }

            return true;

        } catch (\Exception $e) {

            Log::error(
                'Fonnte exception',
                [
                    'phone' => $phone,
                    'message' => $e->getMessage()
                ]
            );

            return false;
        }
    }
}