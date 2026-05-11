<?php

namespace App\Http\Controllers;

use App\Domain\Home\Services\HomePageService;
use App\Http\Resources\ProductResource;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly HomePageService $homePageService,
    ) {}

    public function __invoke(Request $request): Response
    {
        $pageData = $this->homePageService->getPageData();
        $pageData['featuredProducts'] = ProductResource::collection($pageData['featuredProducts'])->resolve($request);

        return Inertia::render('Home/Home', $pageData);
    }
}
