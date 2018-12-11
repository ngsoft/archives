
/**
 * Transcompiled from babel site
 * @link https://babeljs.io/repl
 */
(function (document, global, undef) {
    /* jshint expr: true */
    /*eslint no-console: "off"*/
    /* jshint -W018 */
    /* jshint -W089 */
    /* jshint -W103 */

    "use strict";

    var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var s = "string",
        b = "boolean",
        f = "function",
        o = "object",
        u = "undefined",
        n = "number",
        doc = document,
        win = global;
    var version = '1.0';
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
        return v instanceof Element || v === document;
    }

    /**
     * Checks if valid URL
     * @param {string} url
     * @returns {boolean} 
     */
    function isValidUrl(url) {
        var weburl = new RegExp("^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i");
        if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === s && url.length > 0) {
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
        var base = (typeof path === "undefined" ? "undefined" : _typeof(path)) === s && path.length > 0 ? path.replace('\\', '/').split('/').pop() : undef;
        if ((typeof suffix === "undefined" ? "undefined" : _typeof(suffix)) === s && suffix.length > 0 && (typeof base === "undefined" ? "undefined" : _typeof(base)) === s && base.substr(base.length - suffix.length) === suffix) {
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
    function dirname(path) {
        var levels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        var base = (typeof path === "undefined" ? "undefined" : _typeof(path)) === s && path.length > 0 ? path.replace('\\', '/').split('/') : undef;
        if (!isArray(base)) return base;
        for (var _n = 0; _n < levels; _n++) {
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
        if ((typeof path === "undefined" ? "undefined" : _typeof(path)) !== s || path.length === 0 || path.lastIndexOf('.') < 1) return "";
        var base = basename(path);
        return (typeof base === "undefined" ? "undefined" : _typeof(base)) === s ? base.split('.').pop() : "";
    }

    /**
     * Returns information about a file path
     * @param {string} p - path
     * @returns {object|undefined}
     */
    function pathinfo(path) {
        if ((typeof path === "undefined" ? "undefined" : _typeof(path)) !== s || path.length === 0) return;
        var r = {
            dirname: dirname(path),
            basename: basename(path),
            extension: extension(path),
            filename: ''
        };
        if (isValidUrl(path)) {
            var a = doc.createElement('a');
            a.href = path;
            var url = new URL(a.href);
            Object.assign(r, {
                basename: basename(url.pathname),
                extension: extension(url.pathname)
            });
        }
        if (r.basename.length > 0) {
            var file = r.filename = r.basename;
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
        var r = void 0;
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
        var list = [];
        if (nodes instanceof NodeList) {
            list = Array.from(nodes);
        } else if (isValidElement(nodes)) {
            list.push(nodes);
        } else if ((typeof nodes === "undefined" ? "undefined" : _typeof(nodes)) === s) {
            list = Array.from(doc.querySelectorAll(nodes));
        }

        Object.assign(this, list);
        Object.defineProperties(this, {
            nodes: {
                value: list
            },
            length: {
                get: function get() {
                    return this.nodes.length;
                }
            }
        });
        return this;
    }

    wrapper.fn = wrapper.prototype = {
        version: version,
        get: function get(index) {
            if ((typeof index === "undefined" ? "undefined" : _typeof(index)) === n) {
                return this.nodes[index];
            }
            return this.nodes;
        },
        each: function each(callback) {
            if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
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
        declare: function declare(name, resource) {
            var root = global;
            if (root instanceof Object) {
                if ((typeof name === "undefined" ? "undefined" : _typeof(name)) === s && resource !== undef) {
                    root[name] = resource;
                    return true;
                } else if (isPlainObject(name)) {
                    Object.keys(name).forEach(function (key) {
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

    var DataStore = function DataStore() {
        var _this = this;

        _classCallCheck(this, DataStore);

        if (!["get", "set", "has", "remove", "clear"].every(function (x) {
            return _typeof(_this[x]) === f;
        })) {
            throw new Error("DataStore Interface Error : Missing Methods.");
        }
        Object.defineProperty(this, '_isDataStore', {
            value: true, configurable: true
        });
    };

    /**
     * Create a Proxy to use key value pair assignement and loop through DataStore
     * @type {Class}
     * @param {Datastore} datastore
     */


    var DataStoreProxy = function () {
        _createClass(DataStoreProxy, [{
            key: "get",
            value: function get(target, prop) {
                return target.hasOwnProperty(prop) || _typeof(target[prop]) === f ? target[prop] : target.get(prop);
            }
        }, {
            key: "set",
            value: function set(target, prop, value) {
                target.set(prop, value);
            }
        }, {
            key: "has",
            value: function has(target, prop) {
                return target.hasOwnProperty(prop) || target.has(prop);
            }
        }, {
            key: "deleteProperty",
            value: function deleteProperty(target, prop) {
                target.remove(prop);
            }
        }, {
            key: "ownKeys",
            value: function ownKeys(target) {
                return Object.keys(target.get());
            }
        }, {
            key: "getOwnPropertyDescriptor",
            value: function getOwnPropertyDescriptor(target, prop) {
                if (target.has(prop)) {
                    return { configurable: true, enumerable: true, writable: true, value: target.get(prop) };
                }
            }
        }, {
            key: "enumerate",
            value: function enumerate(target) {
                return this.ownKeys(target)[Symbol.iterator]();
            }
        }]);

        function DataStoreProxy(datastore) {
            _classCallCheck(this, DataStoreProxy);

            if (!(datastore instanceof DataStore)) {
                throw new Error("DataStoreProxyHandler invalid argument : Not a DataStore");
            }
            return new Proxy(datastore, this);
        }

        return DataStoreProxy;
    }();

    /**
     * Manipulate a plain object
     * @type {Class}
     * @extends {DataStore}
     * @param {Object} [obj]
     */


    var oStore = function (_DataStore) {
        _inherits(oStore, _DataStore);

        _createClass(oStore, [{
            key: "get",
            value: function get(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    return this._data[key];
                } else if (key === undef) {
                    return this._data;
                }
            }
        }, {
            key: "set",
            value: function set(key, val) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    this._data[key] = val;
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach(function (prop) {
                        this._data[prop] = key[prop];
                    }, this);
                }
                return this;
            }
        }, {
            key: "has",
            value: function has(key) {
                return this._data.hasOwnProperty(key);
            }
        }, {
            key: "remove",
            value: function remove(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach(function (prop) {
                        if ((typeof prop === "undefined" ? "undefined" : _typeof(prop)) === s) {
                            delete this._data[prop];
                        }
                    }, this);
                }
                return this;
            }
        }, {
            key: "clear",
            value: function clear() {
                var _this3 = this;

                Object.keys(this._data).forEach(function (key) {
                    _this3.remove(key);
                });
                return this;
            }
        }]);

        function oStore(obj) {
            _classCallCheck(this, oStore);

            var _this2 = _possibleConstructorReturn(this, (oStore.__proto__ || Object.getPrototypeOf(oStore)).call(this));

            if (!isPlainObject(obj)) {
                obj = {};
            }
            Object.defineProperty(_this2, '_data', {
                value: obj, configurable: true, writable: true
            });

            return _this2;
        }

        return oStore;
    }(DataStore);

    /**
     * Store Data into an Element
     * @type {Class}
     * @extends {oStore}
     * @param {Element|Document} el
     */


    var eStore = function (_oStore) {
        _inherits(eStore, _oStore);

        _createClass(eStore, null, [{
            key: "_storekey",
            get: function get() {
                return "WrapperDataStore";
            }
        }]);

        function eStore(el) {
            _classCallCheck(this, eStore);

            if (!isValidElement(el)) {
                throw new Error('Datastore : Cannot instanciate, invalid argument : el');
            }
            var obj = el[eStore._storekey];
            if (!el.hasOwnProperty(eStore._storekey)) {
                obj = {};
                Object.defineProperty(el, eStore._storekey, {
                    value: obj, configurable: true
                });
            }
            return _possibleConstructorReturn(this, (eStore.__proto__ || Object.getPrototypeOf(eStore)).call(this, obj));
        }

        return eStore;
    }(oStore);

    /**
     * Store data into localStorage or sessionStorage
     * @type {Class}
     * @extends {Datastore}
     * @param {Storage} storage
     */


    var xStore = function (_DataStore2) {
        _inherits(xStore, _DataStore2);

        function xStore(storage) {
            _classCallCheck(this, xStore);

            var _this5 = _possibleConstructorReturn(this, (xStore.__proto__ || Object.getPrototypeOf(xStore)).call(this));

            if (!(storage instanceof Storage)) {
                throw new Error('xStore : argument not instance of Storage');
            }
            Object.defineProperty(_this5, '_storage', {
                value: storage,
                configurable: true
            });
            return _this5;
        }

        _createClass(xStore, [{
            key: "get",
            value: function get(key) {
                var retval = void 0,
                    sval = void 0;
                //get one
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    if ((sval = this._storage.getItem(key)) !== null) {
                        try {
                            retval = JSON.parse(sval);
                        } catch (e) {
                            retval = sval;
                        }
                    }
                } else if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === u) {
                    //get all
                    retval = {};
                    for (var i = 0; i < this._storage.length; i++) {
                        key = this._storage.key(i);
                        retval[key] = this.get(key);
                    }
                }
                return retval;
            }
        }, {
            key: "set",
            value: function set(key, val) {
                var _this6 = this;

                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s && (typeof val === "undefined" ? "undefined" : _typeof(val)) !== u) {
                    var sval = val;
                    try {
                        val = JSON.stringify(sval);
                    } catch (e) {
                        val = sval;
                    }
                    this._storage.setItem(key, val);
                    return this;
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach(function (k) {
                        _this6.set(k, key[k]);
                    });
                }
                return this;
            }
        }, {
            key: "has",
            value: function has(key) {
                return _typeof(this.get(key)) !== u;
            }
        }, {
            key: "remove",
            value: function remove(key) {
                var _this7 = this;

                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach(function (k) {
                        _this7._storage.removeItem(k);
                    });
                }
                return this;
            }
        }, {
            key: "clear",
            value: function clear() {
                this._storage.clear();
                return this;
            }
        }]);

        return xStore;
    }(DataStore);

    /**
     * Key Store Uses a key inside a DataStore to manage Objects
     * @type {Class}
     * @extends {oStore}
     * @param {DataStore} datastore
     * @param {String} key
     */


    var kStore = function (_oStore2) {
        _inherits(kStore, _oStore2);

        _createClass(kStore, [{
            key: "get",
            value: function get(key) {
                var val = _get(kStore.prototype.__proto__ || Object.getPrototypeOf(kStore.prototype), "get", this).call(this, key);
                //do not save empty objects (use clear() instead)
                if (Object.keys(this._data).length > 0) {
                    this.__save();
                }
                return val;
            }
        }, {
            key: "set",
            value: function set(key, val) {
                _get(kStore.prototype.__proto__ || Object.getPrototypeOf(kStore.prototype), "set", this).call(this, key, val);
                return this.__save();
            }
        }, {
            key: "remove",
            value: function remove(key) {
                _get(kStore.prototype.__proto__ || Object.getPrototypeOf(kStore.prototype), "remove", this).call(this, key);
                return this.__save();
            }
        }, {
            key: "clear",
            value: function clear() {
                _get(kStore.prototype.__proto__ || Object.getPrototypeOf(kStore.prototype), "clear", this).call(this);
                this.__datastore.remove(this.__key);
                return this;
            }
        }, {
            key: "__save",
            value: function __save() {
                this.__datastore.set(this.__key, this._data);
                return this;
            }
        }]);

        function kStore(datastore, key) {
            _classCallCheck(this, kStore);

            if (!datastore._isDataStore) {
                throw new Error("kStore invalid argument : Not a DataStore");
            }
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) !== s) {
                throw new Error("kStore invalid argument : key is not a String");
            }

            var obj = {},
                val = datastore.get(key);
            if (isPlainObject(val)) {
                Object.assign(obj, val);
            }

            var _this8 = _possibleConstructorReturn(this, (kStore.__proto__ || Object.getPrototypeOf(kStore)).call(this, obj));

            Object.defineProperties(_this8, {
                __datastore: {
                    value: datastore,
                    configurable: true
                },
                __key: {
                    value: key,
                    configurable: true
                }
            });
            return _this8;
        }

        return kStore;
    }(oStore);

    /* jshint -W117 */

    /**
     * Store data into GreaseMonkey 3 or Tampermonkey
     * @type {Class}
     * @extends {DataStore}
     */


    var gmStore = function (_DataStore3) {
        _inherits(gmStore, _DataStore3);

        _createClass(gmStore, null, [{
            key: "available",
            get: function get() {
                return ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].every(function (fn) {
                    /*jshint evil:true */
                    try {
                        if (_typeof(eval(fn)) === f) return true;
                    } catch (e) {
                        return false;
                    }
                    /*jshint evil:false */
                });
            }
        }]);

        function gmStore() {
            _classCallCheck(this, gmStore);

            var _this9 = _possibleConstructorReturn(this, (gmStore.__proto__ || Object.getPrototypeOf(gmStore)).call(this));

            var disabled = [];
            ["GM_getValue", "GM_setValue", "GM_deleteValue", "GM_listValues"].forEach(function (fn) {
                /*jshint evil:true */
                try {
                    if (_typeof(eval(fn)) !== f) disabled.push(fn);
                } catch (e) {
                    disabled.push(fn);
                }
                /*jshint evil:false */
            });
            if (disabled.length > 0) {
                if (disabled.length === 4) {
                    console.warn("gmStore disabled.");
                    return _possibleConstructorReturn(_this9);
                }
                disabled.forEach(function (fn) {
                    console.warn('gmStore cannot use', fn);
                });
            }
            return _this9;
        }

        _createClass(gmStore, [{
            key: "get",
            value: function get(key) {
                var _this10 = this;

                var retval = undef;
                //get one
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    if ((typeof GM_getValue === "undefined" ? "undefined" : _typeof(GM_getValue)) === f) {
                        retval = GM_getValue(key); // eslint-disable-line
                    }
                } else if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === u) {
                    //get all
                    retval = {};
                    if ((typeof GM_listValues === "undefined" ? "undefined" : _typeof(GM_listValues)) === f) {
                        GM_listValues().forEach(function (key) {
                            // eslint-disable-line
                            retval[key] = _this10.get(key);
                        });
                    }
                }
                return retval;
            }
        }, {
            key: "set",
            value: function set(key, val) {
                var _this11 = this;

                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s && (typeof val === "undefined" ? "undefined" : _typeof(val)) !== u) {
                    if ((typeof GM_setValue === "undefined" ? "undefined" : _typeof(GM_setValue)) === f) {
                        GM_setValue(key, val); // eslint-disable-line
                    }
                } else if (isPlainObject(key)) {
                    Object.keys(key).forEach(function (k) {
                        _this11.set(k, key[k]);
                    });
                }
                return this;
            }
        }, {
            key: "has",
            value: function has(key) {
                return _typeof(this.get(key)) !== u;
            }
        }, {
            key: "remove",
            value: function remove(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    if ((typeof GM_deleteValue === "undefined" ? "undefined" : _typeof(GM_deleteValue)) === f) {
                        key.forEach(function (k) {
                            GM_deleteValue(k); // eslint-disable-line
                        });
                    }
                }
                return this;
            }
        }, {
            key: "clear",
            value: function clear() {
                var _this12 = this;

                Object.keys(this.get()).forEach(function (key) {
                    _this12.remove(key);
                });
                return this;
            }
        }]);

        return gmStore;
    }(DataStore);
    /* jshint +W117 */

    /**
     * Special Store : wrap a datastore and use a kStore if values are plain Objects
     * @param {Datastore} datastore
     * @param {boolean} [useproxy] Automatically use DataStoreProxy defaults to true
     */


    var spStore = function (_DataStore4) {
        _inherits(spStore, _DataStore4);

        _createClass(spStore, [{
            key: "get",
            value: function get(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    if (this.__keystore[key] !== undef) {
                        return this.__keystore[key];
                    }
                    var val = this.__datastore.get(key);
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
        }, {
            key: "set",
            value: function set(key, val) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    if (isPlainObject(val)) {
                        var ks = new kStore(this.__datastore, key);
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
        }, {
            key: "has",
            value: function has(key) {
                return this.__datastore.has(key);
            }
        }, {
            key: "remove",
            value: function remove(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
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
        }, {
            key: "clear",
            value: function clear() {
                this.__datastore.clear();
                this.__keystore = {};
                return this;
            }
        }]);

        function spStore(datastore) {
            var _ret;

            var useproxy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

            _classCallCheck(this, spStore);

            if (datastore._isDataStore !== true) {
                throw new Error('sStore: invalid argument, datastore not an instance of DataStore');
            }

            var _this13 = _possibleConstructorReturn(this, (spStore.__proto__ || Object.getPrototypeOf(spStore)).call(this));

            Object.defineProperties(_this13, {
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
            if (_this13.__useproxy === true) return _ret = new DataStoreProxy(_this13), _possibleConstructorReturn(_this13, _ret);
            return _this13;
        }

        return spStore;
    }(DataStore);

    /**********************************/
    /*            Events              */
    /**********************************/

    var EventData = function () {
        _createClass(EventData, [{
            key: "add",
            value: function add(params) {
                this.events = params;
                return this.events.includes(params);
            }
        }, {
            key: "remove",
            value: function remove(type, fn, capture) {
                var len = this.events.length;
                this._data.events = this._data.events.filter(function (x) {
                    return !(type === x.type && capture === x.options.capture && fn === x.fn);
                });
                return this.events.length !== len || len === 0;
            }
        }, {
            key: "find",
            value: function find(type) {
                return this._data.events.filter(function (x) {
                    return type === x.type;
                });
            }
        }]);

        function EventData(el) {
            _classCallCheck(this, EventData);

            var data = new eStore(el);
            if (!isArray(data.events)) {
                data.events = [];
            }
            Object.defineProperties(this, {
                _data: {
                    value: data, configurable: true
                },
                events: {
                    get: function get() {
                        return this._data.events;
                    },
                    set: function set(params) {
                        if (isPlainObject(params)) {
                            if (_typeof(params.type) === s && params.type.length > 0 && _typeof(params.fn) === f && isPlainObject(params.options)) {
                                this._data.events.push(params);
                            }
                        }
                    },
                    configurable: true
                }
            });
        }

        return EventData;
    }();

    wrapper.extend({
        datastore: function datastore(el) {
            if (!isValidElement(el)) {
                return;
            }
            return new eStore(el);
        },
        data: function data(el, key, val) {
            if (!isValidElement(el)) {
                return;
            }
            var data = this.datastore(el);
            //set
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s && val !== undef || isPlainObject(key)) {
                data.set(key, val);
                return;
            }
            //get
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s || key === undef) {
                return data.get(key);
            }
        },
        on: function on(el, type, fn) {
            if ((typeof type === "undefined" ? "undefined" : _typeof(type)) !== s || (typeof fn === "undefined" ? "undefined" : _typeof(fn)) !== f || _typeof(el.addEventListener) !== f) {
                return;
            }
            var params = {
                element: el,
                type: "",
                fn: fn,
                options: {
                    capture: false,
                    once: false,
                    passive: false
                }
            };

            for (var _len = arguments.length, opts = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
                opts[_key - 3] = arguments[_key];
            }

            opts.forEach(function (arg) {
                if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) === b) {
                    params.options.capture = arg;
                }
                if (isPlainObject(arg)) {
                    for (var k in params.options) {
                        params.options[k] = arg[k] === true;
                    }
                }
            });
            var data = new EventData(el);

            type.split(" ").forEach(function (t) {
                data.events = Object.assign({}, params, { type: t });
                el.addEventListener(t, params.fn, params.options);
            });
        },
        one: function one(el, type, fn) {
            var capture = false;

            for (var _len2 = arguments.length, opts = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
                opts[_key2 - 3] = arguments[_key2];
            }

            opts.forEach(function (arg) {
                if ((typeof arg === "undefined" ? "undefined" : _typeof(arg)) === b) {
                    capture = arg;
                }
            });
            opts.push({ once: true, capture: capture === true });
            return this.on.apply(this, [el, type, fn].concat(opts));
        },
        off: function off(el) {
            if (_typeof(el.removeEventListener) !== f) {
                return;
            }

            var type = void 0,
                fn = void 0,
                capture = false;

            for (var _len3 = arguments.length, opts = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
                opts[_key3 - 1] = arguments[_key3];
            }

            opts.forEach(function (arg) {
                if (isPlainObject(arg)) {
                    capture = arg.capture === true;
                    return;
                }
                switch (typeof arg === "undefined" ? "undefined" : _typeof(arg)) {
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
            var data = new EventData(el);

            if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) !== f) {
                if ((typeof type === "undefined" ? "undefined" : _typeof(type)) === s) {
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

            if ((typeof type === "undefined" ? "undefined" : _typeof(type)) === s) {
                type.split(" ").forEach(function (t) {
                    data.remove(t, fn, capture);
                    el.removeEventListener(t, fn, capture);
                });
            }
        },
        trigger: function trigger(el, type, data) {
            if (_typeof(el.dispatchEvent) !== f) {
                return;
            }
            if ((typeof type === "undefined" ? "undefined" : _typeof(type)) === s) {
                type.split(" ").forEach(function (t) {
                    var event = new Event(t, { bubbles: true, cancelable: true });
                    event.data = data;
                    el.dispatchEvent(event);
                });
            }
        },
        body: function body(callback) {
            if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
                var i = setInterval(function () {
                    if (doc.bod !== null) {
                        clearInterval(i);
                        callback();
                    }
                }, 1);
            }
        },
        iddle: function iddle(callback) {
            if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
                if (doc.readyState === "loading") {
                    return doc.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
                        doc.removeEventListener('DOMContentLoaded', DOMContentLoaded);
                        callback();
                    });
                }
                callback();
            }
        },
        ready: function ready(callback) {
            if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
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

    wrapper.extend(function () {
        var defaults = {
            delay: 400,
            callback: undef
        };
        return {
            show: function show(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                var self = this;
                if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === n) {
                    delay = callback;
                }
                callback = (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f ? callback : defaults.callback;
                delay = (typeof delay === "undefined" ? "undefined" : _typeof(delay)) === n ? delay : defaults.delay;

                if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
                    self.one(el, "show", callback);
                }
                setTimeout(function () {
                    el.hidden = false;
                    self.trigger(el, "show");
                }, delay);
            },
            hide: function hide(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === n) {
                    delay = callback;
                }
                var self = this;
                callback = (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f ? callback : defaults.callback;
                delay = (typeof delay === "undefined" ? "undefined" : _typeof(delay)) === n ? delay : defaults.delay;
                if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f) {
                    self.one(el, "hide", callback);
                }
                setTimeout(function () {
                    el.hidden = true;
                    self.trigger(el, "hide");
                }, delay);
            },
            toggle: function toggle(el, callback, delay) {
                if (!(el instanceof Element)) {
                    return;
                }
                if ((typeof callback === "undefined" ? "undefined" : _typeof(callback)) === n) {
                    delay = callback;
                }
                var self = this;
                callback = (typeof callback === "undefined" ? "undefined" : _typeof(callback)) === f ? callback : defaults.callback;
                delay = (typeof delay === "undefined" ? "undefined" : _typeof(delay)) === n ? delay : defaults.delay;
                setTimeout(function () {
                    if (el.hidden === true) {
                        return self.show(el, callback, 0);
                    }
                    self.hide(el, callback, 0);
                }, delay);
            }
        };
    }());

    /**********************************/
    /*            Utils               */
    /**********************************/

    wrapper.extend({
        dataset: function dataset(el, key, value) {
            if (_typeof(el.dataset) !== o) {
                return;
            }
            var self = this;
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                if (value === undef) {
                    //read
                    var r = void 0;
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
                    el.dataset[key] = (typeof value === "undefined" ? "undefined" : _typeof(value)) === s ? value : JSON.stringify(value);
                }
            } else if (isPlainObject(key)) {
                Object.keys(key).forEach(function (x) {
                    return self.dataset(el, x, key[x]);
                });
            } else if (key === undef) {
                //read all
                var _r = {};
                for (var i in el.dataset) {
                    _r[i] = self.dataset(i);
                }
                return _r;
            }
        },
        html2element: function html2element(html) {
            if ((typeof html === "undefined" ? "undefined" : _typeof(html)) === s) {
                var template = doc.createElement('template');
                html = html.trim();
                template.innerHTML = html;
                return template.content.firstChild;
            }
        },
        html2doc: function html2doc(html) {
            var node = doc.implementation.createHTMLDocument().documentElement;
            if ((typeof html === "undefined" ? "undefined" : _typeof(html)) === s && html.length > 0) {
                node.innerHTML = html;
            }
            return node;
        },
        text2node: function text2node(text) {
            if ((typeof text === "undefined" ? "undefined" : _typeof(text)) === s) {
                return doc.createTextNode(text);
            }
        },
        addcss: function addcss(css) {
            if ((typeof css === "undefined" ? "undefined" : _typeof(css)) === s && css.length > 0) {
                var _s = doc.createElement('style');
                _s.setAttribute('type', "text/css");
                _s.appendChild(doc.createTextNode('<!-- ' + css + ' -->'));
                doc.head.appendChild(_s);
                return _s;
            }
        },
        addscript: function addscript(src) {
            if ((typeof src === "undefined" ? "undefined" : _typeof(src)) === s && src.length > 0) {
                var _s2 = doc.createElement("script");
                _s2.setAttribute("type", "text/javascript");
                _s2.appendChild(doc.createTextNode(src));
                doc.head.appendChild(_s2);
                return _s2;
            }
        },
        copy2clipboard: function copy2clipboard(text) {
            var r = false;
            if ((typeof text === "undefined" ? "undefined" : _typeof(text)) === s) {
                var el = this.html2element("<textarea>" + text + "</textarea>\"");
                doc.body.appendChild(el);
                el.style.opacity = 0;
                el.select();
                r = doc.execCommand("copy");
                doc.body.removeChild(el);
            }
            return r;
        },
        loadScript: function loadScript(src, callback, binding) {
            if (isValidUrl(src)) {
                var script = doc.createElement('style');
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
        loadCSS: function loadCSS(src, callback, binding) {
            if (isValidUrl(src)) {
                var style = doc.createElement('style');
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
        addClass: function addClass(classname) {
            return this.each(function (index) {
                if (this.classList === undef) return;
                var classes = classname;
                if ((typeof classes === "undefined" ? "undefined" : _typeof(classes)) === f) {
                    classes = classes.call(this, index, this.className);
                }
                if ((typeof classes === "undefined" ? "undefined" : _typeof(classes)) === s) {
                    var _classList;

                    (_classList = this.classList).add.apply(_classList, _toConsumableArray(classes.split(' ')));
                }
            });
        },
        removeClass: function removeClass(classname) {
            return this.each(function (index) {
                if (this.classList === undef) return;
                var classes = classname;
                if ((typeof classes === "undefined" ? "undefined" : _typeof(classes)) === f) {
                    classes = classes.call(this, index, this.className);
                }
                if ((typeof classes === "undefined" ? "undefined" : _typeof(classes)) === s) {
                    var _classList2;

                    (_classList2 = this.classList).remove.apply(_classList2, _toConsumableArray(classes.split(' ')));
                }
            });
        },
        hasClass: function hasClass(classname) {
            if (this.length > 0 && _typeof(this[0].classList) !== undef && (typeof classname === "undefined" ? "undefined" : _typeof(classname)) === s) {
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
        dataset: function dataset(key, value) {
            if (this.length === 0) {
                return this;
            }
            var self = this;
            if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
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
        findNode: function () {

            var MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;
            var options = {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true
            };
            var defaults = {
                selector: "",
                callback: null,
                once: true,
                uid: null
            };

            var uid = 0;

            function triggerEvent(node, params, obs, el) {
                var event = new Event("DOMNodeFound", { bubbles: true, cancelable: true });
                event.data = {
                    options: params,
                    observer: obs,
                    current: el
                };
                node.dispatchEvent(event);
            }

            function nodeFinder(el) {
                var params = Object.assign({}, defaults);

                for (var i = 1; i < arguments.length; i++) {
                    var arg = arguments[i];
                    switch (typeof arg === "undefined" ? "undefined" : _typeof(arg)) {
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

                if (_typeof(params.callback) === f) {
                    params.uid = uid++;
                    var matches = [];
                    var run = function run() {
                        el.querySelectorAll(params.selector).forEach(function (target) {
                            if (!matches.includes(target)) {
                                matches.push(target);
                                triggerEvent(target, params, observer, el);
                            }
                        });
                    };

                    var DOMNodeFound = function DOMNodeFound(e) {
                        //no multi triggers for other searches
                        if (e.data === undef || DOMNodeFound.uid !== params.uid) {
                            return;
                        }
                        var self = e.target,
                            obs = e.data.observer;
                        if (self.matches(params.selector)) {
                            var retval = params.callback.call(self, e);
                            if (params.once === true || retval === false) {
                                el.removeEventListener(e.type, DOMNodeFound);
                                obs.disconnect();
                            }
                            return retval;
                        }
                    };
                    DOMNodeFound.uid = params.uid;
                    el.addEventListener("DOMNodeFound", DOMNodeFound, false);
                    var observer = new MutationObserver(function (m, obs) {
                        for (var _i = 0; _i < m.length; _i++) {
                            var rec = m[_i],
                                target = rec.target;
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
            return function findNode() {
                for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = arguments[_key4];
                }

                return this.each(function () {
                    nodeFinder.apply(undefined, [this].concat(args));
                });
            };
        }()
    });

    /* jshint -W117 */

    /**
     * Basic AJAX Functionnality
     */

    var xhRequest = function (_oStore3) {
        _inherits(xhRequest, _oStore3);

        _createClass(xhRequest, [{
            key: "get",
            value: function get(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    return this[key];
                } else if (key === undef) {
                    return this._data;
                }
            }
        }, {
            key: "set",
            value: function set(key, val) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s && this.has(key)) {
                    this[key] = val;
                } else if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === o) {
                    Object.keys(key).forEach(function (prop) {
                        this.set(prop, key[prop]);
                    }, this);
                }
                return this;
            }
        }, {
            key: "has",
            value: function has(key) {
                return this._data.hasOwnProperty(key);
            }
        }, {
            key: "remove",
            value: function remove(key) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === s) {
                    key = key.split(' ');
                }
                if (isArray(key)) {
                    key.forEach(function (prop) {
                        this[prop] = null;
                    }, this);
                }
                return this;
            }
        }]);

        function xhRequest(options) {
            _classCallCheck(this, xhRequest);

            var _this14 = _possibleConstructorReturn(this, (xhRequest.__proto__ || Object.getPrototypeOf(xhRequest)).call(this));

            var defaults = {
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

            _this14._data = Object.assign({}, defaults);

            Object.defineProperties(_this14, {
                url: {
                    configurable: true, enumerable: true,
                    set: function set(url) {
                        if ((typeof url === "undefined" ? "undefined" : _typeof(url)) === s) {
                            var a = doc.createElement('a');
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
                    },
                    get: function get() {
                        return this._data.url;
                    }
                },
                ajax: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === b) {
                            switch (val) {
                                case false:
                                    delete this._data.headers["X-Requested-With"];
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
                    },
                    get: function get() {
                        return this._data.ajax;
                    }
                },
                credentials: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        this._data.credentials = val === true;
                    },
                    get: function get() {
                        return this._data.credentials;
                    }
                },
                method: {
                    configurable: true, enumerable: true,
                    set: function set(method) {
                        if ((typeof method === "undefined" ? "undefined" : _typeof(method)) === s && ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS", "TRACE", "PATCH"].includes(method.toUpperCase())) {
                            this._data.method = method.toUpperCase();
                        }
                        if (method === null) this._data.method = defaults.method;
                    },
                    get: function get() {
                        return this._data.method;
                    }
                },
                async: {
                    configurable: true, enumerable: true,
                    set: function set(async) {
                        this._data.async = async !== false;
                    },
                    get: function get() {
                        return this._data.async;
                    }
                },
                username: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === s) this._data.username = val;
                        if (val === null) this._data.username = defaults.username;
                    },
                    get: function get() {
                        return this._data.username;
                    }
                },
                password: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === s) this._data.password = val;
                        if (val === null) this._data.password = defaults.password;
                    },
                    get: function get() {
                        return this._data.password;
                    }
                },
                headers: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if (isPlainObject(val)) {
                            Object.assign(this._data.headers, val);
                        }
                        if (val === null) this._data.headers = Object.assign({}, defaults.headers);
                    },
                    get: function get() {
                        return this._data.headers;
                    }
                },
                cache: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === b) {
                            switch (val) {
                                case true:
                                    delete this._data.headers["Cache-Control"];
                                    break;
                                default:
                                    this._data.headers["Cache-Control"] = "no-cache";
                                    break;
                            }
                            this._data.cache = val;
                        }
                        if (val === null) this.cache = defaults.cache;
                    },
                    get: function get() {
                        return this._data.cache;
                    }
                },
                context: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if (val instanceof Object) {
                            this._data.context = val;
                        }
                        if (val === null) this._data.context = defaults.context;
                    },
                    get: function get() {
                        return this._data.context;
                    }
                },
                timeout: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === n) {
                            if (val < 61) {
                                val = val * 1000;
                            }
                            this._data.timeout = val;
                        }
                        if (val === null) this._data.timeout = defaults.timeout;
                    },
                    get: function get() {
                        return this._data.timeout;
                    }
                },
                data: {
                    configurable: true, enumerable: true,
                    set: function set(val) {
                        if (val instanceof Document || val instanceof Blob || val instanceof FormData || val instanceof URLSearchParams || (typeof val === "undefined" ? "undefined" : _typeof(val)) === s || isPlainObject(val)) {
                            this._data.data = val;
                        }
                        if (val === null) this._data.data = defaults.data;
                    },
                    get: function get() {
                        if (isPlainObject(this._data.data)) {
                            var data = new URLSearchParams();
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
                    set: function set(val) {
                        if ((typeof val === "undefined" ? "undefined" : _typeof(val)) === f) {
                            this._data[key] = val;
                        }
                        if (val === null) this._data[key] = defaults[key];
                    },
                    get: function get() {
                        return this._data[key];
                    }
                });
            }, _this14);

            Object.defineProperty(_this14, 'xhr', {
                configurable: true, writable: true,
                value: null
            });

            if (isPlainObject(options)) {
                _this14.set(options);
            }
            return _this14;
        }

        _createClass(xhRequest, [{
            key: "_buildRequest",
            value: function _buildRequest(xhr) {
                var _this15 = this;

                if (this.url === null || this.success === null) {
                    throw new Error('xhRequest: no url or success function set.');
                }
                xhr.open(this.method, this.url.href, this.async, this.username, this.password);
                xhr.withCredentials = this.credentials;
                Object.keys(this.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, _this15.headers[key]);
                });
                if (this.timeout > 0) xhr.timeout = this.timeout;
                var self = this;
                //events
                xhr.onerror = xhr.onabort = xhr.ontimeout = function onerror(e) {
                    if (_typeof(self.error) === f) {
                        return self.error.call(self.context === null ? this : self.context, xhr, self, e);
                    }
                };
                xhr.onloadend = function complete(e) {
                    if (_typeof(self.complete) === f) {
                        return self.complete.call(self.context === null ? this : self.context, xhr, self, e);
                    }
                };
                xhr.onload = function (e) {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            return self.success.call(self.context === null ? this : self.context, xhr, self, e);
                        }
                        if (_typeof(self.error) === f) {
                            return self.error.call(self.context === null ? this : self.context, xhr, self, e);
                        }
                    }
                };
                return xhr;
            }
        }, {
            key: "send",
            value: function send() {
                for (var _len5 = arguments.length, opts = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                    opts[_key5] = arguments[_key5];
                }

                opts.forEach(function (opt) {
                    if ((typeof opt === "undefined" ? "undefined" : _typeof(opt)) === s || opt instanceof URL) {
                        this.url = opt;
                        return;
                    }
                    if (opt instanceof FormData || opt instanceof URLSearchParams || isPlainObject(opt)) {
                        this.data = opt;
                        return;
                    }
                    if ((typeof opt === "undefined" ? "undefined" : _typeof(opt)) === f) this.success = opt;
                    if ((typeof opt === "undefined" ? "undefined" : _typeof(opt)) === n) this.timeout = opt;
                }, this);

                var xhr = this.xhr = new XMLHttpRequest();
                //before
                if (_typeof(this.before) === f) {
                    if (false === this.before.call(this.context, xhr, this)) {
                        return false;
                    }
                }
                this._buildRequest(xhr);
                xhr.send(this.data);
                return this;
            }
        }]);

        return xhRequest;
    }(oStore);
    /* jshint +W117 */

    wrapper.extend({
        ajax: function ajax(options) {
            var xhR = new xhRequest(options);
            return xhR.send();
        },


        /**
         * Loads Resources and cache them into localStore
         */
        loadResource: function () {

            var ls = new xStore(localStorage),
                self = wrapper;

            var globalSettings = {
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

            function log() {
                if (settings().debug === true) {
                    var _console;

                    (_console = console).debug.apply(_console, arguments);
                }
            }

            function settings(extend) {
                if (isPlainObject(extend)) {
                    Object.keys(globalSettings).forEach(function (key) {
                        if (extend.hasOwnProperty(key) && _typeof(extend[key]) === _typeof(globalSettings[key])) {
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
                Object.keys(ls.get()).forEach(function (key) {
                    var val = ls.get(key);
                    if (isPlainObject(val) && val.iscacheddata === true) {
                        ls.remove(key);
                    }
                });
            }

            function getKey(url) {
                var p = void 0,
                    key = void 0;
                if (p = pathinfo(url)) {
                    key = settings().prefix + p.basename;
                }
                return key;
            }

            function getParams(options) {
                var params = {
                    url: "", key: "",
                    success: null, error: null, complete: null,
                    expire: settings().expire,
                    cache: settings().cache,
                    execute: settings().execute
                };
                if (isPlainObject(options)) {
                    Object.keys(params).forEach(function (key) {
                        if (_typeof(options[key]) === _typeof(params[key]) || params[key] === null && _typeof(options[key]) === f) {
                            params[key] = options[key];
                        }
                    });
                }
                return params;
            }

            function handleData(data, params, xhr) {
                if (params.execute === true) {
                    var types = settings().types;
                    Object.keys(types).forEach(function (type) {
                        if (data.type.indexOf(type) === 0) {
                            log('loadResource: injecting', params.url, 'into the dom as', type);
                            types[type](data.content);
                        }
                    });
                }
                if (_typeof(params.success) === f) {
                    params.success.call(null, data, params);
                }
                if (xhr === undef && _typeof(params.complete) === f) {
                    params.complete.call(null, data, params);
                }
            }

            function isValidData(data, params) {
                var now = +new Date();
                if (data.iscacheddata === true) {
                    if (!["type", "url", "content"].every(function (x) {
                        return (typeof x === "undefined" ? "undefined" : _typeof(x)) === s && x.length > 0;
                    })) {
                        return false;
                    }
                    //if expire is modified
                    if (_typeof(data.created) === n) {
                        if (params.expire !== 0) {
                            var expire = data.created + params.expire * 60 * 60 * 1000;
                            if (expire - now < 0) return false;
                        }
                    } else return false;
                    if (_typeof(data.expire) === n) {
                        if (data.expire !== 0 && data.expire - now < 0) {
                            return false;
                        }
                    } else return false;
                    return true;
                }
                return false;
            }

            function createData(params, xhr) {
                var now = +new Date();
                if (xhr.responseText.length > 0 && xhr.getResponseHeader('content-type') !== null && xhr.status === 200) {
                    var data = {
                        iscacheddata: true,
                        url: params.url,
                        type: xhr.getResponseHeader('content-type'),
                        content: xhr.responseText,
                        expire: 0,
                        created: now
                    };
                    if (params.cache === true) {
                        if (params.expire !== 0) {
                            data.expire = now + params.expire * 60 * 60 * 1000;
                        }
                    }
                    return data;
                }
            }

            function loadResource() {
                var boolcount = 0,
                    opts = {};

                for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                    args[_key6] = arguments[_key6];
                }

                args.forEach(function (arg) {
                    if (isArray(arg)) return arg.forEach(function (x) {
                        return loadResource(x);
                    });
                    switch (typeof arg === "undefined" ? "undefined" : _typeof(arg)) {
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

                if (_typeof(opts.url) === s && opts.url.length > 0) {
                    opts.key = getKey(opts.url);
                    var params = getParams(opts),
                        ks = new kStore(ls, params.key);
                    if (params.cache === false) {
                        ks.clear();
                    } else if (isValidData(ks, params)) {
                        log('loadResource: Loading from cache', params.url);
                        return handleData(ks.get(), params);
                    }

                    log('loadResource: Downloading', params.url);

                    //loads the resource
                    var data = void 0,
                        xh = new xhRequest({
                            url: params.url,
                            timeout: 15,
                            success: function success(xhr) {
                                if (data = createData(params, xhr)) {
                                    log('loadResource: Success', params.url);
                                    if (params.cache === true) {
                                        //let ks = new kStore(ls, params.key);
                                        ks.set(data);
                                    }
                                    return handleData(data, params, xhr);
                                }
                                self.trigger(xhr, 'error');
                            },
                            error: function error() {
                                log('loadResource: Error', params.url);
                                if (_typeof(params.error) === f) {
                                    return params.error.call(null, params);
                                }
                            },
                            complete: function complete() {
                                if (_typeof(params.complete) === f) {
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
        }(),
        animated: function () {
            var animations = "bounce flash pulse rubberBand shake swing tada wobble jello bounceIn bounceInDown bounceInLeft bounceInRight bounceInUp bounceOut bounceOutDown bounceOutLeft bounceOutRight bounceOutUp fadeIn fadeInDown fadeInDownBig fadeInLeft fadeInLeftBig fadeInRight fadeInRightBig fadeInUp fadeInUpBig fadeOut fadeOutDown fadeOutDownBig fadeOutLeft fadeOutLeftBig fadeOutRight fadeOutRightBig fadeOutUp fadeOutUpBig flip flipInX flipInY flipOutX flipOutY lightSpeedIn lightSpeedOut rotateIn rotateInDownLeft rotateInDownRight rotateInUpLeft rotateInUpRight rotateOut rotateOutDownLeft rotateOutDownRight rotateOutUpLeft rotateOutUpRight slideInUp slideInDown slideInLeft slideInRight slideOutUp slideOutDown slideOutLeft slideOutRight zoomIn zoomInDown zoomInLeft zoomInRight zoomInUp zoomOut zoomOutDown zoomOutLeft zoomOutRight zoomOutUp hinge jackInTheBox rollIn rollOut";
            var eventend = function (div) {
                var browerevents = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd'
                };
                for (var style in browerevents) {
                    if (div.style[style] !== "undefined") {
                        return browerevents[style];
                    }
                }
            }(doc.createElement('div'));
            var eventstart = eventend.replace(/End$/, 'Start').replace(/end$/, 'start');
            var types = function (a) {
                var result = { seeker: [], in: [], out: [] };
                a.forEach(function (cls) {
                    var m = void 0,
                        type = "seeker";
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
            }(animations.split(' '));
            var list = animations.split(" ");
            var defaults = {
                classList: "swing",
                callback: null,
                toggle: false
            };
            function getToggleMode(animation) {
                if ((typeof animation === "undefined" ? "undefined" : _typeof(animation)) === s && animation.length > 0) {
                    var classList = animation.split(" ");
                    for (var i = 0; i < classList.length; i++) {
                        for (var type in types) {
                            if (types[type].includes(classList[i])) {
                                return type;
                            }
                        }
                    }
                }
                return null;
            }
            function isAnimation(animation) {
                return _typeof(getToggleMode(animation)) === s;
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
            return function animated(el, classList, callback, toggle) {
                // eslint-disable-line
                if (_typeof(el.classList) !== undef) {
                    var _el$classList;

                    var params = Object.assign({}, defaults);
                    for (var i = 1; i < arguments.length; i++) {
                        var arg = arguments[i];
                        switch (typeof arg === "undefined" ? "undefined" : _typeof(arg)) {
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
                    var self = wrapper;

                    if (params.classList.length === 0 || !isAnimation(params.classList)) return false;
                    if (_typeof(params.callback) === f) self.one(el, "animated", params.callback);
                    var mode = void 0;
                    if (params.toggle === true) mode = getToggleMode(params.classList);
                    (_el$classList = el.classList).remove.apply(_el$classList, ["animated"].concat(_toConsumableArray(list)));

                    setTimeout(function () {
                        var _el$classList3;

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
                                var _el$classList2;

                                (_el$classList2 = el.classList).remove.apply(_el$classList2, ["animated"].concat(_toConsumableArray(params.classList.split(' '))));
                                self.trigger(el, "animated");
                            });
                        });
                        (_el$classList3 = el.classList).add.apply(_el$classList3, ['animated'].concat(_toConsumableArray(params.classList.split(' '))));
                    }, 400);
                    return true;
                }
                return false;
            };
        }()
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

    ["extend", "get", "each", "declare", "version"].forEach(function (x) {
        wrapper.hasOwnProperty(x) && Object.defineProperty(wrapper, x, { enumerable: false, configurable: true, writable: false });
        wrapper.fn.hasOwnProperty(x) && Object.defineProperty(wrapper.fn, x, { enumerable: false, configurable: true, writable: false });
    });

    wrapper.fn.extend(function () {
        var obj = {};
        ["on", "one", "off", "trigger", "show", "hide", "toggle", "animated"].forEach(function (fn) {
            obj[fn] = function () {
                for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                    args[_key7] = arguments[_key7];
                }

                return this.each(function () {
                    wrapper[fn].apply(wrapper, [this].concat(args));
                });
            };
        });
        return obj;
    }());

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