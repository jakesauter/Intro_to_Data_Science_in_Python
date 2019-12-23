define(['knockout', 'components/component', 'models/award'], function (ko, Component, Award) {
    function awardsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var awards = ko.utils.arrayMap(data, function (award) {
                    return new Award(award);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    awards[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, awards);
                } else {
                    self.originalData.push.apply(self.originalData, awards);
                    
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
            var promise = self.getComponentData("awards");
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
        viewModel: awardsModel
    };
});