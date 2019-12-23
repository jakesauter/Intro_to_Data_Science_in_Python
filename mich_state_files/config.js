require.config({
    urlArgs: function (id, url) {
        if (id === "jquery" || id === "bundle")
            return "";

        return "?bust=" + window.urlArgs;
    },
	waitSeconds: 0,
    baseUrl: "/components/js/",
    paths: {
        "tsdist":"../../common/ts/dist",
        "jquery": [
            "//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min",
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
        ],
        "koFastForeach": window.cdn_path + "assets.sidearmsports.com/common/js/knockout-fast-foreach.min",
        "gpt": "//www.googletagservices.com/tag/js/gpt",
        "preroll": window.cdn_path + "assets.sidearmsports.com/adaptive/js/youtube-preroll",
        "headroom": [
            "//cdnjs.cloudflare.com/ajax/libs/headroom/0.7.0/headroom.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/headroom-0.7.0.min",
        ],
        "jquery-headroom": [
            "//cdnjs.cloudflare.com/ajax/libs/headroom/0.7.0/jQuery.headroom.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jQuery.headroom-0.7.0.min",
        ],
		"statcollector": window.cdn_path + "assets.sidearmsports.com/statcollector/statscollector.min.gz",
        "sidearm-responsive": "/common/js/sidearm-responsive",
        "progressbar": "//rawgit.com/kimmobrunfeldt/progressbar.js/master/dist/progressbar",
        "datatables": [
            "//cdnjs.cloudflare.com/ajax/libs/datatables/1.10.8/js/jquery.dataTables.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jquery.dataTables-1.10.8.min",
        ],
        "images-loaded": [
            "//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/imagesloaded.pkgd-3.1.8.min",
        ],
        "waypoints": [
            "//cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.0/jquery.waypoints.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jquery.waypoints-4.0.0.min",
        ],
        "showcaseplayerembed": window.cdn_path + "assets.sidearmsports.com/common/js/sidearm.showcaseplayerembed.min",
        "lodash": "//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.11/lodash.min",
        "simpleweather": [
            "//cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jquery.simpleWeather-3.1.0.min",
        ],
        "uri": [
            "https://cdnjs.cloudflare.com/ajax/libs/URI.js/1.18.0",
        ],
        "underscore": [
            "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min",
            window.cdn_path + "assets.sidearmsports.com/common/js/underscore-1.8.3.min",
        ],
        "validation": [
            "//cdnjs.cloudflare.com/ajax/libs/knockout-validation/2.0.3/knockout.validation.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/knockout.validation-2.0.3.min",
        ],
        "pikaday": [
            "//cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/pikaday-1.4.0.min",
        ],
        "visible": [
            "//cdnjs.cloudflare.com/ajax/libs/jquery-visible/1.2.0/jquery.visible.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jquery.visible-1.2.0.min.js",
        ],
        "bundle": window.cdn_path + "assets.sidearmsports.com/responsive/js/bundle.1576073794113",
        "lazyload": [
            "//cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.1/jquery.lazyload.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/jquery.lazyload-1.9.1.min",
        ],
        "lazySizes": [
            "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.5/lazysizes-umd.min",
            window.cdn_path + "assets.sidearmsports.com/common/js/lazysizes.umd-4.1.5.min",
        ],
        "vue": "https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min",
        "cuid": "https://cdnjs.cloudflare.com/ajax/libs/cuid/1.3.8/browser-cuid.min",
        "ssGptHeaderBidding":"https://sidearm-syndication.s3.amazonaws.com/prod/header-bidding-wrapper.bundle"
    },
    bundles: {
        "bundle": [
            "knockout",
            "moment",
            "blockadblock",
            "slick",
            "perfect-scrollbar",
            "packery",
            "switch-case",
            "jquery-ui",
            "picturefill",
            "text",
            "vanillaLazyLoad",
            "aos"
        ]
    },
    shim: {
        "jquery": {
            exports: '$'
        },
        "jquery-ui": ["jquery"],
        "slick": ["jquery"],
		"jquery-headroom": ["jquery"],
		"lazyload": ["jquery"],
		"lazySizes": ["jquery"],
        "vanillaLazyLoad": ["jquery"],
        "preroll": ["jquery"],
        "sidearm-responsive": ["jquery", "jquery-ui", "datatables", "waypoints"],
		"packery": ["jquery"],
        "waypoints": ["jquery"],
        "switch-case": ["jquery", "knockout"],
        "showcaseplayerembed": ["jquery"],
        "simpleweather": ["jquery"],
        "validation": ["jquery", "knockout"],
        "pikaday": ["jquery"],
        "visible": ["jquery"],
        "perfect-scrollbar": ["jquery"],
        "images-loaded": ["jquery"]
    }
});