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
        if (!Schema::hasTable('doll_settings')) {
            Schema::create('doll_settings', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->json('value');
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('doll_part_positions')) {
            Schema::create('doll_part_positions', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('part_id');
                $table->string('category');
                $table->string('view'); // 'front' or 'back'
                $table->float('x')->default(0);
                $table->float('y')->default(0);
                $table->float('scale')->default(1);
                $table->timestamps();

                $table->unique(['part_id', 'category', 'view']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doll_part_positions');
        Schema::dropIfExists('doll_settings');
    }
};
