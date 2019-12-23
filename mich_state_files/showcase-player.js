define(['knockout'], function (ko) {
    var ShowcasePlayer = function (data) {
        var self = this;

        self.id = guid();
        self.file = null;
        self.Live = null;
        self.Archive = null;
        self.youtube = null;
        self.autoplay = false;
        self.controls = true;
        self.poster = null;
        self.component = null;
        self.title = null;

        self.appendButton = ko.observable(false);
        self.player = ko.observable();
        self.element = ko.observable();
        self.videoContainer = ko.observable();
        self.modal = ko.observable(false);
        self.modalContainer = ko.observable();
        self.instance = ko.observable();

        self.isVideoPlaying = ko.observable(false);
        self.timer;

        self.target = ko.computed(function () {
            return self.videoContainer() ? $(self.element()).find(self.videoContainer()) : $(self.element());
        });

        self.play = function () {
            self.clearTimer();
        };

        self.adstart = function () {
            self.clearTimer();
        };

        self.pause = function () {
            self.startTimer();
        };
        self.ended = function () {
            self.startTimer();
        };        

        self.player.subscribe(function () {
            if (self.player()) {
                $(self.player()).addClass('showcase-video-player');

                if (self.appendButton()) {
                    $(self.element())
                        .append($("<button />", { 'class': 'showcase-play-button', 'text': 'Play Video', 'type': 'button' }))
                        .find('.showcase-play-button')
                        .click(function (e) { e.preventDefault(); self.playVideo(); });
                    return;
                }

                if (self.autoplay || !self.modal())
                    self.playVideo();                
            }
        });
		self.isVideoPlaying.subscribe(function () {
		    var _class = self.component ? self.component + "-video-is-playing" : "";

		    if (self.isVideoPlaying()) {
			    $(self.element()).addClass("video-is-playing " + _class);
			    $('html').addClass("html-video-is-playing " + _class);
		    } else {
		        $(self.element()).removeClass("video-is-playing " + _class);
		        $('html').removeClass("html-video-is-playing " + _class);
		    }
        });

        self.playVideo = function () {
            if (self.target().has(".showcase-video-player").length) {
                self.player().fadeIn();
				self.instance().play();
			}
            else
                self.target().append(self.player());
            
            if (self.modal()) 
                self.createHistoryState();
			
			self.isVideoPlaying(true);
        };

        self.closeVideo = function () {			
            if (self.modal()) {
                window.removeEventListener('popstate', self.closeVideo);
				
                if (history.state != null && history.state.showcase != undefined && history.state.showcase === self.id) 
					history.back();
                				
                self.removePlayer();
            }

            if (self.appendButton())
                self.player().fadeOut();
                        
            self.isVideoPlaying(false);
        };

        self.createHistoryState = function () {
            if (history.state != null && history.state.showcase != undefined) 
                history.replaceState({ 'showcase': self.id }, "", "");
            else 
                history.pushState({ 'showcase': self.id }, "", "");

            window.addEventListener('popstate', self.closeVideo);
        };

        self.clearTimer = function () {
            clearTimeout(self.timer);
        };

        self.startTimer = function () {
            self.timer = setTimeout(self.closeVideo, 5000);
        };

        self.removePlayer = function () {
            self.target().find('.showcase-video-player').remove();
        };
                
        for (var property in data) {
            if (self.hasOwnProperty(property)) {
                self[property] = data[property];
            }
        }

        function guid() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16);
        };
    };

    return ShowcasePlayer;
});