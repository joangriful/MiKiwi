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
        Schema::table('order_item_accessory', function (Blueprint $table) {
            $table->string('category', 100)->nullable();
            $table->string('view', 50)->nullable();
            $table->json('visual_data_snapshot')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_item_accessory', function (Blueprint $table) {
            $table->dropColumn([
                'category',
                'view',
                'visual_data_snapshot',
            ]);
        });
    }
};
