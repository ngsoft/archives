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

    var natv = {
        ui: {
            css: `
                iframe, .hidden, .trc_rbox_container, #comment {display: none!important;}
                #movie iframe { display: block!important;}
            `,
            player: {

                init: function() {

                    myInterval = setInterval(function() {
                        if (typeof $('video').attr('src') !== 'undefined') {
                            natv.ui.player.setevent();
                            clearInterval(myInterval);
                        }
                        if (typeof $('#player iframe').attr('src') !== 'undefined') {
                            natv.ui.player.setiframelink();
                            clearInterval(myInterval);
                        }
                    }, 50);
                },
                videoname: function() {
                    title = document.title;
                    title = title.split('|');
                    mytitle = title[0].replace('Watch', '');
                    mytitle = mytitle.replace('EngSub', '');
                    mytitle = mytitle.trim();
                    return mytitle + '.mp4';
                },
                videolink: function() {
                    return $('video').attr('src') + "?title=" + natv.ui.player.videoname();
                },
                addlink: function(url) {
                    if (typeof natv.ui.player.link !== 'undefined') {
                        natv.ui.player.link.attr('href', url);
                        return;
                    }
                    el = $('ul.menu li.child').last();
                    el = el.clone();
                    el.attr('id', 'videolink');
                    $('ul.menu').append(el);
                    natv.ui.player.link = el.find('a');
                    natv.ui.player.link.html('Open Video').attr('target', '_blank').attr('href', url);
                },
                setevent: function() {
                    natv.ui.player.addlink(natv.ui.player.videolink());

                    //https://www.w3.org/2010/05/video/mediaevents.html
                    $('video').on('loadeddata', function(e) {
                        natv.ui.player.addlink(natv.ui.player.videolink());
                    });
                    //loadstart
                    $('video').on('play', function(e) {
                        natv.ui.player.addlink(natv.ui.player.videolink());
                    });
                    $('ul.episode_list a').off('click');

                },
                setiframelink: function() {
                    url = $('#player iframe').attr('src');
                    if (url.indexOf('?') === -1)
                        url += '?title=' + natv.ui.player.videoname();
                    else
                        url += '&title=' + natv.ui.player.videoname();
                    natv.ui.player.addlink(url);

                }
            }
        },
        click: function() {
            toolbox.ui.loader.show();
        },

        init: function() {
            toolbox.ui.addcss(natv.ui.css);
            if (document.location.href.match(/\/watch\//) && $('video')) {
                natv.ui.player.init();
            }
            $('a[href^="/"').click(natv.click);
            $('a[href*="//newasian"').click(natv.click);

            toolbox.loader.hide();

        }
    };

    toolbox.onload = function() {
        toolbox.loader.show();
    };

    toolbox.init(natv.init);

})();