// ==UserScript==
// @name         Video to Kodi
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Send Stream URL to Kodi using jsonRPC (Works with ol.user.js)
// @author       daedelus
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhUExURQAAAAAAAAAAAAAAAFq/5////wAAAAAAAAEGBwABAQEFBgIGCAIGCBNDVwIFBwAAAA83RxA3RydASwAAAAQGBwUHCDQ0NFq/51q/51W95lq/5yubxyuYxFa+5v///yyeyyycyFq/52jE6f3//y6j0i6j0i6k0yaHrjaRteLl5t/i4+Pk5EC14zKt3j+041q/5zCt3jOv4DGv4Vq/5yqWwjCt3jGv4TSw4Tedxjeexjqx4Duz4j6040O240O25I7T7pPV75zY8JzY8ZzZ8aHQ477c6L/d6cDd6cDe6cLg6////zRLWWYAAAA0dFJOUwADBAYQEB0fIScnJygpKjAyMjIzR0dOj5KVn6Kor6+wscHBw8nKzdHV1djY5u/v7/L0/v77n8h1AAABGUlEQVQ4y5XS2VbCQAyA4VTAFcUFcUfqMi51F6K44YZo3v+BnLSdJiNtz7G339/TZDoA/3qqa5e362W+83KHz2GJP6F9HsNyLywyLyhq4rlFra0c8XV/zEn7gMgvqm0i3+lnz5uPdMD+ff8Q6vl1kHhPJuX9VOA82yXeXwJxV2zwflnAPkrdFps2OEMV+I54YYNrFbDTpzie22BXgtiJ3iTYssG0cQH711AXB/M85axJgtj7XS7eU18K4kXnDAeJ9zAuPrQD1E3y8VGf53OFuC0iSt/HrNAO0Iz0/lycLAfeD29G+ny6w9PWxJ8rs3qszgePWpWxS7dgxA8XKznXtm7Eg9yL74oid0WxA8x0bq62SxxgaqUx6fsvOX95dVWRzekAAAAASUVORK5CYII=
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/vid2kodi.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/vid2kodi.user.js
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @include     *
// ==/UserScript==

(function(doc, undef) {



    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    const scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;
    const icon = GMinfo.script.icon;

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

    class UserSettings {
        constructor(defaults) {
            if (typeof defaults === 'object') {
                Object.keys(defaults).forEach(function(k) {
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
                timeout: 0
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

    class KodiClient {

        get host() {
            if (this.__host__) return this.__host__;
            return "127.0.0.1";
        }
        set host(v) {
            if (/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(v)) {
                this.__host__ = v;
            }

        }

        get port() {
            if (this.__port__) return this.__port__;
            return "8080";
        }
        set port(v) {
            if (typeof v === "number" && v > 0 && v < 65533) this.__port__ = v;

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
                    headers: {"Content-Type": "application/json"},
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

        constructor(host, port) {
            if (typeof host === "string") this.host = host;
            if (typeof port === "number") this.port = port;
        }

    }

    function vid2kodi(videoElement) {
        if (this === undef || this === window) {
            return;
        }
        if (!(videoElement instanceof Element)) return;
        const self = this, defaults = {
            hostname: '127.0.0.1',
            port: 8080
        }, settings = new UserSettings(defaults), client = new KodiClient(settings.get("host"), settings.get("port"));

        const template = {
            container: html2element(`<div class="vid2kodi-container"/>`),
            icon: html2element(`<div class="vid2kodi"><img class="vid2kodi-icn" src="${icon}" /></div>`),
            settings: html2element(`<div class="vid2kodi-settings" />`),
            notify: html2element(`<div class="vid2kodi-notify" />`)
        };

        const target = videoElement.parentElement;




    }



    onBody(function() {
        (new ElementObserver('video', function(el, obs) {
            new vid2kodi(el);
        }));
    });









})(document);