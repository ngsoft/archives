// ==UserScript==
// @name        KodiRPC
// @namespace   https://github.com/ngsoft
// @version     1.1.2
// @description Send Stream URL to Kodi using jsonRPC
// @author      daedelus
// @icon        https://kodi.tv/favicon.ico
// @run-at      document-end
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kodirpc.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kodirpc.user.js
// @compatible  firefox+greasemonkey(3.17)
// @compatible  firefox+tampermonkey
// @compatible  chrome+tampermonkey
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @include     *
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


    class KodiClient {

        get host() { return GM_getValue("host") || "127.0.0.1"; }

        set host(host) {
            if (typeof host === s && /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(host)) {
                GM_setValue('host', host);
            }
        }
        get port() { return GM_getValue("port") || 8080; }
        set port(port) {
            if (typeof port === n && port > 1 && port < 65536) GM_setValue("port", port);
        }

        get address() {
            return "http://" + this.host + ":" + this.port + "/jsonrpc";
        }

        check(success, error, address) {

            let server = typeof address === s ? address : this.address, self = this;
            GM_xmlhttpRequest({
                method: 'GET',
                url: server,
                onload(xhr) {
                    if (xhr.status === 200) {
                        if (typeof success === "function") success.call(self);

                    }
                },
                onerror() {
                    if (typeof error === "function") error.call(self);
                }
            });
        }

        send(link, success, error) {
            if (typeof link === s && /^http/.test(link)) {
                let server = this.address, self = this, data = JSON.stringify({
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
                                    if (typeof success === f) return success.call(self, link);
                                }
                                if (typeof error === f) error.call(self, link);
                            } catch (e) {
                            }

                        }

                    },
                    onerror() {
                        if (typeof error === f) error.call(self, link);
                    }
                });

            }
        }
        constructor() {

        }

    }

    const client = new KodiClient();

    const icon = `data:image/png;base64,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`;
    const settingsico = `<svg class="square" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M29.181 19.070c-1.679-2.908-0.669-6.634 2.255-8.328l-3.145-5.447c-0.898 0.527-1.943 0.829-3.058 0.829-3.361 0-6.085-2.742-6.085-6.125h-6.289c0.008 1.044-0.252 2.103-0.811 3.070-1.679 2.908-5.411 3.897-8.339 2.211l-3.144 5.447c0.905 0.515 1.689 1.268 2.246 2.234 1.676 2.903 0.672 6.623-2.241 8.319l3.145 5.447c0.895-0.522 1.935-0.82 3.044-0.82 3.35 0 6.067 2.725 6.084 6.092h6.289c-0.003-1.034 0.259-2.080 0.811-3.038 1.676-2.903 5.399-3.894 8.325-2.219l3.145-5.447c-0.899-0.515-1.678-1.266-2.232-2.226zM16 22.479c-3.578 0-6.479-2.901-6.479-6.479s2.901-6.479 6.479-6.479c3.578 0 6.479 2.901 6.479 6.479s-2.901 6.479-6.479 6.479z"></path></svg>`;

    function KodiRPCModule(element) {
        if (this instanceof KodiRPCModule && typeof element === o && typeof element.addEventListener === f && typeof element.KRPCM === u) {
            const self = this;
            Object.defineProperty(element, 'KRPCM', {
                value: self, configurable: true
            });
            element.addEventListener('kodirpc.settings', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let open, close;
                if (typeof e.data !== u) {
                    if (typeof e.data.open === f) open = e.data.open;
                    if (typeof e.data.close === f) open = e.data.close;
                }
                new KodiRPCSettings(open, close);


            });
            element.addEventListener('kodirpc.send', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let link, success, error;
                if (typeof e.data !== u) {
                    if (typeof e.data.link === s) link = e.data.link;
                    if (typeof e.data.success === f) success = e.data.success;
                    if (typeof e.data.error === f) error = e.data.error;
                    client.send(link, success, error);
                }
            });

            trigger(element, 'kodirpc.ready');


            console.debug("KodiRPC Module version", GMinfo.script.version, "started");
        }
    }


    /**
     * UserScript Settings
     */
    function KodiRPCSettings(open, close) {
        KodiRPCSettings.loadTheme();

        const template = `<div class="kodirpc-settings" oncontextmenu="return false;">
                            <form>
                                <fieldset class="fadeIn">
                                    <legend>KodiRPC Settings</legend>
                                    <button class="close-bt" name="close">&times;</button>
                                    <div class="form-el">
                                        <label>Hostname</label>
                                        <input type="text" name="host" value="${client.host}" placeholder="Host" required />
                                    </div>
                                    <div class="form-el">
                                        <label>Port</label>
                                        <input type="number" name="port" value="${client.port}" placeholder="Port" min="1" max="65535" required />
                                    </div>
                                    <div class="form-footer">
                                        <span class="check-connection"></span>
                                        <button class="reset-bt" type="reset" name="reset">Reset</button>
                                        <button class="check-bt" name="check">Check</button>
                                        <button class="save-bt" name="save">Save</button>
                                    </div>
                                </fieldset>
                            </form>
                        </div>`;
        const btevents = {
            close() {
                self.elements.fieldset.classList.remove('fadeIn', 'bounceOut');
                self.elements.fieldset.classList.add('bounceOut');
                setTimeout(() => {
                    self.close();
                }, 750);
            },
            save() {
                self.save();
                btevents.close();
            },
            reset() {
                self.reset();
                self.save();
            },
            check() {
                const msgbox = self.elements.root.querySelector('.check-connection');
                let address = "http://" + self.elements.inputs.host.value + ":" + self.elements.inputs.port.value + '/jsonrpc';
                msgbox.classList.remove('check-success', 'check-error');
                msgbox.innerHTML = "Checking connection, please wait ...";
                self.check(address, response => {
                    msgbox.classList.add("check-" + (response === true ? "success" : "error"));
                    msgbox.innerHTML = "Connection " + (response === true ? "success." : "error.");
                    setTimeout(() => {
                        msgbox.innerHTML = "";
                        msgbox.classList.remove('check-success', 'check-error');
                    }, 10000);


                });
            }
        };
        const self = this, events = {
            root: {
                click(e) {
                    //if (e.button !== 0) return;
                    let target = e.target, button, name;
                    if ((button = target.closest('button')) !== null) {
                        name = button.name;
                        if (typeof btevents[name] === f) {
                            btevents[name].call(this, e);
                            e.preventDefault();
                            e.stopPropagation();
                            return;
                        }
                    }
                    if (target.closest('fieldset') !== null) {
                        return;
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    self.elements.inputs.host.focus();
                    //btevents.close();
                }

            },
            form: {
                submit(e) {
                    e.preventDefault();
                    e.stopPropagation();
                },
                change(e) {
                    events.form.submit.call(this, e);
                },
                reset(e) {
                    events.form.submit.call(this, e);
                },
                keydown(e) {

                    switch (e.keyCode) {
                        //tab
                        case 9:
                        //enter
                        case 13:
                            if (e.target === self.elements.inputs.host) {
                                self.elements.inputs.port.focus();
                            } else {
                                self.elements.inputs.host.focus();
                            }
                            e.preventDefault();
                            e.stopPropagation();

                            break;
                        //escape
                        case 27:
                            btevents.close();
                            e.preventDefault();
                            e.stopPropagation();
                            break;

                        default:
                            break;
                    }
                }
            },
            inputs: {
                host: {
                    change(e) {
                        if (!(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(this.value))) {
                            this.value = client.host;
                            self.elements.buttons.save.disabled = true;
                        } else {
                            if (e.type === "change") self.elements.buttons.save.disabled = null;
                        }
                    },
                    focus(e) {
                        events.inputs.host.change.call(this, e);
                    }
                },
                port: {
                    change(e) {
                        let min = parseInt(this.min), max = parseInt(this.max);
                        if (/^[0-9]+$/.test(this.value)) {
                            let val = parseInt(this.value);
                            if (val > min && val < max) {
                                if (e.type === "change") self.elements.buttons.save.disabled = null;
                                return;
                            }
                        }
                        this.value = client.port;
                        self.elements.buttons.save.disabled = true;


                    },
                    focus(e) {
                        events.inputs.port.change.call(this, e);
                    }
                }

            }

        };

        Object.assign(self, {
            elements: {
                root: html2element(template),
                inputs: {},
                buttons: {}
            }

        });

        self.elements.form = self.elements.root.querySelector('form');
        self.elements.fieldset = self.elements.root.querySelector('fieldset');

        self.elements.root.querySelectorAll('input[name]').forEach(input => {
            self.elements.inputs[input.name] = input;
        });
        self.elements.root.querySelectorAll('button[name]').forEach(button => {
            self.elements.buttons[button.name] = button;
        });
        Object.defineProperty(self.elements.root, 'KodiRPCSettings', { value: self, configurable: true });
        /**
         * Events
         */
        if (typeof open === f) self.elements.root.addEventListener('kodisettings.open', open, { once: true });
        if (typeof close === f) self.elements.root.addEventListener('kodisettings.close', close, { once: true });
        Object.keys(events.root).forEach(evt => {
            self.elements.root.addEventListener(evt, events.root[evt]);
        });
        Object.keys(events.form).forEach(evt => {
            self.elements.form.addEventListener(evt, events.form[evt]);
        });
        Object.keys(events.inputs).forEach(input => {
            Object.keys(events.inputs[input]).forEach(evt => {
                self.elements.inputs[input].addEventListener(evt, events.inputs[input][evt]);
            });
        });


        self.open();

    }

    Object.assign(KodiRPCSettings, {
        stylesapplied: false,
        loadTheme() {
            if (this.stylesapplied) return;
            this.stylesapplied = true;
            let css = `
                .kodirpc-settings {position: fixed; top:0;left:0; right:0; bottom:0; z-index: 2147483647; background-color: rgba(0, 0, 0, 0.45);}
                .kodirpc-settings form{
                    position: relative;width: 80%; max-width: 960px; height: 100%; margin: 0 auto; overflow: hidden;
                }
                .kodirpc-settings form, .kodirpc-settings input, .kodirpc-settings button, .kodirpc-settings legend{
                    font-family: Arial,Helvetica,sans-serif;line-height: 1.5;font-weight: 700;
                    color:#333;font-size: 16px;
                }
                .kodirpc-settings fieldset{
                    position: relative; margin: 50px 0 0 0; min-height:128px;padding: 48px 24px 0 24px;
                    background-color: #FFF; border-radius: 6px;border: none;
                }
                .kodirpc-settings legend{
                    position: absolute; display: block; top:0;right: 0;left: 0;
                    padding: 14px 16px 16px 56px;width: 100%;overflow: hidden;
                    background-color: rgba(0,0,0,.03);border-bottom: 1px solid rgba(0,0,0,.125);
                }
                .kodirpc-settings legend:before{
                    content: "";display: inline-block;
                    background: url('${icon}') no-repeat;background-size: cover;padding: 16px;
                    position: absolute;top:10px;left:12px;
                }
                .kodirpc-settings .form-el{
                    text-align: left; padding: 16px;margin: 16px 0;
                }
                .kodirpc-settings .form-el + .form-el{
                    border-top: 1px solid rgba(0,0,0,.125);margin-top:0;
                }
                .kodirpc-settings .form-el label{
                    display: block;margin: 0 0 4px 0;
                }
                .kodirpc-settings .form-el input{
                    width: 100%;padding: 12px 20px;margin: 8px 0;box-sizing: border-box;
                    border-radius: 4px; background-color: rgba(0,0,0,.03);border: 1px solid rgba(0,0,0,.125);
                    -moz-appearance: textfield;-webkit-appearance: none;-o-appearance: none;text-align: center;
                }
                .kodirpc-settings .form-el label + input{
                    margin-top:0;
                }
                .kodirpc-settings .form-el input:focus{
                    border: 1px solid rgb(0, 153, 204);
                }

                .kodirpc-settings .form-footer{
                    display: block; margin:24px -24px 0 -24px; padding: 8px 24px 12px 24px; text-align: right;
                    background-color: rgba(0,0,0,.03);border-top: 1px solid rgba(0,0,0,.125);
                }

                .kodirpc-settings button{
                    padding: 8px 24px;box-sizing: border-box;border-radius: 4px; border: 0;cursor: pointer;
                    background-color: rgba(0,0,0,.03);border: 1px solid rgba(0,0,0,.125);
                }
                .kodirpc-settings .form-footer button{
                    margin-right: 16px;background-color: rgba(0,0,0,.125);
                }
                .kodirpc-settings button:hover{
                    background-color: rgba(0,0,0,.125); border-color: rgba(0,0,0,.03);
                }
                .kodirpc-settings .close-bt{padding: 3px 16px;position: absolute;top: 10px;right: 12px;}
                
                .kodirpc-settings .save-bt{
                    color: rgb(219, 40, 40);
                }
                .kodirpc-settings .save-bt:hover, .kodirpc-settings .save-bt:active{
                    background-color: rgb(219, 40, 40); color: rgb(255, 255, 255);
                }
                .kodirpc-settings  .check-bt{
                    color: rgb(30, 130, 205);
                }
                .kodirpc-settings .check-bt:hover, .kodirpc-settings .check-bt:active{
                    background-color: rgb(30, 130, 205);color: rgb(255, 255, 255);
                }
                .kodirpc-settings  .reset-bt{
                    color: rgb(28, 29, 30);
                }
                .kodirpc-settings .reset-bt:hover, .kodirpc-settings .reset-bt:active{
                    background-color: rgb(28, 29, 30);color: rgb(255, 255, 255);
                }
                
                .kodirpc-settings .check-connection{
                    float: left; padding: 8px;
                }
                .kodirpc-settings .check-success{
                    color: rgb(40, 167, 69);
                }
                .kodirpc-settings .check-error{
                    color: rgb(220, 53, 69);
                }
                .kodirpc-settings [disabled]{
                    pointer-events: none;color: gray;
                }
                
                @media (max-height: 480px) {
                    .kodirpc-settings form{width: 100%;}
                    .kodirpc-settings fieldset{height: 100%; margin: 0;}
                }
                
                
                @keyframes bounceOut {
                    20% {-webkit-transform: scale3d(.9, .9, .9);transform: scale3d(.9, .9, .9);}
                    50%, 55% {opacity: 1;-webkit-transform: scale3d(1.1, 1.1, 1.1);transform: scale3d(1.1, 1.1, 1.1);}
                    100% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}
                }
                @keyframes fadeIn {from {opacity: 0;}to {opacity: 1;}}
                .bounceOut {animation-name: bounceOut;animation-duration: .75s;animation-fill-mode: both;}
                .fadeIn {animation-name: fadeIn;animation-duration: .75s;animation-fill-mode: both;}
                .no-select, .kodirpc-settings *:not(input){-webkit-touch-callout: none;-webkit-user-select: none;-moz-user-select: none;user-select: none;}
                
                
            `;
            let node = doc.createElement('style');
            node.setAttribute('type', "text/css");
            node.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.head.appendChild(node);
        }

    });

    KodiRPCSettings.prototype = {
        open(callback) {
            if (typeof callback === f) {
                this.elements.root.addEventListener('kodisettings.open', callback, { once: true });
            }
            this.elements.buttons.save.disabled = true;
            doc.body.insertBefore(this.elements.root, doc.body.firstChild);
            this.elements.inputs.host.focus();
            trigger(this.elements.root, 'kodisettings.open');
        },
        close(callback) {
            if (typeof callback === f) {
                this.elements.root.addEventListener('kodisettings.close', callback, { once: true });
            }
            trigger(this.elements.root, 'kodisettings.close');
            doc.body.removeChild(this.elements.root);
        },
        save(callback) {
            if (typeof callback === f) {
                this.elements.root.addEventListener('kodisettings.save', callback, { once: true });
            }
            Object.values(this.elements.inputs).forEach(input => {
                let value = input.value;
                if (/^[0-9]+$/.test(value)) {
                    value = parseInt(value);
                }
                client[input.name] = value;
            });
            trigger(this.elements.root, 'kodisettings.save');
        },
        reset(callback) {
            if (typeof callback === f) {
                this.elements.root.addEventListener('kodisettings.reset', callback, { once: true });
            }
            this.elements.inputs.host.value = "127.0.0.1";
            this.elements.inputs.port.value = 8080;
            this.elements.buttons.save.disabled = true;
            trigger(this.elements.root, 'kodisettings.reset');
        },
        check(address, callback) {
            const self = this;
            if (typeof address === s && /^http/.test(address) && typeof callback === f) {
                client.check(() => {
                    callback.call(self.elements.root, true, self);
                }, () => {
                    callback.call(self.elements.root, false, self);
                }, address);
            }
        }

    };


    /**
     * Standalone Mode (not as module)
     */

    function KodiRPCUI(video) {
        KodiRPCUI.loadTheme();
        const template = `<div class="kodirpc-ui">
                            <div class="kodirpc-ui-toolbar">
                                <div class="kodirpc-ui-notify"></div>
                                <button class="kodi-bt" name="send" title="send Link to Kodi">
                                    <span class="kodi-icn"><img src="${icon}" /></span>
                                </button>
                                <button class="cog-bt" name="settings" title="settings">
                                    <span class="cog-icn">${settingsico}</span>
                                </button>
                            </div>
                            
                          </div>`;

        const self = this, events = {
            root: {
                click(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let btnclicked = e.target.closest('button');
                    if (btnclicked !== null) {
                        btnevents[btnclicked.name].call(this, e);
                    }

                }
            }
        }, btnevents = {
            settings() {
                self.settings();
            },
            send() {
                let src = "", source;
                if (/^http/.test(video.src)) src = video.src;
                else if ((source = video.querySelector('source[src^="http"]')) !== null) {
                    src = source.src;
                }
                if (typeof src === s && /^http/.test(src)) {
                    self.send(src);
                }
            }
        };
        Object.assign(self, {
            elements: {
                root: html2element(template),
                buttons: {}
            },
            video: video
        });
        self.elements.root.querySelectorAll("button[name]").forEach(button => {
            self.elements.buttons[button.name] = button;
        });
        self.elements.notify = self.elements.root.querySelector(".kodirpc-ui-notify");
        Object.keys(events.root).forEach(evt => {
            self.elements.root.addEventListener(evt, events.root[evt]);
        });
        video.addEventListener('play', () => {
            self.elements.root.hidden = true;
        });
        video.addEventListener('pause', () => {
            self.elements.root.hidden = null;
        });
        let started = false;
        function start() {
            if (started) return;
            started = true;
            new KodiRPCModule(doc.body);
            doc.body.insertBefore(self.elements.root, doc.body.firstChild);
        }

        function stop() {
            started = false;
            doc.body.removeChild(self.elements.root);
        }


        const obs = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                //source change
                if (mutation.target === video && mutation.type === "attributes" && mutation.attributeName === "src") {
                    start();
                }
                if (mutation.type === "childList" && Array.from(mutation.removedNodes).includes(video)) {
                    stop();
                }
                if (mutation.type === "childList" && Array.from(mutation.addedNodes).includes(video) && typeof video.src === s && /^http/.test(video.src)) {
                    start();
                }
            });


        });

        obs.observe(video.parentElement, {
            childList: true, subtree: true, characterData: true, attributes: true
        });

        start();
        console.debug(scriptname, "started");
    }

    Object.assign(KodiRPCUI, {
        stylesapplied: false,
        loadTheme() {
            if (this.stylesapplied === true) return;
            this.stylesapplied = true;
            let css = `
                .kodirpc-ui button, .kodirpc-ui button:hover, .kodirpc-ui button:active, .kodirpc-ui, .kodirpc-ui-notify{
                    margin:0; padding:0; border: none;background-color: transparent;display: inline-block;
                    font-family: Arial,Helvetica,sans-serif;line-height: 1.5;font-weight: 700;color:#333;font-size: 16px;
                }
                .kodirpc-ui{
                    position: fixed; top: 70px; right: 10%;z-index: 2147483646; background-color: rgba(255, 255, 255, 0.45);
                    text-align: right;display: inline-block; border-radius:4px;
                }
                .kodirpc-ui-toolbar, .kodirpc-ui-notify{
                    display: inline-block;
                }
                .kodirpc-ui-toolbar [class*="-icn"]{vertical-align: middle; display: inline-block; width: 32px; height: 32px; margin:0 8px; line-height:0;}
                .kodirpc-ui-toolbar [class*="-icn"] *{width: 100%; height:100%;}
                .kodirpc-ui-notify > div{display: none;}
                .kodirpc-ui-notify > div:first-child{margin: 0 16px 0 32px; display: inline-block;}
                
                .kodirpc-ui button, .kodirpc-ui button:hover, .kodirpc-ui button:active{
                    padding: 8px 16px;border-radius:0;
                }
                .kodirpc-ui button:hover{
                    background-color: rgba(0,0,0,.125);
                }
                [hidden]{display: none !important; opacity:0!important; z-index: -1 !important;}
            `;

            let node = doc.createElement('style');
            node.setAttribute('type', "text/css");
            node.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.head.appendChild(node);
        }
    });
    KodiRPCUI.prototype = {

        settings() {
            trigger(this.elements.root, 'kodirpc.settings');

        },
        send(link) {
            const self = this;
            self.notify('Sending link to Kodi');
            trigger(this.elements.root, 'kodirpc.send', {
                link: link,
                success() {
                    self.notify('Link sent to Kodi.');
                },
                error() {
                    self.notify('An error has occured.');
                }
            });

        },
        notify(message) {
            if (typeof message === s && message.length > 0) {
                let notification = html2element(`<div class="fadeInRight">${message}</div>`);
                this.elements.notify.insertBefore(notification, this.elements.notify.firstChild);
                setTimeout(() => {
                    this.elements.notify.removeChild(notification);
                }, 2000);
            }
        }

    };




    onDocEnd(() => {
        if (typeof doc.body.KodiRPCModule !== u) {
            new KodiRPCModule(doc.body);
            return;
        }
        find('video[src^="http"], video source[src^="http"]', (element, obs) => {
            new KodiRPCUI(element.closest('video'));
            obs.stop();
        }, 5000);

    });



})(document);