Here is a complete README for **stripal.js**, designed to match the style of your previous documentation.

***

# `stripal.js` – E-Commerce Cart Manager

A client-side shopping cart with built-in Stripe and PayPal integration.

**stripal.js** manages cart state (items, taxes, discounts, currencies), persists data using IndexedDB (via `gg.cdb`), and provides drop-in checkout buttons for major payment providers. It integrates seamlessly with the `gg` ecosystem.

---

## ✅ Features

- 🛒 **Full Cart Management:** Add/remove items, update quantities, calculate subtotals/totals.
- 💾 **Persistence:** Automatically saves cart state to IndexedDB.
- 🔍 **Smart Search:** Find items using operators (`>`, `<`, `!=`) and regex.
- 💳 **Payment Ready:** Built-in wrappers for **Stripe Checkout** (v2/legacy) and **PayPal Checkout**.
- 🧮 **Tax & Discounts:** Handles percentage-based tax and flat-rate discounts.
- ⚡ **Event Driven:** Emits events on updates, load, and checkout flow.
- 📦 **Zero dependencies** (other than the included `gg` library).

---

## 📦 Installation

Copy `stripal.js` (and `gg.js`) into your project.

Import as a module:

```js
import stripal from './stripal.js';
```

---

## 🧠 Quick Examples

### 1. Setup & Persistence

```js
import stripal from "./stripal.js";

// Load saved cart from DB named "MyShopDB"
stripal.load("MyShopDB");

stripal.on("load", () => {
    console.log("Cart loaded!", stripal.length(), "items.");
});

// Set global store settings
stripal.currency("USD");
stripal.tax(8.25); // 8.25%
```

### 2. Managing Items

```js
// Create/Add an item
const tshirt = stripal.newItem({
    name: "Cool T-Shirt",
    price: 2500, // stored in cents (integers)
    quantity: 1,
    id: "item_123" // optional custom ID
});

// Add to cart
tshirt.cart();

// Update item
tshirt.increment(); // Quantity -> 2
tshirt.name("Super Cool T-Shirt");

// Calculate totals
console.log(stripal.subtotal()); // 5000 (50.00)
console.log(stripal.total());    // 5413 (54.13 with tax)
```

### 3. Checkout

```js
// Render a Stripe button
const btn = stripal.checkout("stripe", {
    key: "pk_test_...",
    name: "My Store",
    image: "/logo.png"
});

// Add to DOM
gg(document.body).append(btn);

// Listen for success
stripal.on("stripe-checkout-end", (token, args) => {
    // Send token to your server to charge the customer
    console.log("Charged!", token.id);
});
```

---

## 📚 API Reference

### 🟢 Core Cart Methods

| Function | Description |
|----------|-------------|
| `load(dbName)` | Initializes the DB connection and loads saved cart data. |
| `newItem(options)` | Creates a new item object (see Item API below). |
| `get(id)` | Retrieves an item by ID. |
| `items()` | Returns the raw object of all items. |
| `length()` | Returns number of unique items in cart. |
| `quantity()` | Returns total count of all items (sum of quantities). |
| `empty()` | Removes all items from the cart. |

### 🔍 Search

| Function | Description |
|----------|-------------|
| `find(criteria)` | Returns an array of items matching properties. Supports operators: `"<"`, `">"`, `"<="`, `">="`, `"!="`, and Regex. |

```js
// Find items cheaper than $20
const cheapItems = stripal.find({ price: "< 2000" });
```

### 🧮 Calculations & Settings

*All monetary values are integers (cents).*

| Function | Description |
|----------|-------------|
| `subtotal()` | Sum of item totals minus global discount. |
| `total()` | Subtotal plus tax. |
| `currency(code)` | Get/Set currency code (e.g., "USD"). |
| `tax(percent)` | Get/Set tax percentage (e.g., 7.75). |
| `discountflat(amt)` | Get/Set global flat discount amount. |
| `stripeKey(key)` | Get/Set Stripe Public Key. |
| `paypalKey(key)` | Get/Set PayPal Client ID. |

---

### 📦 Item API

Created via `stripal.newItem({ ... })`.

| Property/Method | Description |
|-----------------|-------------|
| `cart()` | Adds the item to the active cart. |
| `remove()` | Removes the item from the active cart. |
| `save()` | Forces a save to DB. |
| `total()` | Calculates total price for this item line (qty * price + extras). |
| `increment([n])` | Increases quantity (default 1). |
| `decrement([n])` | Decreases quantity (default 1). |
| `get(key) / set(key, val)` | Get or set arbitrary custom data (e.g., color, size). |

**Reactive Properties:**
Calling these as functions updates the value and saves.
`name()`, `price()`, `quantity()`, `minimum()`, `step()`, `add()` (markup), `discount()` (markdown).

---

### 💳 Checkout API

| Function | Description |
|----------|-------------|
| `checkout(provider, options)` | Returns a DOM element (button) that triggers the payment flow. |

**Providers:**
*   `"stripe"`: Uses legacy Stripe Checkout (iframe).
*   `"paypal"`: Uses PayPal Buttons API.

**Events:**
*   `stripe-checkout-start` / `stripe-checkout-end`
*   `paypal-checkout-start` / `paypal-checkout-end`

---

## 📄 License

See the [LICENSE](./LICENSE) file for details.
