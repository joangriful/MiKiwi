<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('coupons')->insert([
            'code' => 'PROMO100',
            'type' => 'percent',
            'value' => 100.00,
            'is_active' => true,
            'expires_at' => Carbon::now()->addYear(), // Valid for 1 year
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('coupons')->where('code', 'PROMO100')->delete();
    }
};
