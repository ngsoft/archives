// ==UserScript==
// @name        Stream Grabber
// @author      daedelus
// @namespace   https://github.com/ngsoft
// @version     1.0
// @description Helps to download streams (videojs, jwvideo based sites)
// @grant       none
// @run-at      document-body
// @compatible  firefox+greasemonkey(3.17)
// @compatible  firefox+tampermonkey
// @compatible  chrome+tampermonkey
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/streamgrabber.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/streamgrabber.user.js
// @icon        https://www.tampermonkey.net/favicon.ico
// @include     *://streamango.*/embed/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @include     *://openload.*/embed/*
// @include     *://oload.*/embed/*
// @include     *://oloadblock.*/embed/*
// @include     *://*xstreamcdn.com/v/*
// @include     *://*fembed.com/v/*
// @include     *://*there.to/v/*
// @include     *://*vidstreaming.io/*
// @include     *://*gdriveplayer.us/*
// ==/UserScript==

((doc, undef) => {

    /* jshint expr: true */
    /* jshint -W018 */
    /* jshint -W083 */

    const GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    const scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

    const s = "string", b = "boolean", f = "function", o = "object", u = "undefined", n = "number";

    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }

    function onBody(callback) {
        if (typeof callback === f) {
            let i = setInterval(function () {
                if (doc.body !== null) {
                    clearInterval(i);
                    callback();
                }
            }, 1);
        }
    }
    function onDocIddle(callback) {
        if (typeof callback === f) {
            if (doc.readyState === "loading") {
                return doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
                    doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                    callback();
                });
            }
            callback();
        }
    }
    function onDocEnd(callback) {
        if (typeof callback === f) {
            if (doc.readyState !== "complete") {
                return addEventListener('load', function load() {
                    callback();
                });
            }
            callback();
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

    function addcss(css) {
        if (typeof css === "string" && css.length > 0) {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            onBody(function () {
                doc.body.appendChild(s);
            });

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
    function trigger(el, type, data) {
        if (el instanceof EventTarget) {
            if (typeof type === s) {
                type.split(" ").forEach((t) => {
                    let event = new Event(t, { bubbles: true, cancelable: true });
                    event.data = data;
                    el.dispatchEvent(event);
                });
            }
        }
    }
    /**
     * Uses Mutation Observer + intervals(some sites blocks observers) to find new nodes
     * And test them against params
     */
    const find = (function () {

        const obsopts = {
            attributes: true,
            //characterData: true,
            //childList: true,
            subtree: true
        }, defaults = {
            selector: "",
            onload: null,
            timeout: 0,
            interval: 0
        };

        class SimpleObserver {
            start() {
                const self = this;
                if (self.worker.params.interval > 0) {
                    self.worker.interval = setInterval(self.worker.runner, self.worker.params.interval);
                    if (self.worker.params.timeout > 0) {
                        self.worker.timeout = setTimeout(function () {
                            clearInterval(self.worker.interval);
                        }, self.worker.params.timeout);
                    }
                }
                self.worker.observer.observe(self.worker.params.base, obsopts);
            }
            stop() {
                if (typeof this.worker.timeout !== u) clearTimeout(this.worker.timeout);
                if (typeof this.worker.interval !== u) clearInterval(this.worker.interval);
                if (typeof this.worker.observer !== u) this.worker.observer.disconnect();
            }
            constructor(runner, obs, params) {
                this.worker = {
                    params: params,
                    observer: obs,
                    runner: runner
                };
            }
        }



        return function findNode(options) {
            let params = Object.assign({}, defaults), base = doc;
            for (let i = 0; i < arguments.length; i++) {
                let arg = arguments[i];
                switch (typeof arg) {
                    case o:
                        if (arg instanceof Element || arg instanceof Document) {
                            base = arg;
                        } else if (isPlainObject(arg)) {
                            Object.assign(params, arg);
                        }
                        break;
                    case f:
                        params.onload = arg;
                        break;
                    case s:
                        params.selector = arg;
                        break;
                    case n:
                        params.interval = 10;
                        params.timeout = arg;
                        break;
                    default:
                        break;
                }
            }

            if (typeof params.onload === f && typeof params.selector === s && typeof base.addEventListener === f) {

                const matches = [];
                let simpleobs, interval, timeout, observer;
                params.base = base;

                const runner = function runner() {
                    base.querySelectorAll(params.selector).forEach(function (element) {
                        if (!matches.includes(element)) {
                            matches.push(element);
                            trigger(element, 'DOMNodeCreated', { element: element, params: params, observer: simpleobs });
                            params.onload.call(element, element, simpleobs, params);
                        }
                    });
                };

                observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node instanceof Element) {
                                if ((node = node.closest(params.selector)) !== null) {
                                    if (!matches.includes(node)) {
                                        matches.push(node);
                                        trigger(node, 'DOMNodeCreated', { element: node, params: params, observer: simpleobs });
                                        params.onload.call(node, node, simpleobs, params);
                                    }

                                }
                            }
                        });
                    });
                });
                simpleobs = new SimpleObserver(runner, observer, params);
                simpleobs.start();
                if (doc.readyState !== "complete") {
                    addEventListener('load', runner);
                } else runner();
            }

        };

    })();


    /**
     * StreamGrabber Toolbar
     */
    function StreamGrabber(video, module) {
        if (!(this instanceof StreamGrabber) || !(video instanceof Element) || typeof video.streamgrabber !== u) {
            return;
        }

        let started = false;

        const self = this, template = {
            toolbar: html2element(`<div class="streamgrabber" />`),
            notify: html2element(`<div class="streamgrabber-notify" />`),
            iconnotify: `<span class="notify-icn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="square"><path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288zM332.7 130.4c-3.8-3.9-10.1-3.9-14-.1L231.4 217l-37.9-38.2c-3.8-3.9-10.1-3.9-14-.1l-23.4 23.2c-3.9 3.8-3.9 10.1-.1 14l68.1 68.6c3.8 3.9 10.1 3.9 14 .1l117.8-116.8c3.9-3.8 3.9-10.1.1-14l-23.3-23.4z"></path></svg></span>`,
            buttons: {
                clipboard: html2element(`<a href="#" class="clipboard-bt right" title="Copy to Clipboard" data-notify="Link copied to clipboard."><span class="bt-desc">Copy to Clipboard</span><span class="clipboard-icn"></span></a>`),
                newtab: html2element(`<a href="" class="newtab-bt left" title="Open in a New Tab" target="_blank"><span class="newtab-icn"></span><span class="bt-desc">Open in a New Tab</span></a>`),
                download: html2element(`<a href="" class="download-bt center" target="_blank" title="Download Link"><span class="download-icn"></span><span class="bt-desc">VIDEO LINK</span></a>`)
            },
            icons: {
                clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 193.941l-51.882-51.882A48 48 0 0 0 348.118 128H320V80c0-26.51-21.49-48-48-48h-61.414C201.582 13.098 182.294 0 160 0s-41.582 13.098-50.586 32H48C21.49 32 0 53.49 0 80v288c0 26.51 21.49 48 48 48h80v48c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V227.882a48 48 0 0 0-14.059-33.941zm-84.066-16.184l48.368 48.368a6 6 0 0 1 1.757 4.243V240h-64v-64h9.632a6 6 0 0 1 4.243 1.757zM160 38c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm-32 138v192H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h55.414c9.004 18.902 28.292 32 50.586 32s41.582-13.098 50.586-32H266a6 6 0 0 1 6 6v42h-96c-26.51 0-48 21.49-48 48zm266 288H182a6 6 0 0 1-6-6V182a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v170a6 6 0 0 1-6 6z"></path></svg>`,
                //downloadold: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M230.9 64c8.8 0 16 7.2 16 16v144h93.9c7.1 0 10.7 8.6 5.7 13.6L203.3 381.2c-6.3 6.3-16.4 6.3-22.7 0l-143-143.6c-5-5-1.5-13.6 5.7-13.6h93.9V80c0-8.8 7.2-16 16-16h77.7m0-32h-77.7c-26.5 0-48 21.5-48 48v112H43.3c-35.5 0-53.5 43-28.3 68.2l143 143.6c18.8 18.8 49.2 18.8 68 0l143.1-143.5c25.1-25.1 7.3-68.2-28.3-68.2h-61.9V80c0-26.5-21.6-48-48-48zM384 468v-8c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v8c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12z"></path></svg>`,
                download: `<svg class="square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M28 16h-5l-7 7-7-7h-5l-4 8v2h32v-2l-4-8zM0 28h32v2h-32v-2zM18 10v-8h-4v8h-7l9 9 9-9h-7z"></path></svg>`,
                newtab: `<img src="/favicon.ico" />`
            }
        }, events = {

            toolbar: {
                click(e) {
                    e.stopPropagation();
                    let target = e.target, btn;
                    if ((btn = e.target.closest('[class*="-bt"]')) !== null) {
                        if (btn.classList.contains('download-bt')) {
                            btn.href = self.videolink();
                            if (btn.href === doc.location.href) {
                                e.preventDefault();
                            }
                        }
                        if (btn.classList.contains('clipboard-bt')) {
                            e.preventDefault();
                            copyToClipboard(self.videolink());
                        }
                        if (typeof btn.dataset.notify === s) {
                            self.notify(btn.dataset.notify);
                        }
                    }
                    return false;
                },
                contextmenu(e) {
                    e.preventDefault();
                }
            },
            video: {
                play() {
                    this.streamgrabber.hide();
                    if (this.streamgrabber.videolink() !== undef) {
                        if (!started) start();
                        this.streamgrabber.elements.buttons.download.href = this.streamgrabber.videolink();
                    }
                    this.style['object-fit'] = "fill";
                },
                pause() {
                    if (this.streamgrabber.videolink() !== undef) {
                        if (!started) start();
                        this.streamgrabber.elements.buttons.download.href = this.streamgrabber.videolink();
                        this.streamgrabber.show();
                    }

                },
                loadeddata() {
                    if (this.streamgrabber.videolink() !== undef) {
                        if (!started) start();
                        this.streamgrabber.elements.buttons.download.href = this.streamgrabber.videolink();
                        this.streamgrabber.show();
                    }
                },
                DOMNodeRemoved() {
                    this.streamgrabber.hide();
                },
                DOMNodeCreated() {
                    //this.streamgrabber.hide();
                }
            }
        };

        /**
         * Build toolbar
         */
        this.elements = {
            toolbar: template.toolbar,
            notify: template.notify,
            buttons: template.buttons,
            iconnotify: html2element(template.iconnotify)
        };
        Object.keys(template.icons).forEach(icn => {
            let el = html2element(template.icons[icn]);
            if (icn === "newtab") {
                el.onerror = function () {
                    doc.querySelectorAll('[rel*="icon"][href]').forEach(icon => {
                        this.src = icon.href;
                    });
                };
            }
            this.elements.buttons[icn].querySelector('[class*="-icn"]').appendChild(el);
        });
        this.elements.toolbar.appendChild(this.elements.buttons.newtab);
        this.elements.toolbar.appendChild(this.elements.buttons.download);
        this.elements.toolbar.appendChild(this.elements.buttons.clipboard);
        if (/mobile/i.test(navigator.userAgent)) {
            this.elements.toolbar.classList.add('mobile');
        }
        this.hide();

        /**
         * Start Toolbar once video loaded correctly
         */
        function start() {
            if (started === true) return;
            started = true;
            console.debug(scriptname, "started");
            let container = video.parentElement.closest('div[id]');
            if (container === null) {
                container = video.parentElement;
            }
            self.container = container;
            container.appendChild(self.elements.toolbar);
            container.appendChild(self.elements.notify);
            self.elements.buttons.download.href = self.videolink();
            /**
             * Events
             */
            Object.keys(events.toolbar).forEach(evt => {
                self.elements.toolbar.addEventListener(evt, events.toolbar[evt]);
            });
            self.ready = true;
            trigger(self.video, 'ready.streamgrabber');
            if (video.paused) self.show();
        }


        /**
         * Attach grabber to video
         */
        this.video = video;
        Object.defineProperty(video, 'streamgrabber', {
            value: self, configurable: true
        });
        /**
         * Events
         */
        Object.keys(events.video).forEach(evt => {
            video.addEventListener(evt, events.video[evt]);
        });
        /**
         * Check if video Element is removed
         */
        let obs = new MutationObserver(mutations => {
            mutations.forEach(({ removedNodes }) => {
                removedNodes.forEach(element => {
                    if (element instanceof Element && element === video) {
                        events.video.DOMNodeRemoved.call(video);
                    }
                });
            });
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(element => {
                    if (element instanceof Element && element === video) {
                        events.video.DOMNodeCreated.call(video);
                    }
                });
            });
        });
        obs.observe(video.parentElement, { childList: true, subtree: true });

        /**
         * Detects if a link is available
         */
        let worker = setInterval(() => {
            if (self.videolink() !== undef) {
                clearInterval(worker);
                if (!started) start();
            }
        }, 10);

        setTimeout(() => {
            clearInterval(worker);
        }, 15000);

        /**
         * Loads Style
         */
        StreamGrabber.loadTheme();

        /**
         * Load Module
         */
        if (typeof module === f) {
            module.call(self, self);
        }

    }

    Object.assign(StreamGrabber, {
        stylesapplied: false,
        loadTheme() {
            if (this.stylesapplied === true) return;
            this.stylesapplied = true;
            /**
             * Positionnement
             */
            let css = `
                    .streamgrabber {position: absolute; top: 0 ; left: 0 ; right: 0; text-align: center; padding: 16px 8px;z-index: 9999; text-align: center;}
                    .streamgrabber [class*="-icn"]{vertical-align: middle; display: inline-block; width: 20px; height: 20px; margin:0 8px; line-height:0;}
                    .streamgrabber [class*="-icn"] svg{width:87.5%;height:100%;}.streamgrabber [class*="-icn"] svg.square{width:87.5%;height:87.5%;}
                    .streamgrabber [class*="-icn"] img {width:100%;height:100%;}
                    .streamgrabber .left{float:left;}.streamgrabber .right{float: right;}
                    .streamgrabber .center{position: absolute;left: 50%;top: 16px;transform: translate(-50%);}
                    .streamgrabber-notify {position: absolute; right: 32px; top: 40%; text-align: right;z-index: 9999;}
                `;

            /**
             * Default Theme
             */
            css += `
                    .streamgrabber, .streamgrabber a, .streamgrabber-notify {font-family: Arial,Helvetica,sans-serif; font-size: 16px; color:#FFF;line-height: 1.5;}
                    .streamgrabber {background-color: rgba(0, 0, 0, 0.45);}
                    .streamgrabber a {text-decoration: none; padding: 0 8px;}
                    .streamgrabber a:hover {filter: drop-shadow(8px 8px 8px #fff);}
                    .streamgrabber-notify > div{
                        display: block; text-align:center;padding:16px; border-radius: 4px; margin: 8px 0;
                        min-width:256px;max-width:512px;
                        color:rgb(0,0,0);background-color: rgba(255, 255, 255, .8);font-weight: bold;position: relative;
                    }
                    .streamgrabber-notify > div [class*="-icn"]
                    {position:absolute; left: 8px; top:8px; display: inline-block; width: 32px;height: 32px;line-height: 0;}
                    .streamgrabber-notify > div [class*="-icn"] + *{padding: 0 8px 0 24px;}
                `;

            /**
             * Animations
             * @link https://daneden.github.io/animate.css/
             */
            css += `
                    @keyframes fadeInRight {
                        0% {opacity: 0;-webkit-transform: translate3d(100%, 0, 0);transform: translate3d(100%, 0, 0);}
                        100% {opacity: 1;-webkit-transform: none;transform: none;}
                    }
                    .fadeInRight {animation-name: fadeInRight;animation-duration: .5s;animation-fill-mode: both;}
                `;

            /**
             * Visually hidden
             */
            css += `
                    .hidden, .hidden *,
                .streamgrabber [class*="-bt"]:not(:hover):not(.download-bt) .bt-desc, .streamgrabber.mobile .bt-desc{
                        position: fixed !important; right: auto !important; bottom: auto !important; top:-100% !important; left: -100% !important;
                        height: 1px !important; width: 1px !important; opacity: 0 !important;max-height: 1px !important; max-width: 1px !important;
                        display: inline !important;z-index: -1 !important;
                    }
                `;
            let node = doc.createElement('style');
            node.setAttribute('type', "text/css");
            node.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.head.appendChild(node);
        }
    });

    StreamGrabber.prototype = {
        videolink() {
            let src = "", source;
            if (this.video instanceof Element) {
                if (typeof this.video.src === s && this.video.src.length > 0) {
                    src = this.video.src;
                } else if ((source = this.video.querySelector('source[src]')) !== null && source.src.length > 0) {
                    src = source.src;
                }
                if (!(/^http/i.test(src))) {
                    //alert(src);
                    src = "";
                }
            }
            return src.length > 0 ? src : undef;
        },
        show() {
            this.elements.toolbar.classList.remove('hidden');
        },
        hide() {
            this.elements.toolbar.classList.add('hidden');
        },
        notify(message, icon, timeout) {
            if (typeof timeout !== n) timeout = 2000;
            if (typeof message === s) {
                message = html2element(`<span class="streamgrabber-notify-message">${message}</span>`);
            }
            if (!(message instanceof Element)) {
                return;
            }
            if (!(icon instanceof Element)) icon = this.elements.iconnotify;
            let notification = doc.createElement('div');
            notification.appendChild(icon.cloneNode(true));
            notification.appendChild(message);
            notification.hidden = true;
            notification.classList.add('fadeInRight');
            this.elements.notify.insertBefore(notification, this.elements.notify.firstChild);
            notification.hidden = null;
            setTimeout(() => {
                this.elements.notify.removeChild(notification);
            }, timeout);
        },
        onReady(callback) {
            if (typeof callback === f) {
                if (this.ready === true) {
                    callback.call(this.video);
                    return;
                }
                this.video.addEventListener('ready.streamgrabber', callback);
            }
        }
    };


    /**
     * Prevent Ads
     */
    (() => {

        let on = EventTarget.prototype.addEventListener;
        window.addEventListener = doc.addEventListener = function (t) {
            let e = [
                "contextmenu", "click", "mouseup"
            ];
            if (e.indexOf(t) !== -1) {
                return;
            }
            return on(...arguments);
        };

        onBody(() => {
            window.adblock = false;
            window.adblock2 = false;
            window.sadbl = false;
            window.turnoff = true;
        });
        onDocIddle(() => {
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
        });
        onDocEnd(() => {
            window.executed = true;
            window.f6AA = x => x;
            if (typeof vasturl !== "undefined") {
                vasturl = null;
            }
            if (typeof vasturlfallback !== "undefined") {
                vasturlfallback = null;
            }

        });

        find('#videooverlay', el => {
            trigger(el, "click");
        });

        /**
         * Rewrite certains attributes on the fly
         */
        find('[style*="z-index: 2147483"][style*="z-index: 300000"], div[style*="position: fixed"]', el => {
            el.style['z-index'] = "-1";
            el.classList.add('hidden');
        }, 5000);
        let obs = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(element => {
                    if (element instanceof Element) {
                        if (element.matches('[style*="z-index: 2147483"], [style*="z-index: 300000"], div[style*="position: fixed"]')) {
                            element.style['z-index'] = "-1";
                            element.classList.add('hidden');
                        }
                    }
                });
            });
        });
        obs.observe(doc, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        });

        addcss(`
                #videooverlay, .videologo, .jw-logo, .jw-dock, .BetterJsPopOverlay , #overlay, .vjs-resize-manager, .vjs-over, .vjs-over *
                {position: fixed; right: auto; bottom: auto;top:-100%;left: -100%; height:1px; width:1px;opacity: 0;max-height:1px; max-width:1px;display:inline;z-index: -1;}
            `);

    })();


    /**
     * Kodi RPC Module
     * Send event to Kodi Userscript
     */
    function kodiRPC(grabber) {
        const icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhUExURQAAAAAAAAAAAAAAAFq/5////wAAAAAAAAEGBwABAQEFBgIGCAIGCBNDVwIFBwAAAA83RxA3RydASwAAAAQGBwUHCDQ0NFq/51q/51W95lq/5yubxyuYxFa+5v///yyeyyycyFq/52jE6f3//y6j0i6j0i6k0yaHrjaRteLl5t/i4+Pk5EC14zKt3j+041q/5zCt3jOv4DGv4Vq/5yqWwjCt3jGv4TSw4Tedxjeexjqx4Duz4j6040O240O25I7T7pPV75zY8JzY8ZzZ8aHQ477c6L/d6cDd6cDe6cLg6////zRLWWYAAAA0dFJOUwADBAYQEB0fIScnJygpKjAyMjIzR0dOj5KVn6Kor6+wscHBw8nKzdHV1djY5u/v7/L0/v77n8h1AAABGUlEQVQ4y5XS2VbCQAyA4VTAFcUFcUfqMi51F6K44YZo3v+BnLSdJiNtz7G339/TZDoA/3qqa5e362W+83KHz2GJP6F9HsNyLywyLyhq4rlFra0c8XV/zEn7gMgvqm0i3+lnz5uPdMD+ff8Q6vl1kHhPJuX9VOA82yXeXwJxV2zwflnAPkrdFps2OEMV+I54YYNrFbDTpzie22BXgtiJ3iTYssG0cQH711AXB/M85axJgtj7XS7eU18K4kXnDAeJ9zAuPrQD1E3y8VGf53OFuC0iSt/HrNAO0Iz0/lycLAfeD29G+ny6w9PWxJ8rs3qszgePWpWxS7dgxA8XKznXtm7Eg9yL74oid0WxA8x0bq62SxxgaqUx6fsvOX95dVWRzekAAAAASUVORK5CYII=`;
        const res = {
            button: html2element(`<a class="kodi-bt right" href="#" title="Send link to Kodi"><span class="bt-desc">Send link to Kodi</span><span class="kodi-icn"><img src="${icon}" /></span></a>`),
            iconnotify: html2element(`<span class="kodi-icn"><img src="${icon}" /></span>`),
            iconsuccess: html2element(`<span class="success-icn" style="color: rgb(40, 167, 69);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="square"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z"></path></svg></span>`),
            iconerror: html2element(`<span class="error-icn" style="color: rgb(220, 53, 69);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.054-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.952 83.154 0l239.94 416.028zm-27.658 15.991l-240-416c-6.16-10.678-21.583-10.634-27.718 0l-240 416C27.983 466.678 35.731 480 48 480h480c12.323 0 19.99-13.369 13.859-23.996zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28zm-11.49-212h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg></span>`)
        };

        const events = {
            click(e) {
                e.preventDefault();
                e.stopPropagation();
                grabber.notify('Video sent to Kodi', res.iconnotify);
                trigger(grabber.video, 'kodi.send', {
                    link: grabber.videolink(),
                    success() {
                        grabber.notify('Kodi Success', res.iconsuccess);
                    },
                    error() {
                        grabber.notify('Kodi Error', res.iconerror);
                    }
                });
            },
            contextmenu(e) {
                e.preventDefault();
                e.stopPropagation();
                trigger(grabber.video, 'kodi.settings');
            }
        };

        grabber.onReady(() => {
            grabber.elements.toolbar.appendChild(res.button);
            Object.keys(events).forEach(evt => {
                res.button.addEventListener(evt, events[evt]);
            });
        });
    }
    /**
     * Register Module for Kodi script (isolation due tu GM_)
     */
    onBody(() => {
        Object.defineProperty(doc.body, 'KodiRPCModule', {
            value: "on", configurable: true
        });
        //document.body.dataset.kodirpcmodule = "on";
    });


    /**
     * Plyr alternative player for certains hosts
     */
    function plyrModule(grabber) {

    }

    /**
     * Main Module
     */
    function mainModule(grabber) {
        /**
         * Disables vast for videojs
         */
        if (grabber.video.classList.contains('vjs-tech')) {
            try {
                let id, vjs;
                if ((id = grabber.video.parentNode.id)) {
                    if (typeof videojs !== "undefined" && (vjs = videojs(id)) && typeof vjs.vast !== "undefined") {
                        vjs.vast.disable();
                    }
                }
            } catch (e) {
            }
        }
        /**
         * jwVideo Quality Selector
         */
        if (typeof jwplayer !== u) {
            /**
             * Quality Selector
             */
            grabber.onReady(function () {
                try {
                    let id = grabber.video.parentElement.closest('div[id]'), jw = jwplayer(id);
                    if (jw.getQualityLevels().length > 0) {
                        let last = localStorage.lastquality || "480p";

                        jw.on('levelsChanged', obj => {
                            if (obj.type === "levelsChanged") {
                                last = localStorage.lastquality = obj.levels[obj.currentQuality].label;
                            }
                        });
                        grabber.video.addEventListener('loadeddata', () => {
                            /**
                             * Set last if available
                             */
                            let levels = jw.getQualityLevels().map(x => x.label), selected = levels[jw.getCurrentQuality()];
                            if (selected !== last) {
                                let i;
                                if ((i = levels.indexOf(last)) !== -1) {
                                    jw.setCurrentQuality(i);
                                    selected = last;

                                }
                            }
                            grabber.notify('Setting quality to ' + selected);
                        });
                    }
                } catch (error) {
                }
            });
        }
        kodiRPC(grabber);
    }

    let hostModule = function (grabber) {

    };

    /**
     * Per Host hacks
     */
    if (/(xstreamcdn|fembed|there)/.test(doc.location.host)) {
        find('#resume', x => x.remove(), 5000);
        find('#loading .fakeplaybutton', button => {
            if (typeof clientSide !== u) {
                clientSide.setup();
                button.parentElement.remove();
            }
        }, 5000);
    }


    if (/(vidstreaming)/.test(doc.location.host)) {
        find('[style*="position: static"]', x => x.remove());

        addcss(`
                #list-server-more {z-index: 10000;padding: 14px 0 0 0;top: 50px;}
                #show-server{background-size: cover;padding: 3px 12px;}
                .streamgrabber{background-color: rgba(0, 0, 0, 0.7);}
            `);
        hostModule = function (grabber) {
            let listmore = doc.getElementById('list-server-more');
            grabber.video.addEventListener('play', () => {
                if (grabber.videolink() !== undef) listmore.hidden = true;
            });
            grabber.video.addEventListener('pause', () => {
                listmore.hidden = null;
            });
        };
    }


    if (/(mp4upload)/.test(doc.location.host)) {
        //use plyr???
        find('.vjs-over', x => x.remove());
    }

    if (/(openload|oload)/.test(doc.location.host)) {
        addcss(`
                .streamgrabber:hover, .video-js:hover button.vjs-big-play-button{background-color: rgba(0,170,255,.9);}
                .streamgrabber a:hover {filter: drop-shadow(8px 8px 8px #000);}
                .streamgrabber:hover .newtab-icn{filter: invert(100%);}
            `);

    }

    if (/(streamango)/.test(doc.location.host)) {
        addcss(`
                .streamgrabber, .streamgrabber a{color: rgb(116, 44, 161); background-color: rgb(253, 250, 250);}
                .streamgrabber, .videograbber a, .streamgrabber-notify > div {color:rgb(116, 44, 161);}
                .streamgrabber a:hover {filter: none;}
            `);

    }

    if (/(rapidvideo)/.test(doc.location.host)) {
        /**
         * Quality Selector
         */
        hostModule = function (grabber) {
            grabber.onReady(() => {
                try {
                    /**
                     * @link https://github.com/silvermine/videojs-quality-selector
                     */

                    const vjs = videojs(grabber.container.id);
                    let last = localStorage.lastquality || "480p", element;

                    vjs.on('qualitySelected', function (e, obj) {
                        last = localStorage.lastquality = obj.label;
                        grabber.notify('Setting quality to ' + last);
                        grabber.elements.buttons.download.href = obj.src;
                    });

                    grabber.video.querySelectorAll('source').forEach(source => {
                        if (source.getAttribute('label') === last && source.getAttribute('selected') === null) {
                            element = source;
                        }
                    });
                    if (element instanceof Element) {
                        vjs.trigger('qualityRequested', element);
                    }

                } catch (error) {

                }
            });
        };

        addcss(`
                .video-js button.vjs-big-play-button{width:3em;}
                .streamgrabber, .video-js button.vjs-big-play-button{background-color: rgba(0, 0, 0, 0.45);}
                .streamgrabber:hover, .video-js:hover button.vjs-big-play-button{background-color: rgba(181, 75, 24, .9);}
                .streamgrabber a:hover {filter: drop-shadow(8px 8px 8px #000);}
            `);
    }

    if (/(gdriveplayer|googlevideo)/.test(doc.location.host)) {
        doc.head.appendChild(html2element(`<link href="https://www.google.com/drive/static/images/drive/favicon.ico" rel="icon" type="image/png">`));
        hostModule = function (grabber) {
            grabber.onReady(() => {
                jwplayer(grabber.container.id).on('adPlay', () => {
                    grabber.hide();
                });
            });
        };
    }


    /**
     * App Module
     */

    function module(grabber) {
        mainModule(grabber);
        hostModule(grabber);
    }



    /**
     * Start APP
     */
    find('video', video => {
        const grabber = new StreamGrabber(video, typeof module === f ? module : mainModule);
    }, 15000);


})(document);