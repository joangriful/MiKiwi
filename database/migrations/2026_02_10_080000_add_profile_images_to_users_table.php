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
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo_url')->nullable()->after('email');
            $table->string('profile_photo_public_id')->nullable()->after('profile_photo_url');
            $table->string('banner_url')->nullable()->after('profile_photo_public_id');
            $table->string('banner_public_id')->nullable()->after('banner_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'profile_photo_url',
                'profile_photo_public_id',
                'banner_url',
                'banner_public_id'
            ]);
        });
    }
};
