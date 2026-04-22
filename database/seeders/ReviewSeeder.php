<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * ReviewSeeder - Crea reseñas de productos con distribución realista
 *
 * Genera reviews con distribución de ratings realista (más 4-5 estrellas).
 * Cada producto recibe entre 0-10 reviews de diferentes usuarios.
 */
class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $customers = User::where('role', UserRole::Customer->value)->get();

        if ($products->isEmpty()) {
            $this->command->error('❌ No hay productos. Ejecuta ProductSeeder primero.');

            return;
        }

        if ($customers->isEmpty()) {
            $this->command->warn('⚠️  No hay clientes. Creando 5 clientes de prueba...');
            $customers = User::factory()->count(5)->create(['role' => UserRole::Customer->value]);
        }

        $totalReviews = 0;

        // Cada producto tiene entre 0-10 reviews
        foreach ($products as $product) {
            $reviewsCount = $this->getRandomReviewCount();

            for ($i = 0; $i < $reviewsCount; $i++) {
                // Seleccionar cliente aleatorio
                $customer = $customers->random();

                // Rating con distribución realista (más ratings altos)
                $rating = $this->getWeightedRating();

                // 70% de reviews tienen comentario
                $hasComment = rand(1, 100) <= 70;

                Review::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'rating' => $rating,
                    'comment' => $hasComment ? $this->getRealisticComment($rating) : null,
                    'is_approved' => rand(1, 100) <= 80, // 80% aprobadas
                ]);

                $totalReviews++;
            }
        }

        $this->command->info("✅ Reviews creadas: {$totalReviews} reseñas distribuidas en productos");
        $this->command->info('📊 Distribución: ~40% 5★, ~30% 4★, ~15% 3★, ~10% 2★, ~5% 1★');
    }

    /**
     * Cantidad aleatoria de reviews por producto
     * La mayoría tiene entre 2-5 reviews
     */
    private function getRandomReviewCount(): int
    {
        $rand = rand(1, 100);

        if ($rand <= 10) {
            return 0;
        }  // 10% sin reviews
        if ($rand <= 30) {
            return rand(1, 2);
        }  // 20% con 1-2 reviews
        if ($rand <= 70) {
            return rand(3, 5);
        }  // 40% con 3-5 reviews
        if ($rand <= 90) {
            return rand(6, 8);
        }  // 20% con 6-8 reviews

        return rand(9, 10);  // 10% con 9-10 reviews
    }

    /**
     * Rating con distribución realista (sesgo positivo)
     *
     * @return int Rating entre 1-5
     */
    private function getWeightedRating(): int
    {
        $rand = rand(1, 100);

        if ($rand <= 40) {
            return 5;
        }  // 40% → 5 estrellas
        if ($rand <= 70) {
            return 4;
        }  // 30% → 4 estrellas
        if ($rand <= 85) {
            return 3;
        }  // 15% → 3 estrellas
        if ($rand <= 95) {
            return 2;
        }  // 10% → 2 estrellas

        return 1;  // 5% → 1 estrella
    }

    /**
     * Generar comentario realista basado en el rating
     */
    private function getRealisticComment(int $rating): string
    {
        $comments = [
            5 => [
                'Excelente producto, superó mis expectativas. Totalmente recomendable.',
                'Calidad premium, muy satisfecho con la compra. Volveré a comprar.',
                'Justo lo que buscaba. Entrega rápida y producto perfecto.',
                'Increíble calidad-precio. Lo recomiendo 100%.',
                'Muy contento con la compra. Producto de primera calidad.',
            ],
            4 => [
                'Buen producto en general. Cumple con lo prometido.',
                'Muy buena calidad, aunque esperaba un poco más por el precio.',
                'Satisfecho con la compra. Buena relación calidad-precio.',
                'Producto correcto, llegó bien empaquetado. Recomendable.',
                'Buena compra, aunque el envío tardó más de lo esperado.',
            ],
            3 => [
                'Producto correcto, nada extraordinario.',
                'Cumple su función pero esperaba algo mejor.',
                'Está bien por el precio. No es lo mejor pero tampoco malo.',
                'Producto aceptable, tiene algunos detalles mejorables.',
                'Normal, ni bueno ni malo. Cumple lo básico.',
            ],
            2 => [
                'No es lo que esperaba. La calidad deja que desear.',
                'Producto mejorable. Esperaba más por este precio.',
                'Decepcionado con la compra. No lo recomendaría.',
                'Calidad por debajo de lo esperado. No repetiré.',
                'No estoy satisfecho con el producto.',
            ],
            1 => [
                'Muy decepcionado. Mala calidad y no cumple lo prometido.',
                'Producto defectuoso. Pésima experiencia de compra.',
                'No lo recomiendo en absoluto. Muy por debajo de las expectativas.',
                'Mala calidad. Quiero devolverlo.',
                'Terrible compra. No vale el precio que pagué.',
            ],
        ];

        return $comments[$rating][array_rand($comments[$rating])];
    }
}
