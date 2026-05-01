<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Products\Services\ProductManagerService;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class ProductManagerControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_images_temp_returns_structured_error_without_internal_details(): void
    {
        $admin = User::factory()->create([
            'role' => UserRole::Admin->value,
        ]);

        $service = $this->createMock(ProductManagerService::class);
        $service->method('uploadImagesTemp')
            ->willThrowException(new \RuntimeException('Cloudinary timeout while uploading folder productos/test-secret'));

        $this->app->instance(ProductManagerService::class, $service);

        $response = $this->actingAs($admin)->post(route('products.upload-images'), [
            'images' => [UploadedFile::fake()->create('product.jpg', 128, 'image/jpeg')],
            'product_name' => 'Test Product',
        ]);

        $response
            ->assertStatus(500)
            ->assertJsonStructure(['success', 'code', 'message'])
            ->assertJson([
                'success' => false,
                'code' => 'product_temp_images_upload_failed',
                'message' => 'No pudimos subir las imágenes ahora mismo. Inténtalo de nuevo en unos minutos.',
            ]);

        $this->assertStringNotContainsString(
            'Cloudinary timeout while uploading folder productos/test-secret',
            (string) $response->json('message')
        );
    }
}
