(function() {
    'use strict';

    angular.module('mcms.events')
        .controller('EventController',Controller);

    Controller.$inject = ['item', 'LangService', '$location', '$filter', '$scope', '$rootScope', 'EVENTS_CONFIG'];

    function Controller(Item, Lang, $location, $filter, $scope, $rootScope, Config) {
        var vm = this;

        vm.Item = Item;
        vm.defaultLang = Lang.defaultLang();
        vm.previewAvailable = !(!Config.previewUrl);


        vm.onSave = function (item, isNew) {
            if (isNew){
                $location.path($filter('reverseUrl')('event-edit',{id : item.id}).replace('#',''));
            }
        };
    }

})();
