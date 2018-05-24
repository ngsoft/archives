// ==UserScript==
// @name         Openload Embed
// @author       daedelus
// @namespace    https://github.com/ngsoft
// @version      1.7
// @description  Openload
// @include      http://openload.co
// @include      /^(https?:)?\/\/openload\.co\/embed/*
// @grant        none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// ==/UserScript==


(function() {
    /* jshint expr: true */
    /* jshint -W018 */

    window.adblock = false;
    window.adblock2 = false;
    window.sadbl = false;
    window.turnoff = true;
    window.open = function() {};


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

    const onDocStart = function(fn, binding) {
        let w = function() {
            if (document.body !== null) {
                !w.i || clearInterval(w.i);
                fn();
                return true;
            }
            return false;
        };
        w() || (w.i = setInterval(w, 20));
    };

    const onDocEnd = function(fn, binding) {
        if (binding)
            fn.bind(binding);
        onDocStart(function() {
            if (document.readyState !== 'loading') {
                return fn();
            }
            document.addEventListener('DOMContentLoaded', fn);
        });
    };


    onDocStart(function() {
        document.onbeforescriptexecute = function(e) {
            if (e.target.src.search('script.packed') != -1)
                e.preventDefault();
        };
        addstyle(`
            div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: .5em 0;}
            div.dlvideo a{color: #fff; text-decoration: none;} div.dlvideo span{position:absolute; right:5px; top:5px; width: auto;}
            .hidden, #dlframe{display:none!important;}
        `);
    });
    onDocEnd(function() {
        window.BetterJsPop = null;
        window.doPopAds = null;
        window.doSecondPop = null;
        window.secondsdl = 0;
        window.popAdsLoaded = true;
        window.noPopunder = true;
        let voi = setInterval(function() {
            if (document.querySelectorAll('p[id]').length) {
                let src;
                document.querySelectorAll('p[id]').forEach(x => src = src || (x.innerText.match(/^[^\s]+$/i) && x.innerText.match(/~/)) ? x.innerText : src);
                if (src) {
                    clearInterval(voi);
                    src = document.location.origin + "/stream/" + src;
                    let dl = html2element(`<div class="dlvideo"><a href="${src}" target="dlframe">DOWNLOAD LINK</a><span><a target="_blank" href="${document.location.href}">&infin;</a></span></div>`);
                    let tel;
                    if ((tel = document.querySelector('div.videocontainer > span.title'))) {
                        dl.setAttribute('title', tel.innerText);
                    }
                    document.body.appendChild(html2element(`<iframe name="dlframe" id="dlframe"></iframe>`));
                    document.body.appendChild(dl);
                    document.querySelector('.dlvideo > a').addEventListener("click", function(e) {
                        dl.classList.add('hidden');
                    });
                    document.querySelectorAll('#olvideo video').forEach(function(el) {
                        el.addEventListener("play", function() {
                            dl.classList.add('hidden');
                        });
                        el.addEventListener("pause", function() {
                            dl.classList.remove('hidden');
                        });
                    });
                }
                if (videojs && videojs("olvideo").vast) {
                    videojs("olvideo").vast.disable();
                    vasturl = null;
                }
                $('body').off('mouseup');
                $('#videooverlay').click();
            }
        }, 20);


    });

    let z = setInterval(function() {
        if ('J9RR' in window) {
            window.J9RR = null;
            clearInterval(z);
        }
    }, 1);

})();