define(['knockout', 'components/component', 'packery', 'models/content-stream-item'], function (ko, Component, Packery, ContentStreamItem) {
    function ContentStreamModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.slickOptions = params.slickOptions || {};
        self.packeryOptions = params.packeryOptions || {};
        self.displayTypes = ko.observableArray([]);
        self.selectedDisplayType = ko.observable();
		self.slickSlider = null;

        self.loadData = function (data) {
            if (data != null && data.stream != null && data.stream.length > 0) {
                var content = ko.utils.arrayMap(data.stream, function (item) {
                    return new ContentStreamItem(item);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    content[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, content);
                } else {
                    self.originalData.push.apply(self.originalData, content);

                    self.setup_responsive_counts_and_data(self);
                }

                if (self.isInitializing()) {
                    self.displayTypes(data.types);
                    self.selectedDisplayType(self.displayTypes()[0]);
                    self.selectedDisplayType.subscribe(function () {
                        self.start(0);
                        self.moreToLoad(true);
                        self.originalData([]).getData();
                    });
                }
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("content-stream", { name: self.selectedDisplayType().value });
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        self.filterStream = function (displayType) {
            self.selectedDisplayType(displayType);
			if (self.slickSlider != null)
				self.slickSlider.slick('unslick').empty();
        };

        self.packery = function (element) {
            require(['jquery-bridget/jquery.bridget', 'images-loaded'], function (bridget, imagesLoaded) {
                bridget('packery', Packery);

                $(element).imagesLoaded(function () {
					var _options = $(element).data("packery-options");

					if (_options)
						_options = JSON.parse(JSON.stringify(eval('(' + _options + ')')));
					else
						_options = {};

                    if (!$(element).attr('data-packery'))
                        $(element).packery(_options).attr('data-packery', true);
                    else {
                        $(element).packery('reloadItems').packery(_options);
                    }
                });
            });

        };
		self.slickComponent = self.slick;
        self.slick = function (element) {
            self.slickSlider = self.slickComponent(element);
        };

        self.getContentStreamDummyData = function () {
            var deferred = $.Deferred();

            $.getJSON("/components/dummydata/content-stream.json").success(function (dummyData) {
                self.selectedDisplayType(dummyData.types[0]);

                var dummyTypes = params.dummyConfig;

                dummyData.stream = dummyData.stream.filter(function (data) {
                    if (dummyTypes.indexOf(data.type) >= 0)
                        return true;
                });

                dummyData.types = dummyData.types.filter(function (data) {
                    if (dummyTypes.indexOf(data.value) >= 0 || data.value == 'all')
                        return true;
                });

                if (self.count() > dummyData.stream.length) {
                    self.count(dummyData.stream.length)
                }

                if (dummyData.stream.length > self.count()) {
                    dummyData.stream.splice(self.count(), (dummyData.stream.length - 1))
                }

                deferred.resolve(dummyData);
            });

            return deferred.promise();
        }

        if (self.dummy()) {
            self.getContentStreamDummyData().then(function (data) {
                self.loadData(data);
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
        viewModel: ContentStreamModel
    };
});