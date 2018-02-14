// ==UserScript==
// @name         Dramago, Gooddrama, Animewow, Animetoon
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramago*/*
// @include     *://*gooddrama*/*
// @include     *://*animewow*/*
// @include     *://*animetoon*/*
// @include     *://*video66.*/*
// @include     *://*easyvideo.*/*
// @include     *://*playbb.*/*
// @include     *://*yourupload.*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramago.user.js
// ==/UserScript==


(function() {
    window.open = function() {};
    window.eval = function() {};
    app = function($) {



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
            toolbox.loader.onshow = faspinner.show;
            toolbox.loader.onhide = faspinner.hide;
            faspinner.loadfont();
            $(document).ready(dramago.init);
            return;
        }
        $(document).ready(vids.init);
    };

    if (window.top != window.self) {
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

