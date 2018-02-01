// ==UserScript==
// @name         New Asian TV
// @namespace    ngsoft/newasian
// @version      2.0.1
// @description  UI Remaster
// @author       daedelus
// @include        *://newasiantv.*/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/newasiantv.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/newasiantv.user.js
// ==/UserScript==

(function() {

    var toolbox = {

        loader: {
            show: function() {
                document.body.style.opacity = '0';
            },
            hide: function() {
                document.body.style.opacity = '1';
            }
        },
        ui: {
            addcss: function(css) {
                html = '<style type="text/css"><!-- ' + css + ' --></style>';
                $('body').append(css);
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























})();