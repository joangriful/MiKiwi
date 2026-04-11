<?php

declare(strict_types=1);

namespace App\Domain\HeroImages\Repositories\Eloquent;

use App\Models\HeroImage;
use App\Domain\HeroImages\Repositories\Interfaces\HeroImageRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class EloquentHeroImageRepository implements HeroImageRepositoryInterface
{
    public function getAllOrdered(): Collection
    {
        return HeroImage::orderBy('order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActiveImages(): Collection
    {
        return HeroImage::where('is_active', true)
            ->orderBy('order', 'asc')
            ->get();
    }

    public function createFromCloudinary(array $cloudinaryData): HeroImage
    {
        return HeroImage::create([
            'public_id' => $cloudinaryData['public_id'],
            'url' => $cloudinaryData['secure_url'],
            'width' => $cloudinaryData['width'] ?? null,
            'height' => $cloudinaryData['height'] ?? null,
            'is_active' => true,
        ]);
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
        foreach ($orderedIds as $index => $id) {
            HeroImage::where('id', $id)->update(['order' => $index]);
        }
    }

    public function setActive(string $id, bool $active): ?HeroImage
    {
        $image = $this->findById($id);

        if (! $image) {
            return null;
        }

        $image->update(['is_active' => $active]);

        return $image->fresh();
    }
}
