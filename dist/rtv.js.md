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
        * [.$values](#rtvref.Enumeration+$values) : <code>Array.&lt;String&gt;</code>
        * [.check(value)](#rtvref.Enumeration+check) ⇒ <code>\*</code> \| <code>undefined</code>
        * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
        * [.toString()](#rtvref.Enumeration+toString) ⇒ <code>string</code>
    * [.RtvError](#rtvref.RtvError) ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
        * [new RtvError(value, typeset, path, cause)](#new_rtvref.RtvError_new)
        * [.valid](#rtvref.RtvError+valid) : <code>boolean</code>
        * [.value](#rtvref.RtvError+value) : <code>\*</code>
        * [.typeset](#rtvref.RtvError+typeset) : [<code>typeset</code>](#rtvref.types.typeset)
        * [.path](#rtvref.RtvError+path) : <code>string</code>
        * [.cause](#rtvref.RtvError+cause) : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
        * [.toString()](#rtvref.RtvError+toString) ⇒ <code>string</code>
    * [.RtvSuccess](#rtvref.RtvSuccess)
        * [new RtvSuccess()](#new_rtvref.RtvSuccess_new)
        * [.valid](#rtvref.RtvSuccess+valid) : <code>boolean</code>
        * [.toString()](#rtvref.RtvSuccess+toString) ⇒ <code>string</code>
    * [.impl](#rtvref.impl) : <code>object</code>
        * [.fullyQualify(typeset)](#rtvref.impl.fullyQualify) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
        * [.checkType(value, type)](#rtvref.impl.checkType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.qualifiers](#rtvref.qualifiers) : <code>object</code>
        * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
        * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
        * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
        * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>
    * [.types](#rtvref.types) : <code>object</code>
        * [.objTypes](#rtvref.types.objTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.argTypes](#rtvref.types.argTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.types](#rtvref.types.types) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.primitives](#rtvref.types.primitives) : <code>object</code>
        * [.rules](#rtvref.types.rules) : <code>object</code>
        * [.ANY](#rtvref.types.ANY) : <code>string</code>
        * [.STRING](#rtvref.types.STRING) : <code>string</code>
        * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>string</code>
        * [.SYMBOL](#rtvref.types.SYMBOL) : <code>string</code>
        * [.NUMBER](#rtvref.types.NUMBER) : <code>string</code>
        * [.FINITE](#rtvref.types.FINITE) : <code>string</code>
        * [.INT](#rtvref.types.INT) : <code>string</code>
        * [.FLOAT](#rtvref.types.FLOAT) : <code>string</code>
        * [.FUNCTION](#rtvref.types.FUNCTION) : <code>string</code>
        * [.REGEXP](#rtvref.types.REGEXP) : <code>string</code>
        * [.DATE](#rtvref.types.DATE) : <code>string</code>
        * [.ERROR](#rtvref.types.ERROR) : <code>string</code>
        * [.PROMISE](#rtvref.types.PROMISE) : <code>string</code>
        * [.ARRAY](#rtvref.types.ARRAY) : <code>string</code>
        * [.ANY_OBJECT](#rtvref.types.ANY_OBJECT) : <code>string</code>
        * [.OBJECT](#rtvref.types.OBJECT) : <code>string</code>
        * [.PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) : <code>string</code>
        * [.CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) : <code>string</code>
        * [.MAP_OBJECT](#rtvref.types.MAP_OBJECT) : <code>string</code>
        * [.MAP](#rtvref.types.MAP) : <code>string</code>
        * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>string</code>
        * [.SET](#rtvref.types.SET) : <code>string</code>
        * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>string</code>
        * [.JSON](#rtvref.types.JSON) : <code>string</code>
        * [.DEFAULT_OBJECT_TYPE](#rtvref.types.DEFAULT_OBJECT_TYPE) : <code>string</code>
        * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
        * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
        * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
        * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
        * [.property_validator](#rtvref.types.property_validator) ⇒ <code>boolean</code>
        * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
        * [.numeric_args](#rtvref.types.numeric_args) : <code>Object</code>
        * [.ARRAY_args](#rtvref.types.ARRAY_args) : <code>Object</code>
        * [.CLASS_OBJECT_args](#rtvref.types.CLASS_OBJECT_args) : <code>Object</code>
    * [.validation](#rtvref.validation) : <code>object</code>
        * [.isPrimitive(v)](#rtvref.validation.isPrimitive) ⇒ <code>boolean</code>
        * [.isTypeset(v, [options])](#rtvref.validation.isTypeset) ⇒ <code>boolean</code>
    * [.validator](#rtvref.validator) : <code>object</code>
        * [.isAny(v)](#rtvref.validator.isAny) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isAny.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isAny.config)
        * [.isAnyObject(v)](#rtvref.validator.isAnyObject) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isAnyObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isAnyObject.config)
        * [.isArray(v, [q], [args])](#rtvref.validator.isArray) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isArray.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isArray.config)
        * [.isBoolean(v)](#rtvref.validator.isBoolean) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isBoolean.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isBoolean.config)
        * [.isFinite(v, [q], [args])](#rtvref.validator.isFinite) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isFinite.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isFinite.config)
        * [.isFunction(v)](#rtvref.validator.isFunction) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isFunction.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isFunction.config)
        * [.isMap(v, [q], [args])](#rtvref.validator.isMap) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isMap.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isMap.config)
        * [.isNumber(v, [q], [args])](#rtvref.validator.isNumber) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isNumber.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isNumber.config)
        * [.isObject(v)](#rtvref.validator.isObject) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isObject.config)
        * [.isRegExp(v)](#rtvref.validator.isRegExp) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isRegExp.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isRegExp.config)
        * [.isSet(v, [q], [args])](#rtvref.validator.isSet) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isSet.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isSet.config)
        * [.isString(v, [q], [args])](#rtvref.validator.isString) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isString.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isString.config)
        * [.isSymbol(v)](#rtvref.validator.isSymbol) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isSymbol.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isSymbol.config)
        * [.isWeakMap(v)](#rtvref.validator.isWeakMap) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isWeakMap.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isWeakMap.config)
        * [.isWeakSet(v)](#rtvref.validator.isWeakSet) ⇒ <code>boolean</code>
            * [.type](#rtvref.validator.isWeakSet.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.isWeakSet.config)
        * [.type_validator(value, [qualifier], [args])](#rtvref.validator.type_validator) ⇒ <code>boolean</code>
        * [.validator_config(settings)](#rtvref.validator.validator_config)
    * [.shape_descriptor](#rtvref.shape_descriptor) : <code>Object</code>


* * *

<a name="rtvref.Enumeration"></a>

### rtvref.Enumeration
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.Enumeration](#rtvref.Enumeration)
    * [new Enumeration(map)](#new_rtvref.Enumeration_new)
    * [.$values](#rtvref.Enumeration+$values) : <code>Array.&lt;String&gt;</code>
    * [.check(value)](#rtvref.Enumeration+check) ⇒ <code>\*</code> \| <code>undefined</code>
    * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
    * [.toString()](#rtvref.Enumeration+toString) ⇒ <code>string</code>


* * *

<a name="new_rtvref.Enumeration_new"></a>

#### new Enumeration(map)
Simple enumeration type. Own-properties on an instance are the keys in the
 specified `map`, with their associated values.

<pre><code>const state = new Enumeration({
  READY: 1,
  RUNNING: 2,
  STOPPED: 3,
  COMPLETE: 4
});

state.RUNNING; // 2
state.verify(3); // 3 (returns the value since found in enumeration)
state.verify(5); // ERROR thrown
state.check(3); // 3 (same as verify(3) since found in enumeration)
state.check(5); // undefined (silent failure)
state.$values; // [1, 2, 3, 4] (special non-enumerable own-property)
</code></pre>

**Throws**:

- <code>Error</code> If `map` is falsy or empty.
- <code>Error</code> If `map` has a key that maps to `undefined`.
- <code>Error</code> If `map` contains a duplicate value.


| Param | Type | Description |
| --- | --- | --- |
| map | <code>Object.&lt;String, \*&gt;</code> | Object mapping keys to values. Values cannot  be `undefined`. |


* * *

<a name="rtvref.Enumeration+$values"></a>

#### enumeration.$values : <code>Array.&lt;String&gt;</code>
List of enumeration values. Values are _references_ to values in this
 enumeration.

Note that this own-property is non-enumerable on purpose. Enumerable
 properties on this instance are the keys in this enumeration.

**Kind**: instance property of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Read only**: true  

* * *

<a name="rtvref.Enumeration+check"></a>

#### enumeration.check(value) ⇒ <code>\*</code> \| <code>undefined</code>
Checks if a value is in this enumeration.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>\*</code> \| <code>undefined</code> - The specified value if it is in this enumeration, or `undefined`
 if not. An exception is __not__ thrown if the value is not in this enumeration.  
**See**: [verify](#rtvref.Enumeration+verify)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. Cannot be undefined. |


* * *

<a name="rtvref.Enumeration+verify"></a>

#### enumeration.verify(value, [silent]) ⇒ <code>\*</code>
Validates a value as being in this enumeration. Throws an exception if the value
 is not in this enumeration, unless `silent` is true.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>\*</code> - The specified value if it is in this enumeration, or `undefined` if
 `silent` is true and the value is not in this enumeration.  
**Throws**:

- <code>Error</code> If not `silent` and the value is not in this enumeration.

**See**: [check](#rtvref.Enumeration+check)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| value | <code>\*</code> |  | Value to check. Cannot be undefined. |
| [silent] | <code>boolean</code> | <code>false</code> | If truthy, returns `undefined` instead of throwing  an exception if the specified value is not in this enumeration. |


* * *

<a name="rtvref.Enumeration+toString"></a>

#### enumeration.toString() ⇒ <code>string</code>
A string representation of this Enumeration.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>string</code> - String representation.  

* * *

<a name="rtvref.RtvError"></a>

### rtvref.RtvError ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
**Kind**: static class of [<code>rtvref</code>](#rtvref)  
**Extends**: [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)  

* [.RtvError](#rtvref.RtvError) ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    * [new RtvError(value, typeset, path, cause)](#new_rtvref.RtvError_new)
    * [.valid](#rtvref.RtvError+valid) : <code>boolean</code>
    * [.value](#rtvref.RtvError+value) : <code>\*</code>
    * [.typeset](#rtvref.RtvError+typeset) : [<code>typeset</code>](#rtvref.types.typeset)
    * [.path](#rtvref.RtvError+path) : <code>string</code>
    * [.cause](#rtvref.RtvError+cause) : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
    * [.toString()](#rtvref.RtvError+toString) ⇒ <code>string</code>


* * *

<a name="new_rtvref.RtvError_new"></a>

#### new RtvError(value, typeset, path, cause)
Runtime Verification Error Indicator

Describes a failed runtime verification of a value against a given
 [shape](#rtvref.shape_descriptor) or [typeset](#rtvref.types.typeset)
 (note that a shape is a type of typeset).

**Throws**:

- <code>Error</code> If `typeset`, `path`, or `cause` is invalid.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value being verified. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | The typeset used for verification. |
| path | <code>string</code> | The path deep into `value` where the failure occurred. |
| cause | [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset) | The fully qualified typeset  that caused the failure. |


* * *

<a name="rtvref.RtvError+valid"></a>

#### rtvError.valid : <code>boolean</code>
Flag indicating the validation failed. Always `false`.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
**See**: [valid](#rtvref.RtvSuccess+valid)  

* * *

<a name="rtvref.RtvError+value"></a>

#### rtvError.value : <code>\*</code>
Value that failed verification.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  

* * *

<a name="rtvref.RtvError+typeset"></a>

#### rtvError.typeset : [<code>typeset</code>](#rtvref.types.typeset)
Reference to the typeset used for verification.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  

* * *

<a name="rtvref.RtvError+path"></a>

#### rtvError.path : <code>string</code>
Path from `value` to the nested property that caused the failure.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  

* * *

<a name="rtvref.RtvError+cause"></a>

#### rtvError.cause : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
Fully qualified typeset that caused the failure. This will be a subset
 of `typeset`, and possibly of a nested typeset within `typeset`
 expressing only the direct cause of the failure.

// TODO: make sure this is what it ends-up being...:

If `typeset` is `[[rtv.t.STRING]]` (a required array of required strings),
 and `value` is `['a', 2]`, this property would be `[rtv.q.REQUIRED, rtv.t.STRING]`
 because the failure would ultimately have been caused by the nested `rtv.t.STRING`
 typeset.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  

* * *

<a name="rtvref.RtvError+toString"></a>

#### rtvError.toString() ⇒ <code>string</code>
A string representation of this instance.

**Kind**: instance method of [<code>RtvError</code>](#rtvref.RtvError)  
**Returns**: <code>string</code> - String representation.  

* * *

<a name="rtvref.RtvSuccess"></a>

### rtvref.RtvSuccess
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.RtvSuccess](#rtvref.RtvSuccess)
    * [new RtvSuccess()](#new_rtvref.RtvSuccess_new)
    * [.valid](#rtvref.RtvSuccess+valid) : <code>boolean</code>
    * [.toString()](#rtvref.RtvSuccess+toString) ⇒ <code>string</code>


* * *

<a name="new_rtvref.RtvSuccess_new"></a>

#### new RtvSuccess()
Runtime Verification Success Indicator

Describes a successful runtime verification of a value against a given
 [shape](#rtvref.shape_descriptor) or [typeset](#rtvref.types.typeset)
 (note that a shape is a type of typeset).


* * *

<a name="rtvref.RtvSuccess+valid"></a>

#### rtvSuccess.valid : <code>boolean</code>
Flag indicating the validation succeeded. Always `true`.

**Kind**: instance property of [<code>RtvSuccess</code>](#rtvref.RtvSuccess)  
**Read only**: true  
**See**: [valid](#rtvref.RtvError+valid)  

* * *

<a name="rtvref.RtvSuccess+toString"></a>

#### rtvSuccess.toString() ⇒ <code>string</code>
A string representation of this instance.

**Kind**: instance method of [<code>RtvSuccess</code>](#rtvref.RtvSuccess)  
**Returns**: <code>string</code> - String representation.  

* * *

<a name="rtvref.impl"></a>

### rtvref.impl : <code>object</code>
<h2>RTV Implementation Module</h2>

Provides the internal implementation for the externally-facing [RTV](#rtv)
 API, as well as utilities for [type validators](#rtvref.validator).

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.impl](#rtvref.impl) : <code>object</code>
    * [.fullyQualify(typeset)](#rtvref.impl.fullyQualify) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
    * [.checkType(value, type)](#rtvref.impl.checkType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)


* * *

<a name="rtvref.impl.fullyQualify"></a>

#### impl.fullyQualify(typeset) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 are not fully-qualified).

This function does not modify the input `typeset`.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset) - A new, fully-qualified typeset
 representing the input `typeset`. Only the first/immediate level of the
 input typeset is fully-qualified. The new array returned contains references
 to elements within the input typeset.  
**Throws**:

- <code>Error</code> If `typeset` is not a valid typeset.


| Param | Type | Description |
| --- | --- | --- |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Typeset to fully-qualify. |


* * *

<a name="rtvref.impl.checkType"></a>

#### impl.checkType(value, type) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value against a simple type using the
 [default qualifier](#rtvref.qualifiers.DEFAULT_QUALIFIER).

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - A success indicator if the
 `value` is compliant to the type; an error indicator if not.  
**Throws**:

- <code>Error</code> If `type` is not a valid type name.

**See**: [types](#rtvref.types)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| type | <code>string</code> | Simple type name, must be one of [types](#rtvref.types.types). |


* * *

<a name="rtvref.impl.check"></a>

#### impl.check(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value against a typeset.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - Success indicator if the `value`
 is compliant to the `typeset`; error indicator otherwise. An exception is
 __not__ thrown if the `value` is non-compliant.  
**Throws**:

- <code>Error</code> If `typeset` is not a valid typeset.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape/type of the value. |


* * *

<a name="rtvref.qualifiers"></a>

### rtvref.qualifiers : <code>object</code>
<h2>Qualifiers</h2>

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.qualifiers](#rtvref.qualifiers) : <code>object</code>
    * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
    * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
    * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
    * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>


* * *

<a name="rtvref.qualifiers.qualifiers"></a>

#### qualifiers.qualifiers : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of [qualifiers](#rtvref.qualifiers).

**Kind**: static property of [<code>qualifiers</code>](#rtvref.qualifiers)  

* * *

<a name="rtvref.qualifiers.REQUIRED"></a>

#### qualifiers.REQUIRED : <code>string</code>
Required qualifier: Property _must_ exist and be of the expected type.
 Depending on the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, and does not
 allow its value to be `null` or `undefined`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  

* * *

<a name="rtvref.qualifiers.EXPECTED"></a>

#### qualifiers.EXPECTED : <code>string</code>
Expected qualifier: Property _should_ exist and be of the expected type.
 Depending on the type, some requirements may not be enforced.

Unless otherwise stated in type-specific rules, this qualifier _requires_ the
 property to be defined _somewhere_ within the prototype chain, does not allow
 its value to be `undefined`, but does _allow_ its value to be `null`.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  

* * *

<a name="rtvref.qualifiers.OPTIONAL"></a>

#### qualifiers.OPTIONAL : <code>string</code>
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

* * *

<a name="rtvref.qualifiers.DEFAULT_QUALIFIER"></a>

#### qualifiers.DEFAULT_QUALIFIER : <code>string</code>
Default qualifier: [REQUIRED](#rtvref.qualifiers.REQUIRED)

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  

* * *

<a name="rtvref.types"></a>

### rtvref.types : <code>object</code>
<h2>Types</h2>

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.types](#rtvref.types) : <code>object</code>
    * [.objTypes](#rtvref.types.objTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.argTypes](#rtvref.types.argTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.types](#rtvref.types.types) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.primitives](#rtvref.types.primitives) : <code>object</code>
    * [.rules](#rtvref.types.rules) : <code>object</code>
    * [.ANY](#rtvref.types.ANY) : <code>string</code>
    * [.STRING](#rtvref.types.STRING) : <code>string</code>
    * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>string</code>
    * [.SYMBOL](#rtvref.types.SYMBOL) : <code>string</code>
    * [.NUMBER](#rtvref.types.NUMBER) : <code>string</code>
    * [.FINITE](#rtvref.types.FINITE) : <code>string</code>
    * [.INT](#rtvref.types.INT) : <code>string</code>
    * [.FLOAT](#rtvref.types.FLOAT) : <code>string</code>
    * [.FUNCTION](#rtvref.types.FUNCTION) : <code>string</code>
    * [.REGEXP](#rtvref.types.REGEXP) : <code>string</code>
    * [.DATE](#rtvref.types.DATE) : <code>string</code>
    * [.ERROR](#rtvref.types.ERROR) : <code>string</code>
    * [.PROMISE](#rtvref.types.PROMISE) : <code>string</code>
    * [.ARRAY](#rtvref.types.ARRAY) : <code>string</code>
    * [.ANY_OBJECT](#rtvref.types.ANY_OBJECT) : <code>string</code>
    * [.OBJECT](#rtvref.types.OBJECT) : <code>string</code>
    * [.PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) : <code>string</code>
    * [.CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) : <code>string</code>
    * [.MAP_OBJECT](#rtvref.types.MAP_OBJECT) : <code>string</code>
    * [.MAP](#rtvref.types.MAP) : <code>string</code>
    * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>string</code>
    * [.SET](#rtvref.types.SET) : <code>string</code>
    * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>string</code>
    * [.JSON](#rtvref.types.JSON) : <code>string</code>
    * [.DEFAULT_OBJECT_TYPE](#rtvref.types.DEFAULT_OBJECT_TYPE) : <code>string</code>
    * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
    * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
    * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
    * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
    * [.property_validator](#rtvref.types.property_validator) ⇒ <code>boolean</code>
    * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
    * [.numeric_args](#rtvref.types.numeric_args) : <code>Object</code>
    * [.ARRAY_args](#rtvref.types.ARRAY_args) : <code>Object</code>
    * [.CLASS_OBJECT_args](#rtvref.types.CLASS_OBJECT_args) : <code>Object</code>


* * *

<a name="rtvref.types.objTypes"></a>

#### types.objTypes : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of __object__ [types](#rtvref.types). These
 are all the types that describe values which are essentially maps of various
 keys to values.

**Kind**: static property of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.argTypes"></a>

#### types.argTypes : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of [types](#rtvref.types) that accept
 arguments.

**Kind**: static property of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.types"></a>

#### types.types : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of all [types](#rtvref.types).

**Kind**: static property of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.primitives"></a>

#### types.primitives : <code>object</code>
<h3>Primitives</h3>

In RTV.js (as in [ECMAScript 2015](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)),
 a _primitive_ is considered one of the following types:

- `undefined`
- `null`
- `string` (note that `new String('s')` does not produce a _primitive_, it
  produces an [object](#rtvref.types.OBJECT), and __should be avoided__).
- `boolean` (note that `new Boolean(true)` does not produce a _primitive_,
  it produces an [object](#rtvref.types.OBJECT), and __should be avoided__).
- `number` (note that `new Number(1)` does not produce a _primitive_,
  it produces an [object](#rtvref.types.OBJECT), and __should be avoided__).
- `Symbol`

**Kind**: static namespace of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.rules"></a>

#### types.rules : <code>object</code>
<h3>Rules Per Qualifiers</h3>

[Qualifiers](#rtvref.qualifiers) state basic rules. Unless otherwise stated,
 every type herein abides by those basic rules. Each type will also impose
 additional rules specific to the type of value it represents.

For example, while the [FINITE](#rtvref.types.FINITE) type states that the
 value must not be `NaN`, `+Infinity`, nor `-Infinity`; it could be `null` if
 the qualifier used is `EXPECTED`; and it could be `undefined` if the qualifier
 used is `OPTIONAL`.

**Kind**: static namespace of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.ANY"></a>

#### types.ANY : <code>string</code>
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

* * *

<a name="rtvref.types.STRING"></a>

#### types.STRING : <code>string</code>
String rules per qualifiers:

- REQUIRED: Must be a non-empty string.
- EXPECTED | OPTIONAL: May be an empty string.

In all cases, the value must be a string [primitive](#rtvref.types.primitives).
 Note that `new String('hello') !== 'hello'` because the former is an _object_, not a string.

Arguments (optional): [STRING_args](#rtvref.types.STRING_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.BOOLEAN"></a>

#### types.BOOLEAN : <code>string</code>
Boolean rules per qualifiers: Must be a boolean [primitive](#rtvref.types.primitives).
 Note that `new Boolean(true) !== true` because the former is an _object_, not a boolean.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.SYMBOL"></a>

#### types.SYMBOL : <code>string</code>
Symbol rules per qualifiers: Must be a symbol [primitive](#rtvref.types.primitives).

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.NUMBER"></a>

#### types.NUMBER : <code>string</code>
Number rules per qualifiers:

- REQUIRED: Cannot be `NaN`, but could be `+Infinity`, `-Infinity`.
- EXPECTED | OPTIONAL: Could be `NaN`, `+Infinity`, `-Infinity`.

In all cases, the value must be a number [primitive](#rtvref.types.primitives).
 Note that `new Number(1) !== 1` because the former is an _object_, not a number.

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [FINITE](#rtvref.types.FINITE)


* * *

<a name="rtvref.types.FINITE"></a>

#### types.FINITE : <code>string</code>
Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 value can be either a safe integer or a [floating point number](#rtvref.types.FLOAT).
 It must also be a number [primitive](#rtvref.types.primitives).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)


* * *

<a name="rtvref.types.INT"></a>

#### types.INT : <code>string</code>
Int rules per qualifiers: Must be a [finite](#rtvref.types.FINITE) integer,
 but is not necessarily _safe_. It must also be a number
 [primitive](#rtvref.types.primitives).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [FINITE](#rtvref.types.FINITE)
- [FLOAT](#rtvref.types.FLOAT)
- [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)


* * *

<a name="rtvref.types.FLOAT"></a>

#### types.FLOAT : <code>string</code>
Float rules per qualifiers: Must be a [finite](#rtvref.types.FINITE)
 floating point number. It must also be a number
 [primitive](#rtvref.types.primitives).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [INT](#rtvref.types.INT)


* * *

<a name="rtvref.types.FUNCTION"></a>

#### types.FUNCTION : <code>string</code>
Function rules per qualifiers: Must be a `function`.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.REGEXP"></a>

#### types.REGEXP : <code>string</code>
RegExp rules per qualifiers: Must be a `RegExp` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp


* * *

<a name="rtvref.types.DATE"></a>

#### types.DATE : <code>string</code>
Date rules per qualifiers: Must be a `Date` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date


* * *

<a name="rtvref.types.ERROR"></a>

#### types.ERROR : <code>string</code>
Error rules per qualifiers: Must be an `Error` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error


* * *

<a name="rtvref.types.PROMISE"></a>

#### types.PROMISE : <code>string</code>
Promise rules per qualifiers: Must be a `Promise` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise


* * *

<a name="rtvref.types.ARRAY"></a>

#### types.ARRAY : <code>string</code>
Array rules per qualifiers: Must be an `Array`. Empty arrays are permitted,
 unless arguments prevent them.

Arguments (optional): [ARRAY_args](#rtvref.types.ARRAY_args). Note that the `ARRAY`
 type must be specified when using arguments (i.e. the shorthand notation
 cannot be used).

When describing arrays, either _shorthand_ or _full_ notation may be used.
 In the shorthand notation, the `ARRAY` type isn't necessary, but
 [arguments](#rtvref.types.ARRAY_args) can't be specified. In the full
 notation, the `ARRAY` type is required, but arguments can optionally be
 specified.

<h4>Example: Shorthand notation</h4>

The 'value' property must be an array (possibly empty) of finite numbers of
 any value.

<pre><code>{
  value: [[FINITE]]
}
</code></pre>

<h4>Example: Shorthand, mixed types</h4>

The 'value' property must be either a boolean, or an array (possibly empty) of
 finite numbers of any value.

<pre><code>{
  value: [BOOLEAN, [FINITE]]
}
</code></pre>

<h4>Example: Full notation</h4>

The 'value' property must be an array (possibly empty) of finite numbers of
 any value.

<pre><code>{
  value: [ARRAY, [FINITE]]
}
</code></pre>

<h4>Example: Full, mixed types, arguments</h4>

The 'value' property must be either a boolean, or a non-empty array of finite
 numbers of any value.

<pre><code>{
  value: [BOOLEAN, ARRAY, {min: 1}, [FINITE]]
}
</code></pre>

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.ANY_OBJECT"></a>

#### types.ANY_OBJECT : <code>string</code>
An _any_ object is anything that is __not__ a [primitive](#rtvref.types), which
 means it includes the `Array` type, as well as functions and arguments, and
 other JavaScript _object_ types. To test for an array, use the
 [ARRAY](#rtvref.types.ARRAY) type. To test for a function, use the
 [FUNCTION](#rtvref.types.FUNCTION) type.

The following values are considered any objects:

- `{}`
- `new Object()`
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `function(){}` (also see [FUNCTION](#rtvref.types.FUNCTION))
- `arguments` (function arguments)
- `new function() {}` (class instance) (also see [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT))
- `new Map()` (also see [MAP](#rtvref.types.MAP))
- `new WeakMap()` (also see [WEAK_MAP](#rtvref.types.WEAK_MAP))
- `new Set()` (also see [SET](#rtvref.types.SET))
- `new WeakSet()` (also see [WEAK_SET](#rtvref.types.WEAK_SET))

[Primitive](#rtvref.types.primitives) values __are not__ considered any objects,
 especially when the qualifier is [REQUIRED](#rtvref.qualifiers.REQUIRED).
 Note that `typeof null === 'object'` in JavaScript; the `ANY_OBJECT` type
 allows testing for this undesirable fact.

Any object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional): [shape_descriptor](#rtvref.shape_descriptor)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)


* * *

<a name="rtvref.types.OBJECT"></a>

#### types.OBJECT : <code>string</code>
An object is one that extends from `JavaScript.Object` (i.e. an _instance_
 of _something_ that extends from Object) and is not a
 [function](#rtvref.types.FUNCTION), [array](#rtvref.types.ARRAY),
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

- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `function(){}` (also see [FUNCTION](#rtvref.types.FUNCTION))
- `arguments` (function arguments)
- `new Map()` (also see [MAP](#rtvref.types.MAP))
- `new WeakMap()` (also see [WEAK_MAP](#rtvref.types.WEAK_MAP))
- `new Set()` (also see [SET](#rtvref.types.SET))
- `new WeakSet()` (also see [WEAK_SET](#rtvref.types.WEAK_SET))
- all [primitives](#rtvref.types.primitives)

Object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional): [shape_descriptor](#rtvref.shape_descriptor)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)


* * *

<a name="rtvref.types.PLAIN_OBJECT"></a>

#### types.PLAIN_OBJECT : <code>string</code>
A _plain_ object is one that is created directly from the `Object` constructor,
 whether using `new Object()` or the literal `{}`.

The following values are considered plain objects:

- `{}`
- `new Object()`

The following values __are not__ considered plain objects:

- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `new function() {}` (class instance)
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `function(){}` (also see [FUNCTION](#rtvref.types.FUNCTION))
- `arguments` (function arguments)
- `new Map()` (also see [MAP](#rtvref.types.MAP))
- `new WeakMap()` (also see [WEAK_MAP](#rtvref.types.WEAK_MAP))
- `new Set()` (also see [SET](#rtvref.types.SET))
- `new WeakSet()` (also see [WEAK_SET](#rtvref.types.WEAK_SET))
- all [primitives](#rtvref.types.primitives)

Plain object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional): [shape_descriptor](#rtvref.shape_descriptor)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)


* * *

<a name="rtvref.types.CLASS_OBJECT"></a>

#### types.CLASS_OBJECT : <code>string</code>
A _class_ object is one that is created by invoking the `new` operator on a
 function (other than a primitive type function), generating a new object,
 commonly referred to as a _class instance_. This object's prototype
 (`__proto__`) is a reference to that function's `prototype` and has a
 `constructor` property that is `===` to the function.

The following values are considered class objects:

- `new function() {}`

The following values __are not__ considered class objects:

- `{}`
- `new Object()`
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `function(){}` (also see [FUNCTION](#rtvref.types.FUNCTION))
- `arguments` (function arguments)
- `new Map()` (also see [MAP](#rtvref.types.MAP))
- `new WeakMap()` (also see [WEAK_MAP](#rtvref.types.WEAK_MAP))
- `new Set()` (also see [SET](#rtvref.types.SET))
- `new WeakSet()` (also see [WEAK_SET](#rtvref.types.WEAK_SET))
- all [primitives](#rtvref.types.primitives)

Class object rules per qualifiers:

- REQUIRED: Per the lists above.
- EXPECTED: `null` is allowed.
- OPTIONAL: `undefined` is allowed.

Arguments (optional): [CLASS_OBJECT_args](#rtvref.types.CLASS_OBJECT_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)


* * *

<a name="rtvref.types.MAP_OBJECT"></a>

#### types.MAP_OBJECT : <code>string</code>
A _map_ object is an [OBJECT](#rtvref.types.OBJECT) that is treated as a
 hash map with an expected set of keys and values. Keys can be described
 using a regular expression, and values can be described using a
 [typeset](#rtvref.types.typeset). Empty maps are permitted.

Map object rules per qualifiers: Same as [OBJECT](#rtvref.types.OBJECT) rules.

Arguments (optional): [collection_args](#rtvref.types.collection_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [MAP](#rtvref.types.MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)


* * *

<a name="rtvref.types.MAP"></a>

#### types.MAP : <code>string</code>
An ES6 map supports any value as its keys, unlike a
 [MAP_OBJECT](#rtvref.types.MAP_OBJECT) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtvref.types.typeset). Empty maps are permitted
 by default.

Map rules per qualifiers: Must be a `Map` instance.

Arguments (optional): [collection_args](#rtvref.types.collection_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)


* * *

<a name="rtvref.types.WEAK_MAP"></a>

#### types.WEAK_MAP : <code>string</code>
An ES6 weak map supports any _object_ as its keys, unlike a
 [MAP_OBJECT](#rtvref.types.MAP_OBJECT) that only supports strings,
 and a [MAP](#rtvref.types.MAP) that supports any type of value.

Weak map rules per qualifiers: Must be a `WeakMap` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [MAP](#rtvref.types.MAP)


* * *

<a name="rtvref.types.SET"></a>

#### types.SET : <code>string</code>
An ES6 set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtvref.types.typeset). Empty sets are permitted
 by default.

Set rules per qualifiers: Must be a `Set` instance.

Arguments (optional): [collection_args](#rtvref.types.collection_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [WEAK_SET](#rtvref.types.WEAK_SET)


* * *

<a name="rtvref.types.WEAK_SET"></a>

#### types.WEAK_SET : <code>string</code>
An ES6 weak set is a collection of weakly held _unique_ _objects_ without
 associated keys.

Weak set rules per qualifiers: Must be a `WeakSet` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [SET](#rtvref.types.SET)


* * *

<a name="rtvref.types.JSON"></a>

#### types.JSON : <code>string</code>
JSON rules per qualifiers: Must be a JSON value:

- [string](#rtvref.types.STRING), however __empty strings are permitted__,
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

* * *

<a name="rtvref.types.DEFAULT_OBJECT_TYPE"></a>

#### types.DEFAULT_OBJECT_TYPE : <code>string</code>
Default object type: [OBJECT](#rtvref.types.OBJECT)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.type_arguments"></a>

#### types.type_arguments : <code>Object</code>
<h3>Type Arguments</a></h3>

Some types will accept, or may even expect, one or more arguments. Each type
 will specify whether it has arguments, and if they're optional or required.
 Arguments are specified as a single object immediately following a type in an
 __Array__ [typeset](#rtvref.types.typeset) (i.e. an Array must be used as
 the typeset in order to provide arguments for a type).

An arguments object immediately follows its type in a typeset, such as
 `[PLAIN_OBJECT, {hello: STRING}]`. This would specify the value must be a
 [plain object](#rtvref.types.PLAIN_OBJECT) with a shape that includes a
 property named 'hello', that property being a
 [required](#rtvref.qualifiers.REQUIRED) [string](#rtvref.types.STRING).
 Another example would be `[STRING, {min: 5}]`, which would require a string
 of at least 5 characters in length.

Since [qualifiers](#rtvref.qualifiers) may affect how a value is validated
 against a type, [qualifier rules](#rtvref.types.rules) always take
 __precedence__ over any argument specified. For example, `[STRING, {min: 0}]`
 would fail to validate an empty string because the _implied_ qualifier
 is `REQUIRED`, and per [STRING](#rtvref.types.STRING) qualifier rules,
 required strings cannot be empty.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.collection_args"></a>

#### types.collection_args : <code>Object</code>
<h3>Collection Arguments</h3>

Describes the keys and values in a collection-based object, which is one of
 the following types:

- [MAP_OBJECT](#rtvref.types.MAP_OBJECT) (NOTE: only __own-enumerable
  properties__ are considered part of this type of collection)
- [MAP](#rtvref.types.MAP)
- [SET](#rtvref.types.SET) (with some exceptions)

For example, the following arguments both verify a collection of 3-letter
 string keys (upper- or lowercase) to finite numbers:

- `{keyExp: '[a-z]{3}', keyFlagSpec: 'i', values: FINITE}`
- `{keyExp: '[a-zA-Z]{3}', values: FINITE}`

Note that [ARRAY](#rtvref.types.ARRAY) is __not__ included in this list
 because the array type has special syntax for describing the type of its items.
 See [ARRAY_args](#rtvref.types.ARRAY_args) instead.

The [WEAK_MAP](#rtvref.types.WEAK_MAP) and [WEAK_SET](#rtvref.types.WEAK_SET)
 types do not apply because, due to their nature, their elements cannot be
 iterated.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**

- [MAP_OBJECT](#rtvref.types.MAP_OBJECT)
- [MAP](#rtvref.types.MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)
- [SET](#rtvref.types.SET)
- [WEAK_SET](#rtvref.types.WEAK_SET)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [length] | <code>number</code> | The exact number of elements required in  the collection. A negative value allows for any number of entries. Zero  requires an empty collection. Ignored if not a  [FINITE](#rtvref.types.FINITE) number.  Applies to: All collection types. |
| [keys] | [<code>typeset</code>](#rtvref.types.typeset) | A typeset describing each key  in the collection.  If the type is [MAP_OBJECT](#rtvref.types.MAP_OBJECT), this argument is   hard set to the [STRING](#rtvref.types.STRING) type due to the nature of   its JavaScript `Object`-based implementation and does not need to be specified.  Applies to: [MAP_OBJECT](#rtvref.types.MAP_OBJECT) (with restrictions),   [MAP](#rtvref.types.MAP), [WEAK_MAP](#rtvref.types.MAP). |
| [keyExp] | <code>string</code> | A string-based regular expression describing the  names of keys found in the collection. By default, there are no restrictions  on key names. Ignored if the key type is not [STRING](#rtvref.types.STRING),  as specified in `keys`.  For example, to require numerical keys, the following expression could be   used: `"^\\d+$"`.  Applies to: [MAP_OBJECT](#rtvref.types.MAP_OBJECT),   [MAP](#rtvref.types.MAP), [WEAK_MAP](#rtvref.types.MAP). |
| [keyFlagSpec] | <code>string</code> | A string specifying any flags to use with  the regular expression specified in `keyExp`. Ignored if _falsy_ or if  `keyExp` is not specified. See the  [RegExp#flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)  parameter for more information.  Applies to: [MAP_OBJECT](#rtvref.types.MAP_OBJECT),   [MAP](#rtvref.types.MAP), [WEAK_MAP](#rtvref.types.MAP). |
| [values] | [<code>typeset</code>](#rtvref.types.typeset) | A typeset describing each value in  the collection. Defaults to the [ANY](#rtvref.types.ANY) type which allows  _anything_. All values must match this typeset (but the collection is not  required to have any elements to be considered valid, unless `length` is  specified).  For example, to require arrays of non-empty string values as values in the   collection, the following typeset could be used: `[[types.STRING]]`.  Applies to: All collection types. |


* * *

<a name="rtvref.types.typeset"></a>

#### types.typeset : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
<h3>Typeset</h3>

Describes the possible types for a given value. It can be any one of the following
 JavaScript types:

- `Object`: For the root or a nested [shape descriptor](#rtvref.shape_descriptor)
  of _implied_ [OBJECT](#rtvref.types.OBJECT) type (unless paired with a specific
  object type like [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT), for example, when
  using the `Array` notation, e.g. `[PLAIN_OBJECT, {...}]`). If the object is empty
  (has no properties), nothing will be verified (anything will pass).
- `String`: For a single type, such as [FINITE](#rtvref.types.FINITE)
  for a finite number. Must be one of the types defined in [types](#rtvref.types).
- `Function`: For a [property validator](#rtvref.types.property_validator)
  that will verify the value of the property using custom code. Since the Array
  form is not being used (only the validator is being provided), it's always
  invoked immediately. Since a type is not provided, the [ANY](#rtvref.types.ANY)
  type is implied.
- `Array`: For multiple type possibilities, optionally [qualified](#rtvref.qualifiers),
  using an __OR__ conjunction, which means the value of the property being described must
  match at _least one_ of the types listed, but not all. Matching is done in a short-circuit
  fashion, from the first to the last element in the typeset. If a simpler type is likely,
  it's more performant to specify it first/earlier in the typeset to avoid a match attempt
  on a nested shape or Array.
  - Cannot be an empty Array.
  - A given type may not be included more than once in the typeset, but may appear
    again in a nested typeset (when a parent typeset describes an
    [Array](rtfref.types.ARRAY) or type of [Object](rtfref.types.OBJECT)).
  - An Array is necessary to [qualify](#rtvref.qualifiers) the typeset as not
    required (see _Typeset Qualifiers_ below).
  - An Array is necessary if a type needs or requires
    [arguments](#rtvref.types.type_arguments).
  - If the __first__ element (or second, if a [qualifier](rtvref.types.qualifiers)
    is provided, but the typeset is not
    [fully-qualified](#rtvref.types.fully_qualified_typeset)), is an `Object`,
    it's treated as a nested [shape descriptor](#rtvref.shape_descriptor)
    describing an object of the default [OBJECT](#rtvref.types.OBJECT) type.
    To include a shape descriptor at any other position within the array, it
    __must__ be preceded by a type, even if the default `OBJECT` type is being
    used (i.e. `OBJECT` must be specified as the type).
  - If an element is an `Array` (any position), it's treated as a __nested list__
    with an implied [ARRAY](#rtvref.types.ARRAY) type, e.g.
    `[BOOLEAN, [STRING, FINITE]]` would describe a property that should be a boolean,
    or an array of non-empty strings or finite numbers. See the `ARRAY` type
    reference for more information on _shorthand_ and _full_ notations.
  - If an element is a `Function`, it must be the __last__ element in the Array
    and will be treated as a [property validator](#rtvref.types.property_validator).
    Only one validator can be specified for a given typeset (additional validators
    may appear in nested typesets).

<h4>Typeset Qualifiers</h4>

All typesets use an _implied_ [REQUIRED](#rtvref.qualifiers.REQUIRED)
 qualifier unless otherwise specified. To qualify a typeset, a
 [qualifier](#rtvref.qualifiers) may be specified as the __first__ element
 in the `Array` form (if specified, it must be the first element). For example,
 `{note: [EXPECTED, STRING]}` would describe an object with a 'note' property
 that is an expected, but not required, string, which could therefore be either
 empty or even `null`. The `Array` form must be used in order to qualify a
 typeset as other than required, and the qualifier applies to all immediate
 types in the typeset (which means each nested typeset can have its own qualifier).

<h4>Example: Object</h4>

<pre><code>const contactShape = {
  name: rtv.t.STRING, // required, non-empty, string
  tags: [rtv.t.ARRAY, [rtv.t.STRING]], // required array of non-empty strings
  // tags: [[rtv.t.STRING]], // same as above, but using shortcut array format
  details: { // required nested object of type `OBJECT` (default)
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

* * *

<a name="rtvref.types.fully_qualified_typeset"></a>

#### types.fully_qualified_typeset : <code>Array</code>
<h3>Fully-Qualified Typeset</h3>

A [typeset](#rtvref.types.typeset) expressed without any shortcut notations
 or implied/default types to make it easier to parse, especially as the `match`
 parameter given to a [property validator](#rtvref.types.property_validator).
 A fully-qualified typeset always uses the array notation, and has a single
 [qualifier](#rtvref.qualifiers) as its first element, followed by
 at least one type, and at most one validator.

For example:

- `STRING` -> `[REQUIRED, STRING]`
- `{note: STRING}` -> `[REQUIRED, OBJECT, {note: [REQUIRED, STRING]}]`
- `[[FINITE]]` -> `[REQUIRED, ARRAY, [REQUIRED, FINITE]]`
- `(v) => !!v` -> `[REQUIRED, ANY, (v) => !!v]`

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.property_validator"></a>

#### types.property_validator ⇒ <code>boolean</code>
<h3>Property Validator</h3>

A function used as a [typeset](#rtvref.types.typeset), or as a subset to
 a typeset, to provide custom verification of the value being verified.

A typeset may only have one validator, and the validator is only called if
 the value being verified was verified by at least one type in the typeset.
 The validator must be the __last__ element within the typeset (if the typeset
 is an array, and a validator is needed). The validator must also be
 specified _after_ the [qualifier](#rtvref.qualifiers) in a typeset Array.
 The validator is invoked immediately after the first type match, but only if
 a type match is made. If the typeset is not
 [fully-qualified](#rtvref.types.fully_qualified_typeset) and does not
 explicitly specify a type, the [ANY](#rtvref.types.ANY) type is implied.

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
| match | <code>Array</code> | A __first-level__, [fully-qualified](#rtvref.types.fully_qualified_typeset)  typeset describing the type that matched. This means the first level of this  subset of `typeset` (the 3rd parameter) is fully-qualified, but any nested  [shape descriptors](#rtvref.shape_descriptor) or arrays will not be (they  will remain references to the same shapes/arrays in `typeset`). For example,  if the given typeset was `[PLAIN_OBJECT, {note: STRING}]`, this parameter  would be a new typeset array `[REQUIRED, PLAIN_OBJECT, {note: STRING}]`,  and the `typeset` parameter would be the original `[PLAIN_OBJECT, {note: STRING}]`. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Reference to the typeset used for  verification. Note that the typeset may contain nested typeset(s), and may  be part of a larger parent typeset (though there would be no reference to  the parent typeset, if any). This typeset is as it was specified in the  parent shape, and therefore it may not be fully-qualified. |


* * *

<a name="rtvref.types.STRING_args"></a>

#### types.STRING_args : <code>Object</code>
<h3>String Arguments</h3>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [STRING](#rtvref.types.STRING)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [exact] | <code>string</code> | An exact string to match. |
| [partial] | <code>string</code> | A partial value to match (must be somewhere  within the string). Ignored if empty string, or `exact` is specified. `min`  and `max` take __precedence__ over this argument (the length will be  validated first, then a partial match will be attempted). |
| [min] | <code>number</code> | Minimum inclusive length. Defaults to 1 for a  `REQUIRED` string, and 0 for an `EXPECTED` or `OPTIONAL` string. Ignored if  `exact` is specified, or `min` is not a [FINITE](#rtvref.types.FINITE)  number >= 0. |
| [max] | <code>number</code> | Maximum inclusive length. Negative means no maximum.  Ignored if `exact` is specified, `max` is not a  [FINITE](#rtvref.types.FINITE) number, or `max` is less than `min`. |


* * *

<a name="rtvref.types.numeric_args"></a>

#### types.numeric_args : <code>Object</code>
<h3>Numeric Value Arguments</h3>

Applicable to all numeric types.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**

- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [FLOAT](#rtvref.types.FLOAT)
- [qualifiers](#rtvref.qualifiers)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [exact] | <code>string</code> | An exact number to match. Ignored if not  within normal range of the type (e.g. for `NUMBER`, could be `+Infinity`,  or even `NaN` if the qualifier is not `REQUIRED`; but these values would be  ignored by `FINITE` since they aren't part of the `FINITE` range). |
| [min] | <code>number</code> | Minimum inclusive value. Ignored if `exact` is  specified, `min` is `NaN`, or `min` is not within normal range of the type. |
| [max] | <code>number</code> | Maximum inclusive value. Ignored if `exact` is  specified, `max` is `NaN`, `max` is not within normal range of the type,  or `max` is less than `min`. |


* * *

<a name="rtvref.types.ARRAY_args"></a>

#### types.ARRAY_args : <code>Object</code>
<h3>Array Arguments</h3>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [ARRAY](#rtvref.types.ARRAY)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [length] | <code>number</code> | Exact length. Ignored if not a  [FINITE](#rtvref.types.FINITE) number >= 0. |
| [min] | <code>number</code> | Minimum inclusive length. Ignored if `exact` is  specified, or `min` is not a [FINITE](#rtvref.types.FINITE) number >= 0. |
| [max] | <code>number</code> | Maximum inclusive length. Negative means no maximum.  Ignored if `exact` is specified, `max` is not a  [FINITE](#rtvref.types.FINITE) number, or `max` is less than `min`. |


* * *

<a name="rtvref.types.CLASS_OBJECT_args"></a>

#### types.CLASS_OBJECT_args : <code>Object</code>
[CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) arguments.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [ctr] | <code>function</code> | A reference to a constructor function. If specified,  the class object (instance) must have this class function in its inheritance  chain such that `<class_object> instanceof <function> === true`. Note that  this property is not serializable to JSON. If not specified, then the object  must be an [OBJECT](#rtvref.types.OBJECT) that is not a  [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) among the other values that  are not considered class objects. |
| [shape] | [<code>shape_descriptor</code>](#rtvref.shape_descriptor) | A description of the class object's  shape. |


* * *

<a name="rtvref.validation"></a>

### rtvref.validation : <code>object</code>
<h2>RTV Validation</h2>

This namespace provides _validation helpers_ which verify values to be of
 certain kinds, but not a single, specific [type](#rtvref.types) like
 [type validators](#rtvref.validator) do. For example, the
 [isTypeset](#rtvref.validation.isTypeset) helper verifies a value as a
 [typeset](#rtvref.types.typeset), which is not an actual type, while
 the [isString validator](#rtvref.validator.isString) verifies a value
 as a [string](#rtvref.types.STRING).

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.validation](#rtvref.validation) : <code>object</code>
    * [.isPrimitive(v)](#rtvref.validation.isPrimitive) ⇒ <code>boolean</code>
    * [.isTypeset(v, [options])](#rtvref.validation.isTypeset) ⇒ <code>boolean</code>


* * *

<a name="rtvref.validation.isPrimitive"></a>

#### validation.isPrimitive(v) ⇒ <code>boolean</code>
Determines if a value is a JavaScript [primitive](#rtvref.types.primitives).

**Kind**: static method of [<code>validation</code>](#rtvref.validation)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* * *

<a name="rtvref.validation.isTypeset"></a>

#### validation.isTypeset(v, [options]) ⇒ <code>boolean</code>
Determines if a value is a typeset.

**Kind**: static method of [<code>validation</code>](#rtvref.validation)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  
**See**: [typeset](#rtvref.types.typeset)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| v | <code>\*</code> |  | Value to validate. |
| [options] | <code>Object</code> |  | Validation options. |
| [options.deep] | <code>boolean</code> | <code>false</code> | If truthy, deeply-validates any nested typesets. Note  that typesets in nested shapes are also deeply-validated. |
| [options.fullyQualified] | <code>boolean</code> | <code>false</code> | If truthy, the typeset must be fully-qualified. |


* * *

<a name="rtvref.validator"></a>

### rtvref.validator : <code>object</code>
<h2>RTV Type Validators</h2>

This namespace provides validators for each supported [type](#rtvref.types),
 capable of validating a value against that type. Validators differ from
 _validation helpers_ provided by the [validation](#rtvref.validation)
 module in that validators verify a value against a single, specific type,
 whereas the validation helpers do not.

The default export for a validator module is a
 .

__Every validator module must provide the following interface:__

- `{function} default` (the default export): The
  [type validator](#rtvref.validator.type_validator) itself.
- `{string} type`: The [type](#rtvref.types) verified.
- `{function} config`: The
  [configuration function](#rtvref.validator.validator_config).

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.validator](#rtvref.validator) : <code>object</code>
    * [.isAny(v)](#rtvref.validator.isAny) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isAny.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isAny.config)
    * [.isAnyObject(v)](#rtvref.validator.isAnyObject) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isAnyObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isAnyObject.config)
    * [.isArray(v, [q], [args])](#rtvref.validator.isArray) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isArray.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isArray.config)
    * [.isBoolean(v)](#rtvref.validator.isBoolean) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isBoolean.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isBoolean.config)
    * [.isFinite(v, [q], [args])](#rtvref.validator.isFinite) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isFinite.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isFinite.config)
    * [.isFunction(v)](#rtvref.validator.isFunction) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isFunction.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isFunction.config)
    * [.isMap(v, [q], [args])](#rtvref.validator.isMap) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isMap.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isMap.config)
    * [.isNumber(v, [q], [args])](#rtvref.validator.isNumber) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isNumber.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isNumber.config)
    * [.isObject(v)](#rtvref.validator.isObject) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isObject.config)
    * [.isRegExp(v)](#rtvref.validator.isRegExp) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isRegExp.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isRegExp.config)
    * [.isSet(v, [q], [args])](#rtvref.validator.isSet) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isSet.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isSet.config)
    * [.isString(v, [q], [args])](#rtvref.validator.isString) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isString.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isString.config)
    * [.isSymbol(v)](#rtvref.validator.isSymbol) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isSymbol.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isSymbol.config)
    * [.isWeakMap(v)](#rtvref.validator.isWeakMap) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isWeakMap.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isWeakMap.config)
    * [.isWeakSet(v)](#rtvref.validator.isWeakSet) ⇒ <code>boolean</code>
        * [.type](#rtvref.validator.isWeakSet.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.isWeakSet.config)
    * [.type_validator(value, [qualifier], [args])](#rtvref.validator.type_validator) ⇒ <code>boolean</code>
    * [.validator_config(settings)](#rtvref.validator.validator_config)


* * *

<a name="rtvref.validator.isAny"></a>

#### validator.isAny(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [ANY](#rtvref.types.ANY) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isAny(v)](#rtvref.validator.isAny) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isAny.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isAny.config)


* * *

<a name="rtvref.validator.isAny.type"></a>

##### isAny.type : <code>string</code>
Type: [ANY](#rtvref.types.ANY)

**Kind**: static constant of [<code>isAny</code>](#rtvref.validator.isAny)  

* * *

<a name="rtvref.validator.isAny.config"></a>

##### isAny.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isAny</code>](#rtvref.validator.isAny)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isAnyObject"></a>

#### validator.isAnyObject(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [ANY_OBJECT](#rtvref.types.ANY_OBJECT) type.

Determines if a value is _any_ type of object except a primitive.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isAnyObject(v)](#rtvref.validator.isAnyObject) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isAnyObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isAnyObject.config)


* * *

<a name="rtvref.validator.isAnyObject.type"></a>

##### isAnyObject.type : <code>string</code>
Type: [ANY_OBJECT](#rtvref.types.ANY_OBJECT)

**Kind**: static constant of [<code>isAnyObject</code>](#rtvref.validator.isAnyObject)  

* * *

<a name="rtvref.validator.isAnyObject.config"></a>

##### isAnyObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isAnyObject</code>](#rtvref.validator.isAnyObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isArray"></a>

#### validator.isArray(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [ARRAY](#rtvref.types.ARRAY) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>ARRAY_args</code>](#rtvref.types.ARRAY_args) | Type arguments. |


* [.isArray(v, [q], [args])](#rtvref.validator.isArray) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isArray.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isArray.config)


* * *

<a name="rtvref.validator.isArray.type"></a>

##### isArray.type : <code>string</code>
Type: [ARRAY](#rtvref.types.ARRAY)

**Kind**: static constant of [<code>isArray</code>](#rtvref.validator.isArray)  

* * *

<a name="rtvref.validator.isArray.config"></a>

##### isArray.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isArray</code>](#rtvref.validator.isArray)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isBoolean"></a>

#### validator.isBoolean(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [BOOLEAN](#rtvref.types.BOOLEAN) type.

Determines if a value is a boolean literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Boolean(true)`, which is an object that is a boolean.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isBoolean(v)](#rtvref.validator.isBoolean) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isBoolean.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isBoolean.config)


* * *

<a name="rtvref.validator.isBoolean.type"></a>

##### isBoolean.type : <code>string</code>
Type: [BOOLEAN](#rtvref.types.BOOLEAN)

**Kind**: static constant of [<code>isBoolean</code>](#rtvref.validator.isBoolean)  

* * *

<a name="rtvref.validator.isBoolean.config"></a>

##### isBoolean.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isBoolean</code>](#rtvref.validator.isBoolean)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isFinite"></a>

#### validator.isFinite(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [FINITE](#rtvref.types.FINITE) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |


* [.isFinite(v, [q], [args])](#rtvref.validator.isFinite) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isFinite.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isFinite.config)


* * *

<a name="rtvref.validator.isFinite.type"></a>

##### isFinite.type : <code>string</code>
Type: [FINITE](#rtvref.types.FINITE)

**Kind**: static constant of [<code>isFinite</code>](#rtvref.validator.isFinite)  

* * *

<a name="rtvref.validator.isFinite.config"></a>

##### isFinite.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isFinite</code>](#rtvref.validator.isFinite)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isFunction"></a>

#### validator.isFunction(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [FUNCTION](#rtvref.types.FUNCTION) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isFunction(v)](#rtvref.validator.isFunction) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isFunction.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isFunction.config)


* * *

<a name="rtvref.validator.isFunction.type"></a>

##### isFunction.type : <code>string</code>
Type: [FUNCTION](#rtvref.types.FUNCTION)

**Kind**: static constant of [<code>isFunction</code>](#rtvref.validator.isFunction)  

* * *

<a name="rtvref.validator.isFunction.config"></a>

##### isFunction.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isFunction</code>](#rtvref.validator.isFunction)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isMap"></a>

#### validator.isMap(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [MAP](#rtvref.types.MAP) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>collection_args</code>](#rtvref.types.collection_args) | Type arguments. |


* [.isMap(v, [q], [args])](#rtvref.validator.isMap) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isMap.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isMap.config)


* * *

<a name="rtvref.validator.isMap.type"></a>

##### isMap.type : <code>string</code>
Type: [MAP](#rtvref.types.MAP)

**Kind**: static constant of [<code>isMap</code>](#rtvref.validator.isMap)  

* * *

<a name="rtvref.validator.isMap.config"></a>

##### isMap.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isMap</code>](#rtvref.validator.isMap)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isNumber"></a>

#### validator.isNumber(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [NUMBER](#rtvref.types.NUMBER) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |


* [.isNumber(v, [q], [args])](#rtvref.validator.isNumber) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isNumber.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isNumber.config)


* * *

<a name="rtvref.validator.isNumber.type"></a>

##### isNumber.type : <code>string</code>
Type: [NUMBER](#rtvref.types.NUMBER)

**Kind**: static constant of [<code>isNumber</code>](#rtvref.validator.isNumber)  

* * *

<a name="rtvref.validator.isNumber.config"></a>

##### isNumber.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isNumber</code>](#rtvref.validator.isNumber)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isObject"></a>

#### validator.isObject(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [OBJECT](#rtvref.types.OBJECT) type.

Determines if a value is an object that extends from `JavaScript.Object` and
 is not a function, array, regex, map, weak map, set, weak set, or primitive.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isObject(v)](#rtvref.validator.isObject) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isObject.config)


* * *

<a name="rtvref.validator.isObject.type"></a>

##### isObject.type : <code>string</code>
Type: [OBJECT](#rtvref.types.OBJECT)

**Kind**: static constant of [<code>isObject</code>](#rtvref.validator.isObject)  

* * *

<a name="rtvref.validator.isObject.config"></a>

##### isObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isObject</code>](#rtvref.validator.isObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isRegExp"></a>

#### validator.isRegExp(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [REGEXP](#rtvref.types.REGEXP) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isRegExp(v)](#rtvref.validator.isRegExp) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isRegExp.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isRegExp.config)


* * *

<a name="rtvref.validator.isRegExp.type"></a>

##### isRegExp.type : <code>string</code>
Type: [REGEXP](#rtvref.types.REGEXP)

**Kind**: static constant of [<code>isRegExp</code>](#rtvref.validator.isRegExp)  

* * *

<a name="rtvref.validator.isRegExp.config"></a>

##### isRegExp.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isRegExp</code>](#rtvref.validator.isRegExp)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isSet"></a>

#### validator.isSet(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [SET](#rtvref.types.SET) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>collection_args</code>](#rtvref.types.collection_args) | Type arguments. |


* [.isSet(v, [q], [args])](#rtvref.validator.isSet) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isSet.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isSet.config)


* * *

<a name="rtvref.validator.isSet.type"></a>

##### isSet.type : <code>string</code>
Type: [SET](#rtvref.types.SET)

**Kind**: static constant of [<code>isSet</code>](#rtvref.validator.isSet)  

* * *

<a name="rtvref.validator.isSet.config"></a>

##### isSet.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isSet</code>](#rtvref.validator.isSet)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isString"></a>

#### validator.isString(v, [q], [args]) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [STRING](#rtvref.types.STRING) type.

Determines if a value is a string literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new String('value')`, which is an object that is a string.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>STRING_args</code>](#rtvref.types.STRING_args) | Type arguments. |


* [.isString(v, [q], [args])](#rtvref.validator.isString) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isString.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isString.config)


* * *

<a name="rtvref.validator.isString.type"></a>

##### isString.type : <code>string</code>
Type: [STRING](#rtvref.types.STRING)

**Kind**: static constant of [<code>isString</code>](#rtvref.validator.isString)  

* * *

<a name="rtvref.validator.isString.config"></a>

##### isString.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isString</code>](#rtvref.validator.isString)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isSymbol"></a>

#### validator.isSymbol(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [SYMBOL](#rtvref.types.SYMBOL) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isSymbol(v)](#rtvref.validator.isSymbol) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isSymbol.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isSymbol.config)


* * *

<a name="rtvref.validator.isSymbol.type"></a>

##### isSymbol.type : <code>string</code>
Type: [SYMBOL](#rtvref.types.SYMBOL)

**Kind**: static constant of [<code>isSymbol</code>](#rtvref.validator.isSymbol)  

* * *

<a name="rtvref.validator.isSymbol.config"></a>

##### isSymbol.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isSymbol</code>](#rtvref.validator.isSymbol)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isWeakMap"></a>

#### validator.isWeakMap(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [WEAK_MAP](#rtvref.types.WEAK_MAP) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isWeakMap(v)](#rtvref.validator.isWeakMap) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isWeakMap.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isWeakMap.config)


* * *

<a name="rtvref.validator.isWeakMap.type"></a>

##### isWeakMap.type : <code>string</code>
Type: [WEAK_MAP](#rtvref.types.WEAK_MAP)

**Kind**: static constant of [<code>isWeakMap</code>](#rtvref.validator.isWeakMap)  

* * *

<a name="rtvref.validator.isWeakMap.config"></a>

##### isWeakMap.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isWeakMap</code>](#rtvref.validator.isWeakMap)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.isWeakSet"></a>

#### validator.isWeakSet(v) ⇒ <code>boolean</code>
[Validator](#rtvref.validator.type_validator) for the
 [WEAK_SET](#rtvref.types.WEAK_SET) type.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |


* [.isWeakSet(v)](#rtvref.validator.isWeakSet) ⇒ <code>boolean</code>
    * [.type](#rtvref.validator.isWeakSet.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.isWeakSet.config)


* * *

<a name="rtvref.validator.isWeakSet.type"></a>

##### isWeakSet.type : <code>string</code>
Type: [WEAK_SET](#rtvref.types.WEAK_SET)

**Kind**: static constant of [<code>isWeakSet</code>](#rtvref.validator.isWeakSet)  

* * *

<a name="rtvref.validator.isWeakSet.config"></a>

##### isWeakSet.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>isWeakSet</code>](#rtvref.validator.isWeakSet)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Standard configuration settings. |


* * *

<a name="rtvref.validator.type_validator"></a>

#### validator.type_validator(value, [qualifier], [args]) ⇒ <code>boolean</code>
<h3>Type Validator Function</h3>

NOTE: A validator must always give __precedence__ to
 [qualifier rules](#rtvref.types.rules) for the type it's validating, over
 any arguments specified. For example,

NOTE: A validator __must not__ attempt to validate values considering basic
 [qualifier](#rtvref.qualifiers) rules like allowing `null` when EXPECTED
 vs not when REQUIRED, unless the type itself allows or disallows these
 special values. A validator should focus on checking for its type. For example,
 the [isString validator](rtvref.validation.isString) requires the value
 to be a string, excluding `null` and `undefined` regardless of the qualifier.
 It does, however, allow an empty string if the qualifier is not REQUIRED because
 that is one of its [type-specific qualifier rules](#rtvref.types.STRING).

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: <code>boolean</code> - `true` if the value is verified according to the qualifier
 and args; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to validate. |
| [qualifier] | <code>string</code> | The validation qualifier from the immediate  [typeset](#rtvref.types.typeset) in which the pertaining type was specified.  Validators should always default to [REQUIRED](#rtvref.qualifiers.REQUIRED)  to maintain consistent behavior. |
| [args] | <code>Object</code> | The arguments object, if any/applicable, for the type  being validated. For example, [string args](#rtvref.types.STRING_args) in  a typeset such as `[rtv.t.STRING, {min: 5}]` (a required string of at least  5 characters in length). |


* * *

<a name="rtvref.validator.validator_config"></a>

#### validator.validator_config(settings)
<h3>Type Validator Configuration Function</h3>

This function is called to provide the
 [type validator](#rtvref.validator.type_validator) with access to
 internal utilities.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | Configuration settings. |
| settings.impl | [<code>impl</code>](#rtvref.impl) | Reference to the `impl` module. |


* * *

<a name="rtvref.shape_descriptor"></a>

### rtvref.shape_descriptor : <code>Object</code>
<h2>Shape Descriptor</h2>

Describes the shape (i.e. interface) of an object as a map of properties to
 [typesets](#rtvref.types.typeset). Each typeset indicates whether the
 property is required, expected, or optional, using [qualifiers](#rtvref.qualifiers),
 along with possible types. Only enumerable, own-properties of the shape are
 considered part of the shape.

When a value is [checked](#rtv.check) or [verified](#rtv.verify) against
 a given shape, _properties on the value that are not part of the shape are
 ignored_. If successfully checked/verified, the value is guaranteed to provide
 the properties described in the shape, and each property is guaranteed to be
 assigned to a value of at least one type described in each property's typeset.

**Kind**: static typedef of [<code>rtvref</code>](#rtvref)  

* * *

<a name="rtv"></a>

## rtv : <code>object</code>
<h1>RTV.js</h1>

Runtime Verification Library for browsers and Node.js.

**Kind**: global namespace  

* [rtv](#rtv) : <code>object</code>
    * [.t](#rtv.t) : <code>rtvref.Enumeration.&lt;String, String&gt;</code>
    * [.q](#rtv.q) : <code>rtvref.Enumeration.&lt;String, String&gt;</code>
    * [.e](#rtv.e) : <code>boolean</code>
    * [.config](#rtv.config) : <code>object</code>
        * [.enabled](#rtv.config.enabled) : <code>boolean</code>
    * [.check(value, typeset)](#rtv.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.c(value, typeset)](#rtv.c) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.verify(value, typeset)](#rtv.verify) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
    * [.v(value, typeset)](#rtv.v) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
    * [.Context(context)](#rtv.Context)


* * *

<a name="rtv.t"></a>

### rtv.t : <code>rtvref.Enumeration.&lt;String, String&gt;</code>
Enumeration of [types](#rtvref.types).

**Kind**: static property of [<code>rtv</code>](#rtv)  

* * *

<a name="rtv.q"></a>

### rtv.q : <code>rtvref.Enumeration.&lt;String, String&gt;</code>
Enumeration of [qualifiers](#rtvref.qualifiers).

**Kind**: static property of [<code>rtv</code>](#rtv)  

* * *

<a name="rtv.e"></a>

### rtv.e : <code>boolean</code>
Shortcut proxy for reading [enabled](#rtv.config.enabled).

**Kind**: static property of [<code>rtv</code>](#rtv)  
**Read only**: true  

* * *

<a name="rtv.config"></a>

### rtv.config : <code>object</code>
RTV Library Configuration

**Kind**: static namespace of [<code>rtv</code>](#rtv)  

* * *

<a name="rtv.config.enabled"></a>

#### config.enabled : <code>boolean</code>
Globally enables or disables [verify](#rtv.verify) and [check](#rtv.check).

Use this, or the shortcut [e](#rtv.e), to enable code optimization
 when building source with a bundler that supports _tree shaking_ like
 [Rollup](https://rollupjs.org/) or [Webpack](https://webpack.js.org/).

<h4>Example</h4>

By conditionally calling [verify](#rtv.verify) based on the state of
 [enabled](#rtv.config.enabled), a bundler can be configured to completely
 remove the code from a production build.

// TODO: Add Rollup and Webpack examples.

<pre><code>if (rtv.config.enabled) {
 rtv.verify(jsonResult, expectedShape);
}

rtv.e && rtv.v(jsonResult, expectedShape); // even shorter
</code></pre>

**Kind**: static property of [<code>config</code>](#rtv.config)  
**See**: [rtv.enabled](rtv.enabled)  

* * *

<a name="rtv.check"></a>

### rtv.check(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value against a typeset for compliance.

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - Success indicator if the
 `value` is compliant to the `shape`; `RtvError` if not. __Unlike
 [verify()](#rtv.verify), an exception is not thrown__ if the
 `value` is non-compliant.

 Since both [RtvSuccess](#rtvref.RtvSuccess), returned when
  the check succeeds, as well as [RtvError](#rtvref.RtvError), returned
  when the check fails, have a `valid: boolean` property in common, it's
  easy to test for success/failure like this:
  `if (rtv.check(2, rtv.t.FINITE).valid) {...}`.

 __NOTE:__ This method always returns a success indicator if RTV.js is currently
  [disabled](#rtv.config.enabled).  
**Throws**:

- <code>Error</code> If `typeset` is not a valid typeset.

**See**

- [verify](#rtv.verify)
- [enabled](#rtv.config.enabled)
- [types](#rtvref.types)
- [shape_descriptor](#rtvref.shape_descriptor)


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.shape_descriptor). |


* * *

<a name="rtv.c"></a>

### rtv.c(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Shortcut proxy to [check](#rtv.check).

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - Success indicator if the
 `value` is compliant to the `shape`; `RtvError` if not. __Unlike
 [verify()](#rtv.verify), an exception is not thrown__ if the
 `value` is non-compliant.  
**Throws**:

- <code>Error</code> If `typeset` is not a valid typeset.

**See**: [check](#rtv.check)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.shape_descriptor). |


* * *

<a name="rtv.verify"></a>

### rtv.verify(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
__Requires__ a value to be compliant to a shape.

NOTE: This method does nothing if RTV.js is currently
 [disabled](#rtv.config.enabled).

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) - Success indicator IIF the `value` is compliant
 to the `shape`. Otherwise, an [RtvError](#rtvref.RtvError) __is thrown__.  
**Throws**:

- <code>RtvError</code> If the `value` is not compliant to the `shape`.
- <code>Error</code> If `typeset` is not a valid typeset.

**See**

- [check](#rtv.check)
- [enabled](#rtv.config.enabled)
- [types](#rtvref.types)
- [shape_descriptor](#rtvref.shape_descriptor)


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.shape_descriptor). |


* * *

<a name="rtv.v"></a>

### rtv.v(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
Shortcut proxy to [verify](#rtv.verify).

**Kind**: static method of [<code>rtv</code>](#rtv)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) - Success indicator IIF the `value` is compliant
 to the `shape`. Otherwise, an [RtvError](#rtvref.RtvError) __is thrown__.  
**Throws**:

- <code>RtvError</code> If the `value` is not compliant to the `shape`.

**See**: [verify](#rtv.verify)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.shape_descriptor). |


* * *

<a name="rtv.Context"></a>

### rtv.Context(context)
Contextual RTV Generator // TODO[docs]

**Kind**: static method of [<code>rtv</code>](#rtv)  

| Param | Type |
| --- | --- |
| context | <code>string</code> | 


* * *

