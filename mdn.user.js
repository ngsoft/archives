// ==UserScript==
// @name        MDN + PHP Web Docs
// @namespace   https://github.com/ngsoft
// @version     2.3
// @description Use MDN Web Docs and PHP UI to store locale and auto redirect to the choosen on every pages
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
                    if (this.isValid(lang)) localStorage.setItem(this.key, lang);
                    else if (lang === null) localStorage.removeItem(this.key);
                }

                is(lang){
                    return this.isValid(lang) ? lang === this.current : false;
                }

                isValid(lang){
                    return typeof lang === typeof "" ? /^[a-z]{2,3}(?:[-_][a-z]{2,3})?$/i.test(lang) : false;
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
                    if (el instanceof EventTarget) type.split(/\s+/).forEach(t => el.addEventListener(t, callback, capture === true));
                    else if (el instanceof NodeList) el.forEach(x => self.on(x, type, callback, capture));
                }
                off(el, type, callback, capture){
                    if (typeof callback !== "function" || typeof type !== typeof "") return;
                    const self = this;
                    el = this._getTarget(el);
                    if (el instanceof EventTarget) type.split(/\s+/).forEach(t => el.removeEventListener(t, callback, capture === true));
                    else if (el instanceof NodeList) el.forEach(x => self.off(x, type, callback, capture));
                }
                trigger(el, type, bubbles, cancelable){
                    if (typeof type !== typeof "") return;
                    const self = this;
                    el = this._getTarget(el);
                    if (el instanceof EventTarget){
                        type.split(/\s+/).forEach(t => {
                            el.dispatchEvent(new Event(t, {bubbles: bubbles !== false, cancelable: cancelable !== false}));
                        });
                    }
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
                if(a instanceof Element){
                    if (locale.length > 0) {
                        lang.current = locale;
                        location.replace(a.href); //no history change
                    } else location.href = a.href; //must be contribute page
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
    if (location.hostname.match(/php.net$/i) !== null) {

        //detects locales and redirects to the stored one
        doc.querySelectorAll('select#changelang-langs').forEach(x => {
            
            x.querySelectorAll('option').forEach(o => {
                let
                        locale = o.value.split('/').shift(),
                        uri = '/manual/' + o.value;
                        
                if (lang.is(locale) && location.pathname !== uri) location.replace(uri);
            });
            //remove default event
            x.onchange = null;

        });
        //replace the event
        tools.on('form#changelang', 'change', e => {
            let t = e.target.closest('select#changelang-langs');
            if(t !== null){
                e.preventDefault();
                let
                        value = t.value,
                        locale = value.split('/').shift();

                if (lang.isValid(locale)) lang.current = locale;
                //restore default event
                t.form.submit();
            }
        });
    }

})(document);