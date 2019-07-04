/**
 * Utilities for gm scripts
 */

const s = "string",
    b = "boolean",
    f = "function",
    o = "object",
    u = "undefined",
    n = "number",
    doc = document;

let undef;


function isPlainObject(v) {
    return v instanceof Object && Object.getPrototypeOf(v) === Object.prototype;
}


function isArray(v) {
    return Array.isArray(v);
}



function onBody(callback) {
    if (typeof callback === f) {
        let i = setInterval(function () {
            if (doc.body !== null) {
                clearInterval(i);
                callback();
            }
        }, 1);
    }
}

function onDocIddle(callback) {
    if (typeof callback === f) {
        if (doc.readyState === "loading") {
            return doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
                doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                callback();
            });
        }
        callback();
    }
}

function onDocEnd(callback) {
    if (typeof callback === f) {
        if (doc.readyState !== "complete") {
            return addEventListener('load', function load() {
                callback();
            });
        }
        callback();
    }
}

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
        onBody(function () {
            doc.body.appendChild(s);
        });

    }
}

function addstyle(css) {
    if (typeof css === "string" && css.length > 0) {
        let s = doc.createElement('style');
        s.setAttribute('type', "text/css");
        s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
        doc.head.appendChild(s);
    }
}

function isValidUrl(url) {
    const weburl = new RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
    if (typeof url === s && url.length > 0) {
        return weburl.test(url);
    }
    return false;
}


function getURL(uri) {
    let retval;
    if (typeof uri === s && uri.length > 0) {
        try {
            let a = doc.createElement("a"),
                url;
            a.href = uri;
            //throws error if url not valid
            url = new URL(a.href);
            retval = url.href;
        } catch (error) {
            retval = undef;
        }

    }
    return retval;

}

function loadjs(src, callback, defer) {
    if (isValidUrl(src)) {
        let script = doc.createElement('script');
        script.type = 'text/javascript';
        if (defer === true) script.defer = true;
        if (typeof callback === f) {
            script.onload = callback;
        }
        doc.head.appendChild(script);
        script.src = src;
    }
}

function addscript(src) {
    if (typeof src === s && src.length > 0) {
        let s = doc.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.appendChild(doc.createTextNode(src));
        doc.head.appendChild(s);
        return s;
    }
}

function loadcss(src) {
    if (isValidUrl(src)) {
        let style = doc.createElement('link');
        style.rel = "stylesheet";
        style.type = 'text/css';
        doc.head.appendChild(style);
        style.href = src;
    }
}

function copyToClipboard(text) {
    let r = false;
    if (typeof text === "string" && text.length > 0) {
        let el = doc.createElement('textarea');
        el.innerHTML = text;
        el.style.opacity = 0;
        doc.body.appendChild(el);
        el.select();
        r = doc.execCommand("copy");
        doc.body.removeChild(el);
    }
    return r;
}


function trigger(el, type, data) {
    if (el instanceof EventTarget) {
        if (typeof type === s) {
            type.split(" ").forEach((t) => {
                let event = new Event(t, {bubbles: true, cancelable: true});
                event.data = data;
                el.dispatchEvent(event);
            });
        }
    }
}

/**
 * Creates a new Timer
 * @param {function} callback
 * @param {number|undefined} interval
 * @param {number|undefined} timeout
 * @returns {Timer}
 */
class Timer {

    start() {
        if (this.started !== true && typeof this.params.callback === f) {
            const self = this;
            self.__interval = setInterval(() => {
                self.params.callback.call(self, self);
            }, self.params.interval);
            if (self.params.timeout > 0) {
                self.__timeout = setTimeout(() => {
                    self.stop();
                }, self.params.timeout);
            }
            self.started = true;
        }

    }
    stop() {
        if (this.started === true) {
            const self = this;
            self.started = false;
            if (self.__interval !== null) clearInterval(self.__interval);
            if (self.__timeout !== null) clearTimeout(self.__timeout);
            self.__timeout = null;
            self.__interval = null;
        }
    }

