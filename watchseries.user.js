// ==UserScript==
// @name         Watch Series 2.0
// @namespace    https://github.com/ngsoft
// @version      2.0.2
// @description  UI Remaster
// @author       daedelus
// @include	/^https?:\/\/(\w+\.)?watch(\-)?series\.\w+\//
// @grant none
// @icon        https://www.tampermonkey.net/favicon.ico
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/watchseries.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/watchseries.user.js
// @require	https://cdn.jsdelivr.net/gh/ngsoft/userscripts@1.1.9/dist/gmutils.min.js
// ==/UserScript==

((doc, undef) => {

    const on = EventTarget.prototype.addEventListener;
    window.addEventListener = doc.addEventListener = function(t){
        let e = [
            "contextmenu", "click", "mouseup"
        ];
        if (e.indexOf(t) !== -1) {
            return;
        }
        return on.call(this, ...arguments);
    };


    find('[style*="z-index: 2147483"], .ads, [id*="p_"]', (el) => {
        el.classList.add('hidden');
    }, 5000);

    let css = `
        .hidden, .hidden *{
            position: fixed !important; right: auto !important; bottom: auto !important; top:-100% !important; left: -100% !important;
            height: 1px !important; width: 1px !important; opacity: 0 !important;max-height: 1px !important; max-width: 1px !important;
            display: inline !important;z-index: -1 !important;
        }
    `;

    addcss(css);


})(document);