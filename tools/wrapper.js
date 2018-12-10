
((document, window, global, undef) => {

    const s = "string", b = "boolean", f = "function", o = "object", u = "undefined", n = "number";

    /**
     * Check if plain object
     * @param {any} v
     * @returns {Boolean}
     */
    function isPlainObject(v) {
        return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
    }

    /**
     * check if array
     * @param {any} v
     * @returns {boolean}
     */
    function isArray(v) {
        return Array.isArray(v);
    }

    /**
     * Check if Element or Document
     * @param {any} v
     * @returns {boolean}
     */
    function isValidElement(v) {
        return (v instanceof Element || v === document);
    }


    /**
     * Simple Element Wrapper
     * @param {Element|NodeList|string} nodes
     */

    const w = ((doc, win, global, undef) => {

        /**
         * Simple Element Wrapper
         * @param {Element|NodeList|string} nodes
         */
        function w(nodes) {
            if (!(this instanceof w)) {
                return new w(nodes);
            }
            let list = [];
            if (nodes instanceof NodeList) {
                list = Array.from(nodes);
            } else if (isValidElement(nodes)) {
                list.push(nodes);
            } else if (typeof nodes === s) {
                list = Array.from(doc.querySelectorAll(nodes));
            }

            Object.assign(this, list);
            Object.defineProperties(this, {
                nodes: {
                    value: list
                },
                length: {
                    get() {
                        return this.nodes.length;
                    }
                }
            });
            return this;
        }

        w.fn = w.prototype = {};

        w.fn.extend = w.extend = function extend(source) {
            if (isPlainObject(source)) {
                Object.keys(source).forEach(function(k) {
                    Object.defineProperty(this, k, {
                        value: source[k],
                        configurable: true, writable: true
                    });
                }, this);
            }
            return this;
        };
        w.extend({
            register(name, resource) {
                let root = typeof win !== undef ? win : global;
                if (root instanceof Object) {
                    if (typeof name === s && resource !== undef) {
                        root[name] = resource;
                        return true;
                    } else if (isPlainObject(name)) {
                        Object.keys(name).forEach((key) => {
                            if (name[key] !== undef) {
                                root[key] = name[key];
                            }
                        });
                        return true;
                    }
                }
                return false;

            }
        });

        w.fn.extend({
            get(index) {
                if (typeof index === n) {
                    return this[n];
                }
                return this;
            },
            each(callback) {
                if (typeof callback === f) {
                    this.nodes.forEach(function(node, index) {
                        callback.call(node, index, node, this);
                    }, this);
                }
                return this;
            }
        });

        ["extend", "get", "each", "register"].forEach((x) => {
            (w.hasOwnProperty(x) && Object.defineProperty(w, x, {enumerable: false, configurable: false, writable: false}));
            (w.fn.hasOwnProperty(x) && Object.defineProperty(w.fn, x, {enumerable: false, configurable: false, writable: false}));
        });

        w.register('w', w);

        return w;
    })(document, window, this);




    ((doc, win, undef) => {

        /**
         * DataStore Interface
         * @type Class
         */
        class DataStore {
            constructor() {
                if (!(["get", "set", "has", "remove", "clear"].every(x => typeof this[x] === f))) {
                    throw new Error("DataStore Interface Error : Missing Methods.");
                }
                Object.defineProperty(this, '_isDataStore', {
                    value: true, configurable: true
                });
            }
        }

        class oStore extends DataStore {

            get(key) {
                if (typeof key === s) {
                    return this._data[key];
                } else if (key === undef) {
                    return this._data;
                }
            }
            set(key, val) {
                if (typeof key === s) {
                    this._data[key] = val;
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach(function(prop) {
                        this._data[prop] = key[prop];
                    }, this);
                }
                return this;
            }
            has(key) {
                return this._data.hasOwnProperty(key);
            }
            remove(key) {
                if (typeof key === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach(function(prop) {
                        if (typeof prop === s) {
                            delete this._data[prop];
                        }
                    }, this);
                }
                return this;
            }
            clear() {
                Object.keys(this._data).forEach((key) => {
                    this.remove(key);
                });
                return this;
            }

            constructor(obj) {
                super();
                if (!isPlainObject(obj)) {
                    obj = {};
                }
                Object.defineProperty(this, '_data', {
                    value: obj, configurable: true, writable: true
                });

            }

        }


        /**
         * w().data()
         */
        class WrapperDataStore extends oStore {

            static get _storekey() {
                return "WrapperDataStore";
            }

            constructor(el) {

                if (!isValidElement(el)) {
                    throw new Error('Datastore : Cannot instanciate, invalid argument : el');
                }
                let obj = el[WrapperDataStore._storekey];
                if (!el.hasOwnProperty(WrapperDataStore._storekey)) {
                    obj = {};
                    Object.defineProperty(el, WrapperDataStore._storekey, {
                        value: obj, configurable: true
                    });
                }
                super(obj);
            }
        }

        w.extend({
            datastore(el) {
                if (!isValidElement(el)) {
                    return;
                }
                return new WrapperDataStore(el);
            },
            data(el, key, val) {
                if (!isValidElement(el)) {
                    return;
                }
                let data = this.datastore(el);
                //set
                if ((typeof key === s && val !== undef) || isPlainObject(key)) {
                    data.set(key, val);
                    return;
                }
                //get
                if (typeof key === s || key === undef) {
                    return data.get(key);
                }
            }
        });

        w.fn.extend({
            data(key, val) {
                //set
                if ((val !== undef && typeof key === s) || isPlainObject(key)) {
                    return this.each(function() {
                        w.data(this, key, val);
                    });
                }
                //get
                if (this.length > 0 && (typeof key === s || key === undef)) {
                    let self = this[0];
                    return w.data(self, key);
                }
                return this;
            }
        });



        /**
         * Storage
         */
        class xStore extends DataStore {

            constructor(storage) {
                super();
                if (!(storage instanceof Storage)) {
                    throw new Error('xStore : argument not instance of Storage');
                }
                Object.defineProperty(this, '_storage', {
                    value: storage,
                    configurable: true
                });
            }

            get(key) {
                let retval, sval;
                //get one
                if (typeof key === s) {
                    if ((sval = this._storage.getItem(key)) !== null) {
                        try {
                            retval = JSON.parse(sval);
                        } catch (e) {
                            retval = sval;
                        }
                    }
                } else if (typeof key === u) {
                    //get all
                    retval = {};
                    for (let i = 0; i < this._storage.length; i++) {
                        key = this._storage.key(i);
                        retval[key] = this.get(key);
                    }
                }
                return retval;

            }
            set(key, val) {
                if (typeof key === s && typeof val !== u) {
                    let sval = val;
                    try {
                        val = JSON.stringify(sval);
                    } catch (e) {
                        val = sval;
                    }
                    this._storage.setItem(key, val);
                    return this;
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach((k) => {
                        this.set(k, key[k]);
                    });
                }
                return this;
            }
            has(key) {
                return typeof this.get(key) !== u;

            }
            remove(key) {
                if (typeof key === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach((k) => {
                        this._storage.removeItem(k);
                    });
                }
                return this;
            }
            clear() {
                this._storage.clear();
                return this;
            }

        }

        /**
         * GM_STORE
         */
        class gmStore extends DataStore {
            static get available() {
                return ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].every((fn) => {
                    try {
                        if (typeof eval(fn) !== f) {
                            return true;
                        }
                    } catch (e) {
                        return false;
                    }
                });
            }

            constructor() {
                super();
                let disabled = [];
                ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].forEach((fn) => {
                    try {
                        if (typeof eval(fn) !== f) {
                            disabled.push(fn);
                        }
                    } catch (e) {
                        disabled.push(fn);
                    }
                });
                if (disabled.length > 0) {
                    if (disabled.length === 4) {
                        console.warn("gmStore disabled.");
                        return;
                    }
                    disabled.forEach((fn) => {
                        console.warn('gmStore cannot use', fn);
                    });
                }
            }

            get(key) {

                let retval = undef, sval;
                //get one
                if (typeof key === s) {
                    if (typeof GM_getValue === f) {
                        retval = GM_getValue(key);
                    }
                } else if (typeof key === u) {
                    //get all
                    retval = {};
                    if (typeof GM_listValues === f) {
                        GM_listValues().forEach((key) => {
                            retval[key] = this.get(key);
                        });
                    }
                }
                return retval;

            }
            set(key, val) {

                if (typeof key === s && typeof val !== u) {
                    if (typeof GM_setValue === f) {
                        GM_setValue(key, val);
                    }
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach((k) => {
                        this.set(k, key[k]);
                    });
                }
                return this;
            }
            has(key) {
                return typeof this.get(key) !== u;
            }
            remove(key) {
                if (typeof key === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    if (typeof GM_deleteValue === f) {
                        key.forEach((k) => {
                            GM_deleteValue(k);
                        });
                    }
                }
                return this;
            }
            clear() {
                Object.keys(this.get()).forEach((key) => {
                    this.remove(key);
                });
                return this;
            }

        }


        /**
         * Proxy
         */

        class DataStoreProxyHandler {
            get(target, prop) {
                return (target.hasOwnProperty(prop) || typeof target[prop] === f) ? target[prop] : target.get(prop);
            }
            set(target, prop, value) {
                target.set(prop, value);
            }
            has(target, prop) {
                return (target.hasOwnProperty(prop) || target.has(prop));
            }
            deleteProperty(target, prop) {
                target.remove(prop);
            }
            ownKeys(target) {
                return Object.keys(target.get());
            }
            getOwnPropertyDescriptor(target, prop) {
                if (target.has(prop)) {
                    return {configurable: true, enumerable: true, writable: true, value: target.get(prop)};
                }
            }
            // !obsolete
            enumerate(target) {
                return this.ownKeys(target)[Symbol.iterator]();
            }
            constructor(datastore) {
                if (!(datastore instanceof DataStore)) {
                    throw new Error("DataStoreProxyHandler invalid argument : Not a DataStore");
                }
                return new Proxy(datastore, this);
            }
        }


        class kStore extends oStore {

            get(key) {
                let val = super.get(key);
                this.__save();
                return val;
            }
            set(key, val) {
                super.set(key, val);
                return this.__save();
            }

            remove(key) {
                super.remove(key);
                return this.__save();
            }
            clear() {
                super.clear();
                this.__datastore.remove(this.__key);
                return this;
            }
            __save() {
                this.__datastore.set(this.__key, this._data);
                return this;
            }

            constructor(datastore, key) {
                if (!datastore._isDataStore) {
                    throw new Error("keyStore invalid argument : Not a DataStore");
                }
                if (typeof key !== s) {
                    throw new Error("keyStore invalid argument : key is not a String");
                }

                let obj = {}, val = datastore.get(key);
                if (isPlainObject(val)) {
                    Object.assign(obj, val);
                }
                super(obj);

                Object.defineProperties(this, {
                    __datastore: {
                        value: datastore,
                        configurable: true
                    },
                    __key: {
                        value: key,
                        configurable: true
                    }
                });
            }
        }

        function keyStore(datastore, key) {
            if (!(this instanceof keyStore)) {
                return;
            }
            return new DataStoreProxyHandler(new kStore(datastore, key));
        }


        if (gmStore.available === true) {
            w.extend({
                gmStore: new DataStoreProxyHandler(new gmStore())
            });
        }

        w.extend({
            localStore: new DataStoreProxyHandler(new xStore(win.localStorage)),
            sessionStore: new DataStoreProxyHandler(new xStore(win.sessionStorage))
        });

        w.register({
            gmStore: gmStore,
            DataStore: DataStore,
            oStore: oStore,
            keyStore: keyStore,
            DataStoreProxyHandler: DataStoreProxyHandler
        });

    })(document, window);


    ((doc, win, undef) => {


        /**
         * Events
         */

        class EventData {

            add(params) {
                this.events = params;
                return this.events.includes(params);
            }
            remove(type, fn, capture) {
                let len = this.events.length;
                this._data.events = this._data.events.filter((x) => {
                    return !(type === x.type && capture === x.options.capture && fn === x.fn);
                });

                return (this.events.length !== len || len === 0);
            }
            find(type) {
                return this._data.events.filter((x) => {
                    return type === x.type;
                });
            }

            constructor(el) {
                let data = w.data(el);
                if (!isArray(data.events)) {
                    data.events = [];
                }
                Object.defineProperties(this, {
                    _data: {
                        value: data, configurable: true
                    },
                    events: {
                        get() {
                            return this._data.events;
                        },
                        set(params) {
                            if (isPlainObject(params)) {
                                if ((typeof params.type === s && params.type.length > 0) && typeof params.fn === f && isPlainObject(params.options)) {
                                    this._data.events.push(params);
                                }
                            }
                        }, configurable: true
                    }
                });

            }

        }

        w.extend({

            on(el, type, fn, ...opts) {
                if (typeof type !== s || typeof fn !== f || typeof el.addEventListener !== f) {
                    return;
                }
                let params = {
                    element: el,
                    type: "",
                    fn: fn,
                    options: {
                        capture: false,
                        once: false,
                        passive: false
                    }
                };
                opts.forEach((arg) => {
                    if (typeof arg === b) {
                        params.options.capture = arg;
                    }
                    if (isPlainObject(arg)) {
                        for (let k in params.options) {
                            params.options[k] = arg[k] === true;
                        }
                    }
                });
                let data = new EventData(el);

                type.split(" ").forEach((t) => {
                    data.events = Object.assign({}, params, {type: t});
                    el.addEventListener(t, fn, params.options);
                });
            },
            one(el, type, fn, ...opts) {
                let capture = false;
                opts.forEach((arg) => {
                    if (typeof arg === b) {
                        capture = arg;
                    }
                });
                opts.push({once: true, capture: capture === true});
                return this.on(el, type, fn, ...opts);
            },
            off(el, ...opts) {
                if (typeof el.removeEventListener !== f) {
                    return;
                }

                let type, fn, capture = false;
                opts.forEach((arg) => {
                    if (isPlainObject(arg)) {
                        capture = arg.capture === true;
                        return;
                    }
                    switch (typeof arg) {
                        case b:
                            capture = arg;
                            break;
                        case s:
                            type = arg;
                            break;
                        case f:
                            fn = arg;
                            break;
                    }
                });
                let data = new EventData(el);

                if (typeof fn !== f) {
                    if (typeof type === s) {
                        return type.split(' ').forEach(function(t) {
                            data.find(t).forEach(function(params) {
                                if (params.options.capture === capture) {
                                    this.off(el, params.type, params.fn, params.options.capture);
                                }
                            }, this);
                        }, this);
                    } else if (type === undef) {
                        return data.events.forEach(function(params) {
                            if (params.options.capture === capture) {
                                this.off(el, params.type, params.fn, params.options.capture);
                            }
                        }, this);

                    }
                    return;
                }

                if (typeof type === s) {
                    type.split(" ").forEach((t) => {
                        data.remove(t, fn, capture);
                        el.removeEventListener(t, fn, params.options);
                    });
                }
            },

            trigger(el, type, data) {
                if (typeof el.dispatchEvent !== f) {
                    return;
                }
                if (typeof type === s) {
                    type.split(" ").forEach((t) => {
                        let event = new Event(t, {bubbles: true, cancelable: true});
                        event.data = data;
                        el.dispatchEvent(event);
                    });
                }
            }

        });

        ["on", "one", "off", "trigger"].forEach((fn) => {
            let obj = {};
            obj[fn] = function(...args) {
                return this.each(function() {
                    w[fn](this, ...args);
                });
            };
            w.fn.extend(obj);
        });


    })(document, window);


    ((doc, win, undef) => {

        const defaults = {
            delay: 400,
            callback: undef
        };

        w.extend({

            show(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if (typeof callback === n) {
                    delay = callback;
                }
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;

                if (typeof callback === f) {
                    w.one(el, "show", callback);
                }
                setTimeout(() => {
                    el.hidden = false;
                    w.trigger(el, "show");
                }, delay);

            },
            hide(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if (typeof callback === n) {
                    delay = callback;
                }
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;
                if (typeof callback === f) {
                    w.one(el, "hide", callback);
                }
                setTimeout(() => {
                    el.hidden = true;
                    w.trigger(el, "hide");
                }, delay);
            },
            toggle(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if (typeof callback === n) {
                    delay = callback;
                }
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;
                setTimeout(() => {
                    if (el.hidden === true) {
                        return this.show(el, callback, 0);
                    }
                    this.hide(el, callback, 0);
                }, delay);
            }

        });

        ["show", "hide", "toggle"].forEach((fn) => {
            let obj = {};
            obj[fn] = function(...args) {
                return this.each(function() {
                    w[fn](this, ...args);
                });
            };
            w.fn.extend(obj);
        });


    })(document, window);

    ((doc, win, undef) => {
        /**
         * DOM Events
         */
        w.extend({
            body(callback) {
                if (typeof callback === f) {
                    let i = setInterval(function() {
                        if (doc.bod !== null) {
                            clearInterval(i);
                            callback();
                        }
                    }, 1);
                }
            },
            iddle(callback) {
                if (typeof callback === f) {
                    if (doc.readyState === "loading") {
                        return doc.addEventListener('DOMContentLoaded', function DOMContentLoaded(e) {
                            doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                            callback();
                        });
                    }
                    callback();
                }
            },
            ready(callback) {
                if (typeof callback === f) {
                    if (doc.readyState !== "complete") {
                        return win.addEventListener('load', function load(e) {
                            win.removeEventListener('load', load);
                            callback();
                        });
                    }
                    callback();
                }
            }
        });

    })(document, window);


    ((doc, win, undef) => {
        /**
         * Easy access to datasets
         */
        w.fn.extend({
            dataset(k, v) {
                let r = this;
                if (k === undef) {
                    r = undef;
                    if (this.length > 0) {
                        r = {};
                        for (let i in this[0].dataset) {
                            r[i] = this.dataset(i);
                        }
                    }
                } else if (typeof k === s) {
                    //set
                    if (v !== undef) {
                        this.each(function() {
                            if (v === null) {
                                delete(this.dataset[k]);
                                return;
                            }
                            if (this.dataset) {
                                this.dataset[k] = typeof v === s ? v : JSON.stringify(v);
                            }

                        });
                    } else if (this.length > 0) {
                        r = undef;
                        if (this[0].dataset[k] !== undef) {
                            try {
                                r = JSON.parse(this[0].dataset[k]);
                            } catch (e) {
                                r = this[0].dataset[k];
                            }
                        }
                    }
                } else if (isPlainObject(k)) {
                    Object.keys(k).forEach(function(key) {
                        this.dataset(key, k[key]);
                    }, this);
                }
                return r;
            }
        });
    })(document, window);



    ((doc, win, undef) => {

        /**
         * Node Finder
         */
        w.fn.extend({
            findNode: (function() {

                const MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;
                const options = {
                    attributes: true,
                    characterData: true,
                    childList: true,
                    subtree: true
                };
                const defaults = {
                    selector: "",
                    callback: null,
                    once: true
                };

                function triggerEvent(node, params, obs) {
                    let event = new Event("DOMNodeFound", {bubbles: true, cancelable: true});
                    event.data = {
                        options: params,
                        observer: obs
                    };
                    node.dispatchEvent(event);
                }

                function nodeFinder(el, selector, callback, once) {
                    let params = Object.assign({}, defaults);

                    for (let i = 1; i < arguments.length; i++) {
                        let arg = arguments[i];
                        switch (typeof arg) {
                            case s:
                                params.selector = arg;
                                break;
                            case b:
                                params.once = arg;
                                break;
                            case f:
                                params.callback = callback;
                                break;
                            case o:
                                if (isPlainObject(arg)) {
                                    Object.assign(params, arg);
                                }
                                break;
                        }
                    }
                    selector = params.selector;
                    callback = params.callback;
                    once = params.once;
                    if (typeof callback === f) {
                        let matches = [];

                        function DOMNodeFound(e) {
                            if (typeof e.data === u) {
                                return;
                            }
                            let self = e.target, params = e.data.options, obs = e.data.observer;
                            if (selector === params.selector) {
                                let retval = params.callback.call(self, e);
                                if (params.once === true || retval === false) {
                                    el.removeEventListener(e.type, DOMNodeFound);
                                    obs.disconnect();
                                }
                                return retval;
                            }
                        }

                        el.addEventListener("DOMNodeFound", DOMNodeFound, false);

                        let observer = new MutationObserver(function(m, obs) {
                            for (let i = 0; i < m.length; i++) {
                                let rec = m[i], target = rec.target;
                                if (typeof target.matches === u) {
                                    continue;
                                }
                                if (target.matches(selector)) {
                                    if (target.parentElement instanceof Element && !matches.includes(target)) {
                                        matches.push(target);
                                        triggerEvent(target, params, obs);
                                    }
                                }

                            }
                        });
                        observer.observe(el, options);

                        function run() {
                            el.querySelectorAll(selector).forEach((target) => {
                                if (!matches.includes(target)) {
                                    matches.push(target);
                                    triggerEvent(target, params, observer);
                                }
                            });
                        }

                        if (doc.readyState === 'loading') {
                            doc.addEventListener('DOMContentLoaded', function DOMContentLoaded(e) {
                                doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                                run();
                            });
                        }
                        if (doc.readyState !== 'complete') {
                            win.addEventListener('load', function load(e) {
                                win.removeEventListener('load', load);
                                run();
                            });
                            return;
                        }
                        run();
                    }

                }

                return function findNode(selector, callback, once) {
                    let args = arguments;
                    return this.each(function() {
                        nodeFinder(this, ...args);
                    });
                };

            })()
        });





    })(document, window);

    ((doc, win, undef) => {


        /**
         * Utility Functions
         */
        w.extend({

            html2element(html) {
                if (typeof html === s) {
                    let template = doc.createElement('template');
                    html = html.trim();
                    template.innerHTML = html;
                    return template.content.firstChild;
                }
            },
            html2doc(html) {
                let node = doc.implementation.createHTMLDocument().documentElement;
                if (typeof html === s && html.length > 0) {
                    node.innerHTML = html;
                }
                return node;
            },
            text2node(text) {
                if (typeof text === s) {
                    return doc.createTextNode(text);
                }
            },
            addcss(css) {
                if (typeof css === s && css.length > 0) {
                    let s = doc.createElement('style');
                    s.setAttribute('type', "text/css");
                    s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
                    doc.head.appendChild(s);
                    return s;
                }
            },
            addscript(src) {
                if (typeof src === s && src.length > 0) {
                    let s = doc.createElement("script");
                    s.setAttribute("type", "text/javascript");
                    s.appendChild(doc.createTextNode(src));
                    doc.head.appendChild(s);
                    return s;
                }
            },
            copy2clipboard(text) {
                let r = false;
                if (typeof text === s) {
                    let el = html2element(`<textarea>${text}</textarea>"`);
                    doc.body.appendChild(el);
                    el.style.opacity = 0;
                    el.select();
                    r = doc.execCommand("copy");
                    doc.body.removeChild(el);
                }
                return r;
            },
            isValidUrl: (() => {
                const weburl = new RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
                return function isValidUrl(url) {
                    if (typeof url === s && url.length > 0) {
                        return weburl.test(url);
                    }
                    return false;
                };
            })(),
            loadScript(src, callback, binding) {
                if (isValidUrl(src)) {
                    let script = doc.createElement('style');
                    script.type = 'text/javascript';
                    script.defer = true;
                    if (typeof callback === "function") {
                        script.onload = script.onerror = function(e) {
                            return callback.call(binding, e.type !== "error", e);
                        };
                    }
                    doc.head.appendChild(script);
                    script.src = src;
                }
            },
            loadCSS(src, callback, binding) {
                if (isValidUrl(src)) {
                    let style = doc.createElement('style');
                    style.type = 'text/css';
                    if (typeof callback === "function") {
                        style.onload = style.onerror = function(e) {
                            return callback.call(binding, e.type !== "error", e);
                        };
                    }
                    doc.head.appendChild(style);
                    style.src = src;
                    return style;
                }
            }

        });

    })(document, window);

    ((doc, win, undef) => {

        /**
         * Returns trailing name component of path
         * @param {string} p - Path
         * @param {string} [s] - Suffix
         * @returns {string|undefined}
         */
        function basename(p, s) {
            let b = typeof p === "string" && p.length > 0 ? p.replace('\\', '/').split('/').pop() : undefined;
            if (typeof s === "string" && s.length > 0 && typeof b === "string" && b.substr(b.length - s.length) === s) {
                b = b.substr(0, b.length - s.length);
            }
            return b;
        }

        /**
         * Returns a parent directory's path
         * @param {string} p - path
         * @param {number} [l] - levels
         * @returns {string|undefined}
         */
        function dirname(p, l = 1) {
            let b = typeof p === s && p.length > 0 ? p.replace('\\', '/').split('/') : undefined;
            if (!isArray(b)) return b;
            for (let n = 0; n < l; n++) {
                b.pop();
            }
            return b.length > 0 ? b.join('/') : '.';
        }
        /**
         * Returns the file extension (if checking an url please use new URL)
         * @param {string} p - path
         * @returns {string}
         */
        function extname(p) {
            if (typeof p !== s || p.length === 0 || p.lastIndexOf('.') < 1) return "";
            let b = basename(p);
            return typeof b === "string" ? b.split('.').pop() : "";
        }

        /**
         * Returns information about a file path
         * @param {string} p - path
         * @returns {object|undefined}
         */
        function pathinfo(p) {
            if (typeof p !== s || p.length === 0) return;
            let r = {
                dirname: dirname(p),
                basename: basename(p),
                extension: extname(p),
                filename: ''
            };
            if (w.isValidUrl(p)) {
                let a = doc.createElement('a');
                a.href = p;
                let url = new URL(a.href);
                Object.assign(r, {
                    basename: basename(url.pathname),
                    extension: extname(url.pathname)
                });
            }

            if (r.basename.length > 0) {
                let f = r.filename = r.basename;
                if (r.extension.length > 0) {
                    r.filename = f.substr(0, f.length - r.extension.length - 1);
                }
            }
            return r;
        }

        pathinfo.extension = extname;
        pathinfo.dirname = dirname;
        pathinfo.basename = basename;
        pathinfo.filename = function(p) {
            let r;
            return (r = pathinfo(p)) ? r.filename : undef;
        };

        w.extend({
            basename: basename,
            dirname: dirname,
            extname: extname,
            pathinfo: pathinfo
        });



        /**
         * Basic AJAX Functionnality
         */
        class xhRequest extends oStore {

            get(key) {
                if (typeof key === s) {
                    return this[key];
                } else if (key === undef) {
                    return this._data;
                }
            }
            set(key, val) {
                if (typeof key === s && this.has(key)) {
                    this[key] = val;
                } else if (typeof key === o) {
                    Object.keys(key).forEach(function(prop) {
                        this.set(prop, key[prop]);
                    }, this);
                }
                return this;
            }
            has(key) {
                return this._data.hasOwnProperty(key);
            }
            remove(key) {
                if (typeof key === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach(function(prop) {
                        this[prop] = null;
                    }, this);
                }
                return this;
            }

            constructor(options) {
                super();

                const defaults = {
                    //Basic settings used by xhr
                    url: null, method: "GET", async: true, data: null, username: null, password: null, headers: {},
                    credentials: false,
                    // add {"X-Requested-With": "XMLHttpRequest"} to same origin headers
                    ajax: false,
                    //add no-cache request header if false
                    cache: true,
                    //callbacks
                    before: null, success: null, error: null, complete: null,
                    //context to run the callbacks
                    context: null,
                    //timeout before aborting request (seconds or if > 60 ms)
                    timeout: 0
                };

                this._data = Object.assign({}, defaults);

                Object.defineProperties(this, {
                    url: {
                        configurable: true, enumerable: true,
                        set(url) {
                            if (typeof url === s) {
                                let a = doc.createElement('a');
                                a.href = url;
                                url = new URL(a.href);
                            }
                            if (url instanceof URL) {
                                this._data.url = url;
                                this.ajax = url.origin === doc.location.origin;
                            }
                            if (url === null) {
                                this._data.url = defaults.url;
                            }
                        }, get() {
                            return this._data.url;
                        }

                    },
                    ajax: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === b) {
                                switch (val) {
                                    case false:
                                        delete(this._data.headers["X-Requested-With"]);
                                        break;
                                    default :
                                        this._data.headers["X-Requested-With"] = "XMLHttpRequest";
                                        break;
                                }
                                this._data.ajax = val;
                            }
                            if (val === null) {
                                this.ajax = defaults.ajax;
                            }
                        }, get() {
                            return this._data.ajax;
                        }
                    },
                    credentials: {
                        configurable: true, enumerable: true,
                        set(val) {
                            this._data.credentials = val === true;
                        }, get() {
                            return this._data.credentials;
                        }
                    },
                    method: {
                        configurable: true, enumerable: true,
                        set(method) {
                            if (typeof method === s && ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"].includes(method.toUpperCase())) {
                                this._data.method = method.toUpperCase();
                            }
                            if (method === null) this._data.method = defaults.method;
                        }, get() {
                            return this._data.method;
                        }
                    },
                    async: {
                        configurable: true, enumerable: true,
                        set(async) {
                            this._data.async = async !== false;
                        }, get() {
                            return this._data.async;
                        }
                    },
                    username: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === s) this._data.username = val;
                            if (val === null) this._data.username = defaults.username;
                        }, get() {
                            return this._data.username;
                        }
                    },
                    password: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === s) this._data.password = val;
                            if (val === null) this._data.password = defaults.password;
                        }, get() {
                            return this._data.password;
                        }
                    },
                    headers: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (isPlainObject(val)) {
                                Object.assign(this._data.headers, val);
                            }
                            if (val === null) this._data.headers = Object.assign({}, defaults.headers);
                        }, get() {
                            return this._data.headers;
                        }
                    },
                    cache: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === b) {
                                switch (val) {
                                    case true:
                                        delete(this._data.headers["Cache-Control"]);
                                        break;
                                    default :
                                        this._data.headers["Cache-Control"] = "no-cache";
                                        break;
                                }
                                this._data.cache = val;
                            }
                            if (val === null) this.cache = defaults.cache;
                        }, get() {
                            return this._data.cache;
                        }
                    },
                    context: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (val instanceof Object) {
                                this._data.context = val;
                            }
                            if (val === null) this._data.context = defaults.context;
                        }, get() {
                            return this._data.context;
                        }
                    },
                    timeout: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === n) {
                                if (val < 61) {
                                    val = val * 1000;
                                }
                                this._data.timeout = val;
                            }
                            if (val === null) this._data.timeout = defaults.timeout;
                        }, get() {
                            return this._data.timeout;
                        }
                    },
                    data: {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (val instanceof Document || val instanceof Blob || val instanceof FormData || val instanceof URLSearchParams || typeof val === s || isPlainObject(val)) {
                                this._data.data = val;
                            }
                            if (val === null) this._data.data = defaults.data;
                        }, get() {
                            if (isPlainObject(this._data.data)) {
                                let data = new URLSearchParams();
                                Object.keys(this._data.data).forEach(function(key) {
                                    data.set(key, this._data.data[key]);
                                }, this);
                                return data;
                            }
                            return this._data.data;
                        }
                    }
                });

                ["before", "success", "error", "complete"].forEach(function(key) {
                    Object.defineProperty(this, key, {
                        configurable: true, enumerable: true,
                        set(val) {
                            if (typeof val === f) {
                                this._data[key] = val;
                            }
                            if (val === null) this._data[key] = defaults[key];
                        }, get() {
                            return this._data[key];
                        }
                    });
                }, this);

                Object.defineProperty(this, 'xhr', {
                    configurable: true, writable: true,
                    value: null
                });

                if (isPlainObject(options)) {
                    this.set(options);
                }
            }

            _buildRequest(xhr) {
                if (this.url === null || this.success === null) {
                    throw new Error('xhRequest: no url or success function set.');
                }
                xhr.open(this.method, this.url.href, this.async, this.username, this.password);
                xhr.withCredentials = this.credentials;
                Object.keys(this.headers).forEach((key) => {
                    xhr.setRequestHeader(key, this.headers[key]);
                });
                if (this.timeout > 0) xhr.timeout = this.timeout;
                const self = this;
                //events
                xhr.onerror = xhr.onabort = xhr.ontimeout = function onerror(e) {
                    if (typeof self.error === f) {
                        return self.error.call(self.context === null ? this : self.context, xhr, self, e);
                    }
                };
                xhr.onloadend = function complete(e) {
                    if (typeof self.complete === f) {
                        return self.complete.call(self.context === null ? this : self.context, xhr, self, e);
                    }
                };
                xhr.onload = function(e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            return self.success.call(self.context === null ? this : self.context, xhr, self, e);
                        }
                        if (typeof self.error === f) {
                            return self.error.call(self.context === null ? this : self.context, xhr, self, e);
                        }
                    }
                };
                return xhr;
            }

            send(...opts) {
                opts.forEach(function(opt) {
                    if (typeof opt === s || opt instanceof URL) {
                        this.url = opt;
                        return;
                    }
                    if (opt instanceof FormData || opt instanceof URLSearchParams || isPlainObject(opt)) {
                        this.data = opt;
                        return;
                    }
                    if (typeof opt === f) this.success = opt;
                    if (typeof opt === n) this.timeout = opt;
                }, this);

                let xhr = this.xhr = new XMLHttpRequest();
                //before
                if (typeof this.before === f) {
                    if (false === this.before.call(this.context, xhr, this)) {
                        return false;
                    }
                }
                this._buildRequest(xhr);
                xhr.send(this.data);
                return this;
            }
        }

        w.extend({
            xhRequest: xhRequest
        });

    })(document, window);


    ((doc, win, undef) => {
        /**
         * Loads Resources and cache them into localStore
         */
        const loadResource = (() => {

            const xhRequest = w.xhRequest, ls = w.localStore, pathinfo = w.pathinfo;

            const globalSettings = {
                prefix: "w.loadResource.",
                expire: 5000,
                cache: true,
                execute: true,
                debug: false,
                types:{
                    "text/css": w.addcss,
                    "application/javascript": w.addscript
                }
            };

            function log(...args) {
                if (settings().debug === true) {
                    console.debug(...args);
                }
            }

            function settings(extend){
                if (isPlainObject(extend)) {
                    Object.keys(globalSettings).forEach(function(key) {
                        if (extend.hasOwnProperty(key) && typeof extend[key] === typeof globalSettings[key]) {
                            if (isPlainObject(extend[key])) {
                                Object.assign(globalSettings[key], extend[key]);
                                return;
                            }
                            globalSettings[key] = extend[key];
                        }
                    });
                }
                return globalSettings;
            }

            //clears the cache
            function clearCache() {
                log('loadResource: Clearing cache');
                Object.keys(ls.get()).forEach((key) => {
                    let val = ls.get(key);
                    if (isPlainObject(val) && val.iscacheddata === true) {
                        ls.remove(key);
                    }
                });
            }

            function getKey(url) {
                let p, key;
                if((p = pathinfo(url))){
                    key = settings().prefix + p.basename;
                }
                return key;
            }

            function getParams(options) {
                let params = {
                    url: "", key: "",
                    success: null, error: null, complete: null,
                    expire: settings().expire,
                    cache: settings().cache,
                    execute: settings().execute
                };
                if (isPlainObject(options)) {
                    Object.keys(params).forEach((key)=>{
                        if((typeof options[key] === typeof params[key]) || params[key] === null && typeof options[key] === f ){
                            params[key] = options[key];
                        }
                    });
                }
                return params;
            }

            function handleData(data, params, xhr) {
                if (params.execute === true) {
                    let types = settings().types;
                    Object.keys(types).forEach((type) => {
                        if (data.type.indexOf(type) === 0) {
                            log('loadResource: injecting', params.url, 'into the dom as', type);
                            types[type](data.content);
                        }
                    });
                }
                if (typeof params.success === f) {
                    params.success.call(null, data, params);
                }
                if (xhr === undef && typeof params.complete === f) {
                    params.complete.call(null, data, params);
                }
            }

            function isValidData(data, params) {
                let now = +new Date();
                if (data.iscacheddata === true) {
                    if (!["type", "url", "content"].every(x => typeof x === s && x.length > 0)) {
                        return false;
                    }
                    //if expire is modified
                    if (typeof data.created === n) {
                        if (params.expire !== 0) {
                            let expire = data.created + (params.expire * 60 * 60 * 1000);
                            if ((expire - now) < 0) return false;
                        }
                    } else return false;
                    if (typeof data.expire === n) {
                        if (data.expire !== 0 && (data.expire - now) < 0) {
                            return false;
                        }
                    } else return false;
                    return true;
                }
                return false;
            }

            function createData(params, xhr) {
                let now = +new Date();
                if (xhr.responseText.length > 0 && xhr.getResponseHeader('content-type') !== null && xhr.status === 200) {
                    let data = {
                        iscacheddata: true,
                        url: params.url,
                        type: xhr.getResponseHeader('content-type'),
                        content: xhr.responseText,
                        expire: 0,
                        created: now
                    };
                    if (params.cache === true) {
                        if (params.expire !== 0) {
                            data.expire = now + (params.expire * 60 * 60 * 1000);
                        }
                    }
                    return data;
                }
            }

            function loadResource(...args) {
                let boolcount = 0, opts = {};
                args.forEach((arg)=>{
                    if (isArray(arg)) return arg.forEach(x => loadResource(x));
                    switch (typeof arg) {
                        case s:
                            opts.url = arg;
                            break;
                        case b:
                            if (boolcount === 0) {
                                opts.cache = arg;
                                boolcount++;
                                break;
                            }
                            opts.execute = arg;
                            break;
                        case f:
                            opts.success = arg;
                            break;
                        case n:
                            opts.expire = arg;
                        case o:
                            if (isPlainObject(arg)) {
                                Object.assign(opts, arg);
                            }
                            break;
                    }
                });

                if (typeof opts.url === s && opts.url.length > 0) {
                    opts.key = getKey(opts.url);
                    let params = getParams(opts), ks = new keyStore(ls, params.key);
                    if (params.cache === false) {
                        ks.clear();
                    } else if (isValidData(ks, params)) {
                        log('loadResource: Loading from cache', params.url);
                        return handleData(ks.get(), params);
                    }

                    log('loadResource: Downloading', params.url);

                    //loads the resource
                    let data, xh = new xhRequest({
                        url: params.url,
                        timeout: 15,
                        success(xhr) {
                            if ((data = createData(params, xhr))) {
                                log('loadResource: Success', params.url);
                                if (params.cache === true) {
                                    let ks = new keyStore(ls, params.key);
                                    ks.set(data);
                                }
                                return handleData(data, params, xhr);
                            }
                            w.trigger(xhr, 'error');
                        },
                        error(xhr) {
                            log('loadResource: Error', params.url);
                            if (typeof params.error === f) {
                                return params.error.call(null, params);
                            }
                        },
                        complete(xhr) {
                            if (typeof params.complete === f) {
                                return params.complete.call(null, data, params);
                            }
                        }
                    });
                    xh.send();
                }
            }
            loadResource.settings = settings;
            loadResource.clear = clearCache;
            return loadResource;
        })();

        w.extend({
            loadResource: loadResource
        });

    })(document, window);

    ((doc, win, undef) => {

        w.fn.extend({
            addClass(classname) {
                return this.each(function(node, index) {
                    if (this.classList === undef) return;
                    let classes = classname;
                    if (typeof classes === f) {
                        classes = classes.call(this, index, this.className);
                    }
                    if (typeof classes === s) {
                        this.classList.add(...classes.split(' '));
                    }
                });
            },
            removeClass(classname) {
                return this.each(function(node, index) {
                    if (this.classList === undef) return;
                    let classes = classname;
                    if (typeof classes === f) {
                        classes = classes.call(this, index, this.className);
                    }
                    if (typeof classes === s) {
                        this.classList.remove(...classes.split(' '));
                    }
                });
            },
            hasClass(classname) {
                if (this.length > 0 && typeof this[0].classList !== undef && typeof classname === s) {
                    return this[0].classList.contains(classname);
                }
                return false;
            }
        });



        w.extend({
            /**
             * Loads an animation
             *
             * @link https://daneden.github.io/animate.css/
             * @link https://github.com/daneden/animate.css
             * @param {Element} el Target Element
             * @param {string} animation Animations Class to use
             * @param {function} [callback] Function to use when animation Ends
             * @param {boolean} [toggle] Toggle Show Hide Automatically
             * @param {object} [options] Options to use
             * @returns {boolean}
             */
            animated: (() => {
                const animations = "bounce flash pulse rubberBand shake swing tada wobble jello bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flip flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight slideInUp slideInDown slideInLeft slideInRight slideOutUp slideOutDown slideOutLeft slideOutRight zoomIn zoomInDown zoomInLeft zoomInRight zoomInUp zoomOut zoomOutDown zoomOutLeft zoomOutRight zoomOutUp hinge jackInTheBox rollIn rollOut";
                const eventend = ((div) => {
                    const browerevents = {
                        animation: 'animationend',
                        OAnimation: 'oAnimationEnd',
                        MozAnimation: 'mozAnimationEnd',
                        WebkitAnimation: 'webkitAnimationEnd'
                    };
                    for (let style in browerevents) {
                        if (div.style[style] !== "undefined") {
                            return browerevents[style];
                        }
                    }
                })(doc.createElement('div'));
                const eventstart = eventend.replace(/End$/, 'Start').replace(/end$/, 'start');
                const types = ((a) => {
                    let result = {seeker: [], in: [], out: []};
                    a.forEach((cls) => {
                        let m, type = "seeker";
                        if ((m = /(In|Out)/.exec(cls)) !== null) {
                            type = m[1].toLowerCase();
                        }
                        result[type].push(cls);
                    });
                    return {
                        none: result.seeker,
                        show: result.in,
                        hide: result.out
                    };
                })(animations.split(' '));
                const list = animations.split(" ");
                const defaults = {
                    classList: "swing",
                    callback: null,
                    toggle: false
                };
                function getToggleMode(animation) {
                    if (typeof animation === s && animation.length > 0) {
                        let classList = animation.split(" ");
                        for (let i = 0; i < classList.length; i++) {
                            for (let type in types) {
                                if (types[type].includes(classList[i])) {
                                    return type;
                                }
                            }
                        }
                    }
                    return null;
                }
                function isAnimation(animation) {
                    return typeof getToggleMode(animation) === s;
                }
                return function animated(el, classList, callback, toggle) {
                    if (typeof el.classList !== undef) {
                        let params = Object.assign({}, defaults);
                        for (let i = 1; i < arguments.length; i++) {
                            let arg = arguments[i];
                            switch (typeof arg) {
                                case b:
                                    params.toggle = arg;
                                    break;
                                case f:
                                    params.callback = arg;
                                    break;
                                case s:
                                    params.classList = arg;
                                    break;
                            }
                        }


                        if (params.classList.length === 0 || !isAnimation(params.classList)) return false;
                        if (typeof params.callback === f) w.one(el, "animated", params.callback);
                        let mode;
                        if (params.toggle === true) mode = getToggleMode(params.classList);
                        el.classList.remove("animated", ...list);

                        setTimeout(() => {
                            if (mode === "show") el.hidden = false;
                            else if (mode === "hide") {
                                w.one(el, "animated", function() {
                                    el.hidden = true;
                                });
                            }
                            w.one(el, eventstart, function beginAnimation() {
                                w.one(el, eventend, function endAnimation() {
                                    el.classList.remove("animated", ...classList.split(' '));
                                    w.trigger(el, "animated");
                                });
                            });
                            el.classList.add('animated', ...params.classList.split(' '));
                        }, 400);
                        return true;
                    }
                    return false;
                };
            })()
        });

        w.fn.extend({
            animated(...args) {
                return this.each(function() {
                    w.animated(this, ...args);
                });
            }
        });


    })(document, window);





    ((doc, win, undef) => {
    })(document, window);


})(document, window, this);


