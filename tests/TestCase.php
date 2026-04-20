<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $manifestPath = public_path('build/manifest.json');
        if (! File::exists($manifestPath)) {
            File::ensureDirectoryExists(dirname($manifestPath));
            File::put($manifestPath, json_encode([
                'resources/js/app.jsx' => [
                    'file' => 'assets/app.js',
                    'src' => 'resources/js/app.jsx',
                ],
            ]));
        }

        Config::set('inertia.testing.ensure_pages_exist', false);
    }
}
