// ==UserScript==
// @name         Dramanice UI Remaster
// @namespace    https://github.com/ngsoft
// @version      3.1
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramanice.*/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramanice.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramanice.user.js
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

            init: function() {
                toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');
                waitforcookies = setInterval(function() {
                    if (typeof Cookies !== 'undefined') {
                        clearInterval(waitforcookies);
                        toolbox.cookies.ready = true;
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

    var dramanice = {

        ui: {
            css: `
                div[id*="rcjsload"],.ads-outsite, .PubAdAI, .ads, .facebookbox, .social_dis, div[class*="ads_"], .btn.twitter, .btn.facebook, a[href*="/report.html"]{
                    display: none !important;
                }

            `
        },

        init: function() {
            console.debug('User  script started.');

            $('div.play-video > iframe').addClass('ignored');


            $('div.button_share > a#download_link').off('click').on('click', function(e) {
                if ($('div.play-video > iframe').length > 0) {
                    e.preventDefault();
                    link = $(this).attr('href');
                    $('div.play-video > iframe').attr('src', link);
                }
            });



            setTimeout(function() {
                $('iframe:not(.ignored)').remove();
            }, 2000);


            toolbox.loader.setevents();
            toolbox.loader.hide();
        }
    };

    toolbox.onload = function() {
        if (document.getElementById("wrapper_inside") === null) {
            console.debug('No Container root, stopping script execution');
            toolbox.load = function() {};
            toolbox.exec = true;
            return;
        }


        toolbox.ui.addcss(dramanice.ui.css);
        toolbox.loader.onshow = cssloader.show;
        toolbox.loader.onhide = cssloader.hide;
        toolbox.loader.timeout = 200;
        toolbox.loader.show();

    };
    toolbox.init(dramanice.init);





})();
