define(['knockout', 'components/component', 'models/facebook','models/facebook-page'], function (ko, Component, Facebook, FacebookPage) {
    function facebookModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.page = ko.observable();

        self.loadData = function (data) {
            if (data && data.page) {
                self.page(new FacebookPage(data.page));
            }
            if (data != null && data.data != null && data.data.length > 0) {
                var facebooks = ko.utils.arrayMap(data.data, function (item) {
                    return new Facebook(item);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    facebooks[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, facebooks);
                } else {
                    self.originalData.push.apply(self.originalData, facebooks);

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
            var promise = self.getComponentData("facebook");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("facebook").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component) {
                self.page(self.component.data.page);
                self.loadData(self.component.data);
            }
            else
                self.getData();
        }
    }

    return {
        viewModel: facebookModel
    };
});