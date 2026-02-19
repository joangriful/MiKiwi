<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index(['is_active', 'created_at'], 'products_active_created_idx');
            $table->index(['is_active', 'base_price'], 'products_active_price_idx');
            $table->index(['is_active', 'category_id'], 'products_active_category_idx');
            $table->index(['product_type', 'is_active'], 'products_type_active_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->index(['is_active', 'parent_id'], 'categories_active_parent_idx');
        });

        Schema::table('pickup_points', function (Blueprint $table) {
            $table->index(['is_active', 'city'], 'pickup_points_active_city_idx');
            $table->index(['is_active', 'postal_code'], 'pickup_points_active_postal_idx');
            $table->unique(['address', 'postal_code'], 'pickup_points_address_postal_unique');
        });

        Schema::table('hero_images', function (Blueprint $table) {
            $table->index('type', 'hero_images_type_idx');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_active_created_idx');
            $table->dropIndex('products_active_price_idx');
            $table->dropIndex('products_active_category_idx');
            $table->dropIndex('products_type_active_idx');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex('categories_active_parent_idx');
        });

        Schema::table('pickup_points', function (Blueprint $table) {
            $table->dropIndex('pickup_points_active_city_idx');
            $table->dropIndex('pickup_points_active_postal_idx');
            $table->dropUnique('pickup_points_address_postal_unique');
        });

        Schema::table('hero_images', function (Blueprint $table) {
            $table->dropIndex('hero_images_type_idx');
        });
    }
};
