<?php

namespace App\Http\Controllers;

use App\Domain\Media\Services\CloudinaryService;
use App\Domain\Profile\Services\ProfilePageService;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    protected $cloudinaryService;

    public function __construct(
        CloudinaryService $cloudinaryService,
        private readonly ProfilePageService $profilePageService,
    ) {
        $this->cloudinaryService = $cloudinaryService;
    }
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function show(Request $request): Response
    {
        return Inertia::render('Profile/Profile', $this->profilePageService->getPageData($request->user()));
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update the user's profile image.
     */
    public function updateProfileImage(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:5120'], // 5MB max
        ]);

        try {
            $user = $request->user();

            // Delete old image from Cloudinary if exists
            if ($user->profile_photo_public_id) {
                $this->cloudinaryService->deleteImage($user->profile_photo_public_id);
            }

            // Upload new image to Cloudinary
            $cloudinaryResponse = $this->cloudinaryService->uploadImage(
                $request->file('image'),
                'profile_photos'
            );

            // Update user record
            $user->update([
                'profile_photo_url' => $cloudinaryResponse['secure_url'],
                'profile_photo_public_id' => $cloudinaryResponse['public_id'],
            ]);

            return response()->json([
                'success' => true,
                'profile_photo_url' => $cloudinaryResponse['secure_url'],
            ]);
        } catch (\Exception $e) {
            \Log::error('Profile image upload failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al subir la imagen. Por favor, inténtalo de nuevo.'
            ], 500);
        }
    }

    /**
     * Update the user's banner image.
     */
    public function updateBanner(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png', 'max:10240'], // 10MB max
        ]);

        try {
            $user = $request->user();

            // Delete old banner from Cloudinary if exists
            if ($user->banner_public_id) {
                $this->cloudinaryService->deleteImage($user->banner_public_id);
            }

            // Upload new banner to Cloudinary
            $cloudinaryResponse = $this->cloudinaryService->uploadImage(
                $request->file('image'),
                'profile_banners'
            );

            // Update user record
            $user->update([
                'banner_url' => $cloudinaryResponse['secure_url'],
                'banner_public_id' => $cloudinaryResponse['public_id'],
            ]);

            return response()->json([
                'success' => true,
                'banner_url' => $cloudinaryResponse['secure_url'],
            ]);
        } catch (\Exception $e) {
            \Log::error('Banner upload failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al subir el banner. Por favor, inténtalo de nuevo.'
            ], 500);
        }
    }

    /**
     * Save the user's quiz result.
     */
    public function saveQuizResult(Request $request)
    {
        $request->validate([
            'category' => ['required', 'string', 'max:255'],
        ]);

        try {
            $user = $request->user();
            $user->update([
                'quiz_result_category' => $request->category,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Resultado guardado correctamente.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Quiz result save failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el resultado.'
            ], 500);
        }
    }
}
