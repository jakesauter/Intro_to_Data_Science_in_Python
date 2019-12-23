; (function ($, window, document, undefined) {
    
    $.widget("sidearm.sidearmResponsive", {
        options: {
            widgets: [
                { name: "ui-tabs", method: createUITabs },
                { name: "accordion-table", method: createAccordionTable },
                { name: "tabs-mobile-select", method: createTabsMobileSelect },
                { name: "sortable-table", method: createSortableTable },
                { name: "data-waypoints", method: createWaypoints },
                { name: "data-select-anchor", method: createSelectAnchor },
                { name: "ui-tabs-overflow", method: createOverflowTabs }
            ]
        },
        _create: function () {
            $.each(this.options.widgets, function (index, widget) {
                widget.method(widget.name);
            });
        },
        _setOption: function (key, value) {

        },
        _destroy: function () {
            
        }
    });

    $(document).on("click", ".sidearm-tabs-select-button", function(e) {

        e.preventDefault();

        var $this = $(this),
            $parent = $this.parent(),
            val = $(this).prev(".ui-tabs-select").val(),
            $button = $parent.find("a[href=" + val + "]").first();

        if (val && $button.length) {
            $button.trigger("click");
        }

    });

    function createUITabs(selector) {
        var $tabs = $("[" + selector + "]");
        if ($tabs.length === 0)
            return;
        else
            $tabs.tabs();
    }

    function createAccordionTable(selector) {
        var $tables = $("[" + selector + "]");
        if ($tables.length === 0) return;

        $.each($tables, function () {
            var $table = $(this);
            $table.find("tr").click(function () { $(this).toggleClass("expanded"); });
        });
    }

    function createTabsMobileSelect(selector) {
        var $tabs = $("[" + selector + "]");
        if ($tabs.length == 0) return;

        $.each($tabs, function () {
            var $tab = $(this),
                $menu = $tab.find("> ul"),
                $select = !$tab.find("> select").length > 0 ? $menu.after("<select />", {}).siblings("select") : $tab.find("> select");
            
            $select.empty();
            $menu.find("li").each(function () {
                var $li = $(this),
                    $a = $li.find("a"),
                    $option = $("<option />", { text: $a.text(), value: $a.attr("href") });

                $select.append($option);
            });
            $select.on("change", function () {
                var val = $(this).val(),
                    $button = $menu.find("a[href=" + val + "]");

                $button.trigger("click");
                
            });
        });
    }
    
    function createSortableTable(selector) {
        var $tables = $("[" + selector + "]");
        if ($tables.length === 0) return;

        // Set default order sequence
        $.extend( true, $.fn.dataTable.defaults, {
            column: { orderSequence: ["desc", "asc"] }
        });

        $.each($tables, function () {
            var $table = $(this);
            $table.DataTable({ paging: false, searching: false, info: false, aaSorting: [] });
        });
    }

    function createWaypoints(selector) {
        var $waypoints = $("[" + selector + "]");

        if ($waypoints.length === 0) return;

        $.each($waypoints, function () {
            var $waypoints_container = $(this);
            $waypoints_container.find("[data-waypoint]").each(function () {
                var $waypoint = $(this);
                $waypoint.waypoint({
                    handler: function (direction) {
                        var $nav = $waypoints_container.find("[data-waypoint-navigation]").find("a[href*='#" + this.element.id + "']");
                        $nav.parents("li").addClass("active").siblings().removeClass("active").find(".active").removeClass("active");
                    },
                    group: $waypoint.data("waypoint-group") === undefined ? "default" : $waypoint.data("waypoint-group"),
                    offset: $waypoint.data("waypoint-offset") === undefined ? "15%" : $waypoint.data("waypoint-offset")
                });
            });
        });
    }

    function createSelectAnchor(selector) {
        var $dropdowns = $("[" + selector + "]");
        if ($dropdowns.length === 0) return;

        $.each($dropdowns, function () {
            var $dropdown = $(this);

            $dropdown.on("change", function () {
                var val = $(this).val(),
                    $anchor = $("#" + val.replace("#", "")),
                    top = $anchor.offset().top;

                $("body,html").scrollTop(top);
            });
        });
    }
	
	function createOverflowTabs(selector) {
        var $tabs = $('[' + selector + ']');
        if ($tabs.length == 0) return;

        $.each($tabs, function () {
            var $tabs = $(this);
            $tabs.tabs();

            var $nav = $tabs.find('.ui-tabs-nav').first(),
                $select = $tabs.find('select').first(),
                mousedDown = "";

            console.log('nav', $nav);

            $nav.draggable({
                axis: 'x',
                drag: function (event, ui) {
                    console.log('drag event');
                    var $element = $(ui.helper[0]);
                    if (ui.position.left > 0 || (($element.width() + ui.position.left) < $element.parent().width()))
                        return false;
                }
            });

            $nav.find('.ui-tabs-anchor').bind('mousedown', function () {
                mousedDown = $(this).attr('href');
            }).bind('mouseup', function () {
                var href = $(this).attr('href');
                if (href == mousedDown)
                    $(this).trigger('click');
            });

            $select.on('change', function (e) {
                var val = $(this).val(),
                    $tab = $nav.find('[href=' + val + ']'),
                    list_width = $nav.width(),
                    container_width = $nav.parent().width(),
                    left = $tab.position().left;

                $tab.trigger('click');

                if ((left + container_width) < list_width)
                    $nav.css('left', (left * -1));
                else
                    $nav.css('left', (list_width - container_width) * -1);
            });
        });
    }

})(jQuery, window, document);