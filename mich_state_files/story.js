define(['knockout', 'models/showcase-player', 'models/sport'], function (ko, ShowcasePlayer, Sport) {
    var Story = function (data) {
        var self = this;

        self.id = data.id,
        self.title = data.title,
        self.title_in_rotator = data.title_in_rotator,
        self.sub_headline = data.sub_headline,
        self.teaser = data.teaser,
        self.byline = data.byline,
        self.date = data.date,
        self.sport = new Sport(data.sport),
        self.image_focal_point = data.image_focal_point,
        self.image_source = data.image_source,
        self.image_alt_text = data.image_alt_text,
        self.url = data.url,
        self.type = data.type,
        self.links = data.links,
        self.homepage_feed_template = data.homepage_feed_template,
        self.showDynamicAd = false,
        self.showcase = ko.observable(null);
		self.selected = ko.observable(false);
        self.video = data.video;
        self.game_id = data.game_id;
        self.games = data.games;
        self.gallery_id = data.gallery_id;
        
        self.openStory = function (story) {
            self.selected(true);
        }

        self.closeStory = function () {
            self.selected(false);
        }

        self.toggleStory = function () {
            self.selected(!self.selected());
        }
        
        self._getGallery = null;
        self.getGallery = function() {
            if (self._getGallery) return self._getGallery;
            var obs = ko.observable(null);

            if (self.gallery_id) {
                $.get("/api/gallery_xml?format=json", {gallery:self.gallery_id})
                    .done(function(resp){
                        obs(resp.ResultSet);
                    })
            }
            self._getGallery = obs;
            return obs;
        }
        
        if (data.video)
            self.showcase(new ShowcasePlayer($.extend(data.video, { autoplay: false, component: 'stories' })));
    };

    return Story;
});