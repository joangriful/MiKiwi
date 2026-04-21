<?php

namespace App\Domain\Dolls\Services;

use Illuminate\Support\Facades\File;

class LocalDollPartLibraryService
{
    private const ROOT_DIRECTORY = 'images/doll_parts_ps';

    public function listDollParts(): array
    {
        $rootPath = public_path(self::ROOT_DIRECTORY);

        if (! File::isDirectory($rootPath)) {
            return ['front' => [], 'back' => []];
        }

        $views = ['front' => [], 'back' => []];

        foreach (array_keys($views) as $view) {
            $viewPath = "{$rootPath}/{$view}";

            if (! File::isDirectory($viewPath)) {
                continue;
            }

            foreach (File::directories($viewPath) as $categoryPath) {
                $category = basename($categoryPath);
                $views[$view][$category] = $this->buildCategoryParts($view, $category, $categoryPath);
            }
        }

        return $views;
    }

    private function buildCategoryParts(string $view, string $category, string $categoryPath): array
    {
        $parts = [];
        $groupedLayers = [];

        foreach (File::files($categoryPath) as $file) {
            if (strtolower($file->getExtension()) !== 'png') {
                continue;
            }

            $parts[] = $this->makeSinglePart($category, $file->getPathname());
        }

        foreach (File::directories($categoryPath) as $groupPath) {
            $groupId = basename($groupPath);

            foreach (File::files($groupPath) as $file) {
                if (strtolower($file->getExtension()) !== 'png') {
                    continue;
                }

                $groupedLayers[$groupId][] = $this->makeLayer($category, $file->getPathname());
            }
        }

        foreach ($groupedLayers as $groupId => $layers) {
            usort($layers, fn (array $a, array $b): int => $a['zIndex'] <=> $b['zIndex']);

            $parts[] = [
                'id' => $groupId,
                'type' => 'group',
                'thumbnail' => $this->findThumbnail($layers),
                'layers' => $layers,
            ];
        }

        usort($parts, fn (array $a, array $b): int => strnatcasecmp($a['id'], $b['id']));

        return $parts;
    }

    private function makeSinglePart(string $category, string $filePath): array
    {
        $layer = $this->makeLayer($category, $filePath);
        $id = $this->extractPartId($filePath);

        return [
            'id' => $id,
            'type' => 'single',
            'thumbnail' => $layer['url'],
            'layers' => [$layer],
        ];
    }

    private function makeLayer(string $category, string $filePath): array
    {
        $name = pathinfo($filePath, PATHINFO_FILENAME);
        $lowerName = strtolower($name);
        $baseZIndex = $this->baseZIndex($category);
        $zIndexOffset = 0;
        $blendMode = 'normal';

        if (str_contains($lowerName, 'delineado')) {
            $zIndexOffset = 10;

            if (strtolower($category) === 'pechos') {
                $blendMode = 'multiply';
            }
        } elseif (str_contains($lowerName, 'blanco')) {
            $zIndexOffset = -10;
        }

        return [
            'url' => $this->toPublicUrl($filePath),
            'zIndex' => $baseZIndex + $zIndexOffset,
            'blendMode' => $blendMode,
            'name' => $name,
        ];
    }

    private function findThumbnail(array $layers): string
    {
        foreach ($layers as $layer) {
            if (str_contains(strtolower($layer['name']), 'delineado')) {
                return $layer['url'];
            }
        }

        return $layers[0]['url'] ?? '';
    }

    private function extractPartId(string $filePath): string
    {
        $originalName = pathinfo($filePath, PATHINFO_FILENAME);
        $nameParts = explode('_', $originalName, 2);

        if (is_numeric($nameParts[0]) && count($nameParts) > 1) {
            return $nameParts[1];
        }

        return $originalName;
    }

    private function baseZIndex(string $category): int
    {
        $categoryPriorities = [
            'cuerpo' => 100,
            'manchas' => 150,
            'vientre' => 200,
            'pechos' => 300,
            'ojos' => 500,
            'boca' => 500,
            'ropa' => 600,
        ];

        return $categoryPriorities[strtolower($category)] ?? 500;
    }

    private function toPublicUrl(string $filePath): string
    {
        $relativePath = str_replace(public_path(), '', $filePath);
        $relativePath = str_replace('\\', '/', $relativePath);

        return '/'.ltrim($relativePath, '/');
    }
}
