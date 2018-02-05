<a name="rtv"></a>

## rtv : <code>object</code>
RTV.js

**Kind**: global namespace  

* [rtv](#rtv) : <code>object</code>
    * [.Enumeration](#rtv.Enumeration)
        * [new Enumeration(map)](#new_rtv.Enumeration_new)
        * [._values](#rtv.Enumeration+_values) : <code>Array.&lt;String&gt;</code>
        * [.validate(value, [silent])](#rtv.Enumeration+validate) ⇒ <code>\*</code>
    * [.qualifiers](#rtv.qualifiers) : <code>object</code>
        * [.REQUIRED](#rtv.qualifiers.REQUIRED) : <code>String</code>
        * [.EXPECTED](#rtv.qualifiers.EXPECTED) : <code>String</code>
        * [.OPTIONAL](#rtv.qualifiers.OPTIONAL) : <code>String</code>
    * [.types](#rtv.types) : <code>object</code>
        * [.ANY](#rtv.types.ANY) : <code>String</code>
        * [.STRING](#rtv.types.STRING) : <code>String</code>
        * [.BOOLEAN](#rtv.types.BOOLEAN) : <code>String</code>
        * [.NUMBER](#rtv.types.NUMBER) : <code>String</code>
        * [.SYMBOL](#rtv.types.SYMBOL) : <code>String</code>
        * [.FINITE](#rtv.types.FINITE) : <code>String</code>
        * [.INT](#rtv.types.INT) : <code>String</code>
        * [.FLOAT](#rtv.types.FLOAT) : <code>String</code>
        * [.ANY_OBJECT](#rtv.types.ANY_OBJECT) : <code>String</code>
        * [.OBJECT](#rtv.types.OBJECT) : <code>String</code>
        * [.PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT) : <code>String</code>
        * [.CLASS_OBJECT](#rtv.types.CLASS_OBJECT) : <code>String</code>
        * [.MAP_OBJECT](#rtv.types.MAP_OBJECT) : <code>String</code>
        * [.ARRAY](#rtv.types.ARRAY) : <code>String</code>
        * [.JSON](#rtv.types.JSON) : <code>String</code>
        * [.FUNCTION](#rtv.types.FUNCTION) : <code>String</code>
        * [.REGEXP](#rtv.types.REGEXP) : <code>String</code>
        * [.DATE](#rtv.types.DATE) : <code>String</code>
        * [.ERROR](#rtv.types.ERROR) : <code>String</code>
        * [.PROMISE](#rtv.types.PROMISE) : <code>String</code>
        * [.MAP](#rtv.types.MAP) : <code>String</code>
        * [.WEAK_MAP](#rtv.types.WEAK_MAP) : <code>String</code>
        * [.SET](#rtv.types.SET) : <code>String</code>
        * [.WEAK_SET](#rtv.types.WEAK_SET) : <code>String</code>
        * [.collection_descriptor](#rtv.types.collection_descriptor) : <code>Object</code>
        * [.typeset](#rtv.types.typeset) : <code>Object</code>
        * [.property_validator](#rtv.types.property_validator) : <code>function</code>
    * [.shape_descriptor](#rtv.shape_descriptor) : <code>Object</code>

<a name="rtv.Enumeration"></a>

### rtv.Enumeration
**Kind**: static class of [<code>rtv</code>](#rtv)  

* [.Enumeration](#rtv.Enumeration)
    * [new Enumeration(map)](#new_rtv.Enumeration_new)
    * [._values](#rtv.Enumeration+_values) : <code>Array.&lt;String&gt;</code>
    * [.validate(value, [silent])](#rtv.Enumeration+validate) ⇒ <code>\*</code>

<a name="new_rtv.Enumeration_new"></a>

#### new Enumeration(map)
Simple enumeration type.

**Throws**:

- <code>Error</code> If `map` is falsy or empty.
- <code>Error</code> If `map` has a key that maps to `undefined`.


| Param | Type | Description |
| --- | --- | --- |
| map | <code>Object.&lt;String, \*&gt;</code> | Object mapping keys to values. Values cannot  be `undefined`. |

<a name="rtv.Enumeration+_values"></a>

#### enumeration._values : <code>Array.&lt;String&gt;</code>
[internal] List of enumeration values.

**Kind**: instance property of [<code>Enumeration</code>](#rtv.Enumeration)  
<a name="rtv.Enumeration+validate"></a>

#### enumeration.validate(value, [silent]) ⇒ <code>\*</code>
Validates a value as being in this enumeration. Throws an exception if the value
 is not in this enumeration, unless `silent` is true.

**Kind**: instance method of [<code>Enumeration</code>](#rtv.Enumeration)  
**Returns**: <code>\*</code> - The specified value if it is in this enumeration, or `undefined` if
 `silent` is true and the value is not in this enumeration.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | Value to check. Cannot be undefined. |
| [silent] | <code>Boolean</code> | <code>false</code> | If truthy, returns `undefined` instead of throwing  an exception if the specified value is not in this enumeration. |

<a name="rtv.qualifiers"></a>

### rtv.qualifiers : <code>object</code>
Qualifiers

**Kind**: static namespace of [<code>rtv</code>](#rtv)  

* [.qualifiers](#rtv.qualifiers) : <code>object</code>
    * [.REQUIRED](#rtv.qualifiers.REQUIRED) : <code>String</code>
    * [.EXPECTED](#rtv.qualifiers.EXPECTED) : <code>String</code>
    * [.OPTIONAL](#rtv.qualifiers.OPTIONAL) : <code>String</code>

<a name="rtv.qualifiers.REQUIRED"></a>

#### qualifiers.REQUIRED : <code>String</code>
Required qualifier: Property _must_ exist and be of the expected type.
 Depending on the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, and does not
 allow its value to be `null` or `undefined`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtv.qualifiers)  
**See**: [types](#rtv.types)  
<a name="rtv.qualifiers.EXPECTED"></a>

#### qualifiers.EXPECTED : <code>String</code>
Expected qualifier: Property _should_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, does not allow
 its value to be `undefined`, but does _allow_ its value to be `null`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtv.qualifiers)  
**See**: [types](#rtv.types)  
<a name="rtv.qualifiers.OPTIONAL"></a>

#### qualifiers.OPTIONAL : <code>String</code>
Optional qualifier: Property _may_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced (i.e. less so
 than with the `EXPECTED` qualifier).

Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 property value to be `null` as well as `undefined`, and does _not_ require
 it to be defined anywhere in the prototype chain. If the property is defined,
 then it is treated as an `EXPECTED` value.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtv.qualifiers)  
**See**: [types](#rtv.types)  
<a name="rtv.types"></a>

### rtv.types : <code>object</code>
Types

<h4>Primitives</h4>

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

<h4>Rules Per Qualifiers</h4>

[Qualifiers](#rtv.qualifiers) state basic rules. Unless otherwise stated,
 every type herein abides by those basic rules. Each type will also impose
 additional rules specific to the type of value it represents.

For example, while the [FINITE](#rtv.types.FINITE) type states that the
 value must not be `NaN`, `+Infinity`, nor `-Infinity`, it could be `null` if
 the qualifier used is `EXPECTED`, and it could be `undefined` if the qualifier
 used is `OPTIONAL`.

<h4>Arguments</h4>

Some types will accept, or may even expect, arguments. An argument immediately
 follows the type in the description, such as `PLAIN_OBJECT, {hello: STRING}`.
 This would specify that the value must be a [plain object](#rtv.types.PLAIN_OBJECT)
 with a shape that includes a property named 'hello', that property being a
 [required](#rtv.qualifiers.REQUIRED) [string](#rtv.types.STRING).

Optional and required arguments are specified for each type, where applicable.

**Kind**: static namespace of [<code>rtv</code>](#rtv)  

* [.types](#rtv.types) : <code>object</code>
    * [.ANY](#rtv.types.ANY) : <code>String</code>
    * [.STRING](#rtv.types.STRING) : <code>String</code>
    * [.BOOLEAN](#rtv.types.BOOLEAN) : <code>String</code>
    * [.NUMBER](#rtv.types.NUMBER) : <code>String</code>
    * [.SYMBOL](#rtv.types.SYMBOL) : <code>String</code>
    * [.FINITE](#rtv.types.FINITE) : <code>String</code>
    * [.INT](#rtv.types.INT) : <code>String</code>
    * [.FLOAT](#rtv.types.FLOAT) : <code>String</code>
    * [.ANY_OBJECT](#rtv.types.ANY_OBJECT) : <code>String</code>
    * [.OBJECT](#rtv.types.OBJECT) : <code>String</code>
    * [.PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT) : <code>String</code>
    * [.CLASS_OBJECT](#rtv.types.CLASS_OBJECT) : <code>String</code>
    * [.MAP_OBJECT](#rtv.types.MAP_OBJECT) : <code>String</code>
    * [.ARRAY](#rtv.types.ARRAY) : <code>String</code>
    * [.JSON](#rtv.types.JSON) : <code>String</code>
    * [.FUNCTION](#rtv.types.FUNCTION) : <code>String</code>
    * [.REGEXP](#rtv.types.REGEXP) : <code>String</code>
    * [.DATE](#rtv.types.DATE) : <code>String</code>
    * [.ERROR](#rtv.types.ERROR) : <code>String</code>
    * [.PROMISE](#rtv.types.PROMISE) : <code>String</code>
    * [.MAP](#rtv.types.MAP) : <code>String</code>
    * [.WEAK_MAP](#rtv.types.WEAK_MAP) : <code>String</code>
    * [.SET](#rtv.types.SET) : <code>String</code>
    * [.WEAK_SET](#rtv.types.WEAK_SET) : <code>String</code>
    * [.collection_descriptor](#rtv.types.collection_descriptor) : <code>Object</code>
    * [.typeset](#rtv.types.typeset) : <code>Object</code>
    * [.property_validator](#rtv.types.property_validator) : <code>function</code>

<a name="rtv.types.ANY"></a>

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
  might as well not be included in the [shape descriptor](#rtv.shape_descriptor)
  unless a [property validator](#rtv.types.property_validator) is being
  used to do customized verification.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.STRING"></a>

#### types.STRING : <code>String</code>
String rules per qualifiers:

- REQUIRED: Must be a non-empty string.
- EXPECTED | OPTIONAL: Can be an empty string.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.BOOLEAN"></a>

#### types.BOOLEAN : <code>String</code>
Boolean rules per qualifiers: Must be a boolean.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.NUMBER"></a>

#### types.NUMBER : <code>String</code>
Number rules per qualifiers:

- REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
- EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [FINITE](#rtv.types.FINITE)

<a name="rtv.types.SYMBOL"></a>

#### types.SYMBOL : <code>String</code>
Symbol rules per qualifiers: Must be a symbol.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.FINITE"></a>

#### types.FINITE : <code>String</code>
Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 value can be either a safe integer or a [floating point number](#rtv.types.FLOAT).

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [NUMBER](#rtv.types.NUMBER)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="rtv.types.INT"></a>

#### types.INT : <code>String</code>
Int rules per qualifiers: Must be a [finite](#rtv.types.FINITE) integer,
 but is not necessarily _safe_.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [FINITE](#rtv.types.FINITE)
- [FLOAT](#rtv.types.FLOAT)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="rtv.types.FLOAT"></a>

#### types.FLOAT : <code>String</code>
Float rules per qualifiers: Must be a finite floating point number.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [INT](#rtv.types.INT)

<a name="rtv.types.ANY_OBJECT"></a>

#### types.ANY_OBJECT : <code>String</code>
An _any_ object is anything that is not a [primitive](#rtv.types), which
 means it includes the `Array` type, as well as functions and arguments. To
 test for an array, use the [ARRAY](#rtv.types.ARRAY) type. To
 test for a function, use the [FUNCTION](#rtv.types.FUNCTION) type.

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
 considered to be [primitives](#rtv.types)):

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

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [OBJECT](#rtv.types.OBJECT)
- [PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtv.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)

<a name="rtv.types.OBJECT"></a>

#### types.OBJECT : <code>String</code>
An object is one that extends from `JavaScript.Object` and is not
 a [function](#rtv.types.FUNCTION), [array](#rtv.types.ARRAY),
 [regular expression](#rtv.types.REGEXP), function arguments object,
 [map](#rtv.types.MAP), [weak map](#rtv.types.WEAK_MAP),
 [set](#rtv.types.SET), [weak set](#rtv.types.WEAK_SET), nor a
 [primitive](#rtv.types).

This is the __default__ (imputed) type for
 [shape descriptors](#rtv.shape_descriptor), which means the object itself
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

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [ANY_OBJECT](#rtv.types.ANY_OBJECT)
- [PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtv.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)

<a name="rtv.types.PLAIN_OBJECT"></a>

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

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [ANY_OBJECT](#rtv.types.ANY_OBJECT)
- [OBJECT](#rtv.types.OBJECT)
- [CLASS_OBJECT](#rtv.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)

<a name="rtv.types.CLASS_OBJECT"></a>

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
- A nested shape description.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [ANY_OBJECT](#rtv.types.ANY_OBJECT)
- [OBJECT](#rtv.types.OBJECT)
- [PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)

<a name="rtv.types.MAP_OBJECT"></a>

#### types.MAP_OBJECT : <code>String</code>
A _map_ object is an [OBJECT](#rtv.types.OBJECT) that is treated as a
 hash map with an expected set of keys and values. Keys can be described
 using a regular expression, and values can be described using a
 [typeset](#rtv.types.typeset). Empty maps are permitted.

Map object rules per qualifiers: Same as [OBJECT](#rtv.types.OBJECT) rules.

Argument (optional):

- A [collection descriptor](#rtv.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply. __NOTE:__ Since a map object
  is based on a JavaScript Object (which only supports string-based keys), the
  collection descriptor's `keys` type defaults to (and is required to be)
  [STRING](#rtv.types.STRING).

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [ANY_OBJECT](#rtv.types.ANY_OBJECT)
- [OBJECT](#rtv.types.OBJECT)
- [PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtv.types.CLASS_OBJECT)
- [MAP](#rtv.types.MAP)
- [WEAK_MAP](#rtv.types.WEAK_MAP)

<a name="rtv.types.ARRAY"></a>

#### types.ARRAY : <code>String</code>
Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.JSON"></a>

#### types.JSON : <code>String</code>
JSON rules per qualifiers: Must be a JSON value:

- [string](#rtv.types.STRING), however __empty strings__ are permitted,
  even if the qualifier is `REQUIRED`;
- [boolean](#rtv.types.BOOLEAN);
- [finite number](#rtv.types.FINITE);
- [plain object](#rtv.types.PLAIN_OBJECT);
- [array](#rtv.types.ARRAY);
- `null`

Since this type checks for _any_ valid JSON value, empty string and `null`
 values are permitted, even when the typeset is qualified as `REQUIRED`.
 Therefore, the `REQUIRED` qualifier has the same effect as the `EXPECTED`
 qualifier.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.FUNCTION"></a>

#### types.FUNCTION : <code>String</code>
Function rules per qualifiers: Must be a `function`.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**: [qualifiers](#rtv.qualifiers)  
<a name="rtv.types.REGEXP"></a>

#### types.REGEXP : <code>String</code>
RegExp rules per qualifiers: Must be a `RegExp` instance.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

<a name="rtv.types.DATE"></a>

#### types.DATE : <code>String</code>
Date rules per qualifiers: Must be a `Date` instance.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

<a name="rtv.types.ERROR"></a>

#### types.ERROR : <code>String</code>
Error rules per qualifiers: Must be an `Error` instance.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

<a name="rtv.types.PROMISE"></a>

#### types.PROMISE : <code>String</code>
Promise rules per qualifiers: Must be a `Promise` instance.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<a name="rtv.types.MAP"></a>

#### types.MAP : <code>String</code>
An ES6 map supports any object as its keys, unlike a
 [MAP_OBJECT](#rtv.types.MAP_OBJECT) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtv.types.typeset). Empty maps are permitted.

Map rules per qualifiers: Must be a `Map` instance.

Argument (optional):

- A [collection descriptor](#rtv.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)
- [WEAK_MAP](#rtv.types.WEAK_MAP)

<a name="rtv.types.WEAK_MAP"></a>

#### types.WEAK_MAP : <code>String</code>
An ES6 weak map supports any object as its keys, unlike a
 [MAP_OBJECT](#rtv.types.MAP_OBJECT) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtv.types.typeset). Empty maps are permitted.

Weak map rules per qualifiers: Must be a `WeakMap` instance.

Argument (optional):

- A [collection descriptor](#rtv.types.collection_descriptor) specifying
  the rules for the keys and/or values found in the map. If not specified,
  the default collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [MAP_OBJECT](#rtv.types.MAP_OBJECT)
- [MAP](#rtv.types.MAP)

<a name="rtv.types.SET"></a>

#### types.SET : <code>String</code>
An ES6 set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtv.types.typeset). Empty sets are permitted.

Set rules per qualifiers: Must be a `Set` instance.

Argument (optional):

- A [collection descriptor](#rtv.types.collection_descriptor) specifying
  the rules for the values found in the set (note that key-related rules are
  ignored since they are not applicable). If not specified, the default
  collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [WEAK_SET](#rtv.types.WEAK_SET)

<a name="rtv.types.WEAK_SET"></a>

#### types.WEAK_SET : <code>String</code>
An ES6 weak set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtv.types.typeset). Empty sets are permitted.

Weak set rules per qualifiers: Must be a `WeakSet` instance.

Argument (optional):

- A [collection descriptor](#rtv.types.collection_descriptor) specifying
  the rules for the values found in the set (note that key-related rules are
  ignored since they are not applicable). If not specified, the default
  collection descriptor options apply.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [SET](#rtv.types.SET)

<a name="rtv.types.collection_descriptor"></a>

#### types.collection_descriptor : <code>Object</code>
Collection Descriptor

Describes the keys and values in a collection-based object, which is one of
 the following types:

- [MAP_OBJECT](#rtv.types.MAP_OBJECT)
- [MAP](#rtv.types.MAP)
- [WEAK_MAP](#rtv.types.WEAK_MAP)
- [SET](#rtv.types.SET) (with some exceptions)
- [WEAK_SET](#rtv.types.WEAK_SET) (with some exceptions)

Note that an [ARRAY](#rtv.types.ARRAY) is __not__ included in this list
 because the array type has special syntax for describing the type of its items.

For example, the following descriptors both verify a collection of 3-letter
 string keys (upper- or lowercase) to finite numbers:

- `{keyExp: '[a-z]{3}', keyExpFlags: 'i', values: rtv.types.FINITE}`
- `{keyExp: '[a-zA-Z]{3}', values: rtv.types.FINITE}`

**Kind**: static typedef of [<code>types</code>](#rtv.types)  
**See**

- rtv.types.MAP_OBJECT
- rtv.types.MAP
- rtv.types.WEAK_MAP
- rtv.types.SET
- rtv.types.WEAK_SET

**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| keys | [<code>typeset</code>](#rtv.types.typeset) |  | Optional. A typeset describing each key  in the collection. The type of collection being described may restrict the types that this typeset  can include. For example, the [MAP_OBJECT](#rtv.types.MAP_OBJECT) collection  only supports the [STRING](#rtv.types.STRING) type due to the nature of  its JavaScript Object-based implementation. NOTE: This property is ignored when the collection is a [SET](#rtv.types.SET)  or a [WEAK_SET](#rtv.types.WEAK_SET) because sets do not have keys. |
| keyExp | <code>String</code> |  | Optional. A string-based regular expression  describing the names of keys (own-enumerable properties) found in the  collection. By default, there are no restrictions on key names. This expression is only  used if the `keys` typeset includes the [STRING](#rtv.types.STRING) type. For example, to require numerical keys, the following expression could be  used: `'^\\d+$'`. NOTE: This property is ignored when the collection is a [SET](#rtv.types.SET)  or a [WEAK_SET](#rtv.types.WEAK_SET) because sets do not have keys. |
| keyExpFlags | <code>String</code> |  | Optional. A string specifying any flags to use  with the regular expression specified in `keyExp`. If this property is _falsy_,  default `RegExp` flags will be used. Ignored if `keyExp` is not specified, or  does not apply per the `keys` typeset. NOTE: This property is ignored when the collection is a [SET](#rtv.types.SET)  or a [WEAK_SET](#rtv.types.WEAK_SET) because sets do not have keys. |
| values | [<code>typeset</code>](#rtv.types.typeset) |  | Optional. A typeset describing each value  in the collection. Defaults to the [ANY](#rtv.types.ANY) type which allows  _anything_. All values must match this typeset (but the collection is not  required to have any entries/properties to be considered valid, unless  `count` is specified). For example, to require arrays of non-empty string values, the following  typeset could be used: `[[types.STRING]]`. |
| count | <code>number</code> | <code>-1</code> | Optional. The number of entries expected in  the collection. A negative value allows for any number of entries. Zero  requires an empty collection. |

<a name="rtv.types.typeset"></a>

#### types.typeset : <code>Object</code>
Typeset

Describes a property found in a [shape descriptor](#rtv.shape_descriptor).
 It can be any one of the following JavaScript values:

- `String '<type>'`: For a single type, such as ['FINITE'](#rtv.types.FINITE)
  for a finite number.
- `Array []`: For multiple type possibilities, using an OR conjunction, which
  means the value of the property being described must be one of the types listed.
  Note that when a nested array is encountered (i.e. an array within a typeset),
  it is treated as the shortcut [ARRAY](#rtv.types.ARRAY) form, implying an
  array of values of some type, e.g. `values: [[STRING, FINITE]]` would describe
  a 'values' property that could be an array of non-empty strings or finite numbers.
- `Object {}`: For a nested [shape descriptor](#rtv.shape_descriptor) of implied
  [OBJECT](#rtv.types.OBJECT) type (unless qualified with a specific object
  type like [PLAIN_OBJECT](#rtv.types.PLAIN_OBJECT), for example).
- `Function`: For a [property validator](#rtv.types.property_validator)
  that will certify the value of the property using custom code.

<h4>Example</h4>

<pre><code>
const contactShape = {
  name: rtv.types.STRING, // required, non-empty, string
  tags: [rtv.types.ARRAY, [rtv.types.STRING]], // required array of non-empty strings
  tags2: [[rtv.types.STRING]], // same as 'tags' but using shortcut array format
  details: { // required nested object of type `rtv.types.OBJECT` (default)
    birthday: [rtv.qualifiers.EXPECTED, rtv.types.DATE] // Date (could be null)
  },
  notes: [rtv.types.STRING, function(value) { // required non-empty string...
    return value.length < 500; // ...less than 500 characters long
  }]
};
</code></pre>

**Kind**: static typedef of [<code>types</code>](#rtv.types)  
<a name="rtv.types.property_validator"></a>

#### types.property_validator : <code>function</code>
Property Validator

// TODO: document rtv.types.property_validator (already referenced)

Note one disadvantage: cannot be de/serialized via JSON.

**Kind**: static typedef of [<code>types</code>](#rtv.types)  
<a name="rtv.shape_descriptor"></a>

### rtv.shape_descriptor : <code>Object</code>
Shape Descriptor

// TODO: document rtv.shape_descriptor (already referenced)

**Kind**: static typedef of [<code>rtv</code>](#rtv)  
