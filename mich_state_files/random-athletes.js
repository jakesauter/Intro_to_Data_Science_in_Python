define(['knockout', 'components/component', 'models/athlete'], function (ko, Component, Athlete) {
    function randomAthletesModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var athletes = ko.utils.arrayMap(data, function (athlete) {
                    return new Athlete(athlete);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    athletes[0].showDynamicAd = true;
                }
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, athletes);
                } else {
                    self.originalData.push.apply(self.originalData, athletes);
                    
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
            var promise = self.getComponentData("random-athletes");
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
        viewModel: randomAthletesModel
    };
});