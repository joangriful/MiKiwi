<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_category_page_returns_only_active_in_stock_products(): void
    {
        $category = Category::factory()->root()->create([
            'name' => 'Pleasure',
            'slug' => 'pleasure',
            'is_active' => true,
        ]);

        $subCategory = Category::factory()->child($category)->create([
            'name' => 'External Pleasure',
            'slug' => 'external-pleasure',
            'is_active' => true,
        ]);

        $visibleProduct = Product::factory()->create([
            'category_id' => $subCategory->id,
            'slug' => 'visible-product',
            'is_active' => true,
            'stock_quantity' => 10,
            'product_type' => ProductType::Simple->value,
        ]);

        Product::factory()->create([
            'category_id' => $subCategory->id,
            'slug' => 'inactive-product',
            'is_active' => false,
            'stock_quantity' => 10,
            'product_type' => ProductType::Simple->value,
        ]);

        Product::factory()->create([
            'category_id' => $subCategory->id,
            'slug' => 'out-of-stock-product',
            'is_active' => true,
            'stock_quantity' => 0,
            'product_type' => ProductType::Simple->value,
        ]);

        $this->get(route('categories.show', $category->slug))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Catalog/Products')
                ->where('category.slug', 'pleasure')
                ->where('products.data.0.slug', $visibleProduct->slug)
                ->has('products.data', 1)
                ->has('categories.0.children', 1)
                ->where('pageTitle', 'Pleasure - MiKiwi')
            );
    }

    public function test_inactive_category_returns_not_found(): void
    {
        $category = Category::factory()->inactive()->create([
            'slug' => 'inactive-category',
        ]);

        $this->get(route('categories.show', $category->slug))
            ->assertNotFound();
    }
}
