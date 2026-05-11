<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->removeDuplicateReviews();

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

    private function removeDuplicateReviews(): void
    {
        DB::table('review')
            ->select(['user_id', 'product_id'])
            ->groupBy('user_id', 'product_id')
            ->havingRaw('COUNT(*) > ?', [1])
            ->orderBy('user_id')
            ->orderBy('product_id')
            ->each(function (object $duplicateGroup): void {
                $reviewIds = DB::table('review')
                    ->where('user_id', $duplicateGroup->user_id)
                    ->where('product_id', $duplicateGroup->product_id)
                    ->orderByDesc('is_approved')
                    ->orderByDesc('created_at')
                    ->pluck('id')
                    ->all();

                $reviewIdsToDelete = array_slice($reviewIds, 1);

                if ($reviewIdsToDelete === []) {
                    return;
                }

                DB::table('review')
                    ->whereIn('id', $reviewIdsToDelete)
                    ->delete();
            });
    }
};
