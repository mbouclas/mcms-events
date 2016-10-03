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
            permalink: '',
            icon: 'event',
            order: 2,
            acl: {
                type: 'level',
                permission: 2
            }
        }));

        var eventsMenu = Menu.find('events');

        eventsMenu.addChildren([
            Menu.newItem({
                id: 'events-manager',
                title: 'List',
                permalink: '/events',
                icon: 'event_note',
                order : 1
            }),
            Menu.newItem({
                id: 'events-add',
                title: 'Create new',
                permalink: '/events',
                icon: 'note_add',
                order : 2
            })
        ]);
    }

})();

require('./config');

