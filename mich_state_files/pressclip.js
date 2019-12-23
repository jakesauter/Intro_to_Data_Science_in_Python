define(['knockout'], function (ko) {
    var PressClip = function (data) {
        var self = this;

        self.id = data.id;
        self.author = data.author;
        self.date = data.date;
        self.image = data.image;
        self.link = data.link;
        self.open_in_new_window = data.open_in_new_window;
        self.title = data.title;
        self.summary = data.summary;
        self.sport = data.sport;
        self.source = data.source;
    };

    return PressClip;
});
