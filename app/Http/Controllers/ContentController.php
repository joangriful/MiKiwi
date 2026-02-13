<?php

namespace App\Http\Controllers;

use App\Models\HeroImage;
use App\Services\CloudinaryService;
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
            'images.*' => 'image|max:10240', // Max 10MB per image
        ]);

        try {
            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                // Upload to Cloudinary
                $cloudinaryResponse = $this->cloudinaryService->uploadImage(
                    $image,
                    'hero_images'
                );

                // Store in database
                $heroImage = HeroImage::create([
                    'public_id' => $cloudinaryResponse['public_id'],
                    'url' => $cloudinaryResponse['secure_url'],
                    'width' => $cloudinaryResponse['width'] ?? null,
                    'height' => $cloudinaryResponse['height'] ?? null,
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
