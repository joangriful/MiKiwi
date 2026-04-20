<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('products') && ! Schema::hasColumn('products', 'hover_image_url')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('hover_image_url')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('products') && Schema::hasColumn('products', 'hover_image_url')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('hover_image_url');
            });
        }
    }
};
