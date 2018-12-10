/* jshint expr: true */
/* jshint -W018 */

//========================// Types //========================//
/**
 * Check if has value
 * @param {any} s
 * @returns {boolean}
 */
const isset = function(s) {
    return typeof s !== 'undefined' ? !isnull(s) : false;
};
/**
 * check if object
 * @param {any} s
 * @returns {boolean}
 */
const isobject = function(s) {
    return typeof s === 'object' && s !== null;
};

/**
 * Check if object root
 * @param {type} s
 * @returns {Boolean}
 */
const isplainobject = function(s) {
    return s instanceof Object && Object.getPrototypeOf(s) === Object.prototype;
};

/**
 * check if array
 * @param {any} s
 * @returns {boolean}
 */
const isarray = function(s) {
    return Array.isArray(s);
};
/**
 *Check if string
 * @param {any} s
 * @returns {boolean}
 */
const isstring = function(s) {
    return typeof s === 'string';
};
/**
 * check if boolean
 * @param {any} s
 * @returns {boolean}
 */
const isbool = function(s) {
    return s === true || s === false;
};
/**
 * check if number
 * @param {any} s
 * @returns {boolean}
 */
const isnumber = function(s) {
    return typeof s === 'number';
};
/**
 * check if integer
 * @param {any} s
 * @returns {boolean}
 */
const isint = function(s) {
    return typeof s === 'number' && isFinite(s) && Math.floor(s) === s && !(s % 1);
};

/**
 * Check if value contains numbers
 * @param {any} s
 * @returns {boolean}
 * @link http://locutus.io/php/var/is_numeric/
 */
const isnumeric = function(s) {
    let whitespace = [' ', '\n', '\r', '\t', '\f', '\x0b', '\xa0', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005',
        '\u2006', '\u2007', '\u2008', '\u2009', '\u200a', '\u200b', '\u2028', '\u2029', '\u3000'].join('');
    return (typeof s === 'number' || (typeof s === 'string' && whitespace.indexOf(s.slice(-1)) === -1)) && s !== '' && !isNaN(s)
};



/**
 * check if float
 * @param {any} s
 * @returns {boolean}
 */
const isfloat = function(s) {
    return +s === s && (!isFinite(s) || !!(s % 1));
};
/**
 * check if function
 * @param {any} s
 * @returns {boolean}
 */
const iscallable = function(s) {
    return typeof s === 'function';
};
/**
 * check if null
 * @param {any} s
 * @returns {boolean}
 */
const isnull = function(s) {
    return s === null;
};
/**
 * check if symbol
 * @param {any} s
 * @returns {boolean}
 */
const issymbol = function(s) {
    return typeof s === 'symbol';
};


/**
 * Check if iterable with of loops
 * @param {Object} s
 * @returns {Boolean}
 */
const isiterable = function(s) {
    return (!s || s === null) ? false : typeof s[Symbol.iterator] === 'function';
};

/**
 * Get object type in lowercase
 * @param {any} s
 * @returns {string}
 */
const gettype = function(s) {
    return Object.prototype.toString.call(s).match(/^\[object (.*?)\]$/)[1].toLowerCase();
};



//========================// Helpers //========================//

/**
 * Get var length
 * @param {any} s
 * @returns {number}
 */
const count = function(s) {
    if (!isset(s))
        return 0;
    if (isbool(s))
        return s ? 1 : 0;
    if (isobject(s))
        return Object.keys(s).length;
    if (typeof s.length === "number")
        return s.length;
    if (isnumber(s))
        return Math.ceil(s);
    return 0;
};
/**
 * Check if value is empty
 * @param {any} s
 * @returns {Boolean}
 */
const empty = function(s) {
    return count(s) < 1;
};

/**
 * Foreach loop for object and arrays
 * @param {Object} o
 * @param {function} c
 * @param {Object} [b] - bind
 * @returns {boolean} - If false in callback, return false
 *
 */
const foreach = function(o, c, b) {
    if (!(o instanceof Object))
        return false;
    b = !b ? o : b;
    for (let i of Object.keys(o)) {
        if (c.call(b, o[i], i) === false)
            return false;
    }
    return true;
};

/**
 * Creates a new array with all sub-array elements concatted into it recursively up to the specified depth.
 * @param {Object} a - iterable object Array or Array like
 * @returns {Array}
 */
