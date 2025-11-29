"use strict";

import gg from "./include/gg.js";

const global = globalThis || window || this;
const stripal = gg.emitter();
const cart = {
    loaded: false,
    id: 0,
    stripeKey: "",
    paypalKey: "",
    currency: "USD",
    tax: 7.75,
    discountflat: 0,
    items: {}
};
const nextid = (function () {
    const maxint = Math.pow(2, 53) - 1;

    return function () {
        cart.id = cart.id < maxint
            ? cart.id + 1
            : 1;
        return cart.id;
    };
}());

stripal.each = function (fn) {
    gg.util.each(cart.items, fn);
};

stripal.get = function (id) {
    return cart.items[id];
};

stripal.length = function () {
    return Object.keys(cart.items).length;
};

stripal.quantity = function () {
    let quantity = 0;

    stripal.each(function (item) {
        quantity += item.quantity();
    });
    return quantity;
};

stripal.find = (function () {
    const operators = ["<=", ">=", "!=", "<", ">"];

    return function (properties) {
        const items = [];

        stripal.each(function (item) {
            const o = item.object();
            let match = true;

            if (!gg.isObject(properties) || gg.isEmpty(properties)) {
                items.push(item);
                return;
            }

            gg.each(properties, function (value, property) {
                let operation = false;

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
    if (gg.util.isString(key) && key !== "") {
        cart.stripeKey = key;
        stripal.save();
        stripal.emit("update", "stripeKey", cart.stripeKey);
    }
    return cart.stripeKey;
};

stripal.paypalKey = function (key) {
    if (gg.util.isString(key) && key !== "") {
        cart.paypalKey = key;
        stripal.save();
        stripal.emit("update", "paypalKey", cart.paypalKey);
    }
    return cart.paypalKey;
};

stripal.currency = function (currency) {
    if (gg.util.isString(currency) && currency !== "") {
        cart.currency = currency.toUpperCase();
        stripal.save();
        stripal.emit("update", "currency", cart.currency);
    }
    return cart.currency;
};

stripal.tax = function (tax) {
    if (!gg.util.isNan(tax)) {
        cart.tax = gg.util.toFloat(tax);
        stripal.save();
        stripal.emit("update", "tax", cart.tax);
    }
    return cart.tax;
};

stripal.discountflat = function (discountflat) {
    if (!gg.util.isNan(discountflat) && gg.util.toInt(discountflat) >= 0) {
        cart.discountflat = gg.util.toInt(discountflat);
        stripal.save();
        stripal.emit("update", "discountflat", cart.discountflat);
    }
    return cart.discountflat;
};

stripal.subtotal = function () {
    let subtotal = 0;

    stripal.each(function (item) {
        subtotal += item.total();
    });
    return Math.ceil(subtotal - cart.discountflat);
};

stripal.total = function () {
    const subtotal = stripal.subtotal();
    const taxpercent = cart.tax / 100;

    return Math.ceil(subtotal + (subtotal * taxpercent));
};

stripal.newItem = (function () {
    const restricted = [
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
        let i;

        if (gg.util.isObject(value)) {
            gg.util.each(value, function (v, k) {
                if (gg.util.isFunction(v)) {
                    delete value[k];
                } else if (gg.util.isObject(v) || gg.util.isArray(v)) {
                    stripMethods(v);
                }
            });
        } else if (gg.util.isArray(value)) {
            i = value.length - 1;
            while (i >= 0) {
                if (gg.util.isFunction(value[i])) {
                    value.splice(i, 1);
                } else if (gg.util.isObject(value[i]) || gg.util.isArray(value[i])) {
                    stripMethods(value[i]);
                }
                i -= 1;
            }
        }
    }

    function sanityCheck(store) {
        const props = [
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
            const int = gg.util.toInt(store[prop]);

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
        let item;
        let store = {
            currency: cart.currency,
            quiet: false
        };

        opts = gg.util.extend({}, opts);
        stripMethods(opts);
        store = gg.util.extend(store, opts, true);
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
                if (gg.util.isBoolean(quiet)) {
                    store.quiet = quiet;
                    item.save();
                    item.emit("update", "quiet", store.quiet);
                }
                return store.quiet;
            },
            name: function (name) {
                if (gg.util.isString(name) && name !== "") {
                    store.name = name;
                    item.save();
                    item.emit("update", "name", store.name);
                }
                return store.name;
            },
            currency: function (currency) {
                if (gg.util.isString(currency) && currency !== "") {
                    store.currency = currency.toUpperCase();
                    item.save();
                    item.emit("update", "currency", store.currency);
                }
                return store.currency;
            },
            price: function (price) {
                if (!gg.util.isNan(price) && gg.util.toInt(price) >= 0) {
                    store.price = gg.util.toInt(price);
                    item.save();
                    item.emit("update", "price", store.price);
                }
                return store.price;
            },
            minimum: function (minimum) {
                if (!gg.util.isNan(minimum) && gg.util.toInt(minimum) >= 1) {
                    store.minimum = gg.util.toInt(minimum);
                    item.save();
                    item.emit("update", "minimum", store.minimum);
                }
                return store.minimum;
            },
            quantity: function (quantity) {
                if (!gg.util.isNan(quantity) && gg.util.toInt(quantity) >= store.minimum) {
                    store.quantity = gg.util.toInt(quantity);
                    item.save();
                    item.emit("update", "quantity", store.quantity);
                }
                return store.quantity;
            },
            step: function (step) {
                if (!gg.util.isNan(step) && gg.util.toInt(step) >= 1) {
                    store.step = gg.util.toInt(step);
                    item.save();
                    item.emit("update", "step", store.step);
                }
                return store.step;
            },
            add: function (add) {
                if (!gg.util.isNan(add) && gg.util.toInt(add) >= 0) {
                    store.add = gg.util.toInt(add);
                    item.save();
                    item.emit("update", "add", store.add);
                }
                return store.add;
            },
            addflat: function (addflat) {
                if (!gg.util.isNan(addflat) && gg.util.toInt(addflat) >= 0) {
                    store.addflat = gg.util.toInt(addflat);
                    item.save();
                    item.emit("update", "addflat", store.addflat);
                }
                return store.addflat;
            },
            discount: function (discount) {
                if (!gg.util.isNan(discount) && gg.util.toInt(discount) >= 0) {
                    store.discount = gg.util.toInt(discount);
                    item.save();
                    item.emit("update", "discount", store.discount);
                }
                return store.discount;
            },
            discountflat: function (discountflat) {
                if (!gg.util.isNan(discountflat) && gg.util.toInt(discountflat) >= 0) {
                    store.discountflat = gg.util.toInt(discountflat);
                    item.save();
                    item.emit("update", "discountflat", store.discountflat);
                }
                return store.discountflat;
            },
            increment: function (inc) {
                if (gg.util.isNan(inc)) {
                    store.quantity = store.quantity + store.step < store.minimum
                        ? store.minimum
                        : store.quantity + store.step;
                } else if (gg.util.toInt(inc) >= 0) {
                    store.quantity = store.quantity + gg.util.toInt(inc) < store.minimum
                        ? store.minimum
                        : store.quantity + gg.util.toInt(inc);
                }
                item.save();
                item.emit("update", "quantity", store.quantity);
                return store.quantity;
            },
            decrement: function (dec) {
                if (gg.util.isNan(dec)) {
                    store.quantity = store.quantity - store.step < store.minimum
                        ? store.minimum
                        : store.quantity - store.step;
                } else if (gg.util.toInt(dec) >= 0) {
                    store.quantity = store.quantity - gg.util.toInt(dec) < store.minimum
                        ? store.minimum
                        : store.quantity - gg.util.toInt(dec);
                }
                item.save();
                item.emit("update", "quantity", store.quantity);
                return store.quantity;
            },
            total: function () {
                const orders = store.quantity / store.step;
                const addtotal = (store.add * orders) + store.addflat;
                const discounttotal = (store.discount * orders) + store.discountflat;

                return gg.util.toInt(store.quantity * store.price + addtotal - discounttotal);
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
                const k = gg.util.isString(key) && key.trim();

                if (!gg.util.isString(k) || k === "" || gg.util.inArray(restricted, k) || gg.util.isFunction(value)) {
                    return;
                }
                stripMethods(value);
                store[k] = value;
                item.save();
                item.emit("update", k, value);
            },
            get: function (key) {
                const k = gg.util.isString(key) && key.trim();

                if (!gg.util.isString(k) || k === "" || gg.util.inArray(restricted, k) || !store.hasOwnProperty(k)) {
                    return;
                }
                return store[k];
            },
            del: function (key) {
                const k = gg.util.isString(key) && key.trim();

                if (!gg.util.isString(k) || k === "" || gg.util.inArray(restricted, k) || !store.hasOwnProperty(k)) {
                    return;
                }
                delete store[k];
                item.save();
                item.emit("update", k);
            },
            object: function (added) {
                const o = gg.util.copy(store);

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
            const oldemit = item.emit;

            return function () {
                const args = gg.util.toArray(arguments);

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
    let dbrequest;

    function dbSuccess(e) {
        let data = e.target.result;

        function cartItems() {
            gg.util.each(data.items, function (item) {
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
            data = {
                items: []
            };
        }
        if (document.readyState === "complete") {
            cartItems();
        } else {
            global.addEventListener("load", cartItems, false);
        }
    }

    function dbUpgrade(ignore, db) {
        db.create("cart", null, {
            "stripeKey": ["stripeKey", { unique: false }],
            "paypalKey": ["paypalKey", { unique: false }],
            "currency": ["currency", { unique: false }],
            "tax": ["tax", { unique: false }],
            "discountflat": ["discountflat", { unique: false }],
            "items": ["items", { unique: false }],
        });
    }

    function dbUpdate() {
        const data = {
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
        if (dbrequest) {
            dbrequest.insert("cart", data, "default");
        }
    }

    stripal.save = dbUpdate;

    return function (dbname) {
        if (cart.loaded) {
            return;
        }
        gg.cdb.on("error", function (e) {
            console.log(e.target.errorCode);
        });
        gg.cdb.on("open", function (ignore, req) {
            dbrequest = req;
            dbrequest.select("cart", "default").onsuccess = dbSuccess;
        });
        gg.cdb.open(dbname, 1, dbUpgrade);
    };
}());

stripal.checkout = (function () {
    function stripeCheckout(opts) {
        const button = gg.create("div").attr("id", "stripe-button");
        const script = gg.create("script").attr("id", "stripe-checkout-script").attr("type", "application/javascript").attr("src", "https://checkout.stripe.com/checkout.js");
        const config = gg.util.extend({
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
            opened: gg.util.noop,
            closed: gg.util.noop
        }, opts, true);

        function init() {
            const handler = StripeCheckout.configure(config);

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

        if (!gg.util.getById("stripe-checkout-script")) {
            script.on("load", init);
            script.appendTo(document.body);
        } else {
            init();
        }
        return button;
    }

    function paypalCheckout(opts) {
        const button = gg.create("div").attr("id", "paypal-button");
        const script = gg.create("script").attr("id", "paypal-checkout-script").data("version-4", "").attr("type", "application/javascript").attr("src", "https://www.paypalobjects.com/api/checkout.js");
        const config = gg.util.extend({
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
                const p = {
                    payment: {
                        transactions: [{
                            amount: {
                                total: gg.util.toFloat(stripal.total() / 100, 2),
                                currency: cart.currency,
                                details: {
                                    subtotal: gg.util.toFloat(stripal.subtotal() / 100, 2),
                                    tax: gg.util.toFloat(Math.ceil(stripal.subtotal() * (stripal.tax() / 100)) / 100, 2),
                                    shipping: "0.00"
                                }
                            },
                            item_list: {
                                items: []
                            }
                        }]
                    }
                };
                const pitems = p.payment.transactions[0].item_list.items;

                stripal.each(function (item) {
                    const o = item.object();

                    pitems.push({
                        name: o.name,
                        description: o.description || o.paypal_description || "",
                        quantity: o.quantity,
                        price: gg.util.toFloat(o.price / 100, 2),
                        currency: o.currency
                    });
                    if (o.add > 0) {
                        pitems.push({
                            name: o.name + " - Add",
                            description: o.description || o.paypal_description || "",
                            quantity: o.quantity / o.step,
                            price: gg.util.toFloat(o.add / 100, 2),
                            currency: o.currency
                        });
                    }
                    if (o.addflat > 0) {
                        pitems.push({
                            name: o.name + " - Add Flat",
                            description: o.description || o.paypal_description || "",
                            quantity: 1,
                            price: gg.util.toFloat(o.addflat / 100, 2),
                            currency: o.currency
                        });
                    }
                    if (o.discount > 0) {
                        pitems.push({
                            name: o.name + " - Discount",
                            description: o.description || o.paypal_description || "",
                            quantity: o.quantity / o.step,
                            price: gg.util.toFloat(-1 * o.discount / 100, 2),
                            currency: o.currency
                        });
                    }
                    if (o.discountflat > 0) {
                        pitems.push({
                            name: o.name + " - Discount Flat",
                            description: o.description || o.paypal_description || "",
                            quantity: 1,
                            price: gg.util.toFloat(-1 * o.discountflat / 100, 2),
                            currency: o.currency
                        });
                    }
                });
                if (cart.discountflat > 0) {
                    pitems.push({
                        name: "Discount Flat",
                        description: "Cart Discount",
                        quantity: 1,
                        price: gg.util.toFloat(-1 * cart.discountflat / 100, 2),
                        currency: cart.currency
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

        if (!gg.util.getById("paypal-checkout-script")) {
            script.on("load", init);
            script.appendTo(document.body);
        } else {
            init();
        }
        return button;
    }

    return function (type, opts) {
        opts = gg.util.extend({}, opts)
        if (type === "stripe") {
            return stripeCheckout(opts);
        } else if (type === "paypal") {
            return paypalCheckout(opts);
        }
    };
}());

export default Object.freeze(stripal);
