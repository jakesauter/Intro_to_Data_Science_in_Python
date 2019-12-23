define(['knockout', 'models/showcase-player'], function (ko, ShowcasePlayer) {
    var AllAccessVideo = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.description = data.description;
        self.date = data.date;
        self.views = data.views;
        self.favorites = data.favorites;
        self.poster = data.poster;
        self.sport = data.sport;
        self.category = data.category;
        self.format = data.format;
        self.showcase = ko.observable(new ShowcasePlayer({ Archive: self.id, component: 'all-access' }));
        self.selected = ko.observable(false);

        self.openVideo = function () {
            self.selected(true);
        }

        self.closeVideo = function () {
            self.selected(false);
        }

        self.toggleVideo = function () {
            self.selected(!self.selected());
        }

        self.showDynamicAd = false;
    };

    return AllAccessVideo;
});