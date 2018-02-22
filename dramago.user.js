// ==UserScript==
// @name         Dramago, Gooddrama, Animewow, Animetoon
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramago.*/*
// @include     *://*gooddrama.*/*
// @include     *://*animewow.*/*
// @include     *://*animetoon.*/*
// @include     *://*animeplus.*/*
// @include     *://*video66.*/*
// @include     *://*easyvideo.*/*
// @include     *://*playbb.*/*
// @include     *://*yourupload.*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// ==/UserScript==

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
            if (toolbox.exec === true) {
                return;
            }
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

    /**
     * @link https://www.pexels.com/blog/css-only-loaders/ CSS Only Loaders
     */
    var cssloader = {
        css: `.cssloader{margin:50px;height:28px;width:28px;animation:rotate .8s infinite linear;border:8px solid #fff;border-right-color:transparent;border-radius:50%}@keyframes rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}div#spinner{display : block;position : fixed;z-index: 100;background-color: #000; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;}div#spinner > div{z-index : 101;position: absolute; top: 50%; left:50%; margin: -14px 0 0 -14px; opacity:1; color: #fff;}`,

        show: function() {
            if (typeof cssloader.loader === 'undefined') {
                toolbox.ui.addcss(cssloader.css);
                cssloader.loader = document.createElement('div');
                cssloader.loader.setAttribute('id', 'spinner');
                loader = document.createElement('div');
                loader.setAttribute('class', 'cssloader');
                cssloader.loader.appendChild(loader);

            }
            document.body.appendChild(cssloader.loader);
        },
        hide: function() {
            document.body.removeChild(cssloader.loader);

        }
    };




    /**
     * Sites Mods
     */

    var dramago = {
        player: false,
        ui: {
            css: `
                    [id*="comments"],iframe, div#body > div.right_col, div.ad, .hidden, div[id^="BB_SK"], div[id^="bb_sa"],div[id*="rcjsload"], div#Mad, div#M_AD, div#mini-announcement, div.s_right_col, div.l_right_col div#sidebar div#home_sidebar{display: none!important;}
                    div.s_left_col, div#body > div.left_col{float: none!important; width: auto!important;}
                    #options_bar, #genre_list{text-align: center;}
                body{background: none!important;}
                #streams iframe{display: block!important;}

            `,
            epl: function() {
                if ($('div#videos').length > 0) {
                    $('div#videos ul').html($('div#videos ul > li').get().reverse());
                    $('ul.pagination li button').on('click', toolbox.loader.show);
                    $('ul.pagination li button.selected').off('click');
                }
            },
            player: {
                init: function() {
                    console.debug('player loaded');
                    /*

                     $('#streams div.vmargin').each(function() {
                     if ($(this).find('iframe[src*="yucache"]').length < 1) {
                     $(this).addClass('hidden');
                     }
                     });*/
                }
            }
        },

        init: function() {
            console.debug("User script started");
            toolbox.loader.show();
            toolbox.ui.addcss(dramago.ui.css);
            if ($('div#streams').length > 0) {
                dramago.player = true;
            }

            dramago.ui.epl();

            if (dramago.player) {
                dramago.ui.player.init();
            }




            toolbox.loader.setevents();
            toolbox.loader.hide();



        }
    };

    var vids = {
        loaded: false,
        ui: {
            css: `
                        .sharetools-overlay, .hidden, #box_0{display: none!important;}
                `
        },
        init: function() {

            vids.loaded = true;
            console.debug('Vid UI loaded for ' + document.location.host);
            toolbox.ui.addcss(vids.ui.css);

            window.onclick = function() {};
            document.onclick = function() {};
            document.body.onclick = function() {};

        }
    };


    /**
     * Script start
     */


    if (document.location.origin.indexOf('drama') !== -1 || document.location.origin.indexOf('anime') !== -1) {
        toolbox.loader.onshow = cssloader.show;
        toolbox.loader.onhide = cssloader.hide;
        toolbox.init(dramago.init);
        return;
    }


    toolbox.init(vids.init);


    if (window.top !== window.self) {
        if (document.location.origin.indexOf('drama') !== -1 || document.location.origin.indexOf('anime') !== -1) {
            return;
        }
    }





    var max = 500;
    var t = 0;
    appinterval = setInterval(function() {
        if (typeof jQuery !== 'undefined') {
            clearInterval(appinterval);
            app(jQuery);
            return;
        }
        console.debug('jQuery not defined');
        t++;
        if (t === max) {
            console.debug('jQuery not defined (timeout, stopping script)');
            clearInterval(appinterval);
            return;
        }
    }, 100);

})();

