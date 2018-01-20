// ==UserScript==
// @name         Dramacool Lite Player UI
// @namespace    https://github.com/ngsoft
// @version      1.0.1
// @description  Lite UI
// @author       daedelus
// @include     *://dramacool*.*/*episode*
// @include     *://watchasia*.*/*episode*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacoollite.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacoollite.user.js
// ==/UserScript==

(function() {

    var dramacoollite = {
        body: function() {
            return $('body');
        },
        css: `<style type="text/css">
            <!--
                    header, .content-right{
                            display: none !important;
                    }
                    .content-left{
                        width:100%;
                    }
            -->
        </style>`,

        run: function() {
            dramacoollite.body().append(dramacoollite.css);
        },
        main: function() {
            interval = setInterval(function() {
                if (typeof $ !== 'undefined') {
                    dramacoollite.run();
                    clearInterval(interval);
                }
            }, 200);
        }
    };

    window.addEventListener("load", dramacoollite.main, false);
}());