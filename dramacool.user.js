// ==UserScript==
// @name         Dramacool UI Remaster
// @namespace    https://github.com/ngsoft
// @version      2.1.2
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramacool*/*
// @include     *://*watchasia*/*
// @include     *://*animetv*/*
// @noframes
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
    if (window.top != window.self) {
        return;
    }


    var toolbox = {

        loader: {
            timeout: 1500,
            show: function() {
                //document.body.style.opacity = '0';
            },
            hide: function() {
                setTimeout(function() {
                    //document.body.style.opacity = '1';
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

        ui: {
            css: `
                    div[id*="BB_SK"], .mediaplayer .content-right, div[class*="ads_"],div[id*="rcjsload"],.report2,.ads-outsite, #disqus_thread, .slide_mobilde, .content-right .fanpage, .tab-container .right-tab-1, .show-all, .mediaplayer header, .hidden{
                            display: none !important;
                    }
                    .mediaplayer .content-left{width:100%!important;}
                    iframe, .watch-drama .note{display:none;}
                    .watch-iframe iframe{display: block;}
                    .watch-drama .plugins2 .facebook{
                        margin-right: 2px!important;
                    }
            `,

            btnsvr: `<li class="facebook"><span>Select Servers</span></li>`,
            btnep: `<li class="twitter"><span>Select Episode</span></li>`,

            player: {
                init: function() {
                    $('.container').addClass('mediaplayer');
                    $('.watch-drama .anime_muti_link').addClass('hidden');
                    $('.watch-drama div:contains("Please scroll down to choose")').addClass('hidden');
                    $('ul.all-episode').parents('div.block-tab').addClass('hidden');
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

                }
            }
        },

        init: function() {
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
            $('iframe').parent('div:not(.watch-iframe)').remove();
            toolbox.loader.hide();
        }
    };


    toolbox.onload = function() {
        toolbox.loader.show();
    };

    toolbox.init(dramacool.init);

})();

