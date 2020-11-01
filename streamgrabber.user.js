// ==UserScript==
// @name        Stream Grabber
// @author      daedelus
// @namespace   https://github.com/ngsoft
// @version     1.5b2.7.8
// @description Helps to download streams (videojs, jwvideo based sites)
// @grant       none
// @run-at      document-body
// @compatible  firefox+greasemonkey(3.17)
// @compatible  firefox+tampermonkey
// @compatible  chrome+tampermonkey
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/streamgrabber.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/streamgrabber.user.js
// @icon        https://www.tampermonkey.net/favicon.ico
// @require     https://cdn.jsdelivr.net/gh/ngsoft/userscripts@1.2.5/dist/gmutils.min.js
//
// @include     *://onlystream.tv/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @include     *://*xstreamcdn.com/v/*
// @include     *://*gcloud.live/v/*
// @include     *://*fembed.com/v/*
// @include     *://*fcdn.stream/v/*
// @include     *://*feurl.*/v/*
// @include     *://*there.to/v/*
// @include     *://*vidstreaming.io/*
// @include     *://*vidcloud*/*
// @include     *://*gdriveplayer.*/*
// @include     *://kurinaofficial.com/*
// @include     *://*fastdrama.*/embed/*
// @include     *://*prettyfast.*/e/*
// @include     *://mcloud.*/embed/*
// @include     *://*mystream.*/*
// @include     *://embed.dramacool*.*/*
// @include     *://embed.watchasian*.*/*
// @include     *://kshows.to/*
//
// @include     *://letv.com-t-letv.com/*
// @include     *://jx.tvzb.cc/*
// @include     *://azvideo.net/embed/*
// @include     *://*chipstream.xyz/*
// @include     *://*k-vid.*/*
// @include     *://player.drama3s.*/*
//
// @include     *://vidoza.net/embed-*.html
// @include     *://*novelplanet.*/v/*
// @include     *://*gaobook.*/v/*
// @include     *://*streamtape.*/e/*
// @include     *://*streamtape.*/v/*
//
// @include     *://hls.hdv*/imdb/*
// ==/UserScript==


