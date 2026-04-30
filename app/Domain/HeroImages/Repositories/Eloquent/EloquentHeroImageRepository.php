<?php

declare(strict_types=1);

namespace App\Domain\HeroImages\Repositories\Eloquent;

use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Models\HomeSectionImage;
use App\Models\ImageHome;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class EloquentHeroImageRepository implements HeroImageRepositoryInterface
{
    private const DEFAULT_SECTION_KEY = 'hero';

    public function getAllOrdered(): Collection
    {
        return $this->baseSectionedQuery()->get();
    }

    public function getActiveImages(): Collection
    {
        return $this->baseSectionedQuery()
            ->where('home_section_image.is_active', true)
            ->get();
    }

    public function createFromCloudinary(array $cloudinaryData, array $attributes = []): ImageHome
    {
        return DB::transaction(function () use ($cloudinaryData, $attributes) {
            $payload = array_merge([
                'public_id' => $cloudinaryData['public_id'],
                'url' => $cloudinaryData['secure_url'],
                'width' => $cloudinaryData['width'] ?? null,
                'height' => $cloudinaryData['height'] ?? null,
            ], $attributes);

            $image = ImageHome::create($payload);

            HomeSectionImage::create([
                'image_home_id' => $image->id,
                'section_key' => $this->resolveSectionKey($attributes),
                'sort_order' => $this->resolveNextSortOrder($attributes),
                'is_active' => (bool) ($attributes['is_active'] ?? true),
            ]);

            return $image->load('homeSectionImages');
        });
    }

    public function delete(string $id): bool
    {
        $image = ImageHome::find($id);

        if (! $image) {
            return false;
        }

        return $image->delete();
    }

    public function findById(string $id): ?ImageHome
    {
        return ImageHome::query()
            ->with('homeSectionImages')
            ->find($id);
    }

    public function updateOrder(array $orderedIds): void
    {
        foreach ($orderedIds as $index => $id) {
            HomeSectionImage::query()
                ->where('image_home_id', $id)
                ->update(['sort_order' => $index]);
        }
    }

    public function setActive(string $id, bool $active): ?ImageHome
    {
        $image = $this->findById($id);

        if (! $image) {
            return null;
        }

        HomeSectionImage::query()
            ->where('image_home_id', $id)
            ->update(['is_active' => $active]);

        return $image->fresh();
    }

    private function baseSectionedQuery()
    {
        return ImageHome::query()
            ->select('image_home.*')
            ->join('home_section_image', 'home_section_image.image_home_id', '=', 'image_home.id')
            ->with(['homeSectionImages' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->distinct()
            ->orderBy('home_section_image.sort_order', 'asc')
            ->orderBy('image_home.created_at', 'desc');
    }

    private function resolveSectionKey(array $attributes): string
    {
        return (string) ($attributes['section_key'] ?? $attributes['type'] ?? self::DEFAULT_SECTION_KEY);
    }

    private function resolveNextSortOrder(array $attributes): int
    {
        $sectionKey = $this->resolveSectionKey($attributes);

        $currentMax = HomeSectionImage::query()
            ->where('section_key', $sectionKey)
            ->max('sort_order');

        return $currentMax === null ? 0 : ((int) $currentMax + 1);
    }
}
