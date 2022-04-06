<?php

namespace Mcms\Events\Services;


use App;
use Config;
use Mcms\Core\Helpers\Strings;
use Mcms\Core\Services\Image\ImageConfiguratorConfigurable;
use Mcms\Core\Services\Image\ImageConfiguratorContract;
use Mcms\Events\Models\Event;

/**
 * Configure the image uploader for our instance.
 *
 * Class ImageConfigurator
 * @package Mcms\Events\Services
 */
class ImageConfigurator implements ImageConfiguratorContract
{
    use ImageConfiguratorConfigurable;
    /**
     * @var mixed
     */
    public $config;
    /**
     * @var
     */
    public $model;
    /**
     * @var Strings
     */
    protected $stringHelpers;
    /**
     * @var string
     */
    protected $basePath;
    /**
     * @var string
     */
    protected $baseUrl;
    /**
     * @var string
     */
    public $savePath;

    /**
     * ImageConfigurator constructor.
     * @param $item_id
     */
    public function __construct($item_id = null)
    {
        $this->config = Config::get('events.images');
        if ($item_id){
            $this->model = Event::find($item_id);
        }

        $this->stringHelpers = new Strings();
        $this->basePath = 'images';
        $this->baseUrl = '/images/events/';
        //This gay little bit is cause in windows we cannot symlink from storage -> upload
        if (isset($this->config['savePath'])){
            $this->savePath = $this->config['savePath'];
        } else {
            $this->savePath = (App::environment() == 'production') ? 'storage_path' : 'public_path';
        }

    }

}
