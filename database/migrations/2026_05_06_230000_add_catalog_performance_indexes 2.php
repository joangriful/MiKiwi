<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product', function (Blueprint $table) {
            $table->index(
                ['product_type', 'is_active', 'deleted_at', 'created_at'],
                'product_catalog_visibility_created_idx'
            );

            $table->index(
                ['category_id', 'product_type', 'is_active', 'stock_quantity'],
                'product_category_visibility_stock_idx'
            );
        });

        Schema::table('product_image', function (Blueprint $table) {
            $table->index(['product_id', 'sort_order'], 'product_image_product_sort_idx');
        });

        Schema::table('category', function (Blueprint $table) {
            $table->index(['parent_id', 'is_active'], 'category_parent_active_idx');
        });
    }

    public function down(): void
    {
        Schema::table('category', function (Blueprint $table) {
            $table->dropIndex('category_parent_active_idx');
        });

        Schema::table('product_image', function (Blueprint $table) {
            $table->dropIndex('product_image_product_sort_idx');
        });

        Schema::table('product', function (Blueprint $table) {
            $table->dropIndex('product_category_visibility_stock_idx');
            $table->dropIndex('product_catalog_visibility_created_idx');
        });
    }
};
