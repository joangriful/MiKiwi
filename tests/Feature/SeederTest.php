<?php

namespace Tests\Feature;

use App\Enums\ProductType;
use App\Models\Category;
use App\Models\ChatMessage;
use App\Models\ChatSession;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PickupPoint;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PrefabDollSeeder;
use Database\Seeders\ProductionDatabaseSeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use ReflectionClass;
use Tests\TestCase;

class SeederTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test que el DatabaseSeeder completo se ejecuta sin errores.
     */
    public function test_database_seeder_runs_successfully(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Verificar usuarios base
        $this->assertDatabaseHas('users', [
            'email' => 'admin@kinky-toys.com',
            'role' => 'admin',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'juan@test.com',
            'role' => 'customer',
        ]);

        // Verificar cantidad aproximada de usuarios (admin + juan + 20 random)
        $this->assertGreaterThanOrEqual(22, User::count());
    }

    /**
     * Test que las categorías se crean con jerarquía padre-hija correcta.
     */
    public function test_categories_are_seeded_correctly(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('category', ['slug' => 'estimulacion-externa']);
        $this->assertDatabaseHas('category', ['slug' => 'estimulacion-interna']);
        $this->assertDatabaseHas('category', ['slug' => 'ondas-de-presion']);

        $externa = Category::where('slug', 'estimulacion-externa')->first();
        $this->assertNotNull($externa);
        $this->assertNull($externa->parent_id);
        $this->assertDatabaseHas('category', [
            'slug' => 'ondas-de-presion',
            'parent_id' => $externa->getKey(),
        ]);
        $this->assertDatabaseMissing('category', ['slug' => 'para-ella']);
    }

    /**
     * Test que los productos se crean y relacionan correctamente.
     */
    public function test_products_are_seeded_with_relationships(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertGreaterThan(0, Product::count());

        $product = Product::query()
            ->with(['images', 'collections'])
            ->where('slug', 'satisfyer-pro')
            ->first();

        $this->assertNotNull($product);
        $this->assertCount(5, $product->images);
        $this->assertGreaterThanOrEqual(1, $product->collections->count());

        $this->assertSame(0, DB::table('doll_product_accessory')->count());
    }

    public function test_product_seeder_accepts_single_and_structured_image_payloads(): void
    {
        $category = Category::factory()->create();
        $product = Product::factory()->create([
            'category_id' => $category->getKey(),
        ]);

        $seeder = new ProductSeeder;
        $method = (new ReflectionClass($seeder))->getMethod('syncProductImages');
        $method->setAccessible(true);

        $method->invoke($seeder, $product, 'https://example.test/single.webp');
        $product->load('images');

        $this->assertSame(
            ['https://example.test/single.webp'],
            $product->images->sortBy('sort_order')->pluck('image_url')->values()->all()
        );

        $method->invoke($seeder, $product, [
            ['url' => 'https://example.test/url.webp'],
            ['image_url' => 'https://example.test/image-url.webp'],
            ['secure_url' => 'https://example.test/secure-url.webp'],
            ' https://example.test/plain.webp ',
            ['url' => ''],
        ]);
        $product->load('images');

        $this->assertSame(
            [
                'https://example.test/url.webp',
                'https://example.test/image-url.webp',
                'https://example.test/secure-url.webp',
                'https://example.test/plain.webp',
            ],
            $product->images->sortBy('sort_order')->pluck('image_url')->values()->all()
        );
    }

    public function test_prefab_doll_seeder_creates_ready_made_doll_products(): void
    {
        $this->seed(PrefabDollSeeder::class);

        $this->assertDatabaseHas('category', [
            'slug' => 'munecas',
            'is_active' => true,
        ]);

        foreach (['queen-doll', 'hat-doll', 'bikini-doll', 'witch-doll'] as $slug) {
            $this->assertDatabaseHas('product', [
                'slug' => $slug,
                'product_type' => ProductType::Doll->value,
                'is_active' => true,
                'stock_quantity' => 20,
            ]);

            $product = Product::query()->where('slug', $slug)->firstOrFail();

            $this->assertSame(1, $product->images()->count());
            $this->assertSame(
                '/images/mannequin-base-skin.png',
                $product->images()->firstOrFail()->image_url
            );
        }
    }

    /**
     * Test que las órdenes se crean con estados y totales válidos.
     */
    public function test_orders_are_seeded_with_valid_data(): void
    {
        $this->seed(DatabaseSeeder::class);

        $orders = Order::all();
        $this->assertNotEmpty($orders);

        foreach ($orders as $order) {
            // Verificar que tiene items
            $this->assertNotEmpty($order->items);

            // Verificar que el total es mayor a 0
            $this->assertGreaterThan(0, $order->total_amount);

            // Verificar que tiene usuario
            $this->assertNotNull($order->user);

            // Verificar direcciones relacionales
            $order->load('shippingAddress');
            $this->assertNotNull($order->shippingAddress);
            $this->assertEquals('España', $order->shippingAddress->country);
        }
    }

    /**
     * Test que las reviews se crean con distribución realista.
     */
    public function test_reviews_are_seeded_correctly(): void
    {
        $this->seed(DatabaseSeeder::class);

        $reviews = Review::all();
        $this->assertNotEmpty($reviews);

        // Verificar que hay reviews aprobadas
        $this->assertTrue($reviews->contains('is_approved', true));

        // Verificar ratings válidos (1-5)
        foreach ($reviews as $review) {
            $this->assertGreaterThanOrEqual(1, $review->rating);
            $this->assertLessThanOrEqual(5, $review->rating);
        }
    }

    public function test_database_seeder_is_idempotent_for_critical_catalog_data(): void
    {
        $this->seed(DatabaseSeeder::class);

        $firstRunCounts = $this->criticalSeederCounts();

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($firstRunCounts, $this->criticalSeederCounts());
    }

    public function test_production_database_seeder_excludes_demo_data(): void
    {
        $this->seed(ProductionDatabaseSeeder::class);

        $this->assertGreaterThan(0, Category::count());
        $this->assertGreaterThan(0, PickupPoint::count());
        $this->assertDatabaseHas('users', [
            'email' => 'admin@kinky-toys.com',
            'role' => 'admin',
        ]);
        $this->assertSame(count(ProductSeeder::productDefinitions()) + 4, Product::count());
        $this->assertSame(0, Order::count());
        $this->assertSame(0, Review::count());
        $this->assertSame(0, ChatSession::count());
        $this->assertSame(0, ChatMessage::count());
    }

    private function criticalSeederCounts(): array
    {
        return [
            'categories' => Category::count(),
            'products' => Product::count(),
            'doll_product_accessory' => DB::table('doll_product_accessory')->count(),
            'orders' => Order::count(),
            'order_items' => OrderItem::count(),
            'reviews' => Review::count(),
            'chat_sessions' => ChatSession::count(),
            'chat_messages' => ChatMessage::count(),
            'pickup_points' => PickupPoint::count(),
        ];
    }
}
