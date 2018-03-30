// ==UserScript==
// @name         YTS
// @namespace    https://github.com/ngsoft
// @version      1.4
// @description  Anti ads
// @author       daedelus
// @include     *://yts.*/*
// @noframes
// @run-at      document-start
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @grant none
// ==/UserScript==

//adios popups
window.open = function() {};


(function() {
    function onready(fn, domloaded = false, binding) {

        function w() {
            if (document.body !== null) {
                !w.i || clearInterval(w.i);
                if (domloaded && document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', fn.bind(binding));
                    return;
                }
                fn.apply(binding);
                return true;
            }
            return false;
        }
        w() || (w.i = setInterval(w, 20));
        return binding;
    }

    onready(function() {
        document.querySelectorAll('.ibox-bordered').forEach(x => x.style.display = "none");
    });

})();