const flatten = function(a) {
    let r = [];
    if (isiterable(a)) {
        for (let i of a) {
            if (!isset(i))
                continue;
            r = r.concat(isiterable(i) ? flatten(i) : i);
        }

    }
    return r;
};



/**
 * Get the first letter from a string to Uppercase
 * @param {string} s
 * @returns {string}
 */
const ucfirst = function(s) {
    s += '';
    return s.length > 0 ? s.charAt(0).toUpperCase() + s.substr(1) : s;
};

/**
 * Format a string using {}
 * @param {string} str
 * @param {string|object} replacements
 * @returns {string}
 */
const format = function(str, ...replacements) {
    str = !str ? str.toString() ? str.toString() : '' : str;
    let val, i = 0;
    if (empty(str))
        return '';
    for (; i < replacements; i++) {
        val = replacements[i];
        switch (typeof (val)) {
            case "object":
                foreach(val, function(v, k) {
                    if (isobject(v))
                        return;
                    str = str.replace(new RegExp('{[\ ]+?' + k + '[\ ]+?}', 'g'), v);
                });
                break;
            default :
                str = str.replace(new RegExp('{[\ ]+?' + i + '[\ ]+?}', 'g'), val);
        }
    }
    return str;
};



/**
 * Returns trailing name component of path
 * @param {string} p - Path
 * @param {string} [s] - Suffix
 * @returns {string|undefined}
 */
const basename = function(p, s) {
    let b = isstring(p) && !empty(p) ? p.replace('\\', '/').split('/').pop() : undefined;
    if (isstring(s) && !empty(s) && isstring(b) && b.substr(b.length - s.length) === s) {
        b = b.substr(0, b.length - s.length);
    }
    return b;
};
/**
 * Returns a parent directory's path
 * @param {string} p - path
 * @param {number} [l] - levels
 * @returns {string|undefined}
 */
const dirname = function(p, l = 1) {
    let b = isstring(p) && !empty(p) ? p.replace('\\', '/').split('/') : undefined;
    if (!isarray(b))
        return b;
    for (let n = 0; n < l; n++) {
        b.pop();
    }
    return b.length > 0 ? b.join('/') : '.';
};
/**
 * Returns the file extension (if checking an url please use new URL)
 * @param {string} p - path
 * @returns {string}
 */
const extname = function(p) {
    if (!isstring(p) || empty(p) || p.lastIndexOf('.') < 1)
        return "";
    let b = basename(p);
    return isstring(b) ? b.split('.').pop() : "";
};

/**
 * Returns information about a file path
 * @param {string} p - path
 * @returns {object|undefined}
 */
const pathinfo = function(p) {
    if (!isstring(p) || empty(p))
        return undefined;
    let r = {
        dirname: dirname(p),
        basename: basename(p),
        extension: extname(p),
        filename: ''
    };
    if (!empty(r.basename)) {
        let f = r.filename = r.basename;
        if (!empty(r.extension)) {
            r.filename = f.substr(0, f.length - r.extension.length - 1);
        }
    }
    return r;

};
pathinfo.extension = extname;
pathinfo.dirname = dirname;
pathinfo.basename = basename;
pathinfo.filename = function(p) {
    let r;
    return (r = pathinfo(p)) ? r.filename : undefined;
};

/**
 * Loads function on dom ready
 * @param {function} fn
 * @param {Object} [binding]
 */
const onDocEnd = function(fn, binding) {
    if (!iscallable(fn))
        return;
    onDocStart(function() {
        if (document.readyState !== 'loading') {
            return fn();
        }
        document.addEventListener('DOMContentLoaded', fn);
    }, binding);
};

/**
 * Launch a callback when document.body is available
 * @param {function} fn - can use multiple
 * @param {Object} [binding]
 */
const onDocStart = function(fn, binding) {
    if (!iscallable(fn))
        return;
    if (isobject(binding))
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
};


/**
 * Copy properties descriptors from source to target
 * @param {Object} target - target Object or function
 * @param {Object} source - source to copy properties from
 * @param {boolean} [enumerables] - only copy enumerables properties
 * @returns {Object}
 */
