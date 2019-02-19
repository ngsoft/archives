// ==UserScript==
// @name         KodiSend
// @namespace    https://github.com/ngsoft
// @version      2.6
// @description  Send Stream URL to Kodi using jsonRPC (Works with ol.user.js)
// @author       daedelus
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADhUExURQAAAAAAAAAAAAAAAFq/5////wAAAAAAAAEGBwABAQEFBgIGCAIGCBNDVwIFBwAAAA83RxA3RydASwAAAAQGBwUHCDQ0NFq/51q/51W95lq/5yubxyuYxFa+5v///yyeyyycyFq/52jE6f3//y6j0i6j0i6k0yaHrjaRteLl5t/i4+Pk5EC14zKt3j+041q/5zCt3jOv4DGv4Vq/5yqWwjCt3jGv4TSw4Tedxjeexjqx4Duz4j6040O240O25I7T7pPV75zY8JzY8ZzZ8aHQ477c6L/d6cDd6cDe6cLg6////zRLWWYAAAA0dFJOUwADBAYQEB0fIScnJygpKjAyMjIzR0dOj5KVn6Kor6+wscHBw8nKzdHV1djY5u/v7/L0/v77n8h1AAABGUlEQVQ4y5XS2VbCQAyA4VTAFcUFcUfqMi51F6K44YZo3v+BnLSdJiNtz7G339/TZDoA/3qqa5e362W+83KHz2GJP6F9HsNyLywyLyhq4rlFra0c8XV/zEn7gMgvqm0i3+lnz5uPdMD+ff8Q6vl1kHhPJuX9VOA82yXeXwJxV2zwflnAPkrdFps2OEMV+I54YYNrFbDTpzie22BXgtiJ3iTYssG0cQH711AXB/M85axJgtj7XS7eU18K4kXnDAeJ9zAuPrQD1E3y8VGf53OFuC0iSt/HrNAO0Iz0/lycLAfeD29G+ny6w9PWxJ8rs3qszgePWpWxS7dgxA8XKznXtm7Eg9yL74oid0WxA8x0bq62SxxgaqUx6fsvOX95dVWRzekAAAAASUVORK5CYII=
// @run-at      document-body
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/kodisend.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/kodisend.user.js
// @compatible   firefox+greasemonkey(3.17)
// @compatible   firefox+tampermonkey
// @compatible   chrome+tampermonkey
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @include     *://streamango.*/embed/*
// @include     *://*rapidvideo.com/e/*
// @include     *://*mp4upload.com/embed*
// @include     *://*uptostream.com/iframe/*
// @include     *://*yourupload.com/embed/*
// @include     /^https?:\/\/openload.(co|pw)\/embed\//
// @include     /^https?:\/\/oload.(club|download|fun|live)\/embed\//
// ==/UserScript==

