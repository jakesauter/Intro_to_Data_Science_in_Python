define(['knockout', 'jquery', 'cookie'], function (ko, $, cookie) {
    function viewAsModel(params) {
        var self = this;
        var viewing_as_cookie = cookie.get_cookie("sidearm-view-as-admin");
        self.viewing_as_admin = (viewing_as_cookie != "true" ? false : true);
        self.toggle_view_as = function () {
            cookie.set_cookie("sidearm-view-as-admin", !self.viewing_as_admin, 0);
            window.location.reload(true);
            return false;
        };
    }

    return {
        viewModel: viewAsModel
    };
});