<?php

namespace App\Domain\Profile\Services;

use App\Domain\Media\Services\CloudinaryService;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class ProfileImageService
{
    private const PROFILE_PHOTOS_FOLDER = 'profile_photos';

    private const PROFILE_BANNERS_FOLDER = 'profile_banners';

    public function __construct(
        private readonly CloudinaryService $cloudinaryService,
    ) {}

    public function replaceProfileImage(User $user, UploadedFile $image): string
    {
        return $this->replaceImage(
            user: $user,
            image: $image,
            folder: self::PROFILE_PHOTOS_FOLDER,
            urlColumn: 'profile_photo_url',
            publicIdColumn: 'profile_photo_public_id',
        );
    }

    public function replaceBanner(User $user, UploadedFile $image): string
    {
        return $this->replaceImage(
            user: $user,
            image: $image,
            folder: self::PROFILE_BANNERS_FOLDER,
            urlColumn: 'banner_url',
            publicIdColumn: 'banner_public_id',
        );
    }

    private function replaceImage(
        User $user,
        UploadedFile $image,
        string $folder,
        string $urlColumn,
        string $publicIdColumn,
    ): string {
        $previousPublicId = $user->{$publicIdColumn};
        $cloudinaryResponse = $this->cloudinaryService->uploadImage($image, $folder);

        $user->update([
            $urlColumn => $cloudinaryResponse['secure_url'],
            $publicIdColumn => $cloudinaryResponse['public_id'],
        ]);

        $this->deletePreviousCloudinaryImage($previousPublicId);

        return $cloudinaryResponse['secure_url'];
    }

    private function deletePreviousCloudinaryImage(?string $publicId): void
    {
        if (! $publicId) {
            return;
        }

        try {
            $this->cloudinaryService->deleteImage($publicId);
        } catch (\Throwable $exception) {
            Log::warning('Previous profile asset could not be deleted from Cloudinary: '.$exception->getMessage(), [
                'public_id' => $publicId,
            ]);
        }
    }
}
