define(['knockout'], function (ko) {
    var Sport = function (data) {
        var self = this;

        self.id = data.id,
        self.title = data.title,
        self.abbreviation = data.abbreviation,
        self.short_title = data.short_title,
        self.shortname = data.shortname,
        self.facebook = data.facebook,
        self.twitter = data.twitter,
        self.pinterest = data.pinterest,
        self.instagram = data.instagram,
        self.youtube = data.youtube;
        self.tickets = data.tickets;
        self.gender = data.gender;
    };

    return Sport;
});