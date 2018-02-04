// ==UserScript==
// @name         streamango
// @namespace    https://github.com/ngsoft
// @version      1.0.1
// @description  UI Remaster
// @author       daedelus
// @include     *://streamango.*/embed/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/streamango.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/streamango.user.js
// ==/UserScript==

(function() {
    window.adblock = false;
    window.adblock2 = false;
    window.turnoff = true;
    window.open = function() {};
    window.eval = function() {};

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

    var mango = {

        init: function() {


            $('.vjs-big-play-button').click();


        }
    };



    toolbox.onload = function() {


    };

    toolbox.init(mango.init);

})();