define(['knockout'], function (ko) {
    var LiveStream = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.start_date = data.start_date;
        self.end_date = data.end_date;
        self.note = data.note;
        self.format = data.format;
        self.free = data.free;
        self.url = '/watch/?Live=' + self.id;
        self.image = data.image;
        self.sport = data.sport;
        self.category = data.category;
        self.selected = ko.observable(false);
        self.isLive = ko.observable(false);

        self.openVideo = function () {
            self.selected(true);
        }

        self.closeVideo = function () {
            self.selected(false);
        }

        self.toggleVideo = function () {
            self.selected(!self.selected());
        }

        self.checkLiveStatus = ko.computed(function () {
		    var now = moment().utc();

		    if (!self.start_date || moment(self.start_date).isBefore(now, 'day'))
		        return;

		    if (now.isBetween(self.start_date, self.end_date))
		        self.isLive(true);
		});

        self.showDynamicAd = false;
    };

    return LiveStream;
});