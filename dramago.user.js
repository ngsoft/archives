// ==UserScript==
// @name         Dramago, Gooddrama, Animewow
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramago*/*
// @include     *://*gooddrama*/*
// @include     *://*animewow*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// ==/UserScript==

(function() {
    /**
     * Userscript library
     */

    var toolbox = {

        loader: {
            timeout: 1500,
            show: function() {
                toolbox.loader.onshow();
            },
            hide: function() {
                setTimeout(toolbox.loader.onhide, toolbox.loader.timeout);
            },
            onshow: function() {
                document.body.style.opacity = 0;
            },
            onhide: function() {
                document.body.style.opacity = 1;
            },
            setevents: function() {
                $('a[href^="/"]').on('click', toolbox.loader.show);
                $('a[href^="' + location.origin + '"]').on('click', toolbox.loader.show);
                $('a[href^="?"]').on('click', toolbox.loader.show);
            }
        },
        ui: {
            addscript: function(src) {
                var s = document.createElement('script');
                s.setAttribute('src', src);
                document.body.appendChild(s);
            },
            addcss: function(css) {
                html = '<style type="text/css"><!-- ' + css + ' --></style>';
                $('body').append(html);
            },
            loadcss: function(cssurl) {
                var s = document.createElement('link');
                s.setAttribute('rel', "stylesheet");
                s.setAttribute('href', cssurl);
                document.head.appendChild(s);
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

    var faspinner = {

        css: `div#spinner{display : block;position : fixed;z-index: 100;background-color: #121212; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;} div#spinner i{font-size: 32px; color: #EFEFEF; left : 50%;top : 50%;position : absolute;z-index : 101;width : 32px;height : 32px;margin-left : -16px;margin-top : -16px;}`,

        html: `<div id="spinner"><i class="fa fa-spinner fa-pulse fa-3x fa-fw" aria-hidden="true"></i></div>`,
        loadfont: function() {
            toolbox.ui.loadcss('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
        },
        show: function() {
            if ($('div#spinner').length > 0)
            {
                $('div#spinner').show();
                return;
            }
            toolbox.ui.addcss(faspinner.css);
            $('body').append(faspinner.html);
        },
        hide: function() {
            if ($('div#spinner').length > 0) {
                $('div#spinner').hide();
            }
        }
    };

    toolbox.loader.onshow = faspinner.show;
    toolbox.loader.onhide = faspinner.hide;

    toolbox.onload = function() {
        //toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');
        faspinner.loadfont();

    };

    toolbox.init(dramago.init);











})();