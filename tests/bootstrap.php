<?php

declare(strict_types=1);

$cacheFiles = array_merge(
    [
        __DIR__.'/../bootstrap/cache/config.php',
        __DIR__.'/../bootstrap/cache/events.php',
    ],
    glob(__DIR__.'/../bootstrap/cache/routes-*.php') ?: []
);

foreach ($cacheFiles as $cacheFile) {
    if (is_file($cacheFile)) {
        @unlink($cacheFile);
    }
}

require __DIR__.'/../vendor/autoload.php';
