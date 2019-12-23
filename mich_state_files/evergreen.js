define(['knockout', 'components/component', 'jquery', 'tsdist/cbs-surround','ssGptHeaderBidding'], function (ko, Component, $) {

    var pageTargetting = window.cbs_ads_activated ? PageTargetting.getPageLevel() : null;
    var middleCount = 0;
    var hasAssignedTopForWidth = {};

    $(window).off('.targetting-criteria').on('keyup.targetting-criteria', function(e){
        if (e.ctrlKey && e.which === 120) {
            var $table = $('.targetting-criteria');

            if ($table.length === 0) {
                var html = '<div><h5>Targetting Criteria</h5><table>' + Object.keys(window.targetting_criteria).map(function(key){ 
                return '<tr><th>' + key + '</th><td>' + window.targetting_criteria[key] + '</td></tr>'; }).join('') + '</table></div>';

                $table = $(html).addClass('targetting-criteria').css({
                    background:'#fff',
                    color:'#000',
                    borderCollapse: 'collapse',
                    position:'fixed',
                    left:0,
                    top:0,
                    padding:'2px 4px',
                    zIndex:99999
                }).hide().appendTo('body');

                $table.find('th, td').css('padding', '2px 4px');
                $table.find('th').css({
                    fontWeight:'bold',
                    textAlign:'right'
                });
            }

            $table.slideToggle();
        }
    });

    function dfpModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
        self.sidearm_dfp = params.sidearm_dfp;
        self.ad;
        self.networkCode = window.dfp_network_code || "29658103";
        self.slot;
        self.unitName;
        self.dimensions;
        self.id = uniqueId(params.name);
        self.sizes = params.sizes;
        self.width = ko.observable(0);
        self.height = ko.observable(0);
        self.data([{}]);
        self.effect = params.effect;

        // previously this checked window.googletag, 
        // but since that can be defined before actually loading gpt, we need a different marker for that
        // there's probably a better way to do this, but this works for now.
        if (!window.gpt_load_initiated) {
            window.gpt_load_initiated = true;
            var useSSL = 'https:' == document.location.protocol; 
            var src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
            window.googletag = window.googletag || {
                cmd:[]
            };
            googletag.cmd.push(function(){
                googletag.pubads().disableInitialLoad();
            });
            var script = document.createElement('script');
            script.src = src;
            document.getElementsByTagName('head')[0].appendChild(script);
        }

        self.renderAd = function () {
            if (window.block_dfp) return;
			var has_email_in_url_exp = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
            if (has_email_in_url_exp.test(location.href)) return;
			
            var width = document.documentElement.clientWidth;
            for (var x = 0; x < self.sizes.length; x++) {
                var _size = self.sizes[x];
                if (width > _size.breakpoint) {

                    if (!_size.enabled && _size.enabled !== undefined)
                        return false;
                    self.unitName = _size.unitName;
                    self.width(_size.dimensions.width);
                    self.height(_size.dimensions.height);
                    var size_list = "";
                    try {
                        size_list = JSON.parse(_size.size_list);
                    }
                    catch (err) {
                        size_list = ""
                    }
                    if (size_list) {
                        var has970x90 = size_list.filter(function(size){ return size[0] === 970 && size[1] === 90; }).length > 0;
                        var has728x90 = size_list.filter(function(size){ return size[0] === 728 && size[1] === 90; }).length > 0;
                        if (has970x90 && !has728x90) {
                            size_list.push([728, 90]);
                        }
                        self.dimensions = size_list;
                    }
                    else {
                        self.dimensions = [self.width(), self.height()];
                    }
                    break;
                }
            }
			
			if (self.unitName === undefined) return false;
            var sidearmextended = self.unitName.indexOf("sidearmextended/adaptive-1");
            if (sidearmextended !== -1 && window.targetting_criteria && window.targetting_criteria.site){
                self.unitName = insert(self.unitName, sidearmextended + "sidearmextended/".length, window.targetting_criteria.site + "/");
            }
            if (window.dfp_network_code) {

                if (self.unitName.substring(0,1) === "/")
                    self.slot = self.unitName;
                //4177 is IMG network code.
				//IMG sites use a single unit name for all spots, prefixed with a forward slash.
                else if (window.dfp_network_code == '4177')
                    self.slot = "/" + window.dfp_network_code + window.img_dfp_unit_name;
                else
                    self.slot = "/" + window.dfp_network_code + "/" + window.targetting_criteria.site + "/" + self.unitName; 
            } else {
                if (self.unitName.substring(0,1) === "/") {
                    self.slot = self.unitName;
                } else {
                    self.slot = "/" + self.networkCode + "/" + self.unitName;
                }
            }

            if (self.dimensions[0] === 0 && self.dimensions[1] === 0) return;

            googletag.cmd.push(function () {

                var $el = $("#" + self.id).css({ textAlign: "center" });
                var isAboveFold = $el.offset().top +  ($el.height()/2) < $(window).height();

                if (pageTargetting) {
                    pageTargetting.applyTo(googletag.pubads());

                    var isInStandardStickyFooter = $el.closest('.c-sticky-leaderboard').length > 0;

                    var isSticky = params.name.toLowerCase().indexOf("sticky") > -1 || 
                        $el.parents().get().filter(function(el) { return $(el).css("position") === "fixed"; }).length > 0;

                    var width = self.width();
                    var isTopForWidth = !hasAssignedTopForWidth[width];

                    var posValue = self.effect === "pos_middle" ? "middle" :
                                   isSticky          ? "sticky" : 
                                   !isAboveFold      ? "bottom" :
                                   isTopForWidth     ? 'top' : 
                                                       'middle' + (++middleCount);

                    if (posValue === "top") {
                        hasAssignedTopForWidth[width] = true;
                    }

                    var keywords = [];

                    if (isInStandardStickyFooter) {
                        keywords.push('kargo')
                    }
                    var additionalKvps = {
                      keyword: keywords
                    };

                    var parsedQuery = location.search.substring(1).split("&").map(function(pairs) { return pairs.split("="); });
                    parsedQuery.forEach(function(pair) {
                        // CBS uses this for testing ad campaigns
                        if (pair[0].startsWith("adTargeting_")) {
                            additionalKvps[pair[0].replace("adTargeting_", "")] = pair[1];
                        }
                    });

                    var slotTargetting = pageTargetting.forUnit(
                         self.unitName.split('/').slice(3).join("/"), 
                         posValue,
                         null,
                         additionalKvps);

                    self.slot = slotTargetting.fullIu;
                    self.ad = googletag.defineSlot(slotTargetting.fullIu, self.dimensions, self.id);
                    slotTargetting.applyTo(self.ad);
                } else {
                    self.ad = googletag.defineSlot(self.slot, self.dimensions, self.id);
                    var criteria = window.targetting_criteria || {};
                    for (var key in criteria) {
                        if (!criteria.hasOwnProperty(key)) continue;
                        googletag.pubads().setTargeting(key, criteria[key]);
                    }

                    var posValue = self.effect === "pos_middle" ? "middle" :
                                    isAboveFold ?  "top" : 
                                                   "bottom";

                    self.ad.setTargeting('pos', posValue);
                    self.ad.setTargeting('location', params.name);
                    if (self.width() === 970 && params.name.toLowerCase().indexOf("sticky") > -1) {
                        self.ad.setTargeting('pos2', 'sticky970x66');
                    }
                }
                self.ad.addService(googletag.pubads());
                
                setTimeout(function(){
                    googletag.cmd.push(function () { googletag.enableServices(); });
                    googletag.cmd.push(function () { 
                        window.sidearmsports.gpt.headerBidding.queueForBiddingOrRefreshImmediately(
                          self.slot,
                          [self.dimensions],
                          self.ad,
                          self.id
                        );
                        googletag.display(self.id);
                    });
                }, 0);
            });
        };
    }
    function insert(str, index, value) {
        return str.substr(0, index) + value + str.substr(index);
    }

    var usedNames = {};
    function uniqueId(name) {
        if (usedNames[name] == null) {
            usedNames[name] = 0;
        };
        return name + (usedNames[name]++);
    };

    return {
        viewModel: dfpModel
    };
});