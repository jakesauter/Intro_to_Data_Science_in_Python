define(['knockout', 'components/component', 'models/all-access-video'], function (ko, Component, AllAccessVideo) {
    function allAccessModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

		self.modal = params.modal;
        self.categories = ko.observableArray([]);
        self.sports = ko.observableArray([]);
        self.selectedCategory = ko.observable();
        self.selectedSport = ko.observable();
        self.selectedVideo = ko.observable();
        self.isVideoPlaying = ko.observable(false);
        if (self.sport_id > 0)
            self.selectedSport(self.sport_id);
        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var videos = ko.utils.arrayMap(data, function (video) {
                    return new AllAccessVideo(video);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    videos[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, videos);
                } else {
                    self.originalData.push.apply(self.originalData, videos);
                    self.selectedVideo(self.originalData()[0]);

                    self.setup_responsive_counts_and_data(self);
                }
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.data.subscribe(function (newVal) {
            if (self.data().length) {
                self.data()[0].showcase().autoplay = false;
                self.selectedVideo(self.data()[0]);
            }
        });

        self.getData = function () {
            var extra = self.extra();
            if (!extra) {
                extra = {};
            }
            if ((typeof extra === 'string' || extra instanceof String) && self.isJson(extra)) {
                extra = JSON.parse(extra);
            }
            delete extra["categories"];
            delete extra["sports"];
            var extra_params = $.extend({}, { category: self.selectedCategory(), sport: self.selectedSport() }, extra);
            var promise = self.getComponentData("all-access", extra_params);
			promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

		self.switchVideo = function (video) {
            video.showcase().autoplay = true;
            self.selectedVideo().showcase().removePlayer();
            self.selectedVideo(video);
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

        self.selectedCategory.subscribe(function () {
            if (self.slickSlider)
                self.slickSlider.slick('unslick').empty();

            self.originalData([]);
            self.data([]).getData();
        });

		if (self.dummy()) {
            self.getDummyData("all-access").then(function (data) {
                self.loadData(data);
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
                self.sports(self.component.extra.sports);
                self.categories(self.component.extra.categories);
            }
            else{
                self.getData();
            }
        }
    }

    return {
        viewModel: allAccessModel
    };
});