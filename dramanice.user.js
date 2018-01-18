// ==UserScript==
// @name         Dramanice UI Remaster
// @namespace    https://github.com/ngsoft
// @version      1.0.1
// @description  UI Remaster
// @author       daedelus
// @include     *://*dramanic*.*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramanice.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramanice.user.js
// ==/UserScript==

//adios popups
window.open = function() {};

(function() {
    //prevent iframes (old style)
    if (window.top != window.self) {
        return;
    }

    var dramanice = {
        body: function() {
            return $('body');
        },
        css: `
				<style type="text/css">
				<!--
					div[id*="rcjsload"],.ads-outsite, .PubAdAI, #disqus_thread, .ads{
						display: none !important;
					}
				-->
				</style>`,
        removeui: function() {



        },

        hideui: function() {


        },
        activateui: function() {

        },
        run: function() {
            dramanice.body().append(dramanice.css);
            dramanice.removeui();
            dramanice.hideui();
            dramanice.activateui();



        },
        main: function() {
            var interval = setInterval(function() {
                if (typeof $ !== 'undefined' && $.fn.jquery == '3.2.1') {
                    dramanice.run();
                    clearInterval(interval);
                }
            }, 200);
        }
    };
    window.addEventListener("load", dramanice.main, false);
}());