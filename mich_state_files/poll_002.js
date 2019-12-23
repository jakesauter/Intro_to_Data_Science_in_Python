define(['knockout', 'components/component', 'models/poll'], function (ko, Component, Poll) {
    function countdownsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null) {
                var poll = new Poll(data);
                
                if (self.isLoadingMore()) {
                    self.data.push(poll);
                } else {
                    self.originalData.push(poll);
                    
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
            var promise = self.getComponentData("poll");
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
        viewModel: countdownsModel
    };
});