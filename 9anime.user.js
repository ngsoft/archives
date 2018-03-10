// ==UserScript==
// @name         9anime
// @namespace    https://github.com/ngsoft
// @version      1.5.2
// @description  UI Remaster
// @author       daedelus
// @include     *://9anime.*/*
// @include     *://*.9anime.*/*
// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// ==/UserScript==

(function() {

    let z = setInterval(function() {
        if ('l5m3X' in window) {
            window['l5m3X'] = null;
            clearInterval(z);
        }
    }, 1);



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

    let w = setInterval(function() {

        if (document.body !== null) {
            window.open = function() {};
            clearInterval(w);
            addstyle(`  div[id*="BB_SK"],div[id*="bb_sa"], div[class*="ads_"],div[id*="rcjsload"],
                        .ads-outsite, #disqus_thread, .hidden, .this-message-does-not-harm-to-you-dont-remove-it,
                        .widget.crop, .widget.comment, :not(#player) > iframe, body.watch #sidebar,
                        #main > .content > .widget.slider + div, .adsbox {display: none !important;}
                        /*#player > iframe{display: block!important;}*/
                        body.watch #main{margin:0!important; padding:0!important;}`);
            ondomready(function() {
                let el, nextloop = false;
                (el = document.getElementById('disqus_thread')) ? el.remove() : null;

                //jQuery is too slow...
                if ((el = document.querySelectorAll('div.widget.hotnew span.tab[data-name]')) && el.length) {
                    let t = el[0].parentNode.dataset.target;
                    for (let e of el) {
                        e.classList.remove('active');
                        if (e.dataset.name === "sub") {
                            e.classList.add('active');
                        }
                    }
                    for (let e of document.querySelectorAll(t)) {
                        e.classList.add('hidden');
                        if (e.dataset.name === "sub")
                            e.classList.remove("hidden");
                    }
                }

                let i = setInterval(function() {
                    if (document.querySelectorAll('#rufous-sandbox').length > 0) {
                        clearInterval(i);
                        let el;
                        if ((el = document.querySelectorAll(':not(#player) > iframe')) && el.length) {
                            for (let e of el) {
                                e.onload = e.onerror = e.onreadystatechange = "";
                                e.src = "about:blank";
                                e.remove();
                            }
                        }
                    }
                }, 200);
                /*let j = setInterval(function() {
                    if ('jQuery' in window && jQuery.isReady === true) {
                        if (!nextloop) return nextloop = true;
                        clearInterval(j);
                        (function($) {
                            $('span.tab[data-name="sub"]').click();
                        }(window.jQuery));
                    }

                }, 200);*/
            });
        }
    }, 20);

})();



