define(['knockout', 'components/component', 'models/pressclip'], function(ko, Component, PressClip) {
    function pressClipsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var pressclips = ko.utils.arrayMap(data, function (pressclip) {
                    return new PressClip(pressclip);
                });
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, pressclips);
                } else {
                    self.originalData.push.apply(self.originalData, pressclips);
                    
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
            var promise = self.getComponentData("pressclips");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.dummy()) {
            self.getDummyData("pressclips").then(function (data) {
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
        viewModel: pressClipsModel
    };

});