<?php

namespace Mcms\Events\Models\Collections;


use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Traits\Macroable;

/**
 * You can extend this collection using macros
 *
 * Class EventsCollection
 * @package Mcms\Events\Models\Collections
 */
class EventsCollection extends Collection
{
    use Macroable;
}