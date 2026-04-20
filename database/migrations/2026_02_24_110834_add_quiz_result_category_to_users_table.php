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
        if (Schema::hasTable('users') && ! Schema::hasColumn('users', 'quiz_result_category')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('quiz_result_category')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'quiz_result_category')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('quiz_result_category');
            });
        }
    }
};
