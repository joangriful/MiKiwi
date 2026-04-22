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
        return $query->where($column, 'ILIKE', $pattern, $boolean);
    }

    private static function escapeLike(string $value): string
    {
        return addcslashes($value, '\\%_');
    }
}
