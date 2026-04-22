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
        Schema::create('tubing_sessions', function (Blueprint $table) {
            $table->id();
            $table->date('session_date');
            $table->enum('shift', ['pagi', 'siang']); // Pagi/Siang
            $table->integer('max_capacity')->default(100);
            $table->integer('booked_capacity')->default(0);
            $table->enum('status', ['active', 'cancelled'])->default('active');
            $table->timestamps();
            
            // A session is uniquely identified by date and shift
            $table->unique(['session_date', 'shift']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tubing_sessions');
    }
};
