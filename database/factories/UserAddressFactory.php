<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Model\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
{

    protected $model = UserAddress::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'alias' => ucfirst($this->faker->unique()->word()),
            'full_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'street_address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'postal_code' => $this->faker->postCode(),
            'country' => $this->faker->country(),
            'is_default' => false,
            
        ];
    }

    public function default(): static {
        return $this->state(fn (array $attributes) => [
            'is_default', true,
        ]);
    }
}
