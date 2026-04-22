<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Domain\Payments\Services\StripeService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentMethodControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_detach_payment_method_from_another_customer(): void
    {
        $user = User::factory()->create([
            'stripe_customer_id' => 'cus_owner',
        ]);

        $this->app->instance(StripeService::class, new class extends StripeService
        {
            public function __construct() {}

            public function detachPaymentMethodForCustomer(string $paymentMethodId, string $customerId): bool
            {
                return false;
            }
        });

        $response = $this->actingAs($user)->delete(route('payment-methods.destroy', ['id' => 'pm_other']));

        $response
            ->assertForbidden()
            ->assertJson(['error' => 'Unauthorized payment method access.']);
    }

    public function test_user_can_detach_their_own_payment_method(): void
    {
        $user = User::factory()->create([
            'stripe_customer_id' => 'cus_owner',
        ]);

        $paymentMethod = new class
        {
            public bool $detached = false;

            public function detach(): void
            {
                $this->detached = true;
            }
        };

        $this->app->instance(StripeService::class, new class($paymentMethod) extends StripeService
        {
            public function __construct(private object $paymentMethod) {}

            public function detachPaymentMethodForCustomer(string $paymentMethodId, string $customerId): bool
            {
                $this->paymentMethod->detach();

                return true;
            }
        });

        $response = $this->actingAs($user)->delete(route('payment-methods.destroy', ['id' => 'pm_own']));

        $response
            ->assertOk()
            ->assertJson(['success' => true]);

        $this->assertTrue($paymentMethod->detached);
    }
}
