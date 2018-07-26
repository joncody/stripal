//    Title: gg.js
//    Author: Jon Cody
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function (global) {
    "use strict";

    var ease = Object.freeze({
        linearTween: function (t, b, c, d) {
            return c * t / d + b;
        },
        easeInQuad: function (t, b, c, d) {
            t /= d;
            return c * t * t + b;
        },
        easeOutQuad: function (t, b, c, d) {
            t /= d;
            return -c * t * (t - 2) + b;
        },
        easeInOutQuad: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t + b;
            }
            t -= 1;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) {
            t /= d;
            return c * t * t * t + b;
        },
        easeOutCubic: function (t, b, c, d) {
            t /= d;
            t -= 1;
            return c * (t * t * t + 1) + b;
        },
        easeInOutCubic: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t * t + b;
            }
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t + b;
        },
        easeOutQuart: function (t, b, c, d) {
            t /= d;
            t -= 1;
            return -c * (t * t * t * t - 1) + b;
        },
        easeInOutQuart: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t * t * t + b;
            }
            t -= 2;
            return -c / 2 * (t * t * t * t - 2) + b;
        },
        easeInQuint: function (t, b, c, d) {
            t /= d;
            return c * t * t * t * t * t + b;
        },
        easeOutQuint: function (t, b, c, d) {
            t /= d;
            t -= 1;
            return c * (t * t * t * t * t + 1) + b;
        },
        easeInOutQuint: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            t -= 2;
            return c / 2 * (t * t * t * t * t + 2) + b;
        },
        easeInSine: function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInExpo: function (t, b, c, d) {
            return c * Math.pow(2, 10 * (t / d - 1) ) + b;
        },
        easeOutExpo: function (t, b, c, d) {
            return c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOutExpo: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            }
            t -= 1;
            return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
        },
        easeInCirc: function (t, b, c, d) {
            t /= d;
            return -c * (Math.sqrt(1 - t * t) - 1) + b;
        },
        easeOutCirc: function (t, b, c, d) {
            t /= d;
            t -= 1;
            return c * Math.sqrt(1 - t * t) + b;
        },
        easeInOutCirc: function (t, b, c, d) {
            t /= d / 2;
            if (t < 1) {
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            }
            t -= 2;
            return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
        }
    });
    var ggid = (function () {
        var id = 0;
        var maxint = Math.pow(2, 53) - 1;

        return function () {
            id = id < maxint
                ? id + 1
                : 1;
            return id;
        };
    }());
    var keyboardHandler;
    var keyboardListeners = [];
    var listeners = {};
    var mouseHandler;
    var mouseListeners = [];
    var taglist = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "dd",
        "del",
        "dfn",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hr",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "map",
        "mark",
        "meta",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "p",
        "param",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "sup",
        "table",
        "tbody",
        "td",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video"
    ];

    // FIX
    if (ArrayBuffer.prototype.slice === undefined) {
        ArrayBuffer.prototype.slice = function (start, end) {
            var that = new Uint8Array(this);
            var result;
            var resultarray;
            var i;

            if (end === undefined) {
                end = that.length;
            }
            result = new ArrayBuffer(end - start);
            resultarray = new Uint8Array(result);
            for (i = 0; i < resultarray.length; i += 1) {
                resultarray[i] = that[i + start];
            }
            return result;
        };
    }

    Number.isNaN = Number.isNaN || function (value) {
        return value !== value;
    };

    function typeOf(value) {
        var type = typeof value;

        if (Array.isArray(value)) {
            type = "array";
        } else if (value === null) {
            type = "null";
        }
        return type;
    }

    // IS
    function isArray(array) {
        return typeOf(array) === "array";
    }

    function isBoolean(boolean) {
        return typeOf(boolean) === "boolean";
    }

    function isFunction(func) {
        return typeOf(func) === "function";
    }

    function isNull(nul) {
        return typeOf(nul) === "null";
    }

    function isNumber(number) {
        return typeOf(number) === "number" && !Number.isNaN(number);
    }

    function isObject(object) {
        return typeOf(object) === "object";
    }

    function isString(string) {
        return typeOf(string) === "string";
    }

    function isUndefined(undef) {
        return typeOf(undef) === "undefined";
    }

    // IS - SPECIAL
    function isArrayLike(object) {
        return isObject(object) && !isUndefined(object.length) && Object.keys(object).every(function (key) {
            return key === "length" || isNumber(global.parseInt(key, 10));
        });
    }

    function isBuffer(buffer) {
        return !isUndefined(global.ArrayBuffer) && buffer instanceof ArrayBuffer;
    }

    function isEmpty(object) {
        return isObject(object) && Object.keys(object).length === 0;
    }

    function isGG(object) {
        return isObject(object) && object.gg === true;
    }

    function isNaN(nan, noparse, base) {
        return noparse
            ? Number.isNaN(nan)
            : Number.isNaN(global.parseInt(nan, isNumber(base)
                ? base
                : 10));
    }

    function isNode(node) {
        return isObject(node) && isString(node.nodeName) && isNumber(node.nodeType);
    }

    function isTypedArray(array) {
        var types = [
            "Int8Array",
            "Uint8Array",
            "Uint8ClampedArray",
            "Int16Array",
            "Uint16Array",
            "Int32Array",
            "Uint32Array",
            "Float32Array",
            "Float64Array"
        ];
        var type = Object.prototype.toString.call(array).replace(/\[object\s(\w+)\]/, "$1");

        return types.indexOf(type) > -1;
    }

    // TO
    function toArray(value) {
        var array;

        if (isGG(value)) {
            array = value.length() === 1
                ? [value.raw()]
                : value.raw();
        } else if (isBuffer(value)) {
            array = new Uint8Array(value);
        } else if (isString(value) || isArray(value) || isArrayLike(value) || isTypedArray(value)) {
            array = Array.prototype.slice.call(value);
        } else {
            array = [value];
        }
        return array;
    }

    function toCamelCase(string) {
        return isString(string) && string.replace(/-([a-z])/g, function (a) {
            return a[1].toUpperCase();
        });
    }

    function toCodesFromString(string) {
        var codes = [];

        toArray(string).forEach(function (char) {
            codes.push(char.charCodeAt(0));
        });
        return codes;
    }

    function toFloat(value, digits) {
        var float = global.parseFloat(isString(value)
            ? value.replace(",", "")
            : value);

        return Number.isNaN(float)
            ? 0
            : isNumber(digits)
                ? float.toFixed(digits)
                : float;
    }

    function toHyphenated(string) {
        return isString(string) && string.replace(/([A-Z])/g, function (a) {
            return "-" + a.toLowerCase();
        });
    }

    function toInt(value, base) {
        var int = global.parseInt(isString(value)
            ? value.replace(",", "")
            : value, isNumber(base)
                ? base
                : 10);

        return Number.isNaN(int)
            ? 0
            : int;
    }

    function toUint8(value) {
        var uint8;

        if (isGG(value)) {
            uint8 = new Uint8Array(value.length() === 1
                ? [value.raw()]
                : value.raw());
        } else if (isString(value)) {
            uint8 = new Uint8Array(toCodesFromString(value));
        } else if (isNumber(value) || isArray(value) || isArrayLike(value) || isTypedArray(value) || isBuffer(value)) {
            uint8 = new Uint8Array(value);
        } else {
            uint8 = new Uint8Array([value]);
        }
        return uint8;
    }

    function toBuffer(value) {
        return toUint8(value).buffer;
    }

    function toStringFromCodes(codes) {
        var string = "";

        toArray(codes).forEach(function (char) {
            string += String.fromCharCode(char);
        });
        return string;
    }

    // GET
    function getById(id, object) {
        return document.getElementById(supplant(id, object));
    }

    function getPosition(el) {
        var pos = {
            x: 0,
            y: 0
        };

        if (!isNode(el)) {
            return;
        }
        while (el) {
            if (el.nodeName.toLowerCase() === "body") {
                pos.x += (el.offsetLeft - (el.scrollLeft || document.documentElement.scrollLeft) + el.clientLeft);
                pos.y += (el.offsetTop - (el.scrollTop || document.documentElement.scrollTop) + el.clientTop);
            } else {
                pos.x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                pos.y += (el.offsetTop - el.scrollTop + el.clientTop);
            }
            el = el.offsetParent;
        }
        return pos;
    }

    function getStyle(node, pseudo) {
        return global.getComputedStyle(node, isUndefined(pseudo)
            ? null
            : pseudo);
    }

    // SET
    function setImmediate(fn) {
        if (!isFunction(fn)) {
            return;
        }
        return global.setTimeout(fn, 0);
    }

    // SELECT
    function select(selector, object, node) {
        return isNode(node)
            ? node.querySelector(supplant(selector, object))
            : document.querySelector(supplant(selector, object));
    }

    function selectAll(selector, object, node) {
        return isNode(node)
            ? node.querySelectorAll(supplant(selector, object))
            : document.querySelectorAll(supplant(selector, object));
    }

    // MISC
    function arrSlice(value) {
        return Array.prototype.slice.call(value);
    }

    function betterview(buffer, offset, length) {
        var numbersandbytes = {
            "Int8": 1,
            "Uint8": 1,
            "Int16": 2,
            "Uint16": 2,
            "Int32": 4,
            "Uint32": 4,
            "Float32": 4,
            "Float64": 8
        };
        var better = {};
        var store = {};

        store.buffer = toBuffer(buffer);
        store.view = new DataView(store.buffer, offset || 0, length || store.buffer.byteLength);
        store.offset = 0;

        function checkBounds(offset, len) {
            if (typeof offset !== "number") {
                return console.log("offset is not a number");
            }
            if (offset < 0) {
                return console.log("offset is negative");
            }
            if (typeof len !== "number") {
                return console.log("len is not a number");
            }
            if (len < 0) {
                return console.log("len is negative");
            }
            if (offset + len > store.view.byteLength) {
                return console.log("bounds exceeded");
            }
        }

        function tell() {
            return store.offset;
        }

        function seek(value) {
            checkBounds(value, 0);
            store.offset = value;
            return better;
        }

        function skip(value) {
            checkBounds(store.offset + value, 0);
            store.offset += value;
            return better;
        }

        function slice(start, end) {
            return store.view.buffer.slice(start, end);
        }

        function getBytes(len, offset) {
            offset = offset === undefined
                ? store.offset
                : offset;
            len = len === undefined
                ? store.view.byteLength - offset
                : len;
            checkBounds(offset, len);
            store.offset = offset + len;
            return toUint8(store.view.buffer.slice(offset, offset + len));
        }

        function setBytes(offset, bytes) {
            var convertedbytes = toUint8(bytes);
            var len = convertedbytes.byteLength || convertedbytes.length || 0;

            offset = offset === undefined
                ? store.offset
                : offset;
            checkBounds(offset, len);
            store.offset = offset + len;
            toUint8(store.view.buffer).set(convertedbytes, offset);
            return better;
        }

        function writeBytes(bytes) {
            var convertedbytes = toUint8(bytes);
            var len = convertedbytes.byteLength || convertedbytes.length || 0;

            checkBounds(store.offset, len);
            toUint8(store.view.buffer).set(convertedbytes, store.offset);
            store.offset = store.offset + len;
            return better;
        }

        function getString(len, offset) {
            return toStringFromCodes(getBytes(len, offset));
        }

        function setString(offset, string) {
            return setBytes(offset, toCodesFromString(string));
        }

        function writeString(string) {
            return writeBytes(toCodesFromString(string));
        }

        function getChar(offset) {
            return getString(1, offset);
        }

        function setChar(offset, character) {
            return setString(offset, character);
        }

        function writeChar(character) {
            return writeString(character);
        }

        function getNumber(type, bytes) {
            return function (offset) {
                offset = offset === undefined
                    ? store.offset
                    : offset;
                checkBounds(offset, bytes);
                store.offset = offset + bytes;
                return store.view["get" + type](offset);
            };
        }

        function setNumber(type, bytes) {
            return function (offset, value) {
                offset = offset === undefined
                    ? store.offset
                    : offset;
                checkBounds(offset, bytes);
                store.offset = offset + bytes;
                store.view["set" + type](offset, value);
                return better;
            };
        }

        function writeNumber(type, bytes) {
            return function (value) {
                checkBounds(store.offset, bytes);
                store.view["set" + type](store.offset, value);
                store.offset = store.offset + bytes;
                return better;
            };
        }

        better.betterview = true;
        better.tell = tell;
        better.seek = seek;
        better.skip = skip;
        better.slice = slice;
        better.getBytes = getBytes;
        better.setBytes = setBytes;
        better.writeBytes = writeBytes;
        better.getString = getString;
        better.setString = setString;
        better.writeString = writeString;
        better.getChar = getChar;
        better.setChar = setChar;
        better.writeChar = writeChar;
        Object.keys(numbersandbytes).forEach(function (type) {
            var bytes = numbersandbytes[type];

            better["get" + type] = getNumber(type, bytes);
            better["set" + type] = setNumber(type, bytes);
            better["write" + type] = writeNumber(type, bytes);
        });
        return Object.freeze(better);
    }

    function copy(value) {
        var c;

        if (isObject(value)) {
            c = {};
            Object.keys(value).forEach(function (key) {
                c[key] = copy(value[key]);
            });
        } else if (isArray(value)) {
            c = [];
            value.forEach(function (v) {
                c.push(copy(v));
            });
        } else {
            c = value;
        }
        return c;
    }

    function each(items, func, thisarg) {
        if (!isFunction(func)) {
            return;
        }
        if (isUndefined(thisarg)) {
            thisarg = items;
        }
        if (isGG(items)) {
            items.eachRaw(func);
        } else if (isNode(items)) {
            func.call(thisarg, items, 0, items);
        } else if (isArray(items) || isArrayLike(items) || isTypedArray(items) || isBuffer(items)) {
            toArray(items).forEach(func, thisarg);
        } else if (isObject(items)) {
            Object.keys(items).forEach(function (key) {
                func.call(thisarg, items[key], key, items);
            });
        }
        return thisarg;
    }

    function emitter(object) {
        object = (object && typeof object === "object")
            ? object
            : {};
        object.emitter = true;
        object.events = {};

        object.addListener = function addListener(type, listener) {
            var list = object.events[type];

            if (typeof listener === "function") {
                if (object.events.newListener) {
                    object.emit("newListener", type, typeof listener.listener === "function"
                        ? listener.listener
                        : listener);
                }
                if (!list) {
                    object.events[type] = [listener];
                } else {
                    object.events[type].push(listener);
                }
            }
            return object;
        };
        object.on = object.addListener;

        object.once = function once(type, listener) {
            function onetime() {
                object.removeListener(type, onetime);
                listener.apply(object);
            }
            if (typeof listener === "function") {
                onetime.listener = listener;
                object.on(type, onetime);
            }
            return object;
        };

        object.removeListener = function removeListener(type, listener) {
            var list = object.events[type];
            var position = -1;

            if (typeof listener === "function" && list) {
                list.some(function (value, index) {
                    if (value === listener || (value.listener && value.listener === listener)) {
                        position = index;
                        return true;
                    }
                });
                if (position >= 0) {
                    if (list.length === 1) {
                        delete object.events[type];
                    } else {
                        list.splice(position, 1);
                    }
                    if (object.events.removeListener) {
                        object.emit("removeListener", type, listener);
                    }
                }
            }
            return object;
        };
        object.off = object.removeListener;

        object.removeAllListeners = function removeAllListeners(type) {
            var list;

            if (!object.events.removeListener) {
                if (!type) {
                    object.events = {};
                } else {
                    delete object.events[type];
                }
            } else if (!type) {
                Object.keys(object.events).forEach(function (key) {
                    if (key !== "removeListener") {
                        object.removeAllListeners(key);
                    }
                });
                object.removeAllListeners("removeListener");
                object.events = {};
            } else {
                list = object.events[type];
                list.forEach(function (item) {
                    object.removeListener(type, item);
                });
                delete object.events[type];
            }
            return object;
        };

        object.listeners = function listeners(type) {
            var list = [];

            if (typeof type === "string" && object.events[type]) {
                list = object.events[type];
            } else {
                Object.keys(object.events).forEach(function (key) {
                    list.push(object.events[key]);
                });
            }
            return list;
        };

        object.emit = function emit(type) {
            var list = object.events[type];
            var bool = false;
            var args;

            if (list) {
                args = Array.prototype.slice.call(arguments).slice(1);
                list.forEach(function (value) {
                    value.apply(object, args);
                });
                bool = true;
            }
            return bool;
        };

        return object;
    }

    function equal(one, two) {
        var result = true;

        if (typeOf(one) !== typeOf(two) || (typeOf(one) !== "array" && typeOf(one) !== "object" && one !== two)) {
            result = false;
        } else if (typeOf(one) === "array") {
            one.forEach(function (val) {
                if (two.indexOf(val) === -1) {
                    result = false;
                }
            });
        } else if (typeOf(one) === "object") {
            Object.keys(one).forEach(function (key) {
                if (one[key] !== two[key]) {
                    result = false;
                }
            });
        }
        return result;
    }

    function extend(object, add, overwrite) {
        if (!isObject(object) || !isObject(add)) {
            return object;
        }
        overwrite = isBoolean(overwrite)
            ? overwrite
            : true;
        Object.keys(add).forEach(function (key) {
            if (overwrite || !object.hasOwnProperty(key)) {
                object[key] = copy(add[key]);
            }
        });
        return object;
    }

    function inherits(ctor, superCtor) {
        if (!isFunction(ctor) || !isFunction(superCtor)) {
            return ctor;
        }
        ctor.ggSuper = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumberable: false,
                writable: true,
                configurable: true
            }
        });
        return ctor;
    }

    function inArray(array, value) {
        return isArray(array) && array.indexOf(value) > -1;
    }

    function noop() {
        return;
    }

    function supplant(string, object) {
        function replace(a, b) {
            var value = object[b];

            return !isUndefined(value)
                ? value
                : a;
        }
        return (isString(string) && isObject(object))
            ? string.replace(/\{([^{}]*)\}/g, replace)
            : string;
    }

    function uuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (a) {
            var rand = Math.random() * 16 | 0;
            var value = a === "x"
                ? rand
                : rand & 0x3 | 0x8;

            return value.toString(16);
        });
    }

    // MISC - DOM
    function create(tag) {
        return inArray(taglist, tag)
            ? gg(document.createElement(tag))
            : null;
    }

    function scrollIntoView(el) {
        var relativeTo = document.body;
        var animation;
        var max = relativeTo.scrollHeight - global.innerHeight;
        var current = 0;
        var start = relativeTo.scrollTop;
        var end = relativeTo.scrollTop + getPosition(el).y > max
            ? max
            : relativeTo.scrollTop + getPosition(el).y;
        var framerate = 60 / 1000;
        var duration = 1200;

        function step() {
            var newval;

            if (current >= framerate * duration) {
                return global.cancelAnimationFrame(animation);
            }
            current += 1;
            newval = ease.easeInOutSine(current, start, end - start, framerate * duration);
            relativeTo.scrollTop = newval;
            animation = global.requestAnimationFrame(step);
        }

        animation = global.requestAnimationFrame(step);
    }

    function scrollToTop(el) {
        var animation;
        var current = 0;
        var start = el.scrollTop;
        var end = 0;
        var framerate = 60 / 1000;
        var duration = 1200;

        function step() {
            var newval;

            if (current >= framerate * duration) {
                return global.cancelAnimationFrame(animation);
            }
            current += 1;
            newval = ease.easeInOutSine(current, start, end - start, framerate * duration);
            el.scrollTop = newval;
            animation = global.requestAnimationFrame(step);
        }

        animation = global.requestAnimationFrame(step);
    }

    // GG
    function gg(mselector, object) {
        var gobject = {
            gg: true
        };
        var store = [];

        function closure(func, node, arg) {
            return function (e) {
                return func.call(null, e, gg(node), arg);
            };
        }

        function cloneNodeDeeper(node) {
            var nodeid;
            var cloneid;
            var clone;

            if (isGG(node) && node.length() === 1) {
                node = node.raw();
            }
            if (isNode(node)) {
                nodeid = global.parseInt(node.getAttribute("data-gg-id"), 10);
                clone = node.cloneNode(true);
            }
            if (!isNumber(nodeid) || !listeners.hasOwnProperty(nodeid)) {
                return clone;
            }
            cloneid = ggid();
            clone.setAttribute("data-gg-id", cloneid);
            listeners[cloneid] = {};
            each(listeners[nodeid], function (list, type) {
                listeners[cloneid][type] = {};
                each(list, function (funcarray, funcid) {
                    var func = funcarray[0];
                    var bub = funcarray[2];
                    var arg = funcarray[3];
                    var newFunc = closure(func, clone, arg);

                    listeners[cloneid][type][funcid] = [func, newFunc, bub, arg];
                    clone.addEventListener(type, newFunc, bub);
                });
            });
            return clone;
        }

        if (isGG(mselector)) {
            return mselector;
        }

        if (isString(mselector)) {
            mselector = selectAll(mselector, object);
        }

        each(mselector, function (node) {
            if (isNode(node) && node.nodeType < 9) {
                store.push(node);
            }
        });

        gobject.add = function (nodes) {
            each(nodes, function (node) {
                if (isNode(node) && node.nodeType < 9) {
                    store.push(node);
                }
            });
            return gobject;
        };

        gobject.addClass = function (string) {
            if (!isString(string)) {
                return gobject;
            }
            each(store, function (node) {
                string.split(/\s/g).forEach(function (substring) {
                    var match = new RegExp("(?:^|\\s)" + substring + "(?:$|\\s)", "g");

                    if (!isObject(node.className)) {
                        node.className = match.test(node.className)
                            ? node.className
                            : node.className
                                ? node.className + " " + substring
                                : substring;
                    } else {
                        node.classList.add(substring);
                    }
                });
            });
            return gobject;
        };

        gobject.after = function (item) {
            var willcopy = store.length > 1;

            each(store, function (node) {
                each(item, function (sibling) {
                    if (!isNode(sibling)) {
                        return;
                    }
                    node.parentNode.insertBefore(willcopy
                        ? cloneNodeDeeper(sibling)
                        : sibling, node.nextSibling);
                });
            });
            return gobject;
        };

        gobject.append = function (item) {
            var willcopy = store.length > 1;

            each(store, function (node) {
                each(item, function (child) {
                    if (!isNode(child)) {
                        return;
                    }
                    node.appendChild(willcopy
                        ? cloneNodeDeeper(child)
                        : child);
                });
            });
            return gobject;
        };

        gobject.appendTo = function (item) {
            var willcopy = toArray(item).length > 1;

            each(store, function (node) {
                each(item, function (parent) {
                    if (!isNode(parent)) {
                        return;
                    }
                    parent.appendChild(willcopy
                        ? cloneNodeDeeper(node)
                        : node);
                });
            });
            return gobject;
        };

        gobject.attr = function (name, value) {
            var attrname = isString(name) && toCamelCase(name);
            var values;

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.attr(key, value);
                });
            } else if (isArray(name)) {
                values = {};
                name.forEach(function (key) {
                    values[key] = gobject.attr(key);
                });
                return values;
            } else if (isUndefined(value) && attrname) {
                values = [];
                each(store, function (node) {
                    values.push(node[attrname]);
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (attrname) {
                each(store, function (node) {
                    node[attrname] = value;
                });
            }
            return gobject;
        };

        gobject.before = function (item) {
            var willcopy = store.length > 1;

            each(store, function (node) {
                each(item, function (sibling) {
                    if (!isNode(sibling)) {
                        return;
                    }
                    node.parentNode.insertBefore(willcopy
                        ? cloneNodeDeeper(sibling)
                        : sibling, node);
                });
            });
            return gobject;
        };

        gobject.children = function () {
            var nodes = [];

            each(store, function (node) {
                nodes = nodes.concat(toArray(node.childNodes));
            });
            return gg(nodes);
        };

        gobject.classes = function (string) {
            var values = [];

            if (isUndefined(string)) {
                each(store, function (node) {
                    values.push(node.className);
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (isString(string)) {
                each(store, function (node) {
                    node.className = string.trim();
                });
            }
            return gobject;
        };

        gobject.clone = function (deep, deeper) {
            var nodes = [];

            deep = isBoolean(deep)
                ? deep
                : false;
            deeper = isBoolean(deeper)
                ? deeper
                : false;
            each(store, function (node) {
                nodes.push(deeper
                    ? cloneNodeDeeper(node)
                    : node.cloneNode(deep));
            });
            return gg(nodes);
        };

        gobject.create = function (tag) {
            return inArray(taglist, tag)
                ? gg(document.createElement(tag)).appendTo(gobject)
                : gobject;
        };

        gobject.data = function (name, value) {
            var dataname = isString(name) && (name.length < 4 || name.slice(0, 4) !== "data")
                ? toHyphenated("data-" + name)
                : toHyphenated(name);
            var values;

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.data(key, value);
                });
            } else if (isArray(name)) {
                values = {};
                name.forEach(function (key) {
                    values[key] = gobject.data(key);
                });
                return values;
            } else if (isUndefined(value) && dataname) {
                values = [];
                each(store, function (node) {
                    values.push(node.getAttribute(dataname));
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (dataname) {
                each(store, function (node) {
                    node.setAttribute(dataname, value);
                });
            }
            return gobject;
        };

        gobject.each = function (func) {
            store.forEach(function (node, index, thisarg) {
                func.call(thisarg, gg(node), index, thisarg);
            }, gobject);
            return gobject;
        };

        gobject.eachRaw = function (func) {
            store.forEach(func, gobject);
            return gobject;
        };

        gobject.get = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                return gg(store[index]);
            }
            return gobject;
        };

        gobject.hasClass = function (string) {
            var values = [];

            if (!isString(string)) {
                return false;
            }
            each(store, function (node) {
                values.push(string.split(/\s/g).every(function (substring) {
                    var match = new RegExp("(?:^|\\s)" + substring + "(?:$|\\s)", "g");

                    if (!isObject(node.className)) {
                        return match.test(node.className);
                    } else {
                        return node.classList.contains(substring);
                    }
                }));
            });
            return values.length === 0
                ? null
                : values.length === 1
                    ? values[0]
                    : values;
        };

        gobject.html = function (string) {
            var values = [];

            if (isUndefined(string)) {
                each(store, function (node) {
                    values.push(node.innerHTML);
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (isString(string) || isNumber(string)) {
                each(store, function (node) {
                    node.innerHTML = string;
                });
            }
            return gobject;
        };

        gobject.insert = (function () {
            var positions = ["beforebegin", "afterbegin", "beforeend", "afterend"];

            return function (pos, item) {
                if (!isString(item)) {
                    return gobject;
                }
                if (!inArray(positions, pos)) {
                    pos = "beforeend";
                }
                each(store, function (node) {
                    node.insertAdjacentHTML(pos, item);
                });
                return gobject;
            };
        }());

        gobject.length = function () {
            return store.length;
        };

        gobject.off = function (type, func, bub) {
            if (!isString(type)) {
                return gobject;
            }
            bub = isBoolean(bub)
                ? bub
                : false;
            each(store, function (node) {
                var nodeid = global.parseInt(node.getAttribute("data-gg-id"), 10);
                var funcid = isFunction(func) && func.ggid;

                if (!isNumber(nodeid) || !listeners.hasOwnProperty(nodeid) || !listeners[nodeid].hasOwnProperty(type)) {
                    return gobject;
                }
                if (isUndefined(func)) {
                    each(listeners[nodeid][type], function (funcarray, funcid, list) {
                        node.removeEventListener(type, funcarray[1], bub);
                    });
                    delete listeners[nodeid][type];
                } else if (isNumber(funcid) && listeners[nodeid][type].hasOwnProperty(funcid)) {
                    node.removeEventListener(type, listeners[nodeid][type][funcid][1], bub);
                    delete listeners[nodeid][type][funcid];
                }
            });
            return gobject;
        };

        gobject.on = function (type, func, bub, arg) {
            var funcid;
            var newFunc;

            if (!isString(type) || !isFunction(func)) {
                return gobject;
            }
            bub = isBoolean(bub)
                ? bub
                : false;
            funcid = isNumber(func.ggid)
                ? func.ggid
                : ggid();
            func.ggid = funcid;
            each(store, function (node) {
                var nodeid = !isNumber(global.parseInt(node.getAttribute("data-gg-id"), 10))
                    ? ggid()
                    : global.parseInt(node.getAttribute("data-gg-id"), 10);

                node.setAttribute("data-gg-id", nodeid);
                if (!listeners.hasOwnProperty(nodeid)) {
                    listeners[nodeid] = {};
                }
                if (!listeners[nodeid].hasOwnProperty(type)) {
                    listeners[nodeid][type] = {};
                }
                if (listeners[nodeid][type].hasOwnProperty(funcid)) {
                    node.removeEventListener(type, listeners[nodeid][type][funcid][1], bub);
                }
                newFunc = closure(func, node, arg);
                listeners[nodeid][type][funcid] = [func, newFunc, bub, arg];
                node.addEventListener(type, newFunc, bub);
            });
            return gobject;
        };

        gobject.once = function (type, func, bub, arg) {
            function handler(node, arg) {
                return function onetime(e) {
                    func.call(null, e, gg(node), arg);
                    node.removeEventListener(type, onetime, bub);
                };
            }
            if (!isString(type) || !isFunction(func)) {
                return gobject;
            }
            bub = isBoolean(bub)
                ? bub
                : false;
            each(store, function (node) {
                node.addEventListener(type, handler(node, arg), bub);
            });
            return gobject;
        };

        gobject.parents = function () {
            var nodes = [];

            each(store, function (node) {
                nodes.push(node.parentNode);
            });
            return gg(nodes);
        };

        gobject.prepend = function (item) {
            var willcopy = store.length > 1;

            each(store, function (node) {
                each(item, function (child) {
                    if (!isNode(child)) {
                        return;
                    }
                    node.insertBefore(willcopy
                        ? cloneNodeDeeper(child)
                        : child, node.firstChild);
                });
            });
            return gobject;
        };

        gobject.prependTo = function (item) {
            var willcopy = toArray(item).length > 1;

            each(store, function (node) {
                each(item, function (parent) {
                    if (!isNode(parent)) {
                        return;
                    }
                    parent.insertBefore(willcopy
                        ? cloneNodeDeeper(node)
                        : node, parent.firstChild);
                });
            });
            return gobject;
        };

        gobject.prop = function (name, value) {
            var propname = isString(name) && toCamelCase(name);
            var values;

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.prop(key, value);
                });
            } else if (isArray(name)) {
                values = {};
                name.forEach(function (key) {
                    values[key] = gobject.prop(key);
                });
                return values;
            } else if (isUndefined(value) && propname) {
                values = [];
                each(store, function (node) {
                    values.push(node.style[propname] || global.getComputedStyle(node, null).getPropertyValue(propname));
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (propname) {
                each(store, function (node) {
                    node.style[propname] = value;
                });
            }
            return gobject;
        };
        gobject.css = gobject.prop;
        gobject.style = gobject.prop;

        gobject.raw = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                return store[index];
            }
            return store.length === 1
                ? store[0]
                : store;
        };

        gobject.remove = function (item) {
            if (isUndefined(item)) {
                each(store, function (node) {
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                });
            } else {
                each(store, function (node) {
                    each(item, function (child) {
                        if (!isNode(child) || !node.contains(child)) {
                            return;
                        }
                        if (child.parentNode) {
                            node.removeChild(child);
                        }
                    });
                });
            }
            return gobject;
        };

        gobject.remAttr = function (name) {
            var attrname = isString(name) && toCamelCase(name);

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.remAttr(key);
                });
            } else if (isArray(name)) {
                name.forEach(function (key) {
                    gobject.remAttr(key);
                });
            } else if (attrname) {
                each(store, function (node) {
                    node.removeAttribute(attrname);
                });
            }
            return gobject;
        };

        gobject.remClass = function (string) {
            if (!isString(string)) {
                return gobject;
            }
            each(store, function (node) {
                string.split(/\s/).forEach(function (substring) {
                    var match = new RegExp("(?:^|\\s)" + substring + "(?:$|\\s)", "g");

                    if (!isObject(node.className)) {
                        node.className = node.className.replace(match, " ").trim();
                    } else {
                        node.classList.remove(substring);
                    }
                });
            });
            return gobject;
        };

        gobject.remData = function (name) {
            var dataname = isString(name) && (name.length < 4 || name.slice(0, 4) !== "data")
                ? toHyphenated("data-" + name)
                : toHyphenated(name);

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.remData(key);
                });
            } else if (isArray(name)) {
                name.forEach(function (key) {
                    gobject.remData(key);
                });
            } else if (dataname) {
                each(store, function (node) {
                    node.removeAttribute(dataname);
                });
            }
            return gobject;
        };

        gobject.remHtml = function () {
            each(store, function (node) {
                node.innerHTML = "";
            });
            return gobject;
        };

        gobject.remProp = function (name) {
            var propname = isString(name) && toCamelCase(name);

            if (isObject(name)) {
                each(name, function (value, key) {
                    gobject.remProp(key);
                });
            } else if (isArray(name)) {
                name.forEach(function (key) {
                    gobject.remProp(key);
                });
            } else if (propname) {
                each(store, function (node) {
                    node.style.removeProperty(propname);
                });
            }
            return gobject;
        };
        gobject.remCss = gobject.remProp;
        gobject.remStyle = gobject.remProp;

        gobject.remText = function remText() {
            each(store, function (node) {
                node.textContent = "";
            });
            return gobject;
        };

        gobject.select = function (selector, object) {
            var nodes = [];

            each(store, function (node) {
                nodes = nodes.concat(toArray(select(selector, object, node)));
            });
            return gg(nodes);
        };

        gobject.selectAll = function (selector, object) {
            var nodes = [];

            each(store, function (node) {
                nodes = nodes.concat(toArray(selectAll(selector, object, node)));
            });
            return gg(nodes);
        };

        gobject.subtract = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                store.splice(index, 1);
            }
            return gobject;
        };

        gobject.text = function (string) {
            var values = [];

            if (isUndefined(string)) {
                each(store, function (node) {
                    values.push(node.textContent);
                });
                return values.length === 0
                    ? null
                    : values.length === 1
                        ? values[0]
                        : values;
            } else if (isString(string) || isNumber(string)) {
                each(store, function (node) {
                    node.textContent = string;
                });
            }
            return gobject;
        };

        gobject.togClass = function (string) {
            if (!isString(string)) {
                return gobject;
            }
            each(store, function (node) {
                string.split(/\s/).forEach(function (substring) {
                    var match = new RegExp("(?:^|\\s)" + substring + "(?:$|\\s)", "g");

                    if (!isObject(node.className)) {
                        node.className = match.test(node.className)
                            ? node.className.replace(match, " ").trim()
                            : node.className
                                ? node.className + " " + substring
                                : substring;
                    } else {
                        node.classList.toggle(substring);
                    }
                });
            });
            return gobject;
        };

        return Object.freeze(gobject);
    }

    // UI
    keyboardHandler = (function () {
        function keyDown(options, handlers) {
            return function (e) {
                var keycode = e.keyCode;

                if (options.preventDefault) {
                    e.preventDefault();
                }
                if (isNumber(keycode) && handlers.hasOwnProperty(keycode)) {
                    handlers[keycode](e);
                }
            };
        }
        return function (options) {
            var handlers = {};
            var listener;

            options = extend({}, options);
            each(options, function (handler, key) {
                var keycode = global.parseInt(key, 10);

                if (isFunction(handler) && isNumber(keycode)) {
                    handlers[keycode] = handler;
                }
            });
            listener = keyDown(options, handlers);
            keyboardListeners.push(listener);
            gg(document.body).on("keydown", listener, false);
        };
    }());

    mouseHandler = (function () {
        function mouseDown(options, handlers) {
            return function (e) {
                var keycode = e.button;

                if (options.preventDefault) {
                    e.preventDefault();
                }
                if (isNumber(keycode) && handlers.hasOwnProperty(keycode)) {
                    handlers[keycode](e);
                }
            };
        }
        return function (options) {
            var handlers = {};
            var listener;

            options = extend({}, options);
            each(options, function (handler, key) {
                var keycode = global.parseInt(key, 10);

                if (isFunction(handler) && isNumber(keycode)) {
                    handlers[keycode] = handler;
                }
            });
            listener = mouseDown(options, handlers);
            mouseListeners.push(listener);
            gg(document.body).on("mousedown", listener, false);
        };
    }());

    function removeKeyboardHandlers() {
        keyboardListeners.forEach(function (listener) {
            gg(document.body).off("keydown", listener);
        });
    }

    function removeMouseHandlers() {
        mouseListeners.forEach(function (listener) {
            gg(document.body).off("mousedown", listener);
        });
    }

    gg.typeOf = typeOf;
    gg.isArray = isArray;
    gg.isBoolean = isBoolean;
    gg.isFunction = isFunction;
    gg.isNull = isNull;
    gg.isNumber = isNumber;
    gg.isObject = isObject;
    gg.isString = isString;
    gg.isUndefined = isUndefined;
    gg.isArrayLike = isArrayLike;
    gg.isBuffer = isBuffer;
    gg.isEmpty = isEmpty;
    gg.isGG = isGG;
    gg.isNaN = isNaN;
    gg.isNode = isNode;
    gg.isTypedArray = isTypedArray;
    gg.toArray = toArray;
    gg.toCamelCase = toCamelCase;
    gg.toCodesFromString = toCodesFromString;
    gg.toFloat = toFloat;
    gg.toHyphenated = toHyphenated;
    gg.toInt = toInt;
    gg.toUint8 = toUint8;
    gg.toBuffer = toBuffer;
    gg.toStringFromCodes = toStringFromCodes;
    gg.getById = getById;
    gg.getPosition = getPosition;
    gg.getStyle = getStyle;
    gg.setImmediate = setImmediate;
    gg.select = select;
    gg.selectAll = selectAll;
    gg.arrSlice = arrSlice;
    gg.betterview = betterview;
    gg.copy = copy;
    gg.each = each;
    gg.ease = ease;
    gg.emitter = emitter;
    gg.equal = equal;
    gg.extend = extend;
    gg.inherits = inherits;
    gg.inArray = inArray;
    gg.noop = noop;
    gg.supplant = supplant;
    gg.uuid = uuid;
    gg.create = create;
    gg.scrollIntoView = scrollIntoView;
    gg.scrollToTop = scrollToTop;
    gg.keyboardHandler = keyboardHandler;
    gg.mouseHandler = mouseHandler;
    gg.removeKeyboardHandlers = removeKeyboardHandlers;
    gg.removeMouseHandlers = removeMouseHandlers;

    global.gg = Object.freeze(gg);

}(window || this));

