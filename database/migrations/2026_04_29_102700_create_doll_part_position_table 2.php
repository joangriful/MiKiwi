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
        Schema::create('doll_part_position', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('part_id');
            $table->string('category');
            $table->string('view');
            $table->float('x');
            $table->float('y');
            $table->float('scale');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doll_part_position');
    }
};
