<?php

namespace Mcms\Events\Presenters;
use App;
use Mcms\Core\Services\Presenter\Presenter;
use Mcms\Events\Models\Event;

/**
 * Works as $page->present()->methodName
 *
 * Class EventPresenter
 * @package Mcms\Events\Presenters
 */
class EventPresenter extends Presenter
{
    /**
     * @var string
     */
    protected $lang;

    /**
     * EventPresenter constructor.
     * @param Event $page
     */
    public function __construct(Event $event)
    {
        $this->lang = App::getLocale();

        parent::__construct($event);
    }


}
