stripal
=======

A simple, elegant shopping cart with either a Stripe or Paypal checkout.

# API
## stripal
- stripal.each(_function_)
- stripal.get(_number_)
- stripal.length()
- stripal.quantity()
- stripal.find([_object_])
- stripal.items()
- stripal.save()
- stripal.loaded()
- stripal.empty()
- stripal.stripeKey(_string_)
- stripal.paypalKey(_string_)
- stripal.currency(_string_)
- stripal.tax([_number_||_string_])
- stripal.discountflat([_number_||_string_])
- stripal.subtotal()
- stripal.total()
- stripal.newItem(_object_)
- stripal.load(_string_)
- stripal.checkout(_string_[, _object_])
#### events
- stripal.on("load", _function () {}_);
- stripal.on("item-cart", _function (item) {}_);
- stripal.on("item-remove", _function (item) {}_);
- stripal.on("item-update", _function (item, property, value) {}_);
- stripal.on("update", _function (property, value) {}_);
- stripal.on("paypal-checkout-start", _function (payment) {}_);
- stripal.on("paypal-checkout-end", _function (data) {}_);
- stripal.on("stripe-checkout-start", _function () {}_);
- stripal.on("stripe-checkout-end", _function (token, args) {}_);

## item
- item.stripal_item
- item.id
- item.save()
- item.quiet([_boolean_])
- item.name([_string_])
- item.currency([_string_])
- item.price([_number_||_string_])
- item.minimum([_number_])
- item.quantity([_number_||_string_])
- item.step([_number_||_string_])
- item.add([_number_||_string_])
- item.addflat([_number_||_string_])
- item.discount([_number_||_string_])
- item.discountflat([_number_||_string_])
- item.increment([_number_||_string_])
- item.decrement([_number_||_string_])
- item.total()
- item.cart()
- item.remove()
- item.set(_string_, _mixed_)
- item.get(_string_)
- item.del(_string_)
- item.object()
#### events
- item.on("cart", _function () {}_);
- item.on("remove", _function () {}_);
- item.on("update", _function (property, value) {}_);
