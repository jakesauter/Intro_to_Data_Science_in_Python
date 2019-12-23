define(['knockout', 'components/component', 'models/fanatic'], function (ko, Component, Fanatic) {
    function fanaticsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null &&  data.length > 0) {
                var fanatics = ko.utils.arrayMap(data, function (fanatic) {
                    return new Fanatic(fanatic);
                });
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, fanatics);
                } else {
                    self.originalData.push.apply(self.originalData, fanatics);
                    
                    self.setup_responsive_counts_and_data(self);
                }
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("fanatics");
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
        viewModel: fanaticsModel
    };
});