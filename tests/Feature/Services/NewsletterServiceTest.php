<?php

declare(strict_types=1);

namespace Tests\Feature\Services;

use App\Domain\Newsletters\Services\NewsletterService;
use App\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class NewsletterServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_subscribe_creates_or_updates_subscriber_without_external_api_key(): void
    {
        config(['services.resend.key' => null]);
        Http::fake();

        $service = app(NewsletterService::class);

        $message = $service->subscribe('subscriber@example.com', 'vulva');
        $updatedMessage = $service->subscribe('subscriber@example.com', 'pene');

        $this->assertSame('¡Gracias por suscribirte! Datos guardados correctamente.', $message);
        $this->assertSame('¡Gracias por suscribirte! Datos guardados correctamente.', $updatedMessage);
        $this->assertSame(1, Subscriber::query()->where('email', 'subscriber@example.com')->count());
        $this->assertDatabaseHas('subscribers', [
            'email' => 'subscriber@example.com',
            'gender' => 'pene',
        ]);

        Http::assertNothingSent();
    }

    public function test_subscribe_sends_welcome_email_when_api_key_exists(): void
    {
        config(['services.resend.key' => 'test-resend-key']);
        Http::fake([
            'api.resend.com/emails' => Http::response(['id' => 'email-id'], 200),
        ]);

        app(NewsletterService::class)->subscribe('subscriber@example.com', 'vulva');

        Http::assertSent(fn ($request): bool => $request->url() === 'https://api.resend.com/emails'
            && $request->hasHeader('Authorization', 'Bearer test-resend-key')
            && $request['to'] === ['subscriber@example.com']
            && $request['subject'] === '¡Bienvenidx a MiKiwi! Tu regalo te espera 🎁');
    }
}
