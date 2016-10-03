<?php

namespace Mcms\Events\Menu;
use Config;
use Mcms\Events\Models\Filters\EventFilters;
use Mcms\Events\Models\Event;
use Illuminate\Http\Request;
use IdeaSeven\Core\Services\Menu\AdminInterfaceConnector;
use Illuminate\Support\Collection;


/**
 * Class EventsInterfaceMenuConnector
 * @package Mcms\Events\Menu
 */
class EventsInterfaceMenuConnector extends AdminInterfaceConnector
{
    /**
     * @var string
     */
    protected $moduleName = 'Events';
    /**
     * @var array
     */
    protected $sections = [];
    /**
     * @var Event
     */
    protected $event;

    protected $filters;

    protected $type = 'generic';

    /**
     * EventsInterfaceMenuConnector constructor.
     */
    public function __construct()
    {
        $this->event = new Event();
        $this->sections = $this->getSections();

        parent::__construct($this->event);

        return $this;
    }

    /**
     * Setup the sections needed for the admin interface to render the menu selection
     *
     * @return array
     */
    private function getSections(){
        //extract it to a config file maybe
        return [
            [
                'name' => 'Items',
                'filterService' => 'Mcms\Events\Menu\EventsInterfaceMenuConnector',
                'filterMethod' => 'filterItems',
                'settings' => [
                    'perEvent' => 10,
                    'preload' => true,
                    'filter' => true
                ],
                'filters' => [
                    ['key'=>'id', 'label'=> '#ID', 'default' => true],
                    ['key'=>'title', 'label'=> 'Title'],
                    ['key'=>'description', 'label'=> 'Description'],
                    ['key'=>'description_long', 'label'=> 'Long Description'],
                ],
                'titleField' => 'title',
                'slug_pattern' => Config::get('events.items.slug_pattern')
            ],
        ];
    }

    /**
     * Provide the menu connector with events results. Query string filters apply here
     *
     * @param Request $request
     * @param $section
     * @return array
     */
    public function filterItems(Request $request, $section){
        $results = $this->event->limit($section['settings']['perEvent'])->filter(new EventFilters($request))->get();

        if (count($results) == 0){
            return ['data' => []];
        }

        //now formulate the results
        $toReturn = [];

        foreach ($results as $result){

            $toReturn[] = [
                'item_id' => $result->id,
                'title' => $result->title,
                'module' => $this->moduleName,
                'model' => get_class($result),
                'section' => $section
            ];
        }

        $results = $results->toArray();
        $results['data'] = $toReturn;


        return ['data' => $toReturn];
    }
}