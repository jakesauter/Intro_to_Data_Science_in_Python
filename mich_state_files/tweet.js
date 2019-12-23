define(['knockout'], function (ko) {
    var Tweet = function (data) {
        var self = this;

        self.id = data.id;
        self.text = data.text;
        self.date = data.date;
        self.retweetCount = data.retweet_count;
        self.favoriteCount = data.favorite_count;
        self.media = data.media === null ? null : data.media+':small';
        self.user = data.user;
        self.selected = ko.observable(false);
        self.image_alt_text = data.image_alt_text;

        self.openTweet = function (tweet) {
            self.selected(true);
        }

        self.closeTweet = function () {
            self.selected(false);
        }

        self.toggleTweet = function () {
            self.selected(!self.selected());
        }
        self.showDynamicAd = false;
    };

    return Tweet;
});
