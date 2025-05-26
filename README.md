# 🛒 Stripal

A simple, elegant shopping cart library supporting both **Stripe** and **PayPal** checkouts. Stripal is lightweight, event-driven, and designed for extensibility, with persistence via **IndexedDB**.

---

## 🌟 Features

- Add/remove/update cart items
- Stripe & PayPal checkout integrations
- Persistent cart storage via IndexedDB
- Support for taxes, discounts, currency, and quantity rules
- Emits useful lifecycle events (`load`, `item-update`, `checkout-end`, etc.)
- Fully documented API and item model

> **Note:** Currently supports **USD** as the default currency.

---

## 📦 Getting Started

### Include in Your Project

Include Stripal as a module:

```html
<script type="module" src="stripal.js"></script>
```

Make sure to also include the required utility library (`gg.js`) used internally for DOM, events, and IndexedDB handling.

---

## 🔧 Basic Usage

```js
import stripal from './stripal.js';

stripal.load('my-cart'); // Load saved cart from IndexedDB

const item = stripal.newItem({
  name: "T-Shirt",
  price: 2000, // in cents
  quantity: 1
});

item.cart(); // Add item to the cart

stripal.save(); // Persist the cart
```

---

## 🧾 Checkout Integration

### Stripe

```js
document.body.appendChild(
  stripal.checkout("stripe", {
    name: "My Store",
    description: "Order Summary",
    email: "user@example.com"
  })
);
```

### PayPal

```js
document.body.appendChild(
  stripal.checkout("paypal", {
    client: {
      production: "YOUR_PAYPAL_CLIENT_ID"
    }
  })
);
```

---

## 🛠️ API Reference

### stripal (Global)

| Method | Description |
| ------ | ----------- |
| `each(fn)` | Iterate through all items. |
| `get(id)` | Get an item by ID. |
| `length()` | Get number of items. |
| `quantity()` | Get total item quantity. |
| `find(props)` | Filter items by rules. |
| `items()` | Get items as object map. |
| `save()` | Persist cart state. |
| `loaded()` | Return if cart is loaded. |
| `empty()` | Remove all items from cart. |
| `stripeKey(key)` | Get/set Stripe API key. |
| `paypalKey(key)` | Get/set PayPal API key. |
| `currency(currency)` | Get/set cart currency. |
| `tax(tax)` | Get/set tax rate (default: 7.75%). |
| `discountflat(amount)` | Get/set global flat discount. |
| `subtotal()` | Get total before tax/discount. |
| `total()` | Get total after tax/discount. |
| `newItem(opts)` | Create a new item. |
| `load(dbname)` | Load cart from IndexedDB. |
| `checkout(type, opts)` | Initiate checkout (`stripe` or `paypal`). |

---

## 🧱 Item API

Each cart item is an object with the following methods:

| Method | Description |
| ------ | ----------- |
| `id()` | Unique identifier |
| `name(name)` | Get/set name |
| `price(price)` | Get/set price in cents |
| `currency(currency)` | Get/set currency (default: USD) |
| `quantity(quantity)` | Get/set quantity |
| `minimum(min)` | Set minimum allowed quantity |
| `step(step)` | Set quantity increment/decrement |
| `add(add)` | Additional per-unit price |
| `addflat(flat)` | Additional flat price |
| `discount(discount)` | Per-unit discount |
| `discountflat(flat)` | Flat discount |
| `increment([n])` | Increase quantity |
| `decrement([n])` | Decrease quantity |
| `total()` | Get total price for item |
| `cart()` | Add item to cart |
| `remove()` | Remove item from cart |
| `set(key, value)` | Set custom data |
| `get(key)` | Get custom data |
| `del(key)` | Delete custom data |
| `object([added])` | Export item as object |
| `save()` | Save item changes |
| `quiet(quiet)` | Enable/disable event emissions |

---

## 📡 Events

### Global Events

| Name | Parameters | Description |
|------|------------|-------------|
| `load` | — | Fired when cart is loaded from DB |
| `item-cart` | `Item` | Fired when item is added |
| `item-remove` | `Item` | Fired when item is removed |
| `item-update` | `Item, key, [value]` | Fired on item property change |
| `paypal-checkout-start` | `PaymentData` | Checkout initiated |
| `paypal-checkout-end` | `PaymentData` | Payment authorized |
| `stripe-checkout-start` | — | Checkout initiated |
| `stripe-checkout-end` | `Token, Args` | Payment completed |

### Item Events

| Name | Parameters | Description |
|------|------------|-------------|
| `cart` | `Item` | Fired when item added |
| `remove` | `Item` | Fired when item removed |
| `update` | `Item, key, [value]` | Fired on update |

---

## 💾 Persistence

Stripal stores all cart data using IndexedDB via `gg.cdb`. Cart configuration (Stripe/PayPal keys, currency, tax, etc.) and all item data are saved under a single object store.

Use `stripal.load(dbname)` to load cart data and `stripal.save()` to persist changes.

---

## 🔑 Configuration Options

```js
stripal.currency("EUR");
stripal.tax(8.5);
stripal.discountflat(500);
stripal.stripeKey("pk_live_xxx");
stripal.paypalKey("live_xxx");
```

---

## 🧪 Example

```js
stripal.load("demo");

const item = stripal.newItem({ name: "Coffee", price: 499 });
item.cart();

console.log("Subtotal:", stripal.subtotal());
console.log("Total:", stripal.total());
```

---

## 📜 License

See the [LICENSE](./LICENSE) file for details.

