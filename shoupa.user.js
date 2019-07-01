// ==UserScript==
// @name         SHOUPA HLS Downloader
// @namespace    https://github.com/ngsoft
// @version      3.1.3
// @description  FIX Stream for firefox Quantum + command to download stream
// @author       daedelus
// @icon        https://files.ynfrfn.com/static/images/favicon.ico
// @include     *.shoupa.com/v/*
// @include     *://5nj.com/*?*m=vod-play-id*-src-*-num-*
// @run-at      document-body
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/shoupa.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/shoupa.user.js
// @require     https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==

(function(doc, $, undef) {

    let info = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${info.script.name} version ${info.script.version}`;

    function addstyle(css) {
        return !css ? null : function() {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.body.appendChild(s);
        }();
    }

    function html2element(html) {
        if (typeof html === "string") {
            let template = doc.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
        return null;
    }

    function text2element(text) {
        if (typeof text === "string") {
            return doc.createTextNode(text);
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

    function copyToClipboard(text = "") {
        let clip = html2element(`<textarea>${text}</textarea>"`);
        document.body.appendChild(clip);
        clip.style.opacity = 0;
        clip.select();
        let retval = document.execCommand("copy");
        document.body.removeChild(clip);
        return retval;
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



    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    let utils = {
        getSteamURL(src, callback) {
            src += "";
            if (typeof callback !== 'function' || src.length === 0) {
                return;
            }

            let protosrc = (src => {
                let a = doc.createElement('a');
                a.href = src;
                try {
                    let url = new URL(a.href);
                    url.protocol = doc.location.protocol;
                    return url.href;
                } catch (e) {
                    return a.href;
                }
            })(src);


            GM_xmlhttpRequest({
                method: 'GET',
                url: src,
                onload(xhr) {
                    let source;
                    let regex = /#EXT-X-STREAM-INF.*\n([^#].*)/, matches;
                    if (xhr.status === 200) {
                        if ((matches = regex.exec(xhr.response)) !== null) {
                            let url = new URL(src);
                            let uri = matches[1].trim();
                            if (uri.match(/^\//) !== null) {
                                url.pathname = uri;
                            } else {
                                url.pathname = utils.dirname(url.pathname) + uri;
                            }
                            source = url.href;
                        }
                    }
                    callback(source ? source : src);

                }
            });
        },
        dirname(src) {
            return src.substring(0, src.lastIndexOf('/') + 1);
        },
        getIcon() {
            let result = '/favicon.ico';
            if (document.querySelector('[rel*="icon"]') instanceof Element) {
                result = document.querySelector('[rel*="icon"]').href;
            }
            return result;
        }
    };



    let defaults = {
        autoplay: false,
        jd: true,
        code: true,
        flash: true
    };

    let app = {
        settings: new UserSettings(defaults),
        provider: (function() {
            let a = doc.location.host.split('.');
            a.pop();
            return a.pop().match(/([a-z]+)/i)[1].toUpperCase();
        }()),
        src: "", show: "", number: "",
        video: "",
        enable: true,
        started: false,
        title: "",
        realsrc: "",
        code: "",
        hls: "",
        elements: {
            container: html2element(`<div class="video-container"></div>`),
            video: html2element(`<video class="native_mode" src="" controls="controls" data-src=""></video>`),
            errormessage: html2element(`<div class="video-error-message"><span class="error-message">Please try to disable "mixed active content" protection on this page using <i class="unicon">&#128274;</i> icon to play the video.</span><i class="noentry-icon unicon">&#128683</i></div>`),
            notification: html2element(`<div class="video-notify hidden"></div>`),
            code: {
                container: html2element(`<div class="video-code-container hidden"></div>`),
                codebar: html2element(`<div class="video-code"></div>`),
                code: html2element(`<code></code>`)
            },
            toolbar: {
                container: html2element(`<div class="video-toolbar"><i class="fav-icon" title="Open Settings ..."></i>&nbsp;</div>`),
                title: html2element(`<span class="video-title" title="Play Video"></span>`),
                jd: html2element(`<a class="jd-plugin" href="#" title="Copy to jDownloader ..." data-href=""><i class="jd-icon"></i></a>`),
                code: html2element(`<a class="code-plugin" href="#" title="Display ffmpeg command ..."><i class="script-icon"></i></a>`)
            },
            settings: {
                container: html2element(`<div class="video-settings hidden"><div class="video-form"><div class="video-form-title">Settings</div>
<div class="setting"><span class="switch round"><input type="checkbox" name="autoplay" /><span class="slider"></span><span class="description">Enable Autoplay</span></span></div><div class="setting"><span class="switch round"><input type="checkbox" name="jd" /><span class="slider"></span><span class="description">Enable jDownloader</span></span></div><div class="setting"><span class="switch round"><input type="checkbox" name="code" /><span class="slider"></span><span class="description">Enable ffmpeg command</span></span></div><div class="setting"><span class="switch round"><input type="checkbox" name="flash" /><span class="slider"></span><span class="description">Enable Flash Player</span></span></div></div></div>`),
                autoplay: "",
                jd: "",
                code: "",
                flash: ""
            }
        },
        events: {
            videoload() {
                if (app.settings.get('autoplay') === true) {
                    app.elements.video.play();
                }

            },
            videoclick(e) {
                e.preventDefault();
                if (this.classList.contains('play')) {
                    this.pause();
                    return false;
                }
                this.play();
                return false;
            },
            videoplay() {
                this.classList.add('play');
                app.hide(app.elements.settings.container);
                app.hide(app.elements.code.container);
            },
            videopause() {
                this.classList.remove('play');
            },
            videoerror(event, data) {
                if (data.fatal) {
                    if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        app.elements.video.classList.add('error');
                    }
                }

            },
            jdclick(e) {
                e.preventDefault();
                this.href = app.src;
                let url = new URL(app.realsrc.length > 0 ? app.realsrc : app.src);
                url.searchParams.set('title', app.title);
                this.dataset.href = url.href;
                if (copyToClipboard(url.href)) {
                    app.notify("Link sent to Clipboard ...", 1000);
                }
                return false;
            },
            scriptclick(e) {
                e.preventDefault();
                let code = "echo " + app.title + " \n" + this.innerText + "\n";
                if (copyToClipboard(code)) {
                    app.hide(app.elements.code.container);
                    app.notify('Copied to Clipboard...', 1000);
                }
                return false;
            },
            scriptcontainerclick(e) {
                if (this === e.target || e.target === this.querySelector('.video-form-title')) {
                    app.hide(this);
                }
                return false;
            },
            codeclick(e) {
                e.preventDefault();
                app.hide(app.elements.settings.container);
                if (app.elements.code.container.classList.contains('hidden')) {
                    if (app.code.length === 0) {
                        //set ffmpeg code
                        //app.code = `ffmpeg -protocol_whitelist "file,http,https,tcp,tls" -y -i "${app.realsrc.length > 0 ? app.realsrc : app.src}" -c copy "${app.title}"`;
                        app.code = `ffmpeg -v quiet -stats -y -i "${app.realsrc.length > 0 ? app.realsrc : app.src}" -c copy "${app.title}"`;
                        app.elements.code.code.appendChild(text2element(app.code));
                    }
                    app.unhide(app.elements.code.container);
                    return false;
                }
                app.hide(app.elements.code.container);
                return false;
            },
            titleclick() {
                app.elements.video.play();
            },
            notifyclick() {
                setTimeout(x => app.hide(this), 1000);
                this.classList.add('bounceOut');
                return false;
            },
            switchsetting(e) {
                //e.preventDefault();

                let name = this.name;
                app.settings.set(name, this.checked);
                if (name === "autoplay") {
                    return false;
                }
                if (this.checked) {
                    app.unhide(app.elements.toolbar[name]);
                } else {
                    app.hide(app.elements.toolbar[name]);
                }
                return false;
            },
            settings(e) {
                app.hide(app.elements.code.container);
                app.toggle(app.elements.settings.container);
                e.preventDefault();
                return false;
            }
        },
        init() {
            let worker = setInterval(function() {
                if (this.provider.length && this.src.length > 0 && this.show.length > 0 && typeof this.number === "number" && this.video instanceof Element) {
                    clearInterval(worker);
                    this.start();
                }
            }.bind(app), 10);
            setTimeout(function() {
                clearInterval(worker);
                if (!app.started) {
                    console.error(scriptname + ' Timeout');
                    console.error(app);
                    throw new Error();
                }
            }, 10000);
        },
        start() {
            this.started = true;
            console.debug(`${scriptname} Started`);
            this.build();

        },
        build() {
            //insert all elements into the dom
            insertBefore(this.elements.container, this.video);

            this.buildtoolbar(this.elements.container);
            this.buildcode(this.elements.container);
            this.buildnotify(this.elements.container);
            this.buildsettings(this.elements.container);
            this.buildtitle();
            if (this.enable) {
                this.buildvideo(this.elements.container);
            }
        },
        buildvideo() {
            //assemble elements
            insertBefore(this.elements.video, this.elements.toolbar.container);
            insertBefore(this.elements.errormessage, this.elements.toolbar.container);

            //remove old video element
            this.video.parentNode.removeChild(this.video);
            //register events
            this.elements.video.addEventListener("loadeddata", this.events.videoload);
            this.elements.video.addEventListener("click", this.events.videoclick);
            this.elements.video.addEventListener("play", this.events.videoplay);
            this.elements.video.addEventListener("pause", this.events.videopause);
            this.elements.video.oncontextmenu = this.elements.errormessage.oncontextmenu = x => false;
            //create hls object
            this.hls = new Hls();
            this.hls.on(Hls.Events.ERROR, this.events.videoerror);
            this.elements.video.dataset.src = this.src;
            let m3u8Url = decodeURIComponent(this.src);
            this.hls.loadSource(m3u8Url);
            this.hls.attachMedia(this.elements.video);
        },
        buildnotify(target) {
            if (!(target instanceof Element)) {
                return;
            }
            target.appendChild(this.elements.notification);
            this.elements.notification.addEventListener("click", this.events.notifyclick);
            this.elements.notification.oncontextmenu = x => false;

        },
        buildcode(target) {
            if (!(target instanceof Element)) {
                return;
            }
            target.appendChild(this.elements.code.container);
            this.elements.code.container.appendChild(this.elements.code.codebar);
            this.elements.code.codebar.appendChild(this.elements.code.code);
            this.elements.code.code.addEventListener("click", this.events.scriptclick);
            this.elements.code.container.addEventListener("click", this.events.scriptcontainerclick);
            this.elements.code.container.oncontextmenu = x => false;
        },
        buildtoolbar(target) {
            if (!(target instanceof Element)) {
                return;
            }
            target.appendChild(this.elements.toolbar.container);
            this.elements.toolbar.container.appendChild(this.elements.toolbar.title);
            this.elements.toolbar.container.appendChild(this.elements.toolbar.code);
            this.elements.toolbar.container.appendChild(this.elements.toolbar.jd);
            //register events
            this.elements.toolbar.container.querySelector('.fav-icon').addEventListener("click", this.events.settings);
            this.elements.toolbar.title.addEventListener("click", this.events.titleclick);
            this.elements.toolbar.jd.addEventListener("click", this.events.jdclick);
            this.elements.toolbar.code.addEventListener("click", this.events.codeclick);
        },
        buildsettings(target) {
            if (!(target instanceof Element)) {
                return;
            }
            //settings
            target.appendChild(this.elements.settings.container);
            this.elements.settings.autoplay = this.elements.settings.container.querySelector('[name="autoplay"]');
            this.elements.settings.jd = this.elements.settings.container.querySelector('[name="jd"]');
            this.elements.settings.code = this.elements.settings.container.querySelector('[name="code"]');
            this.elements.settings.flash = this.elements.settings.container.querySelector('[name="flash"]');

            Object.keys(defaults).forEach(function(x) {
                if ((app.elements.settings[x].checked = app.settings.get(x) === true) === false) {
                    if (app.elements.toolbar[x]) {
                        app.hide(app.elements.toolbar[x]);
                    }
                }
                app.elements.settings[x].addEventListener("change", app.events.switchsetting);
            });
            //register events
            this.elements.settings.container.addEventListener("click", this.events.scriptcontainerclick);
            this.elements.settings.container.oncontextmenu = x => false;
        },

        buildtitle() {
            //set title
            let title = this.show + ".";
            if (this.number > 0) {
                title += "E";
                if (this.number < 10) {
                    title += "0";
                }
                title += this.number + ".";
            }
            title += this.provider;
            this.title = title + ".mp4";
            this.elements.toolbar.title.appendChild(text2element(this.title));
        },
        toggle(element) {
            if (element instanceof Element) {
                if (element.classList.contains('hidden')) {
                    this.unhide(element);
                    return true;
                }
                this.hide(element);
                return false;
            }
            return undef;
        },
        unhide(element) {
            if (element instanceof Element) {
                element.classList.remove('hidden');
            }

        },
        hide(element) {
            if (element instanceof Element) {
                element.classList.add('hidden');
            }
        },
        notify(message, timeout) {
            timeout = typeof timeout === "number" ? timeout : 0;
            message += "";
            if (message.length > 0) {
                while (this.elements.notification.firstChild) {
                    this.elements.notification.removeChild(this.elements.notification.firstChild);
                }
                this.elements.notification.appendChild(text2element(message));
                this.elements.notification.classList.remove('bounceOut');
                this.elements.notification.classList.remove('fadeInRight');
                this.unhide(this.elements.notification);
                setTimeout(x => this.elements.notification.classList.remove('fadeInRight'), 550);
                this.elements.notification.classList.add('fadeInRight');
                if (timeout > 0) {
                    setTimeout(function() {
                        trigger("click", this.elements.notification);
                    }.bind(this), timeout);
                }
            }
        }
    };

    onDocStart(function() {

        addstyle(`
            .video-container{position:relative; width:100%; height:100%; overflow:hidden;max-width:100%;max-height:100%;font-size: 16px;line-height:1;cursor:pointer;}
            .video-container video{width:100%;height:100%;z-index:1;object-fit: fill;}
            .video-container .play{padding:0;background: none;color: inherit;}
            .video-container .video-error-message,
            .video-toolbar,
            .video-code-container,
            .video-settings
            {position: absolute; top:0;left:0;right:0; z-index:999;background-color: #000; padding: 1rem;}
            .video-container .video-error-message, .video-code,
            .video-toolbar{background-color: rgba(0,0,0,.4);color: #FFF; text-align:center;}
            .video-toolbar a{color: #FFF; text-decoration: none;}
            .video-toolbar [class*="-icon"]{position: absolute;top:50%; transform: translate(0,-50%); margin: 0 1rem;}
            .video-toolbar .jd-icon{right:3.5rem;}.video-toolbar .script-icon{right:0;}.video-toolbar .fav-icon{left:0;}
            .video-error-message, .video-toolbar, .video-notify, .video-settings
            {-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
            .video-container .video-error-message{bottom:0;cursor: auto;}
            .video-error-message .noentry-icon
            {font-size:7rem; color:rgb(187,64,64); position: absolute;top:50%;left:50%; line-height: 0;transform: translate(-3.5rem,-.5rem);}
            .video-code-container, .video-settings{bottom:0;padding:3rem 0 0 0; background: transparent;cursor: auto;}
            .video-code-container .video-code, .video-settings .video-form{background-color: rgba(0,0,0,.4); padding: 1rem;}
            .video-code code{color:#74aa04; background-color: rgba(0,43,54,.9); display: block;padding: 3rem 1rem;}
            .video-settings{padding: 15% 20% 0 20%; }
            .video-settings .video-form{text-align:left;border: 1px solid;border-radius: .5rem;background-color: rgba(0,0,0,.9);color: #FFF;}
            .video-form .setting{padding: 1rem 0 1rem 33%;}
            .video-form .video-form-title{text-align: right;border-bottom: 1px solid;padding: 0 1rem 1rem 1rem;cursor: pointer;}
            .video-notify
            {position: absolute; bottom:7rem;right:2rem;color:rgb(34, 34, 34);background-color: rgba(255, 255, 255, .8);font-size:.95rem;padding:1rem 2rem; border-radius: .25rem;z-index:1000;}
            .video-container video:not(.error) + .video-error-message,
            .video-container video.play + .video-error-message + .video-toolbar,
            .video-container video.error + .video-error-message + .video-toolbar .video-title
            {display: none;}
            /* switch */
           .switch,.switch .slider {position: relative;display: inline-block;}
           .switch [type="checkbox"] {opacity: 0;z-index: 2;}
           .switch [type="checkbox"],.switch .slider:after {position: absolute;top: 0;right: 0;left: 0;bottom: 0;min-width: 100%;min-height: 100%;cursor: pointer;}
           .switch .slider:after,.switch .slider:before {-webkit-transition: 0.25s;transition: 0.25s;content: "";position: absolute;}
           .switch .slider {width: 4rem;height: 2rem;vertical-align: middle;}
           .switch .slider:before {z-index:1;height: 1.5rem;width: 1.5rem;left: .25rem;bottom: .25rem;}
           .switch [type="checkbox"]:checked + .slider:before {-webkit-transform: translateX(2rem);-ms-transform: translateX(2rem);transform: translateX(2rem);}
           .switch.round .slider:after{border-radius: 2rem;}
           .switch.round .slider:before {border-radius: 50%;}
           /** colors **/
           .switch [type="checkbox"]:checked + .slider:after {background-color: rgba(0, 123, 255, 1);}
           .switch [type="checkbox"]:focus + .slider:after {box-shadow: 0 0 1px rgba(0, 123, 255, 1);}
           .switch .slider:before {background-color: rgba(255, 255, 255, 1);}
           .switch .slider:after {background-color: rgba(108, 117, 125, 1);}
           /** sizes **/
           .switch .slider{transform: scale(.75,.75);}
           .switch-sm .slider{transform: scale(.55,.55);}
           .switch-md .slider{transform: scale(.9,.9);}
           .switch-lg .slider{transform: scale(1.1,1.1);}
            /* Utils */
            [class*="-icon"]{-webkit-background-size: cover;-moz-background-size: cover;-o-background-size: cover;background-size: cover;width: 24px;height: 24px;display:inline-block;vertical-align: middle;font-style: normal;}
            .jd-icon{background-image: url('data:image/png;base64,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');}
            .script-icon{background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAS6SURBVEjHtVZLTJxVFP7+x0B5jZVoF2UqxVoD1GBJeHSBkkhKjBuTtpgAATE1aeOqJibGTVvjwmDsyiZVQLsA5eErRJvULtpYaknYSHmKsaYWoeVRSjsDM8zjv55z/vvPDNS488Lh3tz/3u+c853HBfifh3Hotdb+/PztrxqmaftsGzaLReKzZLZsni1YJCaJYRgw9GWlFJS7kHUsHsfy0hJC62HZC4cjF4yS5w+E6GMOX2QQD2yzmP+yl9rnO9FYDLf+uo28bcDi8gMEdu7A7Tv3YRO4kXJIbf5R3oxH9nlHzKd1aG2NwGcRJw8iZLxj2Fi6vybe2mxBbU01ua1gmmZS+OPmteHSoyWRcLCysoI1AnfiCs/sLkC6oRZRfXdpFXZ+/uN47913BMhiMAElQMNMA+RoMfeGeBAMhrCwsCjgSIuJuzCwLTMTO558Aqc+aIfNbjpkjTdMcZuATGxSwGdixPPU9LRQUrCzANk5ORrXgP5Fbm4utj/mRzKm7E4ikXD5JnRlMcd0RWeG4zjyPRqNYX19HT3d3XgYDOLkyVObrGfA7Ows5JECHgm6x/fF4LiToA1X2MrIRlTAwpRu8/PzmJ7+jfYilKYmZmZmUFxcjMnJCTxYXYXP5xPJysoiBdlwCJTBHU8Ba4sSYDgSIU4JNBwma6PCcdfnnTh8+BCGhq7CZ/vk3Ojor6ioqMDExDhqX6xBe/uHBJZAZmaGeKMY2FNAP5ymksNeYDmAHR0d+ObrAUm78vJy1NfXIyPDh5t/zIv7JSUl8Pv9GB8bw5c9Pbhy+TKOHGnAsePHkJOT69KtxWStXMFs4YUff0D9wYN0qRv79j2Hb7/7Hr19/SgqKhIaRm+MoqqqSsBZyWcdnbh48SfU1dWhs7MD5fv349KlS0lwTiCbY8/tgauS+Q4GH6Km5gV8fOYMdgV2UdqyZ4bM14aGCLgUGaTMK8uysjLk+d+SmhgcHKR4TYnHXpHafNCmfsN18HpbG0KhEM6f/wIHqqvQ2tqKEyfeRuHuQqFvcnISTc3N8BFdbN3IyAh6e7/CwMCAGHn06JtoamyS9HSrnUbNS6+s3fzzlqI+omZn59Tc/B31y/XrioB0P4Dq6+tX4+Pjsp6Z+V1Rhqmuri5FOa+ILtXY2KjG6Pu9lRW1vHxPLS4uqbsLi6rljeNKskgCzBVsudW8d++zOPvJWbJ4Ci0tLZib+xs3KKClpaXYs+dpiQdnSUNDA4aHhykpOlH4VGGq+hnLcCvE9ook1cB1a6DYBAIBnDv3qSh+//RpVFZWJs82NTULhY5OSXjtxNBFqt23vb6O9B4v4khFy2UaBQUB1NbWSiHyYJ5dcCXF5WZNWgfW70RSAR/2rPP+KulNXO4O2igB+HssFncPqJQxjnKrVjnumpV6j5Eo8KxM94CBOR6O5tNrfEjSqVJKkCostcUjeyOygSs/X4M/L0+CxxXr9hcqPl8G5bx+Rkk4FtKyvSbIFFEj5LchIbPuaXqP2k/EKC6r/ojMeXnTQ62tfeSpNC1RYnpebZlN7y0x3boKhkKDhqbc0nT5toi3Z2kxtQ3MaYIbsZZYmsTT5oT9X/9xaEBTK7K3KDC8QtTKzGR+pI1/AOhbqTICdOHlAAAAAElFTkSuQmCC');}
            .fav-icon{background-image: url('${utils.getIcon()}');}
            @keyframes flash {0% { opacity: 1; } 50% { opacity: .1; } 100% { opacity: 1; }}
            .flash{animation: flash linear .25s infinite;-webkit-animation: flash linear .25s infinite;}
            @keyframes fadeInRight {0% {opacity: 0;-webkit-transform: translate3d(100%, 0, 0);transform: translate3d(100%, 0, 0);}100% {opacity: 1;-webkit-transform: none;transform: none;}}
            .fadeInRight {animation-name: fadeInRight;animation-duration: .5s;animation-fill-mode: both;}
            @keyframes bounceOut {20% {-webkit-transform: scale3d(.9, .9, .9);transform: scale3d(.9, .9, .9);}50%, 55% {opacity: 1;-webkit-transform: scale3d(1.1, 1.1, 1.1);transform: scale3d(1.1, 1.1, 1.1);}100% {opacity: 0;-webkit-transform: scale3d(.3, .3, .3);transform: scale3d(.3, .3, .3);}}
            .bounceOut {animation-name: bounceOut;animation-duration: .75s;animation-duration: 1s;animation-fill-mode: both;}

            .unicon{font-family: "Segoe UI Symbol";font-style: normal;}
            .invert{filter: invert(100%);}
            .hidden, .hidden *{position: fixed; top:-100%;right: -100%; height:1px; width:1px; opacity: 0;}
            /* Flash player integration */
            #ckplayer_cms_player embed{position: absolute; top: 3rem;bottom:0; right:0; left:0;height:calc(675px - 3rem);}
            #playleft video.native_mode{max-height:550px;}
        `);

    });


    onDocEnd(function() {
        if (doc.location.host.match(/shoupa/i)) {
            if (doc.location.pathname.match(/^\/v\//i) !== null) {
                app.init();
                getElement('#ckplayer_cms_player', function() {
                    let src = "";
                    app.video = this;
                    switch (this.nodeName.toLowerCase()) {
                        case "video":
                            src = this.firstChild.src;
                            break;
                        case "object":
                            app.enable = app.settings.get('flash') === false;
                            let p = new URLSearchParams(this.querySelector('[name="flashvars"]').value);
                            src = p.get('a');
                            break;
                    }
                    if (src.length > 0) {
                        app.src = src;

                        utils.getSteamURL(src, function(u) {
                            app.realsrc = u;
                        });
                    }
                });
                getElement('.play .container h2.text-nowrap a:last-of-type', function() {
                    app.show = this.innerText.split('(')[0];
                });
                getElement('.play .container h2.text-nowrap small', function() {
                    let m;
                    app.number = 0;
                    if ((m = /第([0-9]+)/.exec(this.innerText)) !== null) {
                        app.number = parseInt(m[1]);
                    }
                });
                getElement('#detail-content a', function() {
                    this.removeAttribute('target');
                });
            }

            return;

        }
        if(/5nj/.test(doc.location.host)){
            getElement('#playleft iframe[src*="/m3u8/"]', function() {
                app.init();
                let url = new URL(this.src);
                let sp = new URLSearchParams(url.search);

                let src = sp.get('id');
                app.video = this;

                if (src.length > 0) {
                    app.src = src;

                    utils.getSteamURL(src, function(u) {
                        app.realsrc = u;
                    });
                }
                app.provider = "esyy";
                app.show = mac_name;

            });

            getElement('.videourl li.selected a', function() {
                let number = 0;
                if(/^[0-9]+$/.test(this.innerText)){
                    number = parseInt(this.innerText);
                    if (isNaN(number)) number = 0;
                }
                app.number = number;
            });

        }



    });

})(document, jQuery);
