define(['blockadblock'], function () {
    var adBlock = function () {
        var self = this;

        self.checkForAdBlock = function () {
            if (typeof blockAdBlock === 'undefined') {
                self.adBlockDetected();
                return;
            }

            var _blocker = new BlockAdBlock({
                checkOnLoad: false,
                loopCheckTime: 250,
                loopMaxNumber: 20,
            });
            _blocker.onDetected(self.adBlockDetected);
            
            _blocker.check();
        },
        self.adBlockDetected = function () {
            $('body').append('<adblock-modal-component params="{}"></adblock-modal-component>');   
        }
    };

    return adBlock;
});