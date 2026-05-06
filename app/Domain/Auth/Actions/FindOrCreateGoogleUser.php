<?php

declare(strict_types=1);

namespace App\Domain\Auth\Actions;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Contracts\User as SocialUser;

class FindOrCreateGoogleUser
{
    public function execute(SocialUser $googleUser): User
    {
        $email = $this->normalizeEmail($googleUser->getEmail());

        if ($email === null) {
            throw new GoogleAuthEmailMissingException('Google user email is required.');
        }

        $avatarUrl = $googleUser->getAvatar();
        $user = User::query()->withTrashed()->where('email', $email)->first();

        if ($user) {
            $user->forceFill(array_filter([
                'email_verified_at' => $user->email_verified_at ?: now(),
                'profile_photo_url' => $user->profile_photo_url ?: $avatarUrl,
            ], static fn (mixed $value): bool => $value !== null));

            if ($user->trashed()) {
                $user->restore();
            }

            if ($user->isDirty()) {
                $user->save();
            }

            return $user;
        }

        $displayName = $googleUser->getName() ?: $googleUser->getNickname() ?: 'Google User';

        return User::query()->create([
            'name' => $displayName,
            'email' => $email,
            'password' => Hash::make(Str::random(64)),
            'role' => UserRole::Customer->value,
            'is_active' => true,
            'email_verified_at' => now(),
            'profile_photo_url' => is_string($avatarUrl) && trim($avatarUrl) !== '' ? $avatarUrl : null,
        ]);
    }

    private function normalizeEmail(mixed $email): ?string
    {
        if (! is_string($email)) {
            return null;
        }

        $normalizedEmail = mb_strtolower(trim($email));

        return $normalizedEmail !== '' ? $normalizedEmail : null;
    }
}
