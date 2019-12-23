define(['knockout', 'components/component', 'models/gallery'], function (ko, Component, Gallery) {
    function galleriesModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.sports = ko.observableArray([]);
        self.selectedSport = ko.observable();

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var galleries = ko.utils.arrayMap(data, function (gallery) {
                    return new Gallery(gallery);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    galleries[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, galleries);
                } else {
                    self.originalData.push.apply(self.originalData, galleries);

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
            var extra = self.extra();
            if (!extra) {
                extra = {};
            }
            delete extra["sports"];
            var extra_params = $.extend({}, { sport_id: self.selectedSport() }, extra);

            var promise = self.getComponentData("galleries", extra_params);
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        self.refreshData = function () {
            self.data([])
                .isInitializing(true)
                .getData();
        };

        self.selectedSport.subscribe(function () {
            if (self.slickSlider)
                self.slickSlider.slick('unslick').empty();

            self.originalData([]);
            self.data([]).getData();
        });

        if (self.dummy()) {
            self.getDummyData("galleries").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
                self.sports(self.component.extra.sports);
            }
            else {
                self.getData();
            }
        }

        if (self.sport_id > 0)
            self.selectedSport(self.sport_id);
    }

    return {
        viewModel: galleriesModel
    };
});
