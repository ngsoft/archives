// ==UserScript==
// @name         Kodi Send
// @namespace    https://github.com/ngsoft
// @version      1.0
// @description  Send Stream URL to Kodi using jsonRPC (Works with ol.user.js)
// @author       daedelus
// @include     *://openload.co/embed/*
// @include     *://oload.fun/embed/*
// @include     *://streamango.*/embed/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @include     *://vev.io/*
// @include     *://thevideo.me/*
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kodisend.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kodisend.user.js
// @run-at      document-body
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

(function(doc, undef) {

    let info = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${info.script.name} version ${info.script.version}`;

    const addstyle = this.addstyle = function(css) {
        return !css ? null : function() {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.body.appendChild(s);
        }();
    };

    function html2element(html) {
        if (typeof html === "string") {
            let template = doc.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
        return null;
    }

    function insertAfter(newNode, referenceNode) {
        if (referenceNode instanceof Element)
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function insertBefore(newNode, referenceNode) {
        if (referenceNode instanceof Element)
            referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    function onDocStart(fn, binding) {
        if (binding)
            fn.bind(binding);
        let w = function() {
            if (document.body !== null) {
                !w.i || clearInterval(w.i);
                fn();
                return true;
            }
            return false;
        };
        w() || (w.i = setInterval(w, 20));
    }

    function onDocEnd(fn, binding) {
        if (binding)
            fn.bind(binding);
        onDocStart(function() {
            if (doc.readyState !== 'loading') {
                return fn();
            }
            doc.addEventListener('DOMContentLoaded', fn);
        });
    }

    function trigger(type, el) {
        type += "";
        if (!(el instanceof EventTarget)) {
            return;
        }
        if (type.length === 0) {
            return;
        }
        el.dispatchEvent(new Event(type, {bubbles: true, cancelable: true}));
    }


    function getElement(selector, callback) {
        selector += "";
        if (selector.length === 0) {
            return;
        }
        if (typeof callback !== "function") {
            return;
        }

        let worker = setInterval(function() {
            if (doc.body !== null) {
                let element;
                if ((element = doc.querySelectorAll(selector)).length > 0) {
                    clearInterval(worker);
                    element.forEach(function(el) {
                        callback.apply(el, [el]);
                    });
                }
            }

        }, 10);
        setTimeout(function() {
            clearInterval(worker);
        }, 10000);
    }


    class UserSettings {
        constructor(defaults) {
            if (typeof defaults === 'object') {
                Object.keys(defaults).forEach(function(k) {
                    if (typeof GM_getValue(k) !== typeof defaults[k]) {
                        this.set(k, defaults[k]);
                    }
                }, this);
            }
        }
        get(key) {
            return GM_getValue(key);
        }
        set(key, val) {
            GM_setValue(key, val);
            return this;
        }
    }


    let defaults = {
        server: 'http://127.0.0.1:8091/assets/kodi/chromebox.local',
        xhr: true
    };


    let app = {

        send(url, callback) {
            url += "";
            if (url.length === 0) {
                return;
            }
            if (typeof callback !== "function") {
                return;
            }

            let xhr = this.settings.get('xhr');


            if (!xhr) {
                let form = html2element(`<form method="post" class="hidden" target="kodi" action=""><input type="text" name="url" value="" /><input type="submit" /></form>`);
                doc.body.appendChild(form);
                let input = form.querySelector('[type="text"]');
                input.value = url;
                form.action = this.settings.get('server');
                form.submit();
                doc.body.removeChild(form);
                callback(-1);
                return;
            }

            let data = new FormData();
            data.append('url', url);
            GM_xmlhttpRequest({
                method: 'POST',
                url: this.settings.get('server'),
                data: data,
                onload(xhr) {
                    if(xhr.status === 200){
                        callback(parseInt(xhr.response));
                        return;
                    }
                    callback(-1);
                }
            });

        },

        settings: new UserSettings(defaults),
        css: `
            [class*="-icon"]{-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;width: 1.5rem;height: 1.5rem;display:inline-block;vertical-align: middle;font-style: normal;}
            .kodisend-icon{ background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhUExURQAAAAAAAAAAAAAAAFq/5////wAAAAAAAAEGBwABAQEFBgIGCAIGCBNDVwIFBwAAAA83RxA3RydASwAAAAQGBwUHCDQ0NFq/51q/51W95lq/5yubxyuYxFa+5v///yyeyyycyFq/52jE6f3//y6j0i6j0i6k0yaHrjaRteLl5t/i4+Pk5EC14zKt3j+041q/5zCt3jOv4DGv4Vq/5yqWwjCt3jGv4TSw4Tedxjeexjqx4Duz4j6040O240O25I7T7pPV75zY8JzY8ZzZ8aHQ477c6L/d6cDd6cDe6cLg6////zRLWWYAAAA0dFJOUwADBAYQEB0fIScnJygpKjAyMjIzR0dOj5KVn6Kor6+wscHBw8nKzdHV1djY5u/v7/L0/v77n8h1AAABGUlEQVQ4y5XS2VbCQAyA4VTAFcUFcUfqMi51F6K44YZo3v+BnLSdJiNtz7G339/TZDoA/3qqa5e362W+83KHz2GJP6F9HsNyLywyLyhq4rlFra0c8XV/zEn7gMgvqm0i3+lnz5uPdMD+ff8Q6vl1kHhPJuX9VOA82yXeXwJxV2zwflnAPkrdFps2OEMV+I54YYNrFbDTpzie22BXgtiJ3iTYssG0cQH711AXB/M85axJgtj7XS7eU18K4kXnDAeJ9zAuPrQD1E3y8VGf53OFuC0iSt/HrNAO0Iz0/lycLAfeD29G+ny6w9PWxJ8rs3qszgePWpWxS7dgxA8XKznXtm7Eg9yL74oid0WxA8x0bq62SxxgaqUx6fsvOX95dVWRzekAAAAASUVORK5CYII=');}

        .kodisend-container{z-index: 9999;position absolute; top:1rem; left:3rem; padding:0 2rem;position: absolute;}
        .video-container .kodisend-container{padding:.75rem 1rem;top:0;}

        .hidden, .hidden *{position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}
       `,

        elements: {
            container: html2element(`<span class="kodisend-container"></span>`),
            button: html2element(`<a href="" class="kodisend" title="Send to Kodi"><i class="kodisend-icon"></i></a>`),
            iframe: html2element(`<iframe id="kodi" name="kodi" class="hidden"></iframe>`)
        },
        show(target) {
            if (!(target instanceof Element)) {
                return;
            }
            target.classList.add('hidden');
        },
        hide(target) {
            if (!(target instanceof Element)) {
                return;
            }
            target.classList.remove('hidden');
        },
        events: {
            load() {
                app.elements.button.href = this.src;
            },
            play() {
                app.show(app.elements.container);

            },
            pause() {
                app.hide(app.elements.container);
            },
            buttonclick(e) {
                e.preventDefault();
                let src = doc.querySelector('.dlvideo > a').href;
                this.href = src;
                app.send(src, app.events.xhr);
                app.elements.button.classList.add('flash');
                return false;
            },
            xhr(r) {
                if (r === 0) {
                    console.error(scriptname + " Error sending link to Kodi.");
                }

                setTimeout(function() {
                    app.elements.button.classList.remove('flash');
                }, 500);

            }

        },

        start() {
            console.debug(scriptname + " Started");
            this.build(doc.body);
        },

        build(target) {
            if (!(target instanceof Element)) {
                target = doc.body;
            }
            target.appendChild(this.elements.iframe);
            target.appendChild(this.elements.container);
            this.elements.container.appendChild(this.elements.button);
            this.elements.button.addEventListener("click", this.events.buttonclick);
            addstyle(this.css);

        },



        init() {

            getElement('video', function() {

                this.addEventListener("loadeddata", app.events.load);
                this.addEventListener("play", app.events.play);
                this.addEventListener("pause", app.events.pause);
            });
            getElement('.dlvideo > a', function() {
                app.start();
                app.elements.button.href = this.href;
            });

        }
    };


    app.init();


})(document)