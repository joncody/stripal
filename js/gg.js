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

    var listeners = {};
    var keyboardListeners = [];
    var mouseListeners = [];
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
    var keyboardHandler;
    var mouseHandler;

    function typeOf(value) {
        var type = typeof value;

        if (Array.isArray(value)) {
            type = "array";
        } else if (value === null) {
            type = "null";
        }
        return type;
    }

    function noop() {
        return;
    }

    function arrSlice(value) {
        return Array.prototype.slice.call(value);
    }

    function isBoolean(boolean) {
        return typeOf(boolean) === "boolean";
    }

    Number.isNaN = Number.isNaN || function (value) {
        return value !== value;
    };

    function isNumber(number) {
        return typeOf(number) === "number" && !Number.isNaN(number);
    }

    function isString(string) {
        return typeOf(string) === "string";
    }

    function isArray(array) {
        return typeOf(array) === "array";
    }

    function isObject(object) {
        return typeOf(object) === "object";
    }

    function isFunction(func) {
        return typeOf(func) === "function";
    }

    function isNull(nul) {
        return typeOf(nul) === "null";
    }

    function isUndefined(undef) {
        return typeOf(undef) === "undefined";
    }

    function isArrayLike(object) {
        return isObject(object) && !isUndefined(object.length) && Object.keys(object).every(function (key) {
            return key === "length" || isNumber(global.parseInt(key, 10));
        });
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

    function isBuffer(buffer) {
        return !isUndefined(global.ArrayBuffer) && buffer instanceof ArrayBuffer;
    }

    function isNode(node) {
        return isObject(node) && isString(node.nodeName) && isNumber(node.nodeType);
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

    function toArray(value) {
        var array;

        if (isGG(value)) {
            array = value.length() === 1
                ? [value.raw()]
                : value.raw();
        } else if (isBuffer(value)) {
            array = new Uint8Array(value);
        } else if (isString(value) || isArray(value) || isArrayLike(value) || isTypedArray(value)) {
            array = arrSlice(value);
        } else {
            array = [value];
        }
        return array;
    }

    function getCodesFromString(string) {
        var codes = [];

        toArray(string).forEach(function (char) {
            codes.push(char.charCodeAt(0));
        });
        return codes;
    }

    function getStringFromCodes(codes) {
        var string = "";

        toArray(codes).forEach(function (char) {
            string += String.fromCharCode(char);
        });
        return string;
    }

    function toUint8(value) {
        var uint8;

        if (isGG(value)) {
            uint8 = new Uint8Array(value.length() === 1
                ? [value.raw()]
                : value.raw());
        } else if (isString(value)) {
            uint8 = new Uint8Array(getCodesFromString(value));
        } else if (isArray(value) || isArrayLike(value) || isTypedArray(value) || isBuffer(value)) {
            uint8 = new Uint8Array(value);
        } else {
            uint8 = new Uint8Array([value]);
        }
        return uint8;
    }

    function toBuffer(value) {
        return toUint8(value).buffer;
    }

    function inArray(array, value) {
        return isArray(array) && array.indexOf(value) > -1;
    }

    function toCamelCase(string) {
        return isString(string) && string.replace(/-([a-z])/g, function (a) {
            return a[1].toUpperCase();
        });
    }

    function undoCamelCase(string) {
        return isString(string) && string.replace(/([A-Z])/g, function (a) {
            return "-" + a.toLowerCase();
        });
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

    function extend(object, add, overwrite) {
        if (!isObject(object) || !isObject(add)) {
            return object;
        }
        overwrite = isBoolean(overwrite)
            ? overwrite
            : true;
        each(add, function (value, key) {
            if (overwrite || !object.hasOwnProperty(key)) {
                object[key] = copy(value);
            }
        });
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

    function getbyid(id, object) {
        return document.getElementById(supplant(id, object));
    }

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

    function getStyle(node, pseudo) {
        return global.getComputedStyle(node, isUndefined(pseudo)
            ? null
            : pseudo);
    }

    function setImmediate(fn) {
        if (!isFunction(fn)) {
            return;
        }
        return global.setTimeout(fn, 0);
    }

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

        gobject.get = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                return gg(store[index]);
            }
            return gobject;
        };

        gobject.raw = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                return store[index];
            }
            return store.length === 1
                ? store[0]
                : store;
        };

        gobject.length = function () {
            return store.length;
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

        gobject.add = function (nodes) {
            each(nodes, function (node) {
                if (isNode(node) && node.nodeType < 9) {
                    store.push(node);
                }
            });
            return gobject;
        };

        gobject.subtract = function (index) {
            if (isNumber(index) && index >= 0 && index < store.length) {
                store.splice(index, 1);
            }
            return gobject;
        };

        gobject.data = function (name, value) {
            var dataname = isString(name) && (name.length < 4 || name.slice(0, 4) !== "data")
                ? undoCamelCase("data-" + name)
                : undoCamelCase(name);
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

        gobject.remData = function (name) {
            var dataname = isString(name) && (name.length < 4 || name.slice(0, 4) !== "data")
                ? undoCamelCase("data-" + name)
                : undoCamelCase(name);

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

        gobject.remText = function remText() {
            each(store, function (node) {
                node.textContent = "";
            });
            return gobject;
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

        gobject.remHtml = function () {
            each(store, function (node) {
                node.innerHTML = "";
            });
            return gobject;
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

        gobject.parents = function () {
            var nodes = [];

            each(store, function (node) {
                nodes.push(node.parentNode);
            });
            return gg(nodes);
        };

        gobject.children = function () {
            var nodes = [];

            each(store, function (node) {
                nodes = nodes.concat(toArray(node.childNodes));
            });
            return gg(nodes);
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

        return Object.freeze(gobject);
    }

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

    function removeKeyboardHandlers() {
        keyboardListeners.forEach(function (listener) {
            gg(document.body).off("keydown", listener);
        });
    }

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

    function removeMouseHandlers() {
        mouseListeners.forEach(function (listener) {
            gg(document.body).off("mousedown", listener);
        });
    }

    function create(tag) {
        return inArray(taglist, tag)
            ? gg(document.createElement(tag))
            : null;
    }

    gg.typeOf = typeOf;
    gg.noop = noop;
    gg.arrSlice = arrSlice;
    gg.isBoolean = isBoolean;
    gg.isNumber = isNumber;
    gg.isString = isString;
    gg.isArray = isArray;
    gg.isObject = isObject;
    gg.isFunction = isFunction;
    gg.isNull = isNull;
    gg.isUndefined = isUndefined;
    gg.isArrayLike = isArrayLike;
    gg.isTypedArray = isTypedArray;
    gg.isBuffer = isBuffer;
    gg.isNode = isNode;
    gg.isEmpty = isEmpty;
    gg.isGG = isGG;
    gg.isNaN = isNaN;
    gg.toArray = toArray;
    gg.toUint8 = toUint8;
    gg.toBuffer = toBuffer;
    gg.inArray = inArray;
    gg.toCamelCase = toCamelCase;
    gg.undoCamelCase = undoCamelCase;
    gg.getCodesFromString = getCodesFromString;
    gg.getStringFromCodes = getStringFromCodes;
    gg.uuid = uuid;
    gg.supplant = supplant;
    gg.inherits = inherits;
    gg.each = each;
    gg.copy = copy;
    gg.extend = extend;
    gg.equal = equal;
    gg.toInt = toInt;
    gg.toFloat = toFloat;
    gg.getbyid = getbyid;
    gg.select = select;
    gg.selectAll = selectAll;
    gg.getStyle = getStyle;
    gg.setImmediate = setImmediate;
    gg.keyboardHandler = keyboardHandler;
    gg.removeKeyboardHandlers = removeKeyboardHandlers;
    gg.mouseHandler = mouseHandler;
    gg.removeMouseHandlers = removeMouseHandlers;
    gg.create = create;

    global.gg = Object.freeze(gg);

}(window || this));
