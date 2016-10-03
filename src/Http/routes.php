<?php

Route::group(['prefix' => 'admin/api'], function () {
    Route::group(['middleware' =>['level:2']], function($router)
    {
        $router->resource('event' ,'Mcms\Events\Http\Controllers\EventController');
    });

});