((doc, window, undef) => {

    /* jshint expr: true */
    /* jshint -W018 */
    /* jshint -W083 */



    //=======================================   Deps   =======================================================


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



    function addicon(src) {
        if ((src = getURL(src))) doc.head.appendChild(html2element(`<link href="${src}" rel="icon" />`));
    }



    function virtualclick(url) {
        if (typeof url === s && url.length > 0) {
            let a = html2element(`<a href="${url}" target="_blank" style="opacity: 0;" />`);
            doc.body.appendChild(a);
            setTimeout(() => {
                doc.body.removeChild(a);
            }, 10);
            a.click();
        }
    }



    function favicon(img) {
        if (img instanceof Element) {
            let src;
            doc.querySelectorAll('[rel*="icon"][href]').forEach(icon => {
                src = getURL(icon.href);
            });
            img.onerror = (e) => {
                img.remove();
            };
            img.src = src || "/favicon.ico";
        }
    }


    //======================================= Stream Grabber ====================================

    /**
     * Module support for StreamGrabber
     */
    class StreamGrabberModule {

        constructor(grabber) {
            if (!(grabber instanceof StreamGrabber)) {
                throw new Error('Grabber not an instance of StreamGrabber');
            }

            if (typeof this.module !== f) {
                throw new Error('Invalid Module Supplied');
            }
            this.module(grabber);
        }

    }




    /**
     * StreamGrabber Toolbar
     */
    class StreamGrabber {


        onReady(callback) {
            const self = this;
            if (typeof callback === f) {
                if (self.ready !== true) {
                    self.one('streamgrabber.ready', () => {
                        callback.call(self, self);
                    });
                }
                else callback.call(self, self);
            }
            return self;
        }


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
                if (src === doc.location.href) src = "";
            }
            return src.length > 0 ? src : undef;
        }


        show() {
            this.elements.toolbar.classList.remove('hidden');
        }


        hide() {
            this.elements.toolbar.classList.add('hidden');
        }


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
        }

        start() {
            if (this.started !== true) {

                this.started = true;
                const self = this, video = self.video;

                let container = video.parentElement.closest('div[id]');
                if (container === null) {
                    container = video.parentElement;
                }
                self.container = container;
                container.appendChild(self.elements.toolbar);
                container.appendChild(self.elements.notify);

                self.elements.buttons.download.href = self.videolink();
                self.on('click', e => {
                    e.stopPropagation();
                    let target = e.target, btn;
                    if ((btn = e.target.closest('[class*="-bt"]')) !== null) {
                        Object.keys(self.elements.buttons).forEach(button => {
                            if (self.elements.buttons[button] === btn && typeof self.events.buttons.click[button] === f) {
                                self.events.buttons.click[button].call(self.elements.buttons[button], e);
                            }
                        });
                        if (typeof btn.dataset.notify === s) {
                            self.notify(btn.dataset.notify);
                        }
                    }
                    return false;
                });


                if (/\.m3u8/.test(self.videolink())) self.elements.buttons.code.classList.remove('hidden');

                self.ready = true;
                self.trigger('streamgrabber.ready');
                if (video.paused) self.show();
                console.debug(scriptname, "started");
            }
        }


        constructor(video, module) {

            if (video instanceof Element && typeof video.StreamGrabber === u) {

                const self = this, template = {
                    toolbar: html2element(`<div class="streamgrabber" oncontextmenu="return false;" />`),
                    notify: html2element(`<div class="streamgrabber-notify" />`),
                    iconnotify: `<span class="notify-icn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="square"><path fill="currentColor" d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 7.1 5.8 12 12 12 2.4 0 4.9-.7 7.1-2.4L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zm16 352c0 8.8-7.2 16-16 16H288l-12.8 9.6L208 428v-60H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16h384c8.8 0 16 7.2 16 16v288zM332.7 130.4c-3.8-3.9-10.1-3.9-14-.1L231.4 217l-37.9-38.2c-3.8-3.9-10.1-3.9-14-.1l-23.4 23.2c-3.9 3.8-3.9 10.1-.1 14l68.1 68.6c3.8 3.9 10.1 3.9 14 .1l117.8-116.8c3.9-3.8 3.9-10.1.1-14l-23.3-23.4z"></path></svg></span>`,
                    buttons: {
                        clipboard: html2element(`<a href="#" class="clipboard-bt right" title="Copy to Clipboard" data-notify="Link copied to clipboard."><span class="bt-desc">Copy to Clipboard</span><span class="clipboard-icn"></span></a>`),
                        subtitles: html2element(`<a href="" target="_blank" class="subtitles-bt right hidden" title="Download Subtitles"><span class="bt-desc">Download Subtitles</span><span class="subtitles-icn"></span></a>`),
                        newtab: html2element(`<a href="" class="newtab-bt left" title="Open in a New Tab" target="_blank"><span class="newtab-icn"><img src"" /></span><span class="bt-desc">Open in a New Tab</span></a>`),
                        download: html2element(`<a href="" class="download-bt center" target="_blank" title="Download Link"><span class="download-icn"></span><span class="bt-desc">VIDEO LINK</span></a>`),
                        code: html2element(`<a href="" data-notify="Command copied to clipboard." class="code-bt right" title="Get FFMPEG Command"><span class="bt-desc">Get FFMPEG command.</span><span class="code-icn"></span></a>`)
                    },
                    icons: {
                        clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 193.941l-51.882-51.882A48 48 0 0 0 348.118 128H320V80c0-26.51-21.49-48-48-48h-61.414C201.582 13.098 182.294 0 160 0s-41.582 13.098-50.586 32H48C21.49 32 0 53.49 0 80v288c0 26.51 21.49 48 48 48h80v48c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V227.882a48 48 0 0 0-14.059-33.941zm-84.066-16.184l48.368 48.368a6 6 0 0 1 1.757 4.243V240h-64v-64h9.632a6 6 0 0 1 4.243 1.757zM160 38c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm-32 138v192H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h55.414c9.004 18.902 28.292 32 50.586 32s41.582-13.098 50.586-32H266a6 6 0 0 1 6 6v42h-96c-26.51 0-48 21.49-48 48zm266 288H182a6 6 0 0 1-6-6V182a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v170a6 6 0 0 1-6 6z"></path></svg>`,
                        download: `<svg class="square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M28 16h-5l-7 7-7-7h-5l-4 8v2h32v-2l-4-8zM0 28h32v2h-32v-2zM18 10v-8h-4v8h-7l9 9 9-9h-7z"></path></svg>`,
                        newtab: `<svg class= "square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" ><path fill="currentColor" d="M30.662 5.003c-4.488-0.645-9.448-1.003-14.662-1.003s-10.174 0.358-14.662 1.003c-0.86 3.366-1.338 7.086-1.338 10.997s0.477 7.63 1.338 10.997c4.489 0.645 9.448 1.003 14.662 1.003s10.174-0.358 14.662-1.003c0.86-3.366 1.338-7.086 1.338-10.997s-0.477-7.63-1.338-10.997zM12 22v-12l10 6-10 6z"></path></svg>`,
                        subtitles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="square"><path fill="currentColor" d="M464 64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48zm-6 336H54c-3.3 0-6-2.7-6-6V118c0-3.3 2.7-6 6-6h404c3.3 0 6 2.7 6 6v276c0 3.3-2.7 6-6 6zm-211.1-85.7c1.7 2.4 1.5 5.6-.5 7.7-53.6 56.8-172.8 32.1-172.8-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7l-17.5 30.5c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2 0 48 51 70.5 92.2 32.6 2.8-2.5 7.1-2.1 9.2.9l19.6 27.7zm190.4 0c1.7 2.4 1.5 5.6-.5 7.7-53.6 56.9-172.8 32.1-172.8-67.9 0-97.3 121.7-119.5 172.5-70.1 2.1 2 2.5 3.2 1 5.7L420 220.2c-1.9 3.1-6.2 4-9.1 1.7-40.8-32-94.6-14.9-94.6 31.2 0 48 51 70.5 92.2 32.6 2.8-2.5 7.1-2.1 9.2.9l19.6 27.7z"/></svg>`,
                        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M234.8 511.7L196 500.4c-4.2-1.2-6.7-5.7-5.5-9.9L331.3 5.8c1.2-4.2 5.7-6.7 9.9-5.5L380 11.6c4.2 1.2 6.7 5.7 5.5 9.9L244.7 506.2c-1.2 4.3-5.6 6.7-9.9 5.5zm-83.2-121.1l27.2-29c3.1-3.3 2.8-8.5-.5-11.5L72.2 256l106.1-94.1c3.4-3 3.6-8.2.5-11.5l-27.2-29c-3-3.2-8.1-3.4-11.3-.4L2.5 250.2c-3.4 3.2-3.4 8.5 0 11.7L140.3 391c3.2 3 8.2 2.8 11.3-.4zm284.1.4l137.7-129.1c3.4-3.2 3.4-8.5 0-11.7L435.7 121c-3.2-3-8.3-2.9-11.3.4l-27.2 29c-3.1 3.3-2.8 8.5.5 11.5L503.8 256l-106.1 94.1c-3.4 3-3.6 8.2-.5 11.5l27.2 29c3.1 3.2 8.1 3.4 11.3.4z"></path></svg>`
                    }
                };

                Object.assign(self, {
                    started: false,
                    ready: false,
                    events: {
                        buttons: {
                            click: {
                                download(e) {
                                    let link = self.videolink();
                                    if (link === undef) e.preventDefault();
                                    else self.elements.buttons.download.href = link;
                                },
                                clipboard(e) {
                                    e.preventDefault();
                                    let link = self.videolink();
                                    if (link !== undef) {
                                        /**
                                         * jdtitle plugin
                                         * jDownloader Rule (on top of the rules)
                                         * set source URL to contains (regex checked) : jdtitle=(.*?)(&.*?)?$
                                         * filename to : <jd:source:1>
                                         */
                                        let searchParams = new URLSearchParams(doc.location.search);
                                        if (searchParams.has('jdtitle')) {
                                            let a = doc.createElement("a"), url;
                                            a.href = link;
                                            url = new URL(a.href);
                                            url.searchParams.set('jdtitle', searchParams.get('jdtitle'));
                                            link = url.href;
                                        }
                                        copyToClipboard(link);
                                    }
                                },
                                subtitles(e) {
                                    e.preventDefault();
                                    if (self.elements.buttons.subtitles.href === doc.location.href) return;
                                    let
                                            src = new URL(self.elements.buttons.subtitles.href),
                                            pos = src.pathname.lastIndexOf('/') + 1,
                                            filename = src.pathname.substr(pos),
                                            convert = !(/\.srt/.test(src.pathname));

                                    if (filename.lastIndexOf('.') !== -1) filename = filename.substr(0, filename.lastIndexOf('.'));
                                    filename += ".srt";

                                    fetch(src.href, {cache: "default", redirect: 'follow'})
                                            .then(r => {
                                                if (r.status === 200) {
                                                    r.text().then(text => {
                                                        let parsed, srt;
                                                        if (Array.isArray(parsed = Subtitle.parse(text)) && parsed.length > 0) {
                                                            srt = Subtitle.stringify(parsed);
                                                            Text2File(srt, filename);
                                                        }
                                                    });
                                                }
                                            }).catch(ex => console.error(ex));



                                },
                                code(e) {
                                    e.preventDefault();
                                    let u = new URL(self.videolink()), split = u.pathname.split('/'),
                                            basename = split.pop();
                                    if (basename.indexOf('.') === -1) basename += ".mp4";


                                    let title = basename.replace(/m3u8$/i, 'mp4');
                                    if (doc.location.search.length > 0) {
                                        let ttitle = new URLSearchParams(doc.location.search);
                                        if (ttitle.get('jdtitle') !== null) title = ttitle.get('jdtitle');
                                    }
                                    
                                    let text = "echo " + title + "\n";
                                    text += `ffmpeg -v quiet -stats -headers "Referer: ${doc.location.href}" -y -i "${u.href}" -c copy "${title}"` + "\n";
                                    copyToClipboard(text);
                                }
                            }
                        }
                    },
                    elements: {
                        root: null,
                        toolbar: template.toolbar,
                        notify: template.notify,
                        buttons: template.buttons,
                        iconnotify: html2element(template.iconnotify)
                    },
                    video: video,
                    container: null
                });

                /**
                 * Build toolbar
                 */
                Object.keys(template.icons).forEach(icn => {
                    let el = html2element(template.icons[icn]);
                    if (this.elements.buttons[icn]) this.elements.buttons[icn].querySelector('[class*="-icn"]').appendChild(el);
                });
                favicon(this.elements.buttons.newtab.querySelector('.newtab-icn img'));
                this.elements.toolbar.appendChild(this.elements.buttons.newtab);
                this.elements.toolbar.appendChild(this.elements.buttons.download);
                this.elements.toolbar.appendChild(this.elements.buttons.code);
                this.elements.toolbar.appendChild(this.elements.buttons.clipboard);
                this.elements.toolbar.appendChild(this.elements.buttons.subtitles);
                if (/mobile/i.test(navigator.userAgent)) {
                    this.elements.toolbar.classList.add('mobile');
                }
                this.hide();
                /**
                 * Add Events to object
                 */
                const evts = new Events(self.elements.toolbar, self);
                /**
                 * Attach grabber to video
                 */
                Object.defineProperty(video, 'StreamGrabber', {
                    value: self, configurable: true
                });
                /**
                 * Media Events
                 */
                self.mediaevents = Events(video).on('play pause loadeddata', e => {
                    self.hide();
                    if (self.videolink() !== undef) {
                        if (!self.started) self.start();
                        self.elements.buttons.download.href = self.videolink();
                        setTimeout(() => {
                            if (video.paused === true) self.show();
                        }, 200);
                    }
                });
                this.on('VideoNodeRemoved', e => self.hide());
                Events(video.textTracks).on('addtrack', e => {
                    let track = this.video.querySelector('track');
                    if (track !== null) {
                        let src = track.dataset.src || track.src;
                        if (typeof src === s && src.length > 0) {
                            self.elements.buttons.subtitles.href = src;
                            self.elements.buttons.subtitles.classList.remove('hidden');
                        }
                    }
                });

                /**
                 * Check if video Element is removed
                 */
                let obs = new MutationObserver(mutations => {
                    mutations.forEach(({ removedNodes }) => {
                        removedNodes.forEach(element => {
                            if (element instanceof Element && element === video) {
                                self.trigger('VideoNodeRemoved');
                            }
                        });
                    });
                });
                obs.observe(video.parentElement, { childList: true, subtree: true });
                /**
                 * Detects if a link is available
                 */
                new Timer(timer => {
                    if (self.videolink() !== undef) {
                        timer.stop();
                        if (!self.started) self.start();
                    }
                }, 10, 15000);

                /**
                 * Loads Style
                 */
                StreamGrabber.loadTheme();

                /**
                 * Load Module
                 */
                if (Object.prototype.isPrototypeOf.call(StreamGrabberModule, module)) {
                    new module(self);
                }
            }
        }



        static loadTheme() {
            if (this.stylesapplied !== true) {
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
                    .streamgrabber .subtitles-icn svg.square{width: 100%; height:100%;}
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
                 * Visually hidden + more
                 */
                css += `
                    [disabled], .disabled, .streamgrabber svg{pointer-events: none;}
                    .no-select, .streamgrabber > *, .streamgrabber-notify > *{-webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;user-select: none;}
                    .hidden, .hidden *, .streamgrabber .newtab-icn img + svg,
                    .streamgrabber [class*="-bt"]:not(:hover):not(.download-bt) .bt-desc, .streamgrabber.mobile .bt-desc{
                        position: fixed !important; right: auto !important; bottom: auto !important; top:-100% !important; left: -100% !important;
                        height: 1px !important; width: 1px !important; opacity: 0 !important;max-height: 1px !important; max-width: 1px !important;
                        display: inline !important;z-index: -1 !important;
                    }
                    video{object-fit: fill !important;}
                `;
                addstyle(css);
            }

        }












    }

    //======================================= Alt Video Player =====================================


    class altvideoSource {

        get selected() {
            return this.element.selected === true;
        }

        set selected(selected) {
            this.element.selected = selected === true ? true : null;
            if (this.__altvideo instanceof altvideo) {
                const self = this;
                this.__altvideo.sources.forEach(source => {
                    if (source !== self) source.__element.selected = null;
                });
                this.__altvideo.src = this.src;
            }
        }

        get src() {
            return getURL(this.element.getAttribute('src'));
        }
        set src(src) {
            if (typeof src === s) {
                if ((src = getURL(src)) && src !== doc.location.href) this.element.setAttribute('src', src);
            }
        }
        get size() {
            return this.element.getAttribute('size');
        }
        set size(size) {
            size = parseInt(size);
            if (isNaN(size)) size = "default";
            this.element.setAttribute('size', size);
        }
        get type() {
            return this.element.getAttribute('type');
        }
        set type(type) {
            let supported = ["webm", "mp4", "ogg", "hls"];
            if (typeof type === s) {
                type = type.toLowerCase();
                if (/^video\//i.test(type)) {
                    this.element.setAttribute('type', type);
                } else if (supported.includes(type.toLowerCase())) {
                    this.element.setAttribute('type', 'video/' + type.toLowerCase());
                }
            }
        }
        get element() {
            return this.__element;
        }

        constructor(src) {
            this.__element = html2element(`<source src="" size="default" />`);
            if (typeof src === s && src.length > 0) this.src = src;
        }
    }
    class altvideoCaption {

        get src() {
            return getURL(this.element.getAttribute('src'));
        }
        set src(src) {
            if (typeof src === s) {
                if ((src = getURL(src)) && src !== doc.location.href) this.element.setAttribute('src', src);
            }
        }

        get label() {
            return this.element.getAttribute('label');
        }
        //label can be anything
        set label(label) {
            if (typeof label === s && s.length > 0) {
                this.element.setAttribute('label', label);
            }
        }

        get lang() {
            return this.element.getAttribute('lang');
        }

        set lang(langcode) {
            if (typeof langcode === s) {
                let entry = isoCode(langcode);
                this.label = entry.lang;
                this.element.setAttribute('srclang', entry.codes[0]);
            }
        }

        get element() {
            return this.__element;
        }

        constructor(src, lang = "") {
            this.__element = html2element(`<track kind="subtitles" label="Caption" srclang="" src="" />`);
            Events(this.__element).on('load error', e => {
                let target = e.target, src = target.src;

                if (/^blob/.test(src)) return;
                if (target.data('loading') === true) return;
                target.data('loading', true);


                if (e.type === "error") src = "https://cors-anywhere.herokuapp.com/" + src;

                fetch(src, {cache: "default", redirect: 'follow'})
                        .then(r => {
                            if (r.status === 200) {
                                r.text().then(text => {
                                    let parsed, vtt, blob, virtualurl;
                                    if (Array.isArray(parsed = Subtitle.parse(text)) && parsed.length > 0) {
                                        vtt = Subtitle.stringifyVtt(parsed);
                                        if (typeof vtt === s && vtt.length > 0) {
                                            blob = new Blob([vtt], {type: "text/vtt"});
                                            e.target.dataset.src = e.target.src;
                                            virtualurl = URL.createObjectURL(blob);
                                            e.target.src = virtualurl;
                                            target.data('loading', null);
                                        }
                                    }
                                });
                            }
                        }).catch(ex => console.error(ex));
            });
            if (typeof src === s && src.length > 0) this.src = src;
            this.lang = lang;
        }

    }
    /**
     * Video Element Builder
     */
    class altvideo {

        get src() {
            return getURL(this.element.getAttribute('src'));
        }
        set src(src) {
            if (typeof src === s) {
                if ((src = getURL(src)) && src !== doc.location.href) this.element.setAttribute('src', src);
            }
        }

        get poster() {
            return getURL(this.element.getAttribute('poster'));
        }

        set poster(src) {
            if (typeof src === s) {
                if ((src = getURL(src)) && src !== doc.location.href) this.element.poster = src;
                //this.element.setAttribute('poster', src);
            }
        }


        get element() {
            return this.__element;
        }

        addSource(src, size = "default", type = "mp4") {
            if (typeof src === s) {
                let source = new altvideoSource(src);
                source.size = size;
                source.type = type;
                this.sources.push(source);
                this.element.appendChild(source.element);
                source.__altvideo = this;
                return source;
            }
        }
        addCaption(src, label, lang) {
            if (typeof src === s) {
                let track = new altvideoCaption(src, lang);
                if (typeof label === s) track.label = label;
                if (typeof lang === s) track.lang = lang;
                track.element.id = "track" + this.captions.length;
                this.captions.push(track);
                this.element.appendChild(track.element);
                track.__altvideo === this;
                return track;
            }
        }

        playpause() {
            if (this.element.paused === true) return this.play();
            this.pause();
        }
        play() {
            if (this.element.paused === true) this.element.play();
        }
        pause() {
            if (this.element.paused === false) this.element.pause();
        }
        stop() {
            this.pause();
            this.element.currentTime = 0;
        }

        constructor(video) {
            const self = this;
            Object.assign(self, {
                __element: html2element(`<video controls src="" crossorigin="" preload="none" tabindex="-1" class="altvideo" />`),
                sources: [],
                captions: []
            });
            const evts = new Events(self.element, self);

            //trackevents does not bubbles through video, so we duplicate the event
            ["addtrack", "removetrack", "change"].forEach(type => {
                self.element.textTracks.addEventListener(type, e => {
                    const event = new Event(type, { bubbles: true, cancelable: true });
                    Object.assign(event, {
                        track: e.track || e.target,
                        data: {}
                    });
                    self.element.dispatchEvent(event);
                });
            });
            if (video instanceof Element && video.tagName === "VIDEO") {
                video.querySelectorAll('source[src]').forEach(source => {
                    let obj = self.addSource(source.src), size = source.getAttribute('size'), type = source.getAttribute('type');
                    if (typeof size === s) obj.size = size;
                    if (typeof type === s) obj.type = type;
                });
                video.querySelectorAll('track[kind="captions"][src], track[kind="subtitles"][src]').forEach(track => {
                    let obj = self.addCaption(track.src), lang = track.getAttribute('srclang'), label = track.getAttribute('label');
                    if (typeof label === s) obj.label = label;
                    if (typeof lang === s) obj.lang = lang;
                });
                if (video.querySelector('source[src]') === null) {
                    self.addSource(video.src);
                    self.sources[0].selected = true;
                }
                let poster;
                if ((poster = video.getAttribute('poster'))) self.poster = poster;
            }
        }
    }

    class AltPlayerModule {

        constructor(altplayer) {
            if (!(altplayer instanceof AltPlayer)) {
                throw new Error('AltplayerModule Invalid Argument');
            }

            if (typeof this.module !== f) {
                throw new Error('AltplayerModule Invalid Module Supplied');
            }
            this.module(altplayer);
        }
    }



    /**
     * Alternative Player
     */
    class AltPlayer {
        get video() {
            if (this.altvideo instanceof altvideo) return this.altvideo.element;
        }

        onReady(callback) {
            const self = this;
            if (typeof callback === f) {
                if (self.ready !== true) {
                    return self.one('altplayer.ready', () => {
                        callback.call(self, self);
                    });
                }
                callback.call(self, self);
            }
            return self;
        }

        constructor(module) {

            if (typeof module !== f) {
                throw new Error('AltPlayer Invalid Argument Supplied.');
            }

            /*if (!Object.prototype.isPrototypeOf.call(AltPlayerModule, module)) {

            }*/

            const plyropts = {
                captions: {active: false, language: 'auto', update: true},
                settings: ['captions', 'quality'],
                keyboard: { focused: true, global: true }
            }, self = this;

            Object.assign(self, {
                //video: null,
                altvideo: new altvideo(),
                grabber: null,
                plyr: null,
                plyropts: plyropts,
                ready: false,
                elements: {
                    root: html2element(`<div class="altplayer" />`),
                    buttons: {

                    }
                }
            });

            /**
             * Fit video to screen/iframe size, works also fullscreen
             */
            function resizevideo() {
                self.plyr.elements.wrapper.classList.remove('.plyr__video-wrapper--fixed-ratio');
                //self.plyr.elements.container.style.width = `${doc.documentElement.clientWidth}px`;
                self.plyr.elements.container.style.height = `${doc.documentElement.clientHeight}px`;
                //self.video.style.width = `${doc.documentElement.clientWidth}px`;
                self.video.style.height = `${doc.documentElement.clientHeight}px`;
            }


            /**
             * add subs #sub=
             */
            function parseHash() {
                const hash = doc.location.hash.substr(1);
                if (hash.length > 0) {

                    try {
                        let args = new URLSearchParams(hash);
                        let sub = args.get('sub');
                        if (typeof sub === s && sub.length > 0) {
                            self.altvideo.addCaption(sub);
                        }
                    } catch (error) {

                    }
                }
            }

            /**
             * Add Events
             */
            new Events(self.elements.root, self);

            /**
             * Loads Resources
             */
            AltPlayer.loadResources(() => {
                if (Object.prototype.isPrototypeOf.call(AltPlayerModule, module)) {
                    self.module = new module(self);
                } else module(self);
                parseHash();
                self.elements.root.insertBefore(self.video, self.elements.root.firstChild);
                doc.body.innerHTML = "";
                doc.body.insertBefore(self.elements.root, doc.body.firstChild);
                //loads StreamGrabber
                self.grabber = new StreamGrabber(self.video, typeof HostModule === f ? HostModule : MainModule);

                self.altvideo.on('languagechange', e => {
                    let
                            btn = self.grabber.elements.buttons.subtitles,
                            captions = self.altvideo.captions,
                            detail = e.detail.plyr.captions,
                            id = detail.currentTrack;
                    btn.classList.add('hidden');
                    if (id !== -1) {
                        btn.classList.remove('hidden');
                        btn.href = captions[id].element.data('src') || captions[id].element.src;
                    }
                });

                //loads Plyr
                self.plyr = new Plyr(self.video, self.plyropts);

                self.plyr.on('ready', e => {
                    self.plyr.elements.container.id = "altplayer" + Math.floor(+new Date() / 1000);


                    self.altvideo.on('click', e => self.altvideo.playpause());

                    //quality change (save to localStorage)
                    let lastq = localStorage.lastquality || "480";
                    self.plyr.on('qualitychange', function (e) {
                        localStorage.lastquality = lastq = e.detail.quality;
                        self.grabber.notify('Setting quality to ' + e.detail.quality + "p");
                    });
                    self.altvideo.sources.forEach(source => {
                        if (source.size === lastq) {
                            self.plyr.quality = lastq;
                        }
                    });
                    setTimeout(() => {
                        if (self.plyr.quality === undef) {
                            self.plyr.quality = "default";
                        }
                    }, 600);


                    //hls
                    self.plyr.on('error', function (e) {
                        let url;
                        if ((url = self.altvideo.src) && /\.m3u8/.test(url)) {
                            const hls = self.hls = new Hls();
                            hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
                                self.video.dataset.src = url;
                                self.grabber.videolink = () => {
                                    return self.video.dataset.src;
                                };
                                //reload tracks
                                let ct = self.plyr.captions.currentTrack;
                                self.plyr.captions.currentTrack = -1;
                                if(ct !== -1){
                                    let track = self.altvideo.captions[ct].element, src = track.data('src') || track.src;
                                    track.src = src;
                                    self.plyr.captions.currentTrack = ct;
                                }


                                self.altvideo.play();
                            });
                            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                                hls.loadSource(url);
                            });
                            hls.attachMedia(self.video);
                        }
                    });

                    //video auto size
                    window.addEventListener('resize', resizevideo);
                    resizevideo();
                    //set ready
                    self.ready = true;
                    self.trigger('altplayer.ready');
                });

            });


        }


        static loadResources(callback) {
            const self = this;
            if (self.loading !== true) {
                self.loading = true;
                self.ready = false;
                [
                    "https://cdn.jsdelivr.net/npm/bootstrap@latest/dist/css/bootstrap-reboot.min.css",
                    "https://cdn.jsdelivr.net/npm/plyr@latest/dist/plyr.css"
                ].forEach(src => loadcss(src));
                self.loadTheme();
                let jscount = 0;
                [
                    "https://cdn.jsdelivr.net/npm/subtitle@latest/dist/subtitle.bundle.min.js",
                    "https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js",
                    "https://cdn.jsdelivr.net/npm/plyr@latest/dist/plyr.min.js"
                ].forEach((src, index, array) => {
                    loadjs(src, () => {
                        jscount++;
                        if (jscount === array.length) {
                            self.ready = true;
                            trigger(doc.body, "altplayer.resources");
                        }
                    });
                });

            }
            if (typeof callback === f) {
                if (self.ready !== true) {
                    doc.body.addEventListener("altplayer.resources", callback, { once: true });
                } else callback();
            }
        }

        static loadTheme() {
            if (this.stylesapplied !== true) {
                this.stylesapplied = true;
                doc.head.appendChild(html2element(`<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">`));
                let css = `
                    .altplayer{height:100%;}
                    .altplayer .altvideo{width: 100%; height:100%; object-fit: fill; display: block;}
                    .altplayer .plyr{height: 100%;}
                    .altplayer .plyr > .plyr__control--overlaid{display: none !important;}
                    .altplayer [class*="-button"]{
                        background-color: transparent;border: none; display: inline-block;color:#fff;
                        width:32px;z-index: 10; cursor: pointer;border-radius: 3px;flex-shrink: 0;padding: 7px;transition: all .3s ease;
                    }
                    .altplayer [class*="-button"] svg{pointer-events: none;}
                    .altplayer [class*="-button"]:not(.no-focus):focus, .altplayer-container [class*="-button"]:not(.no-focus):hover{
                        box-shadow: 0 0 0 5px rgba(26,175,255,.5);background: #1aafff;outline: 0;
                    }
                    .altplayer .bigplay-button{
                        position: absolute; top: 50%; left:50%; transform: translate(-50%, -50%);width: 128px;
                        color: rgba(255,255,255,0.8);
                    }
                    .altplayer .bigplay-button:focus, .altplayer:hover span.bigplay-button{
                        color: rgba(255,255,255,1);
                    }
                    .altplayer  .plyr__captions{
                        transform: translate(0, -60px);
                    }
                    .altplayer  .plyr__caption{
                        -webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;user-select: none;
                         font-weight: 600; text-shadow: 5px 5px 5px #000; min-width: 90%; display: inline-block;
                         background: rgba(0,0,0,.25);
                    }
                    .altplayer .plyr--captions-enabled .altvideo::cue{
                        color: rgba(255,255,255,0); background-color: rgba(255,255,255,0);
                        display: none;
                    }
                    @media (min-width: 768px) {
                        .altplayer  .plyr__caption{font-size: 2rem;}
                    }
                    @media (min-width: 992px) {
                        .altplayer  .plyr__caption{font-size: 2.5rem;}
                    }
                `;
                addstyle(css);
            }
        }

    }

    function getJWSources() {
        const video = doc.querySelector('video.jw-video');
        if (typeof jwplayer === f && video instanceof Element) {
            const jw = jwplayer(video.parentElement.closest('div[id]').id);
            const playlist = jw.getPlaylist()[0];
            return playlist.sources;
        }
    }


    function JWPlayerPlaylistToAltVideo(playlist){
        const altvid = new altvideo();
        if (isPlainObject(playlist) && playlist.sources) {
            let poster = playlist.image || "";
            if (poster.length > 0) poster = getURL(poster);
            
            altvid.poster = poster;
            playlist.sources.forEach(source => {
                altvid.addSource(source.file, source.label, source.type);
            });
            playlist.tracks.forEach(track => {
                altvid.addCaption(track.file, track.name, track.label);
            });
            if (altvid.sources.length === 1) {
                altvid.sources[0].selected = true;
            }
        }
        return altvid;

    }

    function JWPlayerToAltVideo(self) {
        const video = doc.querySelector('video.jw-video');
        if (typeof jwplayer === f && video instanceof Element) {
            try {
                let jw = jwplayer(video.parentElement.closest('div[id]').id);
                self.altvideo = JWPlayerPlaylistToAltVideo(jw.getPlaylist()[0]);
                if (/^http/.test(video.src)) self.altvideo.src = video.src; //fallback
            } catch (error) {
                self.altvideo = new altvideo(video);
            }
        }

    }



    //======================================= Modules and Mods ==================================

    class MainModule extends StreamGrabberModule {
        module(self) {
            new KodiRPC(self);

            if (typeof this.hostmodule === f) {
                this.hostmodule(self);
            }
        }
    }

    /**
     * Kodi RPC Module
     * Send event to Kodi Userscript
     */
    class KodiRPC extends StreamGrabberModule {
        module(self) {
            const icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhUExURQAAAAAAAAAAAAAAAFq/5////wAAAAAAAAEGBwABAQEFBgIGCAIGCBNDVwIFBwAAAA83RxA3RydASwAAAAQGBwUHCDQ0NFq/51q/51W95lq/5yubxyuYxFa+5v///yyeyyycyFq/52jE6f3//y6j0i6j0i6k0yaHrjaRteLl5t/i4+Pk5EC14zKt3j+041q/5zCt3jOv4DGv4Vq/5yqWwjCt3jGv4TSw4Tedxjeexjqx4Duz4j6040O240O25I7T7pPV75zY8JzY8ZzZ8aHQ477c6L/d6cDd6cDe6cLg6////zRLWWYAAAA0dFJOUwADBAYQEB0fIScnJygpKjAyMjIzR0dOj5KVn6Kor6+wscHBw8nKzdHV1djY5u/v7/L0/v77n8h1AAABGUlEQVQ4y5XS2VbCQAyA4VTAFcUFcUfqMi51F6K44YZo3v+BnLSdJiNtz7G339/TZDoA/3qqa5e362W+83KHz2GJP6F9HsNyLywyLyhq4rlFra0c8XV/zEn7gMgvqm0i3+lnz5uPdMD+ff8Q6vl1kHhPJuX9VOA82yXeXwJxV2zwflnAPkrdFps2OEMV+I54YYNrFbDTpzie22BXgtiJ3iTYssG0cQH711AXB/M85axJgtj7XS7eU18K4kXnDAeJ9zAuPrQD1E3y8VGf53OFuC0iSt/HrNAO0Iz0/lycLAfeD29G+ny6w9PWxJ8rs3qszgePWpWxS7dgxA8XKznXtm7Eg9yL74oid0WxA8x0bq62SxxgaqUx6fsvOX95dVWRzekAAAAASUVORK5CYII=`;
            const res = {
                button: html2element(`<a class="kodi-bt right hidden" href="#" title="Send link to Kodi"><span class="bt-desc">Send link to Kodi</span><span class="kodi-icn"><img src="${icon}" /></span></a>`),
                iconnotify: html2element(`<span class="kodi-icn"><img src="${icon}" /></span>`),
                iconsuccess: html2element(`<span class="success-icn" style="color: rgb(40, 167, 69);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="square"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z"></path></svg></span>`),
                iconerror: html2element(`<span class="error-icn" style="color: rgb(220, 53, 69);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.054-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.952 83.154 0l239.94 416.028zm-27.658 15.991l-240-416c-6.16-10.678-21.583-10.634-27.718 0l-240 416C27.983 466.678 35.731 480 48 480h480c12.323 0 19.99-13.369 13.859-23.996zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28zm-11.49-212h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg></span>`)
            };

            const events = {
                contextmenu(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.trigger('kodirpc.settings');
                }
            };

            self.onReady(() => {
                self.elements.toolbar.appendChild(res.button);
                self.elements.buttons.kodi = res.button;
                self.events.buttons.click.kodi = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let link = self.videolink();
                    if (link.length > 0) {
                        self.notify('Video sent to Kodi', res.iconnotify);
                        self.trigger('kodirpc.send', {
                            link: self.videolink(),
                            success() {
                                self.notify('Kodi Success', res.iconsuccess);
                            },
                            error() {
                                self.notify('Kodi Error', res.iconerror);
                            }
                        });
                    }
                };
                Object.keys(events).forEach(evt => {
                    res.button.addEventListener(evt, events[evt]);
                });
            });

            /**
             * Detects if KodiRPC is running
             * and displays button
             */
            //fallback timer if event triggered before video detection
            let timer = new Timer(timer => {
                if (typeof doc.body.KRPCM !== u) {
                    timer.stop();
                    res.button.classList.remove('hidden');
                }
            }, 10, 5000);
            doc.body.addEventListener('kodirpc.ready', e => {
                timer.params.callback(timer);
            });

        }
    }

    /**
     * Register Module for Kodi script (isolation due to GM_)
     * Detects Module running and display button
     */
    onBody(() => {
        Object.defineProperty(doc.body, 'KodiRPCModule', {
            value: "on", configurable: true
        });
    });

    let HostModule;


    /**
     * Prevent Ads
     */
    (() => {

        const on = EventTarget.prototype.addEventListener;
        window.addEventListener = doc.addEventListener = function (t) {
            let e = [
                "contextmenu", "click", "mouseup"
            ];
            if (e.indexOf(t) !== -1) {
                return;
            }
            return on.call(this, ...arguments);
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
            window.vasturl = null;
            window.vasturlfallback = null;
        });

        /**
         * Disables vast for videojs
         */
        find('video.vjs-tech', video => {
            let id, vjs;
            try {
                if ((id = video.parentElement.closest('div[id]').id)) {
                    if (typeof videojs === f && (vjs = videojs(id)) && typeof vjs.vast !== u) {
                        vjs.vast.disable();
                        console.debug('VideoJS Vast disabled');
                    }
                }
            } catch (e) {
            }
        }, 5000);

        /**
         * Rewrite certains attributes on the fly
         * (div that automatically rewrite themselves, or recreate themselves on deletion)
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
            #videooverlay, #videerlay, .videologo, .jw-logo, .jw-dock, .BetterJsPopOverlay , #overlay, .vjs-resize-manager, .vjs-over, .vjs-over *
            {position: fixed; right: auto; bottom: auto;top:-100%;left: -100%; height:1px; width:1px;opacity: 0;max-height:1px; max-width:1px;display:inline;z-index: -1;}
        `);
    })();


    /**
     * Mods for hosts
     */
    if (/(xstreamcdn|fembed|feurl|there|gcloud|novelplanet|gaobook|fcdn)/.test(doc.location.host)) {


        new Timer(timer => {

            if (typeof clientSide === o && typeof clientSide.pl === o && typeof clientSide.pl.sources === o && clientSide.pl.sources.length > 0) {
                timer.stop();
                new AltPlayer(self=>{ 
                    self.altvideo= JWPlayerPlaylistToAltVideo(clientSide.pl);
                });
            }
        });
        return;

    }

    if (/(vidstreaming|vidcloud|dramacool|watchasian|kshows|k\-vid)/.test(doc.location.host)) {


        let lstmore, css;
        find('[style*="position: static"], [href*="bodelen.com"], [id*="p_"]', x => x.remove());

        find("#list-server-more", el => {
            lstmore = el;
        }, 5000);
        find('.videocontent > style', style => {
            css = style.innerText;

        }, 5000);

        HostModule = class VidStreaming extends MainModule {
            hostmodule(self) {
                try {
                    doc.body.appendChild(lstmore);
                    addcss(css + `
                        #list-server-more {
                            z-index: 10000;padding: 14px 0 0 0;top: 50px;
                        }
                        #show-server{background-size: cover;padding: 3px 12px;}
                        .streamgrabber{background-color: rgba(0, 0, 0, 0.7);}
                    `);
                    self.mediaevents.on('play pause', e => {
                        if (self.video.paused === true) {
                            lstmore.hidden = null;
                        } else lstmore.hidden = true;
                    });

                    let lst = doc.querySelector('.list-server-items'), clean = lst.cloneNode(true);
                    lst.parentElement.insertBefore(clean, lst);
                    lst.parentElement.removeChild(lst);

                    clean.addEventListener('click', e => {
                        let server = e.target.closest('.linkserver');
                        if (server !== null && server.dataset.status !== "0") {
                            virtualclick(server.dataset.video);
                        }
                        clean.style.display = "none";
                    });
                } catch (error) {
                }
            }
        };
    }

    if (/(gdriveplayer)/.test(doc.location.host)) {
        addicon("https://www.google.com/drive/static/images/drive/favicon.ico");

        HostModule = class GdrivePlayer extends MainModule {
            hostmodule(grabber) {
                const video = grabber.video;
                let subsrc = "";
                const jw = jwplayer(video.parentElement.closest('div[id]').id);
                const playlist = jw.getPlaylist()[0];
                playlist.tracks.forEach(track => {
                    let url = new URL(getURL(track.file));
                    if (url.searchParams.get('subtitle') === "1" || url.searchParams.get('subtitle').length === 0) {
                        return;
                    }
                    subsrc = url.href;
                });

                try {


                } catch (error) {
                    subsrc = "";
                }

                grabber.onReady(() => {
                    if (subsrc.length > 0) {
                        grabber.elements.buttons.subtitles.href = subsrc;
                        grabber.elements.buttons.subtitles.classList.remove('hidden');
                    }
                });

            }
        };

        return find('video.jw-video', video => {
            let grabber = window.grabber = new StreamGrabber(video, HostModule);
        }, 5000);
    }

    if (/(fastdrama)/.test(doc.location.host)) {
        addicon('/ico.ico');
    }
    if (/(prettyfast)/.test(doc.location.host)) {
        addicon("https://9anime.to/assets/favicons/favicon.png");
    }
    if (/(mp4upload)/.test(doc.location.host)) {
        find('.vjs-over', x => x.remove());

        return find('video.vjs-tech[src^="http"]', video => {

            window.alt = new AltPlayer(self => {
                try {
                    const vjs = videojs(video.parentElement.closest('div[id]').id), tracks = vjs.options_.tracks, poster = vjs.poster() || "";
                    self.altvideo = new altvideo(video);
                    self.altvideo.poster = poster;
                    tracks.forEach(track => {
                        self.altvideo.addCaption(track.src, null, track.srclang);
                    });
                } catch (error) {
                    self.altvideo = new altvideo(video);
                }


            });

        }, 5000);
    }

    if (/(uptostream)/.test(doc.location.host)) {
        addicon("/assets/images/utb.png");
        find('[class*="ad-container"]', x => x.remove());

        return find('video.vjs-tech[src^="http"]', video => {

            window.alt = new AltPlayer(self => {
                try {
                    // @link https://github.com/kmoskwiak/videojs-resolution-switcher
                    const vjs = videojs(video.parentElement.closest('div[id]').id);
                    const tracks = vjs.options_.tracks, poster = vjs.poster() || "", videosources = vjs.groupedSrc.type["video/mp4"];

                    self.altvideo.poster = poster;
                    videosources.forEach(source => {
                        self.altvideo.addSource(source.src, source.res, source.type);
                    });
                    tracks.forEach(track => {
                        self.altvideo.addCaption(track.src, null, track.srclang);
                    });

                } catch (error) {
                    self.altvideo = new altvideo(video);
                }
            });
        });

    }

    if (/letv/.test(doc.location.host)) {



        return find('video.dplayer-video', (video) => {


            if (typeof main === s) {

                let m3u8 = getURL(main);

                window.alt = new AltPlayer(self => {
                    self.altvideo = new altvideo();
                    self.altvideo.addSource(m3u8, "default", "hls");
                    self.altvideo.sources[0].selected = true;

                });
            }


        }, 5000);


    }
    
    if (/streamtape/.test(doc.location.host)) {
        if (/^\/v\//.test(doc.location.pathname)) {
            location.replace(location.pathname.replace(/^\/v\//, '/e/'));
            return;
        }


        on.loaded().then(() => {
            try {
                let
                        videolink = doc.getElementById("videolink").innerText + "&stream=1",
                        mainvideo = doc.querySelector('#mainvideo'),
                        overlay = doc.querySelector('.plyr-overlay');

                if (mainvideo instanceof Element && typeof player === o) {
                    fetch(getURL(videolink), {cache: 'no-store', redirect: 'follow', credentials: 'same-origin'})
                            .then(response => {
                                console.debug(response);
                                if (response.redirected === true) return response.url;
                                throw new Error('Cannot redirect to video')
                            })
                            .then(url => {
                                mainvideo.data('src', url);
                                mainvideo.src = videolink;
                                player.currentTrack = 0;
                                if (overlay instanceof Element) overlay.remove();

                            })
                            .catch(x => x);
                }
            
        } catch (e) {  }


        });

        NodeFinder.find('iframe, .plyr__resume', x => x.remove());
        return NodeFinder.find('.plyr-container video#mainvideo[src*="tape"]', video => {
            //video.pause();
            const grabber = window.grabber = new StreamGrabber(video, typeof HostModule === f ? HostModule : MainModule);

        });

    }

    if (/hdv/.test(doc.location.host)) {

        return NodeFinder.find('video#player', video => {
            //here
            video.remove();
            let opts = [], sources = {}, urls = [], list = [];
            if (typeof dt === o) list = list.concat(dt);
            if (typeof hd === o) list = list.concat(hd);
            if (typeof sd === o) list = list.concat(sd);
            window.alt = alt = new AltPlayer(self => {
                const altvid = self.altvideo = new altvideo();
                altvid.poster = video.poster;
                

                
                list.forEach((item, i)=>{
                    let
                            src = doc.location.origin + '/m3u8/' + item.name + '.m3u8',
                            size = item.res + i;
                    if (urls.includes(src)) return;
                    opts.push(size);
                    urls.push(src);

                    sources[size] = {
                        src: src,
                        fid: item.fid,
                        captions: []
                    };
                    if ((typeof sub === o) && (typeof sub[sources[size].fid] === o)) {
                        Object.keys(sub[sources[size].fid]).forEach(lang => {
                            if (!(/(english|french)/i.test(lang))) return;


                            if (Array.isArray(sub[sources[size].fid][lang])) {
                                let c = 0;
                                sub[sources[size].fid][lang].forEach(arr => {
                                    c++;
                                    if (c > 5) return;
                                    sources[size].captions.push({
                                        src: 'https://sub1.hdv.fun/vtt1/' + arr[1] + '.vtt',
                                        lang: lang
                                    });
                                });
                            }

                        });
                    }
                    altvid.addSource(src, size, "hls");

                });


                self.plyropts.quality = {
                    default: opts[0],
                    options: opts,
                    forced: true,
                    onChange(size){
                        let current = altvid.element.data('src') || altvid.element.src;
                        const item = sources[size];
                        if(item.src !== current){
                            altvid.element.querySelectorAll('track').forEach(track => track.remove());
                            altvid.captions = [];
                            item.captions.forEach(entry => {
                                altvid.addCaption(entry.src, null, entry.lang);
                            });
                            altvid.element.src = item.src;
                        }
                    }
                };
                // altvid.sources[0].selected = true;
            });


        });
    }



    /**
     * Start APP
     */
    find('video.vjs-tech', video => {

        const grabber = window.grabber = new StreamGrabber(video, typeof HostModule === f ? HostModule : MainModule);



    }, 5000);



    find('video.vjs-tech source', source => {
        const video = source.parentElement;

        window.alt = new AltPlayer(self => {
            self.altvideo = new altvideo(video);
            if (self.altvideo.sources.length > 0) self.altvideo.sources[0].selected = true;
        });


        const grabber = window.grabber = new StreamGrabber(video, typeof HostModule === f ? HostModule : MainModule);

    }, 5000);


    find('video.jw-video', video => {
        window.alt = new AltPlayer(JWPlayerToAltVideo);
    }, 5000);

    find('video.dplayer-video, video.fp-engine', video => {

        window.alt = new AltPlayer(self => {
            self.altvideo = new altvideo(video);
            if (self.altvideo.sources.length > 0) self.altvideo.sources[0].selected = true;
        });

    }, 5000);
    




})(document, window);