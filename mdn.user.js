// ==UserScript==
// @name        MDN + PHP Web Docs
// @namespace   https://github.com/ngsoft
// @version     2.0.1
// @description Use MDN Web Docs UI and PHP UI to store lang and auto redirect to the choosen lang
// @author      daedelus
// @include     *://developer.mozilla.org/*
// @include     *://*php.net/manual/*
// @noframes
// @grant       none
// run-at       document-end
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// ==/UserScript==

(function() {

    if (typeof Storage === 'undefined' || !window.hasOwnProperty('localStorage') || !(window.localStorage instanceof Storage)) {
        return;
    }

    var lang = localStorage.getItem('lang'), langs;

    function selectlang(newlang) {
        if (typeof newlang === typeof "") {
            localStorage.setItem('lang', newlang);
            lang = newlang;
        }
    }

    function disablelang() {
        localStorage.removeItem('lang');
        lang = null;
    }

    let tools = {
        on(el, evt, callback, capture) {
            if (typeof callback !== "function" || typeof evt !== typeof "") {
                return;
            }
            if (el instanceof Element) {
                el.addEventListener(evt, callback, capture === true);
            } else if (el instanceof NodeList) {
                Array.from(el).forEach(x => tools.on(x, evt, callback, capture));
            }

        },
        off(el, evt, callback, capture) {
            if (typeof callback !== "function" || typeof evt !== typeof "") {
                return;
            }
            if (el instanceof Element) {
                el.removeEventListener(evt, callback, capture === true);
            } else if (el instanceof NodeList) {
                Array.from(el).forEach(x => tools.off(x, evt, callback, capture));
            }

        },
        trigger(el, evt, bubbles, cancelable) {
            if (typeof evt !== typeof "") {
                return;
            }
            if (el instanceof Element) {
                el.dispatchEvent(new Event(evt, {bubbles: bubbles !== false, cancelable: cancelable !== false}));
            } else if (el instanceof NodeList) {
                Array.from(el).forEach(x => tools.trigger(x, evt, callback));
            }
        }
    };



    /**
     * developer.mozilla.org
     * just override events
     */

    if (location.host === "developer.mozilla.org") {

        if (!(langs = document.querySelectorAll('#languages-menu-submenu ul#translations bdi > a')).length) {
            return;
        }
        let  btauto;

        Array.from(langs).forEach(function(element) {
            tools.on(element, 'click', disablelang);
        });
        if ((btauto = document.getElementById('locale-permanent-yes'))) {
            tools.on(btauto, 'click', function() {
                selectlang(this.dataset.locale);
            });
        }
        if (lang !== null) {
            Array.from(langs).forEach(function(element) {
                if (element.dataset.locale && lang === element.dataset.locale) {
                    //redirect without new entry in the history
                    window.location.replace(element.href);
                }
            }.bind(this));
        }
    }

    /**
     * php.net
     * Add a button and override event
     */
    if(location.host.match(/php.net$/i) !== null){

        if ((langs = document.querySelector('#layout-content #changelang select#changelang-langs')) === null) {
            return;
        }
        Array.from(langs.children).forEach(x => x.style.color = "#333");

        function getSelectedLang() {
            let el = langs.querySelector(`[value="${langs.value}"]`);
            return el !== null ? el.innerText : el;
        }

        function redirectToLang(value) {
            if (typeof value === typeof "" && value.length > 0) {
                let u = new URL(location.href);
                u.pathname = '/manual/' + value;
                if (location.pathname !== u.pathname) {
                    location.replace(u.href);
                    return;
                }
            }
        }

        let changeSaveButton = (function() {
            let el;
            el = document.createElement('button');
            el.innerHTML = "Save";
            el.type = "button";
            el.style['font-size'] = ".75rem";
            el.style.cursor = "auto";
            langs.parentNode.appendChild(el);
            tools.on(el, 'click', function() {
                if (getSelectedLang() !== null) {
                    tools.trigger(langs, 'selectlang');
                }
            });
            if (lang !== null) {
                el.disabled = true;
            }
            return el;
        })();

        langs.onchange = "";
        tools.on(langs, "change", function() {
            let selected = getSelectedLang();
            if (selected !== lang) {
                changeSaveButton.removeAttribute('disabled');
                disablelang();
                this.style.color = "";
            } else {
                changeSaveButton.disabled = true;
                this.style.color = "#8892BF";
            }
        });

        tools.on(langs, "selectlang", function() {
            let newlang = getSelectedLang();
            if ((newlang !== null) && newlang !== lang) {
                selectlang(newlang);
                this.style.color = "#8892BF";
                changeSaveButton.disabled = true;
            }
            if (this.value.length > 0) {
                redirectToLang(this.value);
            }

        });

        if (lang !== null && lang !== getSelectedLang()) {
            let uri;
            Array.from(langs.children).forEach(function(el) {
                if (el.innerText === lang) {
                    uri = el.value;
                }
            });
            if(uri !== undefined){
                redirectToLang(uri);
            }
        } else if (lang !== null && lang === getSelectedLang()) {
            langs.style.color = "#8892BF";
        }
    }

})();