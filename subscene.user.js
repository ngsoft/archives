// ==UserScript==
// @name         Subscene Search
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  Search on Subscene
// @author       daedelus
// @icon         https://subscene.com/favicon.ico
// @match        *://subscene.com/*?*search_query=*
// @noframes
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/subscene.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/subscene.user.js
// ==/UserScript==

((doc)=>{

    /* jshint expr: true */
    /* jshint -W018 */
    /* jshint -W083 */

    const GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    const scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

    const s = "string", b = "boolean", f = "function", o = "object", u = "undefined", n = "number";

    function onDocEnd(callback) {
        if (typeof callback === f) {
            if (doc.readyState !== "complete") {
                return addEventListener('load', function load() {
                    callback();
                });
            }
            callback();
        }
    }

    onDocEnd(()=>{
        let query, sp = new URLSearchParams(doc.location.search);
        if ((query = sp.get('search_query'))) {
            const form = doc.querySelector('form#search-form'), input = form.querySelector('input#query');
            input.value = query;
            form.submit();
        }
    });
})(document);