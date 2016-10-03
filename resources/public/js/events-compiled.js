(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    'use strict';
    var assetsUrl = '/assets/',
        appUrl = '/app/',
        componentsUrl = appUrl + 'Components/',
        templatesDir = '/vendor/mcms/events/app/templates/';

    var config = {
        apiUrl : '/api/',
        prefixUrl : '/admin',
        templatesDir : templatesDir,
        imageUploadUrl: '/admin/api/upload/image',
        fileUploadUrl: '/admin/api/upload/file',
        imageBasePath: assetsUrl + 'img',
        validationMessages : templatesDir + 'Components/validationMessages.html',
        appUrl : appUrl,
        componentsUrl : componentsUrl,
        fileTypes : {
            image : {
                accept : 'image/*',
                acceptSelect : 'image/jpg,image/JPG,image/jpeg,image/JPEG,image/PNG,image/png,image/gif,image/GIF'
            },
            document : {
                accept : 'application/pdf,application/doc,application/docx',
                acceptedFiles : '.pdf,.doc,.docx',
                acceptSelect : 'application/pdf,application/doc,application/docx'
            },
            file : {
                accept : 'application/*',
                acceptSelect : 'application/*,.pdf,.doc,.docx'
            },
            audio : {
                accept : 'audio/*',
                acceptSelect : 'audio/*'
            }
        }
    };

    angular.module('mcms.core')
        .constant('EVENTS_CONFIG',config);
})();

},{}],2:[function(require,module,exports){
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


},{"./config":1}]},{},[2])