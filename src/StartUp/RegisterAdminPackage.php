<?php

namespace Mcms\Events\StartUp;

use Illuminate\Support\ServiceProvider;
use Mcms\Events\Menu\EventsInterfaceMenuConnector;
use ModuleRegistry, ItemConnector;

class RegisterAdminPackage
{
    public function handle(ServiceProvider $serviceProvider)
    {
        ModuleRegistry::registerModule('mcms/events/admin.package.json');
        try {
            ItemConnector::register((new EventsInterfaceMenuConnector())->run()->toArray());
        } catch (\Exception $e){

        }
    }
}