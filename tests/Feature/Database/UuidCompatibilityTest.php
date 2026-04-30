<?php

namespace Tests\Feature\Database;

use App\Enums\UserRole;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Models\Address;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class UuidCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_sensitive_models_and_relationships_use_uuid_values(): void
    {
        $user = $this->createUser();
        $product = $this->createProduct();
        $order = $this->createOrder($user);
        $orderItem = $this->createOrderItem($order, $product);
        $review = $this->createReview($user, $product);
        $chatSession = $this->createChatSession($user);
        $chatMessage = $this->createChatMessage($chatSession);
        $address = $this->createAddress($user);

        foreach ([$user, $product, $order, $review, $chatSession, $address] as $model) {
            $this->assertTrue(Str::isUuid($model->getKey()), $model::class.' should have a UUID primary key.');
        }

        $userId = (string) $user->getKey();
        $productId = (string) $product->getKey();
        $orderId = (string) $order->getKey();
        $chatSessionId = (string) $chatSession->getKey();

        $this->assertSame($userId, (string) $order->getAttribute('user_id'));
        $this->assertSame($orderId, (string) $orderItem->getAttribute('order_id'));
        $this->assertSame($productId, (string) $orderItem->getAttribute('product_id'));
        $this->assertSame($userId, (string) $review->getAttribute('user_id'));
        $this->assertSame($productId, (string) $review->getAttribute('product_id'));
        $this->assertSame($userId, (string) $chatSession->getAttribute('user_id'));
        $this->assertSame($chatSessionId, (string) $chatMessage->getAttribute('chat_session_id'));
        $this->assertSame($userId, (string) $address->getAttribute('user_id'));
    }

    public function test_sensitive_uuid_columns_are_not_integer_backed(): void
    {
        foreach ($this->uuidColumns() as [$table, $column]) {
            $metadata = collect(Schema::getColumns($table))->firstWhere('name', $column);
            $typeName = strtolower((string) ($metadata['type_name'] ?? $metadata['type'] ?? ''));

            $this->assertNotContains($typeName, ['int', 'integer', 'bigint', 'unsignedbigint'], "{$table}.{$column} should not be integer-backed.");
        }
    }

    public function test_route_model_binding_accepts_uuid_primary_keys(): void
    {
        $admin = $this->createAdmin();
        $user = $this->createUser([
            'role' => UserRole::Customer->value,
        ]);
        $order = $this->createOrder($user);
        $product = $this->createProduct([
            'name' => 'UUID Managed Product',
            'sku' => 'UUID-MANAGED-001',
        ]);

        $this->actingAs($user)
            ->get(route('orders.show', $order))
            ->assertOk();

        $this->actingAs($admin)
            ->put(route('products.update', $product), [
                'name' => 'UUID Managed Product Updated',
            ])
            ->assertRedirect();

        $this->assertSame('UUID Managed Product Updated', (string) $product->fresh()->getAttribute('name'));
    }

    private function uuidColumns(): array
    {
        return [
            ['users', 'id'],
            ['product', 'id'],
            ['orders', 'id'],
            ['orders', 'user_id'],
            ['order_item', 'id'],
            ['order_item', 'order_id'],
            ['order_item', 'product_id'],
            ['review', 'id'],
            ['review', 'user_id'],
            ['review', 'product_id'],
            ['chat_session', 'id'],
            ['chat_session', 'user_id'],
            ['chat_message', 'id'],
            ['chat_message', 'chat_session_id'],
            ['address', 'id'],
            ['address', 'user_id'],
        ];
    }

    private function createUser(array $attributes = []): User
    {
        $user = User::factory()->create($attributes);
        $this->assertInstanceOf(User::class, $user);

        return $user;
    }

    private function createAdmin(): User
    {
        $user = User::factory()->admin()->create();
        $this->assertInstanceOf(User::class, $user);

        return $user;
    }

    private function createProduct(array $attributes = []): Product
    {
        $product = Product::factory()->create($attributes);
        $this->assertInstanceOf(Product::class, $product);

        return $product;
    }

    private function createOrder(User $user): Order
    {
        $order = Order::factory()->for($user)->create();
        $this->assertInstanceOf(Order::class, $order);

        return $order;
    }

    private function createOrderItem(Order $order, Product $product): OrderItem
    {
        $orderItem = OrderItem::factory()->forOrder($order)->forProduct($product)->create();
        $this->assertInstanceOf(OrderItem::class, $orderItem);

        return $orderItem;
    }

    private function createReview(User $user, Product $product): Review
    {
        $review = Review::factory()->for($user)->for($product)->create();
        $this->assertInstanceOf(Review::class, $review);

        return $review;
    }

    private function createChatSession(User $user): ChatSession
    {
        $chatSession = ChatSession::factory()->forUser($user)->create();
        $this->assertInstanceOf(ChatSession::class, $chatSession);

        return $chatSession;
    }

    private function createChatMessage(ChatSession $chatSession): ChatMessage
    {
        $chatMessage = ChatMessage::factory()->forSession($chatSession)->create();
        $this->assertInstanceOf(ChatMessage::class, $chatMessage);

        return $chatMessage;
    }

    private function createAddress(User $user): Address
    {
        $address = Address::factory()->for($user)->create();
        $this->assertInstanceOf(Address::class, $address);

        return $address;
    }
}
