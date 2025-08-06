<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@tourmanager.com',
            'role' => 'admin',
        ]);
        
        // Create test agent
        User::factory()->create([
            'name' => 'Agent Smith',
            'email' => 'agent@tourmanager.com',
            'role' => 'agent',
        ]);
        
        // Create additional users
        User::factory(8)->create();
        
        // Seed tour packages
        $this->call([
            TourPackageSeeder::class,
        ]);
        
        // Create bookings (only if we have agents and packages)
        $agents = User::where('role', 'agent')->get();
        $packages = \App\Models\TourPackage::all();
        
        if ($agents->isNotEmpty() && $packages->isNotEmpty()) {
            \App\Models\Booking::factory(25)->create();
        }
    }
}