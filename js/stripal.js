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
        id: 0,
        stripeKey: "",
        paypalKey: "",
        currency: "USD",
        tax: 7.75,
        items: {}
    };
    var nextid = (function () {
        var maxint = Math.pow(2, 53) - 1;

        return function () {
            cart.id = cart.id < maxint ? cart.id + 1 : 1;
            return cart.id;
        };
    }());
    var indexedDB = global.indexedDB || global.mozIndexedDB || global.webkitIndexedDB || global.msIndexedDB;
    var IDBTransaction = global.IDBTransaction || global.webkitIDBTransaction || global.msIDBTransaction || { READ_WRITE: "readwrite" };
    var IDBKeyRange = global.IDBKeyRange || global.webkitIDBKeyRange || global.msIDBKeyRange;
    var dbrequest;

    if (!indexedDB) {
        throw {
            name: "TypeError",
            message: "indexedDB is undefined"
        };
    }

    stripal.each = function (fn) {
        if (gg.isFunction(fn)) {
            Object.keys(cart.items).forEach(function (id) {
                var item = cart.items[id];

                fn(item);
            });
        }
    };

    function updateStorage() {
        var data = {
            id: cart.id,
            stripeKey: cart.stripeKey,
            paypalKey: cart.paypalKey,
            currency: cart.currency,
            tax: cart.tax,
            items: {}
        };

        stripal.each(function (item) {
            data.items[item.id()] = item.object();
        });
        if (dbrequest) {
            dbrequest.result.transaction(["cart"], "readwrite").objectStore("cart").put(data, "default");
        }
    }

    stripal.items = function () {
        return gg.copy(cart.items);
    };

    stripal.quantity = function () {
        var quantity = 0;

        stripal.each(function (item) {
            quantity += item.quantity();
        });
        return quantity;
    };

    stripal.length = function () {
        return Object.keys(cart.items).length;
    };

    stripal.get = function (id) {
        return cart.items[id];
    };

