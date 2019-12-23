define(['knockout'], function (ko) {
    var Game = function (data) {
        var self = this;

        self.type = data.type;
        self.date = data.date,
        self.end_date = data.end_date,
        self.date_utc = data.date_utc,
        self.end_date_utc = data.end_date_utc,
        self.time = data.time,
        self.isDoubleheader = data.is_doubleheader,
        self.tbd = data.tbd,
        self.allday = data.allday,
        self.team_prefix = data.team_prefix,
        self.id = data.id,
        self.showAtVs = data.show_atvs,
		self.status = data.status,
        self.countdown_enabled = data.countdown_enabled,
        self.locationIndicator = data.location_indicator,
        self.location = data.location,
        self.isConference = data.is_conference;
        self.conference = data.conference;
        self.conference_abbrev = data.conference_abbrev;
        self.conference_logo = data.conference_logo;
        self.isSpotlight = data.is_spotlight,
        self.sport = data.sport,
        self.opponent = data.opponent,
        self.media = data.media,
        self.result = data.result,
        self.story = data.story;
        self.facility = data.game_facility;
        self.promotion = data.promotion;
		self.tournament = data.tournament;
		self.selected = ko.observable(false);
		self.isLive = ko.observable(false);
        self.liveStats = ko.observable();
        self.pac_tickets = data.pac_tickets;
        self.now = ko.observable(moment.utc());
        self.then = moment(data.date_utc);
        self.days = ko.observable(0);
        self.hours = ko.observable(0);
        self.mins = ko.observable(0);
        self.secs = ko.observable(0);

        if (data.pac_tickets && data.pac_tickets.ticketLink && data.media && data.media.tickets) {
            try {
                var events = ga.getAll()[0].get("linkerParam");
                data.pac_tickets.ticketLink = data.pac_tickets.ticketLink + '&' + events;
                data.media.tickets = data.media.tickets + '&' + events;
            } catch (error) { }
        }

        if (self.countdown_enabled) {
            self.now.subscribe(function () {
                var _diff = self.then.diff(self.now());
                
                if (_diff > 0) {
                    self.days(self.then.diff(self.now(), 'days'));
                    self.hours(self.then.diff(self.now(), 'hours') % 24);
                    self.mins(self.then.diff(self.now(), 'minutes') % 60);
                    self.secs(self.then.diff(self.now(), 'seconds') % 60);
                }
                else {
                    self.days(0);
                    self.hours(0);
                    self.mins(0);
                    self.secs(0);
                    clearInterval(timer);
                }
            }),

            self.incrementTimer = function () {
                self.now(self.now().add(1 ,'s'));
            };

            var timer = setInterval(self.incrementTimer, 1000);
        }
		self.facilityOrLocation = ko.computed(function() {
			if (self.facility != null) {
				if (self.facility.url)
					return "<a href='" + self.facility.url + "'>" + self.facility.title + "</a>";
				return self.facility.title;
			}
			return self.location;
		});
		
        self.atVs = ko.computed(function () {
            if (self.locationIndicator === "A")
                return "at";
            else
                return "vs";
        });
		
		self.hasMedia = ko.computed(function () {
			if (self.media == null)
                return false;
            if (self.media.tickets || self.media.video || self.media.audio || self.media.stats || self.media.tv || self.media.radio)
                return true;
            return false;
		});

		self.checkLiveStatus = ko.computed(function () {
		    var now = moment().utc();

		    if (!self.date_utc || moment(self.date_utc).isBefore(now, 'day'))
		        return;

		    if (now.isBetween(self.date_utc, self.end_date_utc) || now.isBetween(self.date_utc, moment(self.date_utc).utc().add(2, 'hours')) )
		        self.isLive(true);
		});
		
		self.openGame = function (game) {
            self.selected(true);
        }

        self.closeGame = function () {
            self.selected(false);
        }

        self.toggleGame = function () {
            self.selected(!self.selected());
        }

        self.showDynamicAd = false;
    };

    return Game;
});