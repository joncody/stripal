stripal
=======

A simple, elegant shopping cart with either a Stripe or Paypal checkout.

# API
## stripal
- stripal.each(_function_)
- stripal.items()
- stripal.quantity()
- stripal.length()
- stripal.get(_number_)
- stripal.newItem(_object_)
- stripal.stripeKey(_string_)
- stripal.paypalKey(_string_)
- stripal.currency(_string_)
- stripal.tax([_number_||_string_])
- stripal.subtotal()
- stripal.total()
- stripal.checkout(_string_[, _object_])
#### events
- stripal.on("cart", _function (item)_);
- stripal.on("remove", _function (item)_);
- stripal.on("update", _function (property, value)_);

## item
- item.stripal_item
- item.id()
- item.name([_string_])
- item.price([_number_||_string_])
- item.add([_number_])
- item.currency([_string_])
- item.minimum([_number_])
- item.quantity([_number_||_string_])
- item.step([_number_||_string_])
- item.discount([_number_||_string_])
- item.increment([_number_||_string_])
- item.decrement([_number_||_string_])
- item.total()
- item.cart()
- item.remove()
- item.set(_string_, _mixed_)
- item.get(_string_)
- item.object()
#### events
- item.on("cart");
- item.on("remove");
- item.on("update", _function (property, value)_);
