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
//window.eval = function() {};

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
            loader: {timeout: 1500, enabled: true},
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
        styles = ``;
        var ui = {
            /**
             * Loads remote .js file
             * @param {type} src
             * @returns {dramacool2.userL#22.ToolBox.ui}
             */
            loadscript: function(src = null) {
                if (src === null || src.length < 1) {
                    return this;
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
            /**
             * Loads remote css
             * @param {string} src
             * @returns {dramacool2.userL#22.ToolBox.ui|undefined}
             */
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
            /**
             * Add css string to dom
             * @param {string} css
             * @returns {dramacool2.userL#22.ToolBox.ui}
             */
            addcss: function(css = null) {
                if (css === null || css.length < 1) {
                    return this;
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
            },
            /**
             * Add style to stylesheet
             * @param {string} css
             * @returns {dramacool2.userL#22.ToolBox.ui}
             */
            addstyle: function(css = null) {
                if (typeof css === 'string' && css.length > 0) {
                    styles += css;
                }
                return this;
            },
            /**
             * Loads and reset the stored stylesheet
             * @returns {dramacool2.userL#22.ToolBox.ui}
             */
            loadstyles: function() {
                if (styles.length > 0) {
                    this.addcss(styles);
                    styles = ``;
                }
                return this;
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
                if (this.enabled) {
                    loader.onshow();
                }
                return this;
            },
            hide: function() {
                if (this.enabled) {
                    setTimeout(loader.onhide, this.timeout);
                }
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
            /**
             * Set a cookie
             * @param {type} name
             * @param {type} value
             * @returns {dramacool2.userL#22.ToolBox.cookies}
             */
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
            /**
             * Get a cookie value
             * @param {type} name
             * @param {type} value
             * @returns {.Cookies@call;getJSON.value|.Cookies@call;get.value|dramacool2.userL#22.ToolBox.data|data}
             */
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
            /**
             * Get a cookie object
             * @param {type} name
             * @param {type} value
             * @returns {object}
             */
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
            /**
             * Remove a cookie
             * @param {type} name
             * @returns {dramacool2.userL#22.ToolBox.cookies}
             */
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
            /**
             * Save all loaded cookies
             * @param {type} name
             * @returns {dramacool2.userL#22.ToolBox.cookies}
             */
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
                position: 'top-right',
                // adds a close button to notifier messages
                closeButton: false
            },

            // language resources
            glossary: {
                // dialogs default title
                title: 'Userscript',
                // ok button text
                ok: 'OK',
                // cancel button text
                cancel: 'Cancel'
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

    /**
     * @param {object} plugin
     * @returns {object}
     */
    function UserPlugin(plugin) {

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

        var data = {};

        var defaults = {

        };
        var enabled = false;

        //override methods
        var public = {
            meta: {
                name: ``,
                displayname: ``,
                description: ``
            },
            configure: {
                /**
                 * Configuration element
                 * @returns {Element}
                 */
                element: function() {
                    template = `
                    <div class="user-toggle">
                        <input type="checkbox" data-enabled="${public.enabled() ? 1 : 0}" name="${public.meta.name}" id="${public.meta.name}" />
                        <label for="${public.meta.name}">${public.meta.displayname}</label>
                        <button onclick="javascript:void(0);" data-description="${public.meta.description}" data-name="${public.meta.name}" data-display-name="${public.meta.displayname}">Info</button>
                    </div>`;
                    return toolbox.ui.htmlToElement(template);
                },
                /**
                 * Click on element event
                 * @param {type} e event
                 */
                click: function(e) {

                },
                /**
                 * Change event
                 * @param {type} e
                 * @returns {undefined}
                 */
                change: function(e) {

                },
                /**
                 * Save configuration method
                 */
                save: function(e) {
                    enabled = this.checked;

                },
                /**
                 * Reset configuration method
                 */
                reset: function() {

                },
                /**
                 * Called first to initialize components
                 */
                init: function() {

                }
            },
            /**
             * Called at each page initialization
             */
            init: function() {

            },
            /**
             * Called when dom ready
             */
            onload: function() {

            },
            /**
             * Check if plugin is enabled
             * @returns {Boolean}
             */
            enabled: function() {
                return enabled;
            }
        };

        if (typeof plugin === 'object' && Object.keys(plugin).length > 0) {
            public = merge(public, plugin);

        }

        return public;
    }

    var app = function() {

        var css = `
                .user-toggle > input[type="checkbox"] {height: 0;width: 0;visibility: hidden;}
                .user-toggle > label {cursor: pointer;text-indent: -9999px;width: 48px;height: 24px;background: grey;display: block;border-radius: 100px;position: relative;}
                .user-toggle > label:after {content: "";position: absolute;top: 2px;left: 2px;width: 20px;height: 20px;background: #fff;border-radius: 20px;transition: 0.3s;}
                .user-toggle > input:checked + label {background: #2196f3;}
                .user-toggle > input:checked + label:after {left: calc(100% - 5px);transform: translateX(-100%);}
                .user-toggle > label:active:after {width: 130px;}
                .user-toggle > span, .user-toggle > label, .user-toggle > button{float: left;margin-left: 20px;}
                .user-toggle > button{border: 1px solid #2196f3; background: transparent;vertical-align: middle;font-size: 14pt; color:#2196f3;}
                .user-toggle{margin-top: 10px; max-width:250px; width: 50%;height: 60px; padding-top: 30px;float: left;position: relative;}
                .user-toggle > * {margin-top: -12px;}
                .ajs-content form {position: absolute;top:0;left:0;right:0;bottom:0;}
                .ajs-content form:after{content: ""; clear: both;}
                .ajs-dialog.user-conf{width: 965px; height: 453px;}
                .ajs-content{font-size: 14pt;}
                .ajs-content form p.user-config-prompt{position: absolute; z-index:50; bottom:0; left:0; right:0; font-weight: bold; font-size: 12pt; text-align: center; margin: 0; padding: 10px;}
                .ajs-button:disabled {color: gray!important;}

                .hidden{display: none!important;}

        `;
        var defaults = {

        };
        var cookie = {};

        var form;

        return {
            plugins: {
                configure: function() {
                    var plugins = this;
                    Object.keys(plugins).map(function(key) {
                        var plugin = plugins[key];
                        if (typeof plugin === 'object') {
                            plugin.configure.init();
                        }

                    });
                }
            },
            loadplugin: function(plugin) {
                if (typeof plugin === 'object' && typeof plugin.meta.name === 'string' && plugin.meta.name.length > 0) {
                    this.plugins[plugin.meta.name] = new UserPlugin(plugin);
                }
                return this;

            },
            configure: function() {

                if (!alertify.configure) {

                    alertify.dialog('configure', function factory() {
                        return {
                            setup: function() {
                                return {
                                    buttons: [
                                        {
                                            text: "Save Changes",
                                            className: alertify.defaults.theme.ok,
                                            attrs: {
                                                style: "float:right;",
                                                disabled: 'disabled'
                                            }
                                        },
                                        {
                                            text: "Cancel",
                                            className: alertify.defaults.theme.cancel
                                        }
                                    ],
                                    focus: {
                                        element: 0
                                    },
                                    options: {
                                        closable: false,
                                        maximizable: false
                                    }
                                };
                            },
                            hooks: {
                                onshow() {
                                    //The Dialog Box
                                    //$(this.elements.dialog);
                                    //Content div
                                    //$(this.elements.content);
                                    //title
                                    //$(this.elements.header);
                                    //e.preventDefault();
                                    this.elements.btok = this.elements.buttons.primary.children[0];
                                    this.elements.btcancel = this.elements.buttons.primary.children[1];

                                    var that = this;


                                    $(this.elements.content).find('form').each(function() {
                                        $(that.elements.dialog).addClass('user-conf');
                                        $(this).on('submit', function(e) {
                                            e.preventDefault();
                                        }).off('change').on('change', function() {
                                            that.elements.btok.disabled = true;
                                            $(this).find('div.user-toggle > input:checkbox').each(function() {
                                                val = this.checked ? "1" : "0";
                                                if ($(this).attr("data-enabled") !== val) {
                                                    that.elements.btok.disabled = false;
                                                }
                                            });
                                        });

                                        $(this).find('div.user-toggle > input:checkbox').each(function() {
                                            var id = $(this).attr('name');
                                            if (typeof app.plugins[id].configure.change === 'function') {
                                                $(this).off('change').on('change', app.plugins[id].configure.change).off('click').on('click', app.plugins[id].configure.click).off('save').on('save', app.plugins[id].configure.save).attr('data-enabled', app.plugins[id].enabled() ? 1 : 0);
                                            }
                                        });

                                        $(this).find('button[data-description]').off('click').on('click', function() {
                                            $(that.elements.dialog).addClass('hidden');

                                            alertify.alert($(this).attr('data-display-name') + " Description", toolbox.ui.htmlToElement('<p style="text-align:center;">' + $(this).attr('data-description') + '</p>'), function() {
                                                $(that.elements.dialog).removeClass('hidden');
                                            });
                                        });
                                        $(this).find('.user-toggle > span').remove();
                                        $(this).find('.user-toggle > label').each(function() {
                                            span = $('<span/>').attr('aria-hidden', "true").html($(this).text());
                                            $(this).after(span);
                                            $(span).off('click').on('click', function() {
                                                $(this).next().click();
                                            }).next().addClass('hidden');
                                        });


                                    });


                                },
                                onclose() {}, onupdate: function() {}
                            }
                        };
                    }, true, 'confirm');
                }
                //create form
                if (typeof form !== 'object') {
                    form = document.createElement('form');
                    form.className = 'user-config-form';

                    for (var key in this.plugins) {
                        if (typeof this.plugins[key] === 'object') {
                            if (typeof this.plugins[key].configure.element === 'function') {
                                el = this.plugins[key].configure.element();
                                form.appendChild(el);
                            }
                        }
                    }
                    form.appendChild(toolbox.ui.htmlToElement('<p class="user-config-prompt">Please select the functions to enable.</p>'));
                }

                alertify.configure('User Script : Configuration', form, function() {
                    //save plugins
                    $(this.elements.content).find('.user-toggle > input:checkbox').trigger('save').each(function() {
                        $(this).attr('data-enabled', this.checked ? 1 : 0);
                    });
                    alertify.message('User Script : Configuration Saved');

                }, function() {
                    console.debug('cancel');
                    console.debug(this);
                });


            },
            init: function() {
                this.onload();
                var that = this;
                Object.keys(that.plugins).map(function(key) {
                    var plugin = that.plugins[key];
                    if (typeof plugin === 'object' && plugin.enabled()) {
                        plugin.init();
                    }
                });
            },

            onload: function() {
                toolbox.ui.addstyle(css);
                var that = this;
                Object.keys(that.plugins).map(function(key) {
                    var plugin = that.plugins[key];
                    if (typeof plugin === 'object') {
                        plugin.onload();
                    }
                });
                toolbox.ui.loadstyles();
            }

        };
    }();

    app.loadplugin({
        meta: {
            name: `ui`,
            displayname: `UI Remaster`,
            description: `User interface improvements`
        },
        configure: {
            /**
             * Click on element event
             * @param {type} e event
             */
            click: function(e) {

            },
            /**
             * Change event
             * @param {type} e
             * @returns {undefined}
             */
            change: function(e) {

            },
            /**
             * Called first to initialize components
             */
            init: function() {

            }
        },
        /**
         * Called at each page initialization
         */
        init: function() {

        },
        /**
         * Called before init()
         */
        onload: function() {

        }
    });


    app.loadplugin({
        meta: {
            name: `fav`,
            displayname: `Favorites`,
            description: `Display favorites on the dramas and anime lists. (needs to be logged in for it to work)`
        },
        configure: {
            /**
             * Click on element event
             * @param {type} e event
             */
            click: function(e) {

            },
            /**
             * Change event
             * @param {type} e
             * @returns {undefined}
             */
            change: function(e) {
                if (this.checked && typeof Cookies.get('auth') === 'undefined') {
                    this.checked = false;
                    alertify.warning('You are not logged in, you cannot use the favorite function.');
                    /*$(this).parents('form:first')[0].reset();*/
                    //$(this).parents('.ajs-dialog:first').find('.ajs-ok')[0].disabled = true;
                }

            },
            /**
             * Called first to initialize components
             */
            init: function() {

            }
        },
        /**
         * Called at each page initialization
         */
        init: function() {

        },
        /**
         * Called before init
         */
        onload: function() {

        }
    });



    app.loadplugin({
        meta: {
            name: `autoserver`,
            displayname: `Auto Server`,
            description: `Select your favorite streaming server and autoloads it if available`
        },
        configure: {
            /**
             * Click on element event
             * @param {type} e event
             */
            click: function(e) {

            },
            /**
             * Change event
             * @param {type} e
             * @returns {undefined}
             */
            change: function(e) {

            },
            /**
             * Called first to initialize components
             */
            init: function() {

            }
        },
        /**
         * Called at each page initialization
         */
        init: function() {

        },
        /**
         * Called when dom ready
         */
        onload: function() {

        }
    });





    //var toolbox = new ToolBox({debug: true});
    var toolbox = new ToolBox();

    toolbox.onload = function() {
        toolbox.loader.enabled = false;
        toolbox.cssloader = new CSSLoader();
        toolbox.cssloader.configure();
    };

    toolbox.init(function() {
        toolbox.cookies.init(function() {
            toolbox.notify = new alertifyjs();
            toolbox.notify.init(function() {
                //override browser notifications
                window.alert = alertify.alert;
                window.confirm = alertify.confirm;
                window.notify = alertify.message;
                toolbox.loader.hide();
                app.init();
                app.configure();


                /*alertify.confirm().set({onshow: function() {
                 alertify.message('confirm was shown.');
                 console.debug(this);
                 }});
                 alertify.confirm('Demo');*/



            });
        });
    });
})();
