(function() {
    'use strict';

    angular.module('mcms.events')
        .controller('EventsHomeController',Controller);

    Controller.$inject = ['items', 'EventService', 'BottomSheet', '$mdSidenav',
        'Dialog', 'core.services', '$rootScope', 'lodashFactory', 'LangService', '$location', '$filter'];

    function Controller(Items, EventService, BottomSheet, $mdSidenav, Dialog, Helpers, $rootScope, lo, Lang
        ,$location, $filter) {
        var vm = this;
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();

        function filter() {
            vm.Loading = true;
            vm.Items = [];
            return EventService.get(vm.filters)
                .then(function (res) {
                    vm.Loading = false;
                    setUp(res);
                    $rootScope.$broadcast('scroll.to.top');
                });
        }


        vm.listItemClick = function($index) {
            $mdBottomSheet.hide(clickedItem);
        };

        vm.toggleFilters = function () {
            $mdSidenav('filters').toggle();
        };

        vm.edit = function (item) {
            var id = (item) ? item.id : 'new';
            $location.path($filter('reverseUrl')('event-edit',{id : id}).replace('#',''));
        };

        vm.changePage = function (page, limit) {
            vm.filters.page = page;
            filter();
        };

        vm.applyFilters = function () {
            filter();
        };

        vm.delete = function (item) {
            Helpers.confirmDialog({}, {})
                .then(function () {
                    EventService.destroy(item)
                        .then(function () {
                            filter();
                            Helpers.toast('Saved!');
                        });
                });
        };

        vm.showActions = function (ev, item) {

            BottomSheet.show({
                item : item,
                title : 'Edit ' + item.title[vm.defaultLang]
            },[
                { name: 'Edit', icon: 'edit', fn : vm.edit },
                { name: 'Delete', icon: 'delete', fn : vm.delete },
            ]);
        };

        vm.onSave = function (item, isNew) {
            if (isNew){
                filter();
                Dialog.close();
                return;
            }

            var $index = lo.findIndex(vm.Items, {id : item.id});
            vm.Items[$index] = item;

        };

        setUp(Items);

        function setUp(res) {
            vm.Pagination = res;
            vm.Items = res.data;
        }
    }


})();
