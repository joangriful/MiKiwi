<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupon', function (Blueprint $table) {
            $table->decimal('minimum_amount', 10, 2)->nullable();
            $table->boolean('first_order_only')->default(false);
            $table->string('required_product_type', 50)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('coupon', function (Blueprint $table) {
            $table->dropColumn([
                'minimum_amount',
                'first_order_only',
                'required_product_type',
            ]);
        });
    }
};
