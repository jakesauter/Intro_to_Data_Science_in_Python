define(['knockout', 'components/component', 'models/stat-leader'], function (ko, Component, StatLeader) {
    function StatLeadersModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.selected_group = ko.observable();
        self.leader_groups = ko.observableArray([]);
        self.sport = ko.observable();

        self.loadData = function (data) {

            if (data != null && data.leaders != null && data.leaders.length > 0) {
                var leaders = ko.utils.arrayMap(data.leaders, function (leader) {
                    return new StatLeader(leader);
                });

                self.data.push.apply(self.data, leaders);
                self.sport(data.sport);

                if (self.isInitializing()) {
                    self.leader_groups(data.leader_groups);
                    self.selected_group(self.leader_groups()[0]);
                }
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.selected_group.subscribe(function () {
            if (self.isInitializing()) return;
            self.data();
        });

        self.getData = function () {
            var promise = self.getComponentData("stat-leaders");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };    

        if (self.component)
            self.loadData(self.component.data);
        else
            self.getData();
    }

    return {
        viewModel: StatLeadersModel
    };
});