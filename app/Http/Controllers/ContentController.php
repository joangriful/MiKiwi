<?php

namespace App\Http\Controllers;

use App\Models\HeroImage;
use App\Domain\Media\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContentController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function uploadHeroImages(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Explicitly allow GIF
            'type' => 'nullable|string|in:home,sustainability,dolls,calibration', 
        ]);

        try {
            $uploadedImages = [];
            $type = $request->input('type', 'home');
            
            // Map the type to the requested Cloudinary folder
            $folderMap = [
                'home' => 'hero_images/home',
                'sustainability' => 'hero_images/sustainability',
                'dolls' => 'home/doll_home',
                'calibration' => 'home/calibracion'
            ];
            $cloudinaryFolder = $folderMap[$type] ?? 'hero_images/' . $type;

            foreach ($request->file('images') as $image) {
                // Upload to Cloudinary using mapped folder
                $cloudinaryResponse = $this->cloudinaryService->uploadImage(
                    $image,
                    $cloudinaryFolder
                );

                // Store in database
                $heroImage = HeroImage::create([
                    'public_id' => $cloudinaryResponse['public_id'],
                    'url' => $cloudinaryResponse['secure_url'],
                    'width' => $cloudinaryResponse['width'] ?? null,
                    'height' => $cloudinaryResponse['height'] ?? null,
                    'type' => $type,
                ]);

                $uploadedImages[] = $heroImage;
            }

            return back()->with('success', count($uploadedImages).' imagen(es) subida(s) correctamente');
        } catch (\Exception $e) {
            Log::error('Error uploading hero images: '.$e->getMessage());

            return back()->withErrors(['error' => 'Error al subir las imágenes']);
        }
    }

    public function deleteHeroImage(HeroImage $heroImage)
    {
        try {
            // Delete from Cloudinary
            $this->cloudinaryService->deleteImage($heroImage->public_id);

            // Delete from database
            $heroImage->delete();

            return back()->with('success', 'Imagen eliminada correctamente');
        } catch (\Exception $e) {
            Log::error('Error deleting hero image: '.$e->getMessage());

            return back()->withErrors(['error' => 'Error al eliminar la imagen']);
        }
    }
}
