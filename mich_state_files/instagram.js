define(['knockout', 'components/component', 'models/instagram'], function (ko, Component, Instagram) {
    function instagramModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var instagrams = ko.utils.arrayMap(data, function (instagram) {
                    return new Instagram(instagram);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    instagrams[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, instagrams);
                } else {
                    self.originalData.push.apply(self.originalData, instagrams);

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
            var promise = self.getComponentData("instagram");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("instagram").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
            }
            else
                self.getData();
        }
    }

    return {
        viewModel: instagramModel
    };
});