<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlogController;

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
    
    // Blog Admin Routes
    Route::post('/admin/blogs', [BlogController::class, 'store']);
    Route::post('/admin/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy']);
    Route::post('/admin/upload-image', [BlogController::class, 'uploadImage']);
});

// Blog Public Routes
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);
