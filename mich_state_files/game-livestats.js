define(['knockout'], function (ko) {
    var GameLiveStats = function (data) {
        var self = this;

        self.locationIndicator = data.locationIndicator;
        self.hasStarted = data.HasStarted;
        self.isComplete = data.IsComplete;
        self.clockSeconds = data.ClockSeconds;
        self.ShowExtraPeriodsAsOT = data.ShowExtraPeriodsAsOT;
        self.period = data.Period;
        self.PeriodName = data.PeriodName;
        self.periodRegulation = data.PeriodsRegulation;
        self.home_score = data.HomeTeam.Score;
        self.home_period_scores = data.HomeTeam.PeriodScores;
        self.away_score = data.VisitingTeam.Score;
        self.away_period_scores = data.VisitingTeam.PeriodScores;
        self.last_plays = data.LastPlays;
        self.home_name = data.HomeTeam.Name;
        self.away_name = data.VisitingTeam.Name;

        self.team_score = ko.computed(function () {
            if (self.locationIndicator === 'A')
                return self.away_score;
            else
                return self.home_score;
        });

        self.team_period_scores = ko.computed(function () {
            if (self.locationIndicator === 'A')
                return self.away_period_scores;
            else
                return self.home_period_scores;
        });

        self.opponent_score = ko.computed(function () {
            if (self.locationIndicator === 'A')
                return self.home_score;
            else
                return self.away_score;
        });

        self.opponent_period_scores = ko.computed(function () {
            if (self.locationIndicator === 'A')
                return self.home_period_scores;
            else
                return self.away_period_scores;
        });

        self.team_name = ko.computed(function () {
            if (self.locationIndicator === 'A')
                return self.away_name;
            else
                return self.home_name;
        });

        self.periodToOrdinal = ko.computed(function () {
            if (self.period > self.periodRegulation) {
                return "OT" + self.period - self.periodRegulation;
            }
            if (self.period > 10 && self.period < 20) return self.period + "th";
            if (self.period % 10 === 1) return self.period + "st";
            if (self.period % 10 === 2) return self.period + "nd";
            if (self.period % 10 === 3) return self.period + "rd";
            return self.period + "th";
        });

        self.clockSecondsToString = ko.computed(function () {
            var minutes = Math.floor(self.clockSeconds / 60);
            self.clockSeconds = self.clockSeconds % 60;

            if (self.clockSeconds < 10) self.clockSeconds = "0" + self.clockSeconds;
            return minutes + ":" + self.clockSeconds;
        });

    };

    return GameLiveStats;
});