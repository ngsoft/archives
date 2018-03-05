// ==UserScript==
// @name         Dramacool (UI Remaster + Videouploader)
// @namespace    https://github.com/ngsoft
// @version      6.9
// @description  UI Remaster + Videoupload (last legacy version)
// @author       daedelus
// @include     *://*dramacool*.*/*
// @include     *://*watchasia*.*/*
// @include     *://animetv.*/*
// @include     *://myanimeseries.*/*
// @include     *://videoupload.*/*
// @include     *://vidstream.*/*
// @include     *://azvideo.*/file/*
// @include     *://k-vid.net/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
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
            getobj: function(name, value = {}) {
                if (toolbox.cookies.ready === false) {
                    return value;
                }
                if (typeof toolbox.cookies.data[name] === 'undefined') {
                    toolbox.cookies.data[name] = value;
                    get = Cookies.getJSON(name);
                    if (typeof get === 'object') {
                        toolbox.cookies.data[name] = get;
                    }
                }
                return toolbox.cookies.data[name];
            },
            set: function(name, value) {
                if (toolbox.cookies.ready === false) {
                    return;
                }
                toolbox.cookies.data[name] = value;
                Cookies.set(name, value, {expires: toolbox.cookies.expire});
            },
            remove: function(name) {
                toolbox.cookies.data[name] = null;
                delete toolbox.cookies.data[name];
                Cookies.remove(name);
            },
            save: function(name = null) {
                if (typeof toolbox.cookies.data === 'object') {
                    //save all
                    if (name === null) {
                        Object.keys(toolbox.cookies.data).map(function(key, index) {
                            toolbox.cookies.set(key, toolbox.cookies.data[key]);
                        });
                    } else if (typeof toolbox.cookies.data[name] !== 'undefined') {
                        toolbox.cookies.set(name, toolbox.cookies.data[name]);
                    }
            }

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
        init: function(fn = null, interval = 50) {
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
        ready: function(fn = null) {
            if (typeof fn === 'function') {
                toolbox.load = fn;
            }
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
div[id*="BB_SK"], .mediaplayer .content-right, div[class*="ads_"],div[id*="rcjsload"],.report2,.ads-outsite, #disqus_thread, .content-right .fanpage, .show-all, .btn-show-all, .hidden, .ajs-content .top, .ajs-content .list_episode .list_top{
        display: none !important;
}
.mediaplayer .content-left{width:100%!important;}
iframe, .watch-drama .note{display:none;}
.watch-iframe iframe, [data-visible].hidden{display: block!important;}
.watch-drama .plugins2 .facebook{
    margin-right: 2px!important;
}
.plugins2 ul li.direction a{background-color: rgb(0, 171, 236);}
button.ajs-button.ajs-ok{float:right;}
.details .info {font-size: 10pt;}
.details .info h1 {font-size: 24pt;}
.details .info > p {position: relative;display: block;}
.alertify-notifier, .alertify{font-size: 12pt;}
.btn-btt{z-index: 40;}
.ajs-content .list_episode_video, .ajs-content .list_episode_video a, .ajs-content .list_episode a{color: #000!important;}
.ajs-content .list_episode_video .row:nth-child(2n+1), .ajs-content .list_episode ul li:nth-child(2n){background-color: #eee;}
.ajs-content .list_episode_video .row:hover{background-color: #009bc3!important;}

div.ajs-dialog.sticky{min-width: 720px!important; min-height: 405px!important; }



@media only screen and (max-width: 969px) {

}
@media only screen and (max-width: 479px) {
            .details .img{display:none;}
}

            `,
            btnsvr: `<li class="facebook"><i class="fa fa-server"></i><span>Select Servers</span></li>`,
            btnep: `<li class="twitter"><i class="fa fa-file-video-o"></i><span>Select Episode</span></li>`,
            btdl: {},
            player: {
                init: function() {
                    if (dramacool.drama == false) {
                        return dramacool.ui.anime.init();
                    }
                    $('div.watch-drama').attr('id', 'player');
                    location.hash = 'player';
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
                        let list = $('.watch-drama .anime_muti_link').each(function() {
                            this.dataset.visible = true;
                        }).clone();
                        list.removeClass('hidden');
                        var box = alertify.alert('Userscript: Server Selection', list[0]);
                        box.set('closable', true).set('label', 'Close').set('maximizable', true).set('closableByDimmer', false);

                        $(box.elements.dialog).addClass('sticky');

                        $(box.elements.content).find('li:not(.selected)').one('click', function(e) {
                            e.preventDefault();
                            let vidlink = this.dataset.video;
                            $('[data-video]').removeClass('selected');
                            $(`[data-video="${vidlink}"]`).click();
                            delete $('.watch-drama .anime_muti_link')[0].dataset.visible;
                            box.close();
                        });
                        box.set('resizable', true).show();
                    });


                    dramacool.ui.btnep = $(dramacool.ui.btnep);
                    dramacool.ui.btnep.click(function(e) {
                        var list = $('ul.all-episode').clone();

                        var box = alertify.alert('Userscript: Episode Selection', list[0]);

                        box.set('closable', true).set('label', 'Close').set('maximizable', true)
                                .set('closableByDimmer', false).set('resizable', true);

                        $(box.elements.footer).remove();
                        box.resizeTo('75%', '75%');
                    });
                    $('.plugins2 ul').prepend(dramacool.ui.btnep);
                    $('.plugins2 ul').prepend(dramacool.ui.btnsvr);
                    $('.plugins2 ul li.download a').on('click', function(e) {
                        e.preventDefault();
                        $('.watch-iframe iframe').attr('src', $(this).attr('href'));
                    });
                    as.init();
                }
            },
            anime: {
                css: `.popover-favorites, div.content_right{display: none!important;} div.content div.content_left{float: none; width: auto;} .plugins li.facebook span, .plugins li.twitter span{margin-left: 5px;} .content_left .main_body{min-height: 0;}`,
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
                    dramacool.ui.anime.hidebtn('fa-comment');
                    dramacool.ui.anime.hidebtn('fa-exclamation-triangle');
                    dramacool.ui.anime.hidebtn('fa-chrome');
                    //add custom btns
                    dramacool.ui.btnsvr = $(dramacool.ui.btnsvr);
                    dramacool.ui.btnep = $(dramacool.ui.btnep);
                    toolbar.prepend(dramacool.ui.btnep).prepend(dramacool.ui.btnsvr);
                    $('div[class*="list_episode"]').addClass('hidden');

                    dramacool.ui.btnsvr.off('click').on('click', function() {
                        let list = $('div.list_episode_video').each(function() {
                            this.dataset.visible = true;
                            var loop = 0;
                            $(this).find('a').each(function() {
                                loop++;
                                this.dataset.item = loop;
                            });
                        }).clone();
                        var box = alertify.alert('Userscript: Server Selection', list[0]);
                        box.set('closable', true).set('label', 'Close').set('maximizable', true).set('resizable', true).set('closableByDimmer', false);

                        $(box.elements.dialog).addClass('sticky');

                        $(box.elements.content).find('.row').has('a:not(.selected)').one('click', function(e) {
                            e.preventDefault();
                            $(this).find('a.play-video').each(function() {
                                $(`a.play-video[data-item="${this.dataset.item}"]`).click();
                                delete $('.main_body div.list_episode_video')[0].dataset.visible
                            });
                            box.close();
                        });
                        box.show();

                    });


                    dramacool.ui.btnep.click(function(e) {
                        var list = $('div.list_episode').clone().each(function() {
                            this.dataset.visible = true;
                        });

                        var box = alertify.alert('Userscript: Episode Selection', list[0]);

                        box.set('closable', true).set('label', 'Close').set('maximizable', true)
                                .set('closableByDimmer', false).set('resizable', true);

                        $(box.elements.footer).remove();
                        box.resizeTo('75%', '75%');
                    });

                    //dlbtn
                    btndl = $('.fa-download').parent('a');
                    btndl.off('click').on('click', function(e) {
                        e.preventDefault();
                        link = new URL($(this).attr('href'));
                        link.host = 'vidstream.co';
                        $('div.watch-iframe iframe').first().attr('src', link.href);
                    });
                    as.init();
                }
            },
            nav: {
                css: `
                        div.content-left div.block-tab ul.tab li span input{vertical-align: middle; width: 12px; height: 12px;}
                        div.content-left div.block-tab ul.tab li.userplugin{color: rgb(62, 194, 207); background-color: #FFF; margin-left: 5px;}
                        div.content-left div.block-tab ul.tab li.active{color: rgb(253, 184, 19);}

                    `,
                b1toogle: function(e) {
                    if (toolbox.cookies.get('b1') === 'true') {
                        $('#b1').removeClass('active');
                        toolbox.cookies.set('b1', 'false');
                        $('ul[class*="list-episode-item"] li').removeClass('hidden');
                    } else {
                        $('#b1').addClass('active');
                        toolbox.cookies.set('b1', 'true');
                        $('ul[class*="list-episode-item"] li').addClass('hidden');
                        $('ul[class*="list-episode-item"] li[data-subbed]').removeClass('hidden');
                    }
                    //dramacool.ui.nav.update();
                },
                switchview: function() {
                    toolbox.cookies.set('switch', $(this).attr('data-view'));
                },
                init: function() {
                    toolbox.ui.addcss(dramacool.ui.nav.css);
                    /**
                     * Subs only button
                     * dramacool
                     */
                    if ($('ul[class*="list-episode-item"] li span.ep').length > 0) {
                        b1 = $('<li id="b1" class="userplugin"><span><i class="fa fa-file-text-o" aria-hidden="true"></i> Sub only</span></li>');
                        $('div.content-left div.block-tab ul.tab').first().append(b1);
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
                                a.find('h3.title').removeAttr('onclick').off('click');
                                a.attr('data-episode-link', a.attr('href')).find('span.ep').on('click', function(e) {
                                    e.preventDefault();
                                    location.href = $(this).parent().attr('data-episode-link');
                                });
                                href = a.attr('href');
                                href = '/drama-detail' + href.replace(/\-episode\-([0-9]+)\.html$/i, '');
                                a.attr('href', href).off('click').on('click', function(e) {
                                    e.preventDefault();
                                    toolbox.loader.show();
                                    var el = this;
                                    $.get($(this).attr('data-episode-link'), function(data) {
                                        $(data).find('.watch-drama .category a').first().each(function() {
                                            window.location.href = $(this).attr('href');

                                        });
                                    }).fail(function() {
                                        window.location.href = $(el).attr('href');

                                    });
                                });
                            }



                        });
                        if (toolbox.cookies.get('b1') === 'true') {
                            $('ul[class*="list-episode-item"] li').addClass('hidden');
                            $('ul[class*="list-episode-item"] li[data-subbed]').removeClass('hidden');
                            $('#b1').addClass('active');
                        }
                    }

                    /**
                     * animetv
                     */

                    if ($('.content_episode ul.items li .thumb_anime .episode').length > 0) {

                        $('.content_episode ul.items li a').each(function() {
                            $(this).find('div.episode').attr('data-link', $(this).attr('href')).on('click', function(e) {
                                e.preventDefault();
                                location.href = $(this).attr('data-link');
                            });
                            href = document.location.origin + $(this).attr('href');
                            link = new URL(href);
                            link.pathname = link.pathname.replace('/watch/', '/anime/');
                            link.pathname = link.pathname.replace(/\-episode\-([0-9]+)\.html$/i, '.html');
                            $(this).attr('href', link.href);
                        });
                    }

                    if ($('div.nav_tab_global div.datagrild_nav a.active').length > 0) {
                        toolbox.cookies.get('switch', $('div.nav_tab_global div.datagrild_nav a.active').attr('data-tab'));
                        $('div.nav_tab_global div.datagrild_nav a').each(function() {
                            $(this).removeClass('active');
                            $('.content_episode').removeClass($(this).attr('data-tab'));
                            if ($(this).attr('data-tab') === toolbox.cookies.get('switch')) {
                                $(this).addClass('active');
                                $('.content_episode').each(function() {
                                    if ($(this).find('.thumb_anime_hor').length > 0) {
                                        $(this).addClass('datagrild');
                                    }
                                }).addClass($(this).attr('data-tab'));
                            }

                            $('.nav-tabs.intro a').off('click').on('click', function(e) {
                                e.preventDefault();
                                $('.nav-tabs.intro a').removeClass('active');
                                $(this).addClass('active');
                                var str = $(this).attr('data-tab');
                                tab = $('.content_episode.' + str);
                                if (tab.length > 0) {
                                    if (tab.find('.thumb_anime_hor').length > 0) {
                                        $('.datagrild_nav').show();
                                    } else {
                                        $('.datagrild_nav').hide();
                                    }
                                    $('.content_episode').hide();
                                    tab.show();
                                }
                            });
                        }).on('click', function() {
                            toolbox.cookies.set('switch', $(this).attr('data-tab'));
                        });
                    }



                    /**
                     * Auto switch view
                     */
                    if ($('div.block-tab ul.switch-view').length > 0) {
                        $('div.block-tab ul.switch-view li').on('click', dramacool.ui.nav.switchview);
                        $('div.block-tab ul.switch-view li').removeClass('selected');
                        $('div.block-tab ul.switch-view li[data-view="' + toolbox.cookies.get('switch', 'list-episode-item') + '"]').addClass('selected');
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

            if (document.location.href.match(/\-episode\-/))
                dramacool.ui.player.init();
            $('.ads-outsite').remove();
            //$('#disqus_thread').remove();
            $('.block-watch').find('div').first().remove();
            $('.watch-drama > iframe').remove();
            $("ul.tab li:contains('Ads')").removeClass('selected').hide();
            $('.content_right ul.nav-tabs').each(function() {
                hidebtn = $(this).find('a:contains("Ads")');
                if (hidebtn.length > 0) {
                    hidebtn.removeClass('active');
                    hidebtn.parent('li').addClass('hidden');
                    $(this).find('li:not(.hidden) a').first().click();
                }
            });
            $("ul.tab li:contains('Ongoing')").click();
            $('ul.all-episode').html($('ul.all-episode').find('li').css('display', 'inline-block').get().reverse());
            $('.list_episode ul').html($('.list_episode ul').find('li').css('display', 'inline-block').get().reverse());
            $('iframe').parent('div:not(.watch-iframe)').remove();
            $('nav.menu_top ul.navbar li a:contains("Request")').remove();
            //$('nav.menu_top ul.navbar li a:contains("Login")').remove();
            dramacool.ui.nav.init();
            fav.init();
            //toolbox.loader.setevents();
            toolbox.loader.hide();
        }
    };
    var vu = {
        ui: {
            css: `  .hidden, [data-inside-iframe] header, [data-inside-iframe] footer, .watch, .sumer{display: none!important;}
                    [data-inside-iframe] .content_l {width: 100px;}
                    [data-inside-iframe] .content{padding: 0;}
                    .mirror_link{padding-top: 10px; border-top: 1px solid #8d8d8d; margin-top: 10px;}
                    .content_c_bg{min-height: 290px;}
                    [data-inside-iframe] .content_c_bg{margin-top: 90px;}
                    `
        },
        title: function() {
            params = new URLSearchParams(location.search);
            title = params.get('title');
            if (title === null) {
                title = $('.sumer_l li').first().text();
                return title;
            }

            title = title.replace(':', ' ', title);
            title = title.trim();
            title += '.mp4';
            return title;
        },
        links: function() {
            return $('#main .mirror_link div.dowload a');
        },
        init: function() {
            if (window.top != window.self) {
                $('body').attr('data-inside-iframe', true);
            }
            vu.links().each(function() {

                link = $(this).attr('href');
                if (typeof link === 'undefined') {
                    return;
                }
                if (link.match(/^\/\//)) {
                    link = 'https:' + link;
                }

                href = new URL(link);
                if (href.origin.indexOf('openload') !== -1) {
                    href.pathname = href.pathname.replace('/f/', '/embed/');
                }
                href.searchParams.set('title', vu.title());
                $(this).attr('target', '_blank').attr('href', href);
            });
            window.onclick = function() {};
            document.onclick = function() {};
            document.body.onclick = function() {};
            toolbox.loader.hide();
        }
    };
    /**
     * Font Awesome Spinner
     */
    var faspinner = {

        css: `div#spinner{display : block;position : fixed;z-index: 100;background-color: #121212; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;} div#spinner i{font-size: 32px; color: #EFEFEF; left : 50%;top : 50%;position : absolute;z-index : 101;width : 32px;height : 32px;margin-left : -16px;margin-top : -16px;}`,
        loadfont: function() {
            toolbox.ui.loadcss('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
        },
        show: function() {
            if (typeof faspinner.loader === 'undefined') {
                toolbox.ui.addcss(faspinner.css);
                faspinner.loader = document.createElement('div');
                faspinner.loader.setAttribute('id', 'spinner');
                i = document.createElement('i');
                i.setAttribute('class', 'fa fa-spinner fa-pulse fa-3x fa-fw');
                i.setAttribute('aria-hidden', 'true');
                faspinner.loader.appendChild(i);
            }
            document.body.appendChild(faspinner.loader);
        },
        hide: function() {
            if (typeof faspinner.loader !== 'undefined') {
                document.body.removeChild(faspinner.loader);
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
     * Autoserver Plugin
     */
    var as = {
        css: `  .select-wrapper {overflow: hidden;vertical-align: middle;display: inline-block;position: relative;width: 215px;height: 30px;padding: 0 16px 0 0;margin: 0;border: 1px solid #0D5995;overflow: hidden;background: no-repeat right center transparent;}.select-wrapper > select {position: absolute;left: 0;top: 0;opacity : 0;width: 240px;height: 30px;padding: 5px 0;border: none;background: transparent !important;-webkit-appearance: none;}.select-wrapper > span {display: block;width: 210px;height: 30px;line-height: 30px;padding: 0 0 0 5px;}.select-wrapper, .select-wrapper > select, .select-wrapper > span, .select-wrapper > [type="button"]{height: 24px; background-color: #fff; color: #0D5995; line-height: 24px; width:140px;}.select-wrapper > select {padding: 2px 0; width: 165px;}.select-wrapper > span{width: 135px; }.select-wrapper .fa{width: 16px; height: 16px; position: absolute; top: 50%; right: 0; margin-top: -8px;z-index: 50;}

.toggle-checkbox > input[type="checkbox"] {
	height: 0;
	width: 0;
	visibility: hidden;
}

.toggle-checkbox > label {
	cursor: pointer;
	text-indent: -9999px;
	width: 48px;
	height: 24px;
	background: grey;
	display: block;
	border-radius: 100px;
	position: relative;
}

.toggle-checkbox > label:after {
	content: "";
	position: absolute;
	top: 2px;
	left: 2px;
	width: 20px;
	height: 20px;
	background: #fff;
	border-radius: 20px;
	transition: 0.3s;
}

.toggle-checkbox > input:checked + label {
	background: #2196f3;
}

.toggle-checkbox > input:checked + label:after {
	left: calc(100% - 5px);
	transform: translateX(-100%);
}

.toggle-checkbox > label:active:after {
	width: 130px;
}

.toggle-checkbox > span, .toggle-checkbox > label{
	float: left;
	margin-left: 20px;
}
.toggle-checkbox{
        margin-top: 10px;

}
.toggle-checkbox:after{
	clear: both;
	content: '';
}
.ajs-dialog form{
        font-size: 14pt;
        padding-left: 50%;
	margin-left: -100px;
	font-size: 14pt;
	display: block;
}


        `,
        button: `<li class="facebook"><i class="fa fa-cog"></i><span>Auto servers</span></li>`,
        cfgbox: `<li class="facebook"><i class="fa fa-cog"></i><span class="select-wrapper"></span></li>`,
        getSelection: function() {
            select = document.createElement('select');
            option = document.createElement('option');
            option.setAttribute('selected', 'selected');
            option.value = "";
            option.textContent = "none (disabled)";
            select.appendChild(option);
            $('div.main_body > div.list_episode_video > div.bottom > div.row').each(function() {
                name = $(this).find('label').text().trim();
                if (name.length > 0) {
                    option = document.createElement('option');
                    option.value = name;
                    option.textContent = option.value;
                    select.appendChild(option);
                }
            });
            $('div.watch-drama > div.anime_muti_link > ul > li').each(function() {
                name = this.firstChild.data;
                name = name.trim();
                if (name.length > 0) {
                    option = document.createElement('option');
                    option.value = name;
                    option.textContent = option.value;
                    select.appendChild(option);
                }
            });
            return select;
        },
        loadserver: function(server) {
            alertify.message('Autoloading server : ' + server);
            $('div.main_body > div.list_episode_video > div.bottom > div.row:contains(' + server + ') a.play-video:first').click();
            $('div.watch-drama > div.anime_muti_link > ul > li:contains(' + server + '):first').click();
        },
        selectServer: function(server) {
            dialog = toolbox.cookies.get('autoload', 'setup');
            if (dialog === 'setup') {
                alertify.confirm('User Script : Autoserver', 'Do you wish to autoload server if available?', function() {
                    toolbox.cookies.set('autoload', 'true');
                    as.selectServer(server);
                }, function() {
                    setTimeout(function() {
                        toolbox.cookies.set('autoload', 'false');
                        as.selectServer(server);
                    }, 1000);
                });
                return;
            }
            if (dialog === 'true') {
                as.loadserver(server);
                return;
            }
            alertify.confirm('User Script : Autoserver', "Configured server " + server + " is available, do you wish to use it?", function() {
                as.loadserver(server);
            }, function() {

            });
        },
        prompt: function() {

            /**
             * @param {String} HTML representing a single element
             * @return {Element}
             */
            htmlToElement = function(html) {
                var template = document.createElement('template');
                html = html.trim(); // Never return a text node of whitespace as the result
                template.innerHTML = html;
                return template.content.firstChild;
            };

            $('div.alertify').remove();
            form = document.createElement('form');
            form.setAttribute('class', 'form-server-selection');
            label = document.createElement('label');
            label.textContent = 'Server : ';
            form.appendChild(label);
            select = as.getSelection();
            select.setAttribute('class', 'server-selection');
            div = document.createElement('div');
            div.setAttribute('class', 'select-wrapper');
            i = document.createElement('i');
            i.setAttribute('class', "fa fa-caret-down");
            i.setAttribute("aria-hidden", "true");
            div.appendChild(select);
            div.appendChild(i);
            form.appendChild(div);

            checkbox = htmlToElement(`
        <div class="toggle-checkbox">
            <input type="checkbox" class="toggle-check-input" name="autoselect" id="autoselect"/>
            <label for="autoselect">Auto select server</label>
        </div>`);
            form.appendChild(checkbox);


            alertify.prompt(form, '');

            //override alertify events
            current = toolbox.cookies.get('autoserver');

            $('.form-server-selection').parents('div.ajs-dialog:first').each(function() {
                $(this).find('.ajs-input').addClass('hidden');
                $(this).find('div.ajs-header').html('Userscript : Server Selection');

                $(this).find('button.ajs-ok').html('Save Changes').addClass('hidden').on('click', function() {
                    selected = $(this).parents('div.ajs-dialog:first').find('select.server-selection').val();
                    toolbox.cookies.set('autoload', 'setup');
                    if (selected.length > 0) {
                        if ($("#autoselect[checked]").length > 0) {
                            toolbox.cookies.set('autoload', 'true');
                        }
                        toolbox.cookies.set('autoserver', selected);
                        as.selectServer(selected);
                    } else {
                        toolbox.cookies.remove('autoserver');
                        alertify.message('Autoserver plugin disabled.');
                    }
                });
                $(this).find('button.ajs-cancel').html('Cancel');
                $(this).find('select.server-selection').each(function() {
                    if (current !== null && current.length > 0) {
                        $(this).attr('data-current', current);
                        $(this).find('option').removeAttr('selected');
                        $(this).find('option[value="' + current + '"]:first').attr('selected', 'selected');
                    }
                    if ($(this).find('option[selected]').length < 1) {
                        $(this).find('option').first().attr('selected', 'selected');
                        $(this).parents('div.ajs-dialog:first').find('button.ajs-ok').removeClass('hidden');
                    }

                }).on('change', function() {
                    $(this).parents('div.ajs-dialog:first').find('button.ajs-ok').addClass('hidden');
                    if (this.value !== $(this).attr('data-current')) {
                        $(this).parents('div.ajs-dialog:first').find('button.ajs-ok').removeClass('hidden');
                    }
                    if ($(this).val() === "") {
                        $("#autoselect").attr("disabled", "disabled").removeAttr("checked");
                    } else {
                        $("#autoselect").removeAttr("disabled");
                    }
                });
                $(this).find('.toggle-checkbox label').each(function() {
                    span = $('<span/>').attr('aria-hidden', "true").html($(this).text());
                    $(this).after(span);
                });
                $(this).find('#autoselect').each(function() {
                    if ($('select.server-selection').val() == "") {
                        $(this).attr("disabled", "disabled");
                        return;
                    }
                    if (toolbox.cookies.get('autoload') === 'true') {
                        $(this).attr("checked", "checked");
                    }
                }).on('change', function() {
                    console.debug(this);
                    if (this.checked) {
                        this.setAttribute('checked', 'checked');
                    } else {
                        this.removeAttribute('checked');
                    }
                    $(this).parents('div.ajs-dialog:first').find('button.ajs-ok').removeClass('hidden');
                });
            });



            $('.select-wrapper select').each(function() {
                txt = $(this).find('option[selected]').text();
                span = document.createElement('span');
                span.textContent = txt;
                $(this).after(span);
            });
            $('.select-wrapper select').off('click').click(function(event) {
                $(this).siblings('span').remove();
                $(this).after('<span>' + $('option:selected', this).text() + '</span>');
            });



        },
        init: function() {
            if ($('div.watch_player > div.plugins').length < 1 && $('div.watch-drama > div.plugins2').length < 1) {
                return;
            }
            toolbox.ui.addcss(as.css);
            as.button = $(as.button);
            $('div.watch_player > div.plugins > ul').last().append(as.button);
            $('div.watch-drama > div.plugins2 > ul').append(as.button);
            as.button.on('click', as.prompt);

            //server detection
            current = toolbox.cookies.get('autoserver');
            if (current !== null && current.length > 0) {
                if ($('div.main_body > div.list_episode_video > div.bottom > div.row:contains(' + current + ')').length > 0 || $('div.watch-drama > div.anime_muti_link > ul > li:contains(' + current + ')').length > 0) {
                    as.selectServer(current);

                }
            }



        }
    };

    /**
     * Favorites Plugin
     */
    var favid = null;
    var fav = {
        css: `
                .content_episode.hor > ul.items > li.fav, ul[class*="list-episode-item-2"] > li.fav{border: 1px solid rgb(253, 184, 19);}
                a.fav{color: rgb(253, 184, 19);}

                li.fav .fa-bookmark{display: none;}
                ul.list-episode-item > li.fav .fa-bookmark, .datagrild > ul.items > li.fav .fa-bookmark, div.details > div.img .fa-bookmark{width: 24px; height: 24px; position: absolute; top: -10px; right: -12px; z-index: 50; font-size: 24px; display: block;transform: scale(1, -1);}
                li.fav {position: relative;}
                .datagrild.hor .fa-bookmark{display: none!important;}
                div.details > div.img .fa-bookmark{top: auto; right:0; bottom:0;}
                .fa-bookmark{color: rgb(253, 184, 19);}
                .fa-bookmark.unset{color: gray!important;}
                a.user-bookmark{display:block;}

                div.info a.user-bookmark .fa-bookmark + span:before{content: "Remove Bookmark";display: inline-block;margin: 0 5px;}
                div.info a.user-bookmark .fa-bookmark.unset + span:before{content: "Set Bookmark";}
                div.info a.user-bookmark .fa-bookmark.unset.loading + span:before{content: "please wait ...";}
                ul[data-favonly] > li:not(.fav){display:none!important;}
                ul[data-favonly] .fa-bookmark{color: #3ec2cf;}

            `,
        widget: {
            element: `<li><a href="javascript:void(0);">Synch Fav</a></li>`,
            init: function() {
                fav.widget.element = $(fav.widget.element);
                //drama
                $('ul.navbar > li.user > ul.sub-nav > li:first').after(fav.widget.element);
                //anime
                $('div.header > ul.auth > li.user > div.nav_down_up > ul > li:first').after(fav.widget.element);
                fav.widget.element.find('a').off('click').on('click', fav.sync);
                $('div[class*="plugins"] li.favorites').on('click', function() {
                    setTimeout(fav.sync, 2000);
                });
            }
        },
        list: {

        },
        sync: function() {
            $.ajax({url: document.location.origin + '/user/bookmark', cache: false}).done(function(data) {
                fav.list = {};
                $(data).find('div.bookmark table tr').each(function() {
                    a = $(this).find('td:first a');
                    if (a.length > 0) {
                        fav.list[a.text().trim()] = a.attr('href');
                    }
                });
                alertify.message(`Favorites sync complete <br /> (${Object.keys(fav.list).length} Favorites)`);
                toolbox.cookies.set('favlist', fav.list);
                fav.findtargets();
            });
            $(this).parents('.nav_down_up').toggle();
        },
        findtargets: function() {
            $('.fav').removeClass('fav');
            Object.keys(fav.list).map(function(key) {
                var val = fav.list[key];
                //anime
                $('.content_episode > ul.items > li a[href*="' + val + '"]').each(function() {
                    $(this).parents('li:first').addClass('fav');
                });
                $('.main_body ul.list a[href*="/anime/"][href*="' + val + '"]').addClass('fav');
                //drama
                $('ul[class*="list-episode-item"] > li > a[href*="' + val + '"]').each(function() {
                    $(this).parent().addClass('fav');
                });
                //drama-list
                $(`.filter-item a[href="${val}"]`).addClass("fav");
                //drama-detail
                if (location.pathname === val) {
                    $('.fa-bookmark').removeClass('unset');
                }

            });
            //<i class="fa fa-bookmark" aria-hidden="true"></i>
            $('li .fa-bookmark').remove();
            $('li.fav').each(function() {
                $(this).append('<i class="fa fa-bookmark" aria-hidden="true"></i>');
            });
            $('.fa-bookmark').removeClass("loading");
            $('li.fav .fa-bookmark').off('click').on('click', function(e) {
                e.preventDefault();
                let ul = $(this).parents('ul:first')[0];
                if (ul.dataset.favonly) {
                    delete ul.dataset.favonly;
                    return;
                }
                ul.dataset.favonly = true;
            });

        },
        event: function() {
            favlist = {};
            $('div.bookmark table tr').each(function() {
                a = $(this).find('td:first a');
                if (a.length > 0) {
                    favlist[a.text().trim()] = a.attr('href');
                }
            });
            if (JSON.stringify(favlist) !== JSON.stringify(fav.list)) {
                fav.list = favlist;
                toolbox.cookies.set('favlist', fav.list);
                alertify.message('Favorites sync complete.');
            }
        },
        init: function() {
            if (typeof Cookies.get('auth') === 'undefined') {
                return;
            }
            toolbox.ui.addcss(fav.css);
            fav.widget.init();
            fav.list = toolbox.cookies.getobj('favlist');
            if (document.location.pathname === '/user/bookmark') {
                $('div.bookmark table').on('click', function() {
                    setTimeout(fav.event, 2000);
                });
                return;
            }
            $('div.info a.bookmark').one('click', function() {
                $(this).on('click', function() {
                    setTimeout(fav.sync, 2500);
                });
            });
            if (document.location.pathname.indexOf('/drama-detail/') !== -1) {
                /**
                 * @param {String} HTML representing a single element
                 * @return {Element}
                 */
                htmlToElement = function(html) {
                    var template = document.createElement('template');
                    html = html.trim(); // Never return a text node of whitespace as the result
                    template.innerHTML = html;
                    return template.content.firstChild;
                };

                var el = htmlToElement(`<p><a class="user-bookmark" href="javascript:void(0)"><i class="fa fa-bookmark unset loading" aria-hidden="true"></i><span></span></a><p>`);

                $('div.info:first > h1:first').after(el);

                if (typeof ajaxBookmark === 'undefined') {
                    function ajaxBookmark(id, url, callback) {
                        $.ajax({
                            dataType: 'json',
                            type: 'post',
                            //async: false,
                            data: {
                                id: id,
                                _csrf: $("meta[name=csrf-token]").attr('content')
                            },
                            url: url,
                            success: function(response) {
                                callback(response);
                            }
                        });
                    }
                }


                var evt = function() {
                    $(this).find('.fa-bookmark').addClass("unset loading");
                    var a = this;


                    //get first video for bookmark id
                    if (typeof favid !== 'number') {
                        var vidurl = $('ul[class*="list-episode-item"] > li:first a').first().attr('href');
                        if (vidurl.length > 0) {
                            $.ajax({
                                type: "GET",
                                cache: false,
                                url: vidurl,
                                //async: false,
                                success: function(data) {
                                    console.debug('success');
                                    $(data).filter('script:contains("ajaxBookmark")').each(function() {
                                        regex = new RegExp(/ajaxBookmark\(([0-9]+)/);
                                        results = regex.exec(this.text);
                                        if (results !== null) {
                                            favid = parseInt(results[1]);
                                            toggle(favid);
                                        }
                                    });
                                }
                            });

                        }
                        return;
                    }
                    toggle(favid);
                };

                var toggle = function(id) {
                    if (typeof id === 'number') {
                        $('.fa-bookmark').addClass('unset');
                        ajaxBookmark(id, '/user/switchBookmark', function() {
                            setTimeout(function() {
                                fav.sync();
                                $(el).find('a').one('click', evt);
                            }, 2500);
                        });
                    }

                };

                $(el).find('a').one('click', evt);
            }

            if (Object.keys(fav.list).length < 1) {
                fav.sync();
            }
            if (Object.keys(fav.list).length > 0) {
                fav.findtargets();
            }

        }
    };
    /**
     * @link http://alertifyjs.com
     */
    notify = {
        settings: {
            // dialogs defaults
            autoReset: true,
            basic: false,
            closable: false,
            closableByDimmer: true,
            frameless: false,
            maintainFocus: true, // <== global default not per instance, applies to all dialogs
            maximizable: true,
            modal: true,
            movable: true,
            moveBounded: false,
            overflow: true,
            padding: true,
            pinnable: true,
            pinned: true,
            preventBodyShift: false, // <== global default not per instance, applies to all dialogs
            resizable: true,
            startMaximized: false,
            transition: 'pulse',

            // notifier defaults
            notifier: {
                // auto-dismiss wait time (in seconds)
                delay: 5,
                // default position
                position: 'top-right',
                // adds a close button to notifier messages
                closeButton: false
            },

            // language resources
            glossary: {
                // dialogs default title
                title: 'Userscript',
                // ok button text
                ok: 'Yes',
                // cancel button text
                cancel: 'No'
            },
            // theme settings
            theme: {
                // class name attached to prompt dialog input textbox.
                input: 'ajs-input',
                // class name attached to ok button
                ok: 'ajs-ok',
                // class name attached to cancel button
                cancel: 'ajs-cancel'
            }

        },
        ready: false,
        onready: function() {},
        loadsettings: function() {
            alertify.defaults = notify.settings;

        },
        init: function(fn = null) {
            if (notify.ready !== false) {
                return;
            }
            toolbox.ui.loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/alertify.min.css');
            toolbox.ui.loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/themes/default.min.css');
            toolbox.ui.addscript('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/alertify.min.js');
            if (typeof (fn) === 'function') {
                notify.onready = fn;
            }

            ninterval = setInterval(function() {
                if (typeof alertify !== 'undefined') {
                    clearInterval(ninterval);
                    notify.ready = true;
                    notify.loadsettings();
                    notify.onready();
                }
            }, toolbox.interval);
        }
    };
    //kvid
    if (document.location.host.indexOf('k-vid') !== -1) {
        toolbox.onload = function() {
            toolbox.ui.addcss(`
                .hidden, .ads{display: none;}
            `);
        };

        toolbox.init(function() {});
        return;
    }

    //videouploader
    if (document.location.host.indexOf('vid') !== -1) {

        toolbox.onload = function() {
            toolbox.ui.addscript('https://code.jquery.com/jquery-3.2.1.min.js');
            toolbox.loader.onshow = cssloader.show;
            toolbox.loader.onhide = cssloader.hide;
            toolbox.loader.show();
            toolbox.ui.addcss(vu.ui.css);
        };
        toolbox.init(vu.init);
        return;
    }

    if (window.top != window.self) {
        return;
    }

    toolbox.onload = function() {

        if (document.querySelector('footer') === null) {
            console.debug('No Container root, stopping script execution');
            toolbox.load = function() {};
            toolbox.exec = true;
            return;
        }

        toolbox.loader.onshow = cssloader.show;
        toolbox.loader.onhide = cssloader.hide;
        toolbox.loader.show();
        toolbox.loader.timeout = 700;
        toolbox.ui.addcss(dramacool.ui.css);
        el = document.getElementById('disqus_thread');
        if (el !== null) {
            el.remove();
        }

        //toolbox.cookies.onready = dramacool.init;
        toolbox.cookies.onready = notify.init;
        notify.onready = function() {
            window.alert = alertify.alert;
            window.confirm = alertify.confirm;
            window.prompt = alertify.prompt;
            dramacool.init();
        };
    };
    toolbox.init(toolbox.cookies.init);
})();