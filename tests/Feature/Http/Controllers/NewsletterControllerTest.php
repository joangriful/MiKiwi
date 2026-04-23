<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Newsletters\Services\NewsletterService;
use App\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsletterControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_subscribe_to_newsletter(): void
    {
        config(['services.resend.key' => null]);
        Http::fake();

        $this->from('/')
            ->post(route('newsletter.subscribe'), [
                'email' => 'guest@example.com',
                'gender' => 'vulva',
            ])
            ->assertRedirect('/')
            ->assertSessionHas('success', '¡Gracias por suscribirte! Datos guardados correctamente.');

        $this->assertDatabaseHas('subscribers', [
            'email' => 'guest@example.com',
            'gender' => 'vulva',
        ]);
    }

    public function test_invalid_newsletter_email_returns_newsletter_error(): void
    {
        $this->from('/')
            ->post(route('newsletter.subscribe'), [
                'email' => 'not-an-email',
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors(['newsletter']);

        $this->assertSame(0, Subscriber::query()->count());
    }

    public function test_newsletter_service_failure_returns_human_error_message(): void
    {
        $service = $this->createMock(NewsletterService::class);
        $service->method('subscribe')
            ->willThrowException(new \RuntimeException('Resend API timeout with internal token data'));

        $this->app->instance(NewsletterService::class, $service);

        $this->from('/')
            ->post(route('newsletter.subscribe'), [
                'email' => 'guest@example.com',
                'gender' => 'vulva',
            ])
            ->assertRedirect('/')
            ->assertSessionHasErrors([
                'newsletter' => 'No pudimos completar tu suscripción ahora mismo. Inténtalo de nuevo en unos minutos.',
            ]);

        $this->assertSame(0, Subscriber::query()->count());
    }
}
