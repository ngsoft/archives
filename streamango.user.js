// ==UserScript==
// @name         streamango
// @namespace    https://github.com/ngsoft
// @version      2.3
// @description  Add remover + autoplay
// @author       daedelus
// @include     *://streamango.*/embed/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/streamango.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/streamango.user.js
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
    const Store = new class {
        constructor() {
            let o = "object", s = "string", n = null, d = {script: {namespace: "http://tampermonkey.net/", name: "New Userscript", author: "You"}}, info = (typeof GM_info === o && GM_info !== n) ? GM_info : (typeof GM === o && GM !== n && typeof GM.info === o) ? GM.info : d,
                    id = (typeof info.script.namespace === s ? info.script.namespace : d.script.namespace) + '.' + (typeof info.script.name === s ? info.script.name : d.script.name) + '.' + (typeof info.script.author === s ? info.script.author : d.script.author);
            this.prefix = id.replace(/[^\w]+/g, '.') + '.';
        }
        get ready() {
            return typeof Storage !== 'undefined' && window.hasOwnProperty('localStorage') && window.localStorage instanceof Storage;
        }
        get prefix() {
            return this.__prefix__;
        }
        set prefix(v) {
            this.__prefix__ = this.__prefix__ || v;
        }
        has(k) {
            return this.get(k) !== null;
        }
        get(k, d = null) {
            let r = d;
            if (this.ready) {
                let v = window.localStorage.getItem(this.prefix + k) || d;
                try {
                    r = JSON.parse(v);
                } catch (e) {
                    r = v;
                }
            }
            return r;
        }
        set(k, v) {
            if (this.ready) {
                let j;
                try {
                    j = JSON.stringify(v);
                } catch (e) {
                    j = v;
                }
                window.localStorage.setItem(this.prefix + k, j);
            }
            return this;
        }
        unset(k) {
            !this.ready || window.localStorage.removeItem(this.prefix + k);/* jshint ignore:line */
            return this;
        }
    }();


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
                div.dlvideo{color: rgb(116, 44, 161); background-color: rgb(253, 250, 250);}
                div.dlvideo a{color: rgb(116, 44, 161); text-decoration: none;}
            `);
            ondomready(function() {
                //videooverlay
                if (videojs && videojs("mgvideo").vast) {
                    videojs("mgvideo").vast.disable();
                    vasturl = null;
                }

                let src = document.querySelector('#mgvideo video') !== null ? document.querySelector('#mgvideo video').src : undefined;


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
                    //document.querySelector('undefined').remove();
                    document.querySelector('#videooverlay').dispatchEvent(new Event("click", {bubbles: true, cancelable: true}));
                    if (autoplay) {
                        setTimeout(x => document.querySelector('.vjs-big-play-button').dispatchEvent(new Event("click", {bubbles: true, cancelable: true})), 1500);
                    }
                }
            });
        }
    }, 20);

})();

