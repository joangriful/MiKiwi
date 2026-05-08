<?php

declare(strict_types=1);

namespace Tests\Feature\Http\Controllers;

use App\Models\HomeSectionImage;
use App\Models\ImageHome;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PageRenderingTest extends TestCase
{
    use RefreshDatabase;

    #[DataProvider('publicPageRoutes')]
    public function test_public_static_pages_render_expected_inertia_component(string $routeName, string $component): void
    {
        $this->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }

    #[DataProvider('configuratorPageRoutes')]
    public function test_configurator_pages_render_expected_inertia_component(string $routeName, string $component): void
    {
        $this->get(route($routeName))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component($component));
    }

    public function test_dashboard_requires_authentication_and_renders_for_authenticated_user(): void
    {
        $this->get(route('dashboard'))
            ->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create())
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Profile/Dashboard'));
    }

    public function test_sustainability_page_only_passes_sustainability_hero_images(): void
    {
        $visibleHero = ImageHome::query()->create([
            'public_id' => 'sustainability/hero',
            'url' => 'https://example.com/sustainability.jpg',
            'width' => 1200,
            'height' => 800,
            'type' => 'sustainability',
        ]);
        HomeSectionImage::query()->create([
            'image_home_id' => $visibleHero->getKey(),
            'section_key' => 'sustainability',
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $hiddenHero = ImageHome::query()->create([
            'public_id' => 'home/hero',
            'url' => 'https://example.com/home.jpg',
            'width' => 1200,
            'height' => 800,
            'type' => 'home',
        ]);
        HomeSectionImage::query()->create([
            'image_home_id' => $hiddenHero->getKey(),
            'section_key' => 'home',
            'sort_order' => 0,
            'is_active' => true,
        ]);

        $this->get(route('sustainability'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Marketing/Sustainability')
                ->has('heroImages', 1)
                ->where('heroImages.0.id', $visibleHero->id)
                ->where('heroImages.0.type', 'sustainability')
            );
    }

    public static function publicPageRoutes(): array
    {
        return [
            ['claims.form', 'Claims/ClaimsForm'],
            ['privacy.policy', 'Marketing/PrivacyPolicy'],
            ['legal.notice', 'Marketing/LegalNotice'],
            ['sitemap', 'Marketing/Sitemap'],
            ['nuestros-kiwis', 'Marketing/OurKiwis'],
            ['packs-regalo', 'Marketing/GiftPacks'],
            ['suscripciones', 'Marketing/Subscriptions'],
            ['ofertas', 'Marketing/Offers'],
            ['compania', 'Marketing/Company'],
            ['faq', 'Marketing/FAQ'],
            ['contacto', 'Marketing/Contact'],
            ['about-us', 'Marketing/AboutUs'],
            ['cookie.policy', 'Marketing/CookiePolicy'],
            ['terms.contract', 'Marketing/TermsOfContract'],
            ['terms.use', 'Marketing/TermsOfUse'],
        ];
    }

    public static function configuratorPageRoutes(): array
    {
        return [
            ['configurador.home', 'Configurator/Index'],
            ['configurador.index', 'Configurator/Index'],
            ['configurador.collections', 'Configurator/Collections'],
            ['configurador.quiz', 'Configurator/Quiz'],
            ['configurador.dolls', 'Configurator/DollConfigTest'],
            ['doll.config.test', 'Configurator/DollConfigTest'],
            ['cart.view', 'Checkout/Cart'],
        ];
    }
}
