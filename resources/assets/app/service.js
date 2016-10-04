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

        function save(file) {
            return DS.update(file);
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
