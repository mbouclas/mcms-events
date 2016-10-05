<?php
$config = Config::get('events.api');

Route::group(['prefix' => 'admin/api'], function () {
    Route::group(['middleware' =>['level:2']], function($router)
    {
        $router->resource('event' ,'Mcms\Events\Http\Controllers\EventController');
    });
});

Route::group(['prefix' => 'api'], function ($router) use ($config) {
    $controller = ($config['controller']) ?: 'Mcms\Events\Http\Controllers\ApiController' ;
    $router->get('events',[
        'as' => 'events-list',
        'uses' => "{$controller}@index"
    ]);

    $router->get('events/{slug}',[
        'as' => 'events-show',
        'uses' => "{$controller}@show"
    ]);
});