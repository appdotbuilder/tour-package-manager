<?php

namespace Database\Seeders;

use App\Models\TourPackage;
use Illuminate\Database\Seeder;

class TourPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some sample tour packages
        TourPackage::factory()->count(12)->create();
        
        // Create a few specific featured packages
        TourPackage::create([
            'name' => 'Bali Paradise Explorer',
            'description' => 'Experience the magic of Bali with our comprehensive 7-day tour package. Visit ancient temples, pristine beaches, lush rice terraces, and vibrant cultural sites. Includes luxury accommodation, private transport, and expert local guides.',
            'destinations' => ['Ubud', 'Seminyak', 'Nusa Penida', 'Tanah Lot', 'Mount Batur'],
            'start_date' => now()->addDays(30),
            'end_date' => now()->addDays(37),
            'price' => 899.00,
            'max_capacity' => 24,
            'available_slots' => 18,
            'facilities' => [
                'Airport Transfer',
                'Luxury Resort Accommodation',
                'Private Air-conditioned Transport',
                'Professional Local Guide',
                'All Breakfast Included',
                'Temple Entry Tickets',
                'Snorkeling Equipment',
                'Cultural Workshop Access'
            ],
            'status' => 'active',
        ]);
        
        TourPackage::create([
            'name' => 'Tokyo Cultural Journey',
            'description' => 'Immerse yourself in Japan\'s rich culture and modern wonders. This 10-day adventure covers Tokyo\'s bustling districts, historic Kyoto temples, and the iconic Mount Fuji. Perfect blend of tradition and innovation.',
            'destinations' => ['Tokyo', 'Kyoto', 'Osaka', 'Mount Fuji', 'Hakone'],
            'start_date' => now()->addDays(45),
            'end_date' => now()->addDays(55),
            'price' => 1299.00,
            'max_capacity' => 20,
            'available_slots' => 14,
            'facilities' => [
                'JR Pass (7 days)',
                'Traditional Ryokan Stay',
                'Modern Hotel Accommodation',
                'English-speaking Guide',
                'Tea Ceremony Experience',
                'Sushi Making Class',
                'Temple Visit Permits',
                'High-speed Internet'
            ],
            'status' => 'active',
        ]);
        
        TourPackage::create([
            'name' => 'European Grand Tour',
            'description' => 'Discover the best of Europe in this 14-day grand tour covering iconic cities. From the romance of Paris to the history of Rome, and the vibrant culture of Barcelona. An unforgettable European adventure awaits.',
            'destinations' => ['Paris', 'Rome', 'Barcelona', 'Amsterdam', 'Prague'],
            'start_date' => now()->addDays(60),
            'end_date' => now()->addDays(74),
            'price' => 1899.00,
            'max_capacity' => 30,
            'available_slots' => 22,
            'facilities' => [
                'First-class Train Travel',
                '4-star Hotel Accommodation',
                'City Center Locations',
                'Multilingual Tour Guide',
                'Museum Fast-track Passes',
                'Welcome Dinner',
                'Free WiFi',
                'Daily Breakfast',
                'Airport Transfers'
            ],
            'status' => 'active',
        ]);
    }
}