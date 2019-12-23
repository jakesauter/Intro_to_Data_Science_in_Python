define([], function () {
    var cookie = {
        set_cookie: function(cname, cvalue, expires_date) {
            var expires = "expires=" + expires_date;
            document.cookie = cname + "=" + cvalue + ";" + (expires_date ? expires + ";" : "") + "path=/";
        },
        get_cookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    };

    return cookie;
});