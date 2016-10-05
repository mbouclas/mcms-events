<?php

namespace Mcms\Events\Http\Controllers;


use Illuminate\Routing\Controller;
use Mcms\Events\Models\Filters\EventFilters;
use Mcms\Events\Services\EventService;

class ApiController extends Controller
{
    protected $service;
    protected $config;

    public function __construct()
    {
        $this->service = new EventService();
        $this->config = \Config::get('events.api');
    }

    public function index(EventFilters $filters)
    {
        $results = $this->service
            ->model
            ->filter($filters);

        $limit = ($filters->request->has('limit')) ? $filters->request->limit : $this->config['limit'];
        $results = ($filters->request->has('startsAt') && $filters->request->has('endsAt'))
            ? $results->get()
            : $results->paginate($limit);

        return $results;
    }

    public function show($slug)
    {
        $item = $this->service
            ->model
            ->with(['images', 'related', 'tagged'])
            ->where('slug', $slug)
            ->first();

        if ($item) {
            $item = $item->relatedItems();
        }

        return $item;
    }
}