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
        // WARNING: Change this password when deploying to production!
        if (User::where('email', 'admin@westtamp.com')->doesntExist()) {
            User::create([
                'name' => 'Admin POKDARWIS',
                'email' => 'admin@westtamp.com',
                'role' => 'admin',
                'password' => bcrypt('password')
            ]);
        }

        TubingPackage::firstOrCreate(
            ['name' => 'Paket Fun (Pemuda)'],
            [
                'description' => 'Termasuk alat keselamatan, pemandu, dan welcome drink.',
                'price' => 150000
            ]
        );

        TubingPackage::firstOrCreate(
            ['name' => 'Paket Adventure (Keluarga)'],
            [
                'description' => 'Termasuk makan siang sehat, dokumentasi, loker, dan ruang ganti.',
                'price' => 275000
            ]
        );
    }
}
