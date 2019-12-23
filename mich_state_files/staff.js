define(['knockout'], function (ko) {
    var Staff = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.email = data.email;
        self.phone = data.phone;
        self.twitter = data.twitter;
        self.firstname = data.firstname;
        self.lastname = data.lastname;
        self.name = ko.computed(function () {
            return self.firstname + ' ' + self.lastname;
        });
        self.custom1 = data.custom1;
        self.custom2 = data.custom2;
        self.custom3 = data.custom3;
        self.custom4 = data.custom4;
        self.sport = data.sport;
        self.image = data.image;
    };

    return Staff;
});
