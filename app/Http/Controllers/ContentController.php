<?php

namespace App\Http\Controllers;

use App\Domain\HeroImages\Services\HeroImageManagementService;
use App\Models\HeroImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContentController extends Controller
{
    public function __construct(
        private readonly HeroImageManagementService $heroImageManagementService,
    ) {
    }

    public function uploadHeroImages(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:10240', // Explicitly allow GIF
            'type' => 'nullable|string|in:home,sustainability,dolls,calibration', 
        ]);

        try {
            $uploadedCount = $this->heroImageManagementService->uploadImages(
                $request->file('images'),
                $request->input('type', 'home')
            );

            return back()->with('success', $uploadedCount.' imagen(es) subida(s) correctamente');
        } catch (\Exception $e) {
            Log::error('Error uploading hero images: '.$e->getMessage());

            return back()->withErrors(['error' => 'Error al subir las imágenes']);
        }
    }

    public function deleteHeroImage(HeroImage $heroImage)
    {
        try {
            $this->heroImageManagementService->deleteImage($heroImage);

            return back()->with('success', 'Imagen eliminada correctamente');
        } catch (\Exception $e) {
            Log::error('Error deleting hero image: '.$e->getMessage());

            return back()->withErrors(['error' => 'Error al eliminar la imagen']);
        }
    }
}
