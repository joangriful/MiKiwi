<?php

declare(strict_types=1);

namespace App\Support\Database;

use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

final class CaseInsensitiveSearch
{
    public static function contains(
        EloquentBuilder|QueryBuilder $query,
        string $column,
        string $value,
        string $boolean = 'and'
    ): EloquentBuilder|QueryBuilder {
        return self::where($query, $column, '%'.self::escapeLike($value).'%', $boolean);
    }

    public static function startsWith(
        EloquentBuilder|QueryBuilder $query,
        string $column,
        string $value,
        string $boolean = 'and'
    ): EloquentBuilder|QueryBuilder {
        return self::where($query, $column, self::escapeLike($value).'%', $boolean);
    }

    private static function where(
        EloquentBuilder|QueryBuilder $query,
        string $column,
        string $pattern,
        string $boolean
    ): EloquentBuilder|QueryBuilder {
        // ILIKE is PostgreSQL-only. MySQL's LIKE is already case-insensitive
        // with the default utf8mb4_unicode_ci / utf8_general_ci collation.
        $operator = self::isPostgres($query) ? 'ILIKE' : 'LIKE';

        return $query->where($column, $operator, $pattern, $boolean);
    }

    private static function isPostgres(EloquentBuilder|QueryBuilder $query): bool
    {
        $connection = $query instanceof EloquentBuilder
            ? $query->getQuery()->getConnection()
            : $query->getConnection();

        // getDriverName() is not part of ConnectionInterface; use PDO instead.
        return $connection->getPdo()->getAttribute(\PDO::ATTR_DRIVER_NAME) === 'pgsql';
    }

    private static function escapeLike(string $value): string
    {
        return addcslashes($value, '\\%_');
    }
}
