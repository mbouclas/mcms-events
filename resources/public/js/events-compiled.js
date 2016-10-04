(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
(function() {
    'use strict';

    angular.module('mcms.events')
        .controller('EventsHomeController',Controller);

    Controller.$inject = ['items', 'EventService', 'BottomSheet', '$mdSidenav',
        'Dialog', 'core.services', '$rootScope', 'lodashFactory', 'LangService', '$location', '$filter', 'momentFactory'];

    function Controller(Items, EventService, BottomSheet, $mdSidenav, Dialog, Helpers, $rootScope, lo, Lang
        ,$location, $filter, moment) {
        var vm = this,
        Filters = {
            title: null,
            description: null,
            description_long: null,
            active: null,
            userId: null,
            dateStart: null,
            dateEnd: null,
            category_ids : [],
            dateMode: 'created_at',
            orderBy : 'created_at',
            starts_at : null,
            ends_at : null,
            way : 'DESC',
            page: 1,
            limit :  10
        };

        vm.boolValues = [
            {
                label: 'Don\'t care',
                value: null
            },
            {
                label: 'Yes',
                value: true
            },
            {
                label: 'No',
                value: false
            }
        ];
        resetFilters();
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

        vm.resetFilters = function () {
          resetFilters();
          filter();
        };

        setUp(Items);

        function setUp(res) {
            vm.Pagination = res;
            vm.Items = res.data;
        }

        function resetFilters() {
            vm.filters = angular.copy(Filters);
        }
    }


})();

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.events')
        .service('EventsDataService',Service);

    Service.$inject = ['$http', '$q'];

    function Service($http, $q) {
        var _this = this;
        var baseUrl = '/admin/api/event/';

        this.index = index;
        this.store = store;
        this.show = show;
        this.update = update;
        this.destroy = destroy;


        function index(filters) {
            return $http.get(baseUrl, {params : filters}).then(returnData);
        }

        function store(item) {
            return $http.post(baseUrl, item)
                .then(returnData);
        }

        function show(id) {
            return $http.get(baseUrl + id).then(returnData);
        }

        function update(item) {
            return $http.put(baseUrl + item.id, item)
                .then(returnData);
        }

        function destroy(id) {
            return $http.delete(baseUrl + id)
                .then(returnData);
        }

        function returnData(response) {
            return response.data;
        }
    }
})();

},{}],5:[function(require,module,exports){
(function () {
    angular.module('mcms.events')
        .directive('editEvent', Directive);

    Directive.$inject = ['EVENTS_CONFIG', 'hotkeys'];
    DirectiveController.$inject = [ '$scope','EventService',
        'core.services', 'configuration', 'AuthService', 'LangService',
        'EVENTS_CONFIG', 'ItemSelectorService', 'lodashFactory',
        'mcms.settingsManagerService', 'SeoService', 'LayoutManagerService', '$timeout', '$rootScope', '$q',
        'momentFactory', 'ModuleExtender', 'MediaLibraryService'];

    function Directive(Config, hotkeys) {

        return {
            templateUrl: Config.templatesDir + "editEvent.component.html",
            controller: DirectiveController,
            controllerAs: 'VM',
            require : ['editEvent'],
            scope: {
                options: '=?options',
                item: '=?item',
                onSave : '&?onSave'
            },
            restrict: 'E',
            link: function (scope, element, attrs, controllers) {
                var defaults = {
                    hasFilters: true
                };

                hotkeys.add({
                    combo: 'ctrl+s',
                    description: 'save',
                    allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                    callback: function(e) {
                        e.preventDefault();
                        controllers[0].save();
                    }
                });

                controllers[0].init(scope.item);
                scope.options = (!scope.options) ? defaults : angular.extend(defaults, scope.options);
            }
        };
    }

    function DirectiveController($scope, Event, Helpers, Config, ACL, Lang, EventsConfig,
                                 ItemSelector, lo, SM, SEO, LMS, $timeout, $rootScope, $q,
                                 moment, ModuleExtender, MLS) {
        var vm = this,
            autoSaveHooks = [],
            Model = '\\Mcms\\Events\\Models\\Event';

        vm.published_at = {};
        vm.Lang = Lang;
        vm.defaultLang = Lang.defaultLang();
        vm.Locales = Lang.locales();
        vm.ValidationMessagesTemplate = Config.validationMessages;
        vm.Roles = ACL.roles();
        vm.Item = {};
        vm.Roles = ACL.roles();
        vm.Permissions = ACL.permissions();
        vm.isSu = ACL.role('su');//more efficient check
        vm.isAdmin = ACL.role('admin');//more efficient check


        vm.tabs = [
            {
                label : 'General',
                file : EventsConfig.templatesDir + 'tabs/tab-general-info.html',
                active : true,
                default : true,
                id : 'general',
                order : 1
            },
            {
                label : 'Translations',
                file : EventsConfig.templatesDir + 'tabs/tab-translations.html',
                active : false,
                id : 'translations',
                order : 20
            },
            {
                label : 'Image gallery',
                file : EventsConfig.templatesDir + 'tabs/tab-image-gallery.html',
                active : false,
                default : false,
                id : 'imageGallery',
                order : 30
            },
            {
                label : 'Files',
                file : EventsConfig.templatesDir + 'tabs/tab-file-gallery.html',
                active : false,
                default : false,
                id : 'fileGallery',
                order : 40
            },
/*            {
                label : 'Extra Fields',
                file : EventsConfig.templatesDir + 'tabs/tab-extra-fields.html',
                active : false,
                id : 'extraFields',
            },*/
            {
                label : 'Related Items',
                file : EventsConfig.templatesDir + 'tabs/tab-related-items.html',
                active : false,
                id : 'related',
                order : 50
            },
            {
                label : 'SEO',
                file : EventsConfig.templatesDir + 'tabs/tab-seo.html',
                active : false,
                id : 'seo',
                order : 60
            }
        ];

        if (Lang.allLocales().length == 1){
            //remove the translation tab
            var tabIndex = lo.findIndex(vm.tabs, {id : 'translations'});
            vm.tabs.splice(tabIndex, 1);
        }

        vm.tabs = ModuleExtender.extend('events', vm.tabs);

        vm.thumbUploadOptions = {
            url : Config.imageUploadUrl,
            acceptSelect : EventsConfig.fileTypes.image.acceptSelect,
            maxFiles : 1,
            params : {
                container : 'Item'
            }
        };

        vm.imagesUploadOptions = {
            url : EventsConfig.imageUploadUrl,
            acceptSelect : EventsConfig.fileTypes.image.acceptSelect,
            params : {
                container : 'Item'
            },
            uploadOptions : EventsConfig.fileTypes.image.uploadOptions
        };
        vm.mediaFilesOptions = {imageTypes : [], withMediaLibrary : true};
        vm.UploadConfig = {
            file : {},
            image : vm.imagesUploadOptions
        };

        vm.FileUploadConfig = {
            url : Config.fileUploadUrl,
            acceptedFiles : EventsConfig.fileTypes.file.acceptSelect,
            uploadOptions : EventsConfig.fileTypes.file.uploadOptions,
            params : {
                container : 'Item'
            }
        };

        vm.Layouts = LMS.layouts('events');
        vm.LayoutsObj = LMS.toObj();
        vm.categoriesValid = null;

        vm.init = function (item) {
            if (!item.id){
                //call for data from the server
                return Event.find(item)
                    .then(init);
            }

            init(item);

        };


        vm.exists = function (item, type) {
            type = (!type) ? 'checkForPermission' : 'checkFor' + type;
            return ACL[type](vm.User, item);
        };

        vm.save = function () {

            if (!$scope.ItemForm.$valid){
                $q.reject();
            }

            var isNew = (!(typeof vm.Item.id == 'number'));
            vm.Item.starts_at = Helpers.deComposeDate(vm.starts_at).toISOString();
            vm.Item.ends_at = Helpers.deComposeDate(vm.ends_at).toISOString();
            return Event.save(vm.Item)
                .then(function (result) {
                   Helpers.toast('Saved!');

                    if (isNew){
                        vm.Item = result;
                    }

                    if (typeof $scope.onSave == 'function'){
                        $scope.onSave({item : result, isNew : isNew});
                    }

                    return result;
                });
        };

        vm.onResult = function (result) {
            if (typeof vm.Item.related == 'undefined' || !vm.Item.related){
                vm.Item.related = [];
            }

            result.source_item_id = vm.Item.id;

            vm.Item.related.push(result);
        };

        function init(item) {
            if (!item.settings || typeof item.settings == 'undefined'){
                item.settings = {};
            }

            vm.Item = item;

            if (typeof vm.Item.files == 'undefined'){
                vm.Item.files = [];
            }
            SEO.fillFields(vm.Item.settings, function (model, key) {
                SEO.prefill(model, vm.Item, key);
            });

            vm.starts_at = Helpers.composeDate(vm.Item.starts_at);
            vm.ends_at = Helpers.composeDate(vm.Item.ends_at);
            vm.SEO = SEO.fields();
            vm.Connectors = ItemSelector.connectors();
            vm.thumbUploadOptions.params.item_id = item.id;
            vm.thumbUploadOptions.params.model = Model;
            vm.thumbUploadOptions.params.type = 'thumb';

            vm.imagesUploadOptions.params.item_id = item.id;
            vm.imagesUploadOptions.params.model = Model;
            vm.imagesUploadOptions.params.type = 'images';
            vm.FileUploadConfig.params.item_id = item.id;
            vm.FileUploadConfig.params.model = Model;
            vm.FileUploadConfig.params.type = 'file';
            LMS.setModel(vm.Item);
            vm.Settings = SM.get({name : 'events'});
            if (lo.isArray(vm.Item.categories) && vm.Item.categories.length > 0){
                vm.categoriesValid = true;
            }
        }

        vm.onSelectFromMediaLibrary = function (item) {
            MLS.assign(vm.thumbUploadOptions.params,item)
                .then(function (res) {
                    vm.Item.thumb = res;
                    Helpers.toast('Saved!!!');
                });
        };

    }
})();

},{}],6:[function(require,module,exports){
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


},{"./EventController":1,"./EventsHomeController":2,"./config":3,"./dataService":4,"./editEvent.component":5,"./routes":7,"./service":8}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
(function () {
    'use strict';

    angular.module('mcms.events')
        .service('EventService', Service);

    Service.$inject = ['EventsDataService', 'LangService', 'ItemSelectorService', 'mediaFileService',
        'TagsService', 'SeoService', 'mcms.settingsManagerService'];

    function Service(DS, Lang, ItemSelector, MediaFiles, Tags, SEO, SM) {
        this.save = save;
        this.destroy = destroy;
        this.get = get;
        this.find = find;
        this.newEvent = newEvent;

        function get(filters) {
            filters = filters || {limit: 10};

            return DS.index(filters);
        }

        function find(id) {
            return DS.show(id)
                .then(function (response) {
                    ItemSelector.register(response.connectors);
                    MediaFiles.setImageCategories(response.imageCategories);
                    SM.addSettingsItem(response.settings);

                    SEO.init(response.seoFields);
                    Tags.set(response.tags);
                    return response.item || newEvent();
                });
        }

        function save(item) {
            if (!item.id){
                return DS.store(item);
            }


            return DS.update(item);
        }


        function destroy(id) {
            return DS.destroy(id);
        }

        function newEvent() {
            return {
                title : Lang.langFields(),
                slug : '',
                description : Lang.langFields(),
                description_long : Lang.langFields(),
                active : false,
                extraFields : [],
                tagged : [],
                related : [],
                files : [],
                settings : {
                    seo : {}
                },
                id : null
            };
        }
    }
})();

},{}]},{},[6])