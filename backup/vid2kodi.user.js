// ==UserScript==
// @name        Send Video to Kodi
// @namespace   https://github.com/ngsoft
// @version     3.0.5
// @description Send Stream URL to Kodi using jsonRPC (Works with ol.user.js)
// @author      daedelus
// @icon        https://kodi.tv/favicon.ico
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/vid2kodi.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/vid2kodi.user.js
// @compatible  firefox+greasemonkey(3.17)
// @compatible  firefox+tampermonkey
// @compatible  chrome+tampermonkey
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @include     *
// ==/UserScript==

(function (doc, undef) {

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    const scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;
    const icon = `data:image/png;base64,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`;

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
            doc.body.appendChild(s);
        }
    }
    function onBody(callback, binding) {
        if (typeof callback !== "function") {
            return;
        }
        let worker = setInterval(function () {
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
    function trigger(el, type, data) {
        if (typeof el.dispatchEvent !== "function") {
            return;
        }
        if (typeof type === "string") {
            type.split(" ").forEach((t) => {
                let event = new Event(t, { bubbles: true, cancelable: true });
                event.data = data;
                el.dispatchEvent(event);
            });
        }
    }
    class UserSettings {
        constructor(defaults) {
            if (typeof defaults === 'object') {
                Object.keys(defaults).forEach(function (k) {
                    if (typeof GM_getValue(k) !== typeof defaults[k]) {
                        this.set(k, defaults[k]);
                    }
                }, this);
            }
        }
        get(key) {
            return GM_getValue(key);
        }
        set(key, val) {
            GM_setValue(key, val);
            return this;
        }
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
            this.worker = setInterval(function () {
                doc.querySelectorAll(self.params.selector).forEach(function (el) {
                    if (self.params.once === true && self.nodes.indexOf(el) !== - 1) {
                        return;
                    }
                    if (self.nodes.indexOf(el) === - 1) self.nodes.push(el);
                    self.params.onload.apply(el, [el, self]);
                });
            }, this.params.interval);
            if (this.params.timeout > 0) {
                this.tworker = setTimeout(function () {
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
                delete (this.tworker);
            }
            clearInterval(this.worker);
            delete (this.worker);
            return this;
        }

        constructor(selector, options) {
            let self = this;
            this.params = {
                selector: "",
                onload: null,
                interval: 10,
                timeout: 0,
                once: true
            };
            self.nodes = [];
            if (typeof selector === "string" && selector.length > 0) {
                this.params.selector = selector;
            } else if (selector instanceof Object) {
                options = selector;
            }

            if (typeof options === "function") {
                this.params.onload = options;
            } else if (options instanceof Object) {
                Object.keys(options).forEach(function (x) {
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
    class KodiClient {

        get host() {
            let host = this.__usersettings__.get('hostname');
            return host || "127.0.0.1";
        }
        set host(v) {
            if (/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(v)) {
                this.__usersettings__.set('hostname', v);
            }

        }

        get port() {
            let port = this.__usersettings__.get('port');
            return port || 8080;
        }
        set port(v) {
            if (typeof v === "number" && v > 0 && v < 65536) this.__usersettings__.set('port', v);

        }

        get address() {
            return "http://" + this.host + ":" + this.port + "/jsonrpc";
        }

        send(link, success, error) {
            if (typeof link === "string" && /^http/.test(link)) {
                let server = this.address, data = JSON.stringify({
                    jsonrpc: '2.0',
                    method: "Player.Open",
                    params: {
                        item: {
                            file: link
                        }
                    },
                    id: Math.floor(Math.random() * (99 - 1) + 1)
                });
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: server,
                    data: data,
                    headers: { "Content-Type": "application/json" },
                    onload(xhr) {

                        if (xhr.status === 200) {
                            try {
                                let response = JSON.parse(xhr.response);
                                if (response.result === "OK") {
                                    if (typeof success === "function") success();

                                    return;
                                }

                            } catch (e) {
                            }

                        }
                        if (typeof error === "function") error();
                    },
                    onerror() {
                        if (typeof error === "function") error();
                    }
                });
            }
        }
        check(success, error) {
            let server = this.address;
            GM_xmlhttpRequest({
                method: 'GET',
                url: server,
                onload(xhr) {
                    if (xhr.status === 200) {
                        if (typeof success === "function") success();

                    }
                },
                onerror() {
                    if (typeof error === "function") error();
                }
            });
        }

        constructor() {
            this.__usersettings__ = new UserSettings();
        }

    }

    let stylesapplied = false;

    function vid2kodistyles() {
        if (stylesapplied) return;

        let styles = `
            button.vid2kodi
            {position: absolute; top: 64px; right:32px;z-index: 99999;cursor: pointer;}
            button.vid2kodi, button.vid2kodi .vid2kodi-icn
            {border: 0; margin:0; padding:0;color: transparent;background-color: rgba(0, 0, 0, 0);}
            button.vid2kodi .vid2kodi-icn{width: 56px; height: 56px;}
        `;
        //settings
        styles += `
            .vid2kodi-settings {position: fixed; top:0;left:0; right:0; bottom:0; z-index: 99999999; background-color: rgba(0,0,0,0);}
            .vid2kodi-settings form{
                width:80%;margin: 16px auto 0 auto; border: 1px solid;position: relative;
                background-color: rgba(255, 255, 255, .8);color:rgb(34, 34, 34);
                border-radius: 4px; font-family: Arial,Helvetica,sans-serif;font-size: 14px;line-height: 1.5;font-weight: 700;}
            .vid2kodi-settings fieldset{
                border: 0;min-height:96px;padding: 16px;
            }
            .vid2kodi-settings legend{
                padding-top: 16px;
            }

            .vid2kodi-settings fieldset > .close-btn{
                border: 0;padding: 8px;background-color: rgba(0,0,0,0);cursor: pointer;
                position: absolute; top:4px; right:8px;
            }
            .vid2kodi-settings .form-el{
                text-align: left;
                padding: 8px 16px;
            }
            .vid2kodi-settings .form-el label{
                display: block;margin: 0 0 4px 0;
            }
            .vid2kodi-settings .form-el input{
                width: 100%;padding: 12px 20px;margin: 0 0 8px 0;box-sizing: border-box;border-radius: 4px;
                border: 1px solid rgba(255, 255, 255, .8);font-size: 16px;-moz-appearance: textfield;-webkit-appearance: none;-o-appearance: none;
            }
            .vid2kodi-settings .form-el input:focus{
                border: 1px solid rgb(0, 153, 204);
            }
            .vid2kodi-settings .form-footer{
                display: block; margin:0 -16px -16px 0; padding: 0; text-align: right;
            }
            .vid2kodi-settings .form-footer button{
                margin: 16px; background-color: rgb(255, 255, 255); color: rgba(0, 0, 0, 0.6);
                padding: 8px 24px;box-sizing: border-box;border-radius: 4px; border: 0;cursor: pointer;
            }
            .vid2kodi-settings .form-footer button.close-btn{
                color: rgb(219, 40, 40);
            }
            .vid2kodi-settings .form-footer button.check-btn{
                color: rgb(30, 130, 205);
            }
            .vid2kodi-settings .form-footer button.reset-btn{
                color: rgb(28, 29, 30);
            }

            .vid2kodi-settings .form-footer button + button{
                margin-left: 0;
            }
            .vid2kodi-settings .form-footer button.close-btn:hover, .vid2kodi-settings .form-footer button.close-btn:active{
                background-color: rgb(219, 40, 40); color: rgb(255, 255, 255);
            }
            .vid2kodi-settings .form-footer button.check-btn:hover, .vid2kodi-settings .form-footer button.check-btn:active{
                background-color: rgb(30, 130, 205);color: rgb(255, 255, 255);
            }
            .vid2kodi-settings .form-footer button.reset-btn:hover, .vid2kodi-settings .form-footer button.reset-btn:active{
                background-color: rgb(28, 29, 30);color: rgb(255, 255, 255);
            }
            .vid2kodi-settings .check-connection{display: block; padding: 8px 16px 0 0;}
            .vid2kodi-settings .check-connection.success{color: rgb(40, 167, 69);}
            .vid2kodi-settings .check-connection.error{color: rgb(220, 53, 69);}
        `;
        //notifications
        styles += `
            .vid2kodi-notify{position: absolute;right: 64px; left: auto; top: 60%;text-align: right;font-size: 16px;z-index: 9999;}
            .vid2kodi-notify div{
            display: block; text-align:center;font-size:16px;padding:16px; border-radius: 4px; margin: 8px 0;max-width:256px;width:256px;
            color:rgb(34, 34, 34);background-color: rgba(255, 255, 255, .8);font-family: Arial,Helvetica,sans-serif;
            }
            .vid2kodi-notify [class*="-icn"]{width: 32px;height: 32px;margin:-8px -16px 0 0; float:left;}
            .vid2kodi-notify .error-icn{color: rgb(220, 53, 69);}.vid2kodi-notify .success-icn{color: rgb(40, 167, 69);}
            @keyframes fadeInRight {
                0% {opacity: 0;-webkit-transform: translate3d(100%, 0, 0);transform: translate3d(100%, 0, 0);}
                100% {opacity: 1;-webkit-transform: none;transform: none;}
            }
            @keyframes bounceOut {
                20% {-webkit-transform: scale3d(.9, .9, .9);transform: scale3d(.9, .9, .9);}
                50%, 55% {opacity: 1;-webkit-transform: scale3d(1.1, 1.1, 1.1);transform: scale3d(1.1, 1.1, 1.1);}
                100% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}
            }
            @keyframes fadeIn {from {opacity: 0;}to {opacity: 1;}}

            .fadeIn {animation-name: fadeIn;}
            .bounceOut {animation-name: bounceOut;animation-duration: .75s;animation-duration: 1s;animation-fill-mode: both;}
            .fadeInR {animation-name: fadeInRight;animation-duration: .5s;animation-fill-mode: both;}`;
        styles += `
            .hidden, .hidden *, button.vid2kodi:not([data-src]), .vid2kodi-target:not(:hover) button.vid2kodi
            {position: fixed; right: auto; bottom: auto;top:-100%;left: -100%; height:1px; width:1px;
            opacity: 0;max-height:1px; max-width:1px;display:inline;}`;

        onDocEnd(function () {
            addcss(styles);
        });
        stylesapplied = true;
    }



    function vid2kodi(videoElement) {
        if (this === undef || this === window) {
            return;
        }
        if (!(videoElement instanceof Element) || videoElement.tagName !== "VIDEO") return;

        const self = this, defaults = {
            hostname: '127.0.0.1',
            port: 8080
        }, settings = new UserSettings(defaults), client = new KodiClient(), video = videoElement;

        const elements = {
            notify: html2element(`<div class="vid2kodi-notify" />`),
            button: html2element(`<button class="vid2kodi" title="Send to Kodi"><img class="vid2kodi-icn" src="${icon}" /></button>`),
            sent: `<img class="kodi-icn" src="${icon}" />Sending link to Kodi.`,
            error: `<span class="error-icn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.054-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.952 83.154 0l239.94 416.028zm-27.658 15.991l-240-416c-6.16-10.678-21.583-10.634-27.718 0l-240 416C27.983 466.678 35.731 480 48 480h480c12.323 0 19.99-13.369 13.859-23.996zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28zm-11.49-212h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg></span>Vid2Kodi Error.`,
            success: `<span class="success-icn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z"></path></svg></span>Vid2Kodi Success.`,
            settings: html2element(`<div class="vid2kodi-settings hidden" oncontextmenu="return false;">
                                        <form>
                                            <fieldset>
                                                <legend>Vid2Kodi Settings</legend>
                                                <button class="close-btn">&times;</button>
                                                <hr />
                                                <div class="form-el">
                                                    <label>Hostname</label>
                                                    <input type="text" name="host" value="${client.host}" placeholder="Host" required />
                                                </div>
                                                <div class="form-el">
                                                    <label>Port</label>
                                                    <input type="number" name="port" value="${client.port}" placeholder="Port" min="1" max="65535" required />
                                                </div>
                                                <div class="form-el" hidden>
                                                    <label>Url</label>
                                                    <input type="text" name="url" value="${client.address}" disabled />
                                                </div>
                                                <div class="form-footer">
                                                    <span class="check-connection"></span>
                                                    <button class="reset-btn" type="reset">Reset</button>
                                                    <button class="check-btn">Check</button>
                                                    <button class="close-btn">Close</button>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>`)
        };

        function updatevideolink(url) {
            if (typeof url === "string" && url.length > 0 && /^http/.test(url)) {
                elements.button.dataset.src = url;
            }
        }

        self.notify = function (message) {
            if (typeof message === "string" && message.length > 0) {
                let el = html2element(`<div class="fadeInR">${message}</div>`);
                setTimeout(function () {
                    el.classList.remove('fadeInR');
                    setTimeout(function () {
                        el.classList.add('bounceOut');
                        setTimeout(function () {
                            el.parentNode.removeChild(el);
                        }, 1000);
                    }, 1000);
                }, 500);
                elements.notify.appendChild(el);
            }
        };
        const target = video.closest('div[id]');
        const events = {
            video: {
                play() {
                    updatevideolink(this.src);
                    elements.button.hidden = true;
                },
                pause() {
                    updatevideolink(this.src);
                    elements.button.hidden = null;
                },
                loadeddata() {
                    updatevideolink(this.src);
                }
            },
            target: {
                mouseover() {
                    if (!elements.button.classList.contains('fadeInR')) elements.button.classList.add('fadeInR');
                    this.classList.remove('vid2kodi-target');
                }
            },
            button: {
                mouseup(evt) {
                    evt.preventDefault();
                    if (evt.button === 0) {
                        //send to kodi
                        self.send();
                    } else {
                        //settings
                        self.settings();

                    }
                    return false;

                },
                click(e) {
                    e.stopPropagation();
                    return false;
                },
                contextmenu(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            },
            settings() {
                let settings = doc.querySelector('.vid2kodi-settings'), cktxt = settings.querySelector('.check-connection'),
                    form = settings.querySelector('form'), host = settings.querySelector('[name="host"]'), port = settings.querySelector('[name="port"]'),
                    address = settings.querySelector('[name="url"]');
                let evts = {
                    main: {
                        submit(e) {
                            evts.update();
                            if (typeof e.keyCode === "number" && e.keyCode === 27) {
                                return evts.close(e);
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            return false;
                        },
                        change(e) {
                            return evts.main.submit(e);
                        },
                        keyup(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            if (typeof e.keyCode === "number" && e.keyCode === 27) {
                                switch (e.keyCode) {
                                    case 27:
                                    case 13:
                                        evts.main.submit.call(this, e);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            return false;
                        },
                        reset(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            client.host = defaults.hostname;
                            client.port = defaults.port;
                            evts.update();
                            return false;
                        }
                    },
                    host: {
                        keyup(e) {
                            if (typeof e.keyCode === "number" && e.keyCode === 13) {
                                evts.host.change.call(this, e);
                                port.focus();
                            }
                            return false;
                        },
                        change(e) {
                            if (this.value.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/) !== null) {
                                client.host = this.value;
                            }
                            return false;
                        },
                        focus() {
                            evts.update();
                        }
                    },
                    port: {
                        keyup(e) {
                            let min = parseInt(this.min), max = parseInt(this.max);
                            if (this.value.match(/^[0-9]+$/) !== null) {
                                let val = parseInt(this.value);
                                if (val > min && val < max) {
                                    client.port = val;
                                }
                            }
                            if (typeof e.keyCode === "number" && e.keyCode === 13) {
                                host.focus();
                            }

                        },
                        change(e) {
                            return evts.port.keyup.call(this, e);
                        },
                        focus() {
                            evts.update();
                        }
                    },
                    close(e) {
                        e.preventDefault();
                        settings.querySelector('form').classList.add('bounceOut');
                        setTimeout(function () {
                            settings.querySelector('form').classList.remove('bounceOut');
                            settings.classList.add('hidden');
                        }, 1000);
                        return false;
                    },
                    check(e) {
                        e.preventDefault();
                        cktxt.classList.remove('success', 'error');
                        cktxt.innerHTML = 'Checking Connection...';
                        client.check(function () {
                            cktxt.classList.add('success');
                            cktxt.innerHTML = 'Connection success.';
                        }, function () {
                            cktxt.classList.add('error');
                            cktxt.innerHTML = 'Connection error.';
                        });
                        return false;
                    },
                    update(e) {
                        host.value = client.host;
                        port.value = client.port;
                        address.value = client.address;
                        cktxt.classList.remove('success', 'error');
                        cktxt.innerHTML = "";
                    }
                };
                settings.querySelectorAll('button').forEach(function (button) {
                    button.addEventListener('click', function (e) {
                        e.preventDefault();
                        return false;
                    });
                    button.addEventListener('mouseup', function (e) {
                        if (button.classList.contains('close-btn')) {
                            return evts.close(e);
                        }
                        if (button.classList.contains('check-btn')) {
                            return evts.check(e);
                        }
                        if (button.classList.contains('reset-btn')) {
                            trigger(settings, 'reset');
                        }
                        return false;
                    });
                });

                Object.keys(evts.main).forEach(function (evt) {
                    settings.addEventListener(evt, evts.main[evt]);
                });
                Object.keys(evts.host).forEach(function (evt) {
                    host.addEventListener(evt, evts.host[evt]);
                });
                Object.keys(evts.port).forEach(function (evt) {
                    port.addEventListener(evt, evts.port[evt]);
                });


            }
        };

        /**
        * Display button
        */
        if (target instanceof Element) {
            //cannot hover on mobile
            if (!/mobile/i.test(navigator.userAgent)) {
                target.classList.add('vid2kodi-target');
                Object.keys(events.target).forEach(function (evt) {
                    target.addEventListener(evt, events.target[evt]);
                });
            }
            target.appendChild(elements.button);
            target.appendChild(elements.notify);
            if (doc.querySelector('.vid2kodi-settings') === null) {
                doc.body.appendChild(elements.settings);
                events.settings();
            }
        }

        /**
        * Events
        */
        if (typeof video.src === "string") updatevideolink(video.src);
        Object.keys(events.video).forEach(function (evt) {
            video.addEventListener(evt, events.video[evt]);
        });
        Object.keys(events.button).forEach(function (evt) {
            elements.button.addEventListener(evt, events.button[evt]);
        });
        /**
         * Kodisend compatibility
         */
        self.send = function send() {
            self.notify(elements.sent);
            client.send(elements.button.dataset.src, function () {
                self.notify(elements.success);
            }, function () {
                self.notify(elements.error);
            });
        };
        self.settings = function settings() {
            let settings = doc.querySelector('.vid2kodi-settings');
            settings.classList.add('fadeIn');
            settings.classList.remove('hidden');
            setTimeout(function () {
                settings.classList.remove('fadeIn');
            }, 1000);
            settings.querySelector('[name="host"]').focus();
        };
        Object.defineProperty(elements.button, 'vid2kodi', {
            value: self, configurable: true
        });
        vid2kodistyles();
        console.debug(scriptname, 'started');
    }

    /**
     * Kodisend Behavior
     */
    let ksstylesapplied = false;
    function KodiSend(oltoolbar) {
        if (this === undef || this === window) return;
        if (!(oltoolbar instanceof Element)) return;
        const self = this, settings = new UserSettings({ enabled: true });
        let styles = `.esd .video-toolbar .kodisend-icon + .dl-icon {display: none!important;}`;

        onDocEnd(function () {
            if (!ksstylesapplied) {
                addcss(styles);
                ksstylesapplied = true;
            }
        });
        const ol = {
            toolbar: oltoolbar,
            download: oltoolbar.querySelector('.dl-btn')
        };


        let v2k;
        function findVid2Kodi() {
            if (v2k instanceof vid2kodi) return v2k;
            let target = template.button.closest('div[id]'), v2ktmp;
            if (target instanceof Element) {
                v2ktmp = target.querySelector('button.vid2kodi');
                if (v2ktmp instanceof Element) {
                    v2k = v2ktmp.vid2kodi;
                    return v2k;
                }
            }
        }
        const template = {
            dlicon: html2element(`<img class="kodisend-icon" src="${icon}" />`),
            button: html2element(`<a class="kodisend-btn left" href="#" title="KodiSend Settings"><img class="kodisend-icon" src="${icon}" /></a>`),
            disabled: `<img class="kodisend-icn" src="${icon}" />KodiSend Disabled.`,
            enabled: `<img class="kodisend-icn" src="${icon}" />KodiSend Enabled.`
        }, events = {
            button: {
                contextmenu(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },
                click(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                },
                mouseup(e) {
                    e.preventDefault();
                    if (e.button === 0) {
                        //toggle
                        self.toggle();
                    } else {
                        //settings
                        self.settings();
                    }
                    return false;
                }
            },
            dlbutton(e) {
                e.preventDefault();
                let vtok;
                if ((vtok = findVid2Kodi())) {
                    vtok.send();
                }
                return false;
            }

        };

        Object.assign(self, {
            notify(message) {
                let vtok;
                if ((vtok = findVid2Kodi())) {
                    vtok.notify(message);
                }
            },
            enable() {
                self.disable();
                settings.set('enabled', true);
                ol.download.addEventListener('click', events.dlbutton);
                ol.download.dataset.title = ol.download.title;
                ol.download.title = "Send to Kodi.";
                ol.download.querySelectorAll('.dl-icon').forEach(function (el) {
                    el.parentNode.insertBefore(template.dlicon, el);
                });
            },
            disable() {
                settings.set('enabled', false);
                ol.download.removeEventListener("click", events.dlbutton);
                if (template.dlicon.parentNode instanceof Element) {
                    template.dlicon.parentNode.removeChild(template.dlicon);
                }
                if (ol.download.dataset.title !== undef) {
                    ol.download.title = ol.download.dataset.title;
                }
            },
            toggle() {
                settings.set('enabled', settings.get('enabled') === false);
                if (settings.get('enabled') === true) {
                    self.notify(template.enabled);
                    return self.enable();
                }
                self.notify(template.disabled);
                return self.disable();

            },
            settings() {
                let vtok;
                if ((vtok = findVid2Kodi())) {
                    vtok.settings();
                }
            }
        });
        /**
         * Add KodiSend icon
         */
        ol.toolbar.insertBefore(template.button, ol.toolbar.firstChild);
        if (settings.get('enabled') === true) {
            self.enable();
        }
        /**
         * Attach events
         */
        Object.keys(events.button).forEach(function (evt) {
            template.button.addEventListener(evt, events.button[evt]);
        });

    }



    onBody(function () {
        (new ElementObserver('video', function (el, obs) {
            new vid2kodi(el);
        }));
        (new ElementObserver({
            selector: '.esd div.video-toolbar',
            onload(el, obs) {
                new KodiSend(el);
            },
            timeout: 5000
        }));
    });


})(document);