define(['knockout'], function (ko) {
    var Fanatic = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.link = data.link;
        self.price = data.price;
        self.image = data.image;
    };

    return Fanatic;
});