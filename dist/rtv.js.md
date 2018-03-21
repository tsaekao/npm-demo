## Objects

<dl>
<dt><a href="#rtvref">rtvref</a> : <code>object</code></dt>
<dd><h1>RTV.js Reference</h1>

<p>Members herein are <em>indirectly</em> exposed through the <a href="#rtv">rtv</a> object.</p>
</dd>
<dt><a href="#rtv">rtv</a> : <code>object</code></dt>
<dd><h1>RTV.js</h1>

<p>Runtime Verification Library for browsers and Node.js.</p>
</dd>
</dl>

<a name="rtvref"></a>

## rtvref : <code>object</code>
<h1>RTV.js Reference</h1>

Members herein are _indirectly_ exposed through the [rtv](#rtv) object.

**Kind**: global namespace  

* [rtvref](#rtvref) : <code>object</code>
    * [.Enumeration](#rtvref.Enumeration)
        * [new Enumeration(map)](#new_rtvref.Enumeration_new)
        * [._values](#rtvref.Enumeration+_values) : <code>Array.&lt;String&gt;</code>
        * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
    * [.qualifiers](#rtvref.qualifiers) : <code>object</code>
        * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>String</code>
        * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>String</code>
        * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>String</code>
    * [.types](#rtvref.types) : <code>object</code>
        * [.ANY](#rtvref.types.ANY) : <code>String</code>
        * [.STRING](#rtvref.types.STRING) : <code>String</code>
        * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>String</code>
        * [.NUMBER](#rtvref.types.NUMBER) : <code>String</code>
        * [.SYMBOL](#rtvref.types.SYMBOL) : <code>String</code>
        * [.FINITE](#rtvref.types.FINITE) : <code>String</code>
        * [.INT](#rtvref.types.INT) : <code>String</code>
        * [.FLOAT](#rtvref.types.FLOAT) : <code>String</code>
        * [.ANY_OBJECT](#rtvref.types.ANY_OBJECT) : <code>String</code>
        * [.OBJECT](#rtvref.types.OBJECT) : <code>String</code>
        * [.PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) : <code>String</code>
        * [.CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) : <code>String</code>
        * [.MAP_OBJECT](#rtvref.types.MAP_OBJECT) : <code>String</code>
        * [.ARRAY](#rtvref.types.ARRAY) : <code>String</code>
        * [.JSON](#rtvref.types.JSON) : <code>String</code>
        * [.FUNCTION](#rtvref.types.FUNCTION) : <code>String</code>
        * [.REGEXP](#rtvref.types.REGEXP) : <code>String</code>
        * [.DATE](#rtvref.types.DATE) : <code>String</code>
        * [.ERROR](#rtvref.types.ERROR) : <code>String</code>
        * [.PROMISE](#rtvref.types.PROMISE) : <code>String</code>
        * [.MAP](#rtvref.types.MAP) : <code>String</code>
        * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>String</code>
        * [.SET](#rtvref.types.SET) : <code>String</code>
        * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>String</code>
        * [.collection_descriptor](#rtvref.types.collection_descriptor) : <code>Object</code>
        * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>String</code> \| <code>Array</code> \| <code>function</code>
        * [.property_validator](#rtvref.types.property_validator) ⇒ <code>boolean</code>
    * [.shape_descriptor](#rtvref.shape_descriptor) : <code>Object</code>

<a name="rtvref.Enumeration"></a>

### rtvref.Enumeration
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.Enumeration](#rtvref.Enumeration)
    * [new Enumeration(map)](#new_rtvref.Enumeration_new)
    * [._values](#rtvref.Enumeration+_values) : <code>Array.&lt;String&gt;</code>
    * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>

<a name="new_rtvref.Enumeration_new"></a>

#### new Enumeration(map)
Simple enumeration type.

**Throws**:

- <code>Error</code> If `map` is falsy or empty.
- <code>Error</code> If `map` has a key that maps to `undefined`.


| Param | Type | Description |
| --- | --- | --- |
| map | <code>Object.&lt;String, \*&gt;</code> | Object mapping keys to values. Values cannot  be `undefined`. |

<a name="rtvref.Enumeration+_values"></a>

#### enumeration._values : <code>Array.&lt;String&gt;</code>
[internal] List of enumeration values.

**Kind**: instance property of [<code>Enumeration</code>](#rtvref.Enumeration)  
<a name="rtvref.Enumeration+verify"></a>

#### enumeration.verify(value, [silent]) ⇒ <code>\*</code>
Validates a value as being in this enumeration. Throws an exception if the value
 is not in this enumeration, unless `silent` is true.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>\*</code> - The specified value if it is in this enumeration, or `undefined` if
 `silent` is true and the value is not in this enumeration.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | Value to check. Cannot be undefined. |
| [silent] | <code>Boolean</code> | <code>false</code> | If truthy, returns `undefined` instead of throwing  an exception if the specified value is not in this enumeration. |

<a name="rtvref.qualifiers"></a>

### rtvref.qualifiers : <code>object</code>
<h2>Qualifiers</h2>

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.qualifiers](#rtvref.qualifiers) : <code>object</code>
    * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>String</code>
    * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>String</code>
    * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>String</code>

<a name="rtvref.qualifiers.REQUIRED"></a>

#### qualifiers.REQUIRED : <code>String</code>
Required qualifier: Property _must_ exist and be of the expected type.
 Depending on the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, and does not
 allow its value to be `null` or `undefined`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  
<a name="rtvref.qualifiers.EXPECTED"></a>

#### qualifiers.EXPECTED : <code>String</code>
Expected qualifier: Property _should_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, does not allow
 its value to be `undefined`, but does _allow_ its value to be `null`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  
<a name="rtvref.qualifiers.OPTIONAL"></a>

#### qualifiers.OPTIONAL : <code>String</code>
Optional qualifier: Property _may_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced (i.e. less so
 than with the `EXPECTED` qualifier).

Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 property value to be `null` as well as `undefined`, and does _not_ require
 the property to be defined anywhere in the prototype chain. If the property
 is defined, then it is treated as an `EXPECTED` value.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  
<a name="rtvref.types"></a>

### rtvref.types : <code>object</code>
<h2>Types</h2>

<h3>Primitives</h3>

In RTV.js, a primitive is considered to be one of the following types:

- `string` (note that `new String('s')` does not produce a _primitive_, it
  produces an _object_, and should generally be avoided).
- `boolean` (note that `new Boolean(true)` does not produce a _primitive_,
  it produces an _object_, and should generally be avoided).
- `number` (note that `new Number(1)` does not produce a _primitive_,
  it produces an _object_, and should generally be avoided).
- `Symbol`
- `null`
- `undefined`

<h3>Rules Per Qualifiers</h3>

[Qualifiers](#rtvref.qualifiers) state basic rules. Unless otherwise stated,
 every type herein abides by those basic rules. Each type will also impose
 additional rules specific to the type of value it represents.

For example, while the [FINITE](#rtvref.types.FINITE) type states that the
 value must not be `NaN`, `+Infinity`, nor `-Infinity`, it could be `null` if
 the qualifier used is `EXPECTED`, and it could be `undefined` if the qualifier
 used is `OPTIONAL`.

<h3>Arguments</h3>

Some types will accept, or may even expect, arguments. An argument immediately
 follows the type in the description, such as `[PLAIN_OBJECT, {hello: STRING}]`.
 This would specify that the value must be a [plain object](#rtvref.types.PLAIN_OBJECT)
 with a shape that includes a property named 'hello', that property being a
 [required](#rtvref.qualifiers.REQUIRED) [string](#rtvref.types.STRING).

Optional and required arguments are specified for each type, where applicable.

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.types](#rtvref.types) : <code>object</code>
    * [.ANY](#rtvref.types.ANY) : <code>String</code>
    * [.STRING](#rtvref.types.STRING) : <code>String</code>
    * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>String</code>
    * [.NUMBER](#rtvref.types.NUMBER) : <code>String</code>
    * [.SYMBOL](#rtvref.types.SYMBOL) : <code>String</code>
    * [.FINITE](#rtvref.types.FINITE) : <code>String</code>
    * [.INT](#rtvref.types.INT) : <code>String</code>
    * [.FLOAT](#rtvref.types.FLOAT) : <code>String</code>
    * [.ANY_OBJECT](#rtvref.types.ANY_OBJECT) : <code>String</code>
    * [.OBJECT](#rtvref.types.OBJECT) : <code>String</code>
    * [.PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) : <code>String</code>
    * [.CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) : <code>String</code>
    * [.MAP_OBJECT](#rtvref.types.MAP_OBJECT) : <code>String</code>
    * [.ARRAY](#rtvref.types.ARRAY) : <code>String</code>
    * [.JSON](#rtvref.types.JSON) : <code>String</code>
    * [.FUNCTION](#rtvref.types.FUNCTION) : <code>String</code>
    * [.REGEXP](#rtvref.types.REGEXP) : <code>String</code>
    * [.DATE](#rtvref.types.DATE) : <code>String</code>
    * [.ERROR](#rtvref.types.ERROR) : <code>String</code>
    * [.PROMISE](#rtvref.types.PROMISE) : <code>String</code>
    * [.MAP](#rtvref.types.MAP) : <code>String</code>
    * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>String</code>
    * [.SET](#rtvref.types.SET) : <code>String</code>
    * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>String</code>
    * [.collection_descriptor](#rtvref.types.collection_descriptor) : <code>Object</code>
    * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>String</code> \| <code>Array</code> \| <code>function</code>
    * [.property_validator](#rtvref.types.property_validator) ⇒ <code>boolean</code>

<a name="rtvref.types.ANY"></a>

#### types.ANY : <code>String</code>
The any type is special in that it allows _anything_, which includes `null`
 and `undefined` values. Because of this, it's the most liberal in terms of
 types as well as qualifiers. A more specific type should be used whenever
 possible to ensure a higher degree of confidence in the value being validated.

Any rules per qualifiers:

- REQUIRED: Property must be defined _somewhere_ in the prototype chain, but
  its value can be anything, including `null` and `undefined`.
- EXPECTED: Same rules as REQUIRED.
- OPTIONAL: Since this qualifier removes the property's need for existence
  in the prototype chain, it renders the verification moot (i.e. the property
  might as well not be included in the [shape descriptor](#rtvref.shape_descriptor)
  unless a [property validator](#rtvref.types.property_validator) is being
  used to do customized verification.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.STRING"></a>

#### types.STRING : <code>String</code>
String rules per qualifiers:

- REQUIRED: Must be a non-empty string.
- EXPECTED | OPTIONAL: Can be an empty string.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.BOOLEAN"></a>

#### types.BOOLEAN : <code>String</code>
Boolean rules per qualifiers: Must be a boolean.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.NUMBER"></a>

#### types.NUMBER : <code>String</code>
Number rules per qualifiers:

- REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
- EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [FINITE](#rtvref.types.FINITE)

<a name="rtvref.types.SYMBOL"></a>

#### types.SYMBOL : <code>String</code>
Symbol rules per qualifiers: Must be a symbol.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.FINITE"></a>

#### types.FINITE : <code>String</code>
Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 value can be either a safe integer or a [floating point number](#rtvref.types.FLOAT).

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="rtvref.types.INT"></a>

#### types.INT : <code>String</code>
Int rules per qualifiers: Must be a [finite](#rtvref.types.FINITE) integer,
 but is not necessarily _safe_.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [FINITE](#rtvref.types.FINITE)
- [FLOAT](#rtvref.types.FLOAT)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="rtvref.types.FLOAT"></a>

#### types.FLOAT : <code>String</code>
Float rules per qualifiers: Must be a finite floating point number.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [INT](#rtvref.types.INT)

<a name="rtvref.types.ANY_OBJECT"></a>

#### types.ANY_OBJECT : <code>String</code>
An _any_ object is anything that is not a [primitive](#rtvref.types), which
 means it includes the `Array` type, as well as functions and arguments. To
 test for an array, use the [ARRAY](#rtvref.types.ARRAY) type. To
 test for a function, use the [FUNCTION](#rtvref.types.FUNCTION) type.

The following values are considered any objects:

- `{}`
- `new Object()`
- `[]`
- `new Array()`
- `function(){}`
- `arguments` (function arguments)
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `/re/`
- `new RegExp('re')`
- `new function() {}` (class instance)
- `new Set()`
- `new WeakSet()`
- `new Map()`
- `new WeakMap()`

The following values __are not__ considered any objects (because they are
 considered to be [primitives](#rtvref.types)):

- `Symbol('s')`
- `true`
- `1`
- `''`
- `null` (NOTE: `typeof null === 'object'` in JavaScript; the `ANY_OBJECT`
  type allows testing for this undesirable fact)
- `undefined`

Any object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional):

- A nested shape description.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)

<a name="rtvref.types.OBJECT"></a>

#### types.OBJECT : <code>String</code>
An object is one that extends from `JavaScript.Object` and is not
 a [function](#rtvref.types.FUNCTION), [array](#rtvref.types.ARRAY),
 [regular expression](#rtvref.types.REGEXP), function arguments object,
 [map](#rtvref.types.MAP), [weak map](#rtvref.types.WEAK_MAP),
 [set](#rtvref.types.SET), [weak set](#rtvref.types.WEAK_SET), nor a
 [primitive](#rtvref.types).

This is the __default__ (imputed) type for
 [shape descriptors](#rtvref.shape_descriptor), which means the object itself
 (the value being tested), prior to being checked against its shape, will be
 tested according to this type.

The following values are considered objects:

- `{}`
- `new Object()`
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `new function() {}` (class instance)

The following values __are not__ considered objects:

- `[]`
- `new Array()`
- `/re/`
- `new RegExp('re')`
- `function(){}`
- `arguments` (function arguments)
- `new Set()`
- `new WeakSet()`
- `new Map()`
- `new WeakMap()`
- `Symbol('s')`
- `true`
- `1`
- `''`
- `null`
- `undefined`

Object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional):

- A nested shape description.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)

<a name="rtvref.types.PLAIN_OBJECT"></a>

#### types.PLAIN_OBJECT : <code>String</code>
A _plain_ object is one that is created directly from the `Object` constructor,
 whether using `new Object()` or the literal `{}`.

The following values are considered plain objects:

- `{}`
- `new Object()`

The following values __are not__ considered plain objects:

- `[]`
- `new Array()`
- `function(){}`
- `arguments` (function arguments)
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `/re/`
- `new RegExp('re')`
- `new function() {}` (class instance)
- `new Set()`
- `new WeakSet()`
- `new Map()`
- `new WeakMap()`
- `Symbol('s')`
- `true`
- `1`
- `''`
- `null`
- `undefined`

Plain object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional):

- A nested shape description.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)

<a name="rtvref.types.CLASS_OBJECT"></a>

#### types.CLASS_OBJECT : <code>String</code>
A _class_ object is one that is created by invoking the `new` operator on a
 function (other than a primitive type function), generating a new object,
 commonly referred to as a _class instance_. This object's prototype
 (`__proto__`) is a reference to that function's `prototype`.

The following values are considered class objects:

- `new function() {}`

The following values __are not__ considered class objects:

- `{}`
- `new Object()`
- `[]`
- `new Array()`
- `function(){}`
- `arguments` (function arguments)
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `/re/`
- `new RegExp('re')`
- `new Set()`
- `new WeakSet()`
- `new Map()`
- `new WeakMap()`
- `Symbol('s')`
- `true`
- `1`
- `''`
- `null`
- `undefined`

Class object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional, specify one or the other, or both __in order__):

- A reference to a constructor function. If specified, the class object
  (instance) must have this class function in its inheritance chain such
  that `<class_object> instanceof <function> === true`.
- A nested [shape descriptor](#rtvref.shape_descriptor).

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)

<a name="rtvref.types.MAP_OBJECT"></a>

#### types.MAP_OBJECT : <code>String</code>
A _map_ object is an [OBJECT](#rtvref.types.OBJECT) that is treated as a
 hash map with an expected set of keys and values. Keys can be described
 using a regular expression, and values can be described using a
 [typeset](#rtvref.types.typeset). Empty maps are permitted.

Map object rules per qualifiers: Same as [OBJECT](#rtvref.types.OBJECT) rules.

Argument (optional):

- A [collection descriptor](#rtvref.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply. __NOTE:__ Since a map object
  is based on a JavaScript Object (which only supports string-based keys), the
  collection descriptor's `keys` type defaults to (and is required to be)
  [STRING](#rtvref.types.STRING).

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP](#rtvref.types.MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)

<a name="rtvref.types.ARRAY"></a>

#### types.ARRAY : <code>String</code>
Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.JSON"></a>

#### types.JSON : <code>String</code>
JSON rules per qualifiers: Must be a JSON value:

- [string](#rtvref.types.STRING), however __empty strings__ are permitted,
  even if the qualifier is `REQUIRED`;
- [boolean](#rtvref.types.BOOLEAN);
- [finite number](#rtvref.types.FINITE);
- [plain object](#rtvref.types.PLAIN_OBJECT);
- [array](#rtvref.types.ARRAY);
- `null`

Since this type checks for _any_ valid JSON value, empty string and `null`
 values are permitted, even when the typeset is qualified as `REQUIRED`.
 Therefore, the `REQUIRED` qualifier has the same effect as the `EXPECTED`
 qualifier.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.FUNCTION"></a>

#### types.FUNCTION : <code>String</code>
Function rules per qualifiers: Must be a `function`.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.REGEXP"></a>

#### types.REGEXP : <code>String</code>
RegExp rules per qualifiers: Must be a `RegExp` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

<a name="rtvref.types.DATE"></a>

#### types.DATE : <code>String</code>
Date rules per qualifiers: Must be a `Date` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

<a name="rtvref.types.ERROR"></a>

#### types.ERROR : <code>String</code>
Error rules per qualifiers: Must be an `Error` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

<a name="rtvref.types.PROMISE"></a>

#### types.PROMISE : <code>String</code>
Promise rules per qualifiers: Must be a `Promise` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<a name="rtvref.types.MAP"></a>

#### types.MAP : <code>String</code>
An ES6 map supports any object as its keys, unlike a
 [MAP_OBJECT](#rtvref.types.MAP_OBJECT) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtvref.types.typeset). Empty maps are permitted.

Map rules per qualifiers: Must be a `Map` instance.

Argument (optional):

- A [collection descriptor](#rtvref.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)

<a name="rtvref.types.WEAK_MAP"></a>

#### types.WEAK_MAP : <code>String</code>
An ES6 weak map supports any object as its keys, unlike a
 [MAP_OBJECT](#rtvref.types.MAP_OBJECT) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtvref.types.typeset). Empty maps are permitted.

Weak map rules per qualifiers: Must be a `WeakMap` instance.

Argument (optional):

- A [collection descriptor](#rtvref.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [MAP](#rtvref.types.MAP)

<a name="rtvref.types.SET"></a>

#### types.SET : <code>String</code>
An ES6 set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtvref.types.typeset). Empty sets are permitted.

Set rules per qualifiers: Must be a `Set` instance.

Argument (optional):

- A [collection descriptor](#rtvref.types.collection_descriptor) specifying
  the rules for the values found in the set (note that key-related rules are
  ignored since they are not applicable). If not specified, the default
  collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [WEAK_SET](#rtvref.types.WEAK_SET)

<a name="rtvref.types.WEAK_SET"></a>

#### types.WEAK_SET : <code>String</code>
An ES6 weak set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtvref.types.typeset). Empty sets are permitted.

Weak set rules per qualifiers: Must be a `WeakSet` instance.

Argument (optional):

- A [collection descriptor](#rtvref.types.collection_descriptor) specifying
  the rules for the values found in the set (note that key-related rules are
  ignored since they are not applicable). If not specified, the default
  collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [SET](#rtvref.types.SET)

<a name="rtvref.types.collection_descriptor"></a>

#### types.collection_descriptor : <code>Object</code>
<h3>Collection Descriptor</h3>

Describes the keys and values in a collection-based object, which is one of
 the following types:

- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [MAP](#rtvref.types.MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)
- [SET](#rtvref.types.SET) (with some exceptions)
- [WEAK_SET](#rtvref.types.WEAK_SET) (with some exceptions)

Note that an [ARRAY](#rtvref.types.ARRAY) is __not__ included in this list
 because the array type has special syntax for describing the type of its items.

For example, the following descriptors both verify a collection of 3-letter
 string keys (upper- or lowercase) to finite numbers:

- `{keyExp: '[a-z]{3}', keyExpFlags: 'i', values: rtv.t.FINITE}`
- `{keyExp: '[a-zA-Z]{3}', values: rtv.t.FINITE}`

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**

- rtvref.types.MAP_OBJECT
- rtvref.types.MAP
- rtvref.types.WEAK_MAP
- rtvref.types.SET
- rtvref.types.WEAK_SET

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [keys] | [<code>typeset</code>](#rtvref.types.typeset) |  | Optional. A typeset describing each key  in the collection. The type of collection being described may restrict the types that this typeset  can include. For example, the [MAP_OBJECT](#rtvref.types.MAP_OBJECT) collection  only supports the [STRING](#rtvref.types.STRING) type due to the nature of  its JavaScript Object-based implementation. NOTE: This property is ignored when the collection is a [SET](#rtvref.types.SET)  or a [WEAK_SET](#rtvref.types.WEAK_SET) because sets do not have keys. |
| [keyExp] | <code>String</code> |  | Optional. A string-based regular expression  describing the names of keys (own-enumerable properties) found in the  collection. By default, there are no restrictions on key names. This expression is only  used if the `keys` typeset includes the [STRING](#rtvref.types.STRING) type. For example, to require numerical keys, the following expression could be  used: `'^\\d+$'`. NOTE: This property is ignored when the collection is a [SET](#rtvref.types.SET)  or a [WEAK_SET](#rtvref.types.WEAK_SET) because sets do not have keys. |
| [keyExpFlags] | <code>String</code> |  | Optional. A string specifying any flags to use  with the regular expression specified in `keyExp`. If this property is _falsy_,  default `RegExp` flags will be used. Ignored if `keyExp` is not specified, or  does not apply per the `keys` typeset. NOTE: This property is ignored when the collection is a [SET](#rtvref.types.SET)  or a [WEAK_SET](#rtvref.types.WEAK_SET) because sets do not have keys. |
| [values] | [<code>typeset</code>](#rtvref.types.typeset) |  | Optional. A typeset describing each value  in the collection. Defaults to the [ANY](#rtvref.types.ANY) type which allows  _anything_. All values must match this typeset (but the collection is not  required to have any entries/properties to be considered valid, unless  `count` is specified). For example, to require arrays of non-empty string values, the following  typeset could be used: `[[types.STRING]]`. |
| [count] | <code>Number</code> | <code>-1</code> | Optional. The number of entries expected in  the collection. A negative value allows for any number of entries. Zero  requires an empty collection. |

<a name="rtvref.types.typeset"></a>

#### types.typeset : <code>Object</code> \| <code>String</code> \| <code>Array</code> \| <code>function</code>
<h3>Typeset</h3>

Describes the possible types for a given value. It can be any one of the following
 JavaScript types:

- `Object`: For the root or a nested [shape descriptor](#rtvref.shape_descriptor)
  of _implied_ [OBJECT](#rtvref.types.OBJECT) type (unless qualified with a specific
  object type like [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT), for example).
- `String`: For a single type, such as ['FINITE'](#rtvref.types.FINITE)
  for a finite number.
- `Array`: For multiple type possibilities, optionally [qualified](#rtvref.qualifiers),
  using an __OR__ conjunction, which means the value of the property being described must
  be at least one of the types listed, but not all. Note that when a nested array is
  encountered (i.e. an array within a typeset), it is treated as the shortcut
  [ARRAY](#rtvref.types.ARRAY) form, implying an array of nested typesets, e.g.
  `values: [BOOLEAN, [STRING, FINITE]]` would describe a 'values' property that should
  be a boolean, or an array of non-empty strings or finite numbers.
- `Function`: For a [property validator](#rtvref.types.property_validator)
  that will verify the value of the property using custom code. Only one validator
  can be specified for a given typeset, and it will only be called if the value
  was verified against at least one of the other types listed. If no other types
  were listed (i.e. using the `Array` form, as described above), then the validator
  is called immediately.

Note that all typesets use an _implied_ [required](#rtvref.qualifiers.REQUIRED)
 qualifier unless otherwise specified. To qualify a typeset, a
 [qualifier](#rtvref.qualifiers) may be specified as the __first__ element
 in the `Array` form (if specified, it must be the first element). For example,
 `note: [rtv.q.EXPECTED, rtv.t.STRING]` would describe an expected, but not required,
 string, which could therefore be either empty or even `null`. The `Array` form
 must be used in order to qualify a typeset as other than required, and the
 qualifier applies to all immediate types in the typeset (which means each
 nested typeset can have its own qualifier).

<h4>Example: Object</h4>

<pre><code>const contactShape = {
  name: rtv.t.STRING, // required, non-empty, string
  tags: [rtv.t.ARRAY, [rtv.t.STRING]], // required array of non-empty strings
  // tags: [[rtv.t.STRING]], // same as above, but using shortcut array format
  details: { // required nested object of type `rtv.t.OBJECT` (default)
    birthday: [rtv.q.EXPECTED, rtv.t.DATE] // Date (could be null)
  },
  notes: [rtv.q.OPTIONAL, rtv.t.STRING, function(value) { // optional string...
    return !value || value.length < 500; // ...less than 500 characters long, if specified
  }]
};

const contact = {
  name: 'John Doe',
  tags: ['colleagues', 'sports'],
  details: {
    birthday: null // not specified
  }
};

rtv.verify(contact, contactShape); // OK

const walletShape = {
  contacts: [[contactShape]], // list of contacts using nested shape
  address: {
    street: rtv.t.STRING
    // ...
  },
  money: rtv.t.FINITE
};

rtv.verify({
  contacts: [contact],
  address: {street: '123 Main St'},
  money: 100
}, walletShape); // OK
</code></pre>

<h4>Example: String</h4>

<pre><code>rtv.verify('foo', rtv.t.STRING); // OK
rtv.verify('foo', rtv.t.FINITE); // ERROR
</code></pre>

<h4>Example: Array</h4>

<pre><code>const typeset = [rtv.t.STRING, rtv.t.FINITE]; // non-empty string, or finite number
rtv.verify('foo', typeset); // OK
rtv.verify(1, typeset); // OK
</code></pre>

<h4>Example: Function</h4>

<pre><code>rtv.verify(123, (v) => v > 100); // OK
rtv.verify('123', [rtv.t.STRING, (v) => parseInt(v) > 100); // OK
</code></pre>

<h4>Example: Alternate Qualifier</h4>

<pre><code>const person = {
  name: rtv.t.STRING, // required, non-empty
  age: [rtv.q.OPTIONAL, rtv.t.FINITE, (v) => v >= 18] // 18 or older, if specified
};
rtv.verify({name: 'Bob'}, person); // OK
rtv.verify({name: ''}, person); // ERROR
rtv.verify({name: 'Steve', age: 17}, person); // ERROR
rtv.verify({name: 'Steve', age: null}, person); // OK
</code></pre>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.property_validator"></a>

#### types.property_validator ⇒ <code>boolean</code>
<h3>Property Validator</h3>

A function used as a [typeset](#rtvref.types.typeset), or as a subset to
 a typeset, to provide custom verification of the value being verified.

A typeset may only have one validator, and the validator is only called if
 the value being verified was verified by at least one type in the typeset.
 The position of the validator within the typeset (if the typeset is an array),
 does not change when the validator is invoked (i.e. before one type or after
 another; it's always called last, if called at all).

There is one disadvantage to using a property validator: It cannot be de/serialized
 via JSON, which means it cannot be transmitted or persisted. One option would be
 to customize the de/serialization to JSON by serializing the validator to a
 special object with properties that would inform the deserialization process
 on how to reconstruct the validator dynamically.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**Returns**: <code>boolean</code> - `true` to verify the value, `false` to reject it.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value being verified. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Reference to the typeset used for  verification. Note that the typeset may contain nested typeset(s), and may  be part of a larger parent typeset (though there would be no reference to  the parent typeset, if any). |

<a name="rtvref.shape_descriptor"></a>

### rtvref.shape_descriptor : <code>Object</code>
<h2>Shape Descriptor</h2>

// TODO: document rtvref.shape_descriptor (already referenced). The 'Object'
//  type here means an actual Object, NOT anything that could be an object
//  like Array, Function, etc.

Describes the shape (i.e. interface) of an object as a map of expected or
 possible properties to [typesets](#rtvref.types.typeset).

**Kind**: static typedef of [<code>rtvref</code>](#rtvref)  
<a name="rtv"></a>

## rtv : <code>object</code>
<h1>RTV.js</h1>

Runtime Verification Library for browsers and Node.js.

**Kind**: global namespace  

* [rtv](#rtv) : <code>object</code>
    * [.t](#rtv.t) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.q](#rtv.q) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [._version](#rtv._version) : <code>String</code>
    * [.check(value, shape)](#rtv.check) ⇒ <code>Boolean</code>
    * [.verify(value, shape)](#rtv.verify) ⇒ <code>Boolean</code>

<a name="rtv.t"></a>

### rtv.t : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration of [types](#rtvref.types).

**Kind**: static property of [<code>rtv</code>](#rtv)  
<a name="rtv.q"></a>

### rtv.q : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration of [qualifiers](#rtvref.qualifiers).

**Kind**: static property of [<code>rtv</code>](#rtv)  
<a name="rtv._version"></a>

### rtv._version : <code>String</code>
[internal] Library version.

**Kind**: static property of [<code>rtv</code>](#rtv)  
<a name="rtv.check"></a>

### rtv.check(value, shape) ⇒ <code>Boolean</code>
Checks a value against a shape for compliance.

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: <code>Boolean</code> - `true` if the `value` is compliant to the `shape`; `false`
 otherwise. An exception is __not__ thrown if the `value` is non-compliant.  
**See**: rtv.verify  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| shape | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of the value. |

<a name="rtv.verify"></a>

### rtv.verify(value, shape) ⇒ <code>Boolean</code>
__Requires__ a value to be compliant to a shape.

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: <code>Boolean</code> - `true` if the `value` is compliant to the `shape`; otherwise,
 an exception is thrown.  
**Throws**:

- <code>Error</code> If the `value` is not compliant to the `shape`.

**See**: rtv.verify  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| shape | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of the value. |

