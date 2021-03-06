<?php

namespace Mcms\Events\Console\Commands\InstallerActions;


use Illuminate\Console\Command;

/**
 * Class PublishAssets
 * @package Mcms\Events\Console\Commands\InstallerActions
 */
class PublishAssets
{
    /**
     * @param Command $command
     */
    public function handle(Command $command)
    {
        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Events\EventsServiceProvider',
            '--tag' => ['public'],
        ]);

        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Events\EventsServiceProvider',
            '--tag' => ['assets'],
        ]);

        $command->call('vendor:publish', [
            '--provider' => 'Mcms\Events\EventsServiceProvider',
            '--tag' => ['admin-package'],
        ]);

        $command->comment('* Assets published');
    }
}