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
        Schema::create('doll_product_accessory', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('doll_product_id')->constrained('product')->cascadeOnDelete();
            $table->foreignUuid('accessory_product_id')->constrained('product')->cascadeOnDelete();
            $table->boolean('is_mandatory')->default(false);
            $table->string('group_name')->nullable();
            $table->timestamps();

            $table->unique(['doll_product_id', 'accessory_product_id'], 'doll_product_accessory_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doll_product_accessory');
    }
};
