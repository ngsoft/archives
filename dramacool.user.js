// ==UserScript==
// @name         Dramacool UI Remaster
// @namespace    https://github.com/ngsoft
// @version      1.0.5
// @description  UI Remaster
// @author       daedelus
// @include     *://dramacool*.*/*
// @include     *://watchasia*.*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool.user.js
// ==/UserScript==

//adios popups
window.open = function() {};

(function() {
    //prevent iframes (old style)
    if (window.top != window.self) {
        return;
    }

    var dramacool = {
        body: function() {
            return $('body');
        },
        css: `
				<style type="text/css">
				<!--
					div[class*="ads"],div[id*="rcjsload"],.report2,.ads-outsite, #disqus_thread, .slide_mobilde, .content-right .fanpage, .tab-container .right-tab-1, .show-all{
						display: none !important;
					}
				-->
				</style>`,
        removeui: function() {
            $('.ads-outsite').remove();
            $('#disqus_thread').remove();
            $('.block-watch').find('div').first().remove();
            $('.watch-drama > iframe').remove();


        },

        hideui: function() {
            //$('.slide_mobilde').hide();
            //$('.content-right .fanpage').hide();
            //$('.tab-container .right-tab-1').hide();
            $("ul.tab li:contains('Ads')").removeClass('selected').hide();

            $("ul.tab li:contains('Ongoing')").click();

            //$('.show-all').hide();

        },
        activateui: function() {
            $('ul.all-episode').html($('ul.all-episode').find('li').css('display', 'inline-block').get().reverse());
        },
        run: function() {
            dramacool.body().append(dramacool.css);
            dramacool.removeui();
            dramacool.hideui();
            dramacool.activateui();



        },
        main: function() {
            var interval = setInterval(function() {
                if (typeof $ !== 'undefined' && $.fn.jquery == '3.2.1') {
                    dramacool.run();
                    clearInterval(interval);
                }
            }, 200);
        }
    };
    window.addEventListener("load", dramacool.main, false);
}());