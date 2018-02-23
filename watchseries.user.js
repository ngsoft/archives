// ==UserScript==
// @name         Watch Series 2.0
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  UI Remaster
// @author       daedelus
// @include     *://watch-series.*/*
// @include     *://watchseries.*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/watchseries.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/watchseries.user.js
// ==/UserScript==

//use host :
//104.18.46.168 cdn.watchasian.co cdn.dramacools.to cdn.dramanice.es cdn-drama.watch-series.co

window.open = function() {};
window.eval = function() {};

(function() {
    /**
     * Userscript library
     */

    var toolbox = {
        //runonce (prevent loop execution on error)
        exec: false,
        //interval for jquery check
        interval: 50,

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
                s = document.createElement('script');
                s.setAttribute('src', src);
                document.body.appendChild(s);
            },
            addcss: function(css) {
                s = document.createElement('style');
                s.setAttribute('type', "text/css");
                s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
                document.body.appendChild(s);
            },
            loadcss: function(cssurl) {
                s = document.createElement('link');
                s.setAttribute('rel', "stylesheet");
                s.setAttribute('href', cssurl);
                document.head.appendChild(s);
            }
        },
        cookies: {
            ready: false,
            expire: 14,
            data: {},
            get: function(name, value = null) {
                if (toolbox.cookies.ready === false) {
                    return value;
                }
                if (typeof toolbox.cookies.data[name] === 'undefined') {
                    toolbox.cookies.data[name] = value;
                    get = Cookies.get(name);
                    if (typeof get !== 'undefined') {
                        toolbox.cookies.data[name] = get;
                    }
                }
                return toolbox.cookies.data[name];
            },
            set: function(name, value) {
                toolbox.cookies.data[name] = value;
                if (toolbox.cookies.ready === false) {
                    return;
                }
                Cookies.set(name, value, {expires: toolbox.cookies.expire});
            },
            onready: function() {},
            init: function() {
                toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');
                waitforcookies = setInterval(function() {
                    if (typeof Cookies !== 'undefined') {
                        clearInterval(waitforcookies);
                        toolbox.cookies.ready = true;
                        toolbox.cookies.onready();
                    }
                }, toolbox.interval);
            }
        },
        init: function(fn, interval = 50) {
            toolbox.interval = interval;
            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();

            interval = setInterval(function() {
                if (toolbox.exec === true) {
                    clearInterval(interval);
                    return;
                }
                if (typeof jQuery !== 'undefined') {
                    if (toolbox.exec === false) {
                        clearInterval(interval);
                        (function($) {
                            $(document).ready(toolbox.load);
                            toolbox.exec = true;
                        })(jQuery);
                    }
                }
            }, toolbox.interval);
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


    var ws = {
        css: `
                .hidden, .ads{display: none!important;}
             `,
        init: function() {
            console.debug('User script started');

            $('[src*="cdn-drama.watch-series.co"]').each(function() {
                src = $(this).attr('src');
                src = src.replace("cdn-drama.watch-series.co", "cdn.watchasian.co");
                $(this).attr('src', src);
            });

            $('[style*="cdn-drama.watch-series.co"]').each(function() {
                style = $(this).attr('style');
                style = style.replace("cdn-drama.watch-series.co", "cdn.watchasian.co");
                $(this).attr('style', style);
            });




        }
    };

    toolbox.onload = function() {
        toolbox.ui.addcss(ws.css);
    };



    toolbox.init(ws.init);



})();