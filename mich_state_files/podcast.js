define(['knockout'], function (ko) {
    var Podcast = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.publish_date = data.publish_date;
        self.created_date = data.created_date;
        self.description = data.description;
        self.filename = data.filename;
        self.image = data.image;
        self.sport = data.sport;
        self.url = data.url;
    };

    return Podcast;
});