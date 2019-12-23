define(['knockout', 'components/component', 'models/ticket'], function (ko, Component, GameTicketsInfo) {

    function ticketsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.loadData = function (data) {
            if (data) {
                var game_ticket = ko.utils.arrayMap(data, function (game) {
                    return new GameTicketsInfo(game);
                });
                self.data.push.apply(self.data, game_ticket);
            }
            self.isInitializing(false);
        };

        self.getData = function () {
            var data = {};

            var path = getParameterByName('path');

            $.get('/services/tickets.ashx/next_games_list?global_sport_shortname=' + path, function (resp) {
                if (resp && resp.data != null) {
                    if (resp.data) {
                        self.loadData(resp.data.slice(0, params.count));
                    }
                }
            });
        };

        if (self.dummy()) {
            self.getDummyData("paciolan-events").then(function (data) {
                self.loadData(data);
            });
        }
        else {
            self.getData();
        }

        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    }

    return {
        viewModel: ticketsModel
    };
});