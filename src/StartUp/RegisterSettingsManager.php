<?php

namespace Mcms\Events\StartUp;


use Illuminate\Support\ServiceProvider;
use Mcms\Core\Services\SettingsManager\SettingsManagerService;

class RegisterSettingsManager
{
    public function handle(ServiceProvider $serviceProvider)
    {
        SettingsManagerService::register('events', 'mcmsEvents');
    }
}
