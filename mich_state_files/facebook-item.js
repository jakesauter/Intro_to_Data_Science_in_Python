define(['knockout','models/facebook-page'], function (ko,FacebookPage) {
    var FacebookItem = function (data) {
        var self = this;

        self.id = data.id;
        self.description = data.description;
        self.message = data.message;
        self.from = data.from;
        self.type = data.type;
        self.created_time = data.created_time;
        self.updated_time = data.updated_time;
        self.privacy = data.privacy;
        self.full_picture = data.full_picture;
        self.is_published = data.is_published;
        self.is_hidden = data.is_hidden;
        self.permalink_url = data.permalink_url;
        self.link_to_post = data.link_to_post;
        self.like_count = data.like_count;
        //https://developers.facebook.com/docs/plugins/like-button
        self.likeButton = (data.link_to_post ? '<iframe src="https://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(data.link_to_post) + '&width=51&layout=button&action=like&size=small&show_faces=false&share=false&height=65&appId=291243702517" width="51" height="65" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>' : "");
        self.page = new FacebookPage(data.page);
        self.selected = ko.observable(false);

        self.openItem = function (item) {
            self.selected(true);
        };

        self.closeItem = function () {
            self.selected(false);
        };

        self.toggleItem = function () {
            self.selected(!self.selected());
        };
    };

    return FacebookItem;
});