define(['knockout', 'components/component', 'models/factlet'], function (ko, Component, Factlet) {
    function factletsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var factlets = ko.utils.arrayMap(data, function (factlet) {
                    return new Factlet(factlet);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, factlets);
                } else {
                    self.originalData.push.apply(self.originalData, factlets);
                    
                    self.setup_responsive_counts_and_data(self);
                }
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("factlets");
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
        viewModel: factletsModel
    };
});