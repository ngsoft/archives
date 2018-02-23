// ==UserScript==
// @name         Dramago, Gooddrama, Animewow, Animetoon
// @namespace    https://github.com/ngsoft
// @version      1.5
// @description  UI Remaster
// @author       daedelus
// @include     *://*.dramago.*/*
// @include     *://*gooddrama.*/*
// @include     *://*goodanime.*/*
// @include     *://*animewow.*/*
// @include     *://*animetoon.*/*
// @include     *://*animeplus.*/*
// @include     *://*.gogoanime.to/*
// @include     *://videozoo.me/videojs/*
// @include     *://playpanda.net/embed.php?*
// @include     *://play44.net/*
// @include     *://www.easyvideo.me/*
// @include     *://easyvideo.me/*
// @include     *://video66.org/*
// @include     *://playbb.me/*
// @include     *://www.yourupload.com/*
// @exclude     *://www.gogoanime.to/*
// @exclude     *://*.*/ads/*
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
            toolbox.onload();
            if (toolbox.autoloadjquery !== false) {
                console.debug('User script loading "https://code.jquery.com/jquery-3.2.1.min.js"');
                toolbox.ui.addscript('https://code.jquery.com/jquery-3.2.1.min.js');
            }
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

    /**
     * Sites Mods
     */

    var dramago = {
        player: false,
        ui: {
            css: `
                    .premiumdll, div#eps_blocks, [id*="comments"],iframe, div#body > div.right_col, div.ad, .hidden, div[id^="BB_SK"], div[id^="bb_sa"],div[id*="rcjsload"], div#Mad, div#M_AD, div#mini-announcement, div.s_right_col, div.l_right_col div#sidebar div#home_sidebar{display: none!important;}
                    div.s_left_col, div#body > div.left_col{float: none!important; width: auto!important;}
                    #options_bar, #genre_list{text-align: center;}
                #streams iframe, iframe.ignored {display: block!important;}

            `
        },

        init: function() {
            //no need for jquery there
            console.debug('user script dramago jquery content loaded');

            setTimeout(function() {
                console.debug("removing unrequired iframes");
                $('div#streams iframe').addClass('ignored');
                $('div.postcontent > p > iframe').addClass('ignored');
                $('iframe:not(.ignored)').remove();
            }, 5000);

            $('div.box').each(function() {
                if ($(this).parents('#container').length > 0) {
                    return;
                }
                title = $(this).find('h2').first();
                if (title.length > 0) {
                    title.on('click', function() {
                        el = $(this).parent('.box').find('div').first();

                        if (el.data('visible') !== true) {
                            el.slideDown().data('visible', true);
                            return;
                        }
                        el.slideUp().data('visible', false);
                        //el.addClass('hidden');
                    });

                    $(this).find('div').first().hide().data('visible', false);
                }
            });
        }
    };

    var vids = {
        loaded: false,
        ui: {
            css: `
                        .jhasvdjhas, .sharetools-overlay, .hidden, #box_0, div.safeuploada-filter{display: none!important;}
                        div#realdl{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: .5em 0;}
                        div#realdl a{color: #fff; text-decoration: none;}
                `
        },
        addlink: function() {
            if ($('div#realdl').length < 1) {
                console.debug('user script adding download link');
                realdl = document.createElement('div');
                realdl.setAttribute('id', 'realdl');
                a = document.createElement('a');
                a.setAttribute('href', '');
                a.text = 'DIRECT PLAY';
                realdl.appendChild(a);
                document.body.appendChild(realdl);
            }


        },
        onload: function() {
            toolbox.ui.addcss(vids.ui.css);
            toolbox.load = vids.init;
            toolbox.exec = false;
        },
        getscriptvideolink: function() {
            $('script:contains("var player")').each(function() {
                script = $(this).text();
                regex = new RegExp(/file: \"http(.*?)\",/);
                results = regex.exec(script);
                if (results !== null) {
                    href = 'http' + results[1];
                    vids.addlink();
                    $('div#realdl a').attr('href', href);
                }

            });

        },
        init: function() {
            console.debug("User script vids started for " + document.location.href);
            vids.loaded = true;
            window.onclick = function() {};
            document.onclick = function() {};
            document.body.onclick = function() {};

            if ($('div#flowplayer').length > 0) {
                return;
            }
            vids.getscriptvideolink();
            interval = setInterval(function() {

                if ($('div:contains("Setup Timeout Error")').length > 0) {
                    clearInterval(interval);
                    console.debug('vid userscript error : Setup Timeout Error, halting script');
                    return;
                }

                if ($('video').length > 0) {
                    clearInterval(interval);
                    //removeAd();
                    vids.addlink();
                    $('video').on('loadeddata', function(e) {
                        $('div#realdl a').attr('href', $(this).attr('src'));
                    }).on('play', function() {
                        $('div#realdl').addClass('hidden');
                        $('div#realdl a').attr('href', $(this).attr('src'));
                    }).on('pause', function() {
                        $('div#realdl').removeClass('hidden');
                        $('div#realdl a').attr('href', $(this).attr('src'));
                    }).each(function() {
                        vids.addlink();
                        $('div#realdl a').attr('href', $(this).attr('src'));
                    });
                }
            }, 50);


        }
    };


    /**
     * Script start
     */

    toolbox.onload = function() {

        if (document.getElementById('page') === null) {

            if (document.querySelector('div[id="myvid"]') !== null || document.querySelector('div[id="flowplayer"]') !== null || (document.location.host.indexOf('yourupload') !== -1 && document.getElementById('player') !== null)) {

                console.debug('detected div#myvid in ' + document.location.href + ', using video script.');
                vids.onload();
                return;
            }

            console.debug('No Container root, stopping script execution ("' + document.location.href + '")');
            toolbox.exec = true;
            return;
        }
        if (window.top !== window.self) {
            console.debug('inside iframe, halting script execution');
            toolbox.exec = true;
            return;
        }

        console.debug("User script dramago started for " + document.location.href);
        toolbox.ui.addcss(dramago.ui.css);
        //toolbox.ui.loadcss('https://cdn.jsdelivr.net/npm/animate.css@3.5.2/animate.min.css');

        toolbox.autoloadjquery = true;

        if (el = document.getElementById('disqus_thread')) {
            el.remove();
        }





    };


    toolbox.init(dramago.init);

})();

