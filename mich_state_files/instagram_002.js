define(['knockout'], function (ko) {
    var Instagram = function (data) {
        var self = this;

        self.id = data.id;
        self.tags = data.tags;
        self.comments = data.comments;
        self.created_time = data.created_time;
        self.images = data.images;
        self.caption = data.caption;
        self.likes = data.likes;
        self.link = data.link;
        self.user = data.user;
        self.date = data.date;

        self.showDynamicAd = false;
    };

    return Instagram;
});