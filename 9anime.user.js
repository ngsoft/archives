// ==UserScript==
// @name         9anime
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  UI Remaster
// @author       daedelus
// @include     *://9anime.*/*
// @include     *://*.9anime.*/*
// @grant none
// @noframes
// @run-at       document-start
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// ==/UserScript==


window.open = function() {};

var toolbox = toolbox || (function api() {
    this.addstyle = function(css = null) {
        if (css === null || css.length < 1) {
            return this;
        }
        return this.ondomready(function() {
            s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        });
    };
    this.ondomready = function(fn) {
        if (typeof fn !== 'function') {
            return this;
        }
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
        return this;
    };
    this.elementcreate = function(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    };
    return this;
})();


(function() {

    toolbox.addstyle(`
        div[id*="BB_SK"],div[id*="bb_sa"], div[class*="ads_"],div[id*="rcjsload"],
        .ads-outsite, #disqus_thread, .hidden, .this-message-does-not-harm-to-you-dont-remove-it,
        .widget.crop, .widget.comment, iframe, body.watch #sidebar{display: none !important;}
        #player iframe{display: block!important;}

        body.watch #main{margin:0!important; padding:0!important;}

    `);


})();



