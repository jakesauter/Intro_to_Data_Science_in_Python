define(['knockout', 'components/component', 'models/trending'], function (ko, Component, Trending) {
    function trendingModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
        if (self.start() === undefined) {
            self.start(0);
            self.originalStart = 0;
        }

        self.loadData = function (data) {
            if (data != null && data.length > 0)  {
                var trending = ko.utils.arrayMap(data, function (item) {
                    return new Trending(item);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, trending);
                } else {
                    self.originalData.push.apply(self.originalData, trending);

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
            $.getJSON('/services/analytics.ashx?detailed=1&take=' + self.count() + '&skip=' + self.start()).done(function (response) {  
                if (response.data && response.data.length) {
                    self.loadData(response.data);
                } else if (self.extra() && self.extra().stories_fallback) {
                    // Get stories if no trending data available
                    var promise = self.getComponentData("stories");
                    promise.success(function (data) {
                        self.loadData(data);
                    });
                }
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("trending").then(function (data) {
                self.loadData(data)
            });
        } else {
            self.getData();
        }
    }

    return {
        viewModel: trendingModel
    };
});