define(['knockout', 'components/component', ], function (ko, Component) {
    function searchModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
        
        self.toggled = ko.observable(false);
        self.query = ko.observable("");

        self.search = function () {
            if (self.query()) {
                window.location = '/searchresults.aspx?q=' + self.query();
                return false;
            }
        };

        self.openSearch = function () {
            self.toggled(true);
        };

        self.closeSearch = function () {
            self.toggled(false);
        }

        self.toggleSearch = function () {
            self.toggled(!self.toggled());
        };
    }

    return {
        viewModel: searchModel
    };
});