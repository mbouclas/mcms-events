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
