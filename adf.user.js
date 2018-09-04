// ==UserScript==
// @name         adf.ly bypasser
// @namespace    https://github.com/ngsoft
// @version      1.1
// @description  bypasser
// @author       daedelus
// @include     *://*adf.ly/*
// @include     *://*fawright.com/*
// @include     *://*flyserve.co/*
// @include     *://*kializer.com/*
// @include     *://*skamaker.com/*
// @include     *://*skamason.com/*
// @include     *://*yamechanic.com/*
// @include     *://*yoineer.com/*
// @include     *://*yoitect.com /*
// @include     *://*clearload.bid/*
// @exclude     */ad/*
// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/adf.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/adf.user.js
// ==/UserScript==

(function() {
    /* jshint expr: true */
    /* jshint -W018 */
    const ondomready = this.ondomready = function(callback) {
        let retval = false;
        for (let f of arguments) {
            if (typeof f === "function") {
                retval = true;
                (document.readyState !== 'loading' ? f() : document.addEventListener('DOMContentLoaded', f));
            }
        }
        return retval;
    };
    const addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            let s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        }();
    };
    const html2element = function(html) {
        if (typeof html === "string") {
            let template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
        return null;
    };



    function bypasser() {

        let w = setInterval(function() {
            document.querySelectorAll('.mwButton').forEach(function(x) {
                if (x.href.length > 0) {
                    clearInterval(w);
                    location.replace(x.href);
                }
            });
        }, 10);
    }

    let b = setInterval(function() {
        if(document.body !== null){
            clearInterval(b);
            addstyle(`.cssloader{margin:50px;height:28px;width:28px;animation:rotate .8s infinite linear;border:8px solid #fff;border-right-color:transparent;border-radius:50%}@keyframes rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}#overly{background: #317EC5;z-index: 999999;text-align:center;} #overly > img { margin-top: 100px;} #overly > div {color: #FFFFFF; margin-top:20px;margin-left: 50%;}`);
            document.body.appendChild(html2element(`<div id="overly"><img src="http://cdn.adf.ly/static/image/logo.png" alt="logo" border="0"><div class="cssloader"></div></div>`));
            ondomready(bypasser);
        }
    }, 10);







})();