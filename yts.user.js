// ==UserScript==
// @name         YTS
// @namespace    https://github.com/ngsoft
// @version      2.0
// @description  Anti ads
// @author       daedelus
// @include     *://yts.*/*
// @icon        https://yts.am/assets/images/website/favicon-32x32.png
// @noframes
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/yts.user.js
// @grant none
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


    //starting app
    onDocIddle(function() {

        console.debug(scriptname, 'Started.');

        new ElementObserver({
            selector: 'div[style*="position: static !important;"], div[class*="box-bordered"]',
            onload(el, obs) {
                el.remove();
            }
        });


    });


})(document);





