<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_favorite', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('product_id')->constrained('product')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'product_id'], 'product_favorite_user_product_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_favorite');
    }
};
