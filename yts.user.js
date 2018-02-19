// ==UserScript==
// @name         YTS
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  Anti ads
// @author       daedelus
// @include     *://yts.*/*
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @grant none
// ==/UserScript==

//adios popups
window.open = function() {};


(function() {
    function onready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn.wait);
        }
    }

    onready(function() {
        vpnwarning = document.body.getElementsByClassName('ibox-bordered');
        if (vpnwarning.length > 0) {
            vpnwarning[0].remove();
        }
    });

})();
