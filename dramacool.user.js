// ==UserScript==
// @name         Dramacool UI Remaster + Videouploader
// @namespace    https://github.com/ngsoft
// @version      4.1
// @description  UI Remaster + Videoupload
// @author       daedelus
// @include     *://*dramacool*/*
// @include     *://*watchasia*/*
// @include     *://*animetv*/*
// @include     *://*myanimeseries*/*
// @include     *://videoupload.*/*
// @include     *://vidstream.*/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
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
    var dramacool = {

        drama: true,
        ui: {
            css: `
                    div[id*="BB_SK"], .mediaplayer .content-right, div[class*="ads_"],div[id*="rcjsload"],.report2,.ads-outsite, #disqus_thread, .slide_mobilde, .content-right .fanpage, .show-all, .btn-show-all, .mediaplayer header, .mediaplayer footer, .hidden, .plugins2 ul li.favorites{
                            display: none !important;
                    }
                    .mediaplayer .content-left{width:100%!important;}
                    iframe, .watch-drama .note{display:none;}
                    .watch-iframe iframe{display: block;}
                    .watch-drama .plugins2 .facebook{
                        margin-right: 2px!important;
                    }
                    .plugins2 ul li.direction a{background-color: rgb(0, 171, 236);}
            `,
            btnsvr: `<li class="facebook"><i class="fa fa-server"></i><span>Select Servers</span></li>`,
            btnep: `<li class="twitter"><i class="fa fa-file-video-o"></i><span>Select Episode</span></li>`,
            btdl: {},
            player: {
                init: function() {

                    if (dramacool.drama == false) {
                        return dramacool.ui.anime.init();
                    }
                    $('.container').addClass('mediaplayer');
                    $('.watch-drama .anime_muti_link').addClass('hidden');
                    $('.watch-drama div:contains("Please scroll down to choose")').addClass('hidden');
                    $('ul.all-episode').parents('div.block-tab').addClass('hidden');
                    $('.plugins2 a.chrome-notify').parents('li').addClass('hidden');
                    $('.plugins2 .reports').remove();
                    $('.plugins2 .facebook').remove();
                    $('.plugins2 .twitter').remove();
                    dramacool.ui.btnsvr = $(dramacool.ui.btnsvr);
                    dramacool.ui.btnsvr.click(function(e) {
                        if ($('.watch-drama .anime_muti_link').hasClass('hidden'))
                            $('.watch-drama .anime_muti_link').removeClass('hidden');
                        else
                            $('.watch-drama .anime_muti_link').addClass('hidden');
                    });
                    dramacool.ui.btnep = $(dramacool.ui.btnep);
                    dramacool.ui.btnep.click(function(e) {
                        selector = $('ul.all-episode').parents('div.block-tab');
                        if (selector.hasClass('hidden'))
                            selector.removeClass('hidden');
                        else
                            selector.addClass('hidden');
                    });
                    $('.plugins2 ul').prepend(dramacool.ui.btnep);
                    $('.plugins2 ul').prepend(dramacool.ui.btnsvr);
                    $('.plugins2 ul li.download a').on('click', function(e) {
                        e.preventDefault();
                        $('.watch-iframe iframe').attr('src', $(this).attr('href'));
                    });
                }
            },
            anime: {
                css: `.popover-favorites, div.content_right, div.header, div.footer {display: none!important;} div.content div.content_left{float: none; width: auto;} .plugins li.facebook span, .plugins li.twitter span{margin-left: 5px;} .content_left .main_body{min-height: 0;}`,
                hidebtn: function(cls) {
                    target = $('.video_watch i.' + cls);
                    if (target.length > 0) {
                        target.parents('li').addClass('hidden');
                    }
                },
                init: function() {
                    toolbox.ui.addcss(dramacool.ui.anime.css);
                    toolbar = $('.video_watch .fa-facebook-f').parents('ul');
                    //hide unused btns
                    dramacool.ui.anime.hidebtn('fa-facebook-f');
                    dramacool.ui.anime.hidebtn('fa-twitter');
                    dramacool.ui.anime.hidebtn('fa-heart');
                    dramacool.ui.anime.hidebtn('fa-comment');
                    dramacool.ui.anime.hidebtn('fa-exclamation-triangle');
                    dramacool.ui.anime.hidebtn('fa-chrome');
                    //add custom btns
                    dramacool.ui.btnsvr = $(dramacool.ui.btnsvr);
                    dramacool.ui.btnep = $(dramacool.ui.btnep);
                    toolbar.prepend(dramacool.ui.btnep).prepend(dramacool.ui.btnsvr);
                    $('div[class*="list_episode"]').addClass('hidden');
                    dramacool.ui.btnsvr.off('click').on('click', function() {
                        target = $('div.list_episode_video');
                        if (target.hasClass('hidden')) {
                            target.removeClass('hidden');
                        } else {
                            target.addClass('hidden');
                        }
                    });
                    dramacool.ui.btnep.off('click').on('click', function() {
                        target = $('div.list_episode');
                        if (target.hasClass('hidden')) {
                            target.removeClass('hidden');
                        } else {
                            target.addClass('hidden');
                        }
                    });
                    //dlbtn
                    btndl = $('.fa-download').parent('a');
                    btndl.off('click').on('click', function(e) {
                        e.preventDefault();
                        link = new URL($(this).attr('href'));
                        link.host = 'vidstream.co';
                        $('div.watch-iframe iframe').first().attr('src', link.href);
                    });
                }
            },
            nav: {
                css: `
                        div.content-left div.block-tab ul.tab li span input{vertical-align: middle; width: 12px; height: 12px;}

                        div.content-left div.block-tab ul.tab li.userplugin{color: rgb(62, 194, 207); background-color: #FFF; margin-left: 5px;}
                        div.content-left div.block-tab ul.tab li.active{color: rgb(253, 184, 19);}

                    `,
                buttons: {
                    b1: 'false',
                    b2: 'false',
                    switch : 'list-episode-item'
                },
                update: function() {
                    Cookies.set('userbuttons', dramacool.ui.nav.buttons, {expires: 14});
                    console.debug(dramacool.ui.nav.buttons);
                },
                b1toogle: function(e) {
                    console.debug(e);
                    if (dramacool.ui.nav.buttons.b1 === 'true') {
                        $('#b1').removeClass('active');
                        dramacool.ui.nav.buttons.b1 = 'false';
                        $('ul[class*="list-episode-item"] li').removeClass('hidden');
                    } else {
                        $('#b1').addClass('active');
                        dramacool.ui.nav.buttons.b1 = 'true';
                        $('ul[class*="list-episode-item"] li').addClass('hidden');
                        $('ul[class*="list-episode-item"] li[data-subbed]').removeClass('hidden');
                    }
                    dramacool.ui.nav.update();
                },
                switchview: function() {

                    dramacool.ui.nav.buttons.switch = $(this).attr('data-view');


                    dramacool.ui.nav.update();

                },
                init: function() {
                    toolbox.ui.addcss(dramacool.ui.nav.css);

                    /**
                     * Subs only button
                     */
                    if ($('ul[class*="list-episode-item"] li span.ep').length > 0) {
                        b1 = $('<li id="b1" class="userplugin"><span><i class="fa fa-file-text-o" aria-hidden="true"></i> Sub only</span></li>');
                        $('div.content-left div.block-tab ul.tab').first().append(b1);
                        buttons = Cookies.getJSON('userbuttons');

                        if (typeof buttons.b1 !== 'undefined') {
                            dramacool.ui.nav.buttons.b1 = buttons.b1;
                        }



                        $('#b1').off('click').on('click', dramacool.ui.nav.b1toogle);
                        $('ul[class*="list-episode-item"] li').each(function() {
                            if ($(this).find('span.ep.SUB').length > 0) {
                                $(this).attr('data-subbed', true);
                            }
                            if ($(this).find('span.ep.SUB').length > 0) {
                                $(this).attr('data-subbed', true);
                            }

                            a = $(this).find('a').first();
                            if (a.length > 0) {

                                regexp = new RegExp(/^(.*?)\-episode\-([0-9]+)\.html$/i);
                                href = a.attr('href');
                                //href = href.replace(/\-episode\-([0-9]+)\.html$/i, '');
                                if (results = regexp.exec(href)) {
                                    href = '/drama-detail' + results[1];
                                    a.attr('href', href);
                                    a.find('h3.title').removeAttr('onclick').off('click');
                                    /*.on('click', function() {
                                     location = $(this).parent('a').attr('href');
                                     });*/
                                }
                            }



                        });

                        if (dramacool.ui.nav.buttons.b1 === 'true') {
                            $('ul[class*="list-episode-item"] li').addClass('hidden');
                            $('ul[class*="list-episode-item"] li[data-subbed]').removeClass('hidden');
                            $('#b1').addClass('active');
                        }
                    }

                    /**
                     * Auto switch view
                     */
                    if ($('div.block-tab ul.switch-view').length > 0) {
                        buttons = Cookies.getJSON('userbuttons');

                        if (typeof buttons.switch !== 'undefined') {
                            dramacool.ui.nav.buttons.switch = buttons.switch;
                        }

                        $('div.block-tab ul.switch-view li').on('click', dramacool.ui.nav.switchview);

                        $('div.block-tab ul.switch-view li').removeClass('selected');
                        $('div.block-tab ul.switch-view li[data-view="' + dramacool.ui.nav.buttons.switch + '"]').addClass('selected');
                        $('ul.switch-block').removeClass('list-episode-item').removeClass('list-episode-item-2');
                        $('ul.switch-block').addClass($('div.block-tab ul.switch-view li.selected').attr('data-view'));
                    }
                }
            }

        },
        init: function() {
            //anime site detection
            if (location.host.indexOf('anime') !== -1) {
                dramacool.drama = false;
            }
            toolbox.ui.addcss(dramacool.ui.css);
            toolbox.loader.show();
            if (document.location.href.match(/\-episode\-/))
                dramacool.ui.player.init();
            $('.ads-outsite').remove();
            $('#disqus_thread').remove();
            $('.block-watch').find('div').first().remove();
            $('.watch-drama > iframe').remove();
            $("ul.tab li:contains('Ads')").removeClass('selected').hide();
            $("ul.tab li:contains('Ongoing')").click();
            $('ul.all-episode').html($('ul.all-episode').find('li').css('display', 'inline-block').get().reverse());
            $('.list_episode ul').html($('.list_episode ul').find('li').css('display', 'inline-block').get().reverse());
            $('iframe').parent('div:not(.watch-iframe)').remove();
            $('nav.menu_top ul.navbar li a:contains("Request")').remove();
            $('nav.menu_top ul.navbar li a:contains("Login")').remove();
            dramacool.ui.nav.init();
            $('a[href^="/"]').click(toolbox.loader.show);
            $('a[href^="' + location.origin + '"]').click(toolbox.loader.show);


            toolbox.loader.hide();
        }
    };
    var vu = {
        ui: {
            css: `  .hidden, [data-inside-iframe] header, [data-inside-iframe] footer, .watch, .sumer{display: none!important;}
                    [data-inside-iframe] .content_l {width: 200px;}
                    .mirror_link{padding-top: 10px; border-top: 1px solid #8d8d8d; margin-top: 10px;}
                    .content_c_bg{min-height: 290px;}
                    [data-inside-iframe] .content_c_bg{margin-top: 90px;}
                    `
        },

        title: function() {
            params = new URLSearchParams(location.search);
            title = params.get('title');
            title = title.replace(':', ' ', title);
            title = title.trim();
            title += '.mp4';
            return title;
        },
        links: function() {
            return $('#main .mirror_link div.dowload a');
        },
        init: function() {
            toolbox.loader.show();
            toolbox.ui.addcss(vu.ui.css);
            if (window.top != window.self) {
                $('body').attr('data-inside-iframe', true);
            }
            vu.links().each(function() {

                link = $(this).attr('href');
                if (link.match(/^\/\//)) {
                    link = 'https:' + link;
                }

                href = new URL(link);
                //params = new URLSearchParams(href.search);
                href.searchParams.set('title', vu.title());
                $(this).attr('target', '_blank').attr('href', href);
            });
            toolbox.loader.hide();
        }
    };

    var spinner = {

        html: `<style type="text/css"><!-- div#spinner{display : block;position : fixed;z-index: 100;background-color: #121212; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;} div#spinner img{left : 50%;top : 50%;position : absolute;z-index : 101;width : 32px;height : 32px;margin-left : -16px;margin-top : -16px;} --></style><div id="spinner"><img alt="" class="" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIHZpZXdCb3g9IjAgMCA0MCA0MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7IiB4PSIwcHgiIHk9IjBweCI+CiAgICA8ZGVmcz4KICAgICAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwogICAgICAgICAgICBALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7CiAgICAgICAgICAgICAgZnJvbSB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTM1OWRlZykKICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHsKICAgICAgICAgICAgICBmcm9tIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICAgIHRvIHsKICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0zNTlkZWcpCiAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIHN2ZyB7CiAgICAgICAgICAgICAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7CiAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbjogc3BpbiAxLjVzIGxpbmVhciBpbmZpbml0ZTsKICAgICAgICAgICAgICAgIC13ZWJraXQtYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuOwogICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBzcGluIDEuNXMgbGluZWFyIGluZmluaXRlOwogICAgICAgICAgICB9CiAgICAgICAgXV0+PC9zdHlsZT4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSJvdXRlciI+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwwQzIyLjIwNTgsMCAyMy45OTM5LDEuNzg4MTMgMjMuOTkzOSwzLjk5MzlDMjMuOTkzOSw2LjE5OTY4IDIyLjIwNTgsNy45ODc4MSAyMCw3Ljk4NzgxQzE3Ljc5NDIsNy45ODc4MSAxNi4wMDYxLDYuMTk5NjggMTYuMDA2MSwzLjk5MzlDMTYuMDA2MSwxLjc4ODEzIDE3Ljc5NDIsMCAyMCwwWiIgc3R5bGU9ImZpbGw6YmxhY2s7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNNS44NTc4Niw1Ljg1Nzg2QzcuNDE3NTgsNC4yOTgxNSA5Ljk0NjM4LDQuMjk4MTUgMTEuNTA2MSw1Ljg1Nzg2QzEzLjA2NTgsNy40MTc1OCAxMy4wNjU4LDkuOTQ2MzggMTEuNTA2MSwxMS41MDYxQzkuOTQ2MzgsMTMuMDY1OCA3LjQxNzU4LDEzLjA2NTggNS44NTc4NiwxMS41MDYxQzQuMjk4MTUsOS45NDYzOCA0LjI5ODE1LDcuNDE3NTggNS44NTc4Niw1Ljg1Nzg2WiIgc3R5bGU9ImZpbGw6cmdiKDIxMCwyMTAsMjEwKTsiLz4KICAgICAgICA8L2c+CiAgICAgICAgPGc+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMCwzMi4wMTIyQzIyLjIwNTgsMzIuMDEyMiAyMy45OTM5LDMzLjgwMDMgMjMuOTkzOSwzNi4wMDYxQzIzLjk5MzksMzguMjExOSAyMi4yMDU4LDQwIDIwLDQwQzE3Ljc5NDIsNDAgMTYuMDA2MSwzOC4yMTE5IDE2LjAwNjEsMzYuMDA2MUMxNi4wMDYxLDMzLjgwMDMgMTcuNzk0MiwzMi4wMTIyIDIwLDMyLjAxMjJaIiBzdHlsZT0iZmlsbDpyZ2IoMTMwLDEzMCwxMzApOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksMjguNDkzOUMzMC4wNTM2LDI2LjkzNDIgMzIuNTgyNCwyNi45MzQyIDM0LjE0MjEsMjguNDkzOUMzNS43MDE5LDMwLjA1MzYgMzUuNzAxOSwzMi41ODI0IDM0LjE0MjEsMzQuMTQyMUMzMi41ODI0LDM1LjcwMTkgMzAuMDUzNiwzNS43MDE5IDI4LjQ5MzksMzQuMTQyMUMyNi45MzQyLDMyLjU4MjQgMjYuOTM0MiwzMC4wNTM2IDI4LjQ5MzksMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxMDEsMTAxLDEwMSk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMy45OTM5LDE2LjAwNjFDNi4xOTk2OCwxNi4wMDYxIDcuOTg3ODEsMTcuNzk0MiA3Ljk4NzgxLDIwQzcuOTg3ODEsMjIuMjA1OCA2LjE5OTY4LDIzLjk5MzkgMy45OTM5LDIzLjk5MzlDMS43ODgxMywyMy45OTM5IDAsMjIuMjA1OCAwLDIwQzAsMTcuNzk0MiAxLjc4ODEzLDE2LjAwNjEgMy45OTM5LDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoMTg3LDE4NywxODcpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTUuODU3ODYsMjguNDkzOUM3LjQxNzU4LDI2LjkzNDIgOS45NDYzOCwyNi45MzQyIDExLjUwNjEsMjguNDkzOUMxMy4wNjU4LDMwLjA1MzYgMTMuMDY1OCwzMi41ODI0IDExLjUwNjEsMzQuMTQyMUM5Ljk0NjM4LDM1LjcwMTkgNy40MTc1OCwzNS43MDE5IDUuODU3ODYsMzQuMTQyMUM0LjI5ODE1LDMyLjU4MjQgNC4yOTgxNSwzMC4wNTM2IDUuODU3ODYsMjguNDkzOVoiIHN0eWxlPSJmaWxsOnJnYigxNjQsMTY0LDE2NCk7Ii8+CiAgICAgICAgPC9nPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBkPSJNMzYuMDA2MSwxNi4wMDYxQzM4LjIxMTksMTYuMDA2MSA0MCwxNy43OTQyIDQwLDIwQzQwLDIyLjIwNTggMzguMjExOSwyMy45OTM5IDM2LjAwNjEsMjMuOTkzOUMzMy44MDAzLDIzLjk5MzkgMzIuMDEyMiwyMi4yMDU4IDMyLjAxMjIsMjBDMzIuMDEyMiwxNy43OTQyIDMzLjgwMDMsMTYuMDA2MSAzNi4wMDYxLDE2LjAwNjFaIiBzdHlsZT0iZmlsbDpyZ2IoNzQsNzQsNzQpOyIvPgogICAgICAgIDwvZz4KICAgICAgICA8Zz4KICAgICAgICAgICAgPHBhdGggZD0iTTI4LjQ5MzksNS44NTc4NkMzMC4wNTM2LDQuMjk4MTUgMzIuNTgyNCw0LjI5ODE1IDM0LjE0MjEsNS44NTc4NkMzNS43MDE5LDcuNDE3NTggMzUuNzAxOSw5Ljk0NjM4IDM0LjE0MjEsMTEuNTA2MUMzMi41ODI0LDEzLjA2NTggMzAuMDUzNiwxMy4wNjU4IDI4LjQ5MzksMTEuNTA2MUMyNi45MzQyLDkuOTQ2MzggMjYuOTM0Miw3LjQxNzU4IDI4LjQ5MzksNS44NTc4NloiIHN0eWxlPSJmaWxsOnJnYig1MCw1MCw1MCk7Ii8+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K" /></div>`,
        show: function() {
            if ($('div#spinner').length > 0)
            {
                $('div#spinner').show();
                return;
            }
            $('body').append(spinner.html);
        },
        hide: function() {
            if ($('div#spinner').length > 0) {
                $('div#spinner').hide();
            }
        }
    };

    var faspinner = {

        css: `div#spinner{display : block;position : fixed;z-index: 100;background-color: #121212; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;} div#spinner i{font-size: 32px; color: #EFEFEF; left : 50%;top : 50%;position : absolute;z-index : 101;width : 32px;height : 32px;margin-left : -16px;margin-top : -16px;}`,

        html: `<div id="spinner"><i class="fa fa-spinner fa-pulse fa-3x fa-fw" aria-hidden="true"></i></div>`,
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

    toolbox.loader.onshow = spinner.show;
    toolbox.loader.onhide = spinner.hide;
    toolbox.onload = function() {
        toolbox.ui.addscript('https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js');

    };

    //videouploader
    if (document.location.host.indexOf('vid') !== -1) {
        toolbox.ui.addscript('https://code.jquery.com/jquery-3.2.1.min.js');
        toolbox.init(vu.init);
        return;
    }

    if (window.top != window.self) {
        return;
    }

    toolbox.loader.onshow = faspinner.show;
    toolbox.loader.onhide = faspinner.hide;



    toolbox.wait = function() {
        toolbox.onload();
        interval = setInterval(function() {
            if (typeof $ !== 'undefined' && typeof Cookies !== 'undefined') {
                toolbox.load();
                clearInterval(interval);
            }
        }, 50);
    };

    toolbox.init(dramacool.init);
})();

