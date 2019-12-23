define(['knockout', 'options', 'slick', 'perfect-scrollbar', 'aos'], function (ko, options, slick, perfectScrollbar, aos) {
    var Component = function (params) {
        var self = this,
            settings = new options();
        
        self.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        var crypto = window.crypto || window.msCrypto;
        
        if (params.id) {
        self.id = params.id;
        } else {
            self.id = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(s) { return (s ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> s / 4).toString(16)})
        }

        //main configuration options
        self.sport_id = settings.sport_id;

        //common observables
        self.originalData = ko.observableArray([]);
        self.breakpoint = ko.observable();
        self.data = ko.observableArray([]);
        self.isInitializing = ko.observable(true);
        self.isLoadingMore = ko.observable(false);
        self.moreToLoad = ko.observable(true);
        self.showDynamicAd = params.showDynamicAd || false;
        self.dynamicAdIteration = params.dynamicAdIteration || 3;
        self.loadMoreCount = 0;
        
        //component parameters
        self.component = window.sidearmComponents ? window.sidearmComponents.filter(function (c) { return c.id === self.id })[0] : null;
        if (self.isJson(params))
            params = JSON.parse(params);

        self.start = ko.observable(self.component ? self.component.start : params.start);
        self.originalStart = self.start.peek();

        self.count = ko.observable(self.component ? self.component.count : params.count);
        self.originalCount = self.count.peek();

        self.name = ko.observable(self.component ? self.component.name : params.name);
        self.dummy = ko.observable(self.component ? self.component.dummy : params.dummy);
        self.extra = ko.observable(self.component ? self.component.extra : params.extra);
        if (params.sport_id != undefined)
            self.sport_id = params.sport_id;
        else if (self.component && self.component.sport_id !== undefined && self.component.sport_id !== null) {
            self.sport_id = self.component.sport_id;
        }

        self.count_breakpoints = self.component && self.component.count_breakpoints ? JSON.parse(self.component.count_breakpoints) : params.count_breakpoints ? params.count_breakpoints : [];

        if (Array.isArray(self.count_breakpoints) && self.count_breakpoints.length) {
            self.count_breakpoints = self.count_breakpoints.sort(function (a, b) { return (a.breakpoint > b.breakpoint) ? 1 : ((b.breakpoint > a.breakpoint) ? -1 : 0) });
        }

        self.bucket = window.s3_bucket_path;
		
        self.getComponentData = function (type, options) {
			if (type === "ads" && settings.dummy_ads)
                type = "dummy-ads";
			
            var component = {
                "type": type,
                "start": self.start(),
                "count": self.count(),
                "sport_id": self.sport_id,
                "name": self.name(),
            };
            if (options != undefined)
                $.extend(component, options);
            if (self.extra() && !component.extra) {
                if (self.extra() !== null && typeof self.extra() === 'object') {
                    component.extra = JSON.stringify(self.extra());
                }
                else {
                    component.extra = self.extra();
                }
            }
            return $.getJSON("/services/adaptive_components.ashx", component);
        };

        self.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        self.loadMoreComponentData = function () {
            self.isLoadingMore(true);
            self.start(self.start() + self.count());
            self.loadMoreCount += 1;
        };

        self.slickSlider;

        self.slickIsPlaying = ko.observable(null);

        self.slick = function (element, options) {
            var $element = $(element),
                slickOptions = $element.data("slick-options");

            if (slickOptions)
                slickOptions = JSON.parse(JSON.stringify(eval('(' + slickOptions + ')')));
            else
                slickOptions = options || {};

            $element.on('init', function (event, slick) {
                slick.refresh = slick.unfilterSlides;
            }).slick(slickOptions);

            $element.on('destroy', function (event, slick) {
                console.log('destroyed', event, slick);
            });

            self.slickSlider = $element;

            self.slickObj = self.slickSlider.slick('getSlick');
			
            if (self.slickSlider.slick('slickGetOption', 'autoplay')) {
                self.slickIsPlaying(true);
                self.slickPlay();
            }

            if (self.slickSlider.slick('slickGetOption', 'pausable') === true && self.slickObj.slideCount > 1) {
                self.slickBuildPause();
            }

            return $element;
        };

        self.slickBuildPause = function () {
            setTimeout(function() {
                var $buttonString = self.slickIsPlaying() ?
                                        '<button type="button" aria-label="Pause" class="slick-pause-play slick-pause">Pause</button>' :
                                        '<button type="button" aria-label="Play" class="slick-pause-play slick-play">Play</button>';

                var shouldCreatePauseButton = false;

                $(window).resize(function() {
                    if (!self.slickSlider){return};
                    
                    self.slidesToShow = self.slickObj.options.slidesToShow;

                    var activeBreakpointSettings = self.slickObj.breakpointSettings[self.slickObj.activeBreakpoint];

                    if (activeBreakpointSettings != undefined) {
                        self.slidesToShow = activeBreakpointSettings.slidesToShow;
                    }

                    shouldCreatePauseButton = self.slickObj.slideCount > self.slidesToShow;

                    if (!shouldCreatePauseButton) {
                        if (self.slickSlider.find('.slick-pause-play').length) {
                            self.slickSlider.find('.slick-pause-play').remove();
                            return;
                        }
                    }
    
                    else {
                        if (self.slickSlider.find('.slick-pause-play').length) {
                            return;
                        }

                        self.slickSlider.append($buttonString);
                        var $button = self.slickSlider.find('.slick-pause-play');
        
                        $button.on('click', function () {
                            if (self.slickIsPlaying()) {
                                self.slickPause();
                            } else {
                                self.slickPlay();
                            }
                        });
        
                        self.slickSlider.on('reInit', function () {
                            if (self.slickSlider.slick('slickGetOption', 'pausable') === true) {
                                self.slickBuildPause();
                            } else {
                                self.slickSlider.find('.slick-pause-play').remove();
                            }
                        });
                    }
                }).trigger('resize');
            }, 0);
        };

        self.slickIsPlaying.extend({notify: 'always'});
        self.slickIsPlaying.subscribe(function(newVal) {
            var $button = self.slickSlider.find('.slick-pause-play');
        
            if (!$button.length)
                return;
        
            if (newVal === true) {
                $button.removeClass('slick-play').addClass('slick-pause').attr('aria-label', 'Pause').html('Pause');
            } else {
                $button.removeClass('slick-pause').addClass('slick-play').attr('aria-label', 'Play').html('Play');
            }
        });

        self.slickGoTo = function (data) {
            var index = self.data().indexOf(data);
            self.slickSlider.slick('slickGoTo', index);
        };

        self.unSlick = function () {
            if (self.slickSlider)
                self.slickSlider.slick('unslick').empty();
        };

        self.slickNext = function () {
            self.slickSlider.slick('slickNext');
        };

        self.slickPrev = function () {
            self.slickSlider.slick('slickPrev');
        };

        self.slickPause = function () {
            self.slickSlider.slick('slickPause');
            self.slickIsPlaying(false);
        };

        self.slickPlay = function (element) {
            self.slickSlider.slick('slickPlay');
            self.slickIsPlaying(true);
        };

        self.perfectScrollbar = function (element, options) {
            var $element = $(element),
                perfectScrollbarOptions = $element.data("perfectscrollbar-options");

            if (perfectScrollbarOptions)
                perfectScrollbarOptions = JSON.parse(JSON.stringify(eval('(' + perfectScrollbarOptions + ')')));
            else
                perfectScrollbarOptions = options || {};

            $element.perfectScrollbar(perfectScrollbarOptions);
        };

        self.aos = function (element, options) {
            var $element = $(element),
                aosOptions = $element.data("aos-options");

            if (aosOptions)
                aosOptions = JSON.parse(JSON.stringify(eval('(' + aosOptions + ')')));
            else
                aosOptions = options || {};

            if (!window.aos) {
                window.aos = aos;

                window.aos.init(aosOptions);

                var prev_doc_height = $(document).height(),
                    doc_height_check_timeout = 0;

                var doc_height_check = setInterval(function () {
                    var current_doc_height = $(document).height();

                    if (prev_doc_height !== current_doc_height) {
                        prev_doc_height = current_doc_height;
                        window.aos.refreshHard();
                    }
                    else {
                        doc_height_check_timeout++;
                    }

                    if (doc_height_check_timeout > 40) {
                        clearInterval(doc_height_check);
                    }
                }, 250);
            }
            else {
                window.aos.refreshHard();
            }
        };

        self.chunk = function (data, items) {
            var panels = ko.observableArray([]);

            var remaining = data.slice();

            while (remaining.length > 0) {
                panels.push(remaining.splice(0, items || 1));
            }
            return panels;
        };

        self.setup_responsive_counts_and_data = function (context, callback) {
            var matched_breakpoint;
            if (self.count_breakpoints.length > 0) {
                $(window).resize(function () {
                    self.count_breakpoints.forEach(function (count_breakpoint) {
                        var min_window_size = Number(count_breakpoint.breakpoint) ? count_breakpoint.breakpoint + "px" : count_breakpoint.breakpoint;
                        if (window.matchMedia("(min-width: " + min_window_size + ")").matches) {
                            matched_breakpoint = count_breakpoint;

                            if (matched_breakpoint.skip === undefined) {
                                matched_breakpoint.skip = 0;
                            }
                        }
                    });

                    if (matched_breakpoint) {
                        if (self.breakpoint.peek() !== matched_breakpoint) {
                            self.breakpoint(matched_breakpoint);
                            self.count(self.breakpoint().count);
                            self.start(self.originalStart + self.breakpoint.peek().skip);

                            if (typeof callback === 'function') {
                                callback()
                            }
                        }
                    } else {
                        self.breakpoint({ breakpoint: 0, count: self.originalCount, skip: 0 });
                    }
                }).resize();
            } else {
                self.breakpoint({ breakpoint: 0, count: self.originalCount, skip: 0 });
            }
        };

        self.breakpoint.subscribe(function (newVal) {
            if (newVal.name) {
                self.name(newVal.name);
            }

            self.slickSlider = null;
            var new_data = self.originalData.peek().slice(newVal.skip, newVal.skip + newVal.count);
            self.data(new_data);
        });

        self.originalData.subscribe( function (newVal) {
            var breakpoint = self.breakpoint();

            if (breakpoint) {
                var new_data = newVal.slice(breakpoint.skip, breakpoint.skip + breakpoint.count);
                self.data(new_data);
            }
        });

        self.getDummyData = function (type) {
            var deferred = $.Deferred();

            $.getJSON("/components/dummydata/" + type + ".json").success(function (dummyData) {
                if (self.count() > dummyData.length) {
                    self.count(dummyData.length);
                }

                if (dummyData.length > self.count()) {
                    dummyData.splice(self.count(), (dummyData.length - 1));
                }

                deferred.resolve(dummyData);
            });

            return deferred.promise();
        };

    };

    return Component;
});