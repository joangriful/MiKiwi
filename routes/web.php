<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColeccionesController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;

// 👇 IMPORTAMOS LOS CONTROLADORES DE LA TIENDA
use App\Http\Controllers\ProfileController;
use App\Domain\Media\Services\CloudinaryService;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/**
 * Helper function to recursively get all descendant category IDs
 */
if (! function_exists('getDescendantCategoryIds')) {
    function getDescendantCategoryIds($category) {
        $ids = collect([$category->id]);
        $children = \App\Models\Category::where('parent_id', $category->id)->get();
        foreach ($children as $child) {
            $ids = $ids->merge(getDescendantCategoryIds($child));
        }
        return $ids;
    }
}

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $heroImages = \App\Models\HeroImage::orderBy('created_at', 'desc')->get();

    // Fetch featured products with category details for the cards
    $featuredProducts = \App\Models\Product::with('category:id,name')
        ->where('is_featured', true)
        ->where('is_active', true)
        ->orderBy('created_at', 'desc')
        ->get();

    $homeCollectionImageModel = 'App\\Models\\HomeCollectionImage';
    $collectionImages = class_exists($homeCollectionImageModel)
        ? $homeCollectionImageModel::all()
        : collect();

    return Inertia::render('Home/Home', [
        'heroImages' => $heroImages,
        'featuredProducts' => $featuredProducts,
        'collectionImages' => $collectionImages,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Profile/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Tienda (Catálogo, Productos, Categorías)
|--------------------------------------------------------------------------
*/

// Catálogo Principal
Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
Route::redirect('/products', '/productos'); // Alias for english url
Route::get('/colecciones', [ColeccionesController::class, 'index'])->name('colecciones');

// Ver Producto Individual
Route::get('/producto/{product}', [ProductController::class, 'show'])->name('products.show');

// Ver Categoría Específica
Route::get('/categoria/{category}', [CategoryController::class, 'show'])->name('categories.show');

/*
|--------------------------------------------------------------------------
| Carrito de Compras
|--------------------------------------------------------------------------
*/
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('cart.index');
    Route::post('/add', [CartController::class, 'store'])->name('cart.add');
    Route::patch('/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/remove/{id}', [CartController::class, 'destroy'])->name('cart.remove');
    Route::post('/coupon', [App\Http\Controllers\CouponController::class, 'apply'])->name('cart.coupon.apply');
    Route::delete('/coupon', [App\Http\Controllers\CouponController::class, 'remove'])->name('cart.coupon.remove');
});

