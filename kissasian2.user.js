// ==UserScript==
// @name         Kissasian Site Integration v2
// @namespace    https://github.com/ngsoft
// @version      2.0.0
// @description  removes adds + simplify UI
// @author       daedelus
// @include     *://kissasian.*/*
// @include     *://kissanime.*/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @noframes
// @grant none
// @run-at       document-start
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kissasian2.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kissasian2.user.js
// ==/UserScript==

//
// @run-at document-start
//
window.adblock = false;
window.adblock2 = false;
window.turnoff = true;
window.open = function() {};
//
// @run-at document-end
//
function onready(fn) {
    if (document.readyState != 'loading')
        fn();
    else
        document.addEventListener('DOMContentLoaded', fn);
}

(function() {
    kissasian = {
        ui: {},
        css: ``,
        addcss: function() {
            css = `<style type="text/css"><!-- ` + kissasian.css + `--></style>`;
            $('body').append(css);
        }
    };





    onready(function() {

    });


})();