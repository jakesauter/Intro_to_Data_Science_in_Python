define(['knockout', 'components/component', 'models/stat-leader-group', 'models/stat-leader'], function (ko, Component, StatLeaderGroup, StatLeader) {
    function StatLeaderGroupModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.selected_group = ko.observable();
        self.groups = ko.observableArray([]);
        self.sport = ko.observable();

        self.loadData = function (data) {
            if (data != null  && data.length > 0) {
                var groups = ko.utils.arrayMap(data, function (group) {
                    return new StatLeaderGroup(group);
                });

                self.data.push.apply(self.data, groups);
                self.sport(data.sport);

                if (self.isInitializing()) {
                    self.groups(data.groups);
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
            var promise = self.getComponentData("stat-leaders-group");
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
        viewModel: StatLeaderGroupModel
    };
});