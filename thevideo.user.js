// ==UserScript==
// @name         thevideo.me + mp4upload.com
// @namespace    https://github.com/ngsoft
// @version      1.3
// @description  best available quality + direct link
// @author       daedelus
// @include     *://vev.io/embed*
// @include     *://thevideo.me/embed*
// @include     *://*mp4upload.com/embed*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/thevideo.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/thevideo.user.js
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



    let w = setInterval(function() {

        if (document.body !== null) {
            window.open = function() {};
            window.BetterJsPop = null;
            window.doPopAds = null;
            window.doSecondPop = null;
            window.secondsdl = 0;
            window.popAdsLoaded = true;
            window.noPopunder = true;
            clearInterval(w);

            addstyle(`
                div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999999; padding: .5em 0;}
                div.dlvideo > span{position:absolute; right:5px; top:5px; width: auto;}
                div.dlvideo span, div.dlvideo span *{cursor: pointer;}
                div.dlvideo span label{margin-left: 5px;}
                .hidden, .videologo, #dlframe {display: none !important;}
                /* color theme */
                div.dlvideo{color: #FFF; background-color: #000;}
                div.dlvideo a{color: #FFF; text-decoration: none;}
            `);
            ondomready(function() {

                let qualityi = setInterval(function() {
                    let pel;

                    ['.vjs-quality-submenu', 'div.vjs-menu-button[title="Quality"]'].forEach(function(x) {
                        if (document.querySelector(x) !== null) {
                            pel = document.querySelector(x);
                        }
                    });

                    if (!pel) {
                        return;
                    }
                    clearInterval(qualityi);
                    let qlist = [], last = 0;
                    pel.querySelectorAll('ul > li').forEach(function(el) {
                        //let q = el.querySelector('.vjs-menu-item-label').text;
                        let quality = el.textContent;
                        let index, results;
                        if ((results = quality.match(/([0-9]+)/))) {
                            index = results[1];
                            if (index > last) {
                                qlist.unshift({
                                    quality: quality,
                                    element: el
                                });
                            } else {
                                qlist.push({
                                    quality: quality,
                                    element: el
                                });
                            }
                            last = index;
                        }
                    });
                    if (qlist.length > 0) {
                        qlist[0].element.dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
                        document.querySelectorAll('.dlvideo').forEach(x => x.classList.add('hidden'));
                        setTimeout(function() {
                            document.querySelectorAll('.dlvideo a').forEach(x => x.href = document.querySelector('video').src);
                            document.querySelectorAll('.dlvideo').forEach(x => x.classList.remove('hidden'));
                        }, 1000);
                        return;
                    }
                }, 10);

                let srci = setInterval(function() {
                    let src = document.querySelector('video') !== null ? document.querySelector('video').src : undefined;
                    if (src) {
                        clearInterval(srci);
                        let dl = html2element(`<div class="dlvideo"><a href="${src}" target="_blank">DIRECT LINK</a></div>`), title;
                        document.body.appendChild(dl);
                        document.querySelectorAll('video').forEach(function(el) {
                            el.addEventListener("play", function() {
                                dl.classList.add('hidden');
                                dl.href = el.src;
                            });
                            el.addEventListener("pause", function() {
                                dl.classList.remove('hidden');
                                dl.href = el.src;
                            });
                        });
                    }
                }, 500);





            });
        }
    }, 20);

})();

