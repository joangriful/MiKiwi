<?php

namespace Tests\Feature\Database;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PostgresIndexCompatibilityTest extends TestCase
{
    use RefreshDatabase;

    public function test_candidate_postgres_indexes_exist(): void
    {
        foreach ($this->expectedIndexedColumns() as [$table, $columns]) {
            $this->assertTrue(
                $this->hasIndexForColumns($table, $columns),
                sprintf('%s should have an index for (%s).', $table, implode(', ', $columns))
            );
        }
    }

    private function expectedIndexedColumns(): array
    {
        return [
            ['product', ['slug']],
            ['product', ['sku']],
            ['category', ['slug']],
            ['orders', ['order_number']],
        ];
    }

    /**
     * @param  array<int, string>  $columns
     */
    private function hasIndexForColumns(string $table, array $columns): bool
    {
        foreach (Schema::getIndexes($table) as $index) {
            $indexedColumns = array_map('strval', $index['columns'] ?? []);

            if ($indexedColumns === $columns) {
                return true;
            }
        }

        return false;
    }
}
