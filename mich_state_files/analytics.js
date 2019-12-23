define([], function(){
    return {
        trackers: function() {
            if ("ga" in window) {
                if (typeof value === "undefined") { 
                    value = 1;
                }
                var trackers = ga.getAll();

                return trackers;
            } else {
                return null;
            }
        },

        trackEvent: function (category, action, label, value) {
            var trackers = this.trackers();

            if (trackers){
                trackers.forEach(function(tracker) {
                    tracker.send({
                        hitType: 'event',
                        eventCategory: category,
                        eventAction: action,
                        eventLabel: label,
                        eventValue: value
                    });
                });
            }
        },

        trackPageView: function (location) {
            var trackers = this.trackers();

            if (trackers) {
                trackers.forEach(function (tracker) {
                    tracker.send({
                        hitType: 'pageview',
                        page: location
                    })
                })
            }
        }
    }
});