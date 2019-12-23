define(['knockout', 'components/component', 'models/podcast'], function (ko, Component, Podcast) {
    function podcastsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var podcasts = ko.utils.arrayMap(data, function (podcast) {
                    return new Podcast(podcast);
                });
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, podcasts);
                } else {
                    self.originalData.push.apply(self.originalData, podcasts);
                    
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
            var promise = self.getComponentData("podcasts");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("podcasts").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component)
                self.loadData(self.component.data);
            else
                self.getData();
        }
    }

    return {
        viewModel: podcastsModel
    };
});