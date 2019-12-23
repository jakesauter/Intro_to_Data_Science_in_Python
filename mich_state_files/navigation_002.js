define(['knockout', 'options'], function (ko, options) {
    var Navigation = function (data) {
        var self = this;

        self.id = data.id;
        self.title = ko.observable(data.title);
        self.short_title = data.short_title;
        self.rank = data.rank;
        self.column = data.column;
        self.url = data.url,
        self.separator = data.separator,
        self.open_in_new_window = data.open_in_new_window;
        self.items = data.items;
        self.columns = data.columns;
        self.class_name = data.class_name;
        self.ad = data.ad;

        if (self.ad) {
            var settings = new options();
            settings.all_ads.push(self.ad.id);
        }

        self.isHidden = ko.observable(false);
        
        self.isItemOpen = ko.observable(false);

        self.toggleMenuItem = function () {
            if (self.isItemOpen()) {
                self.closeMenuItem();
            } else {
                self.openMenuItem();
            }
        };

        self.openMenuItem = function () {
            self.isItemOpen(true);

            setTimeout(function (){
                $("body").on("click.mobile-menu-id-open-" + self.id, function(){
                    self.closeMenuItem();
                });
            }, 0);
        };

        self.closeMenuItem = function () {
            self.isItemOpen(false);
            $("body").off("click.mobile-menu-id-open-" + self.id);
        };
    };

    return Navigation;
});