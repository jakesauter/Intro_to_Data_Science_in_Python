define(['knockout', 'components/component', 'models/gallery', 'analytics'], function (ko, Component, Gallery, Analytics) {
    function galleryEmbedModel(params) {
        var self = this;
        ko.utils.extend(self, new Component(params));

        self.isModalOpen = ko.observable(false);
        self.selectedModalGallery = ko.observable();
        self.selectedModalPagination = ko.observable(1);

        self.imageTakeover = (self.extra() && self.extra().imageTakeover) ? true : false;

        self.closeModal = function () {
            $('body').removeClass('story-template-gallery-modal-is-open');
            self.isModalOpen(false);
        }

        self.openModal = function (element, index) {
            $('body').addClass('story-template-gallery-modal-is-open');
            self.isModalOpen(true);

            if (element && index) {
                var goToIndex = self.imageTakeover ? index : index - 1;
                self.selectedModalPagination(index);
                $(element).parents('gallery-embed-component').find('.c-gallery-embed__modal-rotator').slick('slickGoTo', goToIndex);
                self.refreshModalSliders();
            }

            Analytics.trackPageView('/galleries/?gallery-widget=' + self.data()[0].id);
        }

        self.toggleModal = function (element, index) {
            if (self.isModalOpen()) {
                self.closeModal()
            } else {
                self.openModal(element, index)
            }
        }

        self.refreshModalSliders = function () {
            $('.c-gallery-embed__modal-rotator').each(function () {
                try {
                    $(this)[0].slick.refresh()
                } catch (e) { }
            })
        }

        $(document).on('afterChange', '.c-gallery-embed__modal[data-component-id="' + self.id + '"] .c-gallery-embed__modal-rotator', function (e, slick, currentSlide) {
            self.selectedModalGallery(self.data()[0].gallery_images[parseInt(currentSlide)]);
            self.selectedModalPagination(currentSlide + 1);

            if (self.name() === 'modal' && window.seo) {
                window.seo.values.title = self.data.peek()[0].title + ' - Image: ' + (parseInt(currentSlide) + 1) + ' ' + self.selectedModalGallery.peek().large.caption;
                window.seo.title.apply();
            }
        });

        if (self.name() === 'slider') {
            $(document).on('beforeChange', '.c-gallery-embed[data-component-id="' + self.id + '"] .c-gallery-embed__slider', function (event, slick, currentSlide, nextSlide) {
                if (self.imageTakeover) {
                    $(this).parents('.component').find('.c-gallery-embed__controls span:first-child').text(nextSlide + 1)
                }
                else {
                    if (nextSlide > 0) {
                        $(this).parents('.component').addClass('is-started');

                        var $thumbnails = $(this).parents('.component').find('.c-gallery-embed__thumbnails'),
                            $target_thumbnail = $thumbnails.find('.c-gallery-embed__thumbnails-item[data-slick-index=\'' + parseInt(nextSlide - 1) + '\']');

                        if (($target_thumbnail[0].offsetLeft + $target_thumbnail.outerWidth()) > ($thumbnails.width() + $thumbnails[0].scrollLeft)) {
                            $thumbnails[0].scrollLeft = $target_thumbnail[0].offsetLeft - 6;
                            $thumbnails.perfectScrollbar('update');
                        } else if ($target_thumbnail[0].offsetLeft < $thumbnails[0].scrollLeft) {
                            $thumbnails[0].scrollLeft = $target_thumbnail[0].offsetLeft - 6;
                            $thumbnails.perfectScrollbar('update');

                        };
                    } else {
                        $(this).parents('.component').removeClass('is-started');
                    }
                }
            })
        }

        var modalSliderChangeCount = 0;

        $(document).on('beforeChange', '.c-gallery-embed__modal[data-component-id="' + self.id + '"] .c-gallery-embed__modal-rotator', function (event, slick, currentSlide, nextSlide) {
            modalSliderChangeCount++;

            if (modalSliderChangeCount === 5) {
                modalSliderChangeCount = 0;

                var dfpNode = $(this).parents('.c-gallery-embed__modal').find('.c-gallery-embed__modal-sidebar-ads__dfp ads-component')[0];

                if (dfpNode) {
                    ko.cleanNode(dfpNode);
                    ko.applyBindings({}, dfpNode);
                }
            }

            var $thumbnails = $(this).next().find('.c-gallery-embed__thumbnails'),
                $target_thumbnail = $thumbnails.find('.c-gallery-embed__thumbnails-item[data-slick-index=\'' + parseInt(nextSlide) + '\']');

            if (($target_thumbnail[0].offsetLeft + $target_thumbnail.outerWidth()) > ($thumbnails.width() + $thumbnails[0].scrollLeft)) {
                $thumbnails[0].scrollLeft = $target_thumbnail[0].offsetLeft - 6;
                $thumbnails.perfectScrollbar('update');
            } else if ($target_thumbnail[0].offsetLeft < $thumbnails[0].scrollLeft) {
                $thumbnails[0].scrollLeft = $target_thumbnail[0].offsetLeft - 6;
                $thumbnails.perfectScrollbar('update');

            };
        })


        self.loadData = function (data) {
            if (data != null && data.length > 0) {
                var galleries = ko.utils.arrayMap(data, function (gallery) {
                    return new Gallery(gallery);
                });
                if (self.isLoadingMore() && self.showDynamicAd && ((self.loadMoreCount % self.dynamicAdIteration) == 0)) {
                    galleries[0].showDynamicAd = true;
                }
                self.data.push.apply(self.data, galleries);

                if (self.data() && self.data()[0].gallery_images) {
                    self.selectedModalGallery(self.data()[0].gallery_images[0]);

                    if (self.name() === 'modal') {
                        Analytics.trackPageView('/galleries/?gallery-widget=' + self.data()[0].id);

                        if (window.seo) {
                            window.seo.values.title = self.data.peek()[0].title + ' - Image: 1 ' + self.selectedModalGallery.peek().large.caption;
                            window.seo.title.apply();
                        }
                    }
                }
            }
            else {
                self.moreToLoad(false);
            }

            self.isInitializing(false);
            self.isLoadingMore(false);
        };

        self.getData = function () {
            var promise = self.getComponentData("gallery-embed");
            promise.success(function (data) {
                self.loadData(data);
            });
        };

        self.loadMore = function () {
            self.loadMoreComponentData();
            self.getData();
        };

        if (self.component) {
            self.loadData(self.component.data);
        }
        else
            self.getData();
    }

    return {
        viewModel: galleryEmbedModel
    };
});
