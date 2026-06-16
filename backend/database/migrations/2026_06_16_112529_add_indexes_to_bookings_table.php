<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Composite index
            $table->index(['tubing_session_id', 'payment_status'], 'bookings_session_payment_status_index');
            
            // Single indexes
            $table->index('customer_email', 'bookings_customer_email_index');
            $table->index('payment_status', 'bookings_payment_status_index');
            $table->index('created_at', 'bookings_created_at_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropIndex('bookings_session_payment_status_index');
            $table->dropIndex('bookings_customer_email_index');
            $table->dropIndex('bookings_payment_status_index');
            $table->dropIndex('bookings_created_at_index');
        });
    }
};
