define(['knockout','models/facebook-item'], function (ko,FacebookItem) {
    var FacebookPhoto = function (data) {
        var self = this;
        FacebookItem.call(self,data);
        self.tags = data.tags;
        self.name = data.name;
        self.icon = data.icon;
        self.story = data.story;
        self.picture = data.picture;
        self.source = data.source;
        self.height = data.height;
        self.width = data.width;
        self.images = data.images;
        self.position = data.position;
        self.object_id = data.object_id;
    };

    return FacebookPhoto;
});