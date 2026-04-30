<?php

declare(strict_types=1);

namespace App\Domain\HeroImages\Repositories\Eloquent;

use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use App\Models\ImageHome;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;

class EloquentHeroImageRepository implements HeroImageRepositoryInterface
{
    public function getAllOrdered(): Collection
    {
        return $this->applyOrdering(ImageHome::query())->get();
    }

    public function getActiveImages(): Collection
    {
        $query = ImageHome::query();

        if ($this->hasColumn('is_active')) {
            $query->where('is_active', true);
        }

        return $this->applyOrdering($query)->get();
    }

    public function createFromCloudinary(array $cloudinaryData, array $attributes = []): ImageHome
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

        return ImageHome::create($payload);
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
        return ImageHome::find($id);
    }

    public function updateOrder(array $orderedIds): void
    {
        if (! $this->hasColumn('order')) {
            return;
        }

        foreach ($orderedIds as $index => $id) {
            ImageHome::where('id', $id)->update(['order' => $index]);
        }
    }

    public function setActive(string $id, bool $active): ?ImageHome
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
        return Schema::hasColumn('image_home', $column);
    }
}
