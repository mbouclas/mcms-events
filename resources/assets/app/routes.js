(function() {
    'use strict';

    angular.module('mcms.events')
        .config(config);

    config.$inject = ['$routeProvider','EVENTS_CONFIG'];

    function config($routeProvider,Config) {

        $routeProvider
            .when('/events', {
                templateUrl:  Config.templatesDir + 'index.html',
                controller: 'EventsHomeController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    items : ["AuthService", '$q', 'EventService', function (ACL, $q, EventService) {
                        return (!ACL.level(2)) ? $q.reject(403) : EventService.get();
                    }]
                },
                name: 'user-manager'
            })
            .when('/events/:id', {
                templateUrl:  Config.templatesDir + 'editEvent.html',
                controller: 'EventController',
                controllerAs: 'VM',
                reloadOnSearch : false,
                resolve: {
                    item : ["AuthService", '$q', 'EventService', '$route', function (ACL, $q, Event, $route) {
                        return (!ACL.role('admin')) ? $q.reject(403) : Event.find($route.current.params.id);
                    }]
                },
                name: 'event-edit'
            });
    }

})();