    /**
     * Creates a new Timer
     * @param {function} callback
     * @param {number|undefined} interval
     * @param {number|undefined} timeout
     * @returns {Timer}
     */
    constructor(callback, interval, timeout) {
        if (typeof callback === f) {
            const self = this;
            Object.assign(self, {
                params: {
                    callback: callback,
                    interval: 10,
                    timeout: 0
                },
                started: false,
                __interval: null,
                __timeout: null
            });
            if (typeof interval === n) self.params.interval = interval;
            if (typeof timeout === n) self.params.timeout = interval;
            self.start();
        }
    }
}

/**
 * Uses Mutation Observer + intervals(some sites blocks observers) to find new nodes
 * And test them against params
 */
const find = (function () {

    const obsopts = {
            attributes: true,
            //characterData: true,
            //childList: true,
            subtree: true
        },
        defaults = {
            selector: "",
            onload: null,
            timeout: 0,
            interval: 0
        };

    class SimpleObserver {
        start() {
            const self = this;
            if (self.worker.params.interval > 0) {
                self.worker.interval = setInterval(self.worker.runner, self.worker.params.interval);
                if (self.worker.params.timeout > 0) {
                    self.worker.timeout = setTimeout(function () {
                        clearInterval(self.worker.interval);
                    }, self.worker.params.timeout);
                }
            }
            self.worker.observer.observe(self.worker.params.base, obsopts);
        }
        stop() {
            if (typeof this.worker.timeout !== u) clearTimeout(this.worker.timeout);
            if (typeof this.worker.interval !== u) clearInterval(this.worker.interval);
            if (typeof this.worker.observer !== u) this.worker.observer.disconnect();
        }
        constructor(runner, obs, params) {
            this.worker = {
                params: params,
                observer: obs,
                runner: runner
            };
        }
    }
    return function findNode(options) {
        let params = Object.assign({}, defaults),
            base = doc;
        for (let i = 0; i < arguments.length; i++) {
            let arg = arguments[i];
            switch (typeof arg) {
                case o:
                    if (arg instanceof Element || arg instanceof Document) {
                        base = arg;
                    } else if (isPlainObject(arg)) {
                        Object.assign(params, arg);
                    }
                    break;
                case f:
                    params.onload = arg;
                    break;
                case s:
                    params.selector = arg;
                    break;
                case n:
                    params.interval = 10;
                    params.timeout = arg;
                    break;
                default:
                    break;
            }
        }

        if (typeof params.onload === f && typeof params.selector === s && typeof base.addEventListener === f) {

            const matches = [];
            let simpleobs, interval, timeout, observer;
            params.base = base;

            const runner = function runner() {
                base.querySelectorAll(params.selector).forEach(function (element) {
                    if (!matches.includes(element)) {
                        matches.push(element);
                        trigger(element, 'DOMNodeCreated', {
                            element: element,
                            params: params,
                            observer: simpleobs
                        });
                        params.onload.call(element, element, simpleobs, params);
                    }
                });
            };

            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node instanceof Element) {
                            if ((node = node.closest(params.selector)) !== null) {
                                if (!matches.includes(node)) {
                                    matches.push(node);
                                    trigger(node, 'DOMNodeCreated', {
                                        element: node,
                                        params: params,
                                        observer: simpleobs
                                    });
                                    params.onload.call(node, node, simpleobs, params);
                                }

                            }
                        }
                    });
                });
            });
            simpleobs = new SimpleObserver(runner, observer, params);
            simpleobs.start();
            if (doc.readyState !== "complete") {
                addEventListener('load', runner);
            } else runner();
        }

    };

})();

/**
 * Small Event Wrapper
 */