const extendProperties = function(target, source, enumerables) {
    if (!(target instanceof Object) || !(source instanceof Object)) {
        throw new Error("Cannot extend properties : Invalid Argument Exception.");
    }
    if (isiterable(source) || isiterable(target)) {
        throw new Error("Cannot extend properties : one of the objects is iterable (doesn't have properties.");
    }
    let props, prop, desc;
    if ((props = Object.getOwnPropertyNames(source))) {
        for (let i = 0; i < props.length; i++) {
            prop = props[i];
            if (prop === "constructor") {
                continue;
            }
            if (!source.propertyIsEnumerable(prop) && enumerables === true) {
                continue;
            }
            if (target.hasOwnProperty(prop) && !target.propertyIsConfigurable(prop)) {
                if (target.propertyIsWritable(prop)) {
                    target[prop] = source[prop];
                }
                continue;
            }
            desc = Object.getOwnPropertyDescriptor(source, prop);
            desc.enumerable = iscallable(desc.value) ? false : desc.enumerable;
            Object.defineProperty(target, prop, desc);
        }
    }
    return target;
};

/**
 * Copy properties from source to target
 * @param {Object} target - target Object or function
 * @param {Object} source - source to copy properties from
 * @returns {Object}
 */
const extend = function(target, source) {
    if (!(target instanceof Object) || !(source instanceof Object) || isiterable(target) || isiterable(source)) {
        throw new Error("extend(...) Invalid argument exception.");
    }
    for (let prop of Object.keys(source)) {
        target[prop] = source[prop];
    }
    return target;
};



//========================// Missing Methods //========================//

/**
 * Copy properties descriptors from source
 * @param {Object} source - to copy properties from
 * @returns {Object}
 */
Object.prototype.extendProperties || Object.defineProperty(Object.prototype, 'extendProperties', {
    value: function() {
        return extendProperties(this, ...arguments);
    }
});

/**
 * Copy properties from source
 * @param {Object} source - to copy properties from
 * @returns {Object}
 */
Object.prototype.extend || Object.defineProperty(Object.prototype, 'extend', {
    value: function() {
        return extend(this, ...arguments);
    },
    //prevent BC break with other frameworks
    configurable: true,
    writable: true
});

/**
 * Removes Property from object
 * @param {string} prop
 * @param {boolean} deep - finds the first occurence
 * @returns {boolean}
 */
Object.prototype.removeProperty || Object.defineProperty(Object.prototype, 'removeProperty', {
    value: function(prop, deep = false) {
        let self = this;
        if (deep) {
            if (!self.hasOwnProperty(prop) && self[prop]) {
                while (Object.prototype !== self) {
                    if (self.hasOwnProperty(prop)) {
                        if (self.propertyIsConfigurable(prop))
                            break;
                        else
                            return false;
                    }
                    self = Object.getPrototypeOf(self);
                }
            }
        }
        if (self.hasOwnProperty(prop) && self.propertyIsConfigurable(prop)) {
            return delete self[prop];
        }
        return false;
    }
});
/**
 * Check if given property is writable
 * @param {string} prop
 * @returns {boolean}
 */
Object.prototype.propertyIsWritable || Object.defineProperty(Object.prototype, 'propertyIsWritable', {
    value: function(prop) {
        let descriptor;
        if (!prop || !(descriptor = Object.getOwnPropertyDescriptor(this, prop)))
            return undefined;
        return descriptor.writable;
    }
});
/**
 * Check if given property is configurable
 * @param {string} prop
 * @returns {boolean}
 */
Object.prototype.propertyIsConfigurable || Object.defineProperty(Object.prototype, 'propertyIsConfigurable', {
    value: function(prop) {
        let descriptor;
        if (!prop || !(descriptor = Object.getOwnPropertyDescriptor(this, prop)))
            return undefined;
        return descriptor.configurable;
    }
});



//========================// Helpers //========================//


class InvalidArgumentException extends Error {
    constructor() {
        super(...arguments);
    }
}

