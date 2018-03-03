// ==UserScript==
// @name         9anime
// @namespace    https://github.com/ngsoft
// @version      1.2
// @description  UI Remaster
// @author       daedelus
// @include     *://9anime.*/*
// @include     *://*.9anime.*/*
// @grant none
// @noframes
// @updateURL   https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// @downloadURL https://raw.githubusercontent.com/ngsoft/archives/master/9anime.user.js
// ==/UserScript==


window.open = function() {};
window.eval = function() {};

function toolbox() {


    var styles;
    var defaults = {
        debug: false,
        exec: true,
        storage: 'gmc',
        jquery: {
            enabled: true,
            docready: true,
            autoload: false,
            src: 'https://code.jquery.com/jquery-3.2.1.min.js'
        },
        loader: {timeout: 1500, enabled: true},
        cookies: {
            enabled: false,
            expire: 14,
            src: 'https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js',
            autoload: true,
        },
        gmc: {
            src: 'https://greasyfork.org/scripts/34527-gmcommonapi-js/code/GMCommonAPIjs.js',
            autoload: false,
            enabled: false
        }

    };
    var params = defaults;
    var loader = {
        show: function() {},
        hide: function() {}
    };
    var data = {};
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



    function onVarReady(varname, callback, context = this, delay = 50, retry = 50) {

        var defaults = {
            name: "",
            context: onVarReady.caller,
            delay: 50,
            retry: 200,
            debug: params.debug
        };
        var props = {callbacks: []};
        for (var i in arguments) {
            var value = arguments[i];
            switch (typeof (value)) {
                case "string":
                    props.name = value;
                    break;
                case "number":
                    if (props.hasOwnProperty('delay')) {
                        props.retry = value;
                        break;
                    }
                    props.delay = value;
                    break;
                case "object":
                    props.context = value;
                    break;
                case "function":
                    props.callbacks.push(value);
                    break;
                case "boolean":
                    props.debug = value;
                    break;
            }
        }
        props = Object.assign({}, defaults, props);
        if (props.debug) {
            console.log('onVarReady parsed arguments :', props);
        }
        if (props.name.length < 1) {
            if (props.debug) {
                console.log('onVarReady invalid argument varname, not set');
            }
            return false;
        }
        if (props.callbacks.length < 1) {
            if (props.debug) {
                console.log('onVarReady invalid argument callback, not set');
            }
            return false;
        }
        var counter = 0;
        var repeat = function() {
            if (counter < props.retry) {
                if (window.hasOwnProperty(props.name)) {
                    for (var i in props.callbacks) {
                        callback = props.callbacks[i].bind(this);
                        callback();
                    }
                    return;
                }
                counter++;
                return setTimeout(repeat.bind(props.context), props.delay);
            }
            if (props.debug) {
                console.log(`onVarReady ${props.name} not found after ${parseFloat((props.retry * props.delay) / 1000)} seconds (${counter} tries)`);
            }
            return;
        };
        if (props.debug) {
            console.log(`onVarReady waiting for var ${props.name} to be ready.`);
        }
        repeat.bind(props.context)();
        return true;
    }

    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        params = merge(params, arguments[0]);
    }

    function gmcSetup() {
        console.log("Please add to your userscript header:");
        console.log(`// @require     https://greasyfork.org/scripts/34527-gmcommonapi-js/code/GMCommonAPIjs.js`);
    }

    var api = {
        /**
         * Loads remote .js file
         * @param {type} src
         * @returns {this}
         */
        loadscript: function(src = null) {
            if (src === null || src.length < 1) {
                return this;
            }
            if (params.debug) {
                console.log('User script : loading script ' + src + '.');
            }
            return this.ondomready(function() {
                s = document.createElement('script');
                s.setAttribute('src', src);
                s.setAttribute('type', "text/javascript");
                document.head.appendChild(s);
            });
        },
        /**
         * Loads remote css
         * @param {string} src
         * @returns {this}
         */
        loadcss: function(src = null) {
            if (src === null || src.length < 1) {
                return this;
            }
            if (params.debug) {
                console.log('User script : loading stylesheet ' + src + '.');
            }
            return this.ondomready(function() {
                s = document.createElement('link');
                s.setAttribute('rel', "stylesheet");
                s.setAttribute('type', "text/css");
                s.setAttribute('href', src);
                document.head.appendChild(s);
            });
        },
        /**
         * Add css string to dom
         * @param {string} css
         * @returns {this}
         */
        addstyle: function(css = null) {
            if (css === null || css.length < 1) {
                return this;
            }
            return this.ondomready(function() {
                if (params.debug) {
                    console.log('User script : adding css ' + css + '.');
                }
                s = document.createElement('style');
                s.setAttribute('type', "text/css");
                s.appendChild(document.createTextNode('<!-- ' + css + ' -->'));
                document.body.appendChild(s);
            });
        },
        /**
         * @param {String} html representing a single element
         * @return {Element}
         */
        elementcreate: function(html) {
            var template = document.createElement('template');
            html = html.trim();
            template.innerHTML = html;
            return template.content.firstChild;
        },
        /**
         * Add style to stylesheet
         * @param {string} css
         * @returns {this}
         */
        stylesheet: function(css = null) {
            if (typeof css === 'string' && css.length > 0) {
                styles += css;
            }
            return this;
        },
        /**
         * Loads and reset the stored stylesheet
         * @returns {this}
         */
        stylesheetdisplay: function() {
            if (styles.length > 0) {
                this.addstyle(styles);
                styles = ``;
            }
            return this;
        },
        /**
         * Loads function on dom ready
         * @param {function} fn
         * @returns {this}
         */
        ondomready: function(fn) {
            if (typeof fn !== 'function') {
                return this;
            }
            if (document.readyState != 'loading') {
                fn();
            } else {
                document.addEventListener('DOMContentLoaded', fn);
            }
            return this;
        },
        /**
         * Check whenever jquery is loaded
         * @returns {this}
         */
        jqueryready: function() {
            if (typeof jQuery === 'undefined') {
                return false;
            }
            return true;
        },
        /**
         * Loads callback when jQuery is available
         * @param {function} callback
         * @returns {this}
         */
        jqueryinit: function(callback = function() {}){
            if (params.jquery.autoload) {
                api.loadscript(params.jquery.src);
            }
            var args = Array.from(arguments);
            var execute = function(callbacks) {
                for (var i in callbacks) {
                    if (typeof callbacks[i] === 'function') {
                        callbacks[i].call(this);
                    }
                }
            }.bind(api);
            onVarReady('jQuery', function() {
                (function($) {
                    if (params.jquery.docready) {
                        if (params.debug) {
                            console.log('waiting for $.ready()');
                        }
                        $(document).ready(function() {
                            execute(args);
                        });
                        return;
                    }
                    if (params.debug) {
                        console.log('jQuery available, executing callbacks');
                    }
                    execute(args);
                })(jQuery);
            });
            return this;
        },
        loader: {
            /**
             * Setup ajax loader
             * @param {function} onshow
             * @param {function} onhide
             * @returns {this.loader}
             */
            setup: function(onshow = function() {}, onhide = function() {}){
                loader.onshow = onshow;
                loader.onhide = onhide;
                return this;
            },
            /**
             * Show ajax loader
             * @returns {this.loader}
             */
            show: function() {
                if (!params.loader.enabled) {
                    return this;
                }
                loader.onshow();
                return this;
            },
            /**
             * Hide ajax loader
             * @returns {this.loader}
             */
            hide: function() {
                if (!params.loader.enabled) {
                    return this;
                }
                if (params.loader.timeout > 0) {
                    setTimeout(loader.onhide, params.loader.timeout);
                    return this;
                }
                loader.onhide();
                return this;
            }
        },
        /**
         * Local Universal storage api
         * depends on gmc or cookies
         */
        storage: {
            /**
             * @returns {Boolean}
             */
            ready: function() {
                return false;
            },
            /**
             * Store a value
             * @param {string} name
             * @param {type} value
             * @returns {this}
             */
            set: function(name, value) {
                return this;
            },
            /**
             * Get a stored Value
             * @param {string} name
             * @param {type} value default value
             * @returns {string|null}
             */
            get: function(name, value = null) {
                return value;
            },
            /**
             * Get a stored object
             * @param {string} name
             * @param {object} value default value
             * @returns {object}
             */
            getobj: function(name, value = {}) {
                return value;
            },
            /**
             * Remove a value
             * @param {string} name
             * @returns {this}
             */
            remove: function(name) {
                return this;
            }
        },
        /**
         * GMC API
         * Web storage or GM_*
         */
        gmc: {
            init: function() {
                var args = Array.from(arguments);
                args = args.concat(['GMC', api]);
                if (params.gmc.autoload) {
                    window.GM_info = GM_info;
                    api.loadscript(params.gmc.src);
                }
                onVarReady.apply(this, args);
                return this;
            },
            /**
             * Check whenever the GMC variable is loaded
             * @returns {Boolean}
             */
            ready: function() {
                if (typeof GMC === 'undefined') {
                    return false;
                }
                return true;
            },
            /**
             * Store a value
             * @param {string} name
             * @param {type} value
             * @returns {this}
             */
            set: function(name, value) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot set value ' + value + ' for ' + name + ' : GMC not loaded');
                        gmcSetup();
                    }
                    return this;
                }
                switch (typeof (value)) {
                    case "object":
                        value = JSON.stringify(value);
                        break;
                    case "boolean":
                        value = value ? 1 : 0;
                        break;
                    default:
                        value = `${value}`;
                        break;
                }
                GMC.setValue(name, value);
                return this;
            },
            /**
             * Get a stored Value
             * @param {string} name
             * @param {type} value default value
             * @returns {string|null}
             */
            get: function(name, value = null) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot get value for ' + name + ' : GMC not loaded');
                        gmcSetup();
                    }
                    return value;
                }
                return GMC.getValue(name, value);
            },
            /**
             * Get a stored object
             * @param {string} name
             * @param {object} value default value
             * @returns {object}
             */
            getobj: function(name, value = {}) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot get object for ' + name + ' : GMC not loaded');
                        gmcSetup();
                    }
                    return value;
                }
                return JSON.parse(GMC.getValue(name, JSON.stringify(value)));
            },
            /**
             * Remove a value
             * @param {type} name
             * @returns {this}
             */
            remove: function(name) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot delete ' + name + ' : GMC not loaded');
                        gmcSetup();
                    }
                    return this;
                }
                GMC.deleteValue(name);
                return this;
            },
            /**
             * does nothing
             * @returns {this}
             */
            save: function() {
                return this;
            }
        },
        /**
         * Cookies API
         */
        cookies: {
            /**
             * Check whenever the Cookies variable is loaded
             * @returns {Boolean}
             */
            ready: function() {
                if (typeof Cookies === 'undefined') {
                    return false;
                }
                return true;
            },
            init: function() {
                if (params.cookies.autoload) {
                    api.loadscript(params.cookies.src);
                }
                var args = Array.from(arguments);
                args = args.concat(['Cookies', api]);
                onVarReady.apply(this, args);
                return this;
            },
            /**
             * Set a cookie
             * @param {string} name
             * @param {type} value
             * @returns {this}
             */
            set: function(name, value) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot set value ' + value + ' for cookie ' + name + ' : Cookies not loaded');
                    }
                    return this;
                }
                Cookies.set(name, value, {expires: params.cookies.expire});
                return this;
            },
            /**
             * Get a cookie Value
             * @param {string} name
             * @param {type} value default value
             * @returns {string|null}
             */
            get: function(name, value = null) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot get value for cookie ' + name + ' : Cookies not loaded');
                    }
                    return value;
                }
                get = Cookies.get(name);
                if (typeof get === 'undefined') {
                    return value;
                }
                return get;
            },
            /**
             * Get a cookie object
             * @param {string} name
             * @param {object} value default value
             * @returns {object}
             */
            getobj: function(name, value = {}) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot get object for cookie ' + name + ' : Cookies not loaded');
                    }
                    return value;
                }
                get = Cookies.getJSON(name);
                if (typeof get !== 'object') {
                    return value;
                }
                return get;
            },
            /**
             * Remove a cookie
             * @param {type} name
             * @returns {this}
             */
            remove: function(name) {
                if (!this.ready()) {
                    if (params.debug) {
                        console.log('User script : cannot delete cookie ' + name + ' : Cookies not loaded');
                    }
                    return this;
                }
                Cookies.remove(name);
                return this;
            }
        },
        /**
         * Check if varname exists in the global scope and loads the callback
         * @param {string} varname - Name of the var defined as window[varname]
         * @param {function} callback - Can trigger multiple callbacks
         * @param {number} [delay] - delay beetween interval
         * @param {number} [tries] - max loop count
         * @param {object} [context] - Object to use as this inside callbacks
         * @returns {this}
         */
        loadasset: function(varname, callback) {
            onVarReady.apply(this, Array.from(arguments));
            return this;
        },
        /**
         * Merge attributes from sub into base
         * @param {object} base
         * @param {object} sub
         * @returns {object}
         */
        mergeobj: merge,
        /**
         * Executes callback on dom ready or when all the dependencies are loaded
         * @param {function} callback
         * @returns {this}
         */
        init(callback = function() {}){
            if (params.debug) {
                console.log('User script : debug mode enabled.');
            }

            var args = Array.from(arguments);
            var execute = function(c) {
                for (var i in c) {
                    if (typeof c[i] === 'function') {
                        c[i].call(this);
                    }
                }
            }.bind(this);
            return this.ondomready(function() {
                if (params.jquery.enabled) {
                    return api.jqueryinit(function() {
                        if (params.gmc.enabled) {
                            return api.gmc.init(function() {
                                if (params.cookies.enabled) {
                                    return api.cookies.init(function() {
                                        execute(args);
                                    });
                                }
                                execute(args);
                            });
                        }
                        if (params.cookies.enabled) {
                            return api.cookies.init(function() {
                                execute(args);
                            });
                        }
                    });
                }
                if (params.gmc.enabled) {
                    return api.gmc.init(function() {
                        if (params.cookies.enabled) {
                            return api.cookies.init(function() {
                                execute(args);
                            });
                        }
                        execute(args);
                    });
                }
                if (params.cookies.enabled) {
                    return api.cookies.init(function() {
                        execute(args);
                    });
                }
                execute(args);
            });
        }
    };

    /**
     * Universal storage api
     */
    if (typeof params.storage === 'string' && params.storage.length > 0 && api.hasOwnProperty(params.storage) && typeof api[params.storage] === 'object') {
        var pass = true;
        //compare methods
        for (i in api.storage) {
            if (!api[params.storage].hasOwnProperty(i)) {
                pass = i;
                break;
            }
        }
        //overwrite with target
        if (pass === true) {
            if (params.debug) {
                console.log('Setting universal storage to ' + params.storage);
            }
            api.storage = api[params.storage];
        } else if (params.debug) {
            console.log('Cannot set universal storage to ' + params.storage + ', does not have the required method.', pass, 'Using dummy methods.');
        }

    } else if (params.debug) {
        console.log('Cannot set universal storage, property invalid.', params.storage);
    }
    return api;
}


(function() {

    toolbox().addstyle(`
        div[id*="BB_SK"],div[id*="bb_sa"], div[class*="ads_"],div[id*="rcjsload"],
        .ads-outsite, #disqus_thread, .hidden, .this-message-does-not-harm-to-you-dont-remove-it,
        .widget.crop, .widget.comment, iframe:not(.ignored), body.watch #sidebar{display: none !important;}
        #player iframe{display: block!important;}

        body.watch #main{margin:0!important; padding:0!important;}

    `).ondomready(function() {
        el = (el = document.getElementById('disqus_thread')) ? el.remove() : null;
    }).jqueryinit(function() {

        setTimeout(function() {
            $('div[id*="BB_SK"]', 'div[id*="bb_sa"]').remove();
            $('body.watch #iframe').addClass('ignored');
            $('iframe:not(.ignored)').remove();
        }, 2000);

    });

})();



