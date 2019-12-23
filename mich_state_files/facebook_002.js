define(['knockout', 'models/facebook-item', 'models/facebook-link', 'models/facebook-photo', 'models/facebook-video'], function (ko, FacebookItem, FacebookLink, FacebookPhoto, FacebookVideo) {
    var Facebook = function (data) {
        var self = this;

        if(data == null){
            return;
        }
        switch(data["type"]) {
            case "link":
                FacebookLink.call(self, data);
                break;
            case "photo":
                FacebookPhoto.call(self, data);
                break;
            case "video":
                FacebookVideo.call(self, data);
                break;
            default:
                FacebookItem.call(self, data);
        }
    };

    return Facebook;
});