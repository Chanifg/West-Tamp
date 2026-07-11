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
            // Menambahkan kolom expired_at setelah kolom tertentu (opsional, misal: 'created_at')
            $table->timestamp('expired_at')->nullable()->after('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('namatabel', function (Blueprint $table) {
            // Menghapus kolom jika migration di-rollback
            $table->dropColumn('expired_at');
        });
    }
};
