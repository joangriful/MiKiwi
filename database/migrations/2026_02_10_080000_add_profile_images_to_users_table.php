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
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'profile_photo_url')) {
                    $table->string('profile_photo_url')->nullable();
                }
                if (! Schema::hasColumn('users', 'profile_photo_public_id')) {
                    $table->string('profile_photo_public_id')->nullable();
                }
                if (! Schema::hasColumn('users', 'banner_url')) {
                    $table->string('banner_url')->nullable();
                }
                if (! Schema::hasColumn('users', 'banner_public_id')) {
                    $table->string('banner_public_id')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                $columns = array_filter([
                    Schema::hasColumn('users', 'profile_photo_url') ? 'profile_photo_url' : null,
                    Schema::hasColumn('users', 'profile_photo_public_id') ? 'profile_photo_public_id' : null,
                    Schema::hasColumn('users', 'banner_url') ? 'banner_url' : null,
                    Schema::hasColumn('users', 'banner_public_id') ? 'banner_public_id' : null,
                ]);

                if ($columns !== []) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