class ArgumentCollection extends Array {
    /**
     * Get Collection by type
     * @param {string} [type]
     * @returns {Array|object}
     */
    byType(type) {
        if (isstring(type) && type.length) {
            let ret;
            type += 's';
            return this.hasOwnProperty(type) ? this[type].map(x => x.value) : [];
        } else if (!type) {
            let r = {}, self = this;
            Object.getOwnPropertyNames(this).forEach(x => self.propertyIsConfigurable(x) && !isnumeric(x) && (r[x.substr(0, x.length - 1)] = self[x]));
            return count(r) ? r : undefined;
        }
        throw new InvalidArgumentException("type is incorrect.");
    }
    push(val) {
        if (gettype(val) === "object" && val.hasOwnProperty("position") && val.hasOwnProperty("type") && val.hasOwnProperty("value")) {
            let typed = val.type + 's';
            if (!this.hasOwnProperty(typed)) {
                Object.defineProperty(this, typed, {enumerable: false, writable: true, configurable: true});
            }
            this[typed] = Array.concat(this[typed] || [], val);
            return super.push(val);
        }
        throw new InvalidArgumentException("cannot push data, value is incorrect");

    }
}



/**
 * Parse arguments
 * @param {Object} args - Array or Array like
 * @returns {ArgumentCollection}
 */
const parseArguments = function(args) {
    if (!args || !args.length || !isiterable(args))
        return new ArgumentCollection();
    let ret = new ArgumentCollection(), type, arg, pos = 0;

    for (; pos < args.length; pos++) {
        arg = args[pos];
        type = isiterable(arg) ? 'iterable' : gettype(arg);
        ret.push({
            position: pos,
            type: type,
            value: arg
        });
    }
    return ret;
};




/**
 * Get own list of function defined inside an object
 * @param {function|object} obj - non iterable object
 * @returns {Array|undefined}
 */
const getOwnMethodList = function(obj) {
    let r = [], i = 0, props, desc, prop;
    if (!(obj instanceof Object) || isiterable(obj)) {
        return undefined;
    }
    if (([props, desc] = [Object.getOwnPropertyNames(obj), Object.getOwnPropertyDescriptors(obj)])) {
        for (; i < props.length; i++) {
            prop = props[i];
            if (iscallable(desc[prop].value)) {
                r.push(prop);
            }
        }
    }
    return r;
};



/**
 * Loads remote .js file
 * @param {type} src
 * @param {function} [onload] - callback to be executed after loading the script
 * @param {function} [onerror] - callback to be executed if script doesn't load
 */
const loadjs = function(src, onload, onerror) {
    if (!isstring(src) || empty(src))
        return;

    onDocStart(function() {
        let s = document.createElement('script');
        s.extend({
            async: true,
            type: "text/javascript"
        });
        document.body.appendChild(s);
        if (iscallable(onload))
            s.onload = onload;
        if (iscallable(onerror))
            s.onerror = onerror;
        s.src = src;
    });
};

/**
 * Loads remote .css
 * @param {string} src
 * @param {function} [onload] - callback to be executed after loading the css
 * @param {function} [onerror] - callback to be executed if css doesn't load
 * @link https://codepen.io/tigt/post/async-css-without-javascript
 */
const loadcss = function(src, onload, onerror) {
    if (!isstring(src) || empty(src)) {
        return;
    }
    onDocStart(function() {
        let s = document.createElement('link');
        s.setAttribute('lazyload', "1");
        s.extend({
            rel: "stylesheet",
            type: "text/css"
        });
        document.body.appendChild(s);
        if (iscallable(onload))
            s.onload = onload;
        if (iscallable(onerror))
            s.onerror = onerror;
        s.href = src;
    });
};

/**
 * Add css string to dom
 * @param {string} css
 */
const addStyle = function(css) {
    if (!isstring(css) || css.length < 1) {
        return;
    }
    onDocStart(function() {
        let s = document.createElement('style');
        s.setAttribute('type', "text/css");
        s.appendChild(document.createTextNode(`<!-- ${css} -->`));
        document.body.appendChild(s);
    });
};


/**
 * Creates dom elements using HTML
 * @param {String} html - HTML representing a single element
 * @return {Element}
 */
const html2element = function(html) {
    if (!isstring(html))
        return null;
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
};

//========================// ES6+ Class Support //========================//

/**
 * Base Class
 * @class
 */
