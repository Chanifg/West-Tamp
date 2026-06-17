<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RatingController;

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
    Route::get('/bookings/lookup', [BookingController::class, 'lookup'])->middleware('throttle:lookup');
    Route::get('/bookings/verify-reschedule', [BookingController::class, 'verifyReschedule'])->middleware('throttle:lookup');

    // Blog Public Routes
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{slug}', [BlogController::class, 'show']);

    // Gallery Public Routes
    Route::get('/galleries', [GalleryController::class, 'index']);

    // Contact Public Route
    Route::post('/contact', [ContactController::class, 'store']);

    // Ratings Public Route
    Route::get(
        '/ratings/form/{booking_ref}',
        [RatingController::class, 'showFormData']
    );

    Route::post(
        '/ratings',
        [RatingController::class, 'store']
    );

    Route::get(
        '/ratings/public',
        [RatingController::class, 'publicRatings']
    );
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
    Route::get('/admin/reports/export', [AdminController::class, 'exportReport']);
    Route::get('/admin/reports/statistics', [ReportController::class, 'getStatistics']);

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

    // Ratings Admin Routes
    Route::get('/admin/ratings', [RatingController::class, 'index']);

    Route::put('/admin/ratings/{id}/publish', [RatingController::class, 'publish']);

    Route::put( '/admin/ratings/{rating}/unpublish', [RatingController::class, 'unpublish'] );
});

use Illuminate\Support\Facades\Mail;

Route::get('/test-mail', function () {

    Mail::raw(
        'Test email dari WestTamp Wellness 🚣',
        function ($message) {

            $message->to('codewithferdi@gmail.com')
                ->subject('SMTP Test WestTamp');

        }
    );

    return response()->json([
        'success' => true,
        'message' => 'Email sent'
    ]);
});
