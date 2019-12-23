define(['knockout', 'models/stat-leader'], function (ko, StatLeader) {
    var StatLeaderGroup = function (data) {
        var self = this;

        self.group_name = data.group_name;
        self.leaders = ko.observable();
        if (data.leaders != null && data.leaders.length > 0) {
            self.leaders = ko.utils.arrayMap(data.leaders, function (leader) {
                return new StatLeader(leader);
            });
        }

    };

    return StatLeaderGroup;
});