define(['knockout'], function (ko) {
    var CbsStoreItem = function (data) {
    	console.log(data);
        var self = this;

        self.title = data.title;
        self.link = data.link;
        self.price = data.price;
        self.image = data.image;
    };

    return CbsStoreItem;
});