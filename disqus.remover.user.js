// ==UserScript==
// @name         disqus
// @namespace    https://github.com/ngsoft
// @version      1.2
// @description  disqus remover
// @author       daedelus
// @include     *://*/*
// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/disqus.remover.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/disqus.remover.user.js
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
    const WStore = new class {
        get info() {
            return this.__info__;
        }
        constructor() {
            let o = "object", s = "string", n = null, d = {script: {namespace: "http://tampermonkey.net/", name: "New Userscript", author: "You"}}, info = (typeof GM_info === o && GM_info !== n) ? GM_info : (typeof GM === o && GM !== n && typeof GM.info === o) ? GM.info : d,
                    id = (typeof info.script.namespace === s ? info.script.namespace : d.script.namespace) + '.' + (typeof info.script.name === s ? info.script.name : d.script.name) + '.' + (typeof info.script.author === s ? info.script.author : d.script.author);
            this.prefix = id.replace(/[^\w]+/g, '.') + '.';
            this.__info__ = info.script;
        }
        get ready() {
            return typeof Storage !== 'undefined' && window.hasOwnProperty('localStorage') && window.localStorage instanceof Storage;
        }
        get prefix() {
            return this.__prefix__;
        }
        set prefix(v) {
            this.__prefix__ = this.__prefix__ || v;
        }
        has(k) {
            return this.get(k) !== null;
        }
        get(k, d = null) {
            let r = d;
            if (this.ready) {
                let v = window.localStorage.getItem(this.prefix + k) || d;
                try {
                    r = JSON.parse(v);
                } catch (e) {
                    r = v;
                }
            }
            return r;
        }
        set(k, v) {
            if (this.ready) {
                let j;
                try {
                    j = JSON.stringify(v);
                } catch (e) {
                    j = v;
                }
                window.localStorage.setItem(this.prefix + k, j);
            }
            return this;
        }
        unset(k) {
            !this.ready || window.localStorage.removeItem(this.prefix + k);/* jshint ignore:line */
            return this;
        }
    }();

    let selector = "#disqus_thread, discuss"

    let w = setInterval(function() {

        if (document.body !== null) {


            ondomready(function() {

                if (document.querySelector(selector) === null) {
                    return;
                }
                window.open = function() {};
                clearInterval(w);
                addstyle(`
                        div.dsqconf > div{display: none !important;}
                        div.dsqconf{min-height: 30px;position: fixed; bottom: 0 ; left: 0 ; right: 0; text-align: center; z-index: 9999999;  background-color: transparent;}
                        div.dsqconf:hover > div, div.dsqconf[data-dsqconf="false"] > div{display: block !important; position: relative; height:100%; width: 100%; background-color: rgb(253, 250, 250);color: rgb(116, 44, 161);padding: .5em 0;}
                        div.dsqconf a{color: rgb(116, 44, 161); text-decoration: none;}
                        div.dsqconf span{position:absolute; right:5px; bottom:5px; width: auto;} div.dsqconf span, div.dsqconf span *{cursor: pointer;} div.dsqconf span label{margin-left: 5px;}
                    `);
                let dsqconf = WStore.get('dsqconf', false);
                let dsqenabled = WStore.get('dsqenabled', false);
                let dsqtagplaced = false;
                if (dsqconf && !dsqenabled) {
                    addstyle(`${selector}{display: none !important;}`);
                }

                let dsqtag = html2element(`
                    <div class="dsqconf" data-dsqconf="${dsqconf}">
                        <div>
                            DISQUS DISABLER
                            <span>
                                <input type="checkbox" disabled id="dsqenabler" name="dsqenabler" /><label for="dsqenabler">AUTO REMOVE DISQUS</label>
                            </span>
                        </div>
                    </div>
                `);

                document.querySelectorAll(selector).forEach(function(x) {
                    //other scripts can fore disable that script
                    if (window.localStorage.getItem('dsqremoveroverride') === "true") {
                        console.log('DISQUS DISABLER: disabled');
                        return;
                    }
                    if (!dsqtagplaced) {
                        console.log('DISQUS DISABLER version ' + WStore.info.version + ' started.');
                        document.body.appendChild(dsqtag);
                        let span = dsqtag.querySelector('span'), input = span.querySelector('input');
                        if (!dsqconf) {
                            dsqenabled = true;
                        }
                        input.checked = !dsqenabled;
                        span.addEventListener('click', function() {
                            WStore.set('dsqconf', true);
                            dsqtag.dataset.dsqconf = dsqconf = true;
                            input.checked = input.checked === false;
                            dsqenabled = !input.checked;
                            console.log('DISQUS DISABLER :' + (!dsqenabled ? "en" : "dis") + 'abled.');
                            WStore.set('dsqenabled', dsqenabled);
                            if (!dsqenabled) {
                                x.remove();
                            }
                        }, false);
                        dsqtagplaced = true;
                    }
                    if (!dsqenabled) {
                        x.remove();
                    }
                });
            });
        }
    }, 20);


})();