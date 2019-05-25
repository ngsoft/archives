// ==UserScript==
// @name        Stream Grabber
// @author      daedelus
// @namespace   https://github.com/ngsoft
// @version     1.3
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
// @include     *://kshows.to/*
// @include     *://*gdriveplayer.us/*
// @include     *://*fastdrama.*/embed/*
// @include     *://*prettyfast.*/e/*
// @include     *://mcloud.*/embed/*
// @include     *://embed.dramacool*.*/*
// ==/UserScript==

((doc, undef) => {

    /* jshint expr: true */
    /* jshint -W018 */
    /* jshint -W083 */

    const GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    const scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;
    const alert = window.alert;

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
    function isValidUrl(url) {
        const weburl = new RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
        if (typeof url === s && url.length > 0) {
            return weburl.test(url);
        }
        return false;
    }

    function loadjs(src, callback) {
        if (isValidUrl(src)) {
            let script = doc.createElement('script');
            script.type = 'text/javascript';
            script.defer = true;
            if (typeof callback === f) {
                script.onload = callback;
            }
            doc.head.appendChild(script);
            script.src = src;
        }
    }
    function loadcss(src) {
        if (isValidUrl(src)) {
            let style = doc.createElement('link');
            style.rel = "stylesheet";
            style.type = 'text/css';
            doc.head.appendChild(style);
            style.href = src;
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
     * .css-loader
     */
    function cssloader() {
        if (this instanceof cssloader) {
            const template = `<div class="css-loader"><div class="snake-loader-container"><div class="snake-loader rotate-fast"></div></div></div>`, self = this;
            Object.assign(self, {
                target: null,
                loader: html2element(template)
            });
            cssloader.loadTheme();
            self.start();
        }
    }

    cssloader.prototype = {
        start(element) {
            const self = this;
            onBody(() => {
                self.target = element instanceof Element ? element : doc.body;
                self.target.appendChild(self.loader);
            });
        },
        stop() {
            if (this.target !== null) {
                this.target.removeChild(this.loader);
            }
        }
    };

    Object.assign(cssloader, {

        loadTheme() {
            if (!this.stylesapplied) {
                this.stylesapplied = true;
                let css = `
                    @keyframes rotate {0%{transform: rotate(0deg);}100%{transform: rotate(360deg);}}
                    .snake-loader, .rotate, [class*="rotate-"]{animation: rotate 0.8s infinite linear;}
                    .rotate-reverse{animation-direction: reverse;}.rotate-fast{animation-duration: 0.5s;}
                    .rotate-slow{animation-duration: 1.2s;}.rotate-alternate{animation-direction: alternate;}
                    .rotate-alternate.rotate-reverse{animation-direction: alternate-reverse;}
                    .snake-loader{
                        border-style: solid!important;border-top-color: transparent!important;border-radius: 50%!important;
                        display: inline-block;height: 28px;width: 28px;color: #fff; border: 8px;
                    }
                    .css-loader{display: block;position: absolute;top: 0;right: 0; bottom: 0;left: 0;z-index: 2147483647; background: no-repeat center rgba(0, 0, 0, .55);}
                    .css-loader-overlay{position: fixed;z-index: 1800;}
                    .css-loader .snake-loader-container{margin: 0;padding: 0;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);} 
                    body > .css-loader .snake-loader-container, body > .css-loader{position: fixed;}
                    body > .css-loader{background-color: rgba(0, 0, 0, 1);}
                    .snake-loader{width: 56px; height: 56px;border: 16px; color: #dee2e6;}   
                `;
                let node = doc.createElement('style');
                node.setAttribute('type', "text/css");
                node.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
                doc.head.appendChild(node);
            }
        }
    });



    /**
     * StreamGrabber Toolbar
     */
    function StreamGrabber(video, module) {
        if (!(this instanceof StreamGrabber) || !(video instanceof Element) || typeof video.streamgrabber !== u) {
            return;
        }

        let started = false;

        function getFavicon() {
            let src = "/favicon.ico";
            doc.querySelectorAll('[rel*="icon"][href]').forEach(icon => {
                src = icon.href;
            });
            return src;
        }

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
                newtab: `<img src="${getFavicon()}" />`
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
                    //this.style['object-fit'] = "fill";
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
                        if (video.paused === true) this.streamgrabber.show();
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
                    this.parentElement.insertBefore(html2element(`<svg class="square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M30.662 5.003c-4.488-0.645-9.448-1.003-14.662-1.003s-10.174 0.358-14.662 1.003c-0.86 3.366-1.338 7.086-1.338 10.997s0.477 7.63 1.338 10.997c4.489 0.645 9.448 1.003 14.662 1.003s10.174-0.358 14.662-1.003c0.86-3.366 1.338-7.086 1.338-10.997s-0.477-7.63-1.338-10.997zM12 22v-12l10 6-10 6z"></path></svg>`), this);
                    this.parentElement.removeChild(this);
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
                    .streamgrabber [class*="-icn"]{vertical-align: middle; display: inline-block; width: 24px; height: 24px; margin:0 8px; line-height:0;}
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
                    .streamgrabber a:hover {filter: drop-shadow(4px 4px 4px #fff);}
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
                    .no-select, .streamgrabber > *, .streamgrabber-notify > *{-webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;user-select: none;}
                    .hidden, .hidden *,
                    .streamgrabber [class*="-bt"]:not(:hover):not(.download-bt) .bt-desc, .streamgrabber.mobile .bt-desc{
                        position: fixed !important; right: auto !important; bottom: auto !important; top:-100% !important; left: -100% !important;
                        height: 1px !important; width: 1px !important; opacity: 0 !important;max-height: 1px !important; max-width: 1px !important;
                        display: inline !important;z-index: -1 !important;
                    }
                    video{object-fit: fill !important;}
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
        find('[style*="z-index: 2147483"][style*="z-index: 300000"], div[style*="position: fixed"], div[style*="position: absolute"]', el => {
            el.style['z-index'] = "-1";
            el.classList.add('hidden');
        }, 5000);
        let obs = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(element => {
                    if (element instanceof Element) {
                        if (element.matches('[style*="z-index: 2147483"], [style*="z-index: 300000"], div[style*="position: fixed"], div[style*="position: absolute"]')) {
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
    });


    /**
     * Plyr alternative player for certains hosts
     */

    function altplayer(video, altvideo) {

        if (this instanceof altplayer && video instanceof Element) {
            const self = this, plyropts = {
                captions: { active: true, language: 'auto', update: true },
                settings: [
                    'captions',
                    'quality'
                ]

            }, buttons = {
                play: `<span class="play-button">
                            <svg class="play-icn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6zM48 453.5v-395c0-4.6 5.1-7.5 9.1-5.2l334.2 197.5c3.9 2.3 3.9 8 0 10.3L57.1 458.7c-4 2.3-9.1-.6-9.1-5.2z"></path></svg>
                            </span>`,
                bigplay: html2element(`<span class="bigplay-button no-focus" tabindex="-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="bigplay-icn"><path fill="currentColor" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                            </span>`)
            };
            Object.assign(self, {
                video: altvideo instanceof Element ? altvideo : html2element(`<video controls src="" preload="none" tabindex="-1" class="altplayer-video" />`),
                originalvideo: video,
                grabber: null,
                plyr: null,
                ready: false,
                elements: {
                    root: html2element(`<div class="altplayer-container" />`)
                }
            });
            //fit video to screen/iframe size
            const resize = () => {
                //fit to vertical view also (mobile), works also fullscreen
                self.plyr.elements.wrapper.classList.remove('.plyr__video-wrapper--fixed-ratio');
                self.video.style.width = `${doc.documentElement.clientWidth}px`;
                self.video.style.height = `${doc.documentElement.clientHeight}px`;
            };

            const start = () => {
                if ((!altvideo instanceof Element)) self.video.src = video.src;
                self.elements.root.insertBefore(self.video, self.elements.root.firstChild);
                doc.body.innerHTML = "";
                doc.body.insertBefore(self.elements.root, doc.body.firstChild);
                let currentTrack = -1;
                //convert subtitles to vtt
                if (self.video.textTracks.length > 0) {
                    self.video.querySelectorAll('track').forEach(track => {
                        if (typeof track.kind === s && /^(subtitles|captions)$/.test(track.kind) && typeof track.src === s) {
                            let src = track.src, url = (src => {
                                try {
                                    let a = doc.createElement('a'), url;
                                    a.href = src;
                                    url = new URL(a.href);
                                    if (url.href === doc.location.href) {
                                        return null;
                                    }
                                    return url;
                                } catch (error) {
                                    return null;
                                }
                            })(src);
                            if (url !== null) {
                                // @link https://medium.com/netscape/hacking-it-out-when-cors-wont-let-you-be-great-35f6206cc646
                                if (url.origin !== doc.location.origin) {
                                    url = "https://cors-anywhere.herokuapp.com/" + url.href;
                                } else if ((/\.srt/.test(url.pathname))) {
                                    url = url.href;
                                } else url = url.href; //null;
                                if (url !== null) {
                                    fetch(url, {
                                        // mode: "no-cors", method: "GET", 
                                        cache: "default", redirect: 'follow'
                                    }).then(r => {
                                        if (r.status === 200) {
                                            r.text().then(text => {
                                                let parsed, vtt, blob, virtualurl;
                                                if (Array.isArray(parsed = Subtitle.parse(text)) && parsed.length > 0) {
                                                    vtt = Subtitle.stringifyVtt(parsed);
                                                    if (typeof vtt === s && vtt.length > 0) {
                                                        blob = new Blob([vtt], { type: "text/vtt" });
                                                        track.dataset.src = url;
                                                        virtualurl = URL.createObjectURL(blob);
                                                        track.src = virtualurl;
                                                        //setTimeout(x => URL.revokeObjectURL(virtualurl), 2000);
                                                    }
                                                }
                                            });
                                        }
                                    }).catch(ex => {
                                        console.error(ex);
                                        //track.remove();
                                    });
                                }
                            }
                        }
                    });
                }

                self.plyr = new Plyr(self.video, plyropts);
                self.plyr.on('ready', e => {

                    self.plyr.elements.container.id = "altplayer" + Math.floor(+new Date() / 1000);
                    self.plyr.elements.container.insertBefore(buttons.bigplay, self.plyr.elements.container.firstChild);
                    buttons.bigplay.addEventListener('click', () => {
                        self.video.play();
                    });
                    self.video.addEventListener('play', () => {
                        buttons.bigplay.hidden = true;
                    }, { once: true });
                    self.video.addEventListener('click', function (e) {
                        if (this.paused) this.play();
                        else this.pause();
                    });

                    self.grabber = new StreamGrabber(self.video, module);

                    //quality change (save to localStorage)
                    self.plyr.on('qualitychange', function (e) {
                        localStorage.lastquality = e.detail.quality;
                        self.grabber.notify('Setting quality to ' + e.detail.quality + "p");
                    });

                    self.plyr.on('error', function (e) {
                        let url = new URL(self.video.src);
                        if (/\.m3u8/.test(url.pathname)) {
                            let hls = self.hls = new Hls();
                            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                                self.video.dataset.src = url.href;
                                self.grabber.onReady(() => {
                                    self.grabber.videolink = function () {
                                        return self.video.dataset.src;
                                    };
                                });
                                self.video.play();
                            });
                            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                                hls.loadSource(url.href);
                            });
                            self.video.addEventListener('play', function () {
                                if (self.video.textTracks.length > 0) {
                                    self.video.querySelectorAll('track[src]').forEach(track => {
                                        track.src = track.src;
                                    });
                                }
                                setTimeout(() => {
                                    self.plyr.currentTrack = currentTrack;
                                }, 300);

                            }, { once: true });
                            hls.attachMedia(self.video);
                        }
                    });

                    //activate first subtitle track if CC are disabled
                    currentTrack = self.plyr.currentTrack;
                    if (self.video.textTracks.length > 0 && self.plyr.currentTrack === -1) {
                        setTimeout(() => {
                            self.plyr.currentTrack = currentTrack = 0;
                        }, 200);

                    }
                    //video auto size (won't go out of bounds)
                    window.addEventListener('resize', resize);
                    resize();

                    //set ready
                    self.ready = true;
                    trigger(self.elements.root, "altplayer.ready");
                });
            };

            if (altplayer.ready === true) {
                start();
            } else doc.body.addEventListener('altplayer.resources.ready', start);

            altplayer.loadResources();
        }
    }

    Object.assign(altplayer, {
        stylesapplied: false,
        resloading: false,
        resloaded: 0,
        ready: false,
        loadTheme() {
            if (!this.stylesapplied) {
                this.stylesapplied = true;
                doc.head.appendChild(html2element(`<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">`));
                let css = `
                    .altplayer-container{height:100%;}
                    .altplayer-container .altplayer-video{
                        width: 100%; height:100%; object-fit: fill; display: block;
                    }
                    .altplayer-container .plyr{height: 100%;}
                    .plyr > .plyr__control--overlaid{display: none !important;}
                    
                    .altplayer-container [class*="-button"]{
                        background-color: transparent;border: none; display: inline-block;color:#fff;
                        width:32px;z-index: 10; cursor: pointer;border-radius: 3px;flex-shrink: 0;padding: 7px;transition: all .3s ease;
                    }
                    .altplayer-container [class*="-button"]:not(.no-focus):focus, .altplayer-container [class*="-button"]:not(.no-focus):hover{
                        box-shadow: 0 0 0 5px rgba(26,175,255,.5);background: #1aafff;outline: 0;
                    }
                    .altplayer-container .bigplay-button{
                        position: absolute; top: 50%; left:50%; transform: translate(-50%, -50%);width: 128px;
                        color: rgba(255,255,255,0.8);
                    }
                    .altplayer-container .bigplay-button:focus, .altplayer-container:hover span.bigplay-button{
                        color: rgba(255,255,255,1);
                    }
                    
                    
                    .altplayer-container  .plyr__captions{
                        transform: translate(0, -60px);
                    }
                                       
                    .altplayer-container  .plyr__caption{
                        -webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;user-select: none;
                         font-weight: 600; text-shadow: 5px 5px 5px #000; min-width: 90%; display: inline-block;
                         background: rgba(0,0,0,.25);
                    }
                    
                    .altplayer-container .plyr--captions-enabled .altplayer-video::cue{
                        color: rgba(255,255,255,0); background-color: rgba(255,255,255,0); 
                        display: none;
                    }
                    
                    
                    @media (min-width: 768px) {
                        .altplayer-container  .plyr__caption{font-size: 2rem;}
                    }

                    @media (min-width: 992px) {
                        .altplayer-container  .plyr__caption{font-size: 2.5rem;}
                    }

                `;
                let node = doc.createElement('style');
                node.setAttribute('type', "text/css");
                node.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
                doc.head.appendChild(node);
            }
        },
        loadResources() {
            if (!this.resloading) {
                this.resloading = true;
                const self = this, resources = {
                    css: [
                        "https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap-reboot.min.css",
                        "https://cdn.jsdelivr.net/npm/plyr@latest/dist/plyr.css"],
                    js: [
                        "https://cdn.jsdelivr.net/npm/subtitle@latest/dist/subtitle.bundle.js",
                        "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js",
                        "https://cdn.jsdelivr.net/npm/plyr@latest/dist/plyr.min.js"
                    ]
                };
                resources.css.forEach(src => {
                    loadcss(src);
                });
                resources.js.forEach(src => {
                    loadjs(src, () => {
                        self.resloaded++;
                        if (self.resloaded === resources.js.length) {
                            self.loadTheme();
                            self.ready = true;
                            trigger(doc.body, 'altplayer.resources.ready');
                        }
                    });
                });
            }
        }
    });

    altplayer.prototype = {
        onReady(callback) {
            if (typeof callback === f) {
                const self = this;
                if (!self.ready) {
                    return this.elements.root.addEventListener('altplayer.ready', e => {
                        callback.call(self, self);
                    }, { once: true });
                }
                callback.call(self, self);
            }
        }
    };


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
                if ((id = grabber.video.parentElement.closest('div[id]').id)) {
                    if (typeof videojs !== "undefined" && (vjs = videojs(id)) && typeof vjs.vast !== "undefined") {
                        vjs.vast.disable();
                        console.debug('VideoJS Vast disabled');
                    }
                }

            } catch (e) {
            }
        }
        /**
         * jwVideo Quality Selector
         */

        if (grabber.video.classList.contains('jw-video'), typeof jwplayer !== u) {
            grabber.onReady(function () {
                try {
                    let id = grabber.video.parentElement.closest('div[id]'), jw = jwplayer(id);
                    if (jw.getQualityLevels().length > 0) {
                        let last = localStorage.lastquality || "480", levels = jw.getQualityLevels().map(x => {
                            let res = "480", matches;
                            if ((matches = x.label.match(/([0-9]{3,4})/))) {
                                res = matches[1];
                            }
                            return res;
                        }), selected = levels[jw.getCurrentQuality()];

                        jw.on('levelsChanged', obj => {
                            if (obj.type === "levelsChanged") {
                                last = selected = localStorage.lastquality = levels[obj.currentQuality];
                                grabber.notify('Setting quality to ' + last + 'p');
                            }
                        });
                        grabber.video.addEventListener('loadeddata', () => {
                            if (selected !== last) {
                                let i;
                                if ((i = levels.indexOf(last)) !== -1) {
                                    jw.setCurrentQuality(i);
                                    grabber.video.pause();
                                }
                            }

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
     * App Module
     */

    function module(grabber) {
        mainModule(grabber);
        hostModule(grabber);
    }

    /**
     * Per Host hacks
     */
    if (/(xstreamcdn|fembed|there)/.test(doc.location.host)) {
        find('#resume', x => x.remove(), 5000);
        find('#loading .fakeplaybutton', button => {
            clientSide.setup();
        }, 5000);
    }


    if (/(vidstreaming|dramacool|kshows)/.test(doc.location.host)) {


        let lstmore, css;
        find('[style*="position: static"], [href*="bodelen.com"]', x => x.remove());

        find("#list-server-more", el => {
            lstmore = el;
        }, 5000);
        find('.videocontent > style', style => {
            css = style.innerText;

        }, 5000);


        hostModule = function (grabber) {
            try {
                doc.body.appendChild(lstmore);
                addcss(css + `
                    #list-server-more {
                        z-index: 10000;padding: 14px 0 0 0;top: 50px;
                    }
                    #show-server{background-size: cover;padding: 3px 12px;}                
                    .streamgrabber{background-color: rgba(0, 0, 0, 0.7);}
                `);
                grabber.video.addEventListener('play', () => {
                    if (grabber.videolink() !== undef) lstmore.hidden = true;
                });
                grabber.video.addEventListener('pause', () => {
                    lstmore.hidden = null;
                });
                let lst = doc.querySelector('.list-server-items'), clean = lst.cloneNode(true);
                lst.parentElement.insertBefore(clean, lst);
                lst.parentElement.removeChild(lst);

                const virtualclick = (url) => {
                    if (typeof url === s && url.length > 0) {
                        let a = html2element(`<a href="${url}" target="_blank" style="opacity: 0;" />`);
                        doc.body.appendChild(a);
                        setTimeout(() => {
                            doc.body.removeChild(a);
                        }, 10);
                        a.click();
                    }
                };
                clean.addEventListener('click', e => {
                    let server = e.target.closest('.linkserver');
                    if (server !== null && server.dataset.status !== "0") {
                        virtualclick(server.dataset.video);
                    }
                    clean.style.display = "none";
                });
            } catch (error) {

            }

        };
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

    if (/(gdriveplayer)/.test(doc.location.host)) {
        doc.head.appendChild(html2element(`<link href="https://www.google.com/drive/static/images/drive/favicon.ico" rel="icon">`));
    }

    if (/(fastdrama)/.test(doc.location.host)) {
        doc.head.appendChild(html2element(`<link href="/ico.ico" rel="icon">`));
    }


    if (/(mp4upload)/.test(doc.location.host)) {
        find('.vjs-over', x => x.remove());

        return find('video.vjs-tech[src^="http"]', video => {


            try {
                const vjs = videojs(video.parentElement.closest('div[id]').id);
                const tracks = vjs.options_.tracks, poster = vjs.poster() || "";
                let altvid = html2element(`<video controls src="${video.src}" preload="none" tabindex="-1" class="altplayer-video" poster="${poster}" />`);
                tracks.forEach(obj => {
                    let track = html2element(`<track kind="${obj.kind}" label="${obj.srclang}" srclang="${obj.srclang}" src="${obj.src}" />`);
                    altvid.appendChild(track);
                });
                new cssloader();
                new altplayer(video, altvid);


            } catch (error) {
                new altplayer(video);
            }
        }, 5000);
    }

    if (/(uptostream)/.test(doc.location.host)) {

        doc.head.appendChild(html2element(`<link href="/assets/images/utb.png" rel="icon">`));
        find('[class*="ad-container"]', x => x.remove());


        return find('video.vjs-tech[src^="http"]', video => {

            try {
                // @link https://github.com/kmoskwiak/videojs-resolution-switcher
                const vjs = videojs(video.parentElement.closest('div[id]').id);
                const tracks = vjs.options_.tracks, poster = vjs.poster() || "", videosources = vjs.groupedSrc.type["video/mp4"];
                let newvid = html2element(`<video controls src="" preload="none" tabindex="-1" class="altplayer-video" poster="${poster}" />`);
                let last = localStorage.lastquality || "480", available = [];
                videosources.forEach(obj => {
                    let source = html2element(`<source src="${obj.src}" size="${obj.res}" type="${obj.type}" />`);
                    available.push(obj.res);
                    newvid.appendChild(source);
                });
                tracks.forEach(obj => {
                    let track = html2element(`<track kind="${obj.kind}" label="${obj.srclang}" srclang="${obj.srclang}" src="${obj.src}" />`);
                    newvid.appendChild(track);
                });

                let alt = window.alt = new altplayer(video, newvid);

                alt.onReady(() => {
                    alt.grabber.onReady(() => {
                        if (available.includes(last) && alt.plyr.quality !== last) {
                            alt.plyr.quality = last;
                        }
                    });
                });

            } catch (error) {
                window.alt = new altplayer(video);
            }
        });
    }

    if (/(prettyfast)/.test(doc.location.host)) {
        doc.head.appendChild(html2element(`<link href="https://9anime.to/assets/favicons/favicon.png" rel="icon">`));
    }

    if (/(mcloud|prettyfast)/.test(doc.location.host)) {
        hostModule = function (grabber) {
            //activate Hls playback on altplayer
            if (typeof Hls === f) {
                let src = grabber.video.src, hls = new Hls;
                grabber.video.dataset.src = src;
                grabber.videolink = function () {
                    return src;
                };
                hls.attachMedia(grabber.video);
                hls.loadSource(decodeURIComponent(src));
            }
        };
    }


    /**
     * Start APP
     */
    find('video.vjs-tech, video.jw-video', (video, obs) => {
        obs.stop();
        try {
            //jw-video to plyr
            if (video.classList.contains('jw-video') && typeof jwplayer !== u) {
                const jw = jwplayer(video.parentElement.closest('div[id]').id);
                new cssloader();
                let playlist = jw.getPlaylist();
                if (playlist.length > 0) {
                    playlist = playlist[0];
                    let poster = playlist.image || "";
                    let sources = { list: [], labels: [] }, tracks = [];
                    let plyrvid = html2element(`<video controls src="" preload="none" tabindex="-1" class="altplayer-video" poster="${poster}" />`);
                    playlist.sources.forEach((obj, index) => {
                        if (!sources.list.includes(obj.file)) {
                            sources.list.push(obj.file);
                            sources.labels.push({
                                index: index,
                                src: obj.file,
                                label: `${parseInt(obj.label)}`
                            });

                            plyrvid.appendChild(html2element(`<source src="${obj.file}" size="${parseInt(obj.label)}" type="video/${obj.type}" />`));
                            if (playlist.sources.length === 1) plyrvid.src = obj.file;
                        }
                    });
                    playlist.tracks.forEach((obj, index) => {
                        try {
                            let a = doc.createElement('a');
                            a.href = obj.file;
                            let u = new URL(a.href), url = u.searchParams.get("subtitle");
                            if (url !== "1") {
                                tracks.push(url);
                                if (obj.label.length === 0) {
                                    obj.label = "und";
                                }
                                plyrvid.appendChild(html2element(`<track kind="subtitles" label="${obj.name}" srclang="${obj.label}" src="${u.href}" />`));
                            }
                        } catch (error) {
                        }
                    });

                    Object.defineProperty(plyrvid, "parsedData", {
                        value: { sources: sources, tracks: tracks }
                    });
                    let alt = window.alt = new altplayer(video, plyrvid);
                    alt.onReady(() => {
                        alt.grabber.onReady(() => {
                            //auto quality
                            let last = localStorage.lastquality || "480";
                            sources.labels.forEach(obj => {
                                if (obj.label === last) {
                                    alt.plyr.quality = last;
                                }
                            });
                            setTimeout(() => {
                                if (alt.plyr.quality === undef) alt.plyr.quality = "default";
                            }, 200);

                        });
                    });
                }
                return;
            }

        } catch (error) { }

        const grabber = new StreamGrabber(video, typeof module === f ? module : mainModule);

    }, 15000);


})(document);