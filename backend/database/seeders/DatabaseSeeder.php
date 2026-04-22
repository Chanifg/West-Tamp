<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TubingPackage;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin POKDARWIS',
            'email' => 'admin@westtamp.com',
            'password' => bcrypt('password')
        ]);

        TubingPackage::create([
            'name' => 'Paket Fun (Pemuda)',
            'description' => 'Termasuk alat keselamatan, pemandu, dan welcome drink.',
            'price' => 150000
        ]);

        TubingPackage::create([
            'name' => 'Paket Adventure (Keluarga)',
            'description' => 'Termasuk makan siang sehat, dokumentasi, loker, dan ruang ganti.',
            'price' => 275000
        ]);
    }
}
