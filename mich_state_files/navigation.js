define(['knockout', 'components/component', 'models/navigation', 'moment', 'cookie'], function (ko, Component, Navigation, moment, cookie) {
    function navigationModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.isMenuOpen = ko.observable(false);
        self.isSportMenu = (self.sport_id === undefined || self.sport_id === 0) ? false : true;
		self.sport = {
            abbreviation: 'WSWIM',
            facebook: 'https://www.facebook.com/University-of-Miami-Swimming-and-Diving-993726104079622/',
            id: 28,
            instagram: 'canesswimdive',
            pinterest: '',
            short_title: 'Women\'s Swimming & Diving',
            shortname: 'wswim',
            title: 'Women\'s Swimming & Diving',
            twitter: 'CanesSwimDive',
            url: '',
            youtube: ''
		};

		self.hasHiddenItems = ko.observable(false);
		
        self.loadData = function (data) {
            if (data != null) {
                var navigation = ko.utils.arrayMap(data, function (item) {
                    return new Navigation(item);
                });

                if (self.extra() && self.extra().watch_badge && window.location.pathname.indexOf('/watch') !== 0) {
                    self.addAllAccessBadge(navigation);
                }

                self.data.push.apply(self.data, navigation);
                
                document.querySelector('html').classList.add('navigation-loaded');
            }
            self.isInitializing(false);
        };

        self.toggleMenu = function () {
            self.isMenuOpen(!self.isMenuOpen());
            $('body').toggleClass("mobile-menu-open " + self.name());
        };

        self.openMenu = function () {
            self.isMenuOpen(true);
            $('body').addClass("mobile-menu-open " + self.name());
        };

        self.closeMenu = function () {
            self.isMenuOpen(false);
            $('body').removeClass("mobile-menu-open " + self.name());
        };
		
		self.isMenuOpen.subscribe(function () {
            if (!self.isMenuOpen())
                ko.utils.arrayForEach(self.data(), function (navigation) {
                    navigation.isItemOpen(false);
                });
		});

		self.navOverflow = function (element, options) {
		    $(window).resize(function () {
		        clearTimeout(navOverflow);
		        setTimeout(navOverflow, 250);

		        function navOverflow() {
		            self.hasHiddenItems(false);

		            var childItemWidthSum = 0;
		            var containerWidth = $(element).width();

		            self.data().forEach(function (item) {
		                item.isHidden(false);
		            });

		            $(element).children().each(function (i) {
		                var childItemWidth = $(this).outerWidth();
		                childItemWidthSum += childItemWidth;

                        if (childItemWidthSum > containerWidth) {
		                    self.data()[i].isHidden(true);

		                    self.hasHiddenItems(true);
                            
		                    for (var j = i; j < self.data().length; j++) {
		                        self.data()[j].isHidden(true);
		                    }

		                    var toggleWidth = (options && options.toggle) ? $(options.toggle).outerWidth() : $('.c-navigation__toggle').outerWidth();

		                    containerWidth = containerWidth - toggleWidth;
		                    childItemWidthSum = childItemWidthSum - childItemWidth;

		                    if (childItemWidthSum > containerWidth) {
		                        self.data()[i - 1].isHidden(true);
		                    }

		                    for (var j = (i - 1) ; j > 0; j--) {
		                        var itemWidth = $(element).children().eq(j).outerWidth();

		                        childItemWidthSum = childItemWidthSum - itemWidth;

		                        if (childItemWidthSum > containerWidth) {
		                            self.data()[j].isHidden(true);
		                        }
		                    }

		                    return;
		                }
		            });
		        }
		    }).trigger('resize');
		};

        self.addAllAccessBadge = function (data, custom_filter_function) {
            var deferred = $.Deferred();

		    var last_visit_cookie = cookie.get_cookie('last_visit'),
                last_visit_date = moment(last_visit_cookie).isValid() ? moment(last_visit_cookie).format() : moment().subtract(2, 'weeks').format();

            cookie.set_cookie("last_visit", moment().format(), moment().add(1, "months").toDate());

            var main_nav_watch_links = [];

            if (custom_filter_function && typeof custom_filter_function == 'function') {
                main_nav_watch_links = data.filter(custom_filter_function);
            }
            else {
                main_nav_watch_links = data.filter(function (item) {
                    return item.url.indexOf('/watch') > -1;
                });

                if (main_nav_watch_links.length === 0) {
                    main_nav_watch_links = data.filter(function (item) {
                        return item.title().toLowerCase().indexOf('watch') > -1;
                    });
                }
            }            

		    if (main_nav_watch_links.length > 0) {
                $.getJSON("/services/allaccess.ashx/media/getCount", {
                    since_date: last_visit_date,
                    type: 'Archive',
                })
                .done(function (num_new_videos) {
                    num_new_videos = num_new_videos > 9 ? 9 : num_new_videos > 0 ? num_new_videos : '';

                    main_nav_watch_links[0].title(main_nav_watch_links[0].title() + "<span class='sidearm-navigation-badge sidearm-navigation-badge--alert' aria-label='" + (num_new_videos > 0 ? num_new_videos + " New Videos" : "Videos Available") + "'>" + num_new_videos + "</span>");

                    deferred.resolve();
                })
                .error(function (error) { deferred.reject() });
            }
            else {
                deferred.resolve();
            }

            return deferred.promise();
		}
		
		self.getData = function () {
            var promise = self.getComponentData(self.sport_id > 0 ? "sport-navigation" : "main-navigation");
            promise.success(function (data) {
                self.loadData(data);
            });
        };
        
        if (self.component) {
            self.loadData(self.component.data);
			if (self.component.extra)
                self.sport = self.component.extra.sport;
        }
        else
            self.getData();

    }

    return {
        viewModel: navigationModel
    };
});