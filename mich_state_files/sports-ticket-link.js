define(['knockout'], function (ko) {
    var SportsTicketLink = function (data) {
        var self = this;

        self.link = data.link;
        self.sport = data.sport;
    };

    return SportsTicketLink;
});