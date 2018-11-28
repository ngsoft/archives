// ==UserScript==
// @name         Openload + StreamMango + RapidVideo + UpToBox + YourUpload
// @author       daedelus
// @namespace    https://github.com/ngsoft
// @version      5.0
// @description  Helps to download streams (videojs based sites)
// @include     *://openload.co/embed/*
// @include     *://streamango.*/embed/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @include     *://oload.fun/embed/*
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/ol.user.js
// ==/UserScript==

(function(doc, undef) {
    /* jshint expr: true */
    /* jshint -W018 */

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

    /**
     * Prevent Adds
     */
    let on = EventTarget.prototype.addEventListener;
    window.addEventListener = doc.addEventListener = function(t) {
        let e = [
            "contextmenu", "click", "mouseup"
        ];
        if (e.indexOf(t) !== -1) {
            return;
        }

        return on(...arguments);

    };

    if (typeof Notification === "function") {
        Notification = function() {};
    }



    function onBody(callback, binding) {
        if (typeof callback !== "function") {
            return;
        }
        let worker = setInterval(function() {
            if (doc.body === null) {
                return;
            }
            clearInterval(worker);
            if (binding) {
                callback.bind(binding);
            }
            callback();
        }, 1);
    }
    function onDocIddle(callback, binding) {
        if (typeof callback === "function") {
            if (binding) {
                callback.bind(binding);
            }
            if (doc.readyState === 'loading') {
                doc.addEventListener('DOMContentLoaded', callback);
                return;
            }
            callback();
        }

    }
    function onDocEnd(callback, binding) {
        if (typeof callback === "function") {
            if (binding) {
                callback.bind(binding);
            }
            if (doc.readyState !== 'complete') {
                window.addEventListener('load', callback);
                return;
            }
            callback();
        }

    }
    function triggerEvent(element, type) {
        if (element instanceof EventTarget && typeof type === "string" && type.length > 0) {
            let event = new Event(type, {bubbles: true, cancelable: true});
            element.dispatchEvent(event);
        }
    }
    function html2element(html) {
        if (typeof html === "string") {
            let template = doc.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }
    function text2element(text) {
        if (typeof text === "string") {
            return doc.createTextNode(text);
        }
    }
    function addcss(css) {
        if (typeof css === "string" && css.length > 0) {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.body.appendChild(s);
        }
    }
    function copyToClipboard(text) {
        let r = false;
        if (typeof text === "string" && text.length > 0) {
            let el = html2element(`<textarea>${text}</textarea>"`);
            doc.body.appendChild(el);
            el.style.opacity = 0;
            el.select();
            r = doc.execCommand("copy");
            doc.body.removeChild(el);
        }
        return r;
    }
    class ElementObserver {

        start() {
            if (this.worker !== undef) {
                return this;
            }
            let self = this;
            if (this.params.interval === 0) {
                throw new Error("ElementObserver : invalid interval");
            }
            if (typeof this.params.onload !== "function") {
                throw new Error("ElementObserver : no callback set");
            }
            if (this.params.selector.length === 0) {
                throw new Error("ElementObserver : no selector set");
            }
            this.worker = setInterval(function() {
                doc.querySelectorAll(self.params.selector).forEach(function(el) {
                    self.params.onload.apply(el, [el, self]);
                });
            }, this.params.interval);
            if (this.params.timeout > 0) {
                this.tworker = setTimeout(function() {
                    self.stop();
                }, this.params.timeout);
            }
            return this;
        }
        stop() {
            if (this.worker === undef) {
                return this;
            }
            if (this.tworker !== undef) {
                clearTimeout(this.tworker);
                delete(this.tworker);
            }
            clearInterval(this.worker);
            delete(this.worker);
            return this;
        }

        constructor(selector, options) {
            let self = this;
            this.params = {
                selector: "",
                onload: null,
                interval: 10,
                timeout: 0,
            };
            if (typeof selector === "string" && selector.length > 0) {
                this.params.selector = selector;
            } else if (selector instanceof Object) {
                options = selector;
            }

            if (typeof options === "function") {
                this.params.onload = options;
            } else if (options instanceof Object) {
                Object.keys(options).forEach(function(x) {
                    if (self.params[x] !== undef) {
                        if (typeof options[x] === typeof self.params[x]) {
                            self.params[x] = options[x];
                        } else if (x === "onload" && typeof options[x] === "function") {
                            self.params[x] = options[x];
                        }

                    }
                });
            }

            if (typeof this.params.onload === "function" && this.params.interval > 0 && this.params.selector.length > 0) {
                this.start();
            }

        }
    }
    function favicon() {
        let r = '/favicon.ico';
        doc.querySelectorAll('[rel*="icon"]').forEach(function(el) {
            r = el.href;
        });
        return r;
    }

    console.debug(scriptname, 'Started.');

    let app = function() {
        if (this === undef || this === window) {
            return;
        }
        let self = this, video;

        let styles = `
            .video-toolbar{position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; padding: 16px 8px;font-size: 16px;z-index: 9999;}
            [class*="video-"] [class*="-icon"]:not([class*="vjs-"])
            {vertical-align: middle;display: inline-block;width: 20px;height: 20px;margin:0 8px;line-height:0;}
            [class*="video-"] [class*="-icon"]:not([class*="vjs-"]) svg{width:87.5%;height:100%;}
            [class*="video-"] [class*="-icon"]:not([class*="vjs-"]) img {width:100%;height:100%;}
            [class*="video-"] .left{float:left;}[class*="video-"] .right{float: right;}
            [class*="video-"] .center{position: absolute;left: 50%;top: 16px;transform: translate(-50%);}`;

        //notifications
        styles += `
                .video-notifications{position: absolute;right: 64px; left: auto; top: 60%;text-align: right;font-size: 16px;z-index: 9999;}
                .video-notify{display: block; text-align:center;font-size:16px;padding:16px; border-radius: 4px; margin: 8px 0;max-width:256px;width:256px;}
                .video-notify [class*="-icon"]{width: 32px;height: 32px;margin:-8px -16px 0 0; float:left;}
                @keyframes fadeInRight {
                    0% {opacity: 0;-webkit-transform: translate3d(100%, 0, 0);transform: translate3d(100%, 0, 0);}
                    100% {opacity: 1;-webkit-transform: none;transform: none;}
                }
                @keyframes bounceOut {
                    20% {-webkit-transform: scale3d(.9, .9, .9);transform: scale3d(.9, .9, .9);}
                    50%, 55% {opacity: 1;-webkit-transform: scale3d(1.1, 1.1, 1.1);transform: scale3d(1.1, 1.1, 1.1);}
                    100% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}
                }
                .bounceOut {animation-name: bounceOut;animation-duration: .75s;animation-duration: 1s;animation-fill-mode: both;}
                .fadeIn {animation-name: fadeInRight;animation-duration: .5s;animation-fill-mode: both;}`;

        styles += `
            /** Default Theme **/
            .video-toolbar{background-color: rgba(0,0,0,.4);font-family: Arial,Helvetica,sans-serif;}
            .video-toolbar, .video-toolbar a {color:#FFF;}.video-toolbar a {text-decoration: none;padding: 0 8px;}
            .video-toolbar a:hover {filter: drop-shadow(8px 8px 8px #fff);}
            .video-notify{color:rgb(34, 34, 34);background-color: rgba(255, 255, 255, .8);font-family: Arial,Helvetica,sans-serif;}`;

        if (doc.location.origin.match(/mango/i) !== null) {
            styles += `
                /* color theme streammango*/
                .video-toolbar{color: rgb(116, 44, 161); background-color: rgb(253, 250, 250);}
                .video-toolbar, .video-toolbar a {color:rgb(116, 44, 161);}
                .video-toolbar a:hover {filter: drop-shadow(8px 8px 8px rgb(116, 44, 161));}`;
        }
        if (doc.location.origin.match(/openload|oload/i) !== null) {
            styles += `/* color theme openload */
                .video-toolbar:hover, .video-js:hover button.vjs-big-play-button{background-color: rgba(0,170,255,.9);}
                .video-toolbar a:hover {filter: drop-shadow(8px 8px 8px #000);}.video-toolbar:hover .fav-icon{filter: invert(100%);}`;
        }
        if (doc.location.host.match(/rapidvideo/i) !== null) {
            styles += `#home_video, #home_video *{z-index:3000;}`;
        }
        //Stretch video and prevent scrollbar
        styles += `body{width:100%; max-height:100%;margin-right:-100px;padding-right:100px;overflow:hidden;}video.vjs-tech{object-fit: fill;}`;
        //hides some elements
        styles += `
                .hidden, .hidden *,
                #videooverlay, .videologo, .jw-logo, .jw-dock, .BetterJsPopOverlay , #overlay
                {position: fixed; right: auto; bottom: auto;top:-100%;left: -100%; height:1px; width:1px; opacity: 0;max-height:1px; max-width:1px;display:inline;}`;

        onBody(function() {
            addcss(styles);
        });

        let template = {
            toolbar: `<div class="video-toolbar"></div>`,
            clipboard: `<a href="" class="clipboard-btn left" title="Copy to Clipboard"><span class="clipboard-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 193.941l-51.882-51.882A48 48 0 0 0 348.118 128H320V80c0-26.51-21.49-48-48-48h-61.414C201.582 13.098 182.294 0 160 0s-41.582 13.098-50.586 32H48C21.49 32 0 53.49 0 80v288c0 26.51 21.49 48 48 48h80v48c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V227.882a48 48 0 0 0-14.059-33.941zm-84.066-16.184l48.368 48.368a6 6 0 0 1 1.757 4.243V240h-64v-64h9.632a6 6 0 0 1 4.243 1.757zM160 38c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm-32 138v192H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h55.414c9.004 18.902 28.292 32 50.586 32s41.582-13.098 50.586-32H266a6 6 0 0 1 6 6v42h-96c-26.51 0-48 21.49-48 48zm266 288H182a6 6 0 0 1-6-6V182a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v170a6 6 0 0 1-6 6z"></path></svg></span></a>`,
            download: `<a href="" target="_blank" title="Download Video" class="dl-btn center"><span class="dl-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M230.9 64c8.8 0 16 7.2 16 16v144h93.9c7.1 0 10.7 8.6 5.7 13.6L203.3 381.2c-6.3 6.3-16.4 6.3-22.7 0l-143-143.6c-5-5-1.5-13.6 5.7-13.6h93.9V80c0-8.8 7.2-16 16-16h77.7m0-32h-77.7c-26.5 0-48 21.5-48 48v112H43.3c-35.5 0-53.5 43-28.3 68.2l143 143.6c18.8 18.8 49.2 18.8 68 0l143.1-143.5c25.1-25.1 7.3-68.2-28.3-68.2h-61.9V80c0-26.5-21.6-48-48-48zM384 468v-8c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v8c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12z"></path></svg></span>VIDEO LINK</a>`,
            newtab: `<a href="" target="_blank" title="Open in a new tab" class="newtab-btn right"><span class="fav-icon"><img src="${favicon()}" /></span></a>`,
            notifications: `<div class="video-notifications"></div>`
        };

        let videoevents = {
            play() {
                self.toolbar.classList.add('hidden');
                self.download.href = self.clipboard.href = this.src;
            },
            pause() {
                self.toolbar.classList.remove('hidden');
                self.download.href = self.clipboard.href = this.src;
            },
            loadeddata() {
                self.download.href = self.clipboard.href = this.src;
            }
        };
        let appevents = {
            toolbar(e) {
                e.stopPropagation();
                return false;
            },
            clipboard(e) {
                e.preventDefault();
                e.stopPropagation();
                if (copyToClipboard(this.href)) {
                    self.notify('Link copied to clipboard.');
                }
                return false;
            },
            download() {
                this.href = video.src;

            },
            newtab() {
                this.href = doc.location.href;
            }
        };

        this.notify = function(message) {
            if (typeof message === "string" && message.length > 0) {
                let el = html2element(`<div class="video-notify fadeIn">${message}</div>`);
                setTimeout(function() {
                    el.classList.remove('fadeIn');
                    setTimeout(function() {
                        el.classList.add('bounceOut');
                        setTimeout(function() {
                            el.parentNode.removeChild(el);
                        }, 1000);
                    }, 1000);
                }, 500);
                self.notifications.appendChild(el);
            }
        };




        this.start = function(videoelement) {
            let target = doc.body;
            if (videoelement instanceof Element) {
                video = videoelement;
                if (video.classList.contains('vjs-tech')) {
                    target = video.parentNode;
                    try {
                        let id, vjs;
                        if ((id = video.parentNode.id)) {
                            if (typeof videojs !== "undefined" && (vjs = videojs(id)) && typeof vjs.vast !== "undefined") {
                                vjs.vast.disable();
                            }
                        }
                    } catch (e) {
                    }
                }
                //build elements
                this.toolbar = html2element(template.toolbar);
                this.clipboard = html2element(template.clipboard);
                this.download = html2element(template.download);
                this.newtab = html2element(template.newtab);
                this.notifications = html2element(template.notifications);
                //assemble elements
                target.appendChild(this.toolbar);
                this.toolbar.appendChild(this.clipboard);
                this.toolbar.appendChild(this.download);
                this.toolbar.appendChild(this.newtab);
                target.appendChild(this.notifications);
                //register events
                Object.keys(appevents).forEach(function(x) {
                    self[x].addEventListener('click', appevents[x]);
                });
                Object.keys(videoevents).forEach(function(evt) {
                    video.addEventListener(evt, videoevents[evt]);
                });
                if (video.src && video.src.length > 0) {
                    this.download.href = this.clipboard.href = video.src;
                }
            }
        };


        return this;
    };

    let application = window.oltoolbar = new app();

    onBody(function() {
        window.adblock = false;
        window.adblock2 = false;
        window.sadbl = false;
        window.turnoff = true;
    });

    onDocIddle(function() {
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

        /**
         * Auto Quality selector only available for rapidvideo
         */
        if (doc.location.host.match(/rapidvideo/i) !== null) {
            let quality = {}, best;
            doc.querySelectorAll('#home_video > div[style*="23px"]').forEach(function(x) {
                x.querySelectorAll('a[href*="q="]').forEach(function(y) {
                    best = y;
                    quality[y.innerText] = y;
                    y.addEventListener('click', function() {
                        localStorage.lastquality = this.innerText;
                    });
                });
            });


            if (doc.location.href.match(/q=/) === null) {
                let last;
                if (last = localStorage.lastquality) {
                    if (quality[last]) {
                        doc.location.replace(quality[last].href);
                    }
                    return;
                }
                doc.location.replace(best.href);

            }

        }
        new ElementObserver('video.vjs-tech, video.jw-video', function(el, obs) {
            if (this.src.length > 0) {
                obs.stop();
                application.start(this);
            }
        });
    });
    onDocEnd(function() {
        window.executed = true;
        window.f6AA = function() {};
        if (typeof vasturl !== "undefined") {
            vasturl = null;
        }
        if (typeof vasturlfallback !== "undefined") {
            vasturlfallback = null;
        }

        new ElementObserver({
            selector: '#videooverlay',
            onload(el, obs) {
                obs.stop();
                triggerEvent(el, 'click');
            },
            timeout: 2000
        });


    });

})(document);