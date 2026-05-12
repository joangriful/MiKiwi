<?php

declare(strict_types=1);

namespace Tests\Feature\Actions;

use App\Domain\Orders\Actions\ResolveOrderPaymentStatus;
use App\Domain\Payments\Services\StripeService;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResolveOrderPaymentStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_pending_without_payment_intent(): void
    {
        $this->assertSame(
            PaymentStatus::Pending->value,
            app(ResolveOrderPaymentStatus::class)->execute(null)
        );
    }

    public function test_returns_paid_when_stripe_intent_succeeded(): void
    {
        $this->app->instance(StripeService::class, new class extends StripeService
        {
            public function __construct() {}

            public function getPaymentIntent($id): object
            {
                return (object) ['status' => 'succeeded'];
            }
        });

        $this->assertSame(
            PaymentStatus::Paid->value,
            app(ResolveOrderPaymentStatus::class)->execute('pi_succeeded')
        );
    }

    public function test_returns_pending_when_stripe_lookup_fails(): void
    {
        $this->app->instance(StripeService::class, new class extends StripeService
        {
            public function __construct() {}

            public function getPaymentIntent($id): object
            {
                throw new \RuntimeException('Stripe unavailable.');
            }
        });

        $this->assertSame(
            PaymentStatus::Pending->value,
            app(ResolveOrderPaymentStatus::class)->execute('pi_failed_lookup')
        );
    }
}
