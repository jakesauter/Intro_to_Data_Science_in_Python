define(['knockout', 'jquery', 'vanillaLazyLoad', 'picturefill'], function (ko, $, LazyLoad) {

    ko.bindingHandlers.html5Picture = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
				_alt = allBindings.get('alt') || "";
            if (value == undefined) return;

            var srcset = value.images.sort(function(a, b){
                return b.breakpoint - a.breakpoint;
            });
            
            $.each(srcset, function (i, source) {
                if (source.breakpoint >= 0)
                    if (_alt === "") {
                        _alt = source.alt;
                    }
                    $(element).append($('<source>', { media: '(min-width:' + source.breakpoint + 'px)', 'data-srcset': encodeURI(source.image) }));
            });
			
            if (srcset.length > 0)
				$(element).append($('<img>', { 'data-src': encodeURI(srcset[0].image), alt: _alt, class: 'lazyload' }));
			
			window.picturefill();
            $(window).trigger("resize");
        }
    }

    ko.bindingHandlers.html5PictureSlick = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                _alt = allBindings.get('alt') || "";
            if (value == undefined) return;

            var srcset = value.images;
            $.each(srcset, function (i, source) {
                if (source.breakpoint >= 0)
                    if (_alt === "") {
                        _alt = source.alt;
                    }
                    $(element).append($('<source>', { media: '(min-width:' + source.breakpoint + 'px)', 'data-lazy': encodeURI(source.image) }));
            });
            
            if (srcset.length > 0)
                $(element).append($('<img>', { 'data-lazy': encodeURI(srcset[0].image), alt: _alt }));
        }
    }

    ko.bindingHandlers.html5PictureLazyLoad = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                _alt = allBindings.get('alt') || "";
            if (value == undefined) return;

            var srcset = value.images;
            $.each(srcset, function (i, source) {
                if (source.breakpoint >= 0)
                    if (_alt === "") {
                        _alt = source.alt;
                    }
                    $(element).append($('<source>', { media: '(min-width:' + source.breakpoint + 'px)', 'data-srcset': encodeURI(source.image) }));
            });

            
            if (srcset.length > 0)
                $(element).append($('<img>', { 'data-src': encodeURI(srcset[0].image), alt: _alt, class: 'lazyload'}));

        }
    }
    
    ko.bindingHandlers.focusTrapWithin = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var focusable_elements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
            
            var selector = valueAccessor();
            if (!selector) { return; }
            
            var target_element = $(selector);
            if (!target_element.length) { return; }
            
            var focusable_elements_in_target = target_element.find(focusable_elements);
            if (!focusable_elements_in_target.length) { return; }
            
            var first_element_in_target = focusable_elements_in_target.first();
            var last_element_in_target = focusable_elements_in_target.last();
            
            first_element_in_target.keydown(function(event){
                if (event.key === 'Tab' && event.shiftKey) {
                    event.preventDefault();
                    last_element_in_target.focus();
                }
            });
            
            last_element_in_target.keydown(function(event){
                if (event.key === 'Tab' && !event.shiftKey) {
                    event.preventDefault();
                    first_element_in_target.focus();
                }
            });
        }
    }

    ko.bindingHandlers.afterBind = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (!valueAccessor().callback)
                throw "Callback not defined for postForeach binding!";

            if (valueAccessor().fastForEach != null) {
                return ko.bindingHandlers['fastForEach'].init(element, valueAccessor().fastForEach, allBindingsAccessor, viewModel, bindingContext);
            }

            return ko.bindingHandlers['foreach'].init(element, valueAccessor().foreach, allBindingsAccessor, viewModel, bindingContext);
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var args = valueAccessor().arguments;

            if (valueAccessor().fastForEach != null) {
                var data = valueAccessor().fastForEach();
                if (data.length == 0) return;

                return valueAccessor().callback(element, args);
            }

            var data = valueAccessor().foreach();
            if (data.length == 0) return;

            ko.bindingHandlers['foreach'].update(element, valueAccessor().foreach, allBindingsAccessor, viewModel, bindingContext);
            if (Array.isArray(valueAccessor().callback)) {
                valueAccessor().callback.forEach(function(item) {
                   item(element, args);
                });
            } else {
                valueAccessor().callback(element, args);
            }
        }
    };

    ko.bindingHandlers.formatDate = {
        update: function (element, valueAccessor, allBindings, context) {
            var value = valueAccessor();
            value = ko.unwrap(value);

            if (value === null)
                return;
			
			if (allBindings.get('duration')) {
                value = moment.duration(value);
                $(element).text(moment.utc(value._milliseconds).format('mm:ss'));
                return;
            }

            value = moment(value);
            var format = allBindings.get('format') || "MMM Do, YYYY";

            var formatVal = value.format(format);
            if(format.indexOf("MMM.") >= 0){
                newFormatVal = formatVal.replace('May.','May');
                $(element).text(newFormatVal);
            }else{
                $(element).text(formatVal);
            }
        }
    };

    ko.bindingHandlers.dateFromNow = {
        update: function (element, valueAccessor, allBindings, context) {
            var value = valueAccessor();
            value = ko.unwrap(value);

            if (value === null)
                return;

            value = moment(value).fromNow();
            $(element).text(value);
        }
    };

    ko.bindingHandlers.showcasePlayer = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var video = ko.unwrap(valueAccessor());
            if (video) {
                video.appendButton(allBindings.get('appendButton') || false);
                video.element(element);
                video.videoContainer(allBindings.get('videoContainer'));
                video.modal(allBindings.get('modal') || false);
                video.modalContainer(allBindings.get('modalContainer'));
                video.player(
                    $.showcasePlayer({
                        source: {
                            Archive: video.Archive,
                            youtube: video.youtube,
                            autoplay: (video.modal() || video.appendButton()) ? true : video.autoplay,
                            controls: video.controls,
                            title: video.title
                        },
                        play: video.play,
                        pause: video.pause,
                        ended: video.ended,
                        adstart: video.adstart,
                        ready: function () {
                            video.instance(this);
                        }
                    })
                );
            }
        }
    };

    ko.bindingHandlers.stopBindings = {
        init: function () {
            return { 'controlsDescendantBindings': true };
        }
    };

    ko.bindingHandlers.progressBar = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            $(element)
                .addClass("sidearm-progress-bar")
                .append($("<div />"))
                .append($("<div />"))
                .append($("<div />"))
                .append($("<div />"))
                .append($("<div />"));
        }
    };
	
    ko.bindingHandlers.trimText = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var _text = valueAccessor(),
                _count = allBindings.get('count') || 50;

            if (_text === null)
                return;

            function getLength(node) {
                if (node.nodeType == document.TEXT_NODE) {
                    return node.textContent.length;
                } else if (node.nodeType == document.ELEMENT_NODE) {
                    return sum($(node).contents().map(function (i, childNode) {
                        return getLength(childNode);
                    }).get());
                } else {
                    return 0;
                }
            }

            function sum(list) {
                return list.reduce(function (acc, item) {
                    return acc + item;
                }, 0);
            }

            function trimHtmlTo(html, desired_length) {
                var parsed = $(element).html(_text);
                parsed.find("img").remove();
                //Length variable to compare to character count
                var length = 0;
                var kept_nodes = [];
                var trimmed = false;

                var all_nodes = parsed.contents().get();
                //Loop through all the nodes
                all_nodes.forEach(function (node, index) {
                    //if it is a text node get the character count of it
                    if (node.nodeType == document.TEXT_NODE) {
                        node.textContent.split(/\b/g).forEach(function (subText) {
                            //Create a text node
                            var subTextNode = document.createTextNode(subText);
                            if (length < desired_length) {
                                length += getLength(subTextNode);
                                kept_nodes.push(subTextNode);
                            } else {
                                trimmed = true;
                            }
                        });
                    } else {
                        if (length < desired_length) {
                            length += getLength(node);
                            kept_nodes.push(node);
                        } else {
                            trimmed = true;
                        }
                    }
                });
                if (trimmed) {
                    kept_nodes.push("...");
                }
                var truncated = $(element).html("").append(kept_nodes).html();
            }

            trimHtmlTo(_text, _count);
        }
    };

    ko.bindingHandlers.onEnter = {
        init: function (element, valueAccessor, viewModel) {
            $(element).keypress(function(event) {
                if (event.keyCode == 13) {
                    valueAccessor().call(viewModel);
                    return false;
                };
                return true;
            });
        }
    };

    ko.bindingHandlers.onEscape = {
        init: function (element, valueAccessor, viewModel) {
            $(element).keyup(function (event) {
                if (event.keyCode == 27) {
                    valueAccessor().call(viewModel);
                    return false;
                };
                return true;
            });
        }
    };

    //A binding similiar to the Knockout's normal text binding
    //But protects against undefined observables/values being passed to it and breaking page bindings
    ko.bindingHandlers.safeText = {
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var default_text = allBindings.get('default') || '';

            try {
                if (typeof ko.unwrap(valueAccessor()) === 'undefined' && ko.unwrap(valueAccessor()) !== null) {
                    $(element).text(default_text);
                    return;
                }
            }
            catch (e) {
                console.log("Couldn't bind undefined or null value for text. ", e);
                $(element).text(default_text);
                return;
            }

            var value = ko.unwrap(valueAccessor());
            $(element).text(value);
        }
    };

    ko.bindingHandlers.cleanHTML = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var text = valueAccessor();

            function cleanUp(html) {
                if(html){
                    var cleanHTML = html.replace(/(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g, "");
                    $(element).text(cleanHTML);
                }
            }
            cleanUp(text);
        }
    };

    ko.bindingHandlers.bindGalleryWidgets = {
        init: function (element) {
            setTimeout(function () {
                var $gallery_widgets = $(element).find('gallery-embed-component');

                if ($gallery_widgets.length) {
                    var defer_until_component_registered = setInterval(function () {
                        if (ko.components.isRegistered('gallery-embed-component')) {
                            clearInterval(defer_until_component_registered);

                            $gallery_widgets.each(function () {
                                try {
                                    ko.applyBindingsToNode($(this)[0]);
                                }
                                catch (e) { }
                            });
                        }
                    }, 250);
                }
            }, 0);
        }
    }
});