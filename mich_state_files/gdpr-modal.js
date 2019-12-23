define(['knockout'], function (ko) {
    function gdprModel(params) {
        var self = this;

        self.modal_is_visible = ko.observable(false);

        self.modal_init = function() {
            self.modal_is_visible(true);

            $('.sidearm-gdpr-modal__consent').focus();
        };
        self.modal_init();
        
        self.close_modal = function () {
            document.cookie = "gdpr_consent=true; expires=Tue, 31 Dec 2030 23:59:59 GMT";

            window.location.reload();
        };
    }

    return {
        viewModel: gdprModel
    };
});