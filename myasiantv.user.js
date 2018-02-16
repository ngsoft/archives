// ==UserScript==
// @name         MyAsian.TV
// @namespace    https://github.com/ngsoft
// @version      1.2
// @description  UI Remaster
// @author       daedelus
// @include     *://*myasiantv*/*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/myasiantv.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/myasiantv.user.js
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

            toolbox.ready(fn);
        },
        onload: function() {},
        load: function() {},
        wait: function() {
            toolbox.onload();
            interval = setInterval(function() {
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


    var atv = {
        ui: {
            css: `  [data-player-enabled] div.play > i,[data-player-enabled] #content > .content-right, [data-player-enabled] #content > .content-line-2, div.play div.share, .addthis_toolbox, #content > .episode-new, .movie-random, a.closeads, a.report, .comment, #disqus_thread, #geniee_overlay, .PubAdAI, .trc_related_container, .av-right, .hidden {display: none!important;}
                    [data-player-enabled] #listep > h3, [data-player-enabled] #listep >ul , [data-player-enabled] #content > .content-left{float: none; width: auto;}`
        },

        init: function() {
            console.debug('User Script Started');
            $('#player > iframe').each(function() {
                $(this).addClass('ignored');
                $('body').attr('data-player-enabled', true);
            });
            $('iframe:not(.ignored)').remove();
            //$('div.sound').remove();

            $('ul.list-episode').each(function() {
                $this = $(this);
                if ($(this).find('a.paging').length > 0) {
                    $(this).find('a.paging').on('click', function(e) {
                        e.preventDefault();
                        setTimeout(function() {
                            $this.html($this.find('li').get().reverse());
                        }, 1000);

                    }).click();
                    return;
                }
                $(this).html($(this).find('li').get().reverse());
            });
            toolbox.loader.setevents();

            $('ul.pagination a').on('click', toolbox.loader.hide);

            if ($('#player > iframe').length > 0 && $('div#listep').length > 0) {
                el = $('<a id="eptoogle" class="download" href="#">Select Episode</a>');
                $('div.play div.button').prepend(el);
                el.on('click', function(e) {
                    e.preventDefault();
                    if ($('div#listep').hasClass('hidden')) {
                        $('div#listep').removeClass('hidden');
                        return;
                    }
                    $('div#listep').addClass('hidden');

                });
                $('div#listep').addClass('hidden');

            }



            toolbox.loader.hide();
        }
    };




    toolbox.onload = function() {
        if (el = document.getElementById('disqus_thread')) {
            el.remove();
        }
        el = document.getElementsByClassName('sound');
        if (el.length > 0) {
            for (var i = 0; i < el.length; i++) {
                el[i].remove();
            }
        }

    };
    toolbox.loader.onshow = cssloader.show;
    toolbox.loader.onhide = cssloader.hide;
    toolbox.loader.timeout = 200;
    toolbox.loader.show();
    toolbox.ui.addcss(atv.ui.css);
    toolbox.init(atv.init);


})();