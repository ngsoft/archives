// ==UserScript==
// @name         drama.net
// @namespace    ngsoft/newasian
// @version      1.0.1
// @description  UI Remaster
// @author       daedelus
// @include        *://*drama.net/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramanet.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramanet.user.js
// ==/UserScript==


(function() {

    var toolbox = {

        loader: {
            timeout: 1500,
            show: function() {
                document.body.style.opacity = '0';
            },
            hide: function() {
                setTimeout(function() {
                    document.body.style.opacity = '1';
                }, toolbox.loader.timeout);
            }
        },
        ui: {
            addcss: function(css) {
                html = '<style type="text/css"><!-- ' + css + ' --></style>';
                $('body').append(html);
            }
        },
        init: function(fn) {
            window.adblock = false;
            window.adblock2 = false;
            window.turnoff = true;
            window.open = function() {};
            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();
            interval = setInterval(function() {
                if (typeof $ !== 'undefined') {
                    toolbox.load();
                    clearInterval(interval);
                }
            }, 50);
        },
        ready: function(fn) {
            toolbox.load = fn;
            if (document.readyState != 'loading') {
                toolbox.wait();
            } else {
                document.addEventListener('DOMContentLoaded', toolbox.wait);
            }

        }
    };
    var dramanet = {
        ui: {
            css: ``,
            player: {

            }
        },
        init: function() {
            toolbox.ui.addcss(dramanet.ui.css);

            toolbox.loader.hide();
        }
    };
    toolbox.onload = function() {
        toolbox.loader.show();
    };
    toolbox.init(dramanet.init);
})();