// opts = {
//     name: string,
//     price: number, (cents)
//     step: number, (amount to increase/decrease quantity by when calling increment/decrement)
//     quiet: boolean, (trigger cart event)
//     discount: number, (amount to subtract from price)
//     any: any, (any additional properties that are not functions are stored as well)
// };
    stripal.newItem = (function () {
        var restricted = [
            "stripal_item",
            "id",
            "name",
            "price",
            "currency",
            "minimum",
            "quantity",
            "step",
            "increment",
            "decrement",
            "add",
            "discount",
            "total",
            "cart",
            "remove",
            "set",
            "get",
            "del",
            "object"
        ];

        function stripMethods(value) {
            var i;

            if (gg.isObject(value)) {
                Object.keys(value).forEach(function (key) {
                    if (gg.isFunction(value[key])) {
                        delete value[key];
                    } else if (gg.isObject(value[key]) || gg.isArray(value[key])) {
                        stripMethods(value[key]);
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
                "discount"
            ];

            props.forEach(function (prop) {
                var int = gg.toInt(store[prop]);

                if (prop === "minimum" || prop === "quantity" || prop === "step" ? int < 1 : int <= 0) {
                    store[prop] = prop === "minimum" || prop === "quantity" || prop === "step" ? (prop === "quantity" ? store.minimum : 1) : 0;
                }
            });
        }

        return function (opts) {
            var store = {};
            var item;

            if (!gg.isObject(opts)) {
                opts = {};
            }
            stripMethods(opts);
            store = gg.extend(store, opts, true);
            sanityCheck(store);
            if (!store.id) {
                store.id = nextid();
            }
            item = emitter({
                stripal_item: true,
                id: function () {
                    return store.id;
                },
                name: function (name) {
                    if (gg.isString(name) && name !== "") {
                        store.name = name;
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "name", store.name);
                        item.emit("update", "name", store.name);
                    }
                    return store.name;
                },
                price: function (price) {
                    if (!gg.isNaN(price) && gg.toInt(price) >= 0) {
                        store.price = gg.toInt(price);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "price", store.price);
                        item.emit("update", "price", store.price);
                    }
                    return store.price;
                },
                add: function (add) {
                    if (!gg.isNaN(add) && gg.toInt(add) >= 0) {
                        store.add = gg.toInt(add);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "add", store.add);
                        item.emit("update", "add", store.add);
                    }
                    return store.add;
                },
                currency: function (currency) {
                    if (gg.isString(currency) && currency !== "") {
                        store.currency = currency.toUpperCase();
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "currency", store.currency);
                        item.emit("update", "currency", store.currency);
                    }
                    return store.currency;
                },
                minimum: function (minimum) {
                    if (!gg.isNaN(minimum) && gg.toInt(minimum) >= 1) {
                        store.minimum = gg.toInt(minimum);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "minimum", store.minimum);
                        item.emit("update", "minimum", store.minimum);
                    }
                    return store.minimum;
                },
                quantity: function (quantity) {
                    if (!gg.isNaN(quantity) && gg.toInt(quantity) >= store.minimum) {
                        store.quantity = gg.toInt(quantity);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "quantity", store.quantity);
                        item.emit("update", "quantity", store.quantity);
                    }
                    return store.quantity;
                },
                step: function (step) {
                    if (!gg.isNaN(step) && gg.toInt(step) >= 1) {
                        store.step = gg.toInt(step);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "step", store.step);
                        item.emit("update", "step", store.step);
                    }
                    return store.step;
                },
                discount: function (discount) {
                    if (!gg.isNaN(discount) && gg.toInt(discount) >= 0) {
                        store.discount = gg.toInt(discount);
                        if (cart.items.hasOwnProperty(store.id)) {
                            updateStorage();
                        }
                        stripal.emit("item-update", item, "discount", store.discount);
                        item.emit("update", "discount", store.discount);
                    }
                    return store.discount;
                },
                increment: function (inc) {
                    if (gg.isNaN(inc)) {
                        store.quantity = store.quantity + store.step < store.minimum ? store.minimum : store.quantity + store.step;
                    } else if (gg.toInt(inc) >= 0) {
                        store.quantity = store.quantity + gg.toInt(inc) < store.minimum ? store.minimum : store.quantity + gg.toInt(inc);
                    }
                    if (cart.items.hasOwnProperty(store.id)) {
                        updateStorage();
                    }
                    stripal.emit("item-update", item, "quantity", store.quantity);
                    item.emit("update", "quantity", store.quantity);
                    return store.quantity;
                },
                decrement: function (dec) {
                    if (gg.isNaN(dec)) {
                        store.quantity = store.quantity - store.step < store.minimum ? store.minimum : store.quantity - store.step;
                    } else if (gg.toInt(dec) >= 0) {
                        store.quantity = store.quantity - gg.toInt(dec) < store.minimum ? store.minimum : store.quantity - gg.toInt(dec);
                    }
                    if (cart.items.hasOwnProperty(store.id)) {
                        updateStorage();
                    }
                    stripal.emit("item-update", item, "quantity", store.quantity);
                    item.emit("update", "quantity", store.quantity);
                    return store.quantity;
                },
                total: function () {
                    return gg.toInt(store.quantity * store.price + store.add - store.discount);
                },
                cart: function () {
                    if (!cart.items.hasOwnProperty(store.id)) {
                        cart.items[store.id] = item;
                        updateStorage();
                        stripal.emit("item-cart", item);
                        item.emit("cart");
                    }
                },
                remove: function () {
                    if (cart.items.hasOwnProperty(store.id)) {
                        delete cart.items[store.id];
                        updateStorage();
                        stripal.emit("item-remove", item);
                        item.emit("remove");
                    }
                },
                set: function (key, value) {
                    if (!gg.isString(key) || key === "" || restricted.indexOf(key.trim()) !== -1 || gg.isFunction(value)) {
                        return;
                    }
                    stripMethods(value);
                    store[key.trim()] = value;
                    if (cart.items.hasOwnProperty(store.id)) {
                        updateStorage();
                    }
                    stripal.emit("item-update", item, key.trim(), value);
                    item.emit("update", key.trim(), value);
                },
                get: function (key) {
                    if (!gg.isString(key) || key === "" || restricted.indexOf(key.trim()) !== -1 || !store.hasOwnProperty(key.trim())) {
                        return;
                    }
                    return store[key.trim()];
                },
                del: function (key) {
                    if (!gg.isString(key) || key === "" || restricted.indexOf(key.trim()) !== -1 || !store.hasOwnProperty(key.trim())) {
                        return;
                    }
                    if (cart.items.hasOwnProperty(store.id)) {
                        updateStorage();
                    }
                    stripal.emit("item-update", item, key.trim());
                    item.emit("update", key.trim());
                    return delete store[key.trim()];
                },
                object: function (added) {
                    var o = gg.copy(store);

                    if (added === true) {
                        restricted.forEach(function (key) {
                            if (o.hasOwnProperty(key)) {
                                delete o[key];
                            }
                        });
                    }
                    return o;
                }
            });
            return Object.freeze(item);
        };
    }());

    stripal.stripeKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.stripeKey = key;
            updateStorage();
            stripal.emit("update", "stripeKey", cart.currency);
        }
        return cart.stripeKey;
    };

    stripal.paypalKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.paypalKey = key;
            updateStorage();
            stripal.emit("update", "paypalKey", cart.currency);
        }
        return cart.paypalKey;
    };

    stripal.currency = function (currency) {
        if (gg.isString(currency) && currency !== "") {
            cart.currency = currency.toUpperCase();
            updateStorage();
            stripal.emit("update", "currency", cart.currency);
        }
        return cart.currency;
    };

    stripal.tax = function (tax) {
        if (!gg.isNaN(tax)) {
            cart.tax = gg.toFloat(tax);
            updateStorage();
            stripal.emit("update", "tax", cart.tax);
        }
        return cart.tax;
    };

    stripal.subtotal = function () {
        var subtotal = 0;

        stripal.each(function (item) {
            subtotal += item.total();
        });
        return Math.ceil(subtotal);
    };

    stripal.total = function () {
        var subtotal = stripal.subtotal();
        var taxpercent = cart.tax / 100;

        return Math.ceil(subtotal + (subtotal * taxpercent));
    };

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
        var button = gg.create("button").attr("id", "stripe-button");
        var script = gg.create("script").attr("src", "https://checkout.stripe.com/checkout.js");
        var config = gg.extend({
            key: cart.stripeKey,
            token: function (token, args) {
                console.log("stripe: received token", token, args);
            },
            image: "https://stripe.com/img/documentation/checkout/marketplace.png",
            name: "Stripal",
            description: "Stripal checkout!",
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

        script.on("load", function () {
            var handler = StripeCheckout.configure(config);

            function openHandler(e) {
                e.preventDefault();
                handler.open();
            }

            function closeHandler() {
                handler.close();
            }

            button.on("click", openHandler, false);
            global.addEventListener("popstate", closeHandler, false);
        });
        script.appendTo(document.body);
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
        var button = gg.create("button").attr("id", "paypal-button");
        var script = gg.create("script").data("version-4", "").attr("src", "https://www.paypalobjects.com/api/checkout.js");
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
                });
                return actions.payment.create(p);
            },
            onAuthorize: function (data, actions) {
                return actions.payment.execute().then(function () {
                    console.log("paypal: payment complete");
                });
            },
            onCancel: function (data) {
                console.log("paypal: payment cancelled", data);
            },
            onError: function (err) {
                console.log("paypal: payment error", err);
            }
        }, opts, true);
        script.on("load", function () {
            paypal.Button.render(config, button.getRaw(0));
        });
        script.appendTo(document.body);
        return button;
    }

    stripal.checkout = function (type, opts) {
        if (!gg.isObject(opts)) {
            opts = {};
        }
        if (type === "stripe") {
            return stripeCheckout(opts);
        } else if (type === "paypal") {
            return paypalCheckout(opts);
        }
    };

    global.stripal = Object.freeze(stripal);

    global.onload = function () {
        function dbError(e) {
            throw e;
        }
        dbrequest = indexedDB.open("stripal");
        dbrequest.onerror = dbError;
        dbrequest.onsuccess = function (e) {
            var db = e.target.result;

            db.onerror = dbError;
            db.transaction(["cart"], "readonly").objectStore("cart").get("default").onsuccess = function (e) {
                var data = e.target.result;

                if (data) {
                    cart.id = data.id;
                    cart.stripeKey = data.stripeKey;
                    cart.paypalKey = data.paypalKey;
                    cart.currency = data.currency;
                    cart.tax = data.tax;
                    Object.keys(data.items).forEach(function (id) {
                        stripal.newItem(data.items[id]).cart();
                    });
                }
            };
        };
        dbrequest.onupgradeneeded = function (e) {
            var db = e.target.result;
            var objectStore;

            db.onerror = dbError;
            objectStore = db.createObjectStore("cart");
            objectStore.createIndex("id", "id", { unique: false });
            objectStore.createIndex("stripeKey", "stripeKey", { unique: false });
            objectStore.createIndex("paypalKey", "paypalKey", { unique: false });
            objectStore.createIndex("currency", "currency", { unique: false });
            objectStore.createIndex("tax", "tax", { unique: false });
            objectStore.createIndex("items", "items", { unique: false });
        };
    };

}(window || this));
