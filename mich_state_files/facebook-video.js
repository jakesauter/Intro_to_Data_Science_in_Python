define(['knockout','models/facebook-item'], function (ko,FacebookItem) {
    var FacebookVideo = function (data) {
        var self = this;
        FacebookItem.call(self, data);
        self.video_url = data.link;
        self.video_iframe = (self.video_url ? "<iframe src=\"https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(self.video_url) + "\" style=\"border:none;overflow:hidden\" scrolling=\"no\" frameborder=\"0\" allowTransparency=\"true\"></iframe>" : "");
    };

    return FacebookVideo;
});