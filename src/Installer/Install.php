<?php

namespace Mcms\Events\Installer;



use Illuminate\Console\Command;
use Mcms\Core\Services\Installer\InstallerContract;

class Install implements InstallerContract
{
    public $package = 'Events';

    public function run(Command $command, $commands = [])
    {

        $this->beforeRun();
        $this->afterRun();
        $command->call('events:install');
    }

    /**
     * The package name
     * @return string
     */
    public function packageName()
    {
        return $this->package;
    }

    /**
     * @return array
     */
    public function requiredInput()
    {
        return [
            'balls' => ['input' => 'A Ball']
        ];
    }

    /**
     * Executed just before the installer runs
     * @return $this
     */
    public function beforeRun()
    {
        event('installer.package.run.before',
            [$this->package . ' about to install']);

        return $this;
    }

    /**
     * Executed after the installer has run
     * @return $this
     */
    public function afterRun()
    {
        event('installer.package.run.after',
            [$this->package . ' was installed','info']);

        return $this;
    }
}
