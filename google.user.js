// ==UserScript==
// @name         Google Search AddFree
// @author       daedelus
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Removes Adds From Google Search
// @include     *://*.google.*/search?*
// @icon        https://www.google.com/favicon.ico
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at      document-end
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/google.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/google.user.js
// ==/UserScript==

((doc, win, undef) => {
    setInterval(() => {
        let btn = doc.querySelector('span[id][onclick*="none"]');
        if (btn instanceof Element) {
            btn.click();
        }
    }, 100);

})(document, window);