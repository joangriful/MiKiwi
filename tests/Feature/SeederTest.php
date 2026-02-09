<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
     * Test que las categorías se crean con jerarquía correcta.
     */
    public function test_categories_are_seeded_correctly(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Verificar categorías raíz
        $this->assertDatabaseHas('categories', ['slug' => 'munecas-realistas', 'parent_id' => null]);
        $this->assertDatabaseHas('categories', ['slug' => 'juguetes-intimos', 'parent_id' => null]);

        // Verificar subcategorías y relación padre
        $munecas = Category::where('slug', 'munecas-realistas')->first();
        $this->assertNotNull($munecas);

        $this->assertDatabaseHas('categories', [
            'slug' => 'munecas-premium',
            'parent_id' => $munecas->id,
        ]);
    }

    /**
     * Test que los productos se crean y relacionan correctamente.
     */
    public function test_products_are_seeded_with_relationships(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Verificar producto específico
        $elsa = Product::where('slug', 'muneca-elsa-premium')->first();
        $this->assertNotNull($elsa);
        $this->assertEquals('configurable', $elsa->product_type);

        // Verificar que tiene accesorios (ojos, pelucas) a través de tabla pivote
        // Nota: Asumiendo que la relación se llama 'accessories' en el modelo Product
        // Si no existe la relación en el modelo, verificamos en base de datos directamente
        $this->assertDatabaseHas('product_accessories', [
            'parent_product_id' => $elsa->id,
        ]);

        // Verificar cantidad de productos
        // 11 manuales + 7 generados = 18 productos mínimo
        $this->assertGreaterThanOrEqual(18, Product::count());
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

            // Verificar snapshot de dirección
            $this->assertIsArray($order->shipping_address_snapshot);
            $this->assertArrayHasKey('country', $order->shipping_address_snapshot);
            $this->assertEquals('España', $order->shipping_address_snapshot['country']);
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
}
