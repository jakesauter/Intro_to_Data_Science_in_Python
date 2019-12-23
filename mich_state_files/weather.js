define(['knockout', 'components/component'], function (ko, Component) {
    function weatherModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null) 
                self.data.push(data);      

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("weather");
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
        viewModel: weatherModel
    };
});