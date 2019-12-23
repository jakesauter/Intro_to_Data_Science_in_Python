define(['knockout'], function (ko) {
    var StatLeader = function (data) {
        var self = this;

        self.rp_id = data.rp_id;
        self.group = data.group;
        self.number = data.number;
        self.name = data.name;
        self.position = data.position;
        self.stat_descriptor = data.stat_descriptor;
        self.stat_name = data.stat_name;
        self.stat_value = data.stat_value;
        self.stat_value_progress  = data.stat_value_progress ;
        self.image = data.image;
        self.uniform = data.uniform;

        self.formatted_name = ko.computed(function(){
            return self.name.split(', ')[1]+' '+self.name.split(', ')[0];
        });

        self.firstname = ko.computed(function(){
            return self.name.split(', ')[1];
        });

        self.lastname = ko.computed(function(){
            return self.name.split(', ')[0];
        });

    };

    return StatLeader;
});