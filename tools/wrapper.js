((document, global, undef) => {
    /* jshint expr: true */
    /*eslint no-console: "off"*/
    /* jshint -W018 */
    /* jshint -W089 */


    const s = "string", b = "boolean", f = "function", o = "object", u = "undefined", n = "number", doc = document, win = global;
    const version = '1.0';
    /**
     * Check if plain object
     * @param {any} v
     * @returns {boolean}
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
     * Checks if valid URL
     * @param {string} url
     * @returns {boolean} 
     */
    function isValidUrl(url) {
        const weburl = new RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
        if (typeof url === s && url.length > 0) {
            return weburl.test(url);
        }
        return false;
    }

    /**
     * Returns trailing name component of path
     * @param {string} path - Path
     * @param {string} [suffix] - Suffix
     * @returns {string|undefined}
     */
    function basename(path, suffix) {
        let base = typeof path === s && path.length > 0 ? path.replace('\\', '/').split('/').pop() : undef;
        if (typeof suffix === s && suffix.length > 0 && typeof base === s && base.substr(base.length - suffix.length) === suffix) {
            base = base.substr(0, base.length - suffix.length);
        }
        return base;
    }

    /**
     * Returns a parent directory's path
     * @param {string} path - path
     * @param {number} [levels] - levels
     * @returns {string|undefined}
     */
    function dirname(path, levels = 1) {
        let base = typeof path === s && path.length > 0 ? path.replace('\\', '/').split('/') : undef;
        if (!isArray(base)) return base;
        for (let n = 0; n < levels; n++) {
            base.pop();
        }
        return base.length > 0 ? base.join('/') : '.';
    }
    /**
     * Returns the file extension (if checking an url please use new URL)
     * @param {string} p - path
     * @returns {string}
     */
    function extension(path) {
        if (typeof path !== s || path.length === 0 || path.lastIndexOf('.') < 1) return "";
        let base = basename(path);
        return typeof base === s ? base.split('.').pop() : "";
    }

    /**
     * Returns information about a file path
     * @param {string} p - path
     * @returns {object|undefined}
     */
    function pathinfo(path) {
        if (typeof path !== s || path.length === 0) return;
        let r = {
            dirname: dirname(path),
            basename: basename(path),
            extension: extension(path),
            filename: ''
        };
        if (isValidUrl(path)) {
            let a = doc.createElement('a');
            a.href = path;
            let url = new URL(a.href);
            Object.assign(r, {
                basename: basename(url.pathname),
                extension: extension(url.pathname)
            });
        }
        if (r.basename.length > 0) {
            let file = r.filename = r.basename;
            if (r.extension.length > 0) {
                r.filename = file.substr(0, file.length - r.extension.length - 1);
            }
        }
        return r;
    }

    pathinfo.extension = extension;
    pathinfo.dirname = dirname;
    pathinfo.basename = basename;
    pathinfo.filename = function (path) {
        let r;
        return (r = pathinfo(path)) ? r.filename : undef;
    };

    /**********************************/
    /*              Core              */
    /**********************************/

    /**
     * Simple Element Wrapper
     * @param {Element|NodeList|string} nodes
     */
    function wrapper(nodes) {
        if (!(this instanceof wrapper)) {
            return new wrapper(nodes);
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

    wrapper.fn = wrapper.prototype = {
        version: version,
        get(index) {
            if (typeof index === n) {
                return this.nodes[index];
            }
            return this.nodes;
        },
        each(callback) {
            if (typeof callback === f) {
                this.nodes.forEach(function (node, index) {
                    callback.call(node, index, node, this);
                }, this);
            }
            return this;
        }
    };

    wrapper.extend = wrapper.fn.extend = function extend(source) {
        if (isPlainObject(source)) {
            Object.keys(source).forEach(function (k) {
                Object.defineProperty(this, k, {
                    value: source[k],
                    configurable: true, writable: true
                });
            }, this);
        }
        return this;
    };

    wrapper.extend({
        version: version,
        declare(name, resource) {
            let root = global;
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

    /**********************************/
    /*            Storage             */
    /**********************************/

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

    /**
     * Create a Proxy to use key value pair assignement and loop through DataStore
     * @type {Class}
     * @param {Datastore} datastore
     */
    class DataStoreProxy {
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
                return { configurable: true, enumerable: true, writable: true, value: target.get(prop) };
            }
        }
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

    /**
     * Manipulate a plain object
     * @type {Class}
     * @extends {DataStore}
     * @param {Object} [obj]
     */
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
                Object.keys(key).forEach(function (prop) {
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
                key.forEach(function (prop) {
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
     * Store Data into an Element
     * @type {Class}
     * @extends {oStore}
     * @param {Element|Document} el
     */
    class eStore extends oStore {

        static get _storekey() {
            return "WrapperDataStore";
        }

        constructor(el) {

            if (!isValidElement(el)) {
                throw new Error('Datastore : Cannot instanciate, invalid argument : el');
            }
            let obj = el[eStore._storekey];
            if (!el.hasOwnProperty(eStore._storekey)) {
                obj = {};
                Object.defineProperty(el, eStore._storekey, {
                    value: obj, configurable: true
                });
            }
            super(obj);
        }
    }

    /**
     * Store data into localStorage or sessionStorage
     * @type {Class}
     * @extends {Datastore}
     * @param {Storage} storage
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
     * Key Store Uses a key inside a DataStore to manage Objects
     * @type {Class}
     * @extends {oStore}
     * @param {DataStore} datastore
     * @param {String} key
     */
    class kStore extends oStore {

        get(key) {
            let val = super.get(key);
            //do not save empty objects (use clear() instead)
            if (Object.keys(this._data).length > 0) {
                this.__save();
            }
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
                throw new Error("kStore invalid argument : Not a DataStore");
            }
            if (typeof key !== s) {
                throw new Error("kStore invalid argument : key is not a String");
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


    /* jshint -W117 */

    /**
     * Store data into GreaseMonkey 3 or Tampermonkey
     * @type {Class}
     * @extends {DataStore}
     */
    class gmStore extends DataStore {
        static get available() {
            return ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].every((fn) => {
                /*jshint evil:true */
                try {
                    if (typeof (eval(fn)) === f) return true;
                } catch (e) {
                    return false;
                }
                /*jshint evil:false */
            });
        }

        constructor() {
            super();

            let disabled = [];
            ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].forEach((fn) => {
                /*jshint evil:true */
                try {
                    if (typeof (eval(fn)) !== f) disabled.push(fn);
                } catch (e) {
                    disabled.push(fn);
                }
                /*jshint evil:false */
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
            let retval = undef;
            //get one
            if (typeof key === s) {
                if (typeof GM_getValue === f) {
                    retval = GM_getValue(key); // eslint-disable-line
                }
            } else if (typeof key === u) {
                //get all
                retval = {};
                if (typeof GM_listValues === f) {
                    GM_listValues().forEach((key) => { // eslint-disable-line
                        retval[key] = this.get(key);
                    });
                }
            }
            return retval;

        }
        set(key, val) {

            if (typeof key === s && typeof val !== u) {
                if (typeof GM_setValue === f) {
                    GM_setValue(key, val); // eslint-disable-line
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
                        GM_deleteValue(k); // eslint-disable-line
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
    /* jshint +W117 */


    /**
     * Special Store : wrap a datastore and use a kStore if values are plain Objects
     * @param {Datastore} datastore
     * @param {boolean} [useproxy] Automatically use DataStoreProxy defaults to true
     */
    class spStore extends DataStore {

        get(key) {
            if (typeof key === s) {
                if (this.__keystore[key] !== undef) {
                    return this.__keystore[key];
                }
                let val = this.__datastore.get(key);
                if (isPlainObject(val)) {
                    this.__keystore[key] = new kStore(this.__datastore, key);
                    if (this.__useproxy === true) this.__keystore[key] = new DataStoreProxy(this.__keystore[key]);
                    return this.__keystore[key];
                }
                return val;
            } else if (key === undef) {
                //careful there modified sub-Objects won't be saved(xStore, gmStore)
                return this.__datastore.get();
            }
        }
        set(key, val) {
            if (typeof key === s) {
                if (isPlainObject(val)) {
                    let ks = new kStore(this.__datastore, key);
                    if (this.__keystore[key] === undef) {
                        ks.set(val);
                        this.__keystore[key] = ks;
                        if (this.__useproxy === true) {
                            this.__keystore[key] = new DataStoreProxy(ks);
                        }
                        return this;
                    }
                    this.__keystore[key].clear().set(val);
                } else this.__datastore.set(key, val);
            } else if (isPlainObject(key)) {
                Object.keys(key).forEach(function (prop) {
                    this.set(prop, key[prop]);
                }, this);
            }
            return this;
        }
        has(key) {
            return this.__datastore.has(key);
        }
        remove(key) {
            if (typeof key === s) {
                key = key.split(' ');
            }
            if (isArray(key)) {
                key.forEach(function (prop) {
                    if (this.__keystore[prop] !== undef) {
                        this.__keystore[prop].clear();
                        delete this.__keystore[prop];
                    } else this.__datastore.remove(key);
                }, this);
            }
            return this;
        }
        clear() {
            this.__datastore.clear();
            this.__keystore = {};
            return this;
        }

        constructor(datastore, useproxy = true) {
            if (datastore._isDataStore !== true) {
                throw new Error('sStore: invalid argument, datastore not an instance of DataStore');
            }
            super();
            Object.defineProperties(this, {
                __useproxy: {
                    configurable: true,
                    value: useproxy !== false
                },
                __datastore: {
                    configurable: true,
                    value: datastore
                },
                __keystore: {
                    configurable: true, writable: true,
                    value: {}
                }
            });
            if (this.__useproxy === true) return new DataStoreProxy(this);
        }
    }


    /**********************************/
    /*            Events              */
    /**********************************/

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
            let data = new eStore(el);
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

    wrapper.extend({

        datastore(el) {
            if (!isValidElement(el)) {
                return;
            }
            return new eStore(el);
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
        },

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
                data.events = Object.assign({}, params, { type: t });
                el.addEventListener(t, params.fn, params.options);
            });
        },
        one(el, type, fn, ...opts) {
            let capture = false;
            opts.forEach((arg) => {
                if (typeof arg === b) {
                    capture = arg;
                }
            });
            opts.push({ once: true, capture: capture === true });
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
                    return type.split(' ').forEach(function (t) {
                        data.find(t).forEach(function (params) {
                            if (params.options.capture === capture) {
                                this.off(el, params.type, params.fn, params.options.capture);
                            }
                        }, this);
                    }, this);
                } else if (type === undef) {
                    return data.events.forEach(function (params) {
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
                    el.removeEventListener(t, fn, capture);
                });
            }
        },
        trigger(el, type, data) {
            if (typeof el.dispatchEvent !== f) {
                return;
            }
            if (typeof type === s) {
                type.split(" ").forEach((t) => {
                    let event = new Event(t, { bubbles: true, cancelable: true });
                    event.data = data;
                    el.dispatchEvent(event);
                });
            }
        },
        body(callback) {
            if (typeof callback === f) {
                let i = setInterval(function () {
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
                    return doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
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
                    return win.addEventListener('load', function load() {
                        win.removeEventListener('load', load);
                        callback();
                    });
                }
                callback();
            }
        }

    });

    /**********************************/
    /*        Show Hide Toggle        */
    /**********************************/

    wrapper.extend((() => {
        const defaults = {
            delay: 400,
            callback: undef
        };
        return {
            show(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                const self = this;
                if (typeof callback === n) {
                    delay = callback;
                }
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;

                if (typeof callback === f) {
                    self.one(el, "show", callback);
                }
                setTimeout(() => {
                    el.hidden = false;
                    self.trigger(el, "show");
                }, delay);

            },
            hide(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if (typeof callback === n) {
                    delay = callback;
                }
                const self = this;
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;
                if (typeof callback === f) {
                    self.one(el, "hide", callback);
                }
                setTimeout(() => {
                    el.hidden = true;
                    self.trigger(el, "hide");
                }, delay);
            },
            toggle(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if (typeof callback === n) {
                    delay = callback;
                }
                const self = this;
                callback = typeof callback === f ? callback : defaults.callback;
                delay = typeof delay === n ? delay : defaults.delay;
                setTimeout(() => {
                    if (el.hidden === true) {
                        return self.show(el, callback, 0);
                    }
                    self.hide(el, callback, 0);
                }, delay);
            }
        };
    })());


    /**********************************/
    /*            Utils               */
    /**********************************/

    wrapper.extend({
        dataset(el, key, value) {
            if (typeof el.dataset !== o) {
                return;
            }
            const self = this;
            if (typeof key === s) {
                if (value === undef) {
                    //read
                    let r;
                    if (el.dataset[key] !== undef) {
                        try {
                            r = JSON.parse(el.dataset[key]);
                        } catch (e) {
                            r = el.dataset[key];
                        }
                    }
                    return r;
                } else if (value === null) {
                    //remove
                    delete el.dataset[key];
                } else {
                    //write
                    el.dataset[key] = typeof value === s ? value : JSON.stringify(value);
                }
            } else if (isPlainObject(key)) {
                Object.keys(key).forEach(x => self.dataset(el, x, key[x]));
            } else if (key === undef) {
                //read all
                let r = {};
                for (let i in el.dataset) {
                    r[i] = self.dataset(i);
                }
                return r;
            }
        },
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
                let el = this.html2element(`<textarea>${text}</textarea>"`);
                doc.body.appendChild(el);
                el.style.opacity = 0;
                el.select();
                r = doc.execCommand("copy");
                doc.body.removeChild(el);
            }
            return r;
        },
        loadScript(src, callback, binding) {
            if (isValidUrl(src)) {
                let script = doc.createElement('style');
                script.type = 'text/javascript';
                script.defer = true;
                if (typeof callback === "function") {
                    script.onload = script.onerror = function (e) {
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
                    style.onload = style.onerror = function (e) {
                        return callback.call(binding, e.type !== "error", e);
                    };
                }
                doc.head.appendChild(style);
                style.src = src;
                return style;
            }
        },
        isValidUrl: isValidUrl,
        pathinfo: pathinfo,
        isPlainObject: isPlainObject

    });

    wrapper.fn.extend({
        addClass(classname) {
            return this.each(function (index) {
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
            return this.each(function (index) {
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
        },
        /**
         * Reads or Writes(convert types) values into an Element dataset
         * @param {String|Object} [key] key to set or get 
         * @param {any} [value] value to set
         * @returns {any}
         */
        dataset(key, value) {
            if (this.length === 0) {
                return this;
            }
            const self = this;
            if (typeof key === s) {
                //read first element only
                if (value === undef) {
                    return wrapper.dataset(self.get(0), key);
                } else {
                    //set/remove all elements in the set
                    return self.each(function () {
                        wrapper.dataset(this, key, value);
                    });
                }
            } else if (isPlainObject(key)) {
                //multi set for all elements in the set
                return self.each(function () {
                    wrapper.dataset(this, key);
                });
            } else if (key === undef) {
                //reads all values in the first element
                return wrapper.dataset(self.get(0));
            }
            return self;
        },

        /**
         * Uses Mutation Observer to find Nodes by selector when created or available
         * @param {string} selector A valid selector
         * @param {function} callback If callback returns false, stops the observer
         * @param {boolean} [once] Stops the observer when finding first node, defaults to true
         */
        findNode: (() => {

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
                once: true,
                uid: null
            };

            let uid = 0;

            function triggerEvent(node, params, obs, el) {
                let event = new Event("DOMNodeFound", { bubbles: true, cancelable: true });
                event.data = {
                    options: params,
                    observer: obs,
                    current: el
                };
                node.dispatchEvent(event);
            }



            function nodeFinder(el) {
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
                            params.callback = arg;
                            break;
                        case o:
                            if (isPlainObject(arg)) {
                                Object.assign(params, arg);
                            }
                            break;
                    }
                }

                if (typeof params.callback === f) {
                    params.uid = uid++;
                    let matches = [];
                    const run = function run() {
                        el.querySelectorAll(params.selector).forEach((target) => {
                            if (!matches.includes(target)) {
                                matches.push(target);
                                triggerEvent(target, params, observer, el);
                            }
                        });
                    };

                    const DOMNodeFound = function DOMNodeFound(e) {
                        //no multi triggers for other searches
                        if (e.data === undef || DOMNodeFound.uid !== params.uid) {
                            return;
                        }
                        let self = e.target, obs = e.data.observer;
                        if (self.matches(params.selector)) {
                            let retval = params.callback.call(self, e);
                            if (params.once === true || retval === false) {
                                el.removeEventListener(e.type, DOMNodeFound);
                                obs.disconnect();
                            }
                            return retval;
                        }
                    };
                    DOMNodeFound.uid = params.uid;
                    el.addEventListener("DOMNodeFound", DOMNodeFound, false);
                    let observer = new MutationObserver(function (m, obs) {
                        for (let i = 0; i < m.length; i++) {
                            let rec = m[i], target = rec.target;
                            if (target.matches === undef) {
                                continue;
                            }
                            if (target.matches(params.selector)) {
                                if (target.parentElement instanceof Element && !matches.includes(target)) {
                                    matches.push(target);
                                    triggerEvent(target, params, obs, el);
                                }
                            }

                        }
                    });
                    observer.observe(el, options);
                    if (doc.readyState === 'loading') {
                        doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
                            doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                            run();
                        });
                    }
                    if (doc.readyState !== 'complete') {
                        win.addEventListener('load', function load() {
                            win.removeEventListener('load', load);
                            run();
                        });
                        return;
                    }
                    run();
                }

            }
            /**
             * Uses Mutation Observer to find Nodes by selector when created or available
             * @param {string} selector A valid selector
             * @param {function} callback If callback returns false, stops the observer
             * @param {boolean} [once] Stops the observer when finding first node, defaults to true
             */
            return function findNode(...args) {
                return this.each(function () {
                    nodeFinder(this, ...args);
                });
            };

        })()
    });

    /* jshint -W117 */

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
                Object.keys(key).forEach(function (prop) {
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
                key.forEach(function (prop) {
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
                                    delete (this._data.headers["X-Requested-With"]);
                                    break;
                                default:
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
                                    delete (this._data.headers["Cache-Control"]);
                                    break;
                                default:
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
                            Object.keys(this._data.data).forEach(function (key) {
                                data.set(key, this._data.data[key]);
                            }, this);
                            return data;
                        }
                        return this._data.data;
                    }
                }
            });

            ["before", "success", "error", "complete"].forEach(function (key) {
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
            xhr.onload = function (e) {
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
            opts.forEach(function (opt) {
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
    /* jshint +W117 */

    wrapper.extend({
        ajax(options) {
            let xhR = new xhRequest(options);
            return xhR.send();
        },

        /**
         * Loads Resources and cache them into localStore
         */
        loadResource: (() => {

            const ls = new xStore(localStorage), self = wrapper;

            const globalSettings = {
                prefix: "wrapper.loadResource.",
                expire: 5000,
                cache: true,
                execute: true,
                debug: false,
                types: {
                    "text/css": self.addcss,
                    "application/javascript": self.addscript
                }
            };

            function log(...args) {
                if (settings().debug === true) {
                    console.debug(...args);
                }
            }

            function settings(extend) {
                if (isPlainObject(extend)) {
                    Object.keys(globalSettings).forEach(function (key) {
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
                if ((p = pathinfo(url))) {
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
                    Object.keys(params).forEach((key) => {
                        if ((typeof options[key] === typeof params[key]) || params[key] === null && typeof options[key] === f) {
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
                args.forEach((arg) => {
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
                    }
                    if (isPlainObject(arg)) Object.assign(opts, arg);
                });

                if (typeof opts.url === s && opts.url.length > 0) {
                    opts.key = getKey(opts.url);
                    let params = getParams(opts), ks = new kStore(ls, params.key);
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
                                    //let ks = new kStore(ls, params.key);
                                    ks.set(data);
                                }
                                return handleData(data, params, xhr);
                            }
                            self.trigger(xhr, 'error');
                        },
                        error() {
                            log('loadResource: Error', params.url);
                            if (typeof params.error === f) {
                                return params.error.call(null, params);
                            }
                        },
                        complete() {
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
        })(),
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
                let result = { seeker: [], in: [], out: [] };
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
            return function animated(el, classList, callback, toggle) { // eslint-disable-line
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
                    const self = wrapper;

                    if (params.classList.length === 0 || !isAnimation(params.classList)) return false;
                    if (typeof params.callback === f) self.one(el, "animated", params.callback);
                    let mode;
                    if (params.toggle === true) mode = getToggleMode(params.classList);
                    el.classList.remove("animated", ...list);

                    setTimeout(() => {
                        if (mode === "show") {
                            el.hidden = false;
                            self.trigger(el, 'show');
                        } else if (mode === "hide") {
                            self.one(el, "animated", function () {
                                el.hidden = true;
                                self.trigger(el, 'hide');
                            });
                        }
                        self.one(el, eventstart, function beginAnimation() {
                            self.one(el, eventend, function endAnimation() {
                                el.classList.remove("animated", ...params.classList.split(' '));
                                self.trigger(el, "animated");
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

    /**********************************/
    /*          Declarations          */
    /**********************************/

    //class only available if running inside GreaseMonkey or TamperMonkey with options set
    if (gmStore.available === true) {
        wrapper.extend({
            gmStore: new spStore(new gmStore())
        });
    }

    wrapper.extend({
        localStore: new spStore(new xStore(win.localStorage)),
        sessionStore: new spStore(new xStore(win.sessionStorage))
    });

    ["extend", "get", "each", "declare", "version"].forEach((x) => {
        (wrapper.hasOwnProperty(x) && Object.defineProperty(wrapper, x, { enumerable: false, configurable: true, writable: false }));
        (wrapper.fn.hasOwnProperty(x) && Object.defineProperty(wrapper.fn, x, { enumerable: false, configurable: true, writable: false }));
    });


    wrapper.fn.extend((() => {
        let obj = {};
        ["on", "one", "off", "trigger", "show", "hide", "toggle", "animated"].forEach((fn) => {
            obj[fn] = function (...args) {
                return this.each(function () {
                    wrapper[fn](this, ...args);
                });
            };
        });
        return obj;
    })());

    /**
     * Global declaration
     */
    wrapper.declare({
        wrapper: wrapper,
        DataStore: DataStore,
        DataStoreProxy: DataStoreProxy,
        oStore: oStore,
        eStore: eStore,
        xStore: xStore,
        kStore: kStore,
        gmStore: gmStore,
        spStore: spStore,
        xhRequest: xhRequest
    });

})(document, typeof window === "undefined" ? this : window);