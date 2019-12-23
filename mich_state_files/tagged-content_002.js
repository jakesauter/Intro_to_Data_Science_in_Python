define(['knockout', 'components/component', 'models/tagged-content', 'packery', 'images-loaded'], function (ko, Component, TaggedContent, Packery, imagesLoaded) {
    function TaggedContentModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data !== null && data.length > 0) {
                var content = ko.utils.arrayMap(data, function (item) {
                    return new TaggedContent(item);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, content);
                } else {
                    self.originalData.push.apply(self.originalData, content);
                    self.setup_responsive_counts_and_data(self);
                }
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("tagged-content");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.component)
            self.loadData(self.component.data);
        else
            self.getData();


        self.packery = function (element) {
            require(['packery', 'jquery-bridget/jquery.bridget', 'images-loaded'], function (Packery, bridget, imagesLoaded) {
                bridget('packery', Packery);
                $(element).imagesLoaded(function () {
                    var _options = { itemSelector: '.c-tagged-content-list__item', gutter: 0 };

                    if (!$(element).attr('data-packery')) 
                        $(element).packery(_options).attr('data-packery', true);
                    else {
                        $(element).packery('reloadItems').packery(_options);
                    }
                });
            });
        };
    }

    return {
        viewModel: TaggedContentModel
    };
});