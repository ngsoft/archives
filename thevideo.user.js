// ==UserScript==
// @name         thevideo.me + mp4upload.com + uptoBOX + rapidvideo
// @namespace    https://github.com/ngsoft
// @version      1.7
// @description  jwplayer video downloader
// @author       daedelus
// @include     *://vev.io/embed*
// @include     *://thevideo.me/embed*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*yourupload.com/embed/*
// @run-at      document-start
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/thevideo.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/thevideo.user.js
// ==/UserScript==

/**
 * Works best with following line in hosts file
 * 0.0.0.0 bodelen.com ceehimur.uk
 * 0.0.0.0 p311425.clksite.com p311425.mycdn.co
 */

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

    document.addEventListener = (function(old) {
        return function(type, listener, capture) {
            if (type !== 'contextmenu')
                old(type, listener, !!capture);
        };
    })(document.addEventListener);



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
                /* Link Bar */
                div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999999; padding: 1em 0;}
                div.dlvideo > span{position:absolute; right:5px; top:1em; width: auto;}
                div.dlvideo span, div.dlvideo span *{cursor: pointer;}
                div.dlvideo span label{margin-left: 5px;}
                /* thevideo mods */
                #home_video{position: relative;}
                #home_video > div[style*="calc"]{height: calc(100% - 50px)!important;}
                /* color theme */
                div.dlvideo{color: #FFF; background-color: rgba(0,0,0,.4);}
                div.dlvideo a{color: #FFF; text-decoration: none;}
                /* utils */
                .hidden, .videologo, #dlframe, #overlay, .hidden * {position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}

            `);
            ondomready(function() {


                let srci = setInterval(function() {
                    let src = document.querySelector('video') !== null ? document.querySelector('video').src : undefined;
                    if (src) {
                        clearInterval(srci);
                        let dl = html2element(`<div class="dlvideo"><a href="${src}" target="_blank">VIDEO LINK</a><span><a target="_blank" href="${document.location.href}">🔗</a></span></div>`), title;

                        /* rapidvideo */
                        let target = document.querySelector('#home_video');
                        if (target instanceof EventTarget) {
                            target.oncontextmenu = x => false;
                        }

                        document.body.appendChild(dl);


                        document.querySelectorAll('video').forEach(function(el) {
                            el.addEventListener("play", function() {
                                dl.classList.add('hidden');
                                dl.querySelector('a').href = el.src;
                            });
                            el.addEventListener("pause", function() {
                                dl.classList.remove('hidden');
                                dl.querySelector('a').href = el.src;
                            });
                        });
                    }
                }, 500);


                /**
                 * Best Quality selector only available for rapidvideo
                 */
                if (location.host.match(/rapidvideo/i) !== null) {
                    let quality = {}, best;
                    document.querySelectorAll('#home_video > div[style*="23px"]').forEach(function(x) {
                        x.querySelectorAll('a[href*="q="]').forEach(function(y) {
                            best = y;
                            quality[y.innerText] = y;
                            y.addEventListener('click', function() {
                                localStorage.lastquality = this.innerText;
                            });
                        });
                    });


                    if (document.location.href.match(/q=/) === null) {
                        let last;
                        if (last = localStorage.lastquality) {
                            if (quality[last]) {
                                document.location.replace(quality[last].href);
                            }
                            return;
                        }
                        document.location.replace(best.href);

                    }
                    return;
                }


                /**
                 * Best Quality selector only available for thevideo.me and vev.io
                 */
                if (location.host.match(/thevideo.me|vev.io/) === null) {
                    return;
                }
                let qualityi = setInterval(function() {
                    let pel;

                    ['.vjs-quality-submenu', 'div.vjs-menu-button[title="Quality"]', 'div.vjs-menu-button[aria-label="Quality"]'].forEach(function(x) {
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


            });
        }
    }, 20);

})();

