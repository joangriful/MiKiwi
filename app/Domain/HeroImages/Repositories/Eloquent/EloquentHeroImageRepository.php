<?php

declare(strict_types=1);

namespace App\Domain\HeroImages\Repositories\Eloquent;

use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Models\HeroImage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

class EloquentHeroImageRepository implements HeroImageRepositoryInterface
{
    public function getAllOrdered(): Collection
    {
        return $this->applyOrdering(HeroImage::query())->get();
    }

    public function getActiveImages(): Collection
    {
        $query = HeroImage::query();

        if ($this->hasColumn('is_active')) {
            $query->where('is_active', true);
        }

        return $this->applyOrdering($query)->get();
    }

    public function createFromCloudinary(array $cloudinaryData, array $attributes = []): HeroImage
    {
        $payload = array_merge([
            'public_id' => $cloudinaryData['public_id'],
            'url' => $cloudinaryData['secure_url'],
            'width' => $cloudinaryData['width'] ?? null,
            'height' => $cloudinaryData['height'] ?? null,
        ], $attributes);

        if ($this->hasColumn('is_active')) {
            $payload['is_active'] = $payload['is_active'] ?? true;
        }

        return HeroImage::create($payload);
    }

    public function delete(string $id): bool
    {
        $image = HeroImage::find($id);

        if (! $image) {
            return false;
        }

        return $image->delete();
    }

    public function findById(string $id): ?HeroImage
    {
        return HeroImage::find($id);
    }

    public function updateOrder(array $orderedIds): void
    {
        if (! $this->hasColumn('order')) {
            return;
        }

        foreach ($orderedIds as $index => $id) {
            HeroImage::where('id', $id)->update(['order' => $index]);
        }
    }

    public function setActive(string $id, bool $active): ?HeroImage
    {
        $image = $this->findById($id);

        if (! $image || ! $this->hasColumn('is_active')) {
            return null;
        }

        $image->update(['is_active' => $active]);

        return $image->fresh();
    }

    private function applyOrdering(Builder $query): Builder
    {
        if ($this->hasColumn('order')) {
            $query->orderBy('order', 'asc');
        }

        return $query->orderBy('created_at', 'desc');
    }

    private function hasColumn(string $column): bool
    {
        return Schema::hasColumn('hero_images', $column);
    }
}
