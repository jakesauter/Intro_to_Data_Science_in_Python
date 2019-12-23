define(['knockout', 'components/component', 'models/staff'], function (ko, Component, Staff) {
    function headCoachModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var head_coach = ko.utils.arrayMap(data, function (coach) {
                    return new Staff(coach);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, head_coach);
                } else {
                    self.originalData.push.apply(self.originalData, head_coach);
                    
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
            var promise = self.getComponentData("head-coach");
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
        viewModel: headCoachModel
    };
});