const __base__ = (() => {

    function defprops() {
        return Object.defineProperties(...arguments);
    }
    function defprop() {
        return Object.defineProperty(...arguments);
    }
    function getdesc() {
        return Object.getOwnPropertyDescriptor(...arguments);
    }
    function getdescs() {
        return Object.getOwnPropertyDescriptors(...arguments);
    }

    function getproto() {
        return Object.getPrototypeOf(...arguments);
    }
    class BaseException extends Error {
        constructor(...args) {
            super(...args);
        }
    }

    class __base__ {
        constructor(...args) {
            let proto = getproto(this), base = getproto(proto);
            if (isplainobject(proto)) {
                throw new BaseException('Fatal Error abstract class __Base__ cannot be run on its own.');
            }

            //override
            //needed for special cases
            if (iscallable(this.__constructor__)) {
                this.constructor(...args);
            }


            //this.super if implementing some props
            if (!base.hasOwnProperty('__root__')) {
                let prox, desc;
                while (!proto.hasOwnProperty('__root__')) {
                    //abstract method detection
                    //use get abstract(){return {method(){}, ...}}
                    this.__abstract__(proto);
                    for (let prop of getOwnMethodList(proto)) {
                        if (prop === "constructor") {
                            continue;
                        }
                        if (!prop.match(/^[_]{2}(.*?)[_]{2}$/)) {
                            if (proto[prop].hasOwnProperty('__ignore__')) {
                                continue;
                            }
                            prox = `__${prop}__`;
                            if (!proto.hasOwnProperty(prox) && (desc = getdesc(proto, prop))) {
                                defprop(proto, prox, desc);
                            }
                            proto[prop] = new Proxy(proto[prox], {
                                apply(target, context, args) {
                                    let current, self = this.self, ret;
                                    current = self.__callee__;
                                    self.__callee__ = {
                                        name: this.name,
                                        proto: this.proto
                                    };
                                    ret = target.apply(self, args);
                                    self.__callee__ = current;
                                    return ret;
                                },
                                self: this,
                                proto: proto,
                                name: prop
                            });
                            proto[prop].__proxy__ = true;
                            continue;
                        }
                    }

                    proto = getproto(proto);
                    if (isplainobject(proto)) {
                        break;
                    }
                }
                base = proto;
                defprop(this, '__callee__', {
                    writable: true, configurable: true,
                    value: null
                });

                defprop(base, '__super__', {
                    configurable: true,
                    value: new Proxy(x => x, {
                        self: this,
                        get(t, prop) {
                            let self = this.self, caller, proto;
                            if ((caller = self.__callee__)) {
                                proto = getproto(caller.proto);
                                while (!isplainobject(proto)) {
                                    if (proto.hasOwnProperty(prop) && iscallable(proto[prop])) {
                                        return proto[prop];
                                    }
                                    proto = getproto(proto);
                                }

                            }
                            throw new BaseException('Invalid use of __Base__.super');
                        },
                        apply(t, th, args) {
                            let self = this.self, caller, target;
                            try {
                                if ((caller = self.__callee__) && (target = this.get(t, caller.name))) {
                                    return target.apply(self, args);
                                }
                            } catch (e) {
                                throw new BaseException('Invalid use of __Base__.super(...)');
                            }


                        }
                    })
                });

            } else {
                this.__abstract__(proto);
                defprop(base, '__super__', {
                    configurable: true,
                    get() {
                        throw new BaseException('Invalid use of __Base__.super (single inheritance).');
                    }
                });
            }
            if (iscallable(this.init)) {
                return  this.init(...args) || this;
            }
            return this;
        }
        get super() {
            return this.__super__;
        }
        set super(v) {}
        get __root__() {
            return null;
        }
        set __root__(v) {}
        get self() {
            return isobject(this.__callee__) ? this.__callee__.proto : getproto(this);
        }
        set self(v) {}

        static __magic__() {}

        __abstract__(proto) {
            if (!proto.hasOwnProperty('abstract'))
                return;
            let bundle = proto.abstract, desc;

            if (proto === getproto(this)) {
                throw new BaseException("Fatal Error: abstract classes cannot be instancied (you must extends them first and implement required methods). " + proto.constructor.name);
            }

            if (!isplainobject(bundle)) {
                throw new BaseException("Fatal Error: abstract bundle is not a plain object. " + proto.constructor.name);
            }
            if ((desc = getdescs(bundle))) {
                let src, args, isrc, iargs;
                Object.keys(desc).forEach(function(prop) {
                    if (prop === "init" || prop === "constructor" || prop === "__abstract__") {
                        throw new BaseException("Fatal Error : reserved \"" + prop + "\" method cannot be declared abstract. " + proto.constructor.name);
                    }
                    if (!iscallable(desc[prop].value)) {
                        throw new BaseException(`Fatal Error : abstract bundle contains a property that is not a function: "${prop}" ` + proto.constructor.name);
                    }
                    src = desc[prop].value.toString();
                    if ((src = src.match(/\((.*?)\)/)) !== null) {
                        //remove documentation and whitespace if any
                        args = src[1].trim().split(',').map(x => x.replace(/\/\*(.*?)\*\//, '').trim() || null).filter(x => x !== null);
                    } else {
                        throw new BaseException("Fatal Error : Cannot parse abstract method " + prop + " arguments " + proto.constructor.name);
                    }
                    if (!iscallable(this[prop])) {
                        throw new BaseException((() => {
                            let message = `Fatal Error : abstract method "${prop}" that accepts ${args.length} arguments `;
                            if (args.length) {
                                message += args.map(x => `"${x}"`).join(', ') + ' ';
                            }
                            message += 'is not implemented. ' + proto.constructor.name;
                            return message;
                        })());
                    }
                    //iscallable : check args
                    if (this[prop].__proxy__) {
                        isrc = this['__' + prop + '__'].toString();
                    } else {
                        isrc = this[prop].toString();
                    }

                    if ((isrc = isrc.match(/\((.*?)\)/)) !== null) {
                        //remove documentation and whitespace if any
                        iargs = isrc[1].trim().split(',').map(x => x.replace(/\/\*(.*?)\*\//, '').trim() || null).filter(x => x !== null);
                    } else {
                        throw new BaseException("Fatal Error : Cannot parse implemented method " + prop + " arguments " + proto.constructor.name);
                    }
                    if (iargs.length !== args.length) {
                        throw new BaseException("Fatal Error: implemented method \"" + prop + "\" does not have the same number of arguments (" + (iargs.length) + " instead of " + (args.length) + "). " + proto.constructor.name);

                    }

                }, this);

            }
        }

    }

    ["__root__", "super", "self", "__abstract__"].forEach(x => defprop(__base__.prototype, x, {configurable: false}));

    //__magic__ class
    class __magic__ extends __base__ {
        constructor(...args) {
            let retval = super(...args);
            if (!(getproto(this) instanceof __magic__)) {
                throw new BaseException('Fatal Error: __magic__ class must be extended');
            }
            if (retval !== this) {
                throw new BaseException('Warning: init constructor must not return a value in __magic__ extended class.' + this.constructor.name);
            }
            let proxy = new Proxy(this, {
                setPrototypeOf: function(t, p) {
                    throw new BaseException('Fatal Error : setPrototypeOf: action forbidden.' + t.constructor.name);
                },
                defineProperty(t, p, d) {
                    throw new BaseException('Fatal Error : defineProperty: action forbidden.' + t.constructor.name);
                },
                /*getPrototypeOf(t) {
                 throw new BaseException('Fatal Error : getPrototypeOf: action forbidden.' + t.constructor.name);
                 },*/

                get(t, p) {
                    let r;
                    if (!(p in t) && '__get' in t) {
                        r = t.__get(p);
                    }
                    r = r || t[p];

                    if (iscallable(r)) {
                        return new Proxy(r, {
                            apply: function(target, th, args) {
                                let ret = target(...args);
                                if (ret === t) {
                                    ret = proxy;
                                }
                                return ret;
                            }
                        });

                    }
                    return r;
                },
                has(t, p) {
                    let r;
                    if (t.__isset) {
                        r = t.__isset(p) === true;
                    }
                    return isbool(r) ? r : p in t;
                },
                set(t, p, v) {
                    if (!(p in t) && '__set' in t) {
                        t.__set(p, v);
                        return;
                    }
                    t[p] = v;
                },
                deleteProperty(t, p) {
                    let r;
                    if (!(p in t) && '__unset' in t) {
                        t.__unset(p);
                    } else if (p in t) {
                        delete p[t];
                    }
                    return !this.has(...arguments);
                },
                getOwnPropertyDescriptor(t, p) {
                    let d, v;
                    if ((d = getdesc(t, p))) {
                        return d;
                    }
                    if ((v = this.get(t, p))) {
                        return {configurable: true, enumerable: true, writable: true, value: v};
                    }
                    return d;
                },
                getIterator(t) {
                    let r, n;
                    if ('getIterator' in t) {
                        r = t.getIterator();
                        if (!isarray(r)) {
                            throw new BaseException("Fatal error : getIterator() does not return an Array ." + t.constructor.name);
                        }
                        return r;
                    }
                    return Object.getOwnPropertyNames(t);
                },
                ownKeys(t) {
                    return this.getIterator(t);
                },
                //trap in but will be removed from support
                enumerate(t) {
                    return this.getIterator(t)[Symbol.iterator]();
                }
            });
            return proxy;
        }

    }

    defprop(__base__, '__magic__', {writable: false, configurable: false, enumerable: false, value: __magic__});

    return __base__;
})();


const __magic__ = __base__.__magic__;

//========================// Events //========================//

/**
 * Add capability to trigger events to an object
 * @class emit
 * @param {Object} target - target to add events to
 */
const emit = function emit(target) {

    'use strict';
    if (typeof this === "undefined") {
        throw new Error('emit: must use the keyword new.');
    }

    let events = [];

    target = target || this;

    if (!(target instanceof Object)) {
        throw new Error('emit: invalid target.');
    }


    /**
     * Attach event to target
     * @param {string} type - A case-sensitive string representing the event type to listen for.
     * @param {function} fn - callback to call
     * @param {object} [binding] - binding for the callback
     * @returns {this}
     */
    target.on = function on(type, fn, binding) {
        binding = binding || target;
        if (isstring(type) && iscallable(fn)) {
            events.push({
                type: type,
                fn: fn,
                bind: binding
            });
            return target;
        }
        throw new InvalidArgumentException('emit.on(...)');
    };
    /**
     * Detach an event from target
     * @param {string} type - A case-sensitive string representing the event type to detach.
     * @param {function} [fn] - callback to detach
     * @returns {this}
     */
    target.off = function off(type, fn) {
        if (isstring(type)) {
            fn = fn || null;
            for (let id = 0; id < events.length; id++) {
                let evt = events[id];
                if (evt.type === type && (fn === null || fn === evt.fn)) {
                    events.splice(id, 1);
                }
            }
            events.sort();
            return target;
        }
        throw new InvalidArgumentException('emit.off(...)');
    };
    /**
     * Dispatches an Event
     * @param {string} type - A case-sensitive string representing the event type to trigger.
     * @param {any} [...args] - arguments to send the callback
     * @returns {this}
     */
    target.trigger = function trigger(type, ...args) {
        if (isstring(type)) {
            for (let id = 0; id < events.length; id++) {
                let evt = events[id];
                if (evt.type === type) {
                    evt.fn.apply(evt.bind, args);
                }
            }
            return target;
        }
        throw new InvalidArgumentException('emit.off(...)');
    };

    ["on", "off", "trigger"].forEach(x => Object.defineProperty(target, x, {enumerable: false}));
    return target;
};


const listener = (function listener() {



    class eventcollection extends Array {

        add(el, type, fn, capture) {
            if (isstring(type) && el instanceof EventTarget && iscallable(fn)) {
                this.push({
                    target: el,
                    type: type,
                    fn: fn,
                    capture: capture === true
                });
            }
            return this;
        }

        remove(el, type, fn, capture) {
            let r, retval, self = this;
            if (isstring(type) && el instanceof EventTarget) {
                if ((r = this.find(...arguments))) {
                    r.forEach(x => self.splice(x.id, 1));
                }
                this.sort();
            }
            return this;
        }

        find(el, type, fn, capture) {
            let r, retval = [], undef;
            if (isstring(type) && el instanceof EventTarget) {

                capture = capture === true;
                let entry;
                this.forEach(function(entry, i) {
                    if (type === entry.type && el === entry.target) {
                        if ((!fn || fn === entry.fn) && capture === entry.capture) {
                            retval.push(Object.assign({id: i}, entry));
                        }
                    }
                });
            }
            return retval.length ? retval : undef;

        }

    }
    /**
     *  static registery
     *  @type eventcollection
     */
    let events = new eventcollection();


    /**
     * Manage dom events
     */
    class listener extends __base__ {

        /**
         * Creates an event object
         * @param {string} type - The name of the event (case-insensitive)
         * @param {boolean} [bubbles] - A Boolean indicating whether the event bubbles up through the DOM or not.
         * @param {boolean} [cancelable] - A Boolean indicating whether the event is cancelable.
         * @returns {Event|undefined}
         */
        static create(type, bubbles, cancelable) {
            if (isstring(type)) {
                return new Event(type, {bubbles: bubbles !== false, cancelable: cancelable !== false});
            }
        }
        /**
         * Attach event to target
         * @param {EventTarget} el - element to attach the event to
         * @param {string} type - A case-sensitive string representing the event type to listen for.
         * @param {function} fn - callback to call
         * @param {boolean} [capture]
         * @returns {this}
         */
        static on(el, type, fn, capture) {
            if (el instanceof EventTarget && isstring(type) && iscallable(fn)) {
                capture = capture === true;
                events.add(...arguments);
                el.addEventListener(type, fn, capture);
            }
            return this;
        }
        /**
         * Detach an event from a target
         * @param {EventTarget} el - target
         * @param {string} type - A case-sensitive string representing the event type to detach.
         * @param {function} [fn] - callback to detach
         * @param {boolean} [capture]
         * @returns {this}
         */
        static off(el, type, fn, capture) {
            if (el instanceof EventTarget && isstring(type)) {
                let list;
                if ((list = events.find(...arguments))) {
                    events.remove(...arguments);
                    for (let entry of list) {
                        entry.target.removeEventListener(entry.type, entry.fn, entry.capture);
                    }
                }
            }
            return this;
        }
        /**
         * Dispatches an Event at the specified EventTarget
         * @param {EventTarget} el
         * @param {string} type
         * @param {boolean} [bubbles]
         * @param {boolean} [cancelable]
         * @returns {this}
         */
        static trigger(el, type, bubbles, cancelable) {
            if (el instanceof EventTarget && isstring(type)) {
                el.dispatchEvent(this.create(type, bubbles, cancelable));
            }
            return this;
        }

        init(target) {
            if (!target) {
                return listener;
            }
            if (isiterable(target)) {
                target.forEach(function(t) {
                    if (!(t instanceof EventTarget)) {
                        throw new InvalidArgumentException('listener: list of EventTarget provided is not valid.');
                    }
                });
            } else if (!(target instanceof EventTarget)) {
                throw new InvalidArgumentException('listener: EventTarget provided is not valid.');
            }
            this.target = target;
        }

        /**
         * Attach an event
         * @param {string} type - A case-sensitive string representing the event type to listen for.
         * @param {function} fn - callback to call
         * @param {boolean} [capture]
         * @returns {this}
         */
        on(type, fn, capture) {
            if (isiterable(this.target)) {
                this.target.forEach(x => listener.on(x, type, fn, capture));
                return this;
            }
            listener.on(this.target, ...arguments);
            return this;
        }

        /**
         * Detach an event
         * @param {string} type - A case-sensitive string representing the event type to detach.
         * @param {function} [fn] - callback to detach
         * @param {boolean} [capture]
         * @returns {this}
         */
        off(type, fn, capture) {
            if (isiterable(this.target)) {
                this.target.forEach(x => listener.off(x, type, fn, capture));
                return this;
            }
            listener.off(this.target, ...arguments);
            return this;
        }

        /**
         * Dispatches an Event
         * @param {string} type
         * @param {boolean} [bubbles]
         * @param {boolean} [cancelable]
         * @returns {this}
         */
        trigger(type, bubbles, cancelable) {
            if (isiterable(this.target)) {
                this.target.forEach(x => listener.trigger(x, type, bubbles, cancelable));
                return this;
            }
            listener.trigger(this.target, ...arguments);
            return this;
        }

    }

    EventTarget.prototype.extendProperties({
        on(type, fn, capture) {
            listener.on(this, ...arguments);
            return this;
        },
        off(type, fn, capture) {
            listener.off(this, ...arguments);
            return this;
        },
        trigger(type) {
            listener.trigger(this, ...arguments);
            return this;
        }
    });



    return listener;

})();