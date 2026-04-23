<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Media\Services\CloudinaryService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_image_upload_returns_structured_error_without_internal_details(): void
    {
        $user = User::factory()->create();

        $service = $this->createMock(CloudinaryService::class);
        $service->method('uploadImage')
            ->willThrowException(new \RuntimeException('Cloudinary profile upload failed with internal asset path'));

        $this->app->instance(CloudinaryService::class, $service);

        $response = $this->actingAs($user)->post(route('profile.image.update'), [
            'image' => UploadedFile::fake()->create('avatar.jpg', 128, 'image/jpeg'),
        ]);

        $response
            ->assertStatus(500)
            ->assertJsonStructure(['success', 'code', 'message'])
            ->assertJson([
                'success' => false,
                'code' => 'profile_image_upload_failed',
                'message' => 'No pudimos actualizar tu foto de perfil. Inténtalo de nuevo en unos minutos.',
            ]);

        $this->assertStringNotContainsString(
            'Cloudinary profile upload failed with internal asset path',
            (string) $response->json('message')
        );
    }

    public function test_banner_upload_returns_structured_error_without_internal_details(): void
    {
        $user = User::factory()->create();

        $service = $this->createMock(CloudinaryService::class);
        $service->method('uploadImage')
            ->willThrowException(new \RuntimeException('Cloudinary banner upload failed with internal asset path'));

        $this->app->instance(CloudinaryService::class, $service);

        $response = $this->actingAs($user)->post(route('profile.banner.update'), [
            'image' => UploadedFile::fake()->create('banner.jpg', 128, 'image/jpeg'),
        ]);

        $response
            ->assertStatus(500)
            ->assertJsonStructure(['success', 'code', 'message'])
            ->assertJson([
                'success' => false,
                'code' => 'profile_banner_upload_failed',
                'message' => 'No pudimos actualizar tu banner. Inténtalo de nuevo en unos minutos.',
            ]);

        $this->assertStringNotContainsString(
            'Cloudinary banner upload failed with internal asset path',
            (string) $response->json('message')
        );
    }

    public function test_quiz_result_is_saved_for_authenticated_user(): void
    {
        $user = User::factory()->create([
            'quiz_result_category' => null,
        ]);

        $this->actingAs($user)
            ->postJson(route('profile.quiz.save'), [
                'category' => 'Ondas de Presion',
            ])
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Resultado guardado correctamente.',
            ]);

        $this->assertSame('Ondas de Presion', $user->refresh()->quiz_result_category);
    }

    public function test_quiz_result_save_returns_validation_error_for_missing_category(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson(route('profile.quiz.save'), [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }
}
