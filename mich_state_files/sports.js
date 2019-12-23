define(['knockout', 'components/component', 'models/sport'], function (ko, Component, Sport) {
    function sportsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.selectedSportsLink = ko.observable();

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var sports = ko.utils.arrayMap(data, function (sport) {
                    return new Sport(sport);
                });

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, sports);
                } else {
                    self.originalData.push.apply(self.originalData, sports);
                    
                    self.setup_responsive_counts_and_data(self);
                }
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("sports");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.selectedSportsLink.subscribe(function () {
            if (self.selectedSportsLink()) {
                window.open(self.selectedSportsLink(),'_blank');
                return false;
            };
        });

        if (self.component)
            self.loadData(self.component.data);
        else
            self.getData();

    }

    return {
        viewModel: sportsModel
    };
});