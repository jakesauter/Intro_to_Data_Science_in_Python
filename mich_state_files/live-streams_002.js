define(['knockout', 'components/component', 'models/live-streams'], function (ko, Component, LiveStream) {
    function liveStream(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var livestreams = ko.utils.arrayMap(data, function (livestream) {
                    return new LiveStream(livestream);
                });
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, livestreams);
                } else {
                    self.originalData.push.apply(self.originalData, livestreams);
                    
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
            var promise = self.getComponentData("live-streams");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("live-streams").then(function (data) {
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
        viewModel: liveStream
    };
});