//    Title: stripal.js
//    Author: Jon Cody
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

(function (global) {
    "use strict";

    var stripal = gg.emitter();
    var cart = {
        loaded: false,
        id: 0,
        stripeKey: "",
        paypalKey: "",
        currency: "USD",
        tax: 7.75,
        discountflat: 0,
        items: {}
    };
    var nextid = (function () {
        var maxint = Math.pow(2, 53) - 1;

        return function () {
            cart.id = cart.id < maxint
                ? cart.id + 1
                : 1;
            return cart.id;
        };
    }());

    stripal.each = function (fn) {
        gg.each(cart.items, fn);
    };

    stripal.get = function (id) {
        return cart.items[id];
    };

    stripal.length = function () {
        return Object.keys(cart.items).length;
    };

    stripal.quantity = function () {
        var quantity = 0;

        stripal.each(function (item) {
            quantity += item.quantity();
        });
        return quantity;
    };

    stripal.find = (function () {
        var operators = ["<=", ">=", "!=", "<", ">"];

        return function (properties) {
            var items = [];

            stripal.each(function (item) {
                var o = item.object();
                var match = true;

                if (!gg.isObject(properties) || gg.isEmpty(properties)) {
                    items.push(item);
                    return;
                }

                gg.each(properties, function (value, property) {
                    var operation = false;
                    var x;

                    if (gg.isString(value)) {
                        operators.some(function (operator) {
                            if (value.indexOf(operator) === 0) {
                                operation = operator;
                                value = gg.toInt(value.slice(operator.length));
                                return true;
                            }
                            return false;
                        });
                    }
                    switch (operation) {
                    case "<=":
                        if (o[property] > value) {
                            match = false;
                        }
                        break;
                    case ">=":
                        if (o[property] < value) {
                            match = false;
                        }
                        break;
                    case "!=":
                        if (o[property] === value) {
                            match = false;
                        }
                        break;
                    case "<":
                        if (o[property] >= value) {
                            match = false;
                        }
                        break;
                    case ">":
                        if (o[property] <= value) {
                            match = false;
                        }
                        break;
                    default:
                        if ((value instanceof RegExp) && !value.test(o[property])) {
                            match = false;
                        } else if (o[property] !== value) {
                            match = false;
                        }
                        break;
                    }
                });
                if (match === true) {
                    items.push(item);
                }
            });
            return items;
        };
    }());

    stripal.items = function () {
        return cart.items;
    };

    stripal.save = function () {
        return;
    };

    stripal.loaded = function () {
        return cart.loaded;
    };

    stripal.empty = function () {
        stripal.each(function (item) {
            item.quiet(true);
            item.remove();
        });
        stripal.emit("empty");
    };

    stripal.stripeKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.stripeKey = key;
            stripal.save();
            stripal.emit("update", "stripeKey", cart.stripeKey);
        }
        return cart.stripeKey;
    };

    stripal.paypalKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.paypalKey = key;
            stripal.save();
            stripal.emit("update", "paypalKey", cart.paypalKey);
        }
        return cart.paypalKey;
    };

    stripal.currency = function (currency) {
        if (gg.isString(currency) && currency !== "") {
            cart.currency = currency.toUpperCase();
            stripal.save();
            stripal.emit("update", "currency", cart.currency);
        }
        return cart.currency;
    };

    stripal.tax = function (tax) {
        if (!gg.isNaN(tax)) {
            cart.tax = gg.toFloat(tax);
            stripal.save();
            stripal.emit("update", "tax", cart.tax);
        }
        return cart.tax;
    };

    stripal.discountflat = function (discountflat) {
        if (!gg.isNaN(discountflat) && gg.toInt(discountflat) >= 0) {
            cart.discountflat = gg.toInt(discountflat);
            stripal.save();
            stripal.emit("update", "discountflat", cart.discountflat);
        }
        return cart.discountflat;
    };

    stripal.subtotal = function () {
        var subtotal = 0;

        stripal.each(function (item) {
            subtotal += item.total();
        });
        return Math.ceil(subtotal - cart.discountflat);
    };

    stripal.total = function () {
        var subtotal = stripal.subtotal();
        var taxpercent = cart.tax / 100;

        return Math.ceil(subtotal + (subtotal * taxpercent));
    };

    stripal.newItem = (function () {
        var restricted = [
            "stripal_item",
            "id",
            "quiet",
            "name",
            "currency",
            "price",
            "minimum",
            "quantity",
            "step",
            "add",
            "addflat",
            "discount",
            "discountflat"
        ];

        function stripMethods(value) {
            var i;

            if (gg.isObject(value)) {
                gg.each(value, function (v, k) {
                    if (gg.isFunction(v)) {
                        delete value[k];
                    } else if (gg.isObject(v) || gg.isArray(v)) {
                        stripMethods(v);
                    }
                });
            } else if (gg.isArray(value)) {
                i = value.length - 1;
                while (i >= 0) {
                    if (gg.isFunction(value[i])) {
                        value.splice(i, 1);
                    } else if (gg.isObject(value[i]) || gg.isArray(value[i])) {
                        stripMethods(value[i]);
                    }
                    i -= 1;
                }
            }
        }

        function sanityCheck(store) {
            var props = [
                "price",
                "minimum",
                "quantity",
                "step",
                "add",
                "addflat",
                "discount",
                "discountflat"
            ];

            props.forEach(function (prop) {
                var int = gg.toInt(store[prop]);

                if (prop === "minimum" || prop === "quantity" || prop === "step"
                        ? int < 1
                        : int <= 0) {
                    store[prop] = prop === "minimum" || prop === "quantity" || prop === "step"
                        ? (prop === "quantity"
                            ? store.minimum
                            : 1)
                        : 0;
                }
            });
        }

        return function (opts) {
            var item;
            var store = {
                currency: cart.currency,
                quiet: false
            };

            opts = gg.extend({}, opts);
            stripMethods(opts);
            store = gg.extend(store, opts, true);
            sanityCheck(store);
            store.id = nextid();
            item = gg.emitter({
                stripal_item: true,
                id: store.id,
                save: function () {
                    if (cart.items.hasOwnProperty(store.id)) {
                        stripal.save();
                    }
                },
                quiet: function (quiet) {
                    if (gg.isBoolean(quiet)) {
                        store.quiet = quiet;
                        item.save();
                        item.emit("update", "quiet", store.quiet);
                    }
                    return store.quiet;
                },
                name: function (name) {
                    if (gg.isString(name) && name !== "") {
                        store.name = name;
                        item.save();
                        item.emit("update", "name", store.name);
                    }
                    return store.name;
                },
                currency: function (currency) {
                    if (gg.isString(currency) && currency !== "") {
                        store.currency = currency.toUpperCase();
                        item.save();
                        item.emit("update", "currency", store.currency);
                    }
                    return store.currency;
                },
                price: function (price) {
                    if (!gg.isNaN(price) && gg.toInt(price) >= 0) {
                        store.price = gg.toInt(price);
                        item.save();
                        item.emit("update", "price", store.price);
                    }
                    return store.price;
                },
                minimum: function (minimum) {
                    if (!gg.isNaN(minimum) && gg.toInt(minimum) >= 1) {
                        store.minimum = gg.toInt(minimum);
                        item.save();
                        item.emit("update", "minimum", store.minimum);
                    }
                    return store.minimum;
                },
                quantity: function (quantity) {
                    if (!gg.isNaN(quantity) && gg.toInt(quantity) >= store.minimum) {
                        store.quantity = gg.toInt(quantity);
                        item.save();
                        item.emit("update", "quantity", store.quantity);
                    }
                    return store.quantity;
                },
                step: function (step) {
                    if (!gg.isNaN(step) && gg.toInt(step) >= 1) {
                        store.step = gg.toInt(step);
                        item.save();
                        item.emit("update", "step", store.step);
                    }
                    return store.step;
                },
                add: function (add) {
                    if (!gg.isNaN(add) && gg.toInt(add) >= 0) {
                        store.add = gg.toInt(add);
                        item.save();
                        item.emit("update", "add", store.add);
                    }
                    return store.add;
                },
                addflat: function (addflat) {
                    if (!gg.isNaN(addflat) && gg.toInt(addflat) >= 0) {
                        store.addflat = gg.toInt(addflat);
                        item.save();
                        item.emit("update", "addflat", store.addflat);
                    }
                    return store.addflat;
                },
                discount: function (discount) {
                    if (!gg.isNaN(discount) && gg.toInt(discount) >= 0) {
                        store.discount = gg.toInt(discount);
                        item.save();
                        item.emit("update", "discount", store.discount);
                    }
                    return store.discount;
                },
                discountflat: function (discountflat) {
                    if (!gg.isNaN(discountflat) && gg.toInt(discountflat) >= 0) {
                        store.discountflat = gg.toInt(discountflat);
                        item.save();
                        item.emit("update", "discountflat", store.discountflat);
                    }
                    return store.discountflat;
                },
                increment: function (inc) {
                    if (gg.isNaN(inc)) {
                        store.quantity = store.quantity + store.step < store.minimum
                            ? store.minimum
                            : store.quantity + store.step;
                    } else if (gg.toInt(inc) >= 0) {
                        store.quantity = store.quantity + gg.toInt(inc) < store.minimum
                            ? store.minimum
                            : store.quantity + gg.toInt(inc);
                    }
                    item.save();
                    item.emit("update", "quantity", store.quantity);
                    return store.quantity;
                },
                decrement: function (dec) {
                    if (gg.isNaN(dec)) {
                        store.quantity = store.quantity - store.step < store.minimum
                            ? store.minimum
                            : store.quantity - store.step;
                    } else if (gg.toInt(dec) >= 0) {
                        store.quantity = store.quantity - gg.toInt(dec) < store.minimum
                            ? store.minimum
                            : store.quantity - gg.toInt(dec);
                    }
                    item.save();
                    item.emit("update", "quantity", store.quantity);
                    return store.quantity;
                },
                total: function () {
                    var orders = store.quantity / store.step;
                    var addtotal = (store.add * orders) + store.addflat;
                    var discounttotal = (store.discount * orders) + store.discountflat;

                    return gg.toInt(store.quantity * store.price + addtotal - discounttotal);
                },
                cart: function () {
                    if (!cart.items.hasOwnProperty(store.id)) {
                        cart.items[store.id] = item;
                        stripal.save();
                        item.emit("cart");
                    }
                },
                remove: function () {
                    if (cart.items.hasOwnProperty(store.id)) {
                        delete cart.items[store.id];
                        stripal.save();
                        item.emit("remove");
                    }
                },
                set: function (key, value) {
                    var k = gg.isString(key) && key.trim();

                    if (!gg.isString(k) || k === "" || gg.inArray(restricted, k) || gg.isFunction(value)) {
                        return;
                    }
                    stripMethods(value);
                    store[k] = value;
                    item.save();
                    item.emit("update", k, value);
                },
                get: function (key) {
                    var k = gg.isString(key) && key.trim();

                    if (!gg.isString(k) || k === "" || gg.inArray(restricted, k) || !store.hasOwnProperty(k)) {
                        return;
                    }
                    return store[k];
                },
                del: function (key) {
                    var k = gg.isString(key) && key.trim();

                    if (!gg.isString(k) || k === "" || gg.inArray(restricted, k) || !store.hasOwnProperty(k)) {
                        return;
                    }
                    delete store[k];
                    item.save();
                    item.emit("update", k);
                },
                object: function (added) {
                    var o = gg.copy(store);

                    if (added === true) {
                        restricted.forEach(function (key) {
                            if (o.hasOwnProperty(key)) {
                                delete o[key];
                            }
                        });
                    } else {
                        o.total = item.total();
                    }
                    return o;
                }
            });
            item.emit = (function () {
                var oldemit = item.emit;

                return function () {
                    var args = gg.toArray(arguments);

                    if (!store.quiet) {
                        oldemit.apply(item, args);
                        args[0] = "item-" + args[0];
                        args.splice(1, 0, item);
                        stripal.emit.apply(stripal, args);
                    }
                };
            }());
            return Object.freeze(item);
        };
    }());

    stripal.load = (function () {
        var indexedDB = global.indexedDB || global.mozIndexedDB || global.webkitIndexedDB || global.msIndexedDB;
        var dbrequest;

        function dbNotSupported() {
            console.log("indexedDB was not found and/or supported!");
        }

        if (!indexedDB) {
            return dbNotSupported;
        }

        function dbError(e) {
            console.log(e.target.errorCode);
        }

        function dbSuccess(e) {
            var db = e.target.result;

            db.onerror = dbError;
            db.transaction(["cart"], "readonly").objectStore("cart").get("default").onsuccess = function (e) {
                var data = e.target.result;

                function cartItems() {
                    gg.each(data.items, function (item) {
                        stripal.newItem(item).cart();
                    });
                    cart.loaded = true;
                    stripal.emit("load");
                }

                if (data) {
                    cart.stripeKey = data.stripeKey || cart.stripeKey;
                    cart.paypalKey = data.paypalKey || cart.paypalKey;
                    cart.currency = data.currency || cart.currency;
                    cart.tax = data.tax || cart.tax;
                    cart.discountflat = data.discountflat || cart.discountflat;
                } else {
                    data = { items: [] };
                }
                if (document.readyState === "complete") {
                    cartItems();
                } else {
                    global.addEventListener("load", cartItems, false);
                }
            };
        }

        function dbUpgrade(e) {
            var db = e.target.result;
            var objectStore;

            db.onerror = dbError;
            objectStore = db.createObjectStore("cart");
            objectStore.createIndex("stripeKey", "stripeKey", { unique: false });
            objectStore.createIndex("paypalKey", "paypalKey", { unique: false });
            objectStore.createIndex("currency", "currency", { unique: false });
            objectStore.createIndex("tax", "tax", { unique: false });
            objectStore.createIndex("discountflat", "discountflat", { unique: false });
            objectStore.createIndex("items", "items", { unique: false });
        }

        function dbUpdate() {
            var db = dbrequest && dbrequest.result;
            var data = {
                stripeKey: cart.stripeKey,
                paypalKey: cart.paypalKey,
                currency: cart.currency,
                tax: cart.tax,
                discountflat: cart.discountflat,
                items: {}
            };

            stripal.each(function (item) {
                data.items[item.id] = item.object();
            });
            if (db) {
                db.transaction(["cart"], "readwrite").objectStore("cart").put(data, "default");
            }
        }

        stripal.save = dbUpdate;

        return function (dbname) {
            if (cart.loaded) {
                return;
            }
            dbrequest = indexedDB.open(dbname);
            dbrequest.onerror = dbError;
            dbrequest.onsuccess = dbSuccess;
            dbrequest.onupgradeneeded = dbUpgrade;
        };
    }());

    stripal.checkout = (function () {
        function stripeCheckout(opts) {
            var button = gg.create("div").attr("id", "stripe-button");
            var script = gg.create("script").attr("id", "stripe-checkout-script").attr("type", "application/javascript").attr("src", "https://checkout.stripe.com/checkout.js");
            var config = gg.extend({
                key: cart.stripeKey,
                token: function (token, args) {
                    stripal.emit("stripe-checkout-end", token, args);
                },
                image: "https://stripe.com/img/documentation/checkout/marketplace.png",
                name: "Stripal",
                description: "Stripal Checkout!",
                amount: stripal.total(),
                locale: "auto",
                zipCode: true,
                billingAddress: true,
                currency: cart.currency,
                panelLabel: "Pay",
                shippingAddress: true,
                email: "",
                allowRememberMe: false,
                opened: gg.noop,
                closed: gg.noop
            }, opts, true);

            function init() {
                var handler = StripeCheckout.configure(config);

                function openHandler(e) {
                    e.preventDefault();
                    handler.open();
                    stripal.emit("stripe-checkout-start");
                }

                function closeHandler() {
                    handler.close();
                }

                button.on("click", openHandler, false);
                global.addEventListener("popstate", closeHandler, false);
            }

            if (!gg.getbyid("stripe-checkout-script")) {
                script.on("load", init);
                script.appendTo(document.body);
            } else {
                init();
            }
            return button;
        }

        function paypalCheckout(opts) {
            var button = gg.create("div").attr("id", "paypal-button");
            var script = gg.create("script").attr("id", "paypal-checkout-script").data("version-4", "").attr("type", "application/javascript").attr("src", "https://www.paypalobjects.com/api/checkout.js");
            var config = gg.extend({
                env: "production",
                locale: "en_US",
                client: {
                    sandbox: "",
                    production: cart.paypalKey
                },
                commit: true,
                style: {
                    color: "black",
                    shape: "rect",
                    size: "responsive",
                    label: "paypal"
                },
                payment: function (data, actions) {
                    var p = {
                        payment: {
                            transactions: [{
                                amount: {
                                    total: gg.toFloat(stripal.total() / 100, 2),
                                    currency: cart.currency,
                                    details: {
                                        subtotal: gg.toFloat(stripal.subtotal() / 100, 2),
                                        tax: gg.toFloat(Math.ceil(stripal.subtotal() * (stripal.tax() / 100)) / 100, 2),
                                        shipping: "0.00"
                                    }
                                },
                                item_list: {
                                    items: []
                                }
                            }]
                        }
                    };
                    var pitems = p.payment.transactions[0].item_list.items;

                    stripal.each(function (item) {
                        var o = item.object();

                        pitems.push({
                            name: o.name,
                            description: o.description || o.paypal_description || "",
                            quantity: o.quantity,
                            price: gg.toFloat(o.price / 100, 2),
                            currency: o.currency
                        });
                        if (o.add > 0) {
                            pitems.push({
                                name: o.name + " - Add",
                                description: o.description || o.paypal_description || "",
                                quantity: o.quantity / o.step,
                                price: gg.toFloat(o.add / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.addflat > 0) {
                            pitems.push({
                                name: o.name + " - Add Flat",
                                description: o.description || o.paypal_description || "",
                                quantity: 1,
                                price: gg.toFloat(o.addflat / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.discount > 0) {
                            pitems.push({
                                name: o.name + " - Discount",
                                description: o.description || o.paypal_description || "",
                                quantity: o.quantity / o.step,
                                price: gg.toFloat(-1 * o.discount / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.discountflat > 0) {
                            pitems.push({
                                name: o.name + " - Discount Flat",
                                description: o.description || o.paypal_description || "",
                                quantity: 1,
                                price: gg.toFloat(-1 * o.discountflat / 100, 2),
                                currency: o.currency
                            });
                        }
                    });
                    if (cart.discountflat > 0) {
                        pitems.push({
                            name: "Discount Flat",
                            description: o.description || o.paypal_description || "",
                            quantity: 1,
                            price: gg.toFloat(-1 * cart.discountflat / 100, 2),
                            currency: o.currency
                        });
                    }
                    stripal.emit("paypal-checkout-start", p);
                    return actions.payment.create(p);
                },
                onAuthorize: function (data, actions) {
                    return actions.payment.execute().then(function () {
                        stripal.emit("paypal-checkout-end", data);
                    });
                },
                onCancel: function (data) {
                    console.log("paypal: payment cancelled", data);
                },
                onError: function (err) {
                    console.log("paypal: payment error", err);
                }
            }, opts, true);

            function init() {
                paypal.Button.render(config, button.raw(0));
            }

            if (!gg.getbyid("paypal-checkout-script")) {
                script.on("load", init);
                script.appendTo(document.body);
            } else {
                init();
            }
            return button;
        }

        return function (type, opts) {
            opts = gg.extend({}, opts)
            if (type === "stripe") {
                return stripeCheckout(opts);
            } else if (type === "paypal") {
                return paypalCheckout(opts);
            }
        };
    }());

    global.stripal = Object.freeze(stripal);

}(window || this));