function Events(target, binding) {

    if (this instanceof Events) {
        const self = this;
        binding = binding instanceof Object ? binding : target;
        if (!(target instanceof EventTarget)) target = doc.createElement('div');
        if (!(binding instanceof EventTarget)) {
            ["on", "off", "one", "trigger"].forEach(method => {
                binding[method] = function (...args) {
                    self[method].apply(self, args);
                    return this;
                };
            });
        }
        Object.assign(this, {
            target: target,
            binding: binding,
            events: []
        });
        return this;
    } else if (target instanceof EventTarget) return new Events(...arguments);

}
Events.prototype = {
    on(type, listener, options) {
        if (typeof type === s && typeof listener === f) {
            const self = this,
                params = {
                    once: false,
                    capture: false
                },
                handler = listener.bind(self.binding);
            if (typeof options === b) params.capture = options;
            else if (isPlainObject(options)) Object.keys(params).forEach(key => {
                params[key] = options[key] === true;
            });
            type.split(' ').forEach(type => {
                self.events.push({
                    type: type,
                    listener: listener,
                    handler: handler,
                    options: params
                });
                self.target.addEventListener(type, handler, params);
            });
        }
        return this;
    },
    one(type, listener, capture) {
        if (typeof type === s && typeof listener === f) this.on(type, listener, {
            once: true,
            capture: capture === true
        });
        return this;
    },
    off(type, listener, capture) {
        if (typeof type === s) {
            const self = this,
                params = {
                    capture: false
                };
            let callback;
            for (let i = 1; i < arguments.length; i++) {
                let arg = arguments[i];
                switch (typeof arg) {
                    case b:
                        params.capture = arg;
                        break;
                    case f:
                        callback = arg;
                        break;
                    default:
                        break;
                }
            }
            type.split(' ').forEach(type => {
                self.events = self.events.filter(evt => {
                    if (typeof callback === f) {
                        if (type === evt.type && params.capture === evt.params.capture && callback === evt.listener) {
                            self.target.removeEventListener(type, evt.handler, params.capture);
                            return false;
                        }
                    } else if (type === evt.type) {
                        self.target.removeEventListener(type, evt.handler, evt.params.capture);
                        return false;
                    }
                    return true;
                });
            });
        }
        return this;
    },
    trigger(type, data) {
        if (typeof type === s) {
            const self = this;
            data = data !== undef ? data : {};
            type.split(' ').forEach(type => {
                let event;
                if (self.target.parentElement === null) event = new Event(type);
                else event = new Event(type, {
                    bubbles: true,
                    cancelable: true
                });
                event.data = data;
                self.target.dispatchEvent(event);
            });
        }
    }


};

/**
 * DataStore Interface
 * @type {Class}
 */
