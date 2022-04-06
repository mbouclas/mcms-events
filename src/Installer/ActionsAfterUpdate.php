<?php

namespace Mcms\Events\Installer;


use Mcms\Events\Installer\AfterUpdate\CreateMissingTable;
use Mcms\Events\Installer\AfterUpdate\PublishMissingConfig;
use Mcms\Events\Installer\AfterUpdate\PublishMissingMigrations;
use Mcms\Core\Exceptions\ErrorDuringUpdateException;
use Mcms\Core\Helpers\Installer;
use Mcms\Core\UpdatesLog\UpdatesLog;
use Illuminate\Console\Command;

class ActionsAfterUpdate
{
    protected $module;
    protected $version;

    public function __construct()
    {
        $this->module = 'package-events';
        $this->version = 1;
    }

    public function handle(Command $command)
    {
        /*
         * publish the missing migrations
         * publish the missing config
         * create the missing table media_library
         */

        $actions = [
            'PublishMissingMigrations' => PublishMissingMigrations::class,
            'PublishMissingConfig' => PublishMissingConfig::class,
            'CreateMissingTable' => CreateMissingTable::class,
        ];

        try {
            (new UpdatesLog($command, $this->module, $actions, $this->version))->process();
        }
        catch (ErrorDuringUpdateException $e){
            $command->error('Error during updating ' . $this->module);
        }

        return true;
    }
}
