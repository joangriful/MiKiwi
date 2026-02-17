<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_show_route_resolves_by_slug(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->id,
            'slug' => 'test-product-slug',
            'is_active' => true,
        ]);

        $response = $this->get(route('products.show', 'test-product-slug'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('ProductPage')
            ->has('product', fn ($json) => $json
                ->where('slug', 'test-product-slug')
                ->etc()
            )
        );
    }

    public function test_category_show_route_resolves_by_slug(): void
    {
        $category = Category::factory()->create([
            'slug' => 'test-category-slug',
            'is_active' => true,
        ]);

        $response = $this->get(route('categories.show', 'test-category-slug'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Products')
            ->has('category', fn ($json) => $json
                ->where('slug', 'test-category-slug')
                ->etc()
            )
        );
    }
}
