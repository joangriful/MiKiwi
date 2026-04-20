<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Admin\Services\ComponentsManagerPageService;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ComponentsManagerController extends Controller
{
    public function __construct(
        private readonly ComponentsManagerPageService $componentsManagerPageService,
    ) {
    }

    public function __invoke(): Response
    {
        return Inertia::render('Admin/ComponentsManager', $this->componentsManagerPageService->getPageData());
    }
}
