define(['knockout'], function (ko) {
    var Award = function (data) {
        var self = this;

        self.id = data.id;
        self.aow_type_id = data.aow_type_id;
        self.aow_type_title = data.aow_type_title;
        self.firstname = data.firstname;
        self.lastname = data.lastname;
        self.gender = data.gender;
        self.hometown = data.hometown;
        self.highschool = data.highschool;
        self.major = data.major;
        self.previous_team = data.previous_team;
        self.external_link = data.external_link;
        self.sport_title = data.sport_title;
        self.sport = data.sport;
        self.position_short = data.position_short;
        self.position_long = data.position_long;
        self.short_highlights = data.short_highlights;
        self.academic_year = data.academic_year;
        self.academic_year_full = data.academic_year_full;
        self.jersey_number = data.jersey_number;
        self.use_bio_photo = data.use_bio_photo;
        self.image = data.image;
        self.background_image = data.background_image;
        self.url = data.url;
        self.date = data.date;

        self.name = ko.computed(function () {
            return self.firstname + ' ' + self.lastname;
        });

        self.showDynamicAd = false;
    };

    return Award;
});