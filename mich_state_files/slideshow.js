define(['knockout', 'components/component', 'models/slideshow', 'options'], function(ko, Component, Slideshow, options) {
    function slideshowModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var slideshows = ko.utils.arrayMap(data, function (slideshow) {
                    return new Slideshow(slideshow);
                });
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, slideshows);
                } else {
                    self.originalData.push.apply(self.originalData, slideshows);
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
            var promise = self.getComponentData("slideshow");
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
    };

    return {
        viewModel: slideshowModel
    };

});