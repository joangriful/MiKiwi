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
        Schema::create('product_image_zone', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('product_image_id')->constrained('product_image')->cascadeOnDelete();
            $table->string('zone_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_image_zone');
    }
};
