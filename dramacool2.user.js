// ==UserScript==
// @name         Dramacool v2
// @namespace    https://github.com/ngsoft
// @version      1.0.b
// @description  UI Remaster + Videoupload + rewrite
// @author       daedelus
// @include     *://*dramacool*.*/*
// @include     *://*watchasia*.*/*
// @include     *://animetv.*/*
// @include     *://myanimeseries.*/*
// @include     *://videoupload.*/*
// @include     *://vidstream.*/*
// @include     *://azvideo.*/file/*
// @grant none
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/dramacool2.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/dramacool2.user.js
// ==/UserScript==

window.open = function() {};
window.eval = function() {};

(function() {


    function ToolBox(args = {}) {
        //private properties
        var callback = function() {};
        var defaults = {
            debug: false,
            jquery: {
                retry: 50,
                docready: true,
                autoload: false,
                wait: true,
                src: 'https://code.jquery.com/jquery-3.2.1.min.js'
            },
            loader: {timeout: 1500},
            cookies: {
                expire: 14,
                src: 'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js',
                autoload: true,
                retry: 50
            }
        };
        function onready(fn) {
            if (document.readyState != 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
        }

        /**
         * Merge attributes from sub into base
         * @param {object} base
         * @param {object} sub
         * @returns {object}
         */
        function merge(base, sub) {
            for (var prop in sub) {
                if (typeof sub[prop] === 'object') {
                    if (base.hasOwnProperty(prop)) {
                        if (typeof base[prop] === 'object') {
                            base[prop] = merge(base[prop], sub[prop]);
                        }
                        continue;
                    } else {
                        base[prop] = sub[prop];
                    }
                    continue;
                }
                if (base.hasOwnProperty(prop)) {
                    if (typeof base[prop] === typeof sub[prop]) {
                        base[prop] = sub[prop];
                    }
                    continue;
                }
                base[prop] = sub[prop];
            }
            return base;
        }
        /**
         * Adds elements to dom
         */
        var ui = {
            loadscript: function(src = null) {
                if (src === null || src.length < 1) {
                    return;
                }
                if (public.debug) {
                    console.debug('User script : loading script ' + src + '.');
                }
                s = document.createElement('script');
                s.setAttribute('src', src);
                s.setAttribute('type', "text/javascript");
                document.body.appendChild(s);
                return this;
            },
            loadcss: function(src = null) {
                if (src === null || src.length < 1) {
                    return;
                }
                if (public.debug) {
                    console.debug('User script : loading stylesheet ' + src + '.');
                }
                s = document.createElement('link');
                s.setAttribute('rel', "stylesheet");
                s.setAttribute('type', "text/css");
                s.setAttribute('href', src);
                document.head.appendChild(s);
                return this;
            },
            addcss: function(css = null) {
                if (css === null || css.length < 1) {
                    return;
                }
                if (public.debug) {
                    console.debug('User script : adding css ' + css + '.');
                }
                s = document.createElement('style');
                s.setAttribute('type', "text/css");
                s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
                document.body.appendChild(s);
                return this;
            },
            /**
             * @param {String} HTML representing a single element
             * @return {Element}
             */
            htmlToElement: function(html) {
                var template = document.createElement('template');
                html = html.trim(); // Never return a text node of whitespace as the result
                template.innerHTML = html;
                return template.content.firstChild;
            }
        };
        /**
         * Jquery loader
         */
        var jqready = false;
        var jquery = {
            init: function(fn) {
                if (this.wait) {
                    if (this.autoload) {
                        ui.loadscript(this.src);
                    }
                    var docready = this.docready;
                    interval = setInterval(function() {
                        if (typeof jQuery !== 'undefined') {
                            clearInterval(interval);
                            (function($) {
                                if (docready) {
                                    if (public.debug) {
                                        console.debug('User script : waiting for $(document).ready()');
                                    }
                                    $(document).ready(function() {
                                        jqready = true;
                                    }).ready(fn);
                                    return;
                                }
                                if (public.debug) {
                                    console.debug('User script : not waiting for $(document).ready()');
                                }
                                jqready = true;
                                fn();
                            })(jQuery);
                        }
                    }, this.retry);
                } else {
                    if (public.debug) {
                        console.debug('User script : jquery wait disabled');
                    }
                    fn();
                }

            },
            ready: function() {
                return jqready;
            }
        };
        /**
         * Page loader support
         */
        var loader = {
            onshow: function() {},
            onhide: function() {},
            show: function() {
                loader.onshow();
                return this;
            },
            hide: function() {
                setTimeout(loader.onhide, this.timeout);
                return this;
            },
            setup: function(onshow = function() {}, onhide = function(){}) {
                loader.onshow = onshow;
                loader.onhide = onhide;
                return this;
            }
        };
        /**
         * Cookies support
         */
        var data = {};
        var cookies_callback = function() {};
        var cready = false;
        var cookies = {
            ready: function() {
                return cready;
            },
            init: function(fn = null) {
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] !== 'function') {
                        if (public.debug) {
                            console.debug('User script : toolbox.cookies.init() invalid argument ' + i + ' is not a function.');
                        }
                        return false;
                    }
                }
                switch (arguments.length) {
                    case 2:
                        this.onload = arguments[0];
                        cookies_callback = arguments[1];
                        break;
                    default:
                        cookies_callback = fn;
                }
                if (typeof this.onload === 'function') {
                    if (public.debug) {
                        console.debug('User script : executing toolbox.cookies.onload().');
                    }
                    this.onload();
                }
                if (this.autoload) {
                    ui.loadscript(this.src);
                }
                ci = setInterval(function() {
                    if (typeof Cookies !== 'undefined') {
                        if (public.debug) {
                            console.debug('User script : Cookies ready.');
                        }
                        clearInterval(ci);
                        cready = true;
                        cookies_callback();
                    }

                }, this.retry);
            },
            set: function(name, value) {
                if (!this.ready()) {
                    if (public.debug) {
                        console.debug('User script : cannot set value ' + value + ' for cookie ' + name + ' : Cookies not loaded');
                    }
                    return this;
                }
                data[name] = value;
                Cookies.set(name, value);
                return this;
            },
            get: function(name, value = null) {
                if (!this.ready()) {
                    if (public.debug) {
                        console.debug('User script : cannot get value for cookie ' + name + ' : Cookies not loaded');
                    }
                    return value;
                }
                if (typeof data[name] === 'undefined') {
                    data[name] = value;
                    get = Cookies.get(name);
                    if (typeof get !== 'undefined') {
                        data[name] = get;
                    }
                }
                return data[name];
            },
            getobj: function(name, value = {}) {
                if (!this.ready()) {
                    if (public.debug) {
                        console.debug('User script : cannot get object for cookie ' + name + ' : Cookies not loaded');
                    }
                    return value;
                }
                if (typeof data[name] === 'undefined') {
                    data[name] = value;
                    get = Cookies.getJSON(name);
                    if (typeof get !== 'undefined') {
                        data[name] = get;
                    }
                }
                return data[name];
            },
            remove: function(name) {
                if (!this.ready()) {
                    if (public.debug) {
                        console.debug('User script : cannot delete cookie ' + name + ' : Cookies not loaded');
                    }
                    return this;
                }
                data[name] = null;
                delete data[name];
                Cookies.remove(name);
                return this;
            },
            save: function(name = null) {
                if (!this.ready()) {
                    if (public.debug) {
                        console.debug('User script : cannot save cookie ' + name + ' : Cookies not loaded');
                    }
                    return this;
                }
                if (typeof data === 'object') {
                    //save all
                    if (name === null) {
                        Object.keys(data).map(function(key, index) {
                            cookies.set(key, data[key]);
                        });
                    } else if (typeof data[name] !== 'undefined') {
                        cookies.set(name, data[name]);
                    }
                }
                return this;

            }
        };
        /**
         * public exposed methods
         */
        var public = {
            cookies: {},
            jquery: {},
            ui: {},
            loader: {
                show: loader.show,
                hide: loader.hide,
                setup: loader.setup
            },
            exec: true,
            init: function(fn = null) {
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] !== 'function') {
                        if (public.debug) {
                            console.debug('User script : toolbox.init() invalid argument ' + i + ' is not a function.');
                        }
                        return false;
                    }
                }
                switch (arguments.length) {
                    case 2:
                        this.onload = arguments[0];
                        callback = arguments[1];
                        break;
                    default:
                        callback = fn;
                }
                if (typeof this.onload === 'function') {
                    if (public.debug) {
                        console.debug('User script : executing toolbox.onload().');
                    }
                    this.onload();
                }
                if (!this.exec) {
                    if (public.debug) {
                        console.debug('User script : interruption by exec = false');
                    }
                    return;
                }
                this.jquery.init(callback);
                return this;
            }

        };
        params = merge(defaults, args);
        public.jquery = merge(public.jquery, jquery);
        public.ui = merge(public.ui, ui);
        public.cookies = merge(public.cookies, cookies);
        public = merge(public, params);
        if (public.debug) {
            console.debug('User script : debug mode enabled.');
        }
        return public;
    }




    function CSSLoader() {
        var css = `.cssloader{margin:50px;height:28px;width:28px;animation:rotate .8s infinite linear;border:8px solid #fff;border-right-color:transparent;border-radius:50%}@keyframes rotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}div#spinner{display : block;position : fixed;z-index: 100;background-color: #000; opacity: 0.8; background-repeat : no-repeat;background-position : center;left : 0;bottom : 0;right : 0;  top : 0;}div#spinner > div{z-index : 101;position: absolute; top: 50%; left:50%; margin: -14px 0 0 -14px; opacity:1; color: #fff;}`;
        var el = null;
        this.show = function() {
            if (el === null) {
                toolbox.ui.addcss(css);
                el = document.createElement('div');
                el.setAttribute('id', 'spinner');
                loader = document.createElement('div');
                loader.setAttribute('class', 'cssloader');
                el.appendChild(loader);
            }
            document.body.appendChild(el);
            return this;
        };
        this.hide = function() {
            if (el === null) {
                return this;
            }
            document.body.removeChild(el);
            return this;
        };
        this.configure = function() {
            toolbox.loader.setup(toolbox.cssloader.show, toolbox.cssloader.hide);
            toolbox.loader.show();
        };
        return this;
    }

    /**
     * @link http://alertifyjs.com
     */
    function alertifyjs() {
        var settings = {
            // dialogs defaults
            autoReset: true,
            basic: false,
            closable: false,
            closableByDimmer: true,
            frameless: false,
            maintainFocus: true, // <== global default not per instance, applies to all dialogs
            maximizable: true,
            modal: true,
            movable: true,
            moveBounded: false,
            overflow: true,
            padding: true,
            pinnable: true,
            pinned: true,
            preventBodyShift: false, // <== global default not per instance, applies to all dialogs
            resizable: true,
            startMaximized: false,
            transition: 'pulse',

            // notifier defaults
            notifier: {
                // auto-dismiss wait time (in seconds)
                delay: 5,
                // default position
                position: 'bottom-right',
                // adds a close button to notifier messages
                closeButton: false
            },

            // language resources
            glossary: {
                // dialogs default title
                title: 'Userscript',
                // ok button text
                ok: 'Yes',
                // cancel button text
                cancel: 'No'
            },
            // theme settings
            theme: {
                // class name attached to prompt dialog input textbox.
                input: 'ajs-input',
                // class name attached to ok button
                ok: 'ajs-ok',
                // class name attached to cancel button
                cancel: 'ajs-cancel'
            }

        };
        var ready = false;
        callback = function() {};
        function loadsettings() {
            if (ready) {
                alertify.defaults = settings;
            }
        }
        function loadresources() {
            toolbox.ui.loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/alertify.min.css')
                    .loadcss('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/css/themes/default.min.css')
                    .loadscript('https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.11.0/alertify.min.js');
        }
        return {
            retry: 50,
            autoload: true,
            init: function(fn = null) {
                for (var i = 0; i < arguments.length; i++) {
                    if (typeof arguments[i] !== 'function') {
                        return false;
                    }
                }
                switch (arguments.length) {
                    case 2:
                        this.onload = arguments[0];
                        callback = arguments[1];
                        break;
                    default:
                        callback = fn;
                }
                if (typeof this.onload === 'function') {
                    this.onload();
                }
                if (this.autoload) {
                    loadresources();
                }
                ac = setInterval(function() {
                    if (typeof alertify !== 'undefined') {
                        clearInterval(ac);
                        ready = true;
                        loadsettings();
                        callback();
                    }
                }, this.retry);
            },
            ready: function() {
                return ready;
            }
        };

    }






    //var toolbox = new ToolBox({debug: true});
    var toolbox = new ToolBox();

    toolbox.onload = function() {
        toolbox.cssloader = new CSSLoader();
        toolbox.cssloader.configure();
    };

    toolbox.cookies.init(function() {
        toolbox.notify = new alertifyjs();
        toolbox.notify.init(function() {

            //override browser notifications
            window.alert = alertify.alert;
            window.confirm = alertify.confirm;
            window.notify = alertify.message;

            toolbox.init(function() {
                toolbox.loader.hide();
                alert('User Script loaded');

            });
        });

    });




})();