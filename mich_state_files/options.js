define(['module'], function (module) {
    var Options = function () {
        this.sport_id = module.config().sport_id;
		this.dummy_ads = module.config().dummy_ads;
		this.all_ads = module.config().all_ads;
    };

    return Options;
});