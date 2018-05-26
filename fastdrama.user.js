// ==UserScript==
// @name         fastdrama.co
// @namespace    https://github.com/ngsoft
// @version      2.1
// @description  simplify UI
// @author       daedelus
// @include     *://fastdrama.*/*
// @noframes
// @run-at      document-start
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/fastdrama.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/fastdrama.user.js
// ==/UserScript==

/**
 * Works best with following line in hosts file
 * 0.0.0.0 c.adsco.re js.genieessp.com www.yoxlrphhmphq.com yoxlrphhmphq.com www.bxwbflhpk.com bxwbflhpk.com
 */

(function() {

    let w = {
        a: setInterval(function() {
            if ('_pop' in window) {
                window._pop = null;
                clearInterval(w.a);
            }
        }, 1),
        b: setInterval(function() {
            if ('DISQUS' in window) {
                window.DISQUS = null;
                clearInterval(w.b);
            }
        }, 1)
    };

    var ondomready = this.ondomready = function(callback) {
        let retval = false;
        for (let f of arguments) {
            if (typeof f === "function") {
                retval = true;
                (document.readyState !== 'loading' ? f() : document.addEventListener('DOMContentLoaded', f));
            }
        }
        return retval;
    };
    var addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        }();
    };

    var ondocumentready = this.ondocumentready = function(callback) {

        let callbacks = [];
        for (let c of arguments) {
            if (typeof c === 'function')
                callbacks.push(c);
        }
        if (!callbacks.length)
            return false;

        let i = setInterval(function() {
            if (document.body === null)
                return;
            clearInterval(i);
            for (let c of callbacks)
                c();
        }, 20);
        return true;
    };


    ondocumentready(function() {

        addstyle(`
                .hidden{display: none!important;}
                iframe:not(#videoembed), div[class*="ad"]{display: none!important;}
                div.image span.status{cursor: pointer;}
        `);

        window.open = (function() {
            let open = window.open;
            return function() {
                let args = [];
                if (arguments.length > 0)
                    args = [arguments[0], "_blank"];
                console.log('window.open', arguments);
                return open(...args);
            };
        });



        ondomready(function() {

            let el;
            (el = document.getElementById('disqus_thread')) ? el.remove() : null;
            document.querySelectorAll('div.tabcontent a[href*="/watch-online/"]').forEach(function(a) {
                let spanstatus;
                a.addEventListener('click', function(e) {
                    e.preventDefault();
                    location.href = a.href.replace(/(watch-online\/|\/episode-[0-9]+)/gi, '');
                });

                if (!a.parentNode.classList.contains('image'))
                    return;

                if (spanstatus = a.parentNode.querySelector('span.status')) {
                    spanstatus.dataset.link = a.href;
                    spanstatus.addEventListener('click', function(e) {
                        e.preventDefault();
                        location.href = this.dataset.link;
                    });
                }
            });
            w.z = setInterval(function() {
                if (document.querySelectorAll('div[id*="_Geniee"]').length > 0) {
                    clearInterval(w.z);
                    document.querySelectorAll('iframe:not(#videoembed)').forEach(function(e) {
                        e.onload = e.onerror = e.onreadystatechange = "";
                        e.src = "about:blank";
                        e.remove();
                    });
                    document.querySelectorAll('.vCOXETuaOverlay').forEach(function(e) {
                        e.remove();
                    });
                    document.querySelectorAll('div[id*="_Geniee"], div[id*="_2MDN"]').forEach(function(e) {
                        e.remove();
                    });

                }
            }, 200);


        });
    });
}());