(function () {
    'use strict';

    angular.module('mcms.events', [
        'mcms.mediaFiles',
    ])

        .run(run);

    run.$inject = ['mcms.menuService'];

    function run(Menu) {

        Menu.addMenu(Menu.newItem({
            id: 'events',
            title: 'Events',
            permalink: '/events',
            icon: 'event',
            order: 2,
            acl: {
                type: 'level',
                permission: 2
            }
        }));
    }
})();

require('./config');
require('./routes');
require('./dataService');
require('./service');
require('./EventsHomeController');
require('./EventController');
require('./editEvent.component');

