<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id')->nullable();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->foreign('parent_id')->references('id')->on('categories');
        });

        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->nullable()->constrained();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique()->nullable();
            $table->text('description')->nullable();
            $table->decimal('base_price', 10, 2);
            $table->boolean('is_active')->default(true);
            $table->integer('stock_quantity')->nullable();
            $table->enum('product_type', ['simple', 'configurable', 'component'])->default('simple');
            $table->boolean('is_adult_only')->default(true);

            $table->string('image_url')->nullable();
            $table->json('images')->nullable(); // CAMBIO: de jsonb a json

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('product_accessories', function (Blueprint $table) {
            // $table->uuid('id')->primary();
            $table->foreignUuid('parent_product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignUuid('accessory_product_id')->constrained('products')->cascadeOnDelete();
            $table->boolean('is_mandatory')->default(false);
            $table->string('group_name')->nullable();
            $table->timestamps();
            $table->unique(['parent_product_id', 'accessory_product_id'], 'prod_acc_unique'); // Nombre corto para índice
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_accessories');
    }
};
