<?php

namespace App\Enums;

enum ChatSessionStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}
