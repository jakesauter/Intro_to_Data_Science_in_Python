define(['knockout'], function (ko) {
    var Gallery = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.date = data.date;
        self.images = data.images;
        self.gallery_images = data.gallery_images;
        self.url = data.url;
        self.sport = data.sport;
        self.selected = ko.observable(false);

        self.openGallery = function (gallery) {
            self.selected(true);
        }

        self.closeGallery = function () {
            self.selected(false);
        }

        self.toggleGallery = function () {
            self.selected(!self.selected());
        }

        self.showDynamicAd = false;
    };

    return Gallery;
});
