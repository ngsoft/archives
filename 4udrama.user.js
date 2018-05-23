// ==UserScript==
// @name         4udrama
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  UI Remaster
// @author       daedelus
// @include     *://4udrama.*/*
// @include     *://*.4udrama.*/*
// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/4udrama.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/4udrama.user.js
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
                .hidden, #disqus_thread, div[id*="ScriptRoot"], .hn-comment, body > div:first-child {display: none !important;}
            `);
            ondomready(function() {
                document.querySelectorAll("#disqus_thread").forEach(x => x.remove());
                window.localStorage.setItem('dsqremoveroverride', 'true');
                document.querySelectorAll('.row.detail-film2 .col-sm-5').forEach(function(x) {
                    x.classList.remove('col-sm-5');
                    x.classList.add('col-sm-12');
                });


            });
        }
    }, 20);


})();