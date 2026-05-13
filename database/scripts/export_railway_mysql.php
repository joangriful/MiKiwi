<?php

declare(strict_types=1);

/**
 * Exporta tablas de una base MySQL de Railway a JSON.
 *
 * Uso:
 *   php database/scripts/export_railway_mysql.php
 *   php database/scripts/export_railway_mysql.php --tables=users,products,orders
 *   php database/scripts/export_railway_mysql.php --output=storage/app/private/railway-export
 *
 * Variables de entorno requeridas:
 *   Opción A:
 *     RAILWAY_DB_URL
 *
 *   Opción B:
 *     RAILWAY_DB_HOST
 *     RAILWAY_DB_PORT
 *     RAILWAY_DB_DATABASE
 *     RAILWAY_DB_USERNAME
 *     RAILWAY_DB_PASSWORD
 */
function envValue(string $key): ?string
{
    $value = getenv($key);

    if ($value === false || $value === '') {
        return null;
    }

    return $value;
}

function cliOption(string $name): ?string
{
    global $argv;

    foreach ($argv as $arg) {
        if (str_starts_with($arg, "--{$name}=")) {
            return substr($arg, strlen($name) + 3);
        }
    }

    return null;
}

function fail(string $message, int $exitCode = 1): never
{
    fwrite(STDERR, $message.PHP_EOL);
    exit($exitCode);
}

$databaseUrl = envValue('RAILWAY_DB_URL');

$host = null;
$port = '3306';
$database = null;
$username = null;
$password = null;

if ($databaseUrl) {
    $parts = parse_url($databaseUrl);

    if ($parts === false) {
        fail('RAILWAY_DB_URL no tiene un formato válido.');
    }

    $host = $parts['host'] ?? null;
    $port = isset($parts['port']) ? (string) $parts['port'] : '3306';
    $database = isset($parts['path']) ? ltrim($parts['path'], '/') : null;
    $username = $parts['user'] ?? null;
    $password = $parts['pass'] ?? null;
} else {
    $host = envValue('RAILWAY_DB_HOST');
    $port = envValue('RAILWAY_DB_PORT') ?? '3306';
    $database = envValue('RAILWAY_DB_DATABASE');
    $username = envValue('RAILWAY_DB_USERNAME');
    $password = envValue('RAILWAY_DB_PASSWORD');
}

if (! $host || ! $database || ! $username || $password === null) {
    fail(
        'Faltan variables de conexión. Usa RAILWAY_DB_URL o bien '.
        'RAILWAY_DB_HOST, RAILWAY_DB_PORT, RAILWAY_DB_DATABASE, '.
        'RAILWAY_DB_USERNAME y RAILWAY_DB_PASSWORD.'
    );
}

$outputDir = cliOption('output') ?: 'storage/app/private/railway-export';
$requestedTables = cliOption('tables');
$tableFilter = $requestedTables
    ? array_values(array_filter(array_map('trim', explode(',', $requestedTables))))
    : null;

if (! is_dir($outputDir) && ! mkdir($outputDir, 0777, true) && ! is_dir($outputDir)) {
    fail("No se pudo crear el directorio de salida: {$outputDir}");
}

$dsn = sprintf(
    'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
    $host,
    $port,
    $database
);

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT => 15,
    ]);
} catch (PDOException $e) {
    fail('No se pudo conectar a Railway MySQL: '.$e->getMessage());
}

$tablesStmt = $pdo->prepare(
    'SELECT TABLE_NAME
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = :schema
       AND TABLE_TYPE = \'BASE TABLE\'
     ORDER BY TABLE_NAME'
);
$tablesStmt->execute(['schema' => $database]);
$allTables = array_map(
    static fn (array $row): string => $row['TABLE_NAME'],
    $tablesStmt->fetchAll()
);

$tables = $tableFilter
    ? array_values(array_intersect($allTables, $tableFilter))
    : $allTables;

if ($tableFilter && count($tables) !== count($tableFilter)) {
    $missing = array_values(array_diff($tableFilter, $tables));
    fail('Tablas no encontradas en Railway: '.implode(', ', $missing));
}

if ($tables === []) {
    fail('No hay tablas para exportar.');
}

$meta = [
    'exported_at' => date(DATE_ATOM),
    'database' => $database,
    'host' => $host,
    'tables' => [],
];

foreach ($tables as $table) {
    $countStmt = $pdo->query("SELECT COUNT(*) AS total FROM `{$table}`");
    $total = (int) $countStmt->fetch()['total'];

    $rowsStmt = $pdo->query("SELECT * FROM `{$table}`");
    $rows = $rowsStmt->fetchAll();

    $payload = [
        'table' => $table,
        'row_count' => $total,
        'rows' => $rows,
    ];

    $json = json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($json === false) {
        fail("No se pudo serializar la tabla {$table} a JSON.");
    }

    $filePath = rtrim($outputDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$table.'.json';
    file_put_contents($filePath, $json);

    $meta['tables'][] = [
        'table' => $table,
        'row_count' => $total,
        'file' => $filePath,
    ];

    fwrite(STDOUT, "Exportada {$table}: {$total} filas".PHP_EOL);
}

$metaJson = json_encode($meta, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if ($metaJson === false) {
    fail('No se pudo generar el metadata del export.');
}

file_put_contents(
    rtrim($outputDir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.'export-meta.json',
    $metaJson
);

fwrite(STDOUT, 'Export completado en: '.realpath($outputDir).PHP_EOL);
