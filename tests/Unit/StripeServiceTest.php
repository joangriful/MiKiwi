<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Domain\Payments\Services\StripeService;
use PHPUnit\Framework\TestCase;
use Stripe\PaymentIntent;

class StripeServiceTest extends TestCase
{
    public function test_create_payment_intent_adds_setup_future_usage_only_when_saving_card(): void
    {
        $service = new TestableStripeService;

        $service->createPaymentIntent(12.34, 'eur', ['source' => 'checkout'], 'cus_test', false);

        $this->assertSame([
            'amount' => 1234.0,
            'currency' => 'eur',
            'metadata' => ['source' => 'checkout'],
            'automatic_payment_methods' => ['enabled' => true],
            'customer' => 'cus_test',
        ], $service->lastPaymentIntentParams);

        $service->createPaymentIntent(12.34, 'eur', [], 'cus_test', true);

        $this->assertSame('off_session', $service->lastPaymentIntentParams['setup_future_usage']);
    }

    public function test_list_payment_methods_filters_duplicate_card_fingerprints(): void
    {
        $service = new TestableStripeService([
            self::paymentMethod('pm_first', 'fp_same'),
            self::paymentMethod('pm_duplicate', 'fp_same'),
            self::paymentMethod('pm_other', 'fp_other'),
            self::paymentMethod('pm_without_fingerprint', null),
        ]);

        $methods = $service->listPaymentMethods('cus_test');

        $this->assertSame([
            'customer' => 'cus_test',
            'type' => 'card',
        ], $service->lastPaymentMethodsParams);
        $this->assertSame(
            ['pm_first', 'pm_other', 'pm_without_fingerprint'],
            array_map(fn (object $method): string => $method->id, $methods->data),
        );
    }

    private static function paymentMethod(string $id, ?string $fingerprint): object
    {
        return (object) [
            'id' => $id,
            'card' => (object) ['fingerprint' => $fingerprint],
        ];
    }
}

class TestableStripeService extends StripeService
{
    /** @var array<string, mixed>|null */
    public ?array $lastPaymentIntentParams = null;

    /** @var array<string, mixed>|null */
    public ?array $lastPaymentMethodsParams = null;

    /**
     * @param  array<int, object>  $paymentMethods
     */
    public function __construct(private array $paymentMethods = []) {}

    protected function createStripePaymentIntent(array $params): PaymentIntent
    {
        $this->lastPaymentIntentParams = $params;

        return PaymentIntent::constructFrom(['client_secret' => 'pi_secret_test']);
    }

    protected function allStripePaymentMethods(array $params)
    {
        $this->lastPaymentMethodsParams = $params;

        return (object) ['data' => $this->paymentMethods];
    }
}
