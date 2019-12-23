define(['knockout'], function (ko) {
    var Tag = function (data) {
        var self = this;

        self.id = data.id;
        self.name = data.name;
        self.slug = data.slug;
        self.count = data.count;
        self.url = data.url;
    };

    return Tag;
});