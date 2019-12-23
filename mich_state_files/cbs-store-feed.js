define(['knockout', 'components/component', 'models/cbs-store-item'], function (ko, Component, CbsStoreItem) {
    function cbsStoreFeedModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            console.log(data);
            if (data != null && data != null && data.length > 0) {
                var cbs_store_feed = ko.utils.arrayMap(data, function (item) {
                    return new CbsStoreItem(item);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, cbs_store_feed);
                } else {
                    self.originalData.push.apply(self.originalData, cbs_store_feed);
                    
                    self.setup_responsive_counts_and_data(self);
                }
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            console.log('here');
            var promise = self.getComponentData("cbs-store-feed");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

		if (self.component)
		    self.loadData(self.component.data);
		else
		    self.getData();
    }

    return {
        viewModel: cbsStoreFeedModel
    };
});