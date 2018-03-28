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
    var itemId = (function () {
        var id = 0;
        var maxint = Math.pow(2, 53) - 1;

        return function () {
            if (id < maxint) {
                id = id + 1;
            } else {
                id = 1;
            }
            return id;
        };
    }());
    var cart = {
        stripeKey: "",
        paypalKey: "",
        currency: "USD",
        tax: 7.75,
        items: {}
    };

    stripal.each = function (fn) {
        if (gg.isFunction(fn)) {
            Object.keys(cart.items).forEach(function (id, i) {
                var item = cart.items[id];

                fn(item, i, cart.items);
            });
        }
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
            "constructor",
            "prototype",
            "stripal_item",
            "update",
            "id",
            "name",
            "price",
            "currency",
            "quantity",
            "step",
            "discount",
            "increment",
            "decrement",
            "total",
            "add",
            "remove",
            "set",
            "get",
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
                "quantity",
                "step",
                "discount"
            ];

            props.forEach(function (prop) {
                var int = gg.toInt(store[prop]);

                if (prop === "step" ? int < 1 : int < 0) {
                    store[prop] = prop === "step" ? 1 : 0;
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
            item = {
                stripal_item: true,
                id: function () {
                    return store.id;
                },
                name: function (name) {
                    if (gg.isString(name) && name !== "") {
                        store.name = name;
                    }
                    return store.name;
                },
                price: function (price) {
                    if (gg.toInt(price) >= 0) {
                        store.price = gg.toInt(price);
                    }
                    return store.price;
                },
                currency: function (currency) {
                    if (gg.isString(currency) && currency !== "") {
                        store.currency = currency.toUpperCase();
                    }
                    return store.currency;
                },
                quantity: function (quantity) {
                    if (gg.toInt(quantity) >= 0) {
                        store.quantity = gg.toInt(quantity);
                    }
                    return store.quantity;
                },
                step: function (step) {
                    if (gg.toInt(step) >= 1) {
                        store.step = gg.toInt(step);
                    }
                    return store.step;
                },
                discount: function (discount) {
                    if (gg.toInt(discount) >= 0) {
                        store.discount = gg.toInt(discount);
                    }
                    return store.discount;
                },
                increment: function (inc) {
                    if (inc === undefined) {
                        store.quantity += store.step;
                    } else if (gg.toInt(inc) >= 0) {
                        store.quantity += gg.toInt(inc);
                    }
                    return store.quantity;
                },
                decrement: function (dec) {
                    if (dec === undefined) {
                        store.quantity = store.quantity - store.step < 0 ? 0 : store.quantity - store.step;
                    }
                    if (gg.toInt(dec) >= 0) {
                        store.quantity = store.quantity - gg.toInt(dec) < 0 ? 0 : store.quantity - gg.toInt(dec);
                    }
                    return store.quantity;
                },
                total: function () {
                    return gg.toInt(store.quantity * store.price - store.discount);
                },
                add: function () {
                    if (!cart.items.hasOwnProperty(store.id)) {
                        cart.items[store.id] = item;
                        stripal.emit("add", item);
                    }
                },
                remove: function () {
                    if (cart.items.hasOwnProperty(store.id)) {
                        delete cart.items[store.id];
                        stripal.emit("remove", item);
                    }
                },
                set: function (key, value) {
                    if (!gg.isString(key) || key === "" || restricted.indexOf(key.trim()) !== -1 || gg.isFunction(value)) {
                        return;
                    }
                    stripMethods(value);
                    store[key.trim()] = value;
                },
                get: function (key) {
                    if (!gg.isString(key) || key === "" || restricted.indexOf(key.trim()) !== -1) {
                        return;
                    }
                    return store[key.trim()];
                },
                object: function () {
                    return gg.copy(store);
                }
            };
            return Object.freeze(item);
        };
    }());

    stripal.stripeKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.stripeKey = key;
        }
        return cart.stripeKey;
    };

    stripal.paypalKey = function (key) {
        if (gg.isString(key) && key !== "") {
            cart.paypalKey = key;
        }
        return cart.paypalKey;
    };

    stripal.currency = function (currency) {
        if (gg.isString(currency) && currency !== "") {
            cart.currency = currency.toUpperCase();
        }
        return cart.currency;
    };

    stripal.tax = function (tax) {
        if (!gg.isNaN(tax)) {
            cart.tax = gg.toFloat(tax);
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
                        description: o.description || o.paypal_description,
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

}(window || this));
