define(['knockout', 'components/component', 'models/story', 'models/story-thumbnail', 'models/showcase-player'], function (ko, Component, Story, StoryThumbnail, ShowcasePlayer) {
    function StoriesModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.originalThumbnails = ko.observableArray([]);
        self.thumbnails = ko.observableArray([]);
		self.slickSliders = [];

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var stories = ko.utils.arrayMap(data, function (item) {
                    return new Story(item);
                });
                if (self.isInitializing()) {
                    var thumbnails = ko.utils.arrayMap(data, function (item) {
                        return new StoryThumbnail(item);
                    });

                    self.originalThumbnails.push.apply(self.originalThumbnails, thumbnails);
                }


                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, stories);
                } else {
                    self.originalData.push.apply(self.originalData, stories);

                    self.setup_responsive_counts_and_data(self);
                }
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.breakpoint.subscribe(function (newVal) {
            if (self.originalThumbnails().length) {
                self.thumbnails(self.originalThumbnails.slice(newVal.skip, newVal.skip + newVal.count));
                if (self.thumbnails().length) {
                    self.thumbnails()[0].active(true);    
                }
            }
        });
        
        self.getData = function () {
            var promise = self.getComponentData("stories");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        self.groupDates = ko.computed(function () {
            var _group = [];
            ko.utils.arrayForEach(
                ko.utils.arrayGetDistinctValues(
                    self.data().map(function(story) {
                        return moment(story.date).startOf('day').format();
                    })
                ).sort(), function (_date) {
                    _group.push({
                        date: _date,
                        stories: self.data().filter(function (story) {
                            if (moment(story.date).isSame(_date, 'day'))
                                return story;
                        })
                    });                
                });

            return _group;
		});
		
        self.slickComponent = self.slick;
        self.slick = function (element) {
            var $element = self.slickComponent(element);
            $element.off('afterChange', self.slickChanged);

            $element.on('afterChange', self.slickChanged).on('click', '.showcase-play-button', function () {
                $element.slick("slickPause");
            });
            self.slickSliders.push($element);
        }

        self.slickChanged = function (event, slick, currentSlide, nextSlide) {
            for (var i = 0; i < self.thumbnails().length; i++)
                self.thumbnails()[i].active(false);

            if (self.thumbnails().length < currentSlide + 1) {
                self.thumbnails()[0].active(true);
            } else {
                self.thumbnails()[currentSlide].active(true);
            }
        };

        self.slickGoTo = function (thumbnail) {   
			var slideNumber = self.thumbnails.indexOf(thumbnail);
            $.each(self.slickSliders, function (index, slider) {
                $(slider).slick('slickGoTo', slideNumber);
            });
        }

        self.data.subscribe(function (oldValue) {
            self.slickSliders = [];
        }, null, 'beforeChange');
                        
        if (self.dummy()) {
            self.getDummyData("stories").then(function (data) {
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
        viewModel: StoriesModel
    };
});