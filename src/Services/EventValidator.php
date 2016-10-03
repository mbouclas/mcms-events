<?php

namespace Mcms\Events\Services;


use Mcms\Events\Exceptions\InvalidEventFormatException;
use Validator;

class EventValidator
{
    public function validate(array $item)
    {
        $check = Validator::make($item, [
            'title' => 'required',
            'user_id' => 'required',
            'active' => 'required',
            'starts_at' => 'required',
            'ends_at' => 'required',
        ]);

        if ($check->fails()) {
            throw new InvalidEventFormatException($check->errors());
        }

        return true;
    }
}