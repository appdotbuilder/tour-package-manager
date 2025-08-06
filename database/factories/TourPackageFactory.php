<?php

namespace Database\Factories;

use App\Models\TourPackage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TourPackage>
 */
class TourPackageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\TourPackage>
     */
    protected $model = TourPackage::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $destinations = [
            ['Bali', 'Ubud', 'Seminyak', 'Nusa Penida'],
            ['Tokyo', 'Kyoto', 'Osaka', 'Mount Fuji'],
            ['Paris', 'Rome', 'Barcelona', 'Amsterdam'],
            ['New York', 'Los Angeles', 'San Francisco', 'Las Vegas'],
            ['London', 'Edinburgh', 'Bath', 'Canterbury'],
            ['Bangkok', 'Chiang Mai', 'Phuket', 'Koh Samui'],
            ['Cairo', 'Luxor', 'Aswan', 'Alexandria'],
            ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
        ];

        $facilities = [
            ['Airport Transfer', '5-star Hotel', 'Guided Tours', 'All Meals'],
            ['Luxury Accommodation', 'Private Transport', 'Cultural Activities', 'Spa Services'],
            ['Boutique Hotels', 'Local Guide', 'Food Tours', 'Museum Tickets'],
            ['Beach Resort', 'Water Sports', 'Sunset Cruise', 'Beachside Dining'],
            ['Mountain Lodge', 'Hiking Equipment', 'Scenic Drives', 'Local Cuisine'],
            ['City Hotels', 'Metro Pass', 'Walking Tours', 'Shopping Guide'],
        ];

        $packageNames = [
            'Paradise Explorer',
            'Cultural Journey',
            'Grand Adventure',
            'Ultimate Experience',
            'Premium Getaway',
            'Luxury Escape',
            'Discovery Tour',
            'Heritage Trail',
        ];

        $selectedDestinations = fake()->randomElement($destinations);
        $selectedFacilities = fake()->randomElement($facilities);
        $packageName = fake()->randomElement($packageNames);
        $mainDestination = $selectedDestinations[0];
        
        $startDate = fake()->dateTimeBetween('+1 week', '+3 months');
        $endDate = fake()->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +2 weeks');
        $maxCapacity = fake()->numberBetween(10, 50);
        $bookedSlots = fake()->numberBetween(0, (int)($maxCapacity * 0.7));
        
        return [
            'name' => $mainDestination . ' ' . $packageName,
            'description' => fake()->paragraph(3),
            'destinations' => $selectedDestinations,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'price' => fake()->randomFloat(2, 500, 3000),
            'max_capacity' => $maxCapacity,
            'available_slots' => $maxCapacity - $bookedSlots,
            'facilities' => $selectedFacilities,
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']), // 75% active
        ];
    }
}