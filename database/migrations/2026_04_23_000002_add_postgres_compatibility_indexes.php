<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->addIndexIfMissing('products', ['category_id'], 'idx_products_category_id');
        $this->addIndexIfMissing('products', ['is_active'], 'idx_products_is_active');
        $this->addIndexIfMissing('products', ['created_at'], 'idx_products_created_at');

        $this->addIndexIfMissing('categories', ['parent_id'], 'idx_categories_parent_id');

        $this->addIndexIfMissing('orders', ['user_id'], 'idx_orders_user_id');
        $this->addIndexIfMissing('orders', ['created_at'], 'idx_orders_created_at');

        $this->addIndexIfMissing('pickup_points', ['city'], 'idx_pickup_points_city');
        $this->addIndexIfMissing('pickup_points', ['postal_code'], 'idx_pickup_points_postal_code');
    }

    public function down(): void
    {
        $this->dropIndexIfExists('pickup_points', 'idx_pickup_points_postal_code');
        $this->dropIndexIfExists('pickup_points', 'idx_pickup_points_city');

        $this->dropIndexIfExists('orders', 'idx_orders_created_at');
        $this->dropIndexIfExists('orders', 'idx_orders_user_id');

        $this->dropIndexIfExists('categories', 'idx_categories_parent_id');

        $this->dropIndexIfExists('products', 'idx_products_created_at');
        $this->dropIndexIfExists('products', 'idx_products_is_active');
        $this->dropIndexIfExists('products', 'idx_products_category_id');
    }

    private function addIndexIfMissing(string $table, array $columns, string $indexName): void
    {
        if (! Schema::hasTable($table) || Schema::hasIndex($table, $indexName)) {
            return;
        }

        foreach ($columns as $column) {
            if (! Schema::hasColumn($table, $column)) {
                return;
            }
        }

        Schema::table($table, function (Blueprint $table) use ($columns, $indexName): void {
            $table->index($columns, $indexName);
        });
    }

    private function dropIndexIfExists(string $table, string $indexName): void
    {
        if (! Schema::hasTable($table) || ! Schema::hasIndex($table, $indexName)) {
            return;
        }

        Schema::table($table, function (Blueprint $table) use ($indexName): void {
            $table->dropIndex($indexName);
        });
    }
};
