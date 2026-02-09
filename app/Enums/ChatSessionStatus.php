<?php

namespace App\Enums;

enum ChatSessionsStatus: string
{
    case Active = 'active';
    case Closed = 'closed';
}
