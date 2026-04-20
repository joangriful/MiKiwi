<?php

namespace App\Http\Controllers;

use App\Domain\Home\Services\HomePageService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly HomePageService $homePageService,
    ) {
    }

    public function __invoke(): Response
    {
        return Inertia::render('Home/Home', $this->homePageService->getPageData());
    }
}
