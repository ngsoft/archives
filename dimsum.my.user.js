// ==UserScript==
// @name         dimsum.my
// @namespace    https://github.com/ngsoft
// @version      6.2
// @description  Subtitle downloader
// @author       daedelus
// @include     /^https?://(www.)?dimsum.my//
// @run-at      document-end
// @noframes
// @grant       none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dimsum.my.user.js
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @icon        https://edm.dimsum.my/favicon.ico
// ==/UserScript==


(function(doc, win, undef) {

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

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
            doc.head.appendChild(s);
        }
    }

    /**
     * Uses Mutation Observer to find Nodes by selector when created or available
     * @type {function}
     * @param {Element|Document} el Root Element
     * @param {string} selector A valid selector
     * @param {function} callback If callback returns false, stops the observer
     * @param {boolean} [once] Stops the observer when finding first node, defaults to true
     */
    const findNode = (() => {

        const MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;
        const s = "string", b = "boolean", f = "function", o = "object", u = "undefined", n = "number";
        const options = {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true
        };
        const defaults = {
            selector: "",
            callback: null,
            once: true,
            uid: null
        };

        let uid = 0;

        function triggerEvent(node, params, obs, el) {
            let event = new Event("DOMNodeFound", {bubbles: true, cancelable: true});
            event.data = {
                options: params,
                observer: obs,
                current: el
            };
            node.dispatchEvent(event);
        }



        function nodeFinder(el) {
            let params = Object.assign({}, defaults);

            for (let i = 1; i < arguments.length; i++) {
                let arg = arguments[i];
                switch (typeof arg) {
                    case s:
                        params.selector = arg;
                        break;
                    case b:
                        params.once = arg;
                        break;
                    case f:
                        params.callback = arg;
                        break;
                    case o:
                        if (isPlainObject(arg)) {
                            Object.assign(params, arg);
                        }
                        break;
                }
            }

            if (typeof params.callback === f) {
                params.uid = uid++;
                let matches = [];
                const run = function run() {
                    el.querySelectorAll(params.selector).forEach((target) => {
                        if (!matches.includes(target)) {
                            matches.push(target);
                            triggerEvent(target, params, observer, el);
                        }
                    });
                };

                const DOMNodeFound = function DOMNodeFound(e) {
                    //no multi triggers for other searches
                    if (e.data === undef || DOMNodeFound.uid !== e.data.options.uid) {
                        return;
                    }
                    let self = e.target, obs = e.data.observer;
                    if (self.matches(params.selector)) {
                        let retval = params.callback.call(self, e);
                        if (params.once === true || retval === false) {
                            el.removeEventListener(e.type, DOMNodeFound);
                            obs.disconnect();
                        }
                        return retval;
                    }
                };
                DOMNodeFound.uid = params.uid;
                el.addEventListener("DOMNodeFound", DOMNodeFound, false);
                let observer = new MutationObserver(function(m, obs) {
                    for (let i = 0; i < m.length; i++) {
                        let rec = m[i], target = rec.target;
                        if (target.matches === undef) {
                            continue;
                        }
                        if (typeof target.closest === "function" && target.closest(params.selector) !== null) {
                            run();
                        }
                    }
                });
                observer.observe(el, options);
                if (doc.readyState === 'loading') {
                    doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
                        doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                        run();
                    });
                }
                if (doc.readyState !== 'complete') {
                    win.addEventListener('load', function load() {
                        win.removeEventListener('load', load);
                        run();
                    });
                    return;
                }
                run();
            }

        }

        return nodeFinder;
    })();


    const notifications = (() => {

        const styles = `
            /* Animations */
            @keyframes fadeInRight {0% {opacity: 0;-webkit-transform: translate3d(100%, 0, 0);transform: translate3d(100%, 0, 0);}100% {opacity: 1;-webkit-transform: none;transform: none;}}
            @keyframes bounceOut {20% {-webkit-transform: scale3d(.9, .9, .9);transform: scale3d(.9, .9, .9);}50%, 55% {opacity: 1;-webkit-transform: scale3d(1.1, 1.1, 1.1);transform: scale3d(1.1, 1.1, 1.1);}100% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}}
            .bounceOut {animation-name: bounceOut;animation-duration: .75s;animation-duration: 1s;animation-fill-mode: both;}
            .fadeIn {animation-name: fadeInRight;animation-duration: .5s;animation-fill-mode: both;}
            /* Position & Size */
            .user-notifications{position: absolute;right: 64px; left: auto; bottom: 27.5%;text-align: right;font-size: 16px;z-index: 9999; min-width: 256px;}
             body > .user-notifications{position: fixed;}
            .user-notify{display: block; text-align:center;padding:16px 24px; border-radius: 4px; margin: 8px 0;}
            .user-notify [class*="-icon"]{width: 32px;height: 32px;margin:-4px 8px 0 -8px; float:left;}
             /* Colors & Fonts */
            .user-notifications{font-family: Arial,Helvetica,sans-serif;font-size:16px;}
            .user-notify{color:rgba(52, 58, 64, 1);background-color: rgba(248, 249, 250, .8); border: 1px solid rgba(34, 34, 34, 1);}
            .user-notify .error-icon{color: rgba(220, 53, 69, .8);}.user-notify .success-icon{color: rgba(40, 167, 69, .8);}`;

        const template = {
            notify: `<div class="user-notify"></div>`,
            success: `<div class="user-notify notify-success"><span class="success-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z"></path></svg></span></div>`,
            error: `<div class="user-notify notify-error"><span class="error-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.054-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.952 83.154 0l239.94 416.028zm-27.658 15.991l-240-416c-6.16-10.678-21.583-10.634-27.718 0l-240 416C27.983 466.678 35.731 480 48 480h480c12.323 0 19.99-13.369 13.859-23.996zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28zm-11.49-212h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg></span></div>`
        };
        const eventend = ((div) => {
            const browerevents = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'mozAnimationEnd',
                WebkitAnimation: 'webkitAnimationEnd'
            };
            for (let style in browerevents) {
                if (div.style[style] !== "undefined") {
                    return browerevents[style];
                }
            }
        })(doc.createElement('div'));
        const eventstart = eventend.replace(/End$/, 'Start').replace(/end$/, 'start');

        const defaults = {
            timeout: 1,
            callback: null
        };

        function notify(el, message, ...extra) {
            const params = Object.assign({}, defaults);
            extra.forEach((arg) => {
                if (typeof arg === "number") {
                    params.timeout = arg > 1000 ? (arg / 1000) : arg;
                } else if (typeof arg === "function") {
                    params.callback = arg;
                }
            });
            if (typeof params.callback === "function") {
                message.addEventListener("notifyend", params.callback);
            }
            message.addEventListener("click", function() {
                message.addEventListener(eventstart, function() {
                    message.addEventListener(eventend, function() {
                        message.dispatchEvent(new Event('notifyend', {bubbles: true, cancelable: true}));
                        message.parentElement.removeChild(message);
                    }, {once: true});
                }, {once: true});
                this.classList.add('bounceOut');
            }, {once: true});

            message.addEventListener(eventstart, function() {
                message.addEventListener(eventend, function() {
                    this.classList.remove('fadeIn');
                    if (params.timeout === 0) return;
                    setTimeout(() => {
                        message.dispatchEvent(new Event('click', {bubbles: true, cancelable: true}));
                    }, (params.timeout * 1000));
                }, {once: true});
            }, {once: true});
            el.insertBefore(message, el.firstChild);
            //el.appendChild(message);
            message.classList.add('fadeIn');
        }

        function notifications(el) {
            if (!(this instanceof notifications) || typeof el.appendChild !== "function") return;
            if (notifications.styles === false) {
                addcss(styles);
                notifications.styles = true;
            }
            const root = this.root = html2element(`<div class="user-notifications"></div>`);
            el.appendChild(root);
        }
        notifications.styles = false;
        notifications.prototype = {
            /**
             * Display a notification
             * @param {string} message Message to display
             * @param {number} [timeout] timeout in seconds for the notification to disappear (defaults to 1s + animations)
             * @param {function} [callback] callback to call
             * @returns {this}
             */
            notify(message, timeout, callback) {
                if (typeof message === "string") {
                    message = doc.createTextNode(message);
                    let el = html2element(template.notify);
                    el.appendChild(message);
                    notify(this.root, el, timeout, callback);
                }
                return this;
            },
            /**
             * Display an error
             * @param {string} message Message to display
             * @param {number} [timeout] timeout in seconds for the notification to disappear (defaults to 1s + animations)
             * @param {function} [callback] callback to call
             * @returns {this}
             */
            error(message, timeout, callback) {
                if (typeof message === "string") {
                    message = doc.createTextNode(message);
                    let el = html2element(template.error);
                    el.appendChild(message);
                    notify(this.root, el, timeout, callback);
                }
                return this;
            },
            /**
             * Display a success notification
             * @param {string} message Message to display
             * @param {number} [timeout] timeout in seconds for the notification to disappear (defaults to 1s + animations)
             * @param {function} [callback] callback to call
             * @returns {this}
             */
            success(message, timeout, callback) {
                if (typeof message === "string") {
                    message = doc.createTextNode(message);
                    let el = html2element(template.success);
                    el.appendChild(message);
                    notify(this.root, el, timeout, callback);
                }
                return this;
            }

        };
        return notifications;
    })();

    const notify = new notifications(doc.body);

    let styles = `
        .jw-settings-content-item{width: 80% !important;}
        .download-button
        {text-decoration: none;width:32px;height:31px;line-height:0;vertical-align: middle;display: inline-block;float: right;padding: 4px;}
        .download-button > * {width:100%;height:100%;}
        .download-button{color: #fff!important;border-radius: 3px;border: 1px solid rgba(0,0,0,0);}
        .download-button:hover{border-color: #ec1c24; background: #ec1c24;}
        .player-fullscreen{z-index: 9000;}
        button.jw-settings-content-item + .download-button{width:24px;height:23px;}
    `;
    addcss(styles);

    function downloadButton(subtrack) {
        if (!(this instanceof downloadButton)) {
            return;
        }
        if (!(subtrack instanceof Element) || typeof subtrack.matches !== "function" ||
                !subtrack.matches('[data-id]') || typeof playerModule === "undefined" ||
                !Array.isArray(playerModuleJw.subtitles)) return;

        this.subtrack = subtrack;
        Object.assign(this, {
            __title: null, __button: null, __subinfo: null, xhr: null, subtrack: subtrack
        });
        return this.button;
    }

    downloadButton.prototype = {
        template: `<a title="" href="#" class="download-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M452 432c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-84-20c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm144-48v104c0 24.3-19.7 44-44 44H44c-24.3 0-44-19.7-44-44V364c0-24.3 19.7-44 44-44h99.4L87 263.6c-25.2-25.2-7.3-68.3 28.3-68.3H168V40c0-22.1 17.9-40 40-40h96c22.1 0 40 17.9 40 40v155.3h52.7c35.6 0 53.4 43.1 28.3 68.3L368.6 320H468c24.3 0 44 19.7 44 44zm-261.7 17.7c3.1 3.1 8.2 3.1 11.3 0L402.3 241c5-5 1.5-13.7-5.7-13.7H312V40c0-4.4-3.6-8-8-8h-96c-4.4 0-8 3.6-8 8v187.3h-84.7c-7.1 0-10.7 8.6-5.7 13.7l140.7 140.7zM480 364c0-6.6-5.4-12-12-12H336.6l-52.3 52.3c-15.6 15.6-41 15.6-56.6 0L175.4 352H44c-6.6 0-12 5.4-12 12v104c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12V364z"></path></svg><a>`,
        extension: "srt",
        timeout: 10000,
        get button() {
            if(this.__button === null){
                let btn = this.__button = html2element(this.template);
                btn.title = `<  Download ${this.lang} Subtitle.  >`;
                btn.download = this.filename;
                btn.href = this.src;
                this.subtrack.parentElement.insertBefore(btn, this.subtrack.nextSibling);
                Object.defineProperty(btn, 'bdata', {
                    configurable: true, value: this
                });
                btn.addEventListener('click', this.click);
            }
            return this.__button;
        },
        get id() {
            return parseInt(this.subtrack.dataset.id);
        },
        get title() {
            //playerModuleJw
            if (this.__title === null) {
                let type = playerModuleJw.engageData.type,
                        baseTitle = playerModuleJw.engageData.title,
                        matches, title = "", season, episode;

                switch (type) {
                    case "movie":
                        title = baseTitle.replace(/[\|&;\$%@"\'’<>\(\)\+,]/g, ".");
                        break;
                    case "episode":
                        if ((matches = playerModuleJw._title.match(/E([0-9]+) (.*?)$/i)) !== null) {
                            title = matches[2].replace(/[\|&;\$%@"\'’<>\(\)\+,]/g, ".").replace(/S[0-9]+$/, "").trim() + ".";
                            season = parseInt(playerModuleJw.gtmData.seasonNumber);
                            episode = parseInt(matches[1]);
                            if (season > 1) {
                                title += "S" + (season > 9 ? season : "0" + season);
                            }
                            title += "E" + (episode > 9 ? episode : "0" + episode);
                        }
                        break;
                }
                if (title.length > 0) this.__title = title;
            }
            return this.__title;
        },
        get lang() {
            return this.subtrack.innerText.trim();
        },
        get langcode() {
            return this.subinfo.srclang;
        },
        get src() {
            return this.subinfo.src;
        },
        get subinfo() {
            if (this.__subinfo === null) {
                let self = this;
                this.__subinfo = Object.assign({}, playerModuleJw.subtitles.filter(x => x.id === self.id)[0]);
            }
            return this.__subinfo;
        },
        get filename() {
            return `${this.title}.${this.langcode}.${this.extension}`;
        },

        click(e) {
            e.preventDefault();
            const self = this.bdata;
            if (self !== undef) {
                if (self.xhr === null || (self.xhr.readyState === 4 && self.xhr.status !== 200)) {
                    let xhr = self.xhr = new XMLHttpRequest();
                    xhr.open("GET", self.src, true);
                    xhr.timeout = self.timeout;
                    xhr.onerror = xhr.ontimeout = xhr.onabort = function onerror() {
                        self.onerror.call(self, self);
                    };
                    xhr.onload = function onload() {
                        if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText.length > 0) {
                            return self.onload.call(self, self);
                        }
                        self.onerror.call(self, self);
                    };
                } else if (self.xhr.readyState > 0) {
                    if(self.xhr.responseText.length > 0 && self.xhr.status === 200){
                        return self.onload.call(self, self);
                    }
                    return self.onerror.call(self, self);
                }
                self.xhr.send();
            }

        },
        onload(self) {
            let txt = self.xhr.responseText;
            let blob = new Blob([txt], {type: 'octet/stream'}), link = doc.createElement('a'), href = URL.createObjectURL(blob);
            link.download = self.filename;
            link.href = href;
            link.style.opacity = 0;
            doc.body.appendChild(link);
            link.click();
            doc.body.removeChild(link);
            setTimeout(x => URL.revokeObjectURL(href), 2000);
        },
        onerror(self) {
            notify.error(`Cannot download ${self.filename}`);
        }
    };

    /**
     * Checks if el has closest element matching the selector
     * @param {EventTarget} el
     * @param {stringe} selector
     * @returns {EventTarget|null}
     */
    function matches(el, selector) {
        if (typeof el.closest === "function" && typeof selector === "string") return el.closest(selector);
        return null;
    }

    findNode(doc.body, '#playerModule__player .jw-settings-menu', function() {
        if (this.querySelector('.download-button') !== null) return;
        if(!Array.isArray(playerModuleJw.subtitles)) return;
        let subindex = 0, ccbtn = doc.querySelector('.jw-icon-cc.jw-settings-submenu-button');
        this.querySelectorAll('.jw-settings-submenu').forEach(function(jwsettings, n) {
            if (n > 0) return;
            //disables: autoplay
            doc.querySelector('video').addEventListener('loadeddata', function() {
                this.pause();
            });
            jwsettings.querySelectorAll('button.jw-settings-content-item').forEach(function(el, index) {
                if (index === 0) return;
                if (/^([0-9]+)p/.test(el.innerHTML)) return;
                el.dataset.id = playerModuleJw.subtitles[subindex].id;
                let button = new downloadButton(el);
                subindex++;
                if (button.bdata.langcode === 'en') {
                    if(ccbtn !== null){
                        let clone = button.cloneNode(true);
                        ccbtn.parentElement.insertBefore(clone, ccbtn);
                        clone.addEventListener("click", function(e) {
                            const self = this;
                            e.preventDefault();
                            doc.querySelectorAll(`.download-button[href="${this.href}"]`).forEach(function(el) {
                                if (el === self) return;
                                el.click();
                            });
                        });
                    }
                    notify.success(`English subtitles are available.`, 2.5);
                }
            });
        });

    }, false);

    /**
     * Disable trial web adds
     */
    let ad_interval = setInterval(function() {
        if (typeof dfp_config !== "undefined") {
            clearInterval(ad_interval);
            //dfp_config.ads_for_entire_site = false;
            Object.keys(dfp_config.ads_enable).forEach(function(type) {
                dfp_config.ads_enable[type] = false;
            });
        }
    }, 20);


    console.debug(scriptname, 'Started');

})(document, window);