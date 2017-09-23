## Classes

<dl>
<dt><a href="#Enumeration">Enumeration</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#qualifiers">qualifiers</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#types">types</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="Enumeration"></a>

## Enumeration
**Kind**: global class  

* [Enumeration](#Enumeration)
    * [new Enumeration(map)](#new_Enumeration_new)
    * [._values](#Enumeration+_values) : <code>Array.&lt;String&gt;</code>
    * [.validate(value, [silent])](#Enumeration+validate) ⇒ <code>\*</code>

<a name="new_Enumeration_new"></a>

### new Enumeration(map)
Simple enumeration type.

**Throws**:

- <code>Error</code> If `map` is falsy or empty.
- <code>Error</code> If `map` has a key that maps to `undefined`.


| Param | Type | Description |
| --- | --- | --- |
| map | <code>Object.&lt;String, \*&gt;</code> | Object mapping keys to values. Values cannot  be `undefined`. |

<a name="Enumeration+_values"></a>

### enumeration._values : <code>Array.&lt;String&gt;</code>
[internal] List of enumeration values.

**Kind**: instance property of [<code>Enumeration</code>](#Enumeration)  
<a name="Enumeration+validate"></a>

### enumeration.validate(value, [silent]) ⇒ <code>\*</code>
Validates a value as being in this enumeration. Throws an exception if the value
 is not in this enumeration, unless `silent` is true.

**Kind**: instance method of [<code>Enumeration</code>](#Enumeration)  
**Returns**: <code>\*</code> - The specified value if it is in this enumeration, or `undefined` if
 `silent` is true and the value is not in this enumeration.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | Value to check. Cannot be undefined. |
| [silent] | <code>Boolean</code> | <code>false</code> | If truthy, returns `undefined` instead of throwing  an exception if the specified value is not in this enumeration. |

<a name="qualifiers"></a>

## qualifiers : <code>object</code>
**Kind**: global namespace  

* [qualifiers](#qualifiers) : <code>object</code>
    * [.REQUIRED](#qualifiers.REQUIRED) : <code>String</code>
    * [.EXPECTED](#qualifiers.EXPECTED) : <code>String</code>
    * [.OPTIONAL](#qualifiers.OPTIONAL) : <code>String</code>

<a name="qualifiers.REQUIRED"></a>

### qualifiers.REQUIRED : <code>String</code>
Required qualifier: Property _must_ exist and be of the expected type.
 Depending on the type, additional requirements may be enforced.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#qualifiers)  
**See**: [types](#types)  
<a name="qualifiers.EXPECTED"></a>

### qualifiers.EXPECTED : <code>String</code>
Expected qualifier: Property _should_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced.

In general, an expected property must be defined, but could be `null`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#qualifiers)  
**See**: [types](#types)  
<a name="qualifiers.OPTIONAL"></a>

### qualifiers.OPTIONAL : <code>String</code>
Optional qualifier: Property _may_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced (i.e. less so
 than with the `EXPECTED` qualifier).

In general, an optional property could be `undefined` (i.e does not need to be
 defined). If it is defined, then it is treated as an `EXPECTED` property.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#qualifiers)  
**See**: [types](#types)  
<a name="types"></a>

## types : <code>object</code>
**Kind**: global namespace  

* [types](#types) : <code>object</code>
    * [.STRING](#types.STRING) : <code>String</code>
    * [.BOOLEAN](#types.BOOLEAN) : <code>String</code>
    * [.NUMBER](#types.NUMBER) : <code>String</code>
    * [.FINITE](#types.FINITE) : <code>String</code>
    * [.INT](#types.INT) : <code>String</code>
    * [.FLOAT](#types.FLOAT) : <code>String</code>

<a name="types.STRING"></a>

### types.STRING : <code>String</code>
String rules per qualifiers:
- REQUIRED: Must be a non-empty string.
- EXPECTED | OPTIONAL: Can be an empty string.

**Kind**: static constant of [<code>types</code>](#types)  
**See**: [qualifiers](#qualifiers)  
<a name="types.BOOLEAN"></a>

### types.BOOLEAN : <code>String</code>
Boolean rules per qualifiers: Must be a boolean.

**Kind**: static constant of [<code>types</code>](#types)  
**See**: [qualifiers](#qualifiers)  
<a name="types.NUMBER"></a>

### types.NUMBER : <code>String</code>
Number rules per qualifiers:
- REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
- EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.

**Kind**: static constant of [<code>types</code>](#types)  
**See**

- [qualifiers](#qualifiers)
- [FINITE](#types.FINITE)

<a name="types.FINITE"></a>

### types.FINITE : <code>String</code>
Finite rules per qualifiers:
- REQUIRED: Cannot be `NaN`, `+Infinity`, `-Infinity`.
- EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.

**Kind**: static constant of [<code>types</code>](#types)  
**See**

- [qualifiers](#qualifiers)
- [NUMBER](#types.NUMBER)

<a name="types.INT"></a>

### types.INT : <code>String</code>
Int rules per qualifiers:
- REQUIRED: Must be a finite integer, but is not necessarily _safe_.
- EXPECTED | OPTIONAL: Could be `NaN`.

**Kind**: static constant of [<code>types</code>](#types)  
**See**

- [qualifiers](#qualifiers)
- [FLOAT](#types.FLOAT)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)

<a name="types.FLOAT"></a>

### types.FLOAT : <code>String</code>
Float rules per qualifiers:
- REQUIRED: Must be a finite floating point number.
- EXPECTED | OPTIONAL: Could be `NaN`.

**Kind**: static constant of [<code>types</code>](#types)  
**See**

- [qualifiers](#qualifiers)
- [INT](#types.INT)

