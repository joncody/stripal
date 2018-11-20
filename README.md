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
##### load
##### item-cart
##### item-remove
##### item-update
##### update
##### paypal-checkout-start
##### paypal-checkout-end
##### stripe-checkout-start
##### stripe-checkout-end

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

#### Events
##### cart
##### remove
##### update
