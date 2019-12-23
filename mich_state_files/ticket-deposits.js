define(['knockout'], function (ko) {
    var TicketDepositInfo = function (data) {
        var self = this;
        self.information = data.information;
        self.maximum_quantity = data.maximum_quantity;
        self.link = data.link;
        self.deposit_title = data.deposit_title;
        self.show_quantity = data.show_quantity;
    };

    return TicketDepositInfo;
});