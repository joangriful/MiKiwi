<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('review', function (Blueprint $table) {
            $table->unique(['user_id', 'product_id'], 'review_user_product_unique');
            $table->index(['product_id', 'is_approved'], 'review_product_approved_index');
            $table->index('user_id', 'review_user_index');
        });
    }

    public function down(): void
    {
        Schema::table('review', function (Blueprint $table) {
            $table->dropUnique('review_user_product_unique');
            $table->dropIndex('review_product_approved_index');
            $table->dropIndex('review_user_index');
        });
    }
};
