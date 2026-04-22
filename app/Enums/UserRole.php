<?php

namespace App\Enums;

enum UserRole: string
{
    case Customer = 'customer';
    case Admin = 'admin';
    case Support = 'support';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
