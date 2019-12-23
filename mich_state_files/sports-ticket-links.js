define(['knockout', 'components/component', 'models/sports-ticket-link'], function (ko, Component, SportsTicketLink) {
    function sportsTicketLinksModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.selectedTicketLink = ko.observable();

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var sportsTicketLinks = ko.utils.arrayMap(data, function (sportsTicketLink) {
                    return new SportsTicketLink(sportsTicketLink);
                });
                
                self.data.push.apply(self.data, sportsTicketLinks);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("sports-ticket-links");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        if (self.component)
            self.loadData(self.component.data);
        else
            self.getData();

        self.openTicketLink = function () {
            if (self.selectedTicketLink()) {
                window.open(self.selectedTicketLink(),'_blank');
                return false;
            };
        }
    }

    return {
        viewModel: sportsTicketLinksModel
    };
});