class DataStore {
    constructor() {
        if (!(["get", "set", "has", "remove", "clear"].every(x => typeof this[x] === f))) {
            throw new Error("DataStore Interface Error : Missing Methods.");
        }
        Object.defineProperty(this, '_isDataStore', {
            value: true,
            configurable: true
        });
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


class UserSettings extends gmStore {

    constructor(defaults) {
        super();
        if (isPlainObject(defaults)) {
            Object.keys(defaults).forEach((x) => {
                if (typeof this.get(x) !== typeof defaults[x]) {
                    this.set(x, defaults[x]);
                }
            }, this);
        }

    }

}



/**
 * Cache Item
 * @link https://www.php-fig.org/psr/psr-6/
 */

class LSCacheItem {

    constructor(key, hit, value) {
        this.key = key;
        this.hit = hit === true;
        this.value = value;
    }
    /**
     * Returns the key for the current cache item.
     *
     * The key is loaded by the Implementing Library, but should be available to
     * the higher level callers when needed.
     *
     * @returns {string} The key string for this cache item.
     */
    getKey() {
        return this.key;
    }

    /**
     * Retrieves the value of the item from the cache associated with this object's key.
     *
     * The value returned must be identical to the value originally stored by set().
     *
     * If isHit() returns false, this method MUST return null. Note that null
     * is a legitimate cached value, so the isHit() method SHOULD be used to
     * differentiate between "null value was found" and "no value was found."
     *
     * @return {any} The value corresponding to this cache item's key, or null if not found.
     */
    get() {
        return this.value;
    }

    /**
     * Confirms if the cache item lookup resulted in a cache hit.
     *
     * Note: This method MUST NOT have a race condition between calling isHit()
     * and calling get().
     *
     * @return {boolean} True if the request resulted in a cache hit. False otherwise.
     */
    isHit() {
        return this.hit === true;
    }

    /**
     * Sets the value represented by this cache item.
     *
     * The $value argument may be any item that can be serialized by PHP,
     * although the method of serialization is left up to the Implementing
     * Library.
     *
     * @param {any} value
     *
     * @return {LSCacheItem}   The invoked object.
     */
    set(value) {
        this.value = value;
        return this;
    }

    /**
     * Sets the expiration time for this cache item.
     *
     * @param {Date|number} expiration
     *
     * @return {LSCacheItem} The called object.
     */
    expiresAt(expiration) {
        if (typeof expiration === n) expiration = new Date(expiration);
        if (expiration instanceof Date) this.expire = expiration;
        return this;
    }


    /**
     * Sets the expiration time for this cache item.
     *
     * @param {number} time
     *
     * @return {LSCacheItem} The called object.
     */
    expiresAfter(time) {
        if (typeof time === n) {
            let tt = +new Date();
            tt += time;
            this.expiration = new Date(tt);
        }
    }


}




/**
 * Cache data into localStorage
 * Item Cache Pool
 * @link https://www.php-fig.org/psr/psr-6/
 */
class LSCache {
    /**
     * @returns {xStore}
     */
    get storage() {
        return this.__store__;
    }
    set storage(val) {
        if (val instanceof DataStore) this.__store__ = val;
    }
    get ttl() {
        return this.__ttl__;
    }
    set ttl(ttl) {
        if (typeof ttl === n) this.__ttl__ = ttl;
    }

    get deferred() {
        if (typeof this.__deferred__ === u) this.__deferred__ = [];
        return this.__deferred__;
    }

    get expire() {
        if (typeof this.__expire__ === u) {
            let key = this.prefix + "_itemexpire";
            this.__expire__ = this.storage.get(key) || {};
        }

        return this.__expire__;
    }

    set expire(obj) {
        if (isPlainObject(obj)) {
            this.__expire__ = obj;
            let key = this.prefix + "_itemexpire";
            this.storage.set(key, obj);
        }
    }

    get prefix() {
        return this.__prefix__;
    }

    /**
     * @param {string} prefix
     * @param {number} ttl
     */
    constructor(prefix = "", ttl = 60) {
        this.storage = new xStore(localStorage);
        this.__prefix__ = "";
        if (typeof prefix === s) this.__prefix__ = prefix;
        this.ttl = typeof ttl === n ? ttl : 60;

        let expired = this.expire, now = +new Date(), keys = Object.keys(expired);
        for (let i = 0; i < keys.length; i++) {
            if (now > expired[keys[i]]) {
                this.deleteItem(keys[i]);
            }
        }
    }

    /**
     * Returns a Cache Item representing the specified key.
     *
     * This method must always return a CacheItemInterface object, even in case of
     * a cache miss. It MUST NOT return null.
     *
     * @param {string} key The key for which to return the corresponding Cache Item.
     *
     *
     * @return {LSCacheItem} The corresponding Cache Item.
     */
    getItem(key) {
        if (typeof key !== s) throw new Error("Invalid Argument");
        let value, pkey = this.prefix + key;
        if (this.storage.has(pkey)) value = this.storage.get(pkey);
        return new LSCacheItem(key, value !== undef, value);
    }

    /**
     * Returns a traversable set of cache items.
     *
     * @param {Array} keys An indexed array of keys of items to retrieve.
     *
     *
     * @return {Array}.
     */
    getItems(keys = []) {
        let ret = [];
        if (isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                ret.push(this.getItem(keys[i]));
            }
        }
        return ret;
    }
    /**
     * Confirms if the cache contains specified cache item.
     *
     * Note: This method MAY avoid retrieving the cached value for performance reasons.
     * This could result in a race condition with CacheItemInterface::get(). To avoid
     * such situation use CacheItemInterface::isHit() instead.
     *
     * @param {string} key The key for which to check existence.
     *
     *
     * @return {boolean}   True if item exists in the cache, false otherwise.
     */
    hasItem(key) {
        if (typeof key !== s) throw new Error("Invalid Argument");
        return this.storage.has(this.prefix + key);
    }

    /**
     * Deletes all items in the pool.
     *
     * @return {boolean}  True if the pool was successfully cleared. False if there was an error.
     */
    clear() {

        let storage = this.storage._storage, key;
        for (let i = 0; i < storage.length; i++) {
            key = storage.key(i);
            if (key.indexOf(this.prefix) === 0) {
                storage.removeItem(key);
            }
        }
        this.expire = {};
        return true;
    }

    /**
     * Removes the item from the pool.
     *
     * @param {string} key The key to delete.
     *
     *
     * @return {boolean} True if the item was successfully removed. False if there was an error.
     */
    deleteItem(key) {
        if (typeof key !== s) throw new Error("Invalid Argument");
        let exp = this.expire;
        delete(exp[key]);
        this.expire = exp;
        this.storage.remove(this.prefix + key);
        return true;
    }

    /**
     * Removes multiple items from the pool.
     *
     * @param {Array} keys
     *   An array of keys that should be removed from the pool.

     *
     * @return {boolean}
     *   True if the items were successfully removed. False if there was an error.
     */
    deleteItems(keys) {
        if (isArray(keys)) {
            for (let i = 0; i < keys.length; i++) {
                this.deleteItem(keys[i]);
            }
        }
        return true;
    }
    /**
     * Persists a cache item immediately.
     *
     * @param {LSCacheItem} item
     *   The cache item to save.
     *
     * @return {boolean} True if the item was successfully persisted. False if there was an error.
     */
    save(item) {
        if (item instanceof LSCacheItem) {

            let expire = item.expiration || new Date((+new Date()) + this.ttl),
                data = this.expire;
            data[item.getKey()] = +expire;
            this.expire = data;
            let key = this.prefix + item.getKey();
            this.storage.set(key, item.value ? item.value : null);
            return true;

        }
        return false;

    }

    /**
     * Sets a cache item to be persisted later.
     *
     * @param {LSCacheItem} item
     *   The cache item to save.
     *
     * @return {boolean}  False if the item could not be queued or if a commit was attempted and failed. True otherwise.
     */
    saveDeferred(item) {
        if (item instanceof LSCacheItem) {

            this.deferred.push(item);
            return true;

        }
    }

    /**
     * Persists any deferred cache items.
     *
     * @return {boolean}  True if all not-yet-saved items were successfully saved or there were none. False otherwise.
     */
    commit() {
        let item;
        while ((item = this.deferred.shift())) {
            this.save(item);
        }

        return true;
    }
}


$.fn.dataset = function(k, v) {
    let r = this;

    if (typeof k === "string") {
        //set
        if (typeof v !== typeof undef) {
            this.each(function() {
                if (v === null) {
                    delete(this.dataset[k]);
                    return;
                }
                if (this.dataset) {
                    this.dataset[k] = typeof v === "string" ? v : JSON.stringify(v);
                }

            });
        } else if (arguments.length > 1) {
            console.log('$.fn.dataset(' + k + ', undef) trying to set undefined value into dataset.', this);
            return r;
        } else if (this.length > 0) {
            r = undef;
            if (typeof this[0].dataset[k] !== typeof undef) {
                try {
                    r = JSON.parse(this[0].dataset[k]);
                } catch (e) {
                    r = this[0].dataset[k];
                }
            }
        }
    } else if (typeof k === "object" && Object.keys(k).length > 0 && typeof v === typeof undef) {

        for (let key of Object.keys(k)) {
            let val = k[key];
            this.dataset(key, val);
        }
    }
    return r;
};

/**
 * Set or Get value from Element.dataset
 * @param {string|object} key
 * @param {any} value
 * @returns {any}
 */
HTMLElement.prototype.data = function(key, value) {
    const self = this;
    if (typeof key === s) {
        if (typeof value !== u) {
            if (value === null) delete(self.dataset[key]);
            else self.dataset[key] = typeof value === s ? value : JSON.stringify(value);
        } else if ((value = self.dataset[key]) !== undef) {
            let retval;
            try {
                retval = JSON.parse(value);
            } catch (e) {
                retval = value;
            }
            return retval;
        }
        return undef;
    } else if (isPlainObject(key)) {
        Object.keys(key).forEach((k) => {
            self.data(k, key[k]);
        });
        return undef;
    } else if (typeof key === u) {
        //returns all data
        let retval = {};
        Object.keys(this.dataset).forEach((k) => {
            retval[k] = self.data(k);
        });
        return retval;
    }
};

/**
 * Set or Get value from Element.dataset
 * @param {string|object} key
 * @param {any} value
 * @returns {undefined}
 */
NodeList.prototype.data = function(key, value) {
    const self = this;
    if (((typeof key === s) || typeof key === u) && (typeof value === u)) {
        //reads from first element
        if (self.length > 0) return self[0].data(key);
        return undef;
    } else self.forEach((el) => {
            el.data(key, value);
        });
};

