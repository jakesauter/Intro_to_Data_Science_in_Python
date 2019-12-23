define(['knockout', 'components/component', 'models/standings', 'underscore'], function (ko, Component, Standings, _) {
    function standingsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.instance = ko.observable();
        self.allStandings = ko.observableArray();
        self.selectedStandings = ko.observable();

        self.getData = function () {
            var promise = self.getComponentData("standings-list");
            promise.success(function (data) {
                self.allStandings(data.data);

                self.selectedStandings.subscribe(function () {
                    self.isInitializing(true);
                    var promise = self.getComponentData("standings", { extra: JSON.stringify({ global_sport_id: self.selectedStandings() }) });
                    promise.success(function (data) {
                        if (data == null) {
                            self.instance(null);
                            self.isInitializing(false);
                        } else {
                            self.loadData(data.data);
                        }
                    });
                });

                var default_sport = _.find(self.allStandings(), function (standing) {
                    return standing.global_sport_id == (window.associated_sport ? window.associated_sport.global_sport_id : 0);
                });

                if (default_sport) {
                    self.selectedStandings(default_sport.global_sport_id);
                } else {
                    self.selectedStandings(self.allStandings()[0].global_sport_id)
                }
            });
        };

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var standings = ko.utils.arrayMap(data, function (item) {
                    return new Standings(item);
                });

                self.data.push.apply(self.data, standings);
            }
            else if (data != null && !Array.isArray(data)) {
                self.instance(new Standings(data));
            }
            else {
                self.moreToLoad(false);
            }
            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData();
    }

    return {
        viewModel: standingsModel
    };
});