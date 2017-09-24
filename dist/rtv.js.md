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
        * [.STRING](#rtv.types.STRING) : <code>String</code>
        * [.BOOLEAN](#rtv.types.BOOLEAN) : <code>String</code>
        * [.NUMBER](#rtv.types.NUMBER) : <code>String</code>
        * [.SYMBOL](#rtv.types.SYMBOL) : <code>String</code>
        * [.FINITE](#rtv.types.FINITE) : <code>String</code>
        * [.INT](#rtv.types.INT) : <code>String</code>
        * [.FLOAT](#rtv.types.FLOAT) : <code>String</code>
        * [.OBJECT](#rtv.types.OBJECT) : <code>String</code>

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

Unless otherwise stated in type-specific rules, this qualifier does not allow
 a property value to be `null` or `undefined`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtv.qualifiers)  
**See**: [types](#rtv.types)  
<a name="rtv.qualifiers.EXPECTED"></a>

#### qualifiers.EXPECTED : <code>String</code>
Expected qualifier: Property _should_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_
 a property value to be defined (i.e. not `undefined`), but _allows_ the
 value to be `null`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtv.qualifiers)  
**See**: [types](#rtv.types)  
<a name="rtv.qualifiers.OPTIONAL"></a>

#### qualifiers.OPTIONAL : <code>String</code>
Optional qualifier: Property _may_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced (i.e. less so
 than with the `EXPECTED` qualifier).

Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 property value to be `undefined` (i.e. a property does not need to be defined).
 If the property is defined, then it is treated as an `EXPECTED` value.

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

**Kind**: static namespace of [<code>rtv</code>](#rtv)  

* [.types](#rtv.types) : <code>object</code>
    * [.STRING](#rtv.types.STRING) : <code>String</code>
    * [.BOOLEAN](#rtv.types.BOOLEAN) : <code>String</code>
    * [.NUMBER](#rtv.types.NUMBER) : <code>String</code>
    * [.SYMBOL](#rtv.types.SYMBOL) : <code>String</code>
    * [.FINITE](#rtv.types.FINITE) : <code>String</code>
    * [.INT](#rtv.types.INT) : <code>String</code>
    * [.FLOAT](#rtv.types.FLOAT) : <code>String</code>
    * [.OBJECT](#rtv.types.OBJECT) : <code>String</code>

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
Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [NUMBER](#rtv.types.NUMBER)

<a name="rtv.types.INT"></a>

#### types.INT : <code>String</code>
Int rules per qualifiers: Must be a finite integer, but is not necessarily _safe_.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [FLOAT](#rtv.types.FLOAT)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="rtv.types.FLOAT"></a>

#### types.FLOAT : <code>String</code>
Float rules per qualifiers: Must be a finite floating point number.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [INT](#rtv.types.INT)

<a name="rtv.types.OBJECT"></a>

#### types.OBJECT : <code>String</code>
An object is anything that is not a [primitive](#rtv.types), which means it
 includes the `Array` type. To test for an array, use the [ARRAY](rtv.types.ARRAY)
 type instead.

The following values are considered objects:

- `{}`
- `[]`
- `function(){}`
- `arguments` (function arguments)
- `new Object()`
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `new RegExp('r')`
- `new function() {}`
- `new Set()`
- `new WeakSet()`
- `new Map()`
- `new WeakMap()`

The following values __are not__ considered objects (because they are considered
 [primitives](#rtv.types)):

- `Symbol('s')`
- `true`
- `1`
- `''`
- `null` (NOTE: `typeof null === 'object'` in JavaScript; the OBJECT type
  allows testing for this undesirable fact)
- `undefined`

Object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

**Kind**: static constant of [<code>types</code>](#rtv.types)  
**See**

- [qualifiers](#rtv.qualifiers)
- [rtv.types.EXT_OBJECT](rtv.types.EXT_OBJECT)
- [rtv.types.PLAIN_OBJECT](rtv.types.PLAIN_OBJECT)
- [rtv.types.CLASS_OBJECT](rtv.types.CLASS_OBJECT)
- [rtv.types.MAP_OBJECT](rtv.types.MAP_OBJECT)

