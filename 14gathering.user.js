// ==UserScript==
// @name         FF14 Gathering Auto Sort
// @namespace    https://github.com/ngsoft
// @version      1.0.0
// @description  Adds auto sorting on nodes
// @author       daedelus
// @include     *://http://www.ffxiv-gathering.com/*0.php
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/14gathering.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/14gathering.user.js
// ==/UserScript==

(function() {

    var gathering = {

        sort: function() {
            var table = $('div.tab-pane.active table.table');




        }













    };












    var main = {
        init: function() {
            var interval = setInterval(function() {
                if (typeof $ !== 'undefined' && $.fn.jquery == '3.2.1') {
                    main.run();
                    clearInterval(interval);
                }
            }, 200);
        },
        run: function() {
            $('body > div.col-md-12').remove();
            setInterval(gathering.sort, 2000);
        }
    };
    window.addEventListener("load", main.init, false);

}());