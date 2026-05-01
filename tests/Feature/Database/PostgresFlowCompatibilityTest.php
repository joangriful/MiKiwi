<?php

namespace Tests\Feature\Database;

use App\Models\Category;
use App\Models\PickupPoint;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class PostgresFlowCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_review_can_be_created_with_uuid_relations(): void
    {
        $user = $this->createUser();
        $product = $this->createProduct();

        $review = Review::create([
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 5,
            'comment' => 'PostgreSQL compatibility review.',
            'is_approved' => true,
        ]);

        $this->assertTrue(Str::isUuid($review->getKey()));
        $this->assertDatabaseHas('review', [
            'id' => $review->getKey(),
            'user_id' => $user->getKey(),
            'product_id' => $product->getKey(),
            'rating' => 5,
        ]);
    }

    public function test_product_index_filters_by_category_and_case_insensitive_search(): void
    {
        $targetCategory = Category::factory()->create([
            'name' => 'Premium Dolls',
            'slug' => 'premium-dolls',
            'is_active' => true,
        ]);
        $otherCategory = Category::factory()->create([
            'name' => 'Accessories',
            'slug' => 'accessories',
            'is_active' => true,
        ]);

        Product::factory()->create([
            'category_id' => $targetCategory->getKey(),
            'name' => 'Muñeca Elsa Premium',
            'slug' => 'muneca-elsa-premium-flow',
            'stock_quantity' => 5,
            'is_active' => true,
        ]);
        Product::factory()->create([
            'category_id' => $targetCategory->getKey(),
            'name' => 'Muñeca Anna Premium',
            'slug' => 'muneca-anna-premium-flow',
            'stock_quantity' => 5,
            'is_active' => true,
        ]);
        Product::factory()->create([
            'category_id' => $otherCategory->getKey(),
            'name' => 'Lubricante Elsa Search Trap',
            'slug' => 'lubricante-elsa-search-trap',
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $response = $this->get(route('products.index', [
            'category' => 'premium-dolls',
            'search' => 'elsa',
        ]));

        $response
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Catalog/Products')
                ->where('products.data.0.slug', 'muneca-elsa-premium-flow')
                ->where('products.total', 1)
            );
    }

    public function test_pickup_point_endpoint_searches_city_without_case_sensitivity(): void
    {
        PickupPoint::create([
            'name' => 'Citypaq Centro Madrid',
            'address' => 'Calle Mayor 1',
            'city' => 'MADRID',
            'postal_code' => '28013',
            'is_active' => true,
        ]);
        PickupPoint::create([
            'name' => 'Citypaq Barcelona',
            'address' => 'Carrer Central 1',
            'city' => 'Barcelona',
            'postal_code' => '08013',
            'is_active' => true,
        ]);

        config([
            'services.correos.client_id' => null,
            'services.correos.client_secret' => null,
            'services.correos.allow_mock_fallback' => false,
        ]);

        $response = $this
            ->actingAs($this->createUser())
            ->getJson(route('pickup-points.index', ['city' => 'madrid']));

        $response
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'name' => 'Citypaq Centro Madrid',
                'city' => 'MADRID',
            ]);
    }

    private function createUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->assertInstanceOf(User::class, $user);

        return $user;
    }

    private function createProduct(array $attributes = []): Product
    {
        $product = Product::factory()->create($attributes);
        $this->assertInstanceOf(Product::class, $product);

        return $product;
    }
}
