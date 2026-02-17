<?php

namespace App\Services;

use Cloudinary\Api\Search\SearchApi;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    public function __construct()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key' => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET'),
            ],
            'url' => [
                'secure' => true,
            ],
        ]);
    }

    public function listDollParts()
    {
        $search = new SearchApi;
        $views = ['front' => [], 'back' => []];

        try {
            // Fetch ALL assets in doll_parts_ps folder and subfolders
            // Limit to 500 for now, consider pagination if needed
            $result = $search->expression('folder:doll_parts_ps/*')
                ->maxResults(500)
                ->sortBy('public_id', 'asc') // Sort to keep order consistent
                ->execute();

            $tempGroups = []; // To aggregate layers for groups

            foreach ($result['resources'] as $resource) {
                // Determine folder structure from 'asset_folder' or 'folder'
                // SearchApi returns 'folder' or 'asset_folder'.
                // Debug output showed 'asset_folder' (e.g., "doll_parts_ps/front/vello")

                $folderPath = $resource['asset_folder'] ?? ($resource['folder'] ?? '');

                // Remove root prefix "doll_parts_ps/"
                $relativePath = str_replace('doll_parts_ps/', '', $folderPath);
                $pathParts = explode('/', $relativePath);

                // Expected: [view, category, ?group]
                // e.g. ["front", "vello"] -> count 2
                // e.g. ["front", "pechos", "fancy_shirt"] -> count 3

                if (count($pathParts) < 2) {
                    continue;
                }

                $view = $pathParts[0];
                $category = $pathParts[1];

                if (! in_array($view, ['front', 'back'])) {
                    continue;
                }

                // Parse filename to remove Cloudinary random suffix
                // e.g. "vello3_u6z7kf" -> "vello3"
                // e.g. "no_abs_z5jdtw" -> "no_abs"
                // Pattern: underscore followed by 6 alphanumeric characters at the end
                $filename = $resource['filename'];
                $originalName = preg_replace('/_[a-z0-9]{6}$/', '', $filename);

                $url = $resource['secure_url'];

                // Category Priorities (Same as web.php)
                $categoryPriorities = [
                    'cuerpo' => 100,
                    'manchas' => 150,
                    'vientre' => 200,
                    'pechos' => 300,
                    'ojos' => 500,
                    'boca' => 500,
                    'ropa' => 600,
                ];
                $baseZIndex = $categoryPriorities[strtolower($category)] ?? 500;

                if (count($pathParts) === 2) {
                    // --- SINGLE ITEM (in Category folder) ---
                    // Or Loose file in View folder? (pathParts count 1).
                    // Wait, if "doll_parts_ps/front", relative is "front". pathParts=["front"]. count 1.
                    // Our check `count < 2` skips root files (like `_0001_fat`).
                    // Local logic IGNORED root files too (only scanned directories).
                    // So we consistent.

                    // Name/ID logic on originalName
                    $nameParts = explode('_', $originalName, 2);
                    $zIndex = $baseZIndex + 5;
                    $name = $nameParts[0];

                    if (is_numeric($nameParts[0]) && count($nameParts) > 1) {
                        $zIndex = $baseZIndex + (int) $nameParts[0];
                        $name = $nameParts[1];
                    } else {
                        // Default zIndex, name is full string
                        $name = $originalName;
                    }

                    $partId = $name;

                    if (! isset($views[$view][$category])) {
                        $views[$view][$category] = [];
                    }

                    // Check duplicate ID? (Assume unique for now or append)
                    $views[$view][$category][] = [
                        'id' => $partId,
                        'type' => 'single',
                        'thumbnail' => $url,
                        'layers' => [[
                            'url' => $url,
                            'zIndex' => $zIndex,
                            'name' => $originalName,
                        ]],
                    ];

                } elseif (count($pathParts) === 3) {
                    // --- GROUP ITEM (Subfolder) ---
                    $groupName = $pathParts[2];
                    $key = "{$view}|{$category}|{$groupName}";

                    if (! isset($tempGroups[$key])) {
                        $tempGroups[$key] = [
                            'view' => $view,
                            'category' => $category,
                            'id' => $groupName,
                            'layers' => [],
                        ];
                    }

                    // Logic for sub-files
                    $zIndexOffset = 0;
                    $blendMode = 'normal';
                    $lowerName = strtolower($originalName);

                    if (str_contains($lowerName, 'delineado')) {
                        $zIndexOffset = 10;
                        if (strtolower($category) === 'pechos') {
                            $blendMode = 'multiply';
                        }
                    } elseif (str_contains($lowerName, 'blanco')) {
                        $zIndexOffset = -10;
                    }

                    // Check duplicate layer name in group?
                    $tempGroups[$key]['layers'][] = [
                        'url' => $url,
                        'zIndex' => $baseZIndex + $zIndexOffset,
                        'blendMode' => $blendMode,
                        'name' => $originalName,
                        'is_delineado' => str_contains($lowerName, 'delineado'), // helper
                    ];
                }
            }

            // Process Groups
            foreach ($tempGroups as $group) {
                $layers = $group['layers'];
                // Sort layers
                usort($layers, fn ($a, $b) => $a['zIndex'] <=> $b['zIndex']);

                // Determine thumbnail
                $thumbnail = $layers[0]['url'];
                foreach ($layers as $l) {
                    if ($l['is_delineado'] ?? false) {
                        $thumbnail = $l['url'];
                        break;
                    }
                }

                $cleanLayers = array_map(function ($l) {
                    unset($l['is_delineado']);

                    return $l;
                }, $layers);

                if (! isset($views[$group['view']][$group['category']])) {
                    $views[$group['view']][$group['category']] = [];
                }

                $views[$group['view']][$group['category']][] = [
                    'id' => $group['id'],
                    'type' => 'group',
                    'thumbnail' => $thumbnail,
                    'layers' => $cleanLayers,
                ];
            }

            // Global Sort of Parts in Categories (Alphanumeric by ID/Name)
            foreach (['front', 'back'] as $v) {
                foreach ($views[$v] as $cat => &$parts) {
                    usort($parts, function ($a, $b) {
                        return strnatcasecmp($a['id'], $b['id']);
                    });
                }
            }

            return $views;

        } catch (\Exception $e) {
            \Log::error('Cloudinary fetch failed: '.$e->getMessage());

            return ['front' => [], 'back' => []];
        }
    }

    /**
     * Upload an image to Cloudinary
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $folder
     * @return array Cloudinary response with public_id, secure_url, width, height
     */
    public function uploadImage($file, $folder = 'hero_images')
    {
        try {
            $uploadApi = new UploadApi;
            $uploadResult = $uploadApi->upload($file->getRealPath(), [
                'folder' => $folder,
                'resource_type' => 'image',
                'transformation' => [
                    'quality' => 'auto',
                    'fetch_format' => 'auto',
                ],
            ]);

            return $uploadResult;
        } catch (\Exception $e) {
            \Log::error('Cloudinary upload error: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete an image from Cloudinary
     *
     * @param  string  $publicId
     * @return array Cloudinary response
     */
    public function deleteImage($publicId)
    {
        try {
            $uploadApi = new UploadApi;
            $result = $uploadApi->destroy($publicId, [
                'resource_type' => 'image',
            ]);

            return $result;
        } catch (\Exception $e) {
            \Log::error('Cloudinary delete error: '.$e->getMessage());
            throw $e;
        }
    }

    /**
     * List all images in the products folder
     * 
     * @param string $folder
     * @return array
     */
    public function listProductImages(string $folder = 'products')
    {
        $search = new SearchApi;
        try {
            $expression = "resource_type:image";
            if ($folder && $folder !== 'all' && $folder !== 'ROOT') {
                $expression .= " AND folder:$folder/*";
            }
            
            $result = $search->expression($expression)
                ->maxResults(500)
                ->execute();
            return $result['resources'] ?? [];
        } catch (\Exception $e) {
            \Log::error("Cloudinary product search failed: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Get the secure URL for a public ID if it's not already a full URL
     * 
     * @param string $idOrUrl
     * @return string
     */
    public function getImageUrl($idOrUrl)
    {
        if (filter_var($idOrUrl, FILTER_VALIDATE_URL)) {
            return $idOrUrl;
        }

        // Generate URL from Public ID
        $cloudName = env('CLOUDINARY_CLOUD_NAME', 'dqwwonjie'); // Use a realistic default or empty
        return "https://res.cloudinary.com/{$cloudName}/image/upload/f_auto,q_auto/" . $idOrUrl;
    }
}
