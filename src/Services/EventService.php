<?php

namespace Mcms\Events\Services;


use App;
use Config;
use IdeaSeven\Core\Helpers\Strings;
use IdeaSeven\Core\Models\Image;
use IdeaSeven\Core\Models\MenuItem;

use IdeaSeven\Core\QueryFilters\Filterable;
use IdeaSeven\Core\Services\Image\GroupImagesByType;
use IdeaSeven\Core\Traits\FixTags;
use IdeaSeven\FrontEnd\Services\PermalinkArchive;
use Mcms\Events\Exceptions\InvalidEventFormatException;
use Mcms\Events\Models\Event;
use Mcms\Events\Models\Related;



/**
 * Class EventService
 * @package Mcms\Events\Services\Event
 */
class EventService
{
    use Filterable, FixTags;

    /**
     * @var Event
     */
    protected $event;
    /**
     * @var
     */
    public $model;

    protected $validator;

    protected $imageGrouping;

    /**
     * EventService constructor.
     * @param Event $event
     */
    public function __construct()
    {
        $model = (Config::has('events.event')) ? Config::get('events.event') : Event::class;
        $this->event = $this->model = new $model;
        $this->validator = new EventValidator();
        $this->imageGrouping = new GroupImagesByType();
    }

    /**
     * Filters the translations based on filters provided
     * Legend has it that it will filter properly role based queries.
     * So, if i am an admin, i should not be able to see the super users
     *
     * @param $filters
     */

    public function filter($filters, array $options = [])
    {
        $results = $this->event->filter($filters);
        $results = (array_key_exists('orderBy', $options)) ? $results->orderBy($options['orderBy']) : $results->orderBy('created_at', 'asc');
        $limit = ($filters->request->has('limit')) ? $filters->request->input('limit') : 10;
        $results = $results->paginate($limit);


        return $results;
    }

    /**
     * @param $id
     * @param array $event
     * @return array
     */
    public function update($id, array $event)
    {
        $Event = $this->event->find($id);
        //link has changed, write it out as a 301
        //create link
        $oldLink = $Event->generateSlug();
        $newLink = $Event->generateSlug($event);

        if ($oldLink != $newLink){
            //write 301

            PermalinkArchive::add($oldLink, $newLink);
        }
        $Event->update($event);
        //update relations

        //sanitize the model
        $Event = $this->saveRelated($event, $Event);

        $Event = $this->fixTags($event, $Event);

        //emit an event so that some other bit of the app might catch it
       event('menu.item.sync',$Event);

        return $Event;
    }

    /**
     * Create a new page
     *
     * @param array $event
     * @return static
     */
    public function store(array $event)
    {
        try {
            $this->validator->validate($event);
        }
        catch (InvalidEventFormatException $e){
            return $e->getMessage();
        }

        $event['slug'] = $this->setSlug($event);

        $Event = $this->event->create($event);
        $Event = $this->saveRelated($event, $Event);
        $Event = $this->fixTags($event, $Event);
        return $Event;
    }

    /**
     * Delete a page
     *
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        $item = $this->event->find($id);
        //delete images
        Image::where('model',get_class($this->model))->where('item_id', $id)->delete();
        //delete from menus
        MenuItem::where('model',get_class($this->model))->where('item_id', $id)->delete();
        //delete from related
        Related::where('model',get_class($this->model))->where('source_item_id', $id)->orWhere('item_id', $id)->delete();
        //emit an event so that some other bit of the app might catch it
       event('menu.item.destroy',$item);

        return $item->delete();
    }

    public function findOne($id, array $with = [])
    {

        $item = $this->model
            ->with($with)
            ->find($id);

        if ($item){
            $item = $item->relatedItems();
        }

        if (isset($item->galleries)){
            $item->images = $this->imageGrouping
                ->group($item->galleries, \Config::get('events.images.types'));
        }

        return $item;
    }


    private function setSlug($item){
        if ( ! isset($item['slug']) || ! $item['slug']){
            return str_slug($item['title'][App::getLocale()]);
        }

        return $item['slug'];
    }


    /**
     * @param array $event
     * @param Event $Event
     * @return Event
     */
    private function saveRelated(array $event, Event $Event)
    {
        if ( ! isset($event['related']) || ! is_array($event['related']) || count($event['related']) == 0){
            return $Event;
        }

        foreach ($event['related'] as $index => $item) {
            $event['related'][$index]['dest_model'] = ( ! isset($item['dest_model']))
                ? $event['related'][$index]['dest_model'] = $item['model']
                : $event['related'][$index]['dest_model'] = $item['dest_model'];
            $event['related'][$index]['model'] = get_class($Event);
        }

        $Event->related = $Event->saveRelated($event['related']);

        return $Event;
    }

    public function buildPermalink(array $item)
    {
        $stringHelpers = new Strings();

        return $stringHelpers->vksprintf(Config::get('events.slug_pattern'), $item);
    }


}