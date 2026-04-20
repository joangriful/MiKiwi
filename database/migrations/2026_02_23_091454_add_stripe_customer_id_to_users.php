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
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'stripe_customer_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('stripe_customer_id')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'stripe_customer_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('stripe_customer_id');
            });
        }
    }
};
