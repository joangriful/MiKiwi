<?php

namespace App\Http\Controllers;

use App\Domain\Marketing\Services\MarketingPageService;
use Inertia\Inertia;
use Inertia\Response;

class MarketingPageController extends Controller
{
    public function __construct(
        private readonly MarketingPageService $marketingPageService,
    ) {
    }

    public function privacyPolicy(): Response
    {
        return $this->render('Marketing/PrivacyPolicy');
    }

    public function legalNotice(): Response
    {
        return $this->render('Marketing/LegalNotice');
    }

    public function sitemap(): Response
    {
        return $this->render('Marketing/Sitemap');
    }

    public function sustainability(): Response
    {
        return $this->render(
            'Marketing/Sustainability',
            $this->marketingPageService->getSustainabilityPageData()
        );
    }

    public function ourKiwis(): Response
    {
        return $this->render('Marketing/OurKiwis');
    }

    public function giftPacks(): Response
    {
        return $this->render('Marketing/GiftPacks');
    }

    public function subscriptions(): Response
    {
        return $this->render('Marketing/Subscriptions');
    }

    public function offers(): Response
    {
        return $this->render('Marketing/Offers');
    }

    public function company(): Response
    {
        return $this->render('Marketing/Company');
    }

    public function faq(): Response
    {
        return $this->render('Marketing/FAQ');
    }

    public function contact(): Response
    {
        return $this->render('Marketing/Contact');
    }

    public function aboutUs(): Response
    {
        return $this->render('Marketing/AboutUs');
    }

    public function cookiePolicy(): Response
    {
        return $this->render('Marketing/CookiePolicy');
    }

    public function termsOfContract(): Response
    {
        return $this->render('Marketing/TermsOfContract');
    }

    public function termsOfUse(): Response
    {
        return $this->render('Marketing/TermsOfUse');
    }

    private function render(string $page, array $props = []): Response
    {
        return Inertia::render($page, $props);
    }
}
