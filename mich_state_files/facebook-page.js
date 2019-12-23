define(['knockout'], function (ko) {
    var FacebookPage = function (data) {
        var self = this;
        if (data === null) {
            data = {};
        }
        self.id = data.id || "";
        self.name = data.name || "";
        self.picture = data.picture || "";
        self.link = data.link || "";
        self.category = data.category || "";
        self.website = data.website || "";
        self.username = data.username || "";
        self.description = data.description || "";
        self.type = data.type || "";
        //https://developers.facebook.com/docs/plugins/like-button
        self.likeButton = (data.link ? '<iframe src="https://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(data.link) + '&width=51&layout=button&action=like&size=small&show_faces=false&share=false&height=65&appId=291243702517" width="51" height="65" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>' : "");

    };

    return FacebookPage;
});