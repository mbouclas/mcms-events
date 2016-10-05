<?php 
return [
    'event' => \Mcms\Events\Models\Event::class,
    'related' => \Mcms\Events\Models\Related::class,
    'presenter' => \Mcms\Events\Presenters\EventPresenter::class,
    'api' => [
        'controller' => 'Mcms\Events\Http\Controllers\ApiController',
        'limit' => 30,
    ],
    'slug_pattern' => '/event/%slug$s',
    'images' => [
        'optimize' => true,
        'keepOriginals' => true,
        'dirPattern' => 'events/event_%id$s',
        'filePattern' => '',
        'types' => [
            [
                'uploadAs' => 'image',
                'name' => 'images',
                'title' => 'Images',
                'settings' => [
                    'default' => true
                ]
            ],
        ],
        'copies' => [
            'thumb' => [
                'width' => 70,
                'height' => 70,
                'quality' => 100,
                'prefix' => 't_',
                'resizeType' => 'fit',
                'dir' => 'thumbs/',
            ],
            'main' => [
                'width' => 500,
                'height' => 500,
                'quality' => 100,
                'prefix' => 'm_',
                'resizeType' => 'fit',
                'dir' => '/',
            ],
        ]
    ],
    'files' => [
        'dirPattern' => 'events/event_%id$s',
        'filePattern' => '',
    ]
];