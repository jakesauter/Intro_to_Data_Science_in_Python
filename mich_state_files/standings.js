define(['knockout', 'jquery', 'models/sport'], function (ko, $, Sport) {
    var Standings = function (data) {
        if (!data) return;

        var self = this;
        self.id = data.id;
        self.title = data.title;
        self.conference_url = data.conference_url;
        self.notes = data.notes;
        self.sport = new Sport(data.sport);

        self.columns = data.columns.map(function (column) {
            return new StandingsColumn(column);
        });

        self.rows = data.rows.map(function (row) {
            return new StandingsRow(row);
        });

        self.rowSpan = {
            full: self.columns.filter(function (column) {
                return !column.short_standings;
            }).length,
            short: self.columns.filter(function (column) {
                return column.short_standings;
            }).length
        };
    };

    var StandingsColumn = function (data) {
        if (!data) return;

        var self = this;
        self.id = data.id;
        self.title = data.title;
        self.rank = data.rank;
        self.short_standings = data.short_standings;
    };

    var StandingsRow = function (data) {
        if (!data) return;

        var self = this;
        self.is_colgroup = data.is_colgroup;
        self.cells = data.cells;
    };

    return Standings;
});