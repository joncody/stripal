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

    var stripal = emitter();
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
            cart.id = cart.id < maxint ? cart.id + 1 : 1;
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
                        if (value instanceof RegExp) {
                            if (!value.test(o[property])) {
                                match = false;
                            }
                        } else if (o[property] !== value) {
                            match = false;
                        }
                        break;
                    }
                });
                if (match) {
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
            item.remove();
        });
    };

    stripal.stripeKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.stripeKey = key;
            stripal.save();
            stripal.emit("update", "stripeKey", cart.currency);
        }
        return cart.stripeKey;
    };

    stripal.paypalKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.paypalKey = key;
            stripal.save();
            stripal.emit("update", "paypalKey", cart.currency);
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
            "price",
            "currency",
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

                if (prop === "minimum" || prop === "quantity" || prop === "step" ? int < 1 : int <= 0) {
                    store[prop] = prop === "minimum" || prop === "quantity" || prop === "step" ? (prop === "quantity" ? store.minimum : 1) : 0;
                }
            });
        }

        return function (opts) {
            var store = {
                currency: "USD",
                quiet: false
            };
            var item;

            if (!gg.isObject(opts)) {
                opts = {};
            }
            stripMethods(opts);
            store = gg.extend(store, opts, true);
            sanityCheck(store);
            store.id = nextid();
            item = emitter({
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
                price: function (price) {
                    if (!gg.isNaN(price) && gg.toInt(price) >= 0) {
                        store.price = gg.toInt(price);
                        item.save();
                        item.emit("update", "price", store.price);
                    }
                    return store.price;
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
                currency: function (currency) {
                    if (gg.isString(currency) && currency !== "") {
                        store.currency = currency.toUpperCase();
                        item.save();
                        item.emit("update", "currency", store.currency);
                    }
                    return store.currency;
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
                        store.quantity = store.quantity + store.step < store.minimum ? store.minimum : store.quantity + store.step;
                    } else if (gg.toInt(inc) >= 0) {
                        store.quantity = store.quantity + gg.toInt(inc) < store.minimum ? store.minimum : store.quantity + gg.toInt(inc);
                    }
                    item.save();
                    item.emit("update", "quantity", store.quantity);
                    return store.quantity;
                },
                decrement: function (dec) {
                    if (gg.isNaN(dec)) {
                        store.quantity = store.quantity - store.step < store.minimum ? store.minimum : store.quantity - store.step;
                    } else if (gg.toInt(dec) >= 0) {
                        store.quantity = store.quantity - gg.toInt(dec) < store.minimum ? store.minimum : store.quantity - gg.toInt(dec);
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

                    if (!gg.isString(k) || k === "" || restricted.indexOf(k) !== -1 || gg.isFunction(value)) {
                        return;
                    }
                    stripMethods(value);
                    store[k] = value;
                    item.save();
                    item.emit("update", k, value);
                },
                get: function (key) {
                    var k = gg.isString(key) && key.trim();

                    if (!gg.isString(k) || k === "" || restricted.indexOf(k) !== -1 || !store.hasOwnProperty(k)) {
                        return;
                    }
                    return store[k];
                },
                del: function (key) {
                    var k = gg.isString(key) && key.trim();

                    if (!gg.isString(k) || k === "" || restricted.indexOf(k) !== -1 || !store.hasOwnProperty(k)) {
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
            console.log("indexedDB was not found to be supported!");
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
                    cart.id = data.id || cart.id;
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
            objectStore.createIndex("id", "id", { unique: false });
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
                id: cart.id,
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
        // opts = {
        //     key: string,
        //     token: function,
        //     image: string,
        //     name: string,
        //     description: string,
        //     amount: number,
        //     locale: string,
        //     zipCode: boolean,
        //     billingAddress: boolean,
        //     currency: string,
        //     panelLabel: string,
        //     shippingAddress: boolean,
        //     email: string,
        //     allowRememberMe: boolean,
        //     opened: function,
        //     closed: function
        // };
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

            if (!gg.getById("stripe-checkout-script")) {
                script.on("load", init);
                script.appendTo(document.body);
            } else {
                init();
            }
            return button;
        }

        // opts = {
        //     env: string,
        //     locale: string,
        //     client: object,
        //     commit: boolean,
        //     style: object,
        //     payment: function,
        //     onAuthorize: function,
        //     onCancel: function,
        //     onError: function
        // };
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

                    stripal.each(function (item) {
                        var o = item.object();

                        p.payment.transactions[0].item_list.items.push({
                            name: o.name,
                            description: o.description || o.paypal_description || "",
                            quantity: o.quantity,
                            price: gg.toFloat(o.price / 100, 2),
                            currency: o.currency
                        });
                        if (o.add > 0) {
                            p.payment.transactions[0].item_list.items.push({
                                name: o.name + " - Add",
                                description: o.description || o.paypal_description || "",
                                quantity: o.quantity / o.step,
                                price: gg.toFloat(o.add / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.addflat > 0) {
                            p.payment.transactions[0].item_list.items.push({
                                name: o.name + " - Add Flat",
                                description: o.description || o.paypal_description || "",
                                quantity: 1,
                                price: gg.toFloat(o.addflat / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.discount > 0) {
                            p.payment.transactions[0].item_list.items.push({
                                name: o.name + " - Discount",
                                description: o.description || o.paypal_description || "",
                                quantity: o.quantity / o.step,
                                price: gg.toFloat(-1 * o.discount / 100, 2),
                                currency: o.currency
                            });
                        }
                        if (o.discountflat > 0) {
                            p.payment.transactions[0].item_list.items.push({
                                name: o.name + " - Discount Flat",
                                description: o.description || o.paypal_description || "",
                                quantity: 1,
                                price: gg.toFloat(-1 * o.discountflat / 100, 2),
                                currency: o.currency
                            });
                        }
                    });
                    if (cart.discountflat > 0) {
                        p.payment.transactions[0].item_list.items.push({
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
                paypal.Button.render(config, button.getRaw(0));
            }

            if (!gg.getById("paypal-checkout-script")) {
                script.on("load", init);
                script.appendTo(document.body);
            } else {
                init();
            }
            return button;
        }

        return function (type, opts) {
            if (!gg.isObject(opts)) {
                opts = {};
            }
            if (type === "stripe") {
                return stripeCheckout(opts);
            } else if (type === "paypal") {
                return paypalCheckout(opts);
            }
        };
    }());

    global.stripal = Object.freeze(stripal);

}(window || this));
