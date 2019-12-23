define(['knockout', 'components/component', 'models/game', 'models/game-livestats', 'underscore'], function (ko, Component, Game, GameLiveStats, _) {
    function EventsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
		self.sports = ko.observableArray();
        self.selectedSport = ko.observable();
        self.selectedSportWithButton = ko.observable();
        self.selectedSportWithButtonGo = ko.observable();
        self.featuredGame = ko.observable();
		self.slickSlider = null;
        self.countdown_enabled = false;

        self.loadData = function(data) {
            if (data != null && data.length > 0) {
                var data = ko.utils.arrayMap(data, function (game) {
                    if (self.extra() && self.extra().countdown_enabled)
                        game.countdown_enabled = true;
                    return new Game(game);
                });

                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    data[0].showDynamicAd = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, data);
                    self.liveStats('data');
                } else {
                    self.originalData([]);
                    self.originalData.push.apply(self.originalData, data);
                    self.liveStats('originalData');

                    self.setup_responsive_counts_and_data(self);
                }
            }
            else {
                self.moreToLoad(false);
            }

            if (self.isInitializing()) {

                if (data != null && data.length > 0) {
                    self.featuredGame(self.data()[0]);
                }

                var sports = [];

                $.getJSON("/services/sportnames.ashx").done(function (response) {
                    var _sports = response.sports.map(function (_sport) {

                        if (_sport.sportInfo.is_not_sport == "False" && (_sport.sportInfo.schedule_id || _sport.sportInfo.schedule_id === 0)) {
                            return {
                                id: _sport.sport,
                                abbreviation: _sport.sportInfo.sport__abbrev,
                                shortname: _sport.sportInfo.sport_shortname,
                                title: _sport.sportInfo.sport_title
                            };
                        }

                    }).filter(function (sport) { return !!sport; });
                    _sports.unshift({
                        id: 0,
                        abbreviation: 'All',
                        title: 'Choose Sport',
                        short_title: 'All',
                        shortname: 'all'
                    });
                    self.sports.push.apply(self.sports, _sports);

                    if (self.sport_id !== 0) {
                        var sport_index = self.sports().findIndex(function (sport) {
                            return parseInt(sport.id) === self.sport_id;
                        });
                        if (sport_index > -1) {
                            self.selectedSport(self.sports()[sport_index]);
                        } else {
                            self.selectedSport(self.sports()[0]);
                        }
                    } else {
                        self.selectedSport(self.sports()[0]);
                    }

                    self.isInitializing(false);
                });
            }

            self.isLoadingMore(false);
        };

		self.groupDates = ko.computed(function () {
            var _group = [];
            ko.utils.arrayForEach(
                ko.utils.arrayGetDistinctValues(
                    self.data().map(function(event) {
                        return moment(event.date).startOf('day').format();
                    })
                ).sort(), function (_date) {
                    _group.push({
                        date: _date,
                        events: self.data().filter(function (event) {
                                    if (moment(event.date).isSame(_date, 'day'))
                                        return event;
                                })
                    });
                });

            return _group;
		});

        self.liveStats = function (dataArr) {
            $.getJSON('/services/livestats.ashx').then(function (games) {
                if (!games.Games.length)
                    return;

                self[dataArr]().forEach(function (game) {
                    var liveStats = _.findWhere(games.Games, { "GameId": game.id, "HasStarted": true, "IsComplete": false });

                    if (liveStats) {

                        liveStats['locationIndicator'] = game.locationIndicator;

                        game.isLive(true);

                        if (self.extra() && self.extra().detailedLiveStats) {
                            self.getGameDetailedLiveStats(dataArr, game.id);
                        } else {
                            game.liveStats(new GameLiveStats(liveStats));
                        }

                    }

                });

            });
        };

        self.getGameDetailedLiveStats = function (dataArr, gameId) {
            $.getJSON('/services/livestats.ashx?game_id=' + gameId).success(function (response) {

                var index = self[dataArr]().findIndex(function (game) {
                    return game.id === gameId;
                });

                if (index > -1) {
                    self[dataArr]()[index].liveStats(new GameLiveStats(response));
                }

            });
        }

        self.switchGame = function (game) {
            self.featuredGame(game);
        };

		self.selectedSport.subscribe(function () {
            if (self.isInitializing()) return;

			if (self.slickSlider)
                self.slickSlider.slick('unslick').empty();

            self.data([]).getData();
        });
        
        self.selectedSportWithButtonGo.subscribe(function () {
            if (self.isInitializing()) return;

			if (self.slickSlider)
                self.slickSlider.slick('unslick').empty();

            self.data([]).getDataWithButton();
        })

        self.getData = function () {
            var promise = self.getComponentData("events", { sport_id: self.selectedSport() ? self.selectedSport().id : self.sport_id });
            promise.success(function (data) {
                self.loadData(data);
            });
        };
        
        self.getDataWithButton = function () {
            var promise = self.getComponentData("events", { sport_id: self.selectedSportWithButton() ? self.selectedSportWithButton().id : self.sport_id });
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

		self.slickComponent = self.slick;
        self.slick = function (element) {
            self.slickSlider = self.slickComponent(element);
        };

        self.extend = function () {
                for (var i = 1; i < arguments.length; i++)
                    for (var key in arguments[i])
                        if (arguments[i].hasOwnProperty(key))
                            arguments[0][key] = arguments[i][key];
                return arguments[0];
        }

        if (self.dummy()) {
            self.getDummyData("events").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
                if (self.component.extra)
                self.countdown_enabled = self.component.extra.countdown_enabled;
            }
            else {
                self.getData();
            }
        }
    }

    return {
        viewModel: EventsModel
    };
});