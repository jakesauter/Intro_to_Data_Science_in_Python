define(['knockout', 'components/component', 'models/youtube-video', 'models/showcase-player'], function (ko, Component, YoutubeVideo, ShowcasePlayer) {
    function youtubeModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.modal = params.modal;
        self.isVideoPlaying = ko.observable(false);
        self.selectedVideo = ko.observable();

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var youtubes = ko.utils.arrayMap(data, function (video) {
                    return new YoutubeVideo(video);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    youtubes[0].showDynamicAd = true;
                }
                
                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, youtubes);
                } else {
                    self.originalData.push.apply(self.originalData, youtubes);
                    self.selectedVideo(self.originalData()[0]);
                    
                    self.setup_responsive_counts_and_data(self);
                }
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
            var promise = self.getComponentData("youtube");
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
                        
        if (self.dummy()) {
            self.getDummyData("youtube").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component)
                self.loadData(self.component.data);
            else
                self.getData();
        }
    }

    return {
        viewModel: youtubeModel
    };
});