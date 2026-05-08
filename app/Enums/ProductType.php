<?php

namespace App\Enums;

enum ProductType: string
{
    case Simple = 'simple';
    case Doll = 'doll';
    case Configurable = 'configurable';
    case Component = 'component';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
