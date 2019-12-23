define(['knockout', 'components/component', 'slick', 'models/ad', 'options'], function (ko, Component, slick, Ad, options) {
    function adsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.ad = ko.observable(null);
        self.single = ko.observable();
        self.slickOptions = {};
        self.DFPParams = ko.observable({});
        self.randomSlide = 0;

        self.loadData = function (component) {
            self.ad = new Ad(component);

			if (self.ad.campaigns() != null && self.ad.campaigns().length > 0) {
                var settings = new options();

                self.ad.campaigns().map(function (campaign) {
                    settings.all_ads.push(campaign.id);
                });
            }

            if (self.ad.location.type === 'multi' && self.ad.location.effect === 'random') {
                self.randomSlide = Math.floor(Math.random() * self.ad.campaigns().length);
                if (self.randomSlide >= self.ad.campaigns().length) {
                    self.randomSlide = self.ad.campaigns().length - 1;
                }
                self.isInitializing(false);
                return;
            }
			
            if ((self.ad.location.type === 'single' || self.ad.location.type === 'html') && (self.ad.campaigns() != null && self.ad.campaigns().length > 0)) {
                var _campaign = self.ad.campaigns()[0];
				if (self.ad.location.type === 'html') 
					_campaign.html = $('<div/>').html(_campaign.html).text(); 
				self.single(_campaign);
				self.isInitializing(false);
                return;
            }

            if (self.ad.location.slick) {
                if (self.extra() && self.extra().slick_options) {
                    self.slickOptions = self.extra().slick_options;
                } else {
                    if (self.ad.location.slick_options.length > 1) {
                        self.slickOptions = {
                            mobileFirst: true,
                            responsive: self.ad.location.slick_options.map(function (option) {				
							    return {
                                    breakpoint: option.breakpoint,
                                    settings: $.extend({}, {

												    slidesToShow: option.slides_to_show,
												    slidesToScroll: option.slides_to_scroll,
												    dots: option.dots,
												    arrows: option.arrows,
												    autoplaySpeed: (self.ad.location.autoplay_speed * 1000)
											    }, option.extra_options === null ? {} : JSON.parse(JSON.stringify(eval('(' + option.extra_options + ')'))) )

                                };
                            })
                        };
                    }
                    else {
                        var option = self.ad.location.slick_options[0];
                        self.slickOptions = $.extend({}, {
												    slidesToShow: option.slides_to_show,
												    slidesToScroll: option.slides_to_scroll,
												    dots: option.dots,
												    arrows: option.arrows,
												    autoplaySpeed: (self.ad.location.autoplay_speed * 1000)
										    }, option.extra_options === null ? {} : JSON.parse(JSON.stringify(eval('(' + option.extra_options + ')'))) )
                    }
                }
				
				self.isInitializing(false);
                return;
            }

            if (self.ad.location.type === 'multi' && self.ad.location.effect === 'fade') {
                self.slickOptions = {
                    dots: false,
                    arrows: false,
                    fade: true,
                    autoplay: true,
                    autoplaySpeed: (self.ad.location.autoplay_speed * 1000)
                };
				
				self.isInitializing(false);
                return;
            }

            if (self.ad.location.type === 'dfp') {
                self.DFPParams({
                    id: self.id,
                    effect: self.ad.location.effect,
					name: self.ad.location.name,
					title: self.ad.location.title,
                    sidearm_dfp: self.ad.location.sidearm_dfp,
                    sizes: self.ad.location.dfp_sizes.map(function ( size) {
                        if (location.search && location.search.indexOf("google_force_ad_unit=") > -1) { 
                            size.unit_name = location.search.split("google_force_ad_unit=")[1].split("&")[0];
                        }
                        
                        return {
                            breakpoint: size.breakpoint,
                            dimensions: {
                                width: size.width,
                                height: size.height
                            },
                            size_list: size.size_list,
                            unitName: size.unit_name,
                            enabled: size.enabled
                        }
                    })
                });
				
				self.isInitializing(false);
                return;
            }
			self.isInitializing(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("ads");
            promise.success(function (response) {
                self.loadData({ data: response });
            });
        };
                
		if (self.component)
		    self.loadData(self.component);
		else
		    self.getData();
    }
    
    return {
        viewModel: adsModel
    };
});