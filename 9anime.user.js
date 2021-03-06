// ==UserScript==
// @name         9anime
// @namespace    https://github.com/ngsoft
// @version      2.9.9.6
// @description  UI Remaster
// @author       daedelus

// @grant none
// @run-at      document-start
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/userscripts/master/src/9anime.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/userscripts/master/src/9anime.user.js
//
//
// @icon        https://staticf.akacdn.ru/assets/9anime/favicons/favicon-32x32.png
// @include     /^https?:\/\/(\w+\.)?9anime\.\w+\//
// ==/UserScript==

(function(doc, undef){
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

    const onjQuery = function(fn, binding) {
        if (!typeof fn === "function")
            return;
        binding = binding || window;

        function w() {
            if (typeof jQuery !== void 0 && jQuery.isReady === true) {
                !w.i || clearInterval(w.i);
                fn.apply(binding, [jQuery]);
                return true;
            }
            return false;
        }
        !w() || (w.i = setInterval(w, 200));
    };

    function copyToClipboard(text){
        let r = false;
        if (typeof text === "string" && text.length > 0) {
            let el = html2element(`<textarea>${text}</textarea>"`);
            document.body.appendChild(el);
            el.style.opacity = 0;
            el.select();
            r = document.execCommand("copy");
            document.body.removeChild(el);
        }
        return r;
    }


    class Toast {

        static notify(message){
            if (typeof message === "string") {
                let
                        root = this.root,
                        notification = html2element('<div style="min-width: 392px; text-align: center;"/>');
                //notification.classList.add('hidden');
                notification.innerHTML = message;
                root.appendChild(notification);
                //notification.classList.remove('hidden');
                $(notification).fadeIn(() => {
                    setTimeout(function(){
                        $(notification).fadeOut(() => {
                            root.removeChild(notification);
                            if (root.classList.contains('tmp')) root.remove();
                        });

                    }, 1500);
                });

                

            }
        }

        static get root(){
            let root = doc.querySelector('#toast-wrapper');
            if (root === null) {
                root = html2element('<div id="toast-wrapper" class="tmp"/>');
                doc.body.appendChild(root);
            }
            return root;
        }

    }



    let w = setInterval(function() {

        if (document.body !== null) {
            window.open = function() {};
            clearInterval(w);

            //waf-verify
            if (document.querySelector('form[action*="/waf-verify"]') !== null) {
                return;
            }



            //site
            addstyle(`
                div[id*="BB_SK"],div[id*="bb_sa"], div[class*="ads_"],div[id*="rcjsload"], div[id*="-ps"],
                .ads-outsite, #disqus_thread, .this-message-does-not-harm-to-you-dont-remove-it,
                 .adsbox, #controls div.report.control.tip, body > div > div[style*="fixed"], :not(#player) > iframe:not([title="recaptcha challenge"]), .grecaptcha-badge,
                .content div[id*="p_"], [style*="position: fixed;"], [style*="z-index: 10000;"], section.sda
                {visibility: hidden !important; opacity: 0 !important; position: fixed !important; z-index: -1 !important;}
                .widget.crop, .widget.comment ,body.watch #sidebar{visibility: hidden!important;}
                /*#main > .content > .widget.slider + div,*/
                .content > .alert-warning ,.hidden{display: none !important;}
                body.watch #main{margin: 0!important; padding: 0!important;}
                .widget.quickfilter .widget-title > span:first-child + *{float: right;}
                .widget.quickfilter .widget-title ul{display:inline!important;padding: 4px!important;}
                .widget.quickfilter .widget-title ul label{min-width: 110px; text-align: right;}
                body.watch .list-film{max-width: 75%; margin: 0 auto;}
                .player-wrapper #controls > a { padding: 0 8px; display: inline-block; cursor: pointer;
                    color: #ababab; height: 38px; line-height: 38px; -webkit-transition: all .15s;
                    -moz-transition: all .15s; transition: all .15s; }
                .player-wrapper #controls > a:hover { background: #141414; color: #eee; }
            `);
            ondomready(function() {
                let el;
                const Store = new class {
                    constructor() {
                        let o = "object", s = "string", n = null, d = {script: {namespace: "http://tampermonkey.net/", name: "New Userscript", author: "You"}}, info = (typeof GM_info === o && GM_info !== n) ? GM_info : (typeof GM === o && GM !== n && typeof GM.info === o) ? GM.info : d,
                        id = (typeof info.script.namespace === s ? info.script.namespace : d.script.namespace) + '.' + (typeof info.script.name === s ? info.script.name : d.script.name) + '.' + (typeof info.script.author === s ? info.script.author : d.script.author);
                        this.prefix = id.replace(/[^\w]+/g, '.') + '.';
                    }
                    get ready() {return typeof Storage !== 'undefined' && window.hasOwnProperty('localStorage') && window.localStorage instanceof Storage;}
                    get prefix() {return this.__prefix__;}set prefix(v) {this.__prefix__ = this.__prefix__ || v;}
                    has(k) {return this.get(k) !== null;}
                    get(k, d = null) {
                        let r = d;
                        if (this.ready) {
                            let v = window.localStorage.getItem(this.prefix + k) || d;
                            try {r = JSON.parse(v);} catch (e) {r = v;}
                        }
                        return r;
                    }
                    set(k, v) {
                        if (this.ready) {
                            let j;
                            try {j = JSON.stringify(v);} catch (e) {j = v;}
                            window.localStorage.setItem(this.prefix + k, j);
                        }
                        return this;
                    }
                    unset(k) {
                        !this.ready || window.localStorage.removeItem(this.prefix + k);/* jshint ignore:line */
                        return this;
                    }
                }();

                (function() {
                    let message = Store.get("usermessage");
                    if (message && alertify) {
                        alertify.message(message);
                        Store.unset("usermessage");
                    }
                }());

                //setting main page tab to subbed
                if ((el = document.querySelectorAll('.main .tabs > span[data-name]')) && el.length) {
                    let t = el[0].parentNode.dataset.target;
                    for (let e of el) {
                        e.classList.remove('active');
                        if (e.dataset.name === "updated_sub") {
                            // e.classList.add('active');
                            e.click();
                        }
                    }
                }
                /**
                 * Save Quick Filter selection
                 */
                if ((el = document.querySelector('#sidebar div.quickfilter form.filters'))) {
                    let key = "userfilters";
                    let bt = html2element('<span class="filters"><ul class="filter list-unstyled"><li><input type="checkbox" id="userfiltersave"/><label for="userfiltersave">Save Filters</label></li></ul></span>');
                    el.parentNode.parentNode.querySelector('.widget-title').appendChild(bt);
                    bt = bt.querySelector('input');
                    if ((bt.checked = Store.get("userfiltersave", false))) {
                        let list;
                        if ((list = Store.get(key, [])) && list.length) {
                            let e;
                            list.forEach(function(id) {
                                if ((e = document.getElementById(id))) {
                                    e.checked = true;
                                }
                            });
                            !alertify || alertify.message('Quick Filters Loaded.');
                            onjQuery(function() {
                                jQuery(el).find('input:checked').trigger('change');
                            });
                        }

                    }
                    bt.addEventListener('change', function(evt) {
                        Store.set("userfiltersave", evt.target.checked);
                        if (evt.target.checked === false) {
                            Store.unset(key);
                            !alertify || alertify.message("Quick Filters Removed");
                            Array.from(el.querySelectorAll('input:checked')).forEach(function(e) {
                                e.checked = false;
                            });
                            onjQuery(function() {
                                jQuery(el).find('input').trigger("change");
                            });
                        }
                    });
                    el.addEventListener('submit', function(evt) {
                        if (!bt.checked) return;
                        Store.set("usermessage", "Quick filters saved.");
                        let ids = [];
                        Array.from(evt.target.querySelectorAll(':checked')).forEach(function(el){
                            ids.push(el.id);
                        });
                        Store.set(key, ids);
                    });
                }
                //removing iframes to reduce page load time
                let i = setInterval(function() {
                    if (document.querySelectorAll('#rufous-sandbox').length > 0) {
                        clearInterval(i);
                        if (document.querySelectorAll('#player').length > 0) {
                            return;
                        }
                        let el;
                        if ((el = document.querySelectorAll('iframe')) && el.length) {
                            for (let e of el) {
                                e.onload = e.onerror = e.onreadystatechange = "";
                                //e.src = "about:blank";
                                e.remove();
                            }
                        }
                    }
                }, 200);
                //get direct video link
                document.querySelectorAll('.player-container').forEach(function(el){
                    el.addEventListener("change", function() {
                        let frame, i = setInterval(function() {
                            if ((frame = el.querySelector("#player > iframe")) !== null) {
                                clearInterval(i);
                                let first = true,
                                        find,
                                        ctrl,
                                        link = html2element(`<a class="report" style="float: right;" target="_blank" href="${frame.src}"><i class="far fa-clipboard"></i><span> Video Link</span></a>`),
                                        cp = html2element(`<a class="report" style="float: right;" href="${frame.src}"><i class="fas fa-external-link-alt"></i><span> Copy Link</span></a>`);
                                document.querySelectorAll('#controls .report').forEach((n) => {
                                    if(first === true){
                                        first=false;
                                        ctrl = n.parentNode;
                                        ctrl.insertBefore(link, n);
                                        let title, u = new URL(cp.href), tel;

                                        if ((tel = document.querySelector('.navbc h2[data-jtitle]')) !== null) {
                                            title = tel.innerText.trim();
                                            title = title.replace(' (Dub)', '');
                                            title += ".E";
                                            let epn = document.querySelector('#episodes .episodes a.active');
                                            if (epn !== null) {
                                                epn = epn.innerText.trim();
                                                epn = parseInt(epn);
                                                if (epn < 10) epn = "0" + epn;
                                                title += epn;
                                                title += ".mp4";
                                                u.searchParams.set('jdtitle', title);
                                            }
                                        }
                                        cp.href = u.href;
                                        ctrl.insertBefore(cp, n);
                                        cp.addEventListener('click', (ev) => {
                                            ev.preventDefault();
                                            if (copyToClipboard(cp.href)) {
                                                Toast.notify("Link Copied to Clipboard.");
                                            }
                                        });
                                    }
                                    n.remove();
                                });
                            }
                        }, 3);
                    });
                });
                if (document.querySelectorAll('#player').length > 0) {

                    let ws = setInterval(function() {
                        if (document.querySelectorAll('#episodes ul.episodes a').length == 0) {
                            return;
                        }
                        clearInterval(ws);
                        document.querySelectorAll('#episodes ul.episodes a').forEach(function(el){
                            el.addEventListener('click', function(e) {
                                e.preventDefault();
                                document.querySelector('.player-container').dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
                            });
                        });
                        if ((el = document.querySelector("#player > iframe")) !== null) {
                            document.querySelector('.player-container').dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
                        }
                    }, 500);



                }


                let addrm = setInterval(function() {
                    if(document.querySelector('body > div > div[style*="fixed"]') !== null){
                        clearInterval(addrm);
                        document.querySelectorAll('body > div > div[style*="fixed"]').forEach(x => x.remove());
                    }
                }, 10);
                let addrm2 = setInterval(function() {
                    if (document.querySelector('body > div[id*="-ps"]') !== null) {
                        clearInterval(addrm2);
                        document.querySelectorAll('body > div[id*="-ps"]').forEach(x => x.remove());
                    }
                }, 10);

                document.querySelectorAll('.widget.crop, .widget.comment ,body.watch #sidebar').forEach(x => x.remove());
                document.querySelectorAll('body.dark').forEach(x => x.classList.remove('dark'));


            });
        }
    }, 20);

})(document);