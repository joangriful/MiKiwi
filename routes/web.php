<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColeccionesController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
// 👇 IMPORTAMOS LOS CONTROLADORES DE LA TIENDA
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserAddressController;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $heroImages = \App\Models\HeroImage::orderBy('created_at', 'desc')->get();

    return Inertia::render('Home', [
        'heroImages' => $heroImages,
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
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

    // 📦 API de Puntos de Recogida
    Route::get('/api/pickup-points', [App\Http\Controllers\PickupPointController::class, 'index'])
        ->name('pickup-points.index');

    // 💳 Stripe Payment Intent
    Route::post('/api/payment-intent', [OrderController::class, 'createPaymentIntent'])
        ->name('payment-intent.create');
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

    // Perfil visual
    Route::get('/perfil', function () {
        return Inertia::render('perfil');
    })->name('perfil.view');

    // 📍 Gestión de Direcciones del Usuario
    Route::prefix('addresses')->name('addresses.')->group(function () {
        Route::get('/', [UserAddressController::class, 'index'])->name('index');
        Route::post('/', [UserAddressController::class, 'store'])->name('store');
        Route::put('/{address}', [UserAddressController::class, 'update'])->name('update');
        Route::delete('/{address}', [UserAddressController::class, 'destroy'])->name('destroy');
    });
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

        // Fetch categories for Products Manager
        $categories = \App\Models\Category::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $products = \App\Models\Product::with('category:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        \Illuminate\Support\Facades\Log::info('Admin Products Count: ' . $products->count());

        return Inertia::render('ComponentsManager', [
            'views' => $views,
            'defaultSettings' => $defaultSettings,
            'users' => $users,
            'heroImages' => $heroImages,
            'products' => $products,
        ]);
    })->name('components.manager');

    Route::post('/doll-settings', [App\Http\Controllers\DollSettingsController::class, 'saveSettings'])->name('doll.settings.save');
    Route::post('/users/{user}/toggle-role', [App\Http\Controllers\UserController::class, 'toggleAdmin'])->name('users.toggleRole');
    Route::post('/content/hero/upload', [App\Http\Controllers\ContentController::class, 'uploadHeroImages'])->name('content.hero.upload');
    Route::delete('/content/hero/{heroImage}', [App\Http\Controllers\ContentController::class, 'deleteHeroImage'])->name('content.hero.delete');

    // Product Management
    Route::post('/products/upload', [App\Http\Controllers\ProductManagerController::class, 'uploadProduct'])->name('products.upload');
    Route::put('/products/{product}', [App\Http\Controllers\ProductManagerController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [App\Http\Controllers\ProductManagerController::class, 'deleteProduct'])->name('products.delete');

    // Newsletter
    Route::post('/newsletter/subscribe', [App\Http\Controllers\NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
});

Route::get('/formulario-reclamaciones', function () {
    return Inertia::render('ClaimsForm');
})->name('claims.form');
Route::get('/politica-privacidad', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy.policy');

Route::get('/aviso-legal', function () {
    return Inertia::render('LegalNotice');
})->name('legal.notice');

Route::get('/mapa-del-sitio', function () {
    return Inertia::render('Sitemap');
})->name('sitemap');

Route::get('/sostenibilidad', function () {
    $heroImages = \App\Models\HeroImage::where('type', 'sustainability')
        ->orderBy('created_at', 'desc')
        ->get();
    return Inertia::render('Sustainability', [
        'heroImages' => $heroImages
    ]);
})->name('sustainability');

Route::get('/formulario-reclamaciones', function () {
    return Inertia::render('ClaimsForm');
})->name('claims.form');

Route::get('/politica-privacidad', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy.policy');

Route::prefix('configurador')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Configurador/Home');
    })->name('configurador.home');
    Route::get('/index', function () {
        return Inertia::render('Configurador/Index');
    })->name('configurador.index');
    Route::get('/collections', function () {
        return Inertia::render('Configurador/Collections');
    })->name('configurador.collections');
    Route::get('/quiz', function () {
        return Inertia::render('Configurador/Quiz');
    })->name('configurador.quiz');
    Route::get('/munecas', function () {
        return Inertia::render('DollConfigurator');
    })->name('configurador.dolls');
    Route::get('/cart', function () {
        return Inertia::render('Cart');
    })->name('cart.view');
});

Route::get('/doll_config_test', function () {
    $cacheDuration = app()->environment('local') ? 5 : 3600;
    $views = Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
        $service = new CloudinaryService;

        return $service->listDollParts();
    });
    $settingsController = new App\Http\Controllers\DollSettingsController;
    $defaultSettings = $settingsController->getSettings();

    return Inertia::render('DollConfigTest', [
        'views' => $views,
        'defaultSettings' => $defaultSettings,
    ]);
})->name('doll.config.test');

require __DIR__.'/auth.php';
