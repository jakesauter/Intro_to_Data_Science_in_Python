require([
        "config",
        "jquery",
        "knockout",
        "text",
        "options",
        "detector",
        "lazySizes",
        "moment",
        "cookie",
        "koFastForeach",
		"lazyload",
        "statcollector",
        "switch-case",
        "showcaseplayerembed",
		"picturefill",
        "binding-handlers",
        "analytics",
        "components/all-access",
        "components/awards",
        "components/cbs-store-feed",
        "components/component",
        "components/content-stream",
		"components/countdown",
        "components/events",
        "components/evergreen",
        "components/facebook",
        "components/facilities",
        "components/factlets",
        "components/fanatics",
        "components/galleries",
        "components/gallery-embed",
        "components/instagram",
        "components/live-streams",
        "components/navigation",
        "components/podcasts",
        "components/poll",
		"components/pressclips",
        "components/promotions",
        "components/head-coach",
        "components/results",
        "components/scoreboard",
        "components/search",
        "components/season-standings",
        "components/slideshow",
		"components/sports",
        "components/sports-ticket-links",
        "components/standings",
        "components/stat-leaders",
        "components/stat-leaders-group",
        "components/stories",
        "components/random-athletes",
        "components/tags",
        "components/tagged-content",
        "components/trending",
        "components/twitter",
        "components/view-as",
        "components/weather",
        "components/youtube",
        "components/tickets",
        "components/paciolan-events"
    ],
    function (config, $, ko, text, options, adBlock, LazyLoad, moment, cookie) {
        window.ko = ko;

        var template_path = window.ko_components_template_path || '/site/templates/';
        window.show_gdpr_modal = ko.observable(false);

        var consent_cookie = cookie.get_cookie('gdpr_consent');
        var consent_cookie_ie11 = cookie.get_cookie('sidearm-ie-11-banner_consent');
        var consent_cookie_adblock = cookie.get_cookie('sidearm-adblock-banner_consent');

        function gdpr_country_check() {
            var gdpr_countries = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"];

            $.getJSON('https://pro.ip-api.com/json/?fields=countryCode,query&key=wZrY6Rb02N7rjlz&callback=?', function (data) {
                if (gdpr_countries.indexOf(data.countryCode) >= 0) {
                    window.show_gdpr_modal(true);
                } else {
                    if (consent_cookie !== 'true' && window.cbs_school) {
                        if (data.query == '128.230.84.52'){
                            window.show_gdpr_modal(true);
                        }
                    }
                }
            });
        };

        if (consent_cookie !== 'true' && window.cbs_school) {
            $('body').append('<gdpr-modal-component params="{}"></gdpr-modal-component>');

            gdpr_country_check();
        }

        window.show_ie_banner = ko.observable(false);

        function ie_11_check(){
            if(!(window.ActiveXObject) && "ActiveXObject" in window){
                if (consent_cookie_ie11 !== 'true') {
                    window.show_ie_banner(true);
                    $('body').append('<ie-11-component params="{}"></ie-11-component>');
                }
            }
            else{
                window.show_ie_banner(false);
            }
        };

        ie_11_check();

        if (!disable_ad_blocker_check && consent_cookie_adblock !== 'true') {
            var adBlock = new adBlock();
        // adBlock.checkForAdBlock();
        }

        ko.bindingHandlers.stopBinding = {
            init: function() {
                return { controlsDescendantBindings: true };
            }
        };
        var settings = new options();

        function custom_component(name, vm_path, template_path) {
            this.name = name;
            this.vm_path = vm_path;
            this.template_path = template_path;
        }

        var _custom_components = [
            new custom_component('ads', 'components/promotions', '/common/templates/promotions/promotions-component-template.html'),
            new custom_component('all-access'),
            new custom_component('awards'),
            new custom_component('cbs-store-feed'),
            new custom_component('common-countdown', 'components/countdown', '/components/templates/common-countdown-component-template.html'),
            new custom_component('content-stream'),
            new custom_component('countdown'),
            new custom_component('dfp', 'components/evergreen', '/common/templates/dfp/dfp-component-template.html'),
            new custom_component('events'),
            new custom_component('facebook'),
            new custom_component('facilities'),
            new custom_component('factlets'),
            new custom_component('fanatics'),
            new custom_component('galleries'),
			new custom_component('gallery-embed', 'components/gallery-embed', '/components/templates/gallery-embed-component-template.html'),
            new custom_component('gdpr-modal', 'components/gdpr-modal', '/components/templates/gdpr-modal-component-template.html'),
            new custom_component('ie-11', 'components/ie-11-modal', '/components/templates/ie-11-component-template.html'),
            new custom_component('adblock-modal', 'components/adblock-modal', '/components/templates/adblock-modal-component-template.html'),
            new custom_component('instagram'),
            new custom_component('live-streams'),
            new custom_component('navigation'),
            new custom_component('next-event', 'components/events', '/components/templates/next-event-component-template.html'),
            new custom_component('podcasts'),
            new custom_component('poll'),
            new custom_component('pressclips'),
            new custom_component('tags', 'components/tags', '/components/templates/tags-component-template.html'),
            new custom_component('tagged-content', 'components/tagged-content', '/components/templates/tagged-content-component-template.html'),
            new custom_component('trending'),
            new custom_component('random-athletes'),
            new custom_component('head-coach'),
            new custom_component('results'),
            new custom_component('scoreboard'),
            new custom_component('search'),
            new custom_component('season-standings'),
			new custom_component('slideshow'),
            new custom_component('sports'),
            new custom_component('sports-ticket-links'),
            new custom_component('stat-leaders'),
			new custom_component('stat-leaders-group', 'components/stat-leaders-group', '/components/templates/stat-leaders-group-component-template.html'),
            new custom_component('standings'),
            new custom_component('stories'),
            new custom_component('tickets', 'components/tickets', '/components/templates/tickets-component-template.html'),
            new custom_component('paciolan-events'),
            new custom_component('twitter'),
            new custom_component('view-as', 'components/view-as', '/components/templates/view-as-component-template.html'),
            new custom_component('weather'),
            new custom_component('youtube'),
        ];

        _custom_components.forEach( function (component) {
            if (!component.vm_path)
                component.vm_path = 'components/' + component.name;

            if (!component.template_path)
                component.template_path = template_path + component.name + '-component-template.html'

            ko.components.register(component.name + '-component', {
                viewModel: { require: component.vm_path },
                template: { require: 'text!' + component.template_path }
            });
        });

		ko.observable.fn.matchMedia = function(query) {
            syncWithMatchMedia(this, query);
            return this;
        };

        self.syncWithMatchMedia = function(observable, mediaQuery) {
            var query = window.matchMedia(mediaQuery);
            observable(query.matches);
            query.addListener(function(query) {
                observable(query.matches);
            });
        };

        self.xsmall = ko.observable().matchMedia("(min-width: 0px) and (max-width: 399px)"),
        self.xsmallUp = ko.observable().matchMedia("(min-width: 0px)"),
        self.small = ko.observable().matchMedia("(min-width: 400px) and (max-width: 539px)"),
        self.smallUp = ko.observable().matchMedia("(min-width: 400px)"),
        self.smallDown = ko.observable().matchMedia("(max-width: 539px)"),
        self.medium = ko.observable().matchMedia("(min-width: 540px) and (max-width: 767px)"),
        self.mediumUp = ko.observable().matchMedia("(min-width: 540px)"),
        self.mediumDown = ko.observable().matchMedia("(max-width: 767px)"),
        self.large = ko.observable().matchMedia("(min-width: 768px) and (max-width: 1023px)"),
        self.largeUp = ko.observable().matchMedia("(min-width: 768px)"),
        self.largeDown = ko.observable().matchMedia("(max-width: 1023px)"),
        self.xlarge = ko.observable().matchMedia("(min-width: 1024px) and (max-width:1439px)"),
        self.xlargeUp = ko.observable().matchMedia("(min-width: 1024px)")
        self.xlargeDown = ko.observable().matchMedia("(max-width: 1439px)")
        self.xxlargeUp = ko.observable().matchMedia("(min-width:1440px)")

		window.picturefill();

		wait_for_all_components_to_be_registered().then(function () {
		    var wait_for_preloaded_templates = setInterval(function () {
		        if (!window.preloaded_templates_are_rendering) {
		            clearInterval(wait_for_preloaded_templates);

		            ko.applyBindings({});
                    i_will_try_try_try_again_to_render_the_ads_component_template_when_empty();
		        }
		    }, 100);
        });

        function i_will_try_try_try_again_to_render_the_ads_component_template_when_empty() {
            var times_run = 0;
            var binding_checker = setInterval(function () {
                times_run++;
                var clear_interval = true;
                $("ads-component").each(function (i, el) {
                    try {
                        if (!(isBound(el)) || $(el).html() == "") {
                            applyBindingsToEl(el);
                            clear_interval = false;
                        }
                    }
                    catch (ex) { }
                });
                if (clear_interval || times_run >= 5) {
                    clearInterval(binding_checker);
                }
            }, 5000);
        }

        function isBound(el) {
            return !!ko.dataFor(el);
        }

        function applyBindingsToEl(el) {
            try {
                ko.applyBindings({}, el);
            }
            catch (ex) { console.log("error reapplying bindings", ex); }
        }

        function youtubeWorkaround(){
            $("iframe[src*='youtube.com/embed']")
              .each(function(i, iframe){
                if ($(iframe).is(".prevent-sidearm-player")) return;
                var src = $(iframe).attr("src");
                var content_title = $("meta[property='og:title']").attr("content") || $("title").text().trim();

                if (src && src.indexOf("youtube.com") > -1 && src.indexOf("embed.aspx") === -1) {
                  $(iframe).attr("src", "/showcase/embed.aspx?title=" + encodeURIComponent(content_title) + "&youtube=" + encodeURIComponent(src) + "&autoplay=false");
                }
              });
        }

		function wait_for_all_components_to_be_registered() {
			var _deferred = $.Deferred();

			var _interval = setInterval(function() {
				if (are_all_components_registered()) {
					clearInterval(_interval);
					_deferred.resolve();
				}
			}, 100);

			return _deferred.promise();
		}

		function are_all_components_registered() {
			for (var i = 0; i < _custom_components.length; i++) {
                var component_tag = _custom_components[i].name + '-component';

				if (!ko.components.isRegistered(component_tag)) {
					return false;
				}
			}
			return true;
		}

        setInterval(youtubeWorkaround, 250);

		$(window).on('beforeunload', function () {
		    var _ads_list = settings.all_ads;
		    if (!_ads_list) return;

		    var _url = '/services/ad_counter.aspx?ad_id=';
		    _ads_list.map(function(id) {
		        _url += id + ",";
		    });
			_url = _url.slice(0, -1);

		    if (navigator.sendBeacon)
		        navigator.sendBeacon(_url, {});
		    else
		        $.ajax({
		            url: _url,
		            async: false
		        });
		});
    }, function (err) {
        var _error = err.requireModules && err.requireModules[0];
        if (_error === "components/evergreen" || _error === "components/promotions") {
            require(['detector'], function (adBlock) {
                var _adBlock = new adBlock();
                _adBlock.adBlockDetected();
            });
        }
	}
);