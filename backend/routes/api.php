<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PackageController;

use App\Http\Controllers\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Booking Flow Endpoints
Route::middleware('throttle:public-api')->group(function () {
    Route::get('/packages', [BookingController::class, 'getPackages']);
    Route::post('/sessions/availability', [BookingController::class, 'checkAvailability']);
    Route::get('/bookings/lookup', [BookingController::class, 'lookup']);
    Route::get('/bookings/verify-reschedule', [BookingController::class, 'verifyReschedule']);

    // Blog Public Routes
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{slug}', [BlogController::class, 'show']);

    // Gallery Public Routes
    Route::get('/galleries', [GalleryController::class, 'index']);
});

Route::post('/bookings/checkout', [BookingController::class, 'checkout'])->middleware('throttle:checkout');
Route::post('/bookings/reschedule', [BookingController::class, 'processReschedule'])->middleware('throttle:checkout');
Route::post('/webhooks/midtrans', [BookingController::class, 'midtransWebhook'])->middleware('throttle:webhook');

// Admin Endpoints
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard-stats', [AdminController::class, 'dashboardStats']);
    Route::post('/admin/verify-qr', [AdminController::class, 'verifyQr']);
    Route::post('/admin/weather-emergency', [AdminController::class, 'weatherEmergency']);
    Route::get('/admin/sessions', [AdminController::class, 'listSessions']);
    
    // Blog Admin Routes
    Route::post('/admin/blogs', [BlogController::class, 'store']);
    Route::put('/admin/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy']);
    Route::post('/admin/upload-image', [BlogController::class, 'uploadImage']);

    // Gallery Admin Routes
    Route::post('/admin/galleries', [GalleryController::class, 'store']);
    Route::delete('/admin/galleries/{id}', [GalleryController::class, 'destroy']);

    // Package Admin Routes
    Route::get('/admin/packages', [PackageController::class, 'index']);
    Route::post('/admin/packages', [PackageController::class, 'store']);
    Route::put('/admin/packages/{id}', [PackageController::class, 'update']);
    Route::delete('/admin/packages/{id}', [PackageController::class, 'destroy']);
});
