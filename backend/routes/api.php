<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;

use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Booking Flow Endpoints
Route::get('/packages', [BookingController::class, 'getPackages']);
Route::post('/sessions/availability', [BookingController::class, 'checkAvailability']);
Route::post('/bookings/checkout', [BookingController::class, 'checkout']);
Route::post('/webhooks/midtrans', [BookingController::class, 'midtransWebhook']);

// Admin Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/dashboard-stats', [AdminController::class, 'dashboardStats']);
    Route::post('/admin/verify-qr', [AdminController::class, 'verifyQr']);
    Route::post('/admin/weather-emergency', [AdminController::class, 'weatherEmergency']);
});
