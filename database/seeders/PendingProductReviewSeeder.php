<?php

namespace Database\Seeders;

use App\Domain\Reviews\Support\ReviewableProductTypes;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\UserRole;
use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PendingProductReviewSeeder extends Seeder
{
    private const REVIEWER_COUNT = 8;

    private const PRODUCT_COVERAGE_PERCENTAGE = 75;

    public function run(): void
    {
        $products = $this->reviewableProducts();

        if ($products->isEmpty()) {
            $this->command->warn('No hay productos reseñables. Ejecuta ProductSeeder primero.');

            return;
        }

        $reviewers = $this->reviewers();
        $productsToReview = $products->take($this->targetProductCount($products->count()))->values();

        $createdReviews = 0;

        DB::transaction(function () use ($productsToReview, $reviewers, &$createdReviews): void {
            $ordersByUserId = $reviewers
                ->mapWithKeys(fn (User $user): array => [$user->getKey() => $this->fakePaidOrderFor($user)]);

            foreach ($productsToReview as $index => $product) {
                /** @var User $reviewer */
                $reviewer = $reviewers[$index % $reviewers->count()];
                /** @var Order $order */
                $order = $ordersByUserId[$reviewer->getKey()];

                $this->fakePurchasedProduct($order, $product);
                $this->createPendingReview($reviewer, $product, $index);

                $createdReviews++;
            }

            $ordersByUserId->each(fn (Order $order): bool => $order->update([
                'total_amount' => $order->items()
                    ->get(['quantity', 'unit_price'])
                    ->sum(fn ($item): float => (int) $item->quantity * (float) $item->unit_price),
            ]));
        });

        $this->command->info("Reseñas pendientes creadas/actualizadas: {$createdReviews}");
        $this->command->info("Cobertura objetivo: {$productsToReview->count()} de {$products->count()} productos reseñables.");
    }

    /**
     * @return Collection<int, Product>
     */
    private function reviewableProducts(): Collection
    {
        return Product::query()
            ->whereIn('product_type', [
                ...ReviewableProductTypes::values(),
            ])
            ->orderBy('name')
            ->get();
    }

    /**
     * @return Collection<int, User>
     */
    private function reviewers(): Collection
    {
        return collect(range(1, self::REVIEWER_COUNT))
            ->map(fn (int $index): User => User::query()->updateOrCreate([
                'email' => sprintf('reviewer-%02d@mikiwi.test', $index),
            ], [
                'name' => $this->reviewerNames()[$index - 1],
                'username' => sprintf('reviewer_%02d', $index),
                'dni' => sprintf('9999999%02d', $index),
                'birth_date' => now()->subYears(25 + $index)->toDateString(),
                'password' => Hash::make('password'),
                'role' => UserRole::Customer->value,
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
    }

    private function fakePaidOrderFor(User $user): Order
    {
        $shippingAddress = $this->fakeAddressFor($user, 'shipping');
        $billingAddress = $this->fakeAddressFor($user, 'billing');

        return Order::query()->updateOrCreate([
            'order_number' => 'REVIEWS-'.strtoupper(strstr($user->email, '@', true)),
        ], [
            'user_id' => $user->getKey(),
            'shipping_address_id' => $shippingAddress->getKey(),
            'billing_address_id' => $billingAddress->getKey(),
            'status' => OrderStatus::Delivered->value,
            'payment_status' => PaymentStatus::Paid->value,
            'total_amount' => 0,
            'payment_method' => 'seeded_card',
            'notes' => 'Pedido falso generado para poder moderar reseñas pendientes.',
        ]);
    }

    private function fakeAddressFor(User $user, string $alias): Address
    {
        return Address::query()->firstOrCreate([
            'user_id' => $user->getKey(),
            'alias' => "review-{$alias}",
        ], [
            'full_name' => $user->name,
            'phone' => '600000000',
            'street_address' => 'Calle Semilla 1',
            'city' => 'Madrid',
            'postal_code' => '28001',
            'country' => 'España',
            'is_default' => false,
        ]);
    }

    private function fakePurchasedProduct(Order $order, Product $product): void
    {
        $order->items()->updateOrCreate([
            'product_id' => $product->getKey(),
        ], [
            'product_name_snapshot' => $product->name,
            'sku_snapshot' => $product->sku ?? 'SKU-SEED',
            'configuration_snapshot' => null,
            'quantity' => 1,
            'unit_price' => $product->base_price,
        ]);
    }

    private function createPendingReview(User $reviewer, Product $product, int $index): void
    {
        $rating = [5, 4, 5, 3, 4, 5, 4, 2][$index % self::REVIEWER_COUNT];

        Review::query()->updateOrCreate([
            'user_id' => $reviewer->getKey(),
            'product_id' => $product->getKey(),
        ], [
            'rating' => $rating,
            'comment' => $this->comments($rating)[$index % count($this->comments($rating))],
            'is_approved' => false,
        ]);
    }

    private function targetProductCount(int $productCount): int
    {
        return (int) ceil($productCount * self::PRODUCT_COVERAGE_PERCENTAGE / 100);
    }

    /**
     * @return array<int, string>
     */
    private function reviewerNames(): array
    {
        return [
            'Laura Martin',
            'Nerea Lopez',
            'Clara Suarez',
            'Paula Romero',
            'Marta Vidal',
            'Irene Castro',
            'Sofia Ortega',
            'Elena Navarro',
        ];
    }

    /**
     * @return array<int, string>
     */
    private function comments(int $rating): array
    {
        return match ($rating) {
            5 => [
                'Muy buena experiencia. El producto llegó bien presentado y cumple lo que promete.',
                'Me sorprendió para bien. La calidad se nota desde el primer uso.',
                'Compra recomendable. El acabado y el empaquetado están muy cuidados.',
            ],
            4 => [
                'Buen producto en general. Lo volvería a comprar aunque mejoraría algún detalle.',
                'Cumple bien su función y la relación calidad-precio es correcta.',
                'Producto sólido y cómodo. La entrega fue rápida.',
            ],
            3 => [
                'Está bien, aunque esperaba un poco más por el precio.',
                'Correcto para un uso puntual. Tiene margen de mejora.',
            ],
            default => [
                'No terminó de convencerme. La calidad es aceptable, pero esperaba más.',
                'Funciona, aunque no fue exactamente lo que buscaba.',
            ],
        };
    }
}
