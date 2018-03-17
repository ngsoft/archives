// ==UserScript==
// @name        MDN Web Docs
// @namespace   https://github.com/ngsoft
// @version     1.3
// @description Use MDN Web Docs UI to store lang and auto redirect to the choosen lang
// @author      daedelus
// @include     https://developer.mozilla.org/*
// @noframes
// @grant       none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/mdn.user.js
// ==/UserScript==

(function() {

    var lang, langs, btauto;

    if (typeof Storage === 'undefined' || !window.hasOwnProperty('localStorage') || !(window.localStorage instanceof Storage)) {
        return;
    }

    if (!(langs = document.querySelectorAll('#languages-menu-submenu ul#translations bdi > a')).length) {
        return;
    }

    function disablelang() {
        localStorage.removeItem('lang');
    }
    function selectlang() {
        localStorage.setItem('lang', this.dataset.locale);
    }

    Array.from(langs).forEach(function(element) {
        if (document.addEventListener) {
            element.addEventListener('click', disablelang);
        } else if (document.attachEvent) {
            element.attachEvent('onclick', disablelang);
        }
    });
    if ((btauto = document.getElementById('locale-permanent-yes'))) {
        if (document.addEventListener) {
            btauto.addEventListener('click', selectlang);
        } else if (document.attachEvent) {
            btauto.attachEvent('onclick', selectlang);
        }
    }
    if ((lang = localStorage.getItem('lang')) !== null) {
        Array.from(langs).forEach(function(element) {
            if (element.dataset.locale && lang === element.dataset.locale) {
                //redirect without new entry in the history
                window.location.replace(element.href);
            }
        }.bind(this));
    }
})();