(function(doc, undef) {


    let GMinfo = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null));
    let scriptname = `${GMinfo.script.name} version ${GMinfo.script.version}`;

    function html2element(html) {
        if (typeof html === "string") {
            let template = doc.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        }
    }

    function addcss(css) {
        if (typeof css === "string" && css.length > 0) {
            let s = doc.createElement('style');
            s.setAttribute('type', "text/css");
            s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
            doc.body.appendChild(s);
        }
    }

    function onBody(callback, binding) {
        if (typeof callback !== "function") {
            return;
        }
        let worker = setInterval(function() {
            if (doc.body === null) {
                return;
            }
            clearInterval(worker);
            if (binding) {
                callback.bind(binding);
            }
            callback();
        }, 1);
    }

    function onDocEnd(callback, binding) {
        if (typeof callback === "function") {
            if (binding) {
                callback.bind(binding);
            }
            if (doc.readyState !== 'complete') {
                window.addEventListener('load', callback);
                return;
            }
            callback();
        }

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

    let app = function() {

        if (this === undef || this === window) {
            return;
        }
        let self = this, ol;
        let defaults = {
            enabled: true,
            hostname: 'localhost',
            port: 8080
        }, settings = new UserSettings(defaults), enabled = settings.get('enabled');

        /**
         * @link https://codepen.io/jonnitto/pen/OVmvPB
         * @link https://cssminifier.com/
         */
        let styles = `.background{position:fixed;z-index:-1;top:0;left:0;right:0;bottom:0;object-fit:cover;height:100%;width:100%}.form-btn,.form-btn-cancel,.form-btn-error{background:0 0;font-size:1rem;color:#fff;cursor:pointer;border:1px solid transparent;padding:5px 24px;margin-top:2.25rem;position:relative;z-index:0;transition:transform .28s ease;will-change:transform}.form-btn-cancel::after,.form-btn-cancel::before,.form-btn-error::after,.form-btn-error::before,.form-btn::after,.form-btn::before{position:absolute;content:"";top:-1px;left:-1px;right:-1px;bottom:-1px}.form-btn-cancel::before,.form-btn-error::before,.form-btn::before{background:#337ab7;z-index:-2}.form-btn-cancel::after,.form-btn-error::after,.form-btn::after{background:#000;z-index:-1;opacity:0;transition:opacity .28s ease;will-change:opacity}.form-btn-cancel:focus,.form-btn-error:focus,.form-btn:focus{outline:0}.form-btn-cancel:focus::after,.form-btn-cancel:hover::after,.form-btn-error:focus::after,.form-btn-error:hover::after,.form-btn:focus::after,.form-btn:hover::after{opacity:.3}.form-btn-cancel:active,.form-btn-error:active,.form-btn:active{transform:translateY(1px)}.form-btn-error::before{background:#d9534f}.form-btn-cancel{transition:color .28s ease,transform .28s ease;color:#b52b27;border-color:currentColor;will-change:color,transform}.form-btn-cancel.-nooutline{border-color:transparent}.form-btn-cancel::before{background:#b52b27;opacity:0;transition:opacity .28s ease;will-change:opacity}.form-btn-cancel::after{display:none}.form-btn-cancel:focus,.form-btn-cancel:hover{color:#fff}.form-btn-cancel:focus::before,.form-btn-cancel:hover::before{opacity:1}.form-btn-block{display:block;width:100%;padding:5px}.form-checkbox,.form-radio{position:relative;margin-top:2.25rem;margin-bottom:2.25rem;text-align:left}.form-checkbox-inline .form-checkbox-label,.form-radio-inline .form-radio-label{display:inline-block;margin-right:1rem}.form-checkbox-legend,.form-radio-legend{margin:0 0 .125rem;font-weight:500;font-size:1rem;color:#333}.form-checkbox-label,.form-radio-label{position:relative;cursor:pointer;padding-left:1.5rem;text-align:left;color:#333;display:block;margin-bottom:.5rem}.form-checkbox-label:hover i,.form-radio-label:hover i{color:#337ab7}.form-checkbox-label span,.form-radio-label span{display:block}.form-checkbox-label input,.form-radio-label input{width:auto;opacity:.0001;position:absolute;left:.25rem;top:.25rem;margin:0;padding:0}.form-checkbox-button{position:absolute;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:block;color:#999;left:0;top:.25rem;width:1rem;height:1rem;z-index:0;border:.125rem solid currentColor;border-radius:.0625rem;transition:color .28s ease;will-change:color}.form-checkbox-button::after,.form-checkbox-button::before{position:absolute;height:0;width:.2rem;background-color:#337ab7;display:block;transform-origin:left top;border-radius:.25rem;content:"";transition:opacity .28s ease,height 0s linear .28s;opacity:0;will-change:opacity,height}.form-checkbox-button::before{top:.65rem;left:.38rem;transform:rotate(-135deg);box-shadow:0 0 0 .0625rem #fff}.form-checkbox-button::after{top:.3rem;left:0;transform:rotate(-45deg)}.form-checkbox-field:checked~.form-checkbox-button{color:#337ab7}.form-checkbox-field:checked~.form-checkbox-button::after,.form-checkbox-field:checked~.form-checkbox-button::before{opacity:1;transition:height .28s ease}.form-checkbox-field:checked~.form-checkbox-button::after{height:.5rem}.form-checkbox-field:checked~.form-checkbox-button::before{height:1.2rem;transition-delay:.28s}.form-radio-button{position:absolute;left:0;cursor:pointer;display:block;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#999}.form-radio-button::after,.form-radio-button::before{content:"";position:absolute;left:0;top:0;margin:.25rem;width:1rem;height:1rem;transition:transform .28s ease,color .28s ease;border-radius:50%;border:.125rem solid currentColor;will-change:transform,color}.form-radio-button::after{transform:scale(0);background-color:#337ab7;border-color:#337ab7}.form-radio-field:checked~.form-radio-button::after{transform:scale(.5)}.form-radio-field:checked~.form-radio-button::before{color:#337ab7}.form-has-error .form-checkbox-button,.form-has-error .form-radio-button{color:#d9534f}.form-card{border-radius:2px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);transition:all .56s cubic-bezier(.25,.8,.25,1);max-width:500px;padding:0;margin:50px auto}.form-card:focus,.form-card:focus-within,.form-card:hover{box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22)}.form-actions{position:relative;display:-ms-flexbox;display:flex;margin-top:2.25rem}.form-actions .form-btn-cancel{-ms-flex-order:-1;order:-1}.form-actions::before{content:"";position:absolute;width:100%;height:1px;background:#999;opacity:.3}.form-actions>*{-ms-flex:1;flex:1;margin-top:0}.form-fieldset{padding:30px;border:0}.form-fieldset+.form-fieldset{margin-top:15px}.form-legend{padding:1em 0 0;margin:0 0 -.5em;font-size:1.5rem;text-align:center}.form-legend+p{margin-top:1rem}.form-element{position:relative;margin-top:2.25rem;margin-bottom:2.25rem}.form-element-hint{font-weight:400;font-size:.6875rem;color:#a6a6a6;display:block}.form-element-bar{position:relative;height:1px;background:#999;display:block}.form-element-bar::after{content:"";position:absolute;bottom:0;left:0;right:0;background:#337ab7;height:2px;display:block;transform:rotateY(90deg);transition:transform .28s ease;will-change:transform}.form-element-label{position:absolute;top:.75rem;line-height:1.5rem;pointer-events:none;padding-left:.125rem;z-index:1;font-size:1rem;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0;color:#a6a6a6;transform:translateY(-50%);transform-origin:left center;transition:transform .28s ease,color .28s linear,opacity .28s linear;will-change:transform,color,opacity}.form-element-field{outline:0;height:1.5rem;display:block;background:0 0;padding:.125rem .125rem .0625rem;font-size:1rem;border:0 solid transparent;line-height:1.5;width:100%;color:#333;box-shadow:none;opacity:.001;transition:opacity .28s ease;will-change:opacity}.form-element-field:-ms-input-placeholder{color:#a6a6a6;transform:scale(.9);transform-origin:left top}.form-element-field::placeholder{color:#a6a6a6;transform:scale(.9);transform-origin:left top}.form-element-field:focus~.form-element-bar::after{transform:rotateY(0)}.form-element-field:focus~.form-element-label{color:#337ab7}.form-element-field.-hasvalue,.form-element-field:focus{opacity:1}.form-element-field.-hasvalue~.form-element-label,.form-element-field:focus~.form-element-label{transform:translateY(-100%) translateY(-.5em) translateY(-2px) scale(.9);cursor:pointer;pointer-events:auto}.form-has-error .form-element-hint,.form-has-error .form-element-label.form-element-label{color:#d9534f}.form-has-error .form-element-bar,.form-has-error .form-element-bar::after{background:#d9534f}.form-is-success .form-element-hint,.form-is-success .form-element-label.form-element-label{color:#259337}.form-is-success .form-element-bar::after{background:#259337}input.form-element-field:not(:placeholder-shown),textarea.form-element-field:not(:placeholder-shown){opacity:1}input.form-element-field:not(:placeholder-shown)~.form-element-label,textarea.form-element-field:not(:placeholder-shown)~.form-element-label{transform:translateY(-100%) translateY(-.5em) translateY(-2px) scale(.9);cursor:pointer;pointer-events:auto}textarea.form-element-field{height:auto;min-height:3rem}select.form-element-field{-webkit-appearance:none;-moz-appearance:none;appearance:none;cursor:pointer}.form-select-placeholder{color:#a6a6a6;display:none}.form-select .form-element-bar::before{content:"";position:absolute;height:.5em;width:.5em;border-bottom:1px solid #999;border-right:1px solid #999;display:block;right:.5em;bottom:0;transition:transform .28s ease;transform:translateY(-100%) rotateX(0) rotate(45deg);will-change:transform}.form-select select:focus~.form-element-bar::before{transform:translateY(-50%) rotateX(180deg) rotate(45deg)}.form-element-field[type=number]{-moz-appearance:textfield}.form-element-field[type=number]::-webkit-inner-spin-button,.form-element-field[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}`;

        styles += `
            .video-toolbar .kodisend-icon + .dl-icon {display: none!important;}
            .video-notify .error-icon{color: rgb(220, 53, 69);}.video-notify .success-icon{color: rgb(40, 167, 69);}
            .kodisend-settings{position: absolute; top:0; right:0;left:0;bottom:0;z-index:10000;}
            .kodisend-settings .settings{position: absolute; top:20%; left: 25%; width:50%; min-height: 33%;}
            .settings .form-card{max-width: none;margin:0;color:rgb(34, 34, 34);background-color: #fff;position: relative;}
            .settings .form-card a{color:rgb(34, 34, 34);}
            .kodisend-settings a.close-btn{position: absolute;top:0;right:0; padding: 16px;}
            .settings .form-checkbox-label span, .settings .form-radio-label span {padding-top: .275rem;}
            .settings .form-legend{margin-bottom: -1.75rem;}.settings .form-actions{margin-top:0;}
            .settings, .settings [class*="form-"]{font-size: 16px;font-family: Arial,Helvetica,sans-serif;}`;

        styles += `.hidden, .hidden *{position: fixed; right: auto; bottom: auto;top:-100%;left: -100%; height:1px; width:1px; opacity: 0;max-height:1px; max-width:1px;display:inline;}`;

        onBody(function() {
            addcss(styles);
        });


        let template = {
            dlicon: `<img class="kodisend-icon" src="${GMinfo.script.icon}" />`,
            button: `<a class="kodisend-btn left" href="#" title="KodiSend Settings"><img class="kodisend-icon" src="${GMinfo.script.icon}" /></a>`,
            settings: `<div class="kodisend-settings kodisend-video-settings hidden"></div>`,
            form: `<div class="settings">
                        <form class="form-card">
                            <fieldset class="form-fieldset">
                                <legend class="form-legend">
                                    KodiSend Settings
                                </legend>
                                <a title="Close Settings" href="#" class="close-btn"><span class="close-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 464c-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216 0 118.7-96.1 216-216 216zm94.8-285.3L281.5 256l69.3 69.3c4.7 4.7 4.7 12.3 0 17l-8.5 8.5c-4.7 4.7-12.3 4.7-17 0L256 281.5l-69.3 69.3c-4.7 4.7-12.3 4.7-17 0l-8.5-8.5c-4.7-4.7-4.7-12.3 0-17l69.3-69.3-69.3-69.3c-4.7-4.7-4.7-12.3 0-17l8.5-8.5c4.7-4.7 12.3-4.7 17 0l69.3 69.3 69.3-69.3c4.7-4.7 12.3-4.7 17 0l8.5 8.5c4.6 4.7 4.6 12.3 0 17z"></path></svg></span></a>
                                <div class="form-checkbox">
                                    <div class="form-checkbox-legend">Enable KodiSend</div>
                                    <label class="form-checkbox-label">
                                        <input name="enabled" class="form-checkbox-field" type="checkbox">
                                        <i class="form-checkbox-button"></i>
                                        <span>Enable KodiSend</span>
                                    </label>
                                </div>
                                <div class="form-element form-input">
                                    <input tabindex="0" class="form-element-field -hasvalue" placeholder="localhost" name="hostname" type="input" required />
                                    <div class="form-element-bar"></div>
                                    <label class="form-element-label">Hostname</label>
                                </div>
                                <div class="form-element form-input">
                                    <input tabindex="0" class="form-element-field -hasvalue" name="port" placeholder="8080" value="8080" type="number" min="1" max="65535" required />
                                    <div class="form-element-bar"></div>
                                    <label class="form-element-label">Port</label>
                                </div>
                                <div class="form-element form-input">
                                    <input class="form-element-field -hasvalue" name="server" value="" type="input" disabled />
                                    <div class="form-element-bar"></div>
                                    <label class="form-element-label">Address</label>
                                </div>
                            </fieldset>
                            <div class="form-actions">
                                <button tabindex="0" class="form-btn-cancel -nooutline close-btn" type="button">Close</button>
                            </div>
                        </form>
                   </div>`
        };

        let notifications = {
            sent: `<img class="kodisend-icon" src="${GMinfo.script.icon}" />Sending link to Kodi.`,
            disabled: `<img class="kodisend-icon" src="${GMinfo.script.icon}" />KodiSend Disabled.`,
            enabled: `<img class="kodisend-icon" src="${GMinfo.script.icon}" />KodiSend Enabled.`,
            error: `<span class="error-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.054-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.952 83.154 0l239.94 416.028zm-27.658 15.991l-240-416c-6.16-10.678-21.583-10.634-27.718 0l-240 416C27.983 466.678 35.731 480 48 480h480c12.323 0 19.99-13.369 13.859-23.996zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28zm-11.49-212h22.979c6.823 0 12.274 5.682 11.99 12.5l-7 168c-.268 6.428-5.556 11.5-11.99 11.5h-8.979c-6.433 0-11.722-5.073-11.99-11.5l-7-168c-.283-6.818 5.167-12.5 11.99-12.5zM288 372c-15.464 0-28 12.536-28 28s12.536 28 28 28 28-12.536 28-28-12.536-28-28-28z"></path></svg></span>KodiSend Error.`,
            success: `<span class="success-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 464c-118.664 0-216-96.055-216-216 0-118.663 96.055-216 216-216 118.664 0 216 96.055 216 216 0 118.663-96.055 216-216 216zm141.63-274.961L217.15 376.071c-4.705 4.667-12.303 4.637-16.97-.068l-85.878-86.572c-4.667-4.705-4.637-12.303.068-16.97l8.52-8.451c4.705-4.667 12.303-4.637 16.97.068l68.976 69.533 163.441-162.13c4.705-4.667 12.303-4.637 16.97.068l8.451 8.52c4.668 4.705 4.637 12.303-.068 16.97z"></path></svg></span>KodiSend Success.`
        };

        let events = {
            button(e) {
                e.preventDefault();
                //open settings
                self.settings.classList.remove('hidden');
                self.form.classList.add('fadeIn');
                Object.keys(defaults).forEach(function(x) {
                    let val = settings.get(x);
                    if (typeof val !== "boolean") {
                        self[x].value = val;
                    }
                });
                self.server.value = self.getServer();
                self.hostname.focus();
                setTimeout(function() {
                    self.form.classList.remove('fadeIn');

                }, 700);
                return false;
            },
            closebutton(e) {
                e.preventDefault();
                self.form.classList.add('bounceOut');
                setTimeout(function() {
                    self.settings.classList.add('hidden');
                    self.form.classList.remove('bounceOut');
                }, 1000);
                return false;
            },
            toggle(e) {
                if (enabled === true) {
                    self.disable();
                    ol.notify(notifications.disabled);
                } else {
                    self.enable();
                    ol.notify(notifications.enabled);
                }
                e.preventDefault();
                return false;
            },
            kodisend(e) {
                e.preventDefault();
                if (this.href === doc.location.href) {
                    ol.notify(notifications.error);
                    return;
                }
                ol.notify(notifications.sent);
                self.send(this.href);
            }
        };

        let setevents = {
            settings: {
                submit(e) {
                    e.stopPropagation();
                    self.server.value = self.getServer();
                    //esc
                    if (typeof e.keyCode === "number" && e.keyCode === 27) {
                        return events.closebutton(e);
                    }
                    e.preventDefault();
                    return false;
                },
                change(e) {
                    return setevents.settings.submit.call(this, e);
                },
                keyup(e) {
                    return setevents.settings.submit.call(this, e);
                }
            },
            enabled: {
                change(e) {
                    if (this.checked === true) {
                        self.enable();
                    } else {
                        self.disable();
                    }
                    return false;
                }
            },
            hostname: {
                keyup(e) {
                    if (typeof e.keyCode === "number" && e.keyCode === 13) {
                        setevents.hostname.change.call(this, e);
                        self.port.focus();
                    }
                    return false;
                },
                change(e) {
                    if (this.value.match(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/) !== null) {
                        settings.set('hostname', this.value);
                    }
                    this.value = settings.get('hostname');
                    return false;
                }
            },
            port: {
                keyup(e) {

                    let min = parseInt(this.min), max = parseInt(this.max);
                    if (this.value.match(/^[0-9]+$/) !== null) {
                        let val = parseInt(this.value);
                        if (val > min && val < max) {
                            settings.set('port', val);
                        }
                    }
                    this.value = settings.get('port');
                    if (typeof e.keyCode === "number" && e.keyCode === 13) {

                        self.hostname.focus();
                    }

                },
                change(e) {
                    return setevents.port.keyup.call(this, e);
                }
            }
        };

        this.getServer = function() {
            return `http://${settings.get('hostname')}:${settings.get('port')}/jsonrpc`;
        };

        this.enable = function() {
            this.disable();
            enabled = true;
            settings.set('enabled', true);
            this.enabled.checked = true;
            ol.download.addEventListener("click", events.kodisend);
            ol.download.dataset.title = ol.download.title;
            ol.download.title = "Send to Kodi.";
            ol.download.querySelectorAll('.dl-icon').forEach(function(el) {
                el.parentNode.insertBefore(self.dlicon, el);
            });
        };

        this.disable = function() {
            enabled = false;
            settings.set('enabled', false);
            this.enabled.checked = false;
            ol.download.removeEventListener("click", events.kodisend);
            if (this.dlicon.parentNode instanceof Element) {
                this.dlicon.parentNode.removeChild(this.dlicon);
            }
            if (ol.download.dataset.title !== undef) {
                ol.download.title = ol.download.dataset.title;
            }
        };

        this.send = function(url) {
            if (typeof url === "string" && url.length > 0) {
                let rpc = this.getServer();
                let data = JSON.stringify({
                    jsonrpc: '2.0',
                    method: "Player.Open",
                    params: {
                        item: {
                            file: url
                        }
                    },
                    id: Math.floor(Math.random() * (99 - 1) + 1)
                });

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: rpc,
                    data: data,
                    headers: {"Content-Type": "application/json"},
                    onload(xhr) {
                        console.debug("success", xhr.response);
                        if (xhr.status === 200) {
                            try {
                                let response = JSON.parse(xhr.response);
                                if (response.result === "OK") {
                                    ol.notify(notifications.success);
                                    return;
                                }

                            } catch (e) {
                            }

                        }
                        ol.notify(notifications.error);
                    },
                    onerror() {
                        ol.notify(notifications.error);
                    }
                });
                return;
            }
            throw new Error(scriptname + " kodisend.send() invalid arguments.");
        };

        this.start = function(toolbar) {
            if (toolbar instanceof Element) {
                //rebuild ol object
                ol = {
                    toolbar: toolbar,
                    download: toolbar.querySelector('.dl-btn'),
                    clipboard: toolbar.querySelector('.clipboard-btn'),
                    newtab: toolbar.querySelector('.newtab-btn'),
                    notifications: doc.querySelector('.video-notifications'),
                    notify(message) {
                        if (typeof message === "string" && message.length > 0) {
                            let el = html2element(`<div class="video-notify fadeIn">${message}</div>`);
                            setTimeout(function() {
                                el.classList.remove('fadeIn');
                                setTimeout(function() {
                                    el.classList.add('bounceOut');
                                    setTimeout(function() {
                                        el.parentNode.removeChild(el);
                                    }, 1000);
                                }, 1000);
                            }, 500);
                            ol.notifications.appendChild(el);
                        }
                    }
                };

                Object.keys(template).forEach(function(k) {
                    self[k] = html2element(template[k]);

                });
                ol.toolbar.insertBefore(this.button, ol.toolbar.firstChild);
                doc.body.insertBefore(this.settings, doc.body.firstChild);
                this.settings.appendChild(this.form);
                //map settings
                Object.keys(defaults).forEach(function(x) {
                    self[x] = self.settings.querySelector(`input[name="${x}"]`);
                    if (typeof settings.get(x) !== "boolean") {
                        self[x].value = settings.get(x);
                    }
                });
                self.server = self.settings.querySelector(`input[name="server"]`);

                //events
                Object.keys(setevents).forEach(function(x) {
                    Object.keys(setevents[x]).forEach(function(evt) {
                        self[x].addEventListener(evt, setevents[x][evt]);

                    });
                });
                this.settings.querySelectorAll('.close-btn').forEach(function(el) {
                    el.addEventListener("click", events.closebutton);
                });
                this.button.addEventListener("click", events.toggle);
                this.button.addEventListener("contextmenu", events.button);

                if (enabled === true) {
                    this.enable();
                }
            }
        };


        return this;

    };

    window.kodisend = new app();

    onDocEnd(function() {

        let w = setInterval(function() {

            let tb = doc.querySelector('div.video-toolbar');

            if (tb instanceof Element) {
                console.debug(scriptname, 'started');
                clearInterval(w);
                w = undef;
                kodisend.start(tb);
            }
        }, 20);
        setTimeout(function() {
            if (w !== undef) {
                clearInterval(w);
                throw new Error(scriptname + ' Cannot start ol.user.js not running.');
            }
        }, 5000);
    });

})(document);