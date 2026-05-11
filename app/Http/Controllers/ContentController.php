<?php

namespace App\Http\Controllers;

use App\Domain\HeroImages\Services\HeroImageManagementService;
use App\Models\ImageHome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ContentController extends Controller
{
    public function __construct(
        private readonly HeroImageManagementService $heroImageManagementService,
    ) {}

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

            return back()->withErrors(['error' => 'No pudimos subir las imágenes ahora mismo. Inténtalo de nuevo en unos minutos.']);
        }
    }

    public function deleteHeroImage(ImageHome $heroImage)
    {
        try {
            $this->heroImageManagementService->deleteImage($heroImage);

            return back()->with('success', 'Imagen eliminada correctamente');
        } catch (\Exception $e) {
            Log::error('Error deleting hero image: '.$e->getMessage());

            return back()->withErrors(['error' => 'No pudimos eliminar la imagen. Inténtalo de nuevo en unos minutos.']);
        }
    }
}
