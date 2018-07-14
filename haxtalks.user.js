// ==UserScript==
// @name        Hax Talks
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  UI Remaster
// @author       daedelus
// @include     *://haxtalks.*/*
// @include     *://*.haxtalks.*/*
// @grant none
// @run-at      document-end
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/haxtalks.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/haxtalks.user.js
// ==/UserScript==


(function() {


    const addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            let s = document.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
            document.body.appendChild(s);
        }();
    };

    addstyle(`
    #seasons .se-c .se-a ul.episodios li .episodiotitle a:visited{color: rgba(255, 193, 7, .7)!important;}
    `);










})();