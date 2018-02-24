// ==UserScript==
// @name         fastdrama.co
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  simplify UI
// @author       daedelus
// @include     *://fastdrama.co/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/fastdrama.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/fastdrama.user.js
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
        //exec on jquery $(document).ready() ?
        ondocumentready: true,
        //auto load jquery
        autoloadjquery: false,

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
            remove: function(name) {
                Cookies.remove(name);
            },
            onready: function() {},
            init: function() {
                console.debug('User script loading "https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"');
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
            if (toolbox.autoloadjquery !== false) {
                console.debug('User script loading "https://code.jquery.com/jquery-3.2.1.min.js"');
                toolbox.ui.addscript('https://code.jquery.com/jquery-3.2.1.min.js');
            }
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
                            if (toolbox.ondocumentready === false) {
                                toolbox.load();
                            } else {
                                console.debug('User script waiting for $(document).ready()');
                                $(document).ready(toolbox.load);
                            }
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

    var fd = {
        css: `
                .hidden{display: none!important;}
                iframe:not(#videoembed), div[class*="ad"]{display: none!important;}
            `,
        init: function() {
            console.debug('user script started for ' + location.href);
            window.onclick = function() {};
            document.onclick = function() {};
            document.body.onclick = function() {};

            $('div.tabcontent a[href*="/watch-online/"]').each(function() {
                image = $(this).parent('div.image');
                if (image.length > 0) {
                    image.find('span.status').on('click', function(e) {
                        e.preventDefault();
                        href = $(this).parent('div.image').find('a[data-original]').first().attr('data-original');
                        if (href.length > 0) {
                            document.location.href = href;
                        }
                    });
                }
                href = $(this).attr('href');
                $(this).attr('data-original', href);
                href = href.replace('/watch-online/', '/');
                href = href.replace(/\/episode\-([0-9]+)/, '');
                $(this).attr('href', href);


            });

            setTimeout(function() {
                $('iframe:not(#videoembed)').remove();
            }, 5000);

        }
    };

    toolbox.onload = function() {
        if (document.getElementById('menu') === null) {
            console.debug('No Container root, stopping script execution ("' + document.location.href + '")');
            toolbox.exec = true;
            return;
        }


        toolbox.ui.addcss(fd.css);
        if (el = document.getElementById('disqus_thread')) {
            el.remove();
        }
    };


    toolbox.init(fd.init);







})();