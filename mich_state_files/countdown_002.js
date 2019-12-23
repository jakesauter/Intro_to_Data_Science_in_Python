define(['knockout', 'components/component', 'models/countdown'], function (ko, Component, Countdown) {
    function countdownsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
        self.logo_enabled = true;
        self.orientation = 'horizontal';
        self.theme = 'light';

        self.loadData = function (data) {
            if (data != null) {
                var countdown = new Countdown(data);
               
                if (self.isLoadingMore()) {
                    if (Array.isArray(data)) {
                        self.data.push.apply(self.data, countdown);
                    } else {
                        self.data.push(countdown);                        
                    }
                } else {
                    if (Array.isArray(data)) {
                        self.originalData.push.apply(self.originalData, countdown);
                    } else {
                        self.originalData.push(countdown);                        
                    }
                    
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
            var promise = self.getComponentData("countdowns");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("countdown").then(function (data) {
                self.loadData(data);
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
                if (self.component && self.component.extra) {
                    self.logo_enabled = self.component.extra.logo_enabled,
                    self.orientation = self.component.extra.orientation,
                    self.theme = self.component.extra.theme;
                }
            }
            else {
                self.getData();
            }
        }
    }

    return {
        viewModel: countdownsModel
    };
});