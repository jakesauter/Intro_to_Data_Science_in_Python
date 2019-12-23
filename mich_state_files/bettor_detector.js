require(['config'], function(config) {
    require(['jquery', 'knockout', 'cookie', 'text'], function ($, ko, cookie, text) {
        $(function() {
            
            //disable check for Siteimprove scans
            if (navigator.userAgent.toLowerCase().indexOf("siteimprove") < 0) {
                
                if (cookie.get_cookie('sidearm-adblock-banner_consent')) {
                    return;
                }

                var deferred = $.Deferred();

                if (window.dev_mode_enabled) {
                    require(['analytics'], function() { 
                        deferred.resolve();
                    }, function() {
                        deferred.reject();
                    });
                }
                else {
                    deferred.resolve();
                }

                deferred.then(function(success) {
                    $.get('/common/templates/dfp/dfp-component-template.html')
                        .then(function(response) { }, function(error) {
                            show_ad_blocker_blocked_modal();
                        });
                }, function(error) {
                    show_ad_blocker_blocked_modal()
                });

                function show_ad_blocker_blocked_modal() {
                    ko.components.register('adblock-modal-component', {
                        viewModel: { require: 'components/adblock-modal' },
                        template: { require: 'text!/components/templates/adblock-modal-component-template.html' }
                    });

                    $('body').append('<div data-bind="stopBindings:true"><div id="sidearm-adblock-modal"><adblock-modal-component params="{}"></adblock-modal-component></div></div>');

                    ko.applyBindings({}, $('#sidearm-adblock-modal')[0]);
                }
            }
        });
    });
});