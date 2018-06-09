// ==UserScript==
// @name         thevideo.me
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Add remover + autoplay
// @author       daedelus
// @include     *://vev.io/embed/*
// @include     *://thevideo.me/embed/*
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
                div.dlvideo{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999999; background-color: rgb(253, 250, 250); padding: .5em 0;color: rgb(116, 44, 161);}
                div.dlvideo a{color: rgb(116, 44, 161); text-decoration: none;}
                div.dlvideo span.automode{position:absolute; right:5px; top:5px; width: auto;}span.automode, span.automode *{cursor: pointer;}span.automode label{margin-left: 5px;}
                .hidden, .videologo, #dlframe {display: none !important;}
            `);
            ondomready(function() {
                //videooverlay
                if (videojs && videojs("mgvideo").vast) {
                    videojs("mgvideo").vast.disable();
                    vasturl = null;
                }

                let src = document.querySelector('#mgvideo video').src;


                if (src) {


                    let autoplay = Store.get('autoplay', false);

                    let dl = html2element(`<div class="dlvideo"><a href="${src}" target="_blank">DOWNLOAD LINK</a><span class="automode"><input type="checkbox" disabled name="autoplay" id="autoplay"/><label for="autoplay">AUTOPLAY</label></span></div>`), title;
                    if ((title = document.querySelector('meta[name="og:title"]')) !== null) {
                        dl.setAttribute('title', title.content);
                    }
                    document.body.appendChild(dl);
                    if (autoplay) {
                        dl.querySelector('#autoplay').checked = true;
                    }

                    dl.querySelector('.automode').addEventListener('click', function(e) {
                        let checked = this.querySelector('input').checked;
                        Store.set('autoplay', checked === false);
                        this.querySelector('input').checked = Store.get('autoplay');
                        if (Store.get('autoplay')) {
                            document.location.replace(document.location.href);
                        }
                    });

                    document.querySelectorAll('#mgvideo video').forEach(function(el) {
                        el.addEventListener("play", function() {
                            dl.classList.add('hidden');
                        });
                        el.addEventListener("pause", function() {
                            dl.classList.remove('hidden');
                        });
                    });
                    document.querySelector('undefined').remove();
                    document.querySelector('#videooverlay').dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
                    if (autoplay) {
                        setTimeout(x => document.querySelector('.vjs-big-play-button').dispatchEvent(new Event("click", {bubbles: true, cancelable: true})), 1500);
                    }
                }
            });
        }
    }, 20);

})();

