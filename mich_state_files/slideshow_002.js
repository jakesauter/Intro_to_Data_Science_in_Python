define(['knockout', 'models/showcase-player'], function (ko, ShowcasePlayer) {
    var Slideshow = function (data) {
        var self = this;
        self.id = data.id;
        self.title = data.title;
        self.subtitle = data.subtitle;
        self.teaser = data.teaser;
        self.start_date = data.start_date;
        self.primary_link = data.primary_link;
        self.links = data.links;
        self.showcase = ko.observable(null);
        self.video = data.video;
        self.primary_image = data.primary_image;
        self.secondary_image = data.secondary_image;
        self.single_primary_image = data.primary_image != null && data.primary_image.images.length > 0 ? data.primary_image.images[0].image : null;
        self.single_secondary_image = data.secondary_image != null && data.secondary_image.images.length > 0 ? data.secondary_image.images[0].image : null;
        self.selected = ko.observable(false);

        self.openSlideshow = function () {
            self.selected(true);
        }

        self.closeSlideshow = function () {
            self.selected(false);
        }

        self.toggleSlideshow = function () {
            self.selected(!self.selected());
        }

        if (data.video)
            self.showcase(new ShowcasePlayer($.extend(data.video, { autoplay: false, component: 'slideshow' })));
    };

    return Slideshow;
});