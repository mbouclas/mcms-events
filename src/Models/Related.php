<?php

namespace Mcms\Events\Models;

use Config;
use Mcms\Core\Models\Related as BaseRelated;


/**
 * Class Page
 * @package Mcms\Events\Models
 */
class Related extends BaseRelated
{

    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = ['created_at', 'updated_at'];
    protected $eventsModel;

    public function __construct($attributes = [])
    {
        parent::__construct($attributes);
        $this->eventsModel = (Config::has('events.event')) ? Config::get('events.event') : Event::class;
    }

    public function item()
    {
        return $this->BelongsTo($this->eventsModel, 'item_id');
    }

}
