define(['knockout','models/facebook-item'], function (ko,FacebookItem) {
    var FacebookLink = function (data) {
        var self = this;
        FacebookItem.call(self,data);

        self.name = data.name;
        self.icon = data.icon;
        self.picture = data.picture;
        self.caption = data.caption;
    };

    return FacebookLink;
});