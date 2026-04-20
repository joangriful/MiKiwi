<?php

use App\Http\Controllers\Admin\ComponentsManagerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClaimsPageController;
use App\Http\Controllers\ColeccionesController;
use App\Http\Controllers\ConfiguratorPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MarketingPageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas Principales
|--------------------------------------------------------------------------
*/

Route::get('/', HomeController::class)->name('home');

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

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

    Route::get('/perfil', [ProfileController::class, 'show'])->name('perfil.view');

    // 📍 Gestión de Direcciones del Usuario
});

/*
|--------------------------------------------------------------------------
| Configurador y Herramientas
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/components-manager', ComponentsManagerController::class)->name('components.manager');

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

Route::get('/formulario-reclamaciones', ClaimsPageController::class)->name('claims.form');

Route::controller(MarketingPageController::class)->group(function () {
    Route::get('/politica-privacidad', 'privacyPolicy')->name('privacy.policy');
    Route::get('/aviso-legal', 'legalNotice')->name('legal.notice');
    Route::get('/mapa-del-sitio', 'sitemap')->name('sitemap');
    Route::get('/sostenibilidad', 'sustainability')->name('sustainability');
    Route::get('/nuestros-kiwis', 'ourKiwis')->name('nuestros-kiwis');
    Route::get('/packs-regalo', 'giftPacks')->name('packs-regalo');
    Route::get('/suscripciones', 'subscriptions')->name('suscripciones');
    Route::get('/ofertas', 'offers')->name('ofertas');
    Route::get('/compania', 'company')->name('compania');
    Route::get('/preguntas-frecuentes', 'faq')->name('faq');
    Route::get('/contacto', 'contact')->name('contacto');
    Route::get('/sobre-nosotros', 'aboutUs')->name('about-us');
    Route::get('/politica-cookies', 'cookiePolicy')->name('cookie.policy');
    Route::get('/condiciones-contratacion', 'termsOfContract')->name('terms.contract');
    Route::get('/terminos-uso', 'termsOfUse')->name('terms.use');
});

Route::controller(ConfiguratorPageController::class)->prefix('configurador')->group(function () {
    Route::get('/', 'index')->name('configurador.home');
    Route::get('/index', 'index')->name('configurador.index');
    Route::get('/collections', 'collections')->name('configurador.collections');
    Route::get('/quiz', 'quiz')->name('configurador.quiz');
    Route::get('/munecas', 'dolls')->name('configurador.dolls');
    Route::get('/cart', 'cart')->name('cart.view');
    Route::post('/cart/buy-now', [App\Http\Controllers\CartController::class, 'buyNow'])->name('cart.buy-now');
});

Route::get('/doll_config_test', [ConfiguratorPageController::class, 'dollConfigTest'])->name('doll.config.test');

require __DIR__ . '/auth.php';
