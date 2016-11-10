<?php

namespace Mcms\Events\Models;

use Carbon\Carbon;
use Config;
use Conner\Tagging\Taggable;
use IdeaSeven\Core\Models\FileGallery;
use IdeaSeven\Core\QueryFilters\Filterable;
use IdeaSeven\Core\Traits\CustomImageSize;
use IdeaSeven\Core\Traits\Presentable;
use IdeaSeven\Core\Traits\Relateable;
use IdeaSeven\Core\Traits\Userable;
use Illuminate\Database\Eloquent\Model;
use Mcms\Events\Models\Collections\EventsCollection;
use Mcms\Events\Presenters\EventPresenter;
use Mcms\Events\Services\FileConfigurator;
use Mcms\Events\Services\ImageConfigurator;
use Themsaid\Multilingual\Translatable;
use IdeaSeven\FrontEnd\Helpers\Sluggable;
use IdeaSeven\Core\Models\Image;

class Event extends Model
{
    use Translatable, Filterable, Presentable, Taggable, Relateable, Sluggable, CustomImageSize, Userable;

    /**
     * @var string
     */
    protected $table = 'events';
    /**
     * @var array
     */
    public $translatable = ['title', 'description', 'description_long'];

    protected $fillable = [
        'title',
        'description_long',
        'description',
        'slug',
        'thumb',
        'user_id',
        'settings',
        'active',
        'starts_at',
        'ends_at',
    ];

    protected $dates = ['created_at', 'updated_at', 'starts_at', 'ends_at'];

    public $casts = [
        'title' => 'array',
        'description' => 'array',
        'description_long' => 'array',
        'settings' => 'array',
        'thumb' => 'array',
        'active' => 'boolean'
    ];

    public $imageConfigurator = ImageConfigurator::class;
    public $fileConfigurator = FileConfigurator::class;
    protected $slugPattern = 'events.slug_pattern';
    protected $presenter;
    protected $relatedModel;
    public $config;
    public $route;
    protected $defaultRoute = 'event';

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->config = Config::get('events');
        $this->slugPattern = $this->config['slug_pattern'];
        $this->relatedModel = (isset($this->config['related'])) ? $this->config['related'] : Related::class;
        $this->relatedModel = (isset($this->config['related'])) ? $this->config['related'] : Related::class;
        $this->presenter = (isset($this->config['presenter'])) ? $this->config['presenter'] : EventPresenter::class;
        $this->defaultRoute = (isset($this->config['route'])) ? $this->config['route'] : $this->defaultRoute;

        if (isset($this->config['images.imageConfigurator'])){
            $this->imageConfigurator = $this->config['images.imageConfigurator'];
        }

        if (isset($this->config['files.fileConfigurator'])){
            $this->imageConfigurator = $this->config['files.fileConfigurator'];
        }

    }

    public function setStartsAtAttribute($value)
    {
        if ( ! isset($value) || ! $value){
            $this->attributes['starts_at'] = Carbon::now();
        }
        try {
            $this->attributes['starts_at'] = Carbon::parse($value);
        }
        catch (\Exception $e){
            $this->attributes['starts_at'] = Carbon::now();
        }
    }

    public function setEndsAtAttribute($value)
    {
        if ( ! isset($value) || ! $value){
            $this->attributes['ends_at'] = Carbon::now();
        }
        try {
            $this->attributes['ends_at'] = Carbon::parse($value);
        }
        catch (\Exception $e){
            $this->attributes['ends_at'] = Carbon::now();
        }

    }

    /**
     * Grab all of the images with type image
     *
     * @return mixed
     */
    public function images()
    {
        return $this->hasMany(Image::class, 'item_id')
            ->where('type', 'images')
            ->orderBy('orderBy','ASC');
    }

    public function related()
    {
        return $this->hasMany($this->relatedModel, 'source_item_id')
            ->where('model', get_class($this))
            ->orderBy('orderBy','ASC');
    }

    public function galleries()
    {
        return $this->hasMany(Image::class, 'item_id')
            ->where('type', '!=', 'thumb');
    }

    public function files()
    {
        return $this->hasMany(FileGallery::class, 'item_id')
            ->orderBy('orderBy','ASC');
    }

    public function newCollection(array $models = []){
        return new EventsCollection($models);
    }
}
