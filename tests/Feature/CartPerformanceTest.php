<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CartPerformanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_cart_loading_with_multiple_items_is_efficient()
    {
        // 1. Setup: Create products
        $category = Category::factory()->create(['is_active' => true]);
        $products = Product::factory()->count(10)->create([
            'is_active' => true,
            'category_id' => $category->id,
            'stock_quantity' => 100,
            'base_price' => 10.00
        ]);

        // 2. Add multiple items to cart session manually to simulate a full cart
        $cart = [];
        foreach ($products as $product) {
            $cart[$product->id] = [
                'slug' => $product->slug,
                'quantity' => 1,
                'accessories' => []
            ];
        }
        session(['shopping_cart' => $cart]);

        // 3. Measure queries when loading cart
        DB::enableQueryLog();
        
        $response = $this->get(route('cart.index'));
        
        $queries = DB::getQueryLog();
        $queryCount = count($queries);

        // 4. Assertions
        $response->assertStatus(200);
        
        // With N+1, we would expect at least 10 queries (1 per product) + extra.
        // With optimization, we expect significantly fewer queries to fetch products (ideally 1).
        // Allowing some overhead for session, popular products query, etc., but definitely < 10 for products.
        // The popular products query adds 1.
        // The coupon check adds queries if present (not here).
        // Total should be low.
        
        // Adjust this threshold based on what we find, but 5 is a safe "optimized" upper bound for this specific part
        // (1 for products in cart, 1 for popular products, maybe 1-2 system queries).
        // If it was N+1, it would be > 10.
        $this->assertLessThan(10, $queryCount, "Too many queries executed! Potential N+1 problem.");
        
        // Ensure products are actually visible
        foreach ($products as $product) {
            $response->assertSee($product->name);
        }
    }
}
