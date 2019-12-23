define(['knockout'], function (ko) {
    var Trending = function (data) {
        var self = this;

        self.id = data.story_id || data.id,
        self.title = data.title,
        self.teaser = data.story_summary || data.teaser,
        self.date = data.story_date || data.date,
        self.sport = data.sport,
        self.image_source = data.image_source,
        self.image_alt_text = data.image_alt_text,
        self.url = data.url,
        self.file_name = data.story_filename || null,
        self.page_views = data.pageviews || null,
        self.selected = ko.observable(false);

        self.openItem = function (story) {
            self.selected(true);
        }

        self.closeItem = function () {
            self.selected(false);
        }

        self.toggleItem = function () {
            self.selected(!self.selected());
        }
    };

    return Trending;
});