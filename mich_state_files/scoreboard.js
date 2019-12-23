define(['knockout', 'components/component', 'models/game', 'models/game-livestats', 'underscore'], function (ko, Component, Game, GameLiveStats, _) {
    function scoreboardModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.firstUpcoming = 0;
        var noUpcoming = false;
        var noRecent = false;
        self.offset = ko.observable(params.offset || 0);
        self.sports = ko.observableArray();
        self.selectedSport = ko.observable();
        self.featuredGame = ko.observable();
        self.slickSlider = null;

        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var games = ko.utils.arrayMap(data, function (game) {
                    return new Game(game);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    games[0].showDynamicAd = true;
                }
                var upcomingGames = games.filter(function (game) {
                    return game.type == "upcoming";
                });
                if (upcomingGames != null && upcomingGames.length > 0) {
                    self.firstUpcoming = games.indexOf(upcomingGames[0]);
                }else{
                    noUpcoming = true;
                }
                if(upcomingGames.length === data.length) {
                    noRecent = true;
                }

                if (self.isLoadingMore()) {
                    self.data.push.apply(self.data, games);
                    self.liveStats('data');
                } else {
                    self.originalData([]);
                    self.originalData.push.apply(self.originalData, games);
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

                        if(_sport.sportInfo.is_not_sport == "False" && (_sport.sportInfo.schedule_id || _sport.sportInfo.schedule_id === 0)){
                            return {
                                id: _sport.sport,
                                abbreviation: _sport.sportInfo.sport__abbrev,
                                shortname: _sport.sportInfo.sport_shortname,
                                title: _sport.sportInfo.sport_title
                            };
                        }

                    }).filter(function(sport){ return !!sport; });
                    _sports.unshift({
                        id: 0,
                        abbreviation: 'All',
                        title: 'Choose Sport',
                        short_title: 'All',
                        shortname: 'all'
                    });
                    self.sports.push.apply(self.sports, _sports);

                    if (self.sport_id !== 0) {
                        var sport_index = self.sports().findIndex(function(sport){
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

        self.breakpoint.subscribe(function (newVal) {
            if (self.breakpoint().offset) {
                self.offset(self.breakpoint().offset);
            }
        });

        self.filterScoreboard = function (sport) {

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

            self.originalData([]);
            self.data([]).getData();
        });

        self.getData = function () {
            var promise = self.getComponentData("scoreboard", { sport_id: self.selectedSport() ? self.selectedSport().id : self.sport_id });
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
            if(noUpcoming === true){
                self.slickSlider.slick('slickGoTo', self.data().length, false);
            } else if(noRecent) {
                self.slickSlider.slick('slickGoTo', 0, false);
            } else {
                self.slickSlider.slick('slickGoTo', self.firstUpcoming - self.offset(), false);
            }
        };

        if (self.dummy()) {
            self.getDummyData("scoreboard").then(function (data) {
                self.loadData(data)
            });
        }
        else {
            if (self.component) {
                self.loadData(self.component.data);
            }
            else {
                self.getData();
            }
        }
    }

    return {
        viewModel: scoreboardModel
    };
});