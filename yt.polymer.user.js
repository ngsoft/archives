// ==UserScript==
// @name         YouTube Polymer Disabler
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Disables Youtube Polymer design
// @author       daedelus
// @include     *://www.youtube.com/*
// @exclude     *disable_polymer=true*
// @exclude     */embed/*
// @run-at      document-start
// @grant none
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/yt.polymer.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/yt.polymer.user.js
// ==/UserScript==

(function(win, undef) {
    if(typeof win.Polymer !== typeof undef){
        let loc = new URL(win.location.href);
        loc.searchParams.set('disable_polymer', 'true');
        win.location.replace(loc.href);
    }
})(window);