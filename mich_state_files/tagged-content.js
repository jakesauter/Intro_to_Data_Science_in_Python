define(['knockout', 'models/tag'], function (ko, Tag) {
    var TaggedContent = function (data) {
        var self = this;

        self.section = data.section;
        self.title = data.title;
        self.url = data.url;
        self.sports = data.sports;
        self.tags = data.tags.map(function (tag) {
            return new Tag(tag);
        });
        self.image = data.image;
    };

    return TaggedContent;
});