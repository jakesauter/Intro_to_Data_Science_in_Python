define(['knockout', 'components/component', 'models/ticket', 'models/ticket-deposits'], function (ko, Component, GameTicketsInfo, TicketDepositInfo) {
    function ticketsModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));
        self.is_rotator = false;
        self.loadData = function (data) {
            if (data) {
                if (Array.isArray(data) && data[0].template_name !== 'tickets--schedule-3') {

                    var game_ticket = ko.utils.arrayMap(data, function (game) {
                        return new GameTicketsInfo(game);
                    });
                    console.log('after object', game_ticket);
                    self.data.push.apply(self.data, game_ticket);
                    self.name(data[0].template_name);
                } else if (data.template_name === 'tickets--schedule-3') {
                    var info = new TicketDepositInfo(data);
                    self.data.push(info);
                    self.name(data.template_name);
                }
                
                
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            //Get data from service here
            //var promise = "";
            //promise.success(function (data) {
            //    self.loadData(data);
            //});

            var data = {};

            var path = getParameterByName('path');
            var rdat_path = '';
            if (path == null) {
                if (params.path !== '') {
                    path = params.path;
                } else {
                    path = getParameterByName('schedule');
                }
            }

            var is_rdat = getParameterByName('rdat');
            if (is_rdat && is_rdat !== '') {
                var rdat = is_rdat;
                if (rdat) {
                    rdat_path = '&rdat=' + is_rdat;
                } else {
                    rdat_path = '';
                }
            }

            var events = [];
            ga(function () {
                events = ga.getAll()[0].get("linkerParam");
            });
            
            console.log(events);

            var is_print = getParameterByName('print');
            if (!is_print) {
                $.get('/services/tickets.ashx/next-game?path=' + path + rdat_path + "&"+ events, function (resp) {
                    console.log(resp);
                    if (resp && resp.data != null) {
                        self.is_rotator = resp.data.is_rotator;
                        if (resp.data.ticket_models) {
                            self.loadData(resp.data.ticket_models);
                        } else {
                            self.loadData(resp.data);
                        }
                    }
                });
            }
        };

        self.loadMore = function () {
            
        };

        showModal = function () {
            if ($(window).width() <= 580) {
                $('.c-ticket-deposits__info-btn i').toggleClass("sf-arrows-circle-right");
                $('.c-ticket-deposits__info-btn i').toggleClass("sf-arrows-circle-down");
                $('.c-ticket-deposits__info-popout-container').toggleClass("c-ticket-deposits__show-popout");
            } else {
                $('.c-ticket-deposits__info-popout-container').addClass("c-ticket-deposits__show-popout");
            }
        };

        hideModal = function () {
            $('.c-ticket-deposits__info-popout-container').removeClass("c-ticket-deposits__show-popout");
        };

        self.getData();

        self.slickComponent = self.slick;
        self.slick = function (element) {
            self.slickSlider = self.slickComponent(element);
        };

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