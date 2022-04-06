<?php

namespace Mcms\Events\Http\Controllers;

use App\Http\Controllers\Controller;
use Config;
use Mcms\Core\Services\SettingsManager\SettingsManagerService;
use Mcms\Events\Models\Filters\EventFilters;
use Mcms\Events\Services\EventService;
use Illuminate\Http\Request;
use ItemConnector;

class EventController extends Controller
{
    protected $event;
    protected $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(EventFilters $filters, Request $request)
    {

        \DB::listen(function ($query) {
//            print_r($query->sql);
//            print_r($query->bindings);
            // $query->time
        });
        $limit = ($request->has('limit')) ? $request->input('limit') : 10;
        return $this->eventService->model->with(['images'])
            ->filter($filters)
            ->paginate($limit);
    }



    public function store(Request $request)
    {
        $data = $request->toArray();
        $data['user_id'] = \Auth::user()->id;
        return $this->eventService->store($data);
    }


    public function update(Request $request, $id)
    {
        return $this->eventService->update($id, $request->toArray());
    }


    public function destroy($id)
    {
        $result = $this->eventService->destroy($id);
        return ['success' => $result];
    }

    public function show($id)
    {
        $imageCategories = Config::get('pages.items.images.types');
        \DB::listen(function ($query) {
//            print_r($query->sql);
//            print_r($query->bindings);
            // $query->time
        });;
        return [
            'item' => $this->eventService->findOne($id, ['related', 'galleries','tagged','files' ]),
            'imageCategories' => $imageCategories,
            'extraFields' => [],
            'config' => Config::get('pages.items'),
            'tags' => $this->eventService->model->existingTags(),
            'settings' => SettingsManagerService::get('pages'),
            'connectors' => ItemConnector::connectors(),
            'seoFields' => Config::get('seo')
        ];
    }
}
