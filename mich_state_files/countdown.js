define(['knockout', 'models/game', 'moment'], function (ko, Game) {
    var Countdown = function (data) {
        var self = this;

        self.title = data.title;
        self.now = ko.observable(moment(data.local_date_time));
        self.then = moment(data.game.date);
        
        self.days = ko.observable(0);
        self.hours = ko.observable(0);
        self.mins = ko.observable(0);
        self.secs = ko.observable(0);
        
        self.game = new Game(data.game);
        self.ad = data.ad;

        if (!self.game.locationIndicator)
            self.game.atVs = "";

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

        self.incrementTimer = function() {
            self.now(self.now().add('s', 1));
        };

        var timer = setInterval(self.incrementTimer, 1000);
    };

    return Countdown;
});