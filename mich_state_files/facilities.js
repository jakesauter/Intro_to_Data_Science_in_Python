define(['knockout', 'components/component', 'models/facility'], function(ko, Component, Facility) {
    function facilitiesModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var facilities = ko.utils.arrayMap(data, function (facility) {
                    return new Facility(facility);
                });
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, facilities);
                } else {
                    self.originalData.push.apply(self.originalData, facilities);
                    
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
            var promise = self.getComponentData("facilities");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        if (self.dummy()) {
            self.getDummyData("facilities").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component)
                self.loadData(self.component.data);
            else
                self.getData();
        }
    };

    return {
        viewModel: facilitiesModel
    };

});
