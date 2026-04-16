<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$all = App\Models\Category::orderBy('name')->get(['id', 'parent_id', 'name', 'slug', 'is_active']);
$roots = App\Models\Category::whereNull('parent_id')
    ->with('children:id,parent_id,name,slug,is_active')
    ->orderBy('name')
    ->get(['id', 'parent_id', 'name', 'slug', 'is_active']);

echo 'ALL_COUNT=' . $all->count() . PHP_EOL;
echo 'ROOT_COUNT=' . $roots->count() . PHP_EOL;
echo json_encode([
    'all' => $all->toArray(),
    'roots' => $roots->toArray(),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
