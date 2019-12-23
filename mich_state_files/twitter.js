define(['knockout', 'components/component', 'models/tweet'], function (ko, Component, Tweet) {
    function twitterModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        if (self.component && self.component.data)
            self.user = self.component.data.user;

        self.loadData = function (data) {

            if (data != null && data.tweets != null && data.tweets.length > 0) {
                self.user = self.data.user;

                var tweets = ko.utils.arrayMap(data.tweets, function (tweet) {
                    return new Tweet(tweet);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    tweets[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, tweets);
                } else {
                    self.originalData.push.apply(self.originalData, tweets);

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
            var promise = self.getComponentData("twitter");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("twitter").then(function (data) {
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
        viewModel: twitterModel
    };
});
