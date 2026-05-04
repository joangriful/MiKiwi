<?php

declare(strict_types=1);

namespace App\Domain\Products\Support;

final class ProductImageUrlNormalizer
{
    /**
     * @return array<int, string>
     */
    public static function normalize(mixed $imagePayload): array
    {
        if (is_string($imagePayload)) {
            $imagePayload = [$imagePayload];
        }

        if (! is_array($imagePayload)) {
            return [];
        }

        return collect($imagePayload)
            ->map(fn (mixed $image): ?string => self::resolveUrl($image))
            ->filter(fn (?string $imageUrl): bool => is_string($imageUrl) && trim($imageUrl) !== '')
            ->map(fn (string $imageUrl): string => trim($imageUrl))
            ->values()
            ->all();
    }

    private static function resolveUrl(mixed $image): ?string
    {
        if (is_string($image)) {
            return $image;
        }

        if (! is_array($image)) {
            return null;
        }

        foreach (['url', 'image_url', 'secure_url'] as $key) {
            if (isset($image[$key]) && is_string($image[$key])) {
                return $image[$key];
            }
        }

        return null;
    }
}
