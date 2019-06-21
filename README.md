stripal
=======

A simple, elegant shopping cart supporting both Stripe and Paypal checkouts.  Currently supports **USD** as a currency.

# API
## Table Of Contents
- [stripal](#stripal)
  - [each](#eachfn)
  - [get](#getid---item)
  - [length](#length---number)
  - [quantity](#quantity---number)
  - [find]()
  - [items]()
  - [save]()
  - [loaded]()
  - [empty]()
  - [stripeKey]()
  - [paypalKey]()
  - [currency]()
  - [tax]()
  - [discountflat]()
  - [subtotal]()
  - [newItem]()
  - [load]()
  - [checkout]()
- [Item](#item)
  - [stripal_item]()
  - [id]()
  - [save]()
  - [quiet]()
  - [name]()
  - [currency]()
  - [price]()
  - [minimum]()
  - [quantity]()
  - [step]()
  - [add]()
  - [addflat]()
  - [discount]()
  - [discountflat]()
  - [increment]()
  - [decrement]()
  - [total]()
  - [cart]()
  - [remove]()
  - [set]()
  - [get]()
  - [del]()
  - [object]()

### stripal
> The only global variable and entry point.
#### Methods
##### each(fn)
> Iterate through each Item passing it to the function argument.
###### Parameters
Name | Type | Description
---- | ---- | -----------
fn | Function | The function to run on each Item.
<br/>

##### get(id) _-> {Item}_
> Gets a saved Item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
id | Number | The unique identifier of the Item.
<br/>

##### length() _-> {Number}_
> Gets the amount of saved Items.

<br/>

##### quantity() _-> {Number}_
> Gets the accumulated sum of all Item quantities.

<br/>

##### find(properties) _-> {Array}_
> Gets the items that match the rules defined in the passed argument.
###### Parameters
Name | Type | Description
---- | ---- | -----------
properties | Object | The rules to match - keys and values map to Item. Values may be preceded by operators: "<=", ">=", "!=", "<", ">". Values can be a RegExp or any other type.
<br/>

##### items() _-> {Object}_
> Gets the cart as an object - keys are Item ids and values are the corresponding Item.

<br/>

##### save()
> Updates the current cart values in the indexedDB database.

<br/>

##### loaded() _-> {Boolean}_
> Indicates the cart loading status.

<br/>

##### empty()
> Removes all Items from the cart.

<br/>

##### stripeKey(key) _-> {String}_
> Gets or sets the Stripe API key.
###### Parameters
Name | Type | Description
---- | ---- | -----------
key | String (optional) | The API key.

<br/>

##### paypalKey(key) _-> {String}_
> Gets or sets the Paypal API key.
###### Parameters
Name | Type | Description
---- | ---- | -----------
key | String (optional) | The API key.

<br/>

##### currency(currency) _-> {String}_
> Gets or sets the cart currency.
###### Parameters
Name | Type | Description
---- | ---- | -----------
currency | String (optional) | The currency code.

<br/>

##### tax(tax) _-> {Number}_
> Gets or sets the tax rate percentage.
###### Parameters
Name | Type | Description
---- | ---- | -----------
tax | Number (optional, default: 7.75) | The tax rate.

<br/>

##### discountflat(discountflat) _-> {Number}_
> Gets or sets a flat discount amount.
###### Parameters
Name | Type | Description
---- | ---- | -----------
discountflat | Number (optional) | The discount amount.

<br/>

##### subtotal() _-> {Number}_
> Gets the total cart price without tax.

<br/>

##### total() _-> {Number}_
> Gets the total cart price with tax.

<br/>

##### newItem(opts) _-> {Item}_
> Creates a new Item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
opts | Object (optional) | The properties to assign to the Item.

<br/>

##### load(dbname)
> Opens an indexedDB database and loads any values to the cart.
###### Parameters
Name | Type | Description
---- | ---- | -----------
dbname | String | The name of the database.

<br/>

##### checkout(type, opts) _-> {GObject}_
> Starts the checkout process.
###### Parameters
Name | Type | Description
---- | ---- | -----------
type | String | The checkout method - "stripe" or "paypal".
opts | Object (optional) | The method specific checkout options.

<br/>

#### Events
Name | Parameters | Description
---- | ---------- | -----------
load | | Fired after the Stripal database is loaded.
item-cart | Item | Fired when an item has been added to the cart.
item-remove | Item | Fired when an item has been removed from the cart.
item-update | Item, Key, Value (optional) | Fired when an item is updated always passing the key and, if the attribute was not deleted, the value.
paypal-checkout-start | Payment Options Object | Fired when a PayPal checkout process has started.
paypal-checkout-end | | Payment Data Object | Fired when a PayPal checkout process has been authorized.
stripe-checkout-start | | Fired when a Stripe checkout process starts.
stripe-checkout-end | Token, Args | Fired when a Stripe checkout process ends.

<br/>

### Item
> A stripal item.
###### Properties
Name | Type | Description
---- | ---- | -----------
stripal_item | Boolean | Indicator of a stripal item.
id | Number | The unique identifier.

#### Methods
##### save()
> Saves the Item to the cart.

<br/>

##### quiet(quiet)
> Gets or sets the option to emit events.
###### Parameters
Name | Type | Description
---- | ---- | -----------
quiet | Boolean (optional) | Determines event emission.
<br/>

##### name(name)
> Gets or sets the item name.
###### Parameters
Name | Type | Description
---- | ---- | -----------
name | String (optional) | The item name.
<br/>

##### currency(currency)
> Gets or sets the currency for the item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
currency | String (optional, default: "USD") | The currency code.
<br/>

##### price(price)
> Gets or sets the price of the item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
price | Number (optional) | The price of the item.
<br/>

##### minimum(minimum)
> Gets or sets the minimum quantity which must be purchased.
###### Parameters
Name | Type | Description
---- | ---- | -----------
minimum | Number (optional, default: 1) | The minimum quantity.
<br/>

##### quantity(quantity)
> Gets or sets the quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
quantity | Number (optional, default: 1) | The quantity.
<br/>

##### step(step)
> Gets or sets the step when calling increment() and decrement()
###### Parameters
Name | Type | Description
---- | ---- | -----------
step | Number (optional, default: 1) | The quantity to increase and decrease by.
<br/>

##### add(add)
> Gets or sets the additional amount to add to the price of each item considering the quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
add | Number (optional) | The amount to add.
<br/>

##### addflat(addflat)
> Gets or sets a flat, additional amount to add to the price of each item not considering quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
addflat | Number (optional) | The flat amount to add.
<br/>

##### discount(discount)
> Gets or sets the additional amount to subtract from the price of each item considering the quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
discount | Number (optional) | The amount to subtract.
<br/>

##### discountflat(discountflat)
> Gets or sets a flat amount to subtract from the price of each item not considering quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
discountflat | Number (optional) | The flat amount to subtract.
<br/>

##### increment(inc)
> Increases the quantity by the passed value or by the step and returns the quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
inc | Number (optional) | The amount to increase the quantity by.
<br/>

##### decrement(dec)
> Decreases the quantity by the passed value or by the step and returns the quantity.
###### Parameters
Name | Type | Description
---- | ---- | -----------
dec | Number (optional) | The amount to decrease the quantity by.
<br/>

##### total
> Gets the total price.

<br/>

##### cart
> Adds the item to the cart.

<br/>

##### remove
> Removes the item from the cart.

<br/>

##### set(key, value)
> Sets or updates an attribute on the item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
key | String | The attribute name.
value | Any | The value.
<br/>

##### get(key)
> Gets the value of an attribute on the item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
key | String | The attribute name.
<br/>

##### del(key)
> Removes an attribute from the item.
###### Parameters
Name | Type | Description
---- | ---- | -----------
key | String | The attribute name.
<br/>

##### object(added)
> Essentially "unwraps" the item and returns its current state as an object.
###### Parameters
Name | Type | Description
---- | ---- | -----------
added | Boolean | If true then the returned object will exclude default item properties
<br/>

#### Events
Name | Parameters | Description
---- | ---------- | -----------
cart | Item | Fired when the item is added to the cart.
remove | Item | Fired when the item is removed from the cart.
update | Item, Key, Value (optional) | Fired when an item is updated always passing the key and, if the attribute was not deleted, the value.