/*
|--------------------------------------------------------------------------
| Pedidos / Checkout
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Resumen antes de pagar
    Route::get('/checkout', [OrderController::class, 'create'])
        ->name('orders.create');

    // Procesar compra
    Route::post('/checkout', [OrderController::class, 'store'])
        ->name('orders.store');

    // Página de éxito
    Route::get('/orders/success', [OrderController::class, 'success'])
        ->name('orders.success');

    // Historial de pedidos del usuario
    Route::get('/orders', [OrderController::class, 'index'])
        ->name('orders.index');

    // Ver detalle de un pedido
    Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->name('orders.show');

    // Cancelar pedido
    Route::patch('/orders/{order}/cancel', [OrderController::class, 'cancel'])
        ->name('orders.cancel');

    // 📦 API de Puntos de Recogida
    Route::get('/api/pickup-points', [App\Http\Controllers\PickupPointController::class, 'index'])
        ->name('pickup-points.index');

    // 💳 Stripe Payment Intent
    Route::post('/api/payment-intent', [OrderController::class, 'createPaymentIntent'])
        ->name('payment-intent.create');

    // 💳 Gestión de Tarjetas Guardadas
    Route::prefix('api/payment-methods')->name('payment-methods.')->group(function () {
        Route::get('/', [App\Http\Controllers\PaymentMethodController::class, 'index'])->name('index');
        Route::post('/setup-intent', [App\Http\Controllers\PaymentMethodController::class, 'createSetupIntent'])->name('setup-intent');
        Route::delete('/{id}', [App\Http\Controllers\PaymentMethodController::class, 'destroy'])->name('destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Rutas de Usuario Autenticado
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Profile image and banner uploads
    Route::post('/profile/image', [ProfileController::class, 'updateProfileImage'])->name('profile.image.update');
    Route::post('/profile/banner', [ProfileController::class, 'updateBanner'])->name('profile.banner.update');
    Route::post('/profile/quiz-result', [ProfileController::class, 'saveQuizResult'])->name('profile.quiz.save');

    Route::get('/perfil', function () {
        $recommendedProducts = collect();
        /** @var User|null $user */
        $user = Auth::user();

        if ($user && $user->quiz_result_category) {
            $categoryName = trim($user->quiz_result_category);
            Log::info('Quiz Result Category to match:', ['category' => $categoryName]);

            // Mapeo entre Resultados del Quiz y las Categorías/Subcategorías reales de Productos.
            // ACTUALIZADO: Ahora usa las NUEVAS colecciones (para-ella, para-el, parejas, experiencias)
            // y sus subcategorías correspondientes
            $quizCategoryMap = [
                // PARA ELLA - Estimulación femenina
                'Succionadores' => 'para-ella',
                'Estimuladores de Punto G' => 'para-ella',
                'Vibradores Externos' => 'para-ella',
                'Varitas vibratorias' => 'para-ella',
                'Estimuladores de Pezones' => 'para-ella',
                'Estimulación Interna' => 'para-ella',
                'Dildos' => 'para-ella',
                'Vibradores Internos' => 'para-ella',
                'Arneses y Strapless' => 'para-ella',
                'Bienestar Íntimo' => 'para-ella',
                
                // PARA ÉL - Estimulación masculina
                'Masturbadores' => 'para-el',
                'Anillos Vibradores' => 'para-el',
                'Bombas de Vacío' => 'para-el',
                'Estimuladores de Próstata' => 'para-el',
                'Pene y Testículos' => 'para-el',
                
                // PAREJAS - Productos para compartir (todas las subcategorías excepto BDSM)
                'Sensaciones' => 'parejas',
                'Cosmética y Cuidado' => 'parejas',
                'Lubricantes' => 'parejas',
                'Cuidado del Cuerpo' => 'parejas',
                'Higiene' => 'parejas',
                'Estimulación Anal' => 'parejas',
                'Plugs Anales' => 'parejas',
                'Cuentas y Bolas Anales' => 'parejas',
                'Dilatadores y Kits de Inicio' => 'parejas',
                'Vibradores Anales' => 'parejas',
                
                // EXPERIENCIAS - BDSM y Fetiche
                'BDSM y Fetiche' => 'experiencias',
                'Cuero y Textil' => 'experiencias',
                'Impacto' => 'experiencias',
                'Restricción' => 'experiencias',
            ];

            // Resolvemos qué categoría colección buscar basados en el mapa
            $collectionSlug = $quizCategoryMap[$categoryName] ?? null;
            
            if ($collectionSlug) {
                Log::info('Collection slug to search:', ['slug' => $collectionSlug]);
                
                // Buscar la categoría colección
                $collection = \App\Models\Category::where('slug', $collectionSlug)->first();
                
                if ($collection) {
                    // Obtener todos los descendientes (hijos, nietos, etc.) de esta colección
                    $categoryIds = getDescendantCategoryIds($collection);
                    Log::info('Category IDs to search:', ['ids' => $categoryIds->toArray()]);
                    
                    if ($categoryIds->isNotEmpty()) {
                        // Fetch the products related to those categories
                        $products = \App\Models\Product::with('category:id,name')
                            ->whereIn('category_id', $categoryIds)
                            ->where('is_active', true)
                            ->where('stock_quantity', '>', 0)
                            ->inRandomOrder()
                            ->take(4)
                            ->get();

                        if ($products->isNotEmpty()) {
                            $recommendedProducts = $products;
                            Log::info('Found products via collection:', ['count' => $products->count()]);
                        } else {
                            Log::info('No products found for collection categories');
                        }
                    }
                } else {
                    Log::info('Collection not found:', ['slug' => $collectionSlug]);
                }
            } else {
                Log::info('No collection mapping found for quiz result:', ['category' => $categoryName]);
            }
        }

        // FALLBACK: Si no hay productos recomendados, mostrar los destacados
        if ($recommendedProducts->isEmpty()) {
            Log::info('No recommended products found, falling back to featured products');
            $recommendedProducts = \App\Models\Product::with('category:id,name')
                ->where('is_active', true)
                ->where('stock_quantity', '>', 0)
                ->where('is_featured', true)
                ->inRandomOrder()
                ->take(4)
                ->get();
                
            // Si aún no hay productos, mostrar los 4 más recientes
            if ($recommendedProducts->isEmpty()) {
                Log::info('No featured products, falling back to latest products');
                $recommendedProducts = \App\Models\Product::with('category:id,name')
                    ->where('is_active', true)
                    ->where('stock_quantity', '>', 0)
                    ->latest()
                    ->take(4)
                    ->get();
            }
        }

        return Inertia::render('Profile/perfil', [
            'recommendedProducts' => $recommendedProducts,
            'orders' => $user ? $user->orders()->with('items')->latest()->get() : collect(),
        ]);
    })->name('perfil.view');

    // 📍 Gestión de Direcciones del Usuario
});

