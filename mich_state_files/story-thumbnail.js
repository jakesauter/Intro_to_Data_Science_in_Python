define(['knockout'], function (ko) {
    var StoryThumbnail = function (data) {
        var self = this;
        self.image = data.image_source;
        self.title = data.title;
        self.url = data.url;
        self.teaser = data.teaser;
        self.date = data.date;
        self.sport = data.sport;
        self.sport_shortname = data.sport_shortname;
        self.video = data.video;
        self.active = ko.observable(false);
    }

    return StoryThumbnail;
});