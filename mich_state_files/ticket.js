define(['knockout'], function (ko) {
    var GameTicketInfo = function (data) {
        var self = this;
        self.id = data.id;
        self.date = data.date;
        self.end_date = data.end_date;
        self.date_utc = data.date_utc;
        self.end_date_utc = data.end_date_utc;
        self.time = data.time;
        self.status = data.status;
        self.locationIndicator = data.locationIndicator;
        self.location = data.location;
        self.isConference = data.isConference;
        self.sport = data.sport;
        self.opponent = data.opponent;
        self.game_time = data.game_time;
        self.link = data.link;
        self.title = data.title;
        self.sub_headlines = data.sub_headlines;
        self.tickets = data.tickets;
        self.options = data.options;
        self.own_opponent = data.own_opponent;
        self.versus_text = data.versus_text;

        try {
            ga(function () {
                var events = ga.getAll()[0].get("linkerParam");
                self.link.url = self.link.url + "&" + events;
            });
        } catch (error) {
            console.log(error);
        }

        self.atVs = ko.computed(function () {
            if (self.locationIndicator === "A")
                return "at";
            else
                return "vs";
        });

        self.sub_headline_random = ko.computed(function () {
            if (self.sub_headlines && self.sub_headlines.length > 0)
                return self.sub_headlines[Math.floor(Math.random() * self.sub_headlines.length)].text;

            return null;
        });
    };

    return GameTicketInfo;
});