/*
|--------------------------------------------------------------------------
| Configurador y Herramientas
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/components-manager', function () {
        $cacheDuration = app()->environment('local') ? 5 : 3600;

        $views = Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
            $service = new CloudinaryService;

            return $service->listDollParts();
        });

        $settingsController = new App\Http\Controllers\DollSettingsController;
        $defaultSettings = $settingsController->getSettings();
        $users = \App\Models\User::all(['id', 'name', 'email', 'username', 'role', 'created_at']);
        $heroImages = \App\Models\HeroImage::orderBy('created_at', 'desc')->get();

        // El panel admin debe poder asignar cualquier categoría disponible,
        // aunque alguna esté inactiva para storefront.
        $categories = \App\Models\Category::whereNull('parent_id')
            ->with([
                'children' => function ($q) {
                    $q->orderBy('name')->select(['id', 'parent_id', 'name']);
                },
            ])
            ->orderBy('name')
            ->get(['id', 'parent_id', 'name']);

        $products = \App\Models\Product::with('category:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        Log::info('Admin Products Count: ' . $products->count());

        $partPositions = $settingsController->getAllPartPositions();

        $homeCollectionImageModel = 'App\\Models\\HomeCollectionImage';
        $collectionImages = class_exists($homeCollectionImageModel)
            ? $homeCollectionImageModel::all()
            : collect();

        return Inertia::render('Admin/ComponentsManager', [
            'views' => $views,
            'defaultSettings' => $defaultSettings,
            'partPositions' => $partPositions,
            'users' => $users,
            'heroImages' => $heroImages,
            'products' => $products,
            'categories' => $categories,
            'collectionImages' => $collectionImages,
        ]);
    })->name('components.manager');

    Route::post('/doll-settings', [App\Http\Controllers\DollSettingsController::class, 'saveSettings'])->name('doll.settings.save');
    Route::get('/doll-settings/positions', [App\Http\Controllers\DollSettingsController::class, 'getPartPositions'])->name('doll.settings.positions');
    Route::post('/doll-settings/position', [App\Http\Controllers\DollSettingsController::class, 'savePartPosition'])->name('doll.settings.savePosition');
    Route::post('/users/{user}/toggle-role', [App\Http\Controllers\UserController::class, 'toggleAdmin'])->name('users.toggleRole');
    Route::post('/content/hero/upload', [App\Http\Controllers\ContentController::class, 'uploadHeroImages'])->name('content.hero.upload');
    Route::delete('/content/hero/{heroImage}', [App\Http\Controllers\ContentController::class, 'deleteHeroImage'])->name('content.hero.delete');
    Route::post('/content/collections/upload', [App\Http\Controllers\ContentController::class, 'uploadCollectionImage'])->name('content.collections.upload');

    // Product Management
    Route::get('/admin/products/cloudinary-images', [App\Http\Controllers\ProductManagerController::class, 'getProductImages'])->name('products.cloudinary-images');
    Route::post('/admin/products/link-folder', [App\Http\Controllers\ProductManagerController::class, 'linkCloudinaryFolder'])->name('products.link-folder');
    Route::post('/admin/products/upload-images', [App\Http\Controllers\ProductManagerController::class, 'uploadImagesTemp'])->name('products.upload-images');
    Route::post('/products/upload', [App\Http\Controllers\ProductManagerController::class, 'uploadProduct'])->name('products.upload');
    Route::put('/products/{product:id}', [App\Http\Controllers\ProductManagerController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product:id}', [App\Http\Controllers\ProductManagerController::class, 'deleteProduct'])->name('products.delete');

});

// Newsletter
Route::post('/newsletter/subscribe', [App\Http\Controllers\NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

Route::get('/formulario-reclamaciones', function () {
    return Inertia::render('Claims/ClaimsForm');
})->name('claims.form');
Route::get('/politica-privacidad', function () {
    return Inertia::render('Marketing/PrivacyPolicy');
})->name('privacy.policy');

Route::get('/aviso-legal', function () {
    return Inertia::render('Marketing/LegalNotice');
})->name('legal.notice');

Route::get('/mapa-del-sitio', function () {
    return Inertia::render('Marketing/Sitemap');
})->name('sitemap');

Route::get('/sostenibilidad', function () {
    $heroImages = \App\Models\HeroImage::where('type', 'sustainability')
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Marketing/Sustainability', [
        'heroImages' => $heroImages,
    ]);
})->name('sustainability');

Route::get('/nuestros-kiwis', function () {
    return Inertia::render('Marketing/NuestrosKiwis');
})->name('nuestros-kiwis');

Route::get('/packs-regalo', function () {
    return Inertia::render('Marketing/GiftPacks');
})->name('packs-regalo');

Route::get('/suscripciones', function () {
    return Inertia::render('Marketing/Subscriptions');
})->name('suscripciones');

Route::get('/ofertas', function () {
    return Inertia::render('Marketing/Offers');
})->name('ofertas');

Route::get('/compania', function () {
    return Inertia::render('Marketing/Company');
})->name('compania');

Route::get('/preguntas-frecuentes', function () {
    return Inertia::render('Marketing/FAQ');
})->name('faq');

Route::get('/contacto', function () {
    return Inertia::render('Marketing/Contact');
})->name('contacto');

Route::get('/sobre-nosotros', function () {
    return Inertia::render('Marketing/AboutUs');
})->name('about-us');

Route::get('/politica-cookies', function () {
    return Inertia::render('Marketing/CookiePolicy');
})->name('cookie.policy');

Route::get('/condiciones-contratacion', function () {
    return Inertia::render('Marketing/TermsOfContract');
})->name('terms.contract');

Route::get('/terminos-uso', function () {
    return Inertia::render('Marketing/TermsOfUse');
})->name('terms.use');

Route::prefix('configurador')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Configurator/Configurador/Index');
    })->name('configurador.home');
    Route::get('/index', function () {
        return Inertia::render('Configurator/Configurador/Index');
    })->name('configurador.index');
    Route::get('/collections', function () {
        return Inertia::render('Configurator/Configurador/Collections');
    })->name('configurador.collections');
    Route::get('/quiz', function () {
        return Inertia::render('Configurator/Configurador/Quiz');
    })->name('configurador.quiz');
    Route::get('/munecas', function () {
        return Inertia::render('Configurator/DollConfigurator');
    })->name('configurador.dolls');
    Route::get('/cart', function () {
        return Inertia::render('Checkout/Cart');
    })->name('cart.view');
    Route::post('/cart/buy-now', [App\Http\Controllers\CartController::class, 'buyNow'])->name('cart.buy-now');
});

Route::get('/doll_config_test', function () {
    $cacheDuration = app()->environment('local') ? 5 : 3600;
    $views = Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
        $service = new CloudinaryService;

        return $service->listDollParts();
    });
    $settingsController = new App\Http\Controllers\DollSettingsController;
    $defaultSettings = $settingsController->getSettings();
    $partPositions = $settingsController->getAllPartPositions();

    return Inertia::render('Configurator/DollConfigTest', [
        'views' => $views,
        'defaultSettings' => $defaultSettings,
        'partPositions' => $partPositions,
    ]);
})->name('doll.config.test');

require __DIR__ . '/auth.php';
