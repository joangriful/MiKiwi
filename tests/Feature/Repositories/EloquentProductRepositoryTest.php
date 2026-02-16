<?php

declare(strict_types=1);

namespace Tests\Feature\Repositories;

use App\Models\Product;
use App\Repositories\Eloquent\EloquentProductRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EloquentProductRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected EloquentProductRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new EloquentProductRepository;
    }

    public function test_can_get_active_product_by_slug(): void
    {
        $product = Product::factory()->create([
            'slug' => 'active-product',
            'is_active' => true,
        ]);

        $found = $this->repository->getActiveBySlug('active-product');

        $this->assertNotNull($found);
        $this->assertEquals($product->id, $found->id);
    }

    public function test_returns_null_for_inactive_product_by_slug(): void
    {
        Product::factory()->create([
            'slug' => 'inactive-product',
            'is_active' => false,
        ]);

        $found = $this->repository->getActiveBySlug('inactive-product');

        $this->assertNull($found);
    }

    public function test_can_get_all_active_paginated(): void
    {
        Product::factory()->count(15)->create([
            'is_active' => true,
            'stock_quantity' => 10,
        ]);

        $result = $this->repository->getAllActivePaginated(10);

        $this->assertCount(10, $result->items());
        $this->assertEquals(15, $result->total());
    }
}
