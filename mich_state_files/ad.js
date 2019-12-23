define(['knockout'], function (ko) {
    var Ad = function (component) {
        var self = this;

        self.location = component.data.location;
        self.campaigns = ko.observableArray(component.data.campaigns);
    };

    return Ad;
});