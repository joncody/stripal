stripal
=======

A simple, elegant shopping cart supporting both Stripe and Paypal checkouts.  Currently supports **USD** as a currency.

## API
#### Global
- **stripal.each**
- **stripal.get**
- **stripal.length**
- **stripal.quantity**
- **stripal.find**
- **stripal.items**
- **stripal.save**
- **stripal.loaded**
- **stripal.empty**
- **stripal.stripeKey**
- **stripal.paypalKey**
- **stripal.currency**
- **stripal.tax**
- **stripal.discountflat**
- **stripal.subtotal**
- **stripal.total**
- **stripal.newItem**
- **stripal.load**
- **stripal.checkout**
```javascript
var stripe_options = {};
var paypal_options = {};
var stripe_button = stripal.checkout("stripe", stripe_options);
var paypal_button = stripal.checkout("paypal", paypal_options);
```
##### Stripe Checkout Options
- **key**
- **token**
- **image**
- **name**
- **description**
- **amount**
- **locale**
- **zipCode**
- **billingAddress**
- **currency**
- **panelLabel**
- **shippingAddress**
- **email**
- **allowRememberMe**
- **opened**
- **closed**
##### Paypal Checkout Options
- **env**
- **locale**
- **client**
- **commit**
- **style**
- **payment**
- **onAuthorize**
- **onCancel**
- **onError**
##### Events
- **"load"**
- **"item-cart"**
- **"item-remove"**
- **"item-update"**
- **"update"**
- **"paypal-checkout-start"**
- **"paypal-checkout-end"**
- **"stripe-checkout-start"**
- **"stripe-checkout-end"**

#### Item
```javascript
var item_options = {};
var item = stripal.newItem(item_options);
```
- **item.stripal_item**
- **item.id**
- **item.save**
- **item.quiet**
- **item.name**
- **item.currency**
- **item.price**
- **item.minimum**
- **item.quantity**
- **item.step**
- **item.add**
- **item.addflat**
- **item.discount**
- **item.discountflat**
- **item.increment**
- **item.decrement**
- **item.total**
- **item.cart**
- **item.remove**
- **item.set**
- **item.get**
- **item.del**
- **item.object**
##### Events
- **"cart"**
- **"remove"**
- **"update"**
