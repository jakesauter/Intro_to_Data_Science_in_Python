define([
    'knockout',
    'models/story',
    'models/tweet',
    'models/instagram',
    'models/facebook',
    'models/all-access-video',
    'models/youtube-video',
    'models/gallery',
    'models/podcast',
    'models/ad'
], function (ko, Story, Tweet, Instagram, Facebook, AllAccessVideo, YoutubeVideo, Gallery, Podcast, Ad) {
    var ContentStreamItem = function (item) {
        var self = this;
        
        self.type = item.type,
        self.featured = item.featured,
        self.data = ko.observable();

        if (item.data) {
            if (self.type === "story")
                self.data(new Story(item.data));
            else if (self.type === "tweet")
                self.data(new Tweet(item.data));
            else if (self.type === "instagram")
                self.data(new Instagram(item.data));
            else if (self.type === "facebook")
                self.data(new Facebook(item.data));
            else if (self.type === "allaccess")
                self.data(new AllAccessVideo(item.data));
            else if (self.type === "youtube")
                self.data(new YoutubeVideo(item.data));
            else if (self.type === "gallery")
                self.data(new Gallery(item.data));
            else if (self.type === "podcast")
                self.data(new Podcast(item.data));
            else if (self.type === "ad")
                self.data(new Ad(item));
        }

        self.showDynamicAd = false;
    };

    return ContentStreamItem;
});