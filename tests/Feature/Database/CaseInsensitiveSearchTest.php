<?php

declare(strict_types=1);

namespace Tests\Feature\Database;

use App\Models\Category;
use App\Models\PickupPoint;
use App\Models\Product;
use App\Support\Database\CaseInsensitiveSearch;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CaseInsensitiveSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_contains_matches_text_without_case_sensitivity(): void
    {
        $category = Category::factory()->create();

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Muñeca Elsa Premium',
            'is_active' => true,
        ]);

        Product::factory()->create([
            'category_id' => $category->id,
            'name' => 'Lubricante Base Agua',
            'is_active' => true,
        ]);

        $matches = CaseInsensitiveSearch::contains(Product::query(), 'name', 'elsa')->pluck('name');

        $this->assertSame(['Muñeca Elsa Premium'], $matches->all());
    }

    public function test_starts_with_matches_prefix_without_case_sensitivity(): void
    {
        PickupPoint::create([
            'name' => 'Citypaq Centro',
            'address' => 'Calle Mayor 1',
            'city' => 'MADRID',
            'postal_code' => '28014',
            'is_active' => true,
        ]);

        PickupPoint::create([
            'name' => 'Citypaq Norte',
            'address' => 'Avenida Norte 1',
            'city' => 'Barcelona',
            'postal_code' => '08014',
            'is_active' => true,
        ]);

        $matches = CaseInsensitiveSearch::startsWith(PickupPoint::query(), 'postal_code', '28')->pluck('city');

        $this->assertSame(['MADRID'], $matches->all());
    }
}
