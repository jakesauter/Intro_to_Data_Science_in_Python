var CBS_PROD_NETWORK = "8264";
var CBS_DEV_NETWORK = "7336";
var CBS_SURROUND_COOKIE_NAME = "tsurround";
var CBS_SESSION_ID_VALUES = "abcdef".split("");
var CBS_SUBSESSION_ID_VALUES = "1234".split("");
var UnitTargetting = (function () {
    function UnitTargetting(input) {
        ObjectAssign(this, input);
    }
    UnitTargetting.prototype.applyTo = function (pubAdsInstance) {
        for (var key in this.kvp) {
            pubAdsInstance.setTargeting(key, this.kvp[key]);
        }
    };
    UnitTargetting.prototype.serialize = function (obj) {
        return Object.keys(obj)
            .map(function (key) {
            return key + "=" + encodeURIComponent(obj[key]);
        })
            .join("&");
    };
    UnitTargetting.prototype.toSimpleUrlTag = function (correlator) {
        var combined = ObjectAssign({}, this.pageKvp, this.kvp);
        var serializedKvps = this.serialize(combined);
        var serializedParams = this.serialize({
            iu: this.fullIu,
            sz: "1x1",
            ists: "1",
            t: serializedKvps,
            c: correlator
        });
        return "https://pubads.g.doubleclick.net/gampad/adx?" + serializedParams;
    };
    return UnitTargetting;
}());
var PageTargetting = (function () {
    function PageTargetting(input) {
        this.assignedPositionsByWidthAndPos = {};
        ObjectAssign(this, input);
    }
    PageTargetting.prototype.forUnit = function (subUnitName, requestedPosValue, width, otherKvps) {
        var actualPos = this.assignPosFromRequestedAndWidth(requestedPosValue, width);
        return new UnitTargetting({
            fullIu: this.iuBase,
            kvp: ObjectAssign({}, otherKvps || {}, {
                pos: actualPos
            }),
            pageKvp: this.kvp
        });
    };
    PageTargetting.prototype.applyTo = function (pubAdsInstance) {
        pubAdsInstance.enableSingleRequest();
        if (PageTargetting.getHttpCookieValue("gdpr_consent") === "true") {
            pubAdsInstance.setRequestNonPersonalizedAds(1);
        }
        for (var key in this.kvp) {
            pubAdsInstance.setTargeting(key, this.kvp[key]);
        }
    };
    PageTargetting.prototype.assignPosFromRequestedAndWidth = function (requestedPosValue, width) {
        var widthPos = width + "-" + requestedPosValue;
        var map = this.assignedPositionsByWidthAndPos;
        if (map[widthPos] == null) {
            map[widthPos] = 1;
            return requestedPosValue;
        }
        switch (requestedPosValue) {
            case "top":
                return this.assignPosFromRequestedAndWidth("middle", width);
            case "middle":
            case "bottom":
            case "sticky":
            case "outofpage":
                ++map[widthPos];
                return requestedPosValue + map[widthPos];
        }
    };
    PageTargetting.getPageLevel = function () {
        return new PageTargetting({
            iuBase: PageTargetting.getAdUnitBase(),
            kvp: {
                cid: PageTargetting.getPageContentId(),
                env: PageTargetting.getStage(),
                firstpg: PageTargetting.getUserIsFirstPageOfDay() ? "1" : "0",
                ptype: PageTargetting.getPageType(),
                session: PageTargetting.getUserSessionId(),
                subses: PageTargetting.getUserSubsessionId(),
                sport: PageTargetting.getPageSport(),
                vguid: PageTargetting.getPageviewGuid()
            }
        });
    };
    PageTargetting.getAdUnitBase = function () {
        var network = PageTargetting.getStage() === "prod" ? CBS_PROD_NETWORK : CBS_DEV_NETWORK;
        var plat = PageTargetting.getPlatform() === "mobile" ? "maw" : "aw";
        var arena = PageTargetting.getArena();
        var site = PageTargetting.getSiteCode();
        return "/" + network + "/" + plat + "-" + arena + "/" + site;
    };
    PageTargetting.getStage = function () {
        return location.href.indexOf(".sidearmsports.com") > -1 ? "dev" : "prod";
    };
    PageTargetting.getPlatform = function () {
        return window.document.documentElement.clientWidth > 600
            ? "desktop"
            : "mobile";
    };
    PageTargetting.getArena = function () {
        return "collegesports";
    };
    PageTargetting.getUserIsFirstPageOfDay = function () {
        var date = new Date();
        var todayValue = [
            date.getFullYear(),
            PageTargetting.padStart(date.getMonth() + 1, 2, "0"),
            PageTargetting.padStart(date.getDate(), 2, "0")
        ].join("-");
        return PageTargetting.withCookieSync("local", function (value) {
            var lastVisitWasToday = value.lastVisit === todayValue;
            value.lastVisit = todayValue;
            return !lastVisitWasToday;
        });
    };
    PageTargetting.getUserSessionId = function () {
        return PageTargetting.withCookieSync("session", function (value) {
            var sessionId = value.sessionId;
            if (sessionId == null) {
                sessionId = value.sessionId =
                    CBS_SESSION_ID_VALUES[Math.floor(Math.random() * CBS_SESSION_ID_VALUES.length)];
            }
            return sessionId;
        });
    };
    PageTargetting.getUserSubsessionId = function () {
        return PageTargetting.withCookieSync("session", function (value) {
            var subsessionId = value.subsessionId;
            if (subsessionId == null) {
                subsessionId = value.subsessionId =
                    CBS_SUBSESSION_ID_VALUES[Math.floor(Math.random() * CBS_SUBSESSION_ID_VALUES.length)];
            }
            return subsessionId;
        });
    };
    PageTargetting.getPageviewGuid = function () {
        if (window.vguid == null) {
            window.vguid = PageTargetting.v4();
        }
        return window.vguid;
    };
    PageTargetting.getSiteCode = function () {
        return PageTargetting.getWindow().targetting_criteria.cbs_site_code;
    };
    PageTargetting.getPageContentId = function () {
        return PageTargetting.getWindow().targetting_criteria.content_id;
    };
    PageTargetting.getPageType = function () {
        return PageTargetting.getWindow().targetting_criteria.page_template;
    };
    PageTargetting.getPageSport = function () {
        return PageTargetting.getWindow().targetting_criteria.sport_name;
    };
    PageTargetting.getHttpCookieValue = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            var cookie_value = parts
                .pop()
                .split(";")
                .shift();
            console.log("cookie value:" + cookie_value);
            return cookie_value;
        }
        else {
            return "";
        }
    };
    PageTargetting.withCookieSync = function (type, callback) {
        var value = PageTargetting.getCookie(type);
        var returnValue = callback.call(this, value);
        PageTargetting.writeCookie(type, value);
        return returnValue;
    };
    PageTargetting.getStorageForType = function (type) {
        return type === "local" ? window.localStorage : window.sessionStorage;
    };
    PageTargetting.getCookie = function (type) {
        var stringValue = PageTargetting.getStorageForType(type)[CBS_SURROUND_COOKIE_NAME];
        if (stringValue == null)
            return {};
        try {
            return JSON.parse(stringValue) || {};
        }
        catch (err) {
            return {};
        }
    };
    PageTargetting.writeCookie = function (type, value) {
        if (Object.prototype.toString.call(value) !== "[object Object]") {
            throw new Error("Can only write objects");
        }
        PageTargetting.getStorageForType(type)[CBS_SURROUND_COOKIE_NAME] = JSON.stringify(value);
    };
    PageTargetting.padStart = function (value, charCount, padChar) {
        var valueString = "" + value;
        while (valueString.length < charCount) {
            valueString = padChar + valueString;
        }
        return valueString;
    };
    PageTargetting.v4 = function () {
        var d = Date.now();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
        });
        return uuid;
    };
    PageTargetting.getWindow = function () {
        return window;
    };
    return PageTargetting;
}());
function ObjectAssign(target) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    for (var i = 0; i < args.length; i++) {
        var source = args[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
//# sourceMappingURL=cbs-surround.js.map