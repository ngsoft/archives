// ==UserScript==
// @name        Kurina Official
// @namespace   https://github.com/ngsoft
// @version     1.1
// @description UI Remaster
// @author      daedelus
// @icon        https://kurina.co/wp-content/uploads/2019/02/cropped-icon-32x32.png
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kurina.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kurina.user.js
// @compatible  firefox+greasemonkey(3.17)
// @compatible  firefox+tampermonkey
// @compatible  chrome+tampermonkey
// @grant       none
// @include     *://kurina*.*/*
// ==/UserScript==


(function(doc, undef) {

    /* jshint expr: true */
    /* jshint -W018 */

    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;


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
    console.debug(scriptname, 'Started.');

    /**
     * Styles
     */
    onBody(function() {

        let styles = `
                .hidden, .hidden *,
                #main-sidebar .sidebar-content-inner > div:first-of-type, div[class*="ads-"], div[id*="_ad_"]
                {position: fixed; right: auto; bottom: auto;top:-100%;left: -100%;
                height:1px; width:1px; opacity: 0;max-height:1px; max-width:1px;display:inline;}
        `;
        addcss(styles);
        new ElementObserver({
            selector: 'div[style*="position: static !important;"]',
            onload(el, obs) {
                el.remove();
            }
        });
    });




}(document));