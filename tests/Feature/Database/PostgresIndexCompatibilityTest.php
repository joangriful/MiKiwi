<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PostgresIndexCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_postgres_indexes_exist(): void
    {
        foreach ($this->expectedIndexes() as [$table, $index]) {
            $this->assertTrue(
                Schema::hasIndex($table, $index),
                "{$table} should have index {$index}."
            );
        }
    }

    private function expectedIndexes(): array
    {
        return [
            ['products', 'products_slug_unique'],
            ['products', 'idx_products_category_id'],
            ['products', 'idx_products_is_active'],
            ['products', 'idx_products_created_at'],
            ['categories', 'categories_slug_unique'],
            ['categories', 'idx_categories_parent_id'],
            ['orders', 'idx_orders_user_id'],
            ['orders', 'orders_order_number_unique'],
            ['orders', 'idx_orders_created_at'],
            ['pickup_points', 'idx_pickup_points_city'],
            ['pickup_points', 'idx_pickup_points_postal_code'],
        ];
    }
}
