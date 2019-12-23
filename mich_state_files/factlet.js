define(['knockout'], function (ko) {
    var Factlet = function (data) {
        var self = this;

        self.id = data.id;
        self.title = data.title;
        self.date = data.date;
        self.image = data.image;
        self.description = data.description;
        self.type_id = data.type_id;
        self.type_title = data.type_title;
    };

    return Factlet;
});