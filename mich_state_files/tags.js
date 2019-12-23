define(['knockout', 'components/component', 'models/tag'], function (ko, Component, Tag) {
    function TagsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data !== null && data.length > 0) {
                var tags = ko.utils.arrayMap(data, function (item) {
                    return new Tag(item);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, tags);
                } else {
                    self.originalData.push.apply(self.originalData, tags);

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
            var promise = self.getComponentData("tags");
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
    }

    return {
        viewModel: TagsModel
    };
});