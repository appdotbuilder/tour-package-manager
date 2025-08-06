<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\TourPackage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Booking>
     */
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tourPackage = TourPackage::inRandomOrder()->first();
        $agent = User::where('role', 'agent')->inRandomOrder()->first();
        $numberOfPeople = fake()->numberBetween(1, 8);
        $totalAmount = $tourPackage->price * $numberOfPeople;
        $commissionRate = 0.1; // 10%
        $agentCommission = $totalAmount * $commissionRate;
        
        return [
            'tour_package_id' => $tourPackage->id,
            'agent_id' => $agent->id,
            'customer_name' => fake()->name(),
            'customer_email' => fake()->unique()->safeEmail(),
            'customer_phone' => fake()->phoneNumber(),
            'number_of_people' => $numberOfPeople,
            'total_amount' => $totalAmount,
            'agent_commission' => $agentCommission,
            'status' => fake()->randomElement(['pending', 'confirmed', 'completed', 'cancelled']),
            'notes' => fake()->optional(0.3)->sentence(),
        ];
    }
}