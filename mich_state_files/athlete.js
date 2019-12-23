define(['knockout'], function (ko) {
    var Athlete = function (data) {
        var self = this;

        self.id = data.id;
        self.firstname = data.firstname;
        self.lastname = data.lastname;
        self.name = ko.computed(function () {
            return self.firstname + ' ' + self.lastname;
        });
        self.position_long = data.position_long;
        self.position_short = data.position_short;
        self.player_hometown = data.player_hometown;
        self.rp_weight = data.rp_weight;
        self.rp_height_feet = data.rp_height_feet;
        self.rp_height_inches = data.rp_height_inches;
        self.academic_year = data.academic_year;
        self.jersey_number = data.jersey_number;
        self.sport = data.sport;
        self.image = data.image;
    };

    return Athlete;
});
