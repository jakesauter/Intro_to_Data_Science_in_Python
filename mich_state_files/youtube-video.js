define(['knockout', 'models/showcase-player'], function (ko, ShowcasePlayer) {
    var YoutubeVideo = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.date = data.published_date;
        self.description = data.description;
        self.duration = data.duration;
        self.views = data.views;
        self.likes = data.likes;
        self.favorites = data.favorites;
        self.images = {
            default: data.default.url,
            medium: data.medium.url,
            high: data.high.url,
            standard: data.standard === null ? '' : data.standard.url,
            maxres: data.maxres == null ? '' : data.maxres.url
        }
        self.showcase = ko.observable(new ShowcasePlayer({ youtube: '//youtube.com/watch?v=' + self.id, title: data.title, component: 'youtube' }));

        self.showDynamicAd = false;
    };

    return YoutubeVideo;
});