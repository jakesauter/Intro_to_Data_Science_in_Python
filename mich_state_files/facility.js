define(['knockout'], function (ko) {
    var Facility = function (data) {
        var self = this;

        self.id = data.id;
        self.description = data.description;
        self.featured = data.featured;
        self.featured_image = data.featured_image;
        self.images = data.images;
        self.location = data.location;
        self.teaser = data.teaser;
        self.title = data.title;
        self.url = data.url;
        self.selected = ko.observable(false);

        self.openItem = function (item) {
            self.selected(true);
        }

        self.closeItem = function () {
            self.selected(false);
        }

        self.toggleItem = function () {
            self.selected(!self.selected());
        }
    };

    return Facility;
});
