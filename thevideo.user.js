// ==UserScript==
// @name         thevideo.me
// @namespace    https://github.com/ngsoft
// @version      2.0
// @description  jwplayer video downloader
// @author       daedelus
// @include     *://vev.io/*
// @include     *://thevideo.me/*
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

    const copyToClipboard = function(text = "") {
        let clip = html2element(`<textarea>${text}</textarea>"`);
        document.body.appendChild(clip);
        clip.style.opacity = 0;
        clip.select();
        let retval = document.execCommand("copy");
        document.body.removeChild(clip);
        return retval;
    };

    function getIcon() {
        let result = '/favicon.ico';
        if (document.querySelector('[rel*="icon"]') instanceof Element) {
            result = document.querySelector('[rel*="icon"]').href;
        }
        return result;
    }



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
                div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999; background-color: #000; padding: 1em 0;font-size: 1rem;}
                div.dlvideo span{position:absolute; right:0; top:1rem; width: auto;}
                div.dlvideo .clipboard{position:absolute; left:0; top:1rem; width: auto;cursor:pointer;}
                div.dlvideo span a, div.dlvideo span a:before, .dl-icon{position: relative;display: inline-block;vertical-align: middle;}
                div.dlvideo span a{white-space: nowrap;overflow: hidden;text-indent: -99999px;}
                div.dlvideo span a:before, .dl-icon{-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;}
                div.dlvideo span a:before{content:"";text-indent: 99999px;position: absolute;top:0;left: 0;}
                div.dlvideo > a, div.dlvideo > span, div.dlvideo .clipboard{padding: 0 2rem;cursor:pointer;}
                .unicon{font-family: "Segoe UI Symbol";font-style: normal;}
                .hidden, .videologo, #dlframe, #overlay,.vjs-info-button, .vjs-overlay-ad, .hidden * {position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}

                /* color theme */
                div.dlvideo{color: #FFF; background-color: rgba(43,51,63,.7);}
                div.dlvideo a{color: #FFF; text-decoration: none;}
                div.dlvideo:hover:hover{background-color: rgba(187,64,64,.7);}
                div.dlvideo span a:before{background-image: url('${getIcon()}');width: 100%;height: 100%;}
                div.dlvideo .dl-icon{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAArklEQVR4AXWRJVgEURRGD+7eJ+FOhjYZh4r13nDtGV1v67tp+zcNb9OxSsPG9fGf5/ekdwEkVH7xk6ER7CyiMO3jkE8itNvCKkX8WeeZVyr0AMAKZfyZIUWSD+bCwpSGnQKrYeFMw06ZlbBwoPGvUEsNOxo11IoFmRwXGjlksdDEHt8aezSKBYAtDUAk9DGqMaCh7fSFhRx3HnK2YH+1KEVWxc2yUVgEUbttVCT4A+GLTZ5S0nQvAAAAAElFTkSuQmCC');}
                div.dlvideo span a {width: 1.25rem;height: 1.25rem;}
                div.dlvideo .dl-icon{width: 1rem;height: 1rem;margin: -.25rem .5rem 0 .5rem;}
                div.dlvideo .dl-icon{filter: invert(100%);}
                div.dlvideo:hover a, div.dlvideo:hover span, div.dlvideo:hover > i{filter: drop-shadow(.25rem .25rem .5rem #000);}
                /* animations */
                @keyframes flash {0% { opacity: 1; } 50% { opacity: .1; } 100% { opacity: 1; }}
                .flash{animation: flash linear .25s infinite;-webkit-animation: flash linear .25s infinite;}
            `);
            ondomready(function() {

                window.BetterJsPop = {
                    checkEventTrusted() {
                        return true;
                    },
                    checkStack() {
                        return true;
                    }
                };
                window.doPopAds = null;
                window.doSecondPop = null;
                window.secondsdl = 0;
                window.popAdsLoaded = true;
                window.noPopunder = true;


                let srci = setInterval(function() {
                    let src = document.querySelector('video') !== null ? document.querySelector('video').src : undefined;
                    if (src) {
                        clearInterval(srci);
                        let dl = html2element(`<div class="dlvideo"><i class="unicon clipboard" title="Copy to Clipboard">&#128203;</i><a href="${src}" target="_blank" title="Download Video"><i class="unicon dl-icon"></i>VIDEO LINK</a><span><a target="_blank" href="${document.location.href}">🔗</a></span></div>`), title;

                        /* rapidvideo */
                        let target = document.querySelector('#home_video');
                        if (target instanceof EventTarget) {
                            target.oncontextmenu = x => false;
                        }

                        document.body.appendChild(dl);
                        if(document.querySelector('.video-js') !== null){
                            document.querySelector('.video-js').appendChild(dl);
                        }

                        dl.querySelector('.clipboard').addEventListener("click", function() {
                            let self = this;
                            if (copyToClipboard(dl.querySelector('a').href)) {
                                self.classList.add('flash');
                                setTimeout(function() {
                                    self.classList.remove('flash');
                                }, 1500);

                            }
                            return false;
                        });

                        document.querySelectorAll('video').forEach(function(el) {
                            el.addEventListener("play", function() {
                                dl.classList.add('hidden');
                                dl.querySelector('a').href = el.src;
                            });
                            el.addEventListener("pause", function() {
                                dl.classList.remove('hidden');
                                dl.querySelector('a').href = el.src;
                            });
                            el.addEventListener("loadeddata", function() {
                                dl.classList.remove('hidden');
                                dl.querySelector('a').href = el.src;
                            });
                        });
                    }
                }, 500);

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
                            document.querySelectorAll('.dlvideo > a').forEach(x => x.href = document.querySelector('video').src);
                            document.querySelectorAll('.dlvideo').forEach(x => x.classList.remove('hidden'));
                        }, 1000);
                        return;
                    }
                }, 10);


            });
        }
    }, 20);

})();

