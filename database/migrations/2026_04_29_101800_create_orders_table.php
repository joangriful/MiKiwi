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
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('shipping_address_id')->constrained('address')->cascadeOnDelete();
            $table->foreignUuid('billing_address_id')->constrained('address')->cascadeOnDelete();
            $table->foreignUuid('coupon_id')->nullable()->constrained('coupon')->nullOnDelete();
            $table->string('order_number')->unique();
            $table->string('status', 50);
            $table->string('payment_status', 50);
            $table->decimal('total_amount', 10, 2);
            $table->string('payment_method', 50);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
