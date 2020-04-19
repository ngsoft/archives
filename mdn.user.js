// ==UserScript==
// @name        MDN + PHP Web Docs
// @namespace   https://github.com/ngsoft
// @version     2.2
// @description Use MDN Web Docs UI and PHP UI to store lang and auto redirect to the choosen lang
// @author      daedelus
// @include     *://developer.mozilla.org/*
// @include     *://*php.net/manual/*
// @noframes
// @grant       none
// run-at       document-end
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// @icon        https://developer.mozilla.org/favicon.ico
// ==/UserScript==

(function(doc, undef){

    if (typeof Storage === 'undefined' || !window.hasOwnProperty('localStorage') || !(window.localStorage instanceof Storage)) {
        return;
    }

    const
            GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null)),
            UUID = GMinfo.script.uuid,
            lang = (new class {

                get key(){
                    return UUID + ":" + "locale";
                }

                get current(){
                    return localStorage.getItem(this.key) || "";
                }

                set current(lang){
                    if (typeof lang === typeof "" ? lang.length > 0 : false) localStorage.setItem(this.key, lang);
                    else if (lang === null) localStorage.removeItem(this.key);
                }

                is(lang){
                    return typeof lang === typeof "" ? (lang.length > 0 ? lang === this.current : false) : false;
                }

            }),
            tools = (new class {

                _getTarget(el){
                    if (typeof el === typeof "") return doc.querySelectorAll(el);
                    if (el instanceof Element ? true : el instanceof NodeList) return el;
                    return null;
                }


                on(el, type, callback, capture){
                    if (typeof callback !== "function" || typeof type !== typeof "") return;
                    const self = this;
                    el = this._getTarget(el);
                    if (el instanceof EventTarget) el.addEventListener(type, callback, capture === true);
                    else if (el instanceof NodeList) el.forEach(x => self.on(x, type, callback, capture));
                }
                off(el, type, callback, capture){
                    if (typeof callback !== "function" || typeof type !== typeof "") return;
                    const self = this;
                    el = this._getTarget(el);
                    if (el instanceof EventTarget) el.removeEventListener(type, callback, capture === true);
                    else if (el instanceof NodeList) el.forEach(x => self.off(x, type, callback, capture));
                }
                trigger(el, type, bubbles, cancelable){
                    if (typeof type !== typeof "") return;
                    const self = this;
                    el = this._getTarget(el);
                    if (el instanceof EventTarget) el.dispatchEvent(new Event(type, {bubbles: bubbles !== false, cancelable: cancelable !== false}));
                    else if (el instanceof NodeList) el.forEach(x => self.trigger(x, type, callback));
                }
            });






    /**
     * developer.mozilla.org
     * just override events
     */

    if (location.hostname === "developer.mozilla.org") {

        tools.on(doc.querySelector('#language-menu'), "click", e => {
            let t = e.target.closest('li[lang]');
            if (t !== null) {
                e.preventDefault();
                let locale = t.getAttribute('lang') || "", a = t.firstElementChild;
                if (locale.length > 0 ? a instanceof Element : false) {
                    lang.current = locale;
                    location.replace(a.href);
                }
            }
        });


        doc.querySelectorAll('#language-menu li[lang]').forEach(li => {
            let locale = li.getAttribute('lang') || "", a = li.firstElementChild;
            if (lang.is(locale) && (a instanceof Element ? location.href !== a.href : false)) location.replace(a.href);

        });



    }

    /**
     * php.net
     * Add a button and override event
     */
    if (location.host.match(/php.net$/i) !== null) {


    }

})(document);