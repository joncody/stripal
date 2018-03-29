stripal
=======

A simple, elegant shopping cart with either a Stripe or Paypal checkout.

# API
## stripal
- stripal.each(_function_)
- stripal.newItem(_object_)
- stripal.stripeKey(_string_)
- stripal.paypalKey(_string_)
- stripal.currency(_string_)
- stripal.tax([_number_])
- stripal.subtotal()
- stripal.total()
- stripal.checkout(_string_[, _object_])

## item
- item.name([_string_])
- item.price([_number_||_string_])
- item.currency([_string_])
- item.quantity([_number_||_string_])
- item.step([_number_||_string_])
- item.discount([_number_||_string_])
- item.increment([_number_||_string_])
- item.decrement([_number_||_string_])
- item.total()
- item.add()
- item.remove()
- item.set(_string_, _mixed_)
- item.get(_string_)
- item.object()
