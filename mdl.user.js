// ==UserScript==
// @name         MyDramaList
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  UI Remaster
// @author       daedelus
// @include     *://mydramalist.*/*
// @include     *://*.mydramalist.*/*
// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/mdl.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/mdl.user.js
// ==/UserScript==



(function() {
    /* jshint expr: true */
    /* jshint -W018 */
    const ondomready = this.ondomready = function(callback) {
        let retval = false;
        for (let f of arguments) {
            if (typeof f === "function") {
                retval = true;
                (document.readyState !== 'loading' ? f() : document.addEventListener('DOMContentLoaded', f));
            }
        }
        return retval;
    };
    const addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            let s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        }();
    };

    const html2element = function(html) {
        if (typeof html === "string") {
            let template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
        return null;
    };

    const onjQuery = function(fn, binding) {
        if (!typeof fn === "function")
            return;
        binding = binding || window;

        function w() {
            if (typeof jQuery !== void 0 && jQuery.isReady === true) {
                !w.i || clearInterval(w.i);
                fn.apply(binding, [jQuery]);
                return true;
            }
            return false;
        }
        !w() || (w.i = setInterval(w, 200));
    };

    let w = setInterval(function() {

        if (document.body !== null) {
            window.open = function() {};
            clearInterval(w);
            addstyle(`
                .hidden, [class*="spnsr"], .nav-link[href*="/vip"], .nav-link[href*="store."], .mdl-support-goal{display: none !important;}
                body{margin-top: 2rem;}.box{border-width:0;}
            `);

        }
    }, 20);


})();