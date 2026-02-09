<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use App\Services\CloudinaryService;
use Illuminate\Support\Facades\Cache;

// 👇 IMPORTAMOS LOS CONTROLADORES DE LA TIENDA
use App\Http\Controllers\ColeccionesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserAddressController;

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Tienda (Catálogo, Productos, Categorías)
|--------------------------------------------------------------------------
*/

// Catálogo Principal (Sustituye a la ruta estática anterior)
Route::get('/colecciones', [ColeccionesController::class, 'index'])->name('colecciones');

// Ver Producto Individual (Dinámico usando Slug)
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
    Route::delete('/remove/{id}', [CartController::class, 'destroy'])->name('cart.remove');
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

    // Perfil visual (si es diferente al de edición)
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

Route::get('/components-manager', function () {
    // Shared Cloudinary Cache Logic
    // In local, cache for 5 seconds to allow quick updates. In production, 1 hour.
    $cacheDuration = app()->environment('local') ? 5 : 3600;
    
    $views = Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
        $service = new CloudinaryService();
        return $service->listDollParts();
    });

    $settingsController = new App\Http\Controllers\DollSettingsController();
    $defaultSettings = $settingsController->getSettings();

    return Inertia::render('ComponentsManager', [
        'views' => $views,
        'defaultSettings' => $defaultSettings
    ]);
})->name('components.manager');

Route::post('/doll-settings', [App\Http\Controllers\DollSettingsController::class, 'saveSettings'])->name('doll.settings.save');

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
    // Cache the Cloudinary response for 1 hour (3600 seconds) in production, 5s in local
    // to avoid hitting API limits and improve load time.
    $cacheDuration = app()->environment('local') ? 5 : 3600;

    $views = Cache::remember('doll_parts_cloudinary', $cacheDuration, function () {
        $service = new CloudinaryService();
        return $service->listDollParts();
    });

    $settingsController = new App\Http\Controllers\DollSettingsController();
    $defaultSettings = $settingsController->getSettings();

    return Inertia::render('DollConfigTest', [
        'views' => $views,
        'defaultSettings' => $defaultSettings
    ]);
})->name('doll.config.test');

// Ruta antigua estática (Comentada para que no interfiera, puedes borrarla si ya no usas ProductPage)
// Route::get('/product', function () {
//    return Inertia::render('ProductPage');
// })->name('product');

require __DIR__ . '/auth.php';
