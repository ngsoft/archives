// ==UserScript==
// @name        MDN Web Docs
// @namespace   https://github.com/ngsoft
// @version     1.0
// @description Use MDN Web Docs UI to store lang and auto redirect to the choosen lang
// @author      daedelus
// @include     https://developer.mozilla.org/*
// @noframes
// @grant       none
// run-at       document-end
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// ==/UserScript==

(function() {

    let langs;
    let lang;
    let auto;
    let btauto;

    if (typeof Storage === 'undefined' || !window.hasOwnProperty('localStorage') || !(window.localStorage instanceof Storage)) {
        return;
    }

    if (!(langs = document.querySelectorAll('#languages-menu-submenu ul#translations bdi > a')).length) {
        return;
    }
    function selectlang() {
        if (this.dataset.locale) {
            localStorage.removeItem('auto');
            localStorage.removeItem('lang');
        }
    }

    function setauto() {
        localStorage.setItem('auto', true);
        localStorage.setItem('lang', this.dataset.locale);
    }

    let langlist = (function(elements) {
        var list = {};
        if (typeof elements !== 'object' || Object.keys(elements).length < 1) {
            return list;
        }
        Array.from(elements).forEach(function(element) {
            if (!element.dataset.locale) {
                return;
            }
            list[element.dataset.locale] = element.href;
            if (document.addEventListener) {
                element.addEventListener('click', selectlang);
            } else if (document.attachEvent) {
                element.attachEvent('onclick', selectlang);
            }

        });
        return list;
    })(langs);

    if ((btauto = document.getElementById('locale-permanent-yes'))) {
        if (document.addEventListener) {
            btauto.addEventListener('click', setauto);
        } else if (document.attachEvent) {
            bauto.attachEvent('onclick', setauto);
        }
    }

    if ((lang = localStorage.getItem('lang')) !== null && lang in langlist && (auto = localStorage.getItem('auto')) !== null) {
        window.location.href = langlist[lang];
    }
})();