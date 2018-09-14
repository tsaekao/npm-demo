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
        * [new Enumeration(map, [name])](#new_rtvref.Enumeration_new)
        * [.$name](#rtvref.Enumeration+$name) : <code>string</code>
        * [.$values](#rtvref.Enumeration+$values) : <code>Array.&lt;String&gt;</code>
        * [.check(value)](#rtvref.Enumeration+check) ⇒ <code>\*</code> \| <code>undefined</code>
        * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
        * [.toString()](#rtvref.Enumeration+toString) ⇒ <code>string</code>
    * [.RtvError](#rtvref.RtvError) ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
        * [new RtvError(value, typeset, path, cause)](#new_rtvref.RtvError_new)
        * [.valid](#rtvref.RtvError+valid) : <code>boolean</code>
        * [.value](#rtvref.RtvError+value) : <code>\*</code>
        * [.typeset](#rtvref.RtvError+typeset) : [<code>typeset</code>](#rtvref.types.typeset)
        * [.path](#rtvref.RtvError+path) : <code>Array.&lt;string&gt;</code>
        * [.cause](#rtvref.RtvError+cause) : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
        * [.toString()](#rtvref.RtvError+toString) ⇒ <code>string</code>
    * [.RtvSuccess](#rtvref.RtvSuccess)
        * [new RtvSuccess()](#new_rtvref.RtvSuccess_new)
        * [.valid](#rtvref.RtvSuccess+valid) : <code>boolean</code>
        * [.toString()](#rtvref.RtvSuccess+toString) ⇒ <code>string</code>
    * [.impl](#rtvref.impl) : <code>object</code>
        * [.getQualifier(typeset)](#rtvref.impl.getQualifier) ⇒ <code>string</code>
        * [.toTypeset(type, [qualifier], [args], [fullyQualified])](#rtvref.impl.toTypeset) ⇒ [<code>typeset</code>](#rtvref.types.typeset)
        * [.fullyQualify(typeset, [qualifier])](#rtvref.impl.fullyQualify) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
        * [.extractNextType(typeset, [qualifier])](#rtvref.impl.extractNextType) ⇒ [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code>
        * [.checkType(value, singleType)](#rtvref.impl.checkType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.checkShape(value, shape)](#rtvref.impl.checkShape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.checkTypeset(value, typeset)](#rtvref.impl.checkTypeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.qualifiers](#rtvref.qualifiers) : <code>object</code>
        * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
        * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
        * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
        * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>
        * [.checkBasicRules(v, [q])](#rtvref.qualifiers.checkBasicRules) ⇒ <code>boolean</code>
    * [.types](#rtvref.types) : <code>object</code>
        * [.objTypes](#rtvref.types.objTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.argTypes](#rtvref.types.argTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.types](#rtvref.types.types) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.ANY](#rtvref.types.ANY) : <code>string</code>
        * [.NULL](#rtvref.types.NULL) : <code>string</code>
        * [.STRING](#rtvref.types.STRING) : <code>string</code>
        * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>string</code>
        * [.SYMBOL](#rtvref.types.SYMBOL) : <code>string</code>
        * [.NUMBER](#rtvref.types.NUMBER) : <code>string</code>
        * [.FINITE](#rtvref.types.FINITE) : <code>string</code>
        * [.INT](#rtvref.types.INT) : <code>string</code>
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
        * [.HASH_MAP](#rtvref.types.HASH_MAP) : <code>string</code>
        * [.MAP](#rtvref.types.MAP) : <code>string</code>
        * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>string</code>
        * [.SET](#rtvref.types.SET) : <code>string</code>
        * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>string</code>
        * [.JSON](#rtvref.types.JSON) : <code>string</code>
        * [.DEFAULT_OBJECT_TYPE](#rtvref.types.DEFAULT_OBJECT_TYPE) : <code>string</code>
        * [.primitives](#rtvref.types.primitives) : <code>\*</code>
        * [.rules](#rtvref.types.rules) : <code>\*</code>
        * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
        * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
        * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
        * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
        * [.custom_validator](#rtvref.types.custom_validator) ⇒ <code>boolean</code>
        * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
        * [.SYMBOL_args](#rtvref.types.SYMBOL_args) : <code>Object</code>
        * [.numeric_args](#rtvref.types.numeric_args) : <code>Object</code>
        * [.ARRAY_args](#rtvref.types.ARRAY_args) : <code>Object</code>
        * [.CLASS_OBJECT_args](#rtvref.types.CLASS_OBJECT_args) : <code>Object</code>
    * [.validation](#rtvref.validation) : <code>object</code>
        * [.method(value)](#rtvref.validation.method) ⇒ <code>boolean</code>
    * [.validator](#rtvref.validator) : <code>object</code>
        * [.type_validator(value, [qualifier], [args])](#rtvref.validator.type_validator) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.validator_config(settings)](#rtvref.validator.validator_config)
        * [.validator_config_settings](#rtvref.validator.validator_config_settings) : <code>Object</code>
    * [.shape_descriptor](#rtvref.shape_descriptor) : <code>Object</code>


* * *

<a name="rtvref.Enumeration"></a>

### rtvref.Enumeration
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.Enumeration](#rtvref.Enumeration)
    * [new Enumeration(map, [name])](#new_rtvref.Enumeration_new)
    * [.$name](#rtvref.Enumeration+$name) : <code>string</code>
    * [.$values](#rtvref.Enumeration+$values) : <code>Array.&lt;String&gt;</code>
    * [.check(value)](#rtvref.Enumeration+check) ⇒ <code>\*</code> \| <code>undefined</code>
    * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
    * [.toString()](#rtvref.Enumeration+toString) ⇒ <code>string</code>


* * *

<a name="new_rtvref.Enumeration_new"></a>

#### new Enumeration(map, [name])
Simple enumeration type. Own-properties on an instance are the keys in the
 specified `map`, with their associated values. Key names cannot start with
 "$".

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
- <code>Error</code> If `map` has a key that is a restricted property (starts with
 "$").


| Param | Type | Description |
| --- | --- | --- |
| map | <code>Object.&lt;String, \*&gt;</code> | Object mapping keys to values. Values cannot  be `undefined`. |
| [name] | <code>string</code> | Friendly name used to identify this enumeration,  especially in validation error messages. |


* * *

<a name="rtvref.Enumeration+$name"></a>

#### enumeration.$name : <code>string</code>
Friendly name (not necessarily unique among all enumeration instances)
 used to identify this enumeration, especially in validation error
 messages. Empty string if not specified during construction.

**Kind**: instance property of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Read only**: true  

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
    * [.path](#rtvref.RtvError+path) : <code>Array.&lt;string&gt;</code>
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
| path | <code>Array.&lt;string&gt;</code> | The path deep into `value` where the failure occurred.  An empty array signifies the _root_ (top-level) value that was checked. |
| cause | [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset) | The fully qualified typeset  that caused the failure. This is normally the fully-qualified version of `typeset`,  but could be a sub-type if `typeset` is an Array typeset or a  [shape descriptor](#rtvref.shape_descriptor). |


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

#### rtvError.path : <code>Array.&lt;string&gt;</code>
Path from `value` to the nested property that caused the failure. This
 is a shallow clone of the original `path` specified.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  

* * *

<a name="rtvref.RtvError+cause"></a>

#### rtvError.cause : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
Fully qualified typeset that caused the failure. This will be a subset
 of `typeset`, and possibly of a nested typeset within `typeset`
 expressing only the direct cause of the failure.

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
    * [.getQualifier(typeset)](#rtvref.impl.getQualifier) ⇒ <code>string</code>
    * [.toTypeset(type, [qualifier], [args], [fullyQualified])](#rtvref.impl.toTypeset) ⇒ [<code>typeset</code>](#rtvref.types.typeset)
    * [.fullyQualify(typeset, [qualifier])](#rtvref.impl.fullyQualify) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
    * [.extractNextType(typeset, [qualifier])](#rtvref.impl.extractNextType) ⇒ [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code>
    * [.checkType(value, singleType)](#rtvref.impl.checkType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.checkShape(value, shape)](#rtvref.impl.checkShape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.checkTypeset(value, typeset)](#rtvref.impl.checkTypeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)


* * *

<a name="rtvref.impl.getQualifier"></a>

#### impl.getQualifier(typeset) ⇒ <code>string</code>
Get the qualifier given any kind of typeset.

The typeset's validity is __not__ checked. The function attempts to get a
 qualifier, and defaults to the [default qualifier](qualifiers.DEFAULT_QUALIFIER)
 if it cannot.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: <code>string</code> - The applicable [qualifier](#rtvref.qualifiers) for the
 specified typeset, which is assumed to be valid.  

| Param | Type | Description |
| --- | --- | --- |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | The typeset in question. |


* * *

<a name="rtvref.impl.toTypeset"></a>

#### impl.toTypeset(type, [qualifier], [args], [fullyQualified]) ⇒ [<code>typeset</code>](#rtvref.types.typeset)
Convert a type, qualifier, and args into a typeset.

While the `qualifier`, `args`, and `fullyQualified` parameters are all
 optional and may be omitted, their order must be maintained: If needed,
 the `qualifier` must always be before `args`, and `args` before
 `fullyQualified`. Parameters with `undefined` values will be ignored.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>typeset</code>](#rtvref.types.typeset) - The simplest typeset that represents the
 combination of the specified type, qualifier, and args, unless `fullyQualified`
 was set to `true`, in which case it'll always be an array typeset and
 fully-qualified.  
**Throws**:

- <code>Error</code> If `type`, `qualifier`, or `args` is invalid.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  | A single type from [types](#rtvref.types.types). |
| [qualifier] | <code>string</code> \| <code>Object</code> \| <code>boolean</code> | <code>&quot;rtvref.qualifiers.DEFAULT_QUALIFIER&quot;</code> | Optional qualifier from [qualifiers](#rtvref.qualifiers.qualifiers). Can also be  either the `args` parameter, or the `fullyQualified` parameter if the  default qualifier is being used. |
| [args] | <code>Object</code> \| <code>boolean</code> |  | Optional  [type arguments](#rtvref.types.type_arguments). If specified, this  parameter must be an [object](#rtvref.types.OBJECT), however the  properties of the object are not validated against the specified `type`  (i.e. they are not guaranteed to be valid for that type). Can also be  the `fullyQualified` parameter if type arguments aren't applicable. |
| [fullyQualified] | <code>boolean</code> | <code>false</code> | If _truthy_, the generated typeset  will always be [fully-qualified](#rtvref.types.fully_qualified_typeset).  Otherwise, it'll be the simplest typeset possible. |


* * *

<a name="rtvref.impl.fullyQualify"></a>

#### impl.fullyQualify(typeset, [qualifier]) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 are not fully-qualified).

This function does not modify the input `typeset`.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset) - A new, fully-qualified typeset
 representing the input `typeset`. Only the first/immediate level of the
 input typeset is fully-qualified. The new array returned contains references
 to elements within the input typeset.  
**Throws**:

- <code>Error</code> If `typeset` or `qualifier` is not a valid.


| Param | Type | Description |
| --- | --- | --- |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Typeset to fully-qualify. |
| [qualifier] | [<code>qualifiers</code>](#rtvref.qualifiers) | Optional qualifier to be used.  If the typeset is a simple [type](#rtvref.types),   a [shape](#rtvref.shape_descriptor), or   a [custom validator](#rtvref.types.custom_validator) that was   cherry-picked out of a typeset whose qualifier should be used instead of   the [default](#rtvref.qualifiers.DEFAULT_QUALIFIER) one.  If `typeset` is an Array typeset, specifying this parameter will __override__   the typeset's qualifier (otherwise, its own qualifier will be used). |


* * *

<a name="rtvref.impl.extractNextType"></a>

#### impl.extractNextType(typeset, [qualifier]) ⇒ [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code>
Extracts (modifies) the next complete type from an Array typeset.

For example, if the given `typeset` is `[EXPECTED, STRING, {string_args}, FINITE]`,
 the returned array would be `[EXPECTED, STRING, {atring_args}]` and `typeset`
 would then be `[FINITE]`.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code> - The extracted __Array typeset__ as a
 new Array, which is a sub-type of the given `typeset`. This sub-typeset is
 not necessarily fully-qualified. If `typeset` was an empty array, an empty
 array is returned (which is the only case where an invalid Array typeset
 is tolerated, so that this function is easy to use in loops, checking for
 the stopping condition where the returned sub-typeset is empty).  
**Throws**:

- <code>Error</code> If `typeset` is not empty and not a valid Array typeset.
- <code>Error</code> If `qualifier` is specified but not valid.


| Param | Type | Description |
| --- | --- | --- |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code> | An Array typeset from which to  extract the next complete type. __This Array will be modified.__ Can also  be an empty array (which is not a valid typeset, but is tolerated; see the  return value for more information). |
| [qualifier] | [<code>qualifiers</code>](#rtvref.qualifiers) \| <code>boolean</code> | Optional, and can either  be a valid qualifier, `true`, or `false`.  <h4>Parameter is specified, and is a qualifier</h4>  If __a qualifier is not found in `typeset`__, this qualifier will be used to  qualify the returned sub-type Array typeset. If a qualifier is found in `typeset`,  this parameter is ignored. If a qualifier is __not__ found in `typeset` and  this parameter is specified, then this qualifier will be used to qualify the  returned sub-type Array typeset.  __Examples:__  - `typeset = [EXPECTED, STRING, FINITE];`  - `extractNextType(typeset, REQUIRED) === [EXPECTED, STRING]`, `typeset === [FINITE]`  - `extractNextType(typeset) === [FINITE]`, `typeset === []`  - `typeset = [FINITE];`  - `extractNextType(typeset, EXPECTED) === [EXPECTED, FINITE]`  <h4>Parameter is specified, and is a boolean</h4>  If `true`, the qualifier, if any, will be included in the returned sub-type  Array typeset.  If `false`, the qualifier, if any, will be ignored.  __Examples:__  - `extractNextType([STRING], true) === [STRING]`  - `extractNextType([REQUIRED, STRING], true) === [EXPECTED, STRING]`  - `extractNextType([REQUIRED, STRING], false) === [STRING]` |


* * *

<a name="rtvref.impl.checkType"></a>

#### impl.checkType(value, singleType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value using a single type.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - A success indicator if the
 `value` is compliant to the type; an error indicator if not.  
**Throws**:

- <code>Error</code> If `singleType` is not a valid simple type or single type.

**See**: [types](#rtvref.types)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| singleType | [<code>typeset</code>](#rtvref.types.typeset) | Either a simple type name (one of  [types](#rtvref.types.types)), a [shape descriptor](#rtvref.shape_descriptor),  or an Array typeset which represents a single type.  A [custom validator](#rtvref.types.custom_validator) is not considered  a valid single type.  In the string/simple case, the   [default qualifier](#rtvref.qualifiers.DEFAULT_QUALIFIER) is assumed.  In the shape descriptor case, the   [default object type](#rtvref.types.DEFAULT_OBJECT_TYPE) is assumed.  In the Array case, the qualifier is optional, and a type, along with args,   if any, is expected (e.g. `[type]`, `[qualifier, type]`, `[type, args]`, or   `[qualifier, type, args]`). Note that the type may be implied the shorthand   notation is being used for an ARRAY, or if the   [default object type](#rtvref.types.DEFAULT_OBJECT_TYPE) is being implied. |


* * *

<a name="rtvref.impl.checkShape"></a>

#### impl.checkShape(value, shape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value using a [shape descriptor](#rtvref.shape_descriptor) and
 ensure the value's type is the default object type.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - A success indicator if the
 `value` is compliant to the shape; an error indicator if not.  
**Throws**:

- <code>Error</code> If `shape` is not an [OBJECT](#rtvref.types.OBJECT).


| Param | Type | Description |
| --- | --- | --- |
| value | <code>Object</code> | Value to check. Must be of the  [default](#rtvref.types.DEFAULT_OBJECT_TYPE) object type. |
| shape | <code>Object</code> | Expected shape of the `value`. Must be an  [OBJECT](#rtvref.types.OBJECT). |


* * *

<a name="rtvref.impl.checkTypeset"></a>

#### impl.checkTypeset(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value using an Array typeset.

**Kind**: static method of [<code>impl</code>](#rtvref.impl)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - Success indicator if the `value`
 is compliant to the `typeset`; error indicator otherwise. An exception is
 __not__ thrown if the `value` is non-compliant.  
**Throws**:

- <code>Error</code> If `typeset` is not a valid Array typeset.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | The Array typeset to check against. |


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

Qualifiers determine the degree at which a value must be of a given type.

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.qualifiers](#rtvref.qualifiers) : <code>object</code>
    * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
    * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
    * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
    * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>
    * [.checkBasicRules(v, [q])](#rtvref.qualifiers.checkBasicRules) ⇒ <code>boolean</code>


* * *

<a name="rtvref.qualifiers.qualifiers"></a>

#### qualifiers.qualifiers : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of [qualifiers](#rtvref.qualifiers).

**Kind**: static property of [<code>qualifiers</code>](#rtvref.qualifiers)  

* * *

<a name="rtvref.qualifiers.REQUIRED"></a>

#### qualifiers.REQUIRED : <code>string</code>
Required qualifier: The value __must__ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier does not
 allow the value to be `null` or `undefined`.

Note the fact the value cannot be `undefined` implicitly requires a
 [shape](#rtvref.shape_descriptor)'s property to be defined _somewhere_
 its prototype chain (if it weren't, then its value would be `undefined`,
 violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 would require the `name` property to exist and not be `undefined`, but would
 allow it to be `null` or even an empty string.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**

- [types](#rtvref.types)
- [STRING](#rtvref.types.STRING)


* * *

<a name="rtvref.qualifiers.EXPECTED"></a>

#### qualifiers.EXPECTED : <code>string</code>
Expected qualifier: The value _should_ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier does _not_ allow
 the value to be `undefined`, but does _allow_ it to be `null`.

Note the fact the value cannot be `undefined` implicitly requires a
 [shape](#rtvref.shape_descriptor)'s property to be defined _somewhere_
 its prototype chain (if it weren't, then its value would be `undefined`,
 violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 would require the `name` property to exist and not be `undefined`, but would
 allow it to be `null` or even an empty string.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**

- [types](#rtvref.types)
- [STRING](#rtvref.types.STRING)


* * *

<a name="rtvref.qualifiers.OPTIONAL"></a>

#### qualifiers.OPTIONAL : <code>string</code>
Optional qualifier: The value _may_ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 the value to be `null` as well as `undefined`,

Note the fact the value can be `undefined` implies it does _not_ require a
 [shape](#rtvref.shape_descriptor)'s property to be defined anywhere in
 its prototype chain.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  

* * *

<a name="rtvref.qualifiers.DEFAULT_QUALIFIER"></a>

#### qualifiers.DEFAULT_QUALIFIER : <code>string</code>
Default qualifier: [REQUIRED](#rtvref.qualifiers.REQUIRED)

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  

* * *

<a name="rtvref.qualifiers.checkBasicRules"></a>

#### qualifiers.checkBasicRules(v, [q]) ⇒ <code>boolean</code>
Convenience function to check if a nil value (either `undefined` or `null`)
 is permitted under basic qualifier rules:

- REQUIRED: Cannot be `undefined` nor `null`.
- EXPECTED: Can be `null`.
- OPTIONAL: Can be either `undefined` or `null`.

**Kind**: static method of [<code>qualifiers</code>](#rtvref.qualifiers)  
**Returns**: <code>boolean</code> - `true` if the value is _nil_ (either `null` or `undefined`)
 and the basic qualifier's rules allow it to be so; `false` otherwise.

 For example, `nilPermitted(null, REQUIRED) === false` while
  `nilPermitted(null, EXPECTED) === true`. Also, `nilPermitted(1, *) === false`
  because the value `1` is not _nil_  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to check. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |


* * *

<a name="rtvref.types"></a>

### rtvref.types : <code>object</code>
<h2>Types</h2>

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.types](#rtvref.types) : <code>object</code>
    * [.objTypes](#rtvref.types.objTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.argTypes](#rtvref.types.argTypes) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.types](#rtvref.types.types) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.ANY](#rtvref.types.ANY) : <code>string</code>
    * [.NULL](#rtvref.types.NULL) : <code>string</code>
    * [.STRING](#rtvref.types.STRING) : <code>string</code>
    * [.BOOLEAN](#rtvref.types.BOOLEAN) : <code>string</code>
    * [.SYMBOL](#rtvref.types.SYMBOL) : <code>string</code>
    * [.NUMBER](#rtvref.types.NUMBER) : <code>string</code>
    * [.FINITE](#rtvref.types.FINITE) : <code>string</code>
    * [.INT](#rtvref.types.INT) : <code>string</code>
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
    * [.HASH_MAP](#rtvref.types.HASH_MAP) : <code>string</code>
    * [.MAP](#rtvref.types.MAP) : <code>string</code>
    * [.WEAK_MAP](#rtvref.types.WEAK_MAP) : <code>string</code>
    * [.SET](#rtvref.types.SET) : <code>string</code>
    * [.WEAK_SET](#rtvref.types.WEAK_SET) : <code>string</code>
    * [.JSON](#rtvref.types.JSON) : <code>string</code>
    * [.DEFAULT_OBJECT_TYPE](#rtvref.types.DEFAULT_OBJECT_TYPE) : <code>string</code>
    * [.primitives](#rtvref.types.primitives) : <code>\*</code>
    * [.rules](#rtvref.types.rules) : <code>\*</code>
    * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
    * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
    * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
    * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
    * [.custom_validator](#rtvref.types.custom_validator) ⇒ <code>boolean</code>
    * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
    * [.SYMBOL_args](#rtvref.types.SYMBOL_args) : <code>Object</code>
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

<a name="rtvref.types.ANY"></a>

#### types.ANY : <code>string</code>
The any type is special in that it allows _anything_, which includes `null`
 and `undefined` values. Because of this, it's the most liberal in terms of
 types as well as qualifiers. A more specific type should be used whenever
 possible to ensure a higher degree of confidence in the value being validated.

Any rules per qualifiers:

- REQUIRED: Can be any value, including `null` and `undefined`.
- EXPECTED: Same rules as REQUIRED.
- OPTIONAL: Same rules as EXPECTED.

Since this type removes the property's need for existence in the prototype
 chain, it renders the verification moot (i.e. the property of this type might
 as well not be included in a [shape descriptor](#rtvref.shape_descriptor)
 unless a [custom validator](#rtvref.types.custom_validator) is being
 used to do customized verification.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  

* * *

<a name="rtvref.types.NULL"></a>

#### types.NULL : <code>string</code>
Null rules per qualifiers: must be the `null` [primitive](#rtvref.types.primitives).

Use this special type to explicitly test for a `null` value. For example,
 a [shape](#rtvref.shape_descriptor)'s property may be required to be
 `null` under certain circumstances.

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

Arguments (optional): [SYMBOL_args](#rtvref.types.SYMBOL_args).

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

An number is not guaranteed to be a
 [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [rtvref.types.SAFE_INT](rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)


* * *

<a name="rtvref.types.FINITE"></a>

#### types.FINITE : <code>string</code>
Finite rules per qualifiers: Cannot be `NaN`, `+Infinity`, `-Infinity`. The
 value can be either an [integer](#rtvref.types.INT),
 or a [floating point number](#rtvref.types.FLOAT). It must also be a
 number [primitive](#rtvref.types.primitives).

A finite number is not guaranteed to be a
 [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [INT](#rtvref.types.INT)
- [rtvref.types.SAFE_INT](rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)


* * *

<a name="rtvref.types.INT"></a>

#### types.INT : <code>string</code>
Int rules per qualifiers: Must be a [finite](#rtvref.types.FINITE) number,
 an integer, and a number [primitive](#rtvref.types.primitives).

An integer is not guaranteed to be a
 [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger).

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [rtvref.types.SAFE_INT](rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)


* * *

<a name="rtvref.types.INT"></a>

#### types.INT : <code>string</code>
Int rules per qualifiers: Must be a [finite](#rtvref.types.FINITE) number, a
 [safe integer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger),
 and a number [primitive](#rtvref.types.primitives).

An integer is safe if it's an IEEE-754 double precision number which isn't
 the result of a rounded unsafe integer. For example, `2^53 - 1` is safe,
 but `2^53` is not because `2^53 + 1` would be rounded to `2^53`.

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [FLOAT](#rtvref.types.FLOAT)


* * *

<a name="rtvref.types.FLOAT"></a>

#### types.FLOAT : <code>string</code>
Float rules per qualifiers: Must be a [finite](#rtvref.types.FINITE)
 floating point number, and a number [primitive](#rtvref.types.primitives).
 Per IEEE 754, zero is considered a float.

Arguments (optional): [numeric_args](#rtvref.types.numeric_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [rtvref.types.SAFE_INT](rtvref.types.SAFE_INT)


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
Error rules per qualifiers: Must be an `Error` instance, which includes `TypeError`,
 `RangeError`, `ReferenceError`, etc.

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

Arguments (optional): [ARRAY_args](#rtvref.types.ARRAY_args),
 [Array typeset](#rtvref.types.typeset). Note that the `ARRAY` type must
 be specified when using arguments (i.e. the shorthand notation cannot
 be used).

When describing arrays, either _shorthand_ or _full_ notation may be used.
 In the shorthand notation, the `ARRAY` type isn't necessary, but it's only
 possible to specify the Array typeset to use to validate each array element,
 and [arguments](#rtvref.types.ARRAY_args) can't be specified. In the
 [fully-qualified](#rtvref.types.fully_qualified_typeset) notation, the
 `ARRAY` type is required, but the Array typeset must be moved into the
 `typeset` argument (along with any other argument necessary).

__NOTE__: It's important to realize that arrays (as in the JavaScript Array
 type) are essentially nested [Array typesets](#rtvref.types.typeset).
 They represent a set of types that will be used to validate each element
 of an array using a short-circuit OR conjunction, looking for the first type that matches.

<h4>Example: Simple array</h4>

The `value` property must be an array (possibly empty) of any type of value.

<pre><code>{
  value: [ARRAY]
}
</code></pre>

__NOTE__: Since arrays are, in reality, nested
 [Array typesets](#rtvref.types.typeset), and since an empty array is
 an invalid Array typeset, it's not possible to use the shorthand notation
 to indicate what could be the equivalent: `[[]]`. The inner Array typeset
 would be deemed _invalid_.

<h4>Example: Shorthand notation</h4>

The `value` property must be an array (possibly empty) of finite numbers of
 any value.

<pre><code>{
  value: [[FINITE]]
}
</code></pre>

<h4>Example: Shorthand, mixed types</h4>

The `value` property must be either a boolean; or an array (possibly empty) of
 finite numbers of any value, or non-empty strings, or a mix of both.

<pre><code>{
  value: [BOOLEAN, [FINITE, STRING]]
}
</code></pre>

<h4>Example: Fully-qualified notation, no typeset</h4>

The `value` property must be a non-empty array of any type of value.

<pre><code>{
  value: [REQUIRED, ARRAY, {min: 1}]
}
</code></pre>

<h4>Example: Fully-qualified notation</h4>

The `value` property must be an array (possibly empty) of finite numbers of
 any value (nested typeset is not fully-qualified).

<pre><code>{
  value: [REQUIRED, ARRAY, {typeset: [FINITE]}]
}

<h4>Example: Fully-qualified, mixed types</h4>

The `value` property must be either a boolean; or an array (possibly empty) of
 finite numbers of any value, or non-empty strings, or a mix of both
 (nested typeset is not fully-qualified).

<pre><code>{
  value: [REQUIRED, BOOLEAN, ARRAY, {typeset: [FINITE, STRING]}]
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

The following values __are considered__ any objects:

- `{}`
- `new Object()`
- `new (function() {}) | new (class {})()` (class instance) (also see
  [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT))
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `new Date()` (also see [DATE](#rtvref.types.DATE))
- `new Error()` (also see [ERROR](#rtvref.types.ERROR))
- `new Promise()` (also see [PROMISE](#rtvref.types.PROMISE))
- `function(){}` (also see [FUNCTION](#rtvref.types.FUNCTION))
- `arguments` (function arguments)
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


* * *

<a name="rtvref.types.OBJECT"></a>

#### types.OBJECT : <code>string</code>
An object is one that extends from `JavaScript.Object` (i.e. an _instance_
 of _something_ that extends from Object) and is not a
 [function](#rtvref.types.FUNCTION), [array](#rtvref.types.ARRAY),
 [regular expression](#rtvref.types.REGEXP), [DATE](#rtvref.types.DATE),
 function arguments object,
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
- `new (function() {}) | new (class {})()` (class instance) (also see
  [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT))

The following values __are not__ considered objects:

- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `new Date()` (also see [DATE](#rtvref.types.DATE))
- `new Error()` (also see [ERROR](#rtvref.types.ERROR))
- `new Promise()` (also see [PROMISE](#rtvref.types.PROMISE))
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


* * *

<a name="rtvref.types.PLAIN_OBJECT"></a>

#### types.PLAIN_OBJECT : <code>string</code>
A _plain_ object is one that is created directly from the `Object` constructor,
 whether using `new Object()` or the literal `{}`.

The following values are considered plain objects:

- `{}`
- `new Object()`

The following values __are not__ considered plain objects:

- `new (function() {}) | new (class {})()` (class instance) (also see
  [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT))
- `new String('')`
- `new Boolean(true)`
- `new Number(1)`
- `[]` (also see [ARRAY](#rtvref.types.ARRAY))
- `new Array()` (also see [ARRAY](#rtvref.types.ARRAY))
- `/re/` (also see [REGEXP](#rtvref.types.REGEXP))
- `new RegExp('re')` (also see [REGEXP](#rtvref.types.REGEXP))
- `new Date()` (also see [DATE](#rtvref.types.DATE))
- `new Error()` (also see [ERROR](#rtvref.types.ERROR))
- `new Promise()` (also see [PROMISE](#rtvref.types.PROMISE))
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


* * *

<a name="rtvref.types.CLASS_OBJECT"></a>

#### types.CLASS_OBJECT : <code>string</code>
A _class_ object is one that is created by invoking the `new` operator on a
 function (other than a primitive type function), generating a new object,
 commonly referred to as a _class instance_. This object's prototype
 (`__proto__`) is a reference to that function's `prototype` and has a
 `constructor` property that is `===` to the function.

The following values are considered class objects:

- `new (function() {}) | new (class {})()` (tip: use the `ctor`
  [argument](#rtvref.types.CLASS_OBJECT_args) to test for a specific class)

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
- `new Date()` (also see [DATE](#rtvref.types.DATE))
- `new Error()` (also see [ERROR](#rtvref.types.ERROR))
- `new Promise()` (also see [PROMISE](#rtvref.types.PROMISE))
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


* * *

<a name="rtvref.types.HASH_MAP"></a>

#### types.HASH_MAP : <code>string</code>
A simple [OBJECT](#rtvref.types.OBJECT) that is treated as a hash map
 with an expected set of keys (forcibly strings due to the nature of the
 native JavaScript `Object` type) and values. Keys are __own-properties only__,
 and can be described using a regular expression. Values can be described using a
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
 [HASH_MAP](#rtvref.types.HASH_MAP) that only supports strings. Keys can
 be described using a regular expression (if they are strings), and values can
 be described using a [typeset](#rtvref.types.typeset). Empty maps are permitted
 by default.

Map rules per qualifiers: Must be a `Map` instance.

Arguments (optional): [collection_args](#rtvref.types.collection_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [HASH_MAP](#rtvref.types.HASH_MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)


* * *

<a name="rtvref.types.WEAK_MAP"></a>

#### types.WEAK_MAP : <code>string</code>
An ES6 weak map supports any _object_ as its keys, unlike a
 [HASH_MAP](#rtvref.types.HASH_MAP) that only supports strings,
 and a [MAP](#rtvref.types.MAP) that supports any type of value.

Weak map rules per qualifiers: Must be a `WeakMap` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [HASH_MAP](#rtvref.types.HASH_MAP)
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

- [null](#rtvref.types.NULL)
- [string](#rtvref.types.STRING), however __empty strings are permitted__,
  even if the qualifier is `REQUIRED`
- [boolean](#rtvref.types.BOOLEAN)
- [finite number](#rtvref.types.FINITE)
- [plain object](#rtvref.types.PLAIN_OBJECT)
- [array](#rtvref.types.ARRAY)

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

<a name="rtvref.types.primitives"></a>

#### types.primitives : <code>\*</code>
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

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [rtvref.validation.isPrimitive](rtvref.validation.isPrimitive)  

* * *

<a name="rtvref.types.rules"></a>

#### types.rules : <code>\*</code>
<h3>Rules Per Qualifiers</h3>

[Qualifiers](#rtvref.qualifiers) state basic rules. Unless otherwise stated,
 every type herein abides by those basic rules. Each type will also impose
 additional rules specific to the type of value it represents.

For example, while the [FINITE](#rtvref.types.FINITE) type states that the
 value must not be `NaN`, `+Infinity`, nor `-Infinity`; it could be `null` if
 the qualifier used is `EXPECTED`; and it could be `undefined` if the qualifier
 used is `OPTIONAL`.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  

* * *

<a name="rtvref.types.type_arguments"></a>

#### types.type_arguments : <code>Object</code>
<h3>Type Arguments</a></h3>

Some types will accept, or may even expect, one or more arguments. Each type
 will specify whether it has arguments, and if they're optional or required.
 Arguments are specified as a single [object](#rtvref.types.OBJECT)
 immediately following a type in an __Array__ [typeset](#rtvref.types.typeset)
 (i.e. an Array must be used as the typeset in order to provide arguments for
 a type).

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
**See**: [rtvref.validation.isTypeArgs](rtvref.validation.isTypeArgs)  

* * *

<a name="rtvref.types.collection_args"></a>

#### types.collection_args : <code>Object</code>
<h3>Collection Arguments</h3>

Describes the keys and values in a collection-based object, which is one of
 the following types:

- [HASH_MAP](#rtvref.types.HASH_MAP) (NOTE: only __own-enumerable
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

- [HASH_MAP](#rtvref.types.HASH_MAP)
- [MAP](#rtvref.types.MAP)
- [SET](#rtvref.types.SET)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [length] | <code>number</code> | The exact number of elements required in  the collection. A negative value allows for any number of entries. Zero  requires an empty collection. Ignored if not a  [FINITE](#rtvref.types.FINITE) number.  Applies to: All collection types. |
| [keys] | [<code>typeset</code>](#rtvref.types.typeset) | A typeset describing each key  in the collection.  If the type is [HASH_MAP](#rtvref.types.HASH_MAP), this argument is ignored   due to the nature of its JavaScript `Object`-based implementation which   requires that all keys be non-empty [strings](#rtvref.types.STRING).  Applies to: [MAP](#rtvref.types.MAP). |
| [keyExp] | <code>string</code> | A string-based regular expression describing the  names of keys found in the collection. By default, there are no restrictions  on key names. Ignored if the key type is not [STRING](#rtvref.types.STRING),  as specified in `keys` (when `keys` is applicable to the collection type).  For example, to require numerical keys, the following expression could be   used: `"^\\d+$"`.  Applies to: [HASH_MAP](#rtvref.types.HASH_MAP), [MAP](#rtvref.types.MAP). |
| [keyFlagSpec] | <code>string</code> | A string specifying any flags to use with  the regular expression specified in `keyExp`. Ignored if _falsy_ or if  `keyExp` is not specified. See the  [RegExp#flags](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)  parameter for more information.  Applies to: [HASH_MAP](#rtvref.types.HASH_MAP), [MAP](#rtvref.types.MAP). |
| [values] | [<code>typeset</code>](#rtvref.types.typeset) | A typeset describing each value in  the collection. If specified, all values must match this typeset (but the  collection is not required to have any elements to be considered valid, unless  `length` is specified). If not specified, no validation is performed on values.  For example, to require arrays of non-empty string values as values in the   collection, the following typeset could be used: `[[types.STRING]]`.  Applies to: All collection types. |


* * *

<a name="rtvref.types.typeset"></a>

#### types.typeset : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
<h3>Typeset</h3>

Describes the possible types for a given value. It can be any one of the following
 JavaScript types:

- [Object](#rtvref.types.OBJECT): For the root or a nested
  [shape descriptor](#rtvref.shape_descriptor) of _implied_
  [OBJECT](#rtvref.types.OBJECT) type (unless paired with a specific object type
  like [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT), for example, when using the
  Array notation, e.g. `[PLAIN_OBJECT, {...}]`). If the object is empty (has no properties),
  nothing will be verified (anything will pass).
- [String](#rtvref.types.STRING): For a single type, such as
  [FINITE](#rtvref.types.FINITE) for a finite number. Must be one of the types
  defined in [types](#rtvref.types).
- [Function](#rtvref.types.FUNCTION): For a
  [custom validator](#rtvref.types.custom_validator) that will verify the value of the
  property using custom code. Since the Array form is not being used (only the validator is
  being provided), it's always invoked immediately. Since a type is not provided, the
  [ANY](#rtvref.types.ANY) type is implied.
- [Array](#rtvref.types.ARRAY): For multiple type possibilities, optionally
  [qualified](#rtvref.qualifiers), using a short-circuit __OR__ conjunction, which means
  the value of the property being described must match _at least one_ of the types listed, but
  not all. Matching is done in a short-circuit fashion, from the first to the last element in
  the typeset. If a simpler type is a more likely match, it's more performant to specify it
  first/earlier in the typeset to avoid a match attempt on a nested shape or Array.
  - Cannot be an empty Array.
  - A given type may not be included more than once in the typeset, but may appear
    again in a nested typeset (when a parent typeset describes an
    [Array](rtfref.types.ARRAY) or type of [Object](rtfref.types.OBJECT)).
  - An Array is necessary to [qualify](#rtvref.qualifiers) the typeset as not
    required (see _Typeset Qualifiers_ below).
  - An Array is necessary if a type needs or requires
    [arguments](#rtvref.types.type_arguments).
  - If the __first__ (or second, if a [qualifier](rtvref.types.qualifiers)
    is provided, and this, in a typeset that is _not_
    [fully-qualified](#rtvref.types.fully_qualified_typeset)), element is an `Object`,
    it's treated as a nested [shape descriptor](#rtvref.shape_descriptor)
    describing an object of the default [OBJECT](#rtvref.types.OBJECT) type.
    To include a shape descriptor at any other position within the array, it
    __must__ be preceded by a type, even if the default `OBJECT` type is being
    used (i.e. `OBJECT` must be specified as the type). For example, all
    these typesets are equivalent (and equivalent to just `{name: STRING}`
    as the typeset): `[{name: STRING}]`, `[REQUIRED, {name: STRING}]`, and
    `[REQUIRED, OBJECT, {name: STRING}]`, describing an object that has a name
    property which is a non-empty string. Changing it to `[STRING, {name: STRING}]`,
    however, does __not__ mean, "a non-empty string, or an object with a name
    property which is a non-empty string". In this case, `{name: STRING}` would
    be treated as [STRING arguments](#rtvref.types.STRING_args), which is
    likely not the desired intent. The object would have to be preceded by an
    object type (e.g. [OBJECT](#rtvref.types.OBJECT),
    [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT), etc.) to have it interpreted
    as in the OR case.
  - If an element is an `Array` (any position), it's treated as a __nested list__
    with an implied [ARRAY](#rtvref.types.ARRAY) type, e.g.
    `[BOOLEAN, [STRING, FINITE]]` would describe a property that should be a boolean,
    or an array of non-empty strings or finite numbers. See the `ARRAY` type
    reference for more information on _shorthand_ and _full_ notations.
  - If an element is a `Function`, it must be the __last__ element in the Array
    and will be treated as a [custom validator](#rtvref.types.custom_validator).
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

<h4>JSON Serialization</h4>

__ALL__ typesets should be fully JSON-serializable (via `JSON.stringify()` and
 `JSON.parse()`) with the following unavoidable exceptions:

- [Custom validators](#rtvref.types.custom_validator)
- [CLASS_OBJECT arguments](#rtvref.types.CLASS_OBJECT_args) 'ctor' property

Those exceptions are due to the fact that these represent functions, and functions
 are not serializable to JSON. They will be ignored in the stringification process,
 unless a custom _replacer_ is provided which, _somehow_ (up to you), handles them.

This could, among other possibilities, enable the transmission of typesets
 over network requests, perhaps embedded in JSON payloads, similar to
 [JSON-LD](https://json-ld.org/) schemas.

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
 parameter given to a [custom validator](#rtvref.types.custom_validator).
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

<a name="rtvref.types.custom_validator"></a>

#### types.custom_validator ⇒ <code>boolean</code>
<h3>Custom Validator</h3>

A function used as a [typeset](#rtvref.types.typeset), or as a subset to
 a typeset, to provide custom verification of the value being verified.

A typeset may only have one validator, and the validator is _only called if
 the value being verified was verified by at least one type in the typeset_.
 The validator must be the __last__ element within the typeset (if the typeset
 is an array, and a validator is needed). The validator must also be
 specified _after_ the [qualifier](#rtvref.qualifiers) in a typeset Array.

The validator is invoked immediately after the first type match, but _only if
 a type match is made_. If the typeset is not
 [fully-qualified](#rtvref.types.fully_qualified_typeset) and does not
 explicitly specify a type, the [ANY](#rtvref.types.ANY) type is implied,
 which will match _any_ value, which means the validator will always be called.

There is one disadvantage to using a custom validator: It cannot be de/serialized
 via JSON, which means it cannot be transmitted or persisted. One option would be
 to customize the de/serialization to JSON by serializing the validator to a
 special object with properties that would inform the deserialization process
 on how to reconstruct the validator dynamically.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**Returns**: <code>boolean</code> - A _truthy_ value to verify, a _falsy_ value to reject.  
**See**: [rtvref.validation.isValidator](rtvref.validation.isValidator)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value being verified. |
| match | <code>Array</code> | A __first-level__,  [fully-qualified](#rtvref.types.fully_qualified_typeset) typeset describing  the type that matched. This means the first level of this subset of `typeset`  (the 3rd parameter) is fully-qualified, but any nested  [shape descriptors](#rtvref.shape_descriptor) or arrays will not be (they  will remain references to the same shapes/arrays in `typeset`). For example, if the given typeset was `[PLAIN_OBJECT, {note: STRING}]`, this  parameter would be a new typeset array `[REQUIRED, PLAIN_OBJECT, {note: STRING}]`,  and the `typeset` parameter would be the original `[PLAIN_OBJECT, {note: STRING}]`. If the given typeset was `[STRING, FINITE]` and FINITE matched, this parameter  would be `[REQUIRED, FINITE]` and the `typeset` parameter would be the  original `[STRING, FINITE]`. |
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
| [oneOf] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | An exact string to match (`===`).  Can also be a list of strings, one of which must be an exact match. An empty  string is allowed. Note, however, that the [qualifier](#rtvref.qualifiers)  must not be `REQUIRED` because that will disallow an empty string as the value  being checked regardless of this value/list. |
| [partial] | <code>string</code> | A partial value to match (must be somewhere  within the string). Ignored if empty string, or `exact` is specified. `min`  and `max` take __precedence__ over this argument (the length will be  validated first, then a partial match will be attempted). |
| [min] | <code>number</code> | Minimum inclusive length. Defaults to 1 for a  `REQUIRED` string, and 0 for an `EXPECTED` or `OPTIONAL` string. Ignored if  `exact` is specified, or `min` is not a [FINITE](#rtvref.types.FINITE)  number >= 0. |
| [max] | <code>number</code> | Maximum inclusive length. Negative means no maximum.  Ignored if `exact` is specified, `max` is not a  [FINITE](#rtvref.types.FINITE) number, or `max` is less than `min`. |


* * *

<a name="rtvref.types.SYMBOL_args"></a>

#### types.SYMBOL_args : <code>Object</code>
[SYMBOL](#rtvref.types.SYMBOL) arguments.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [oneOf] | <code>symbol</code> \| <code>Array.&lt;symbol&gt;</code> | An exact symbol to match (`===`).  Can also be a list of symbols, one of which must be an exact match. Values to  match are ignored if they are not symbols. |


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
| [oneOf] | <code>number</code> \| <code>Array.&lt;number&gt;</code> | An exact number to match (`===`).  Can also be a list of numbers, one of which must be an exact match. An empty  list will be ignored.  Values to match are ignored if they are not within normal range of the type   (e.g. for `NUMBER`, could be `+Infinity`, or even `NaN` if the qualifier is   not `REQUIRED`; but these values would be ignored by `FINITE` since they   aren't part of the `FINITE` range), or not numbers at all. |
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
| [typeset] | [<code>typeset</code>](#rtvref.types.typeset) | The typeset which every value in  the array must match. Defaults to [ANY](#rtvref.types.ANY) which means any  value will match. |
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
| [ctor] | <code>function</code> | A reference to a constructor function. If specified,  the class object (instance) must have this class function in its inheritance  chain such that `<class_object> instanceof ctor === true`. Note that this  property is not serializable to JSON. Ignored if not a  [function](#rtvref.types.FUNCTION). |
| [shape] | [<code>shape_descriptor</code>](#rtvref.shape_descriptor) | A description of the class object's  shape. Ignored if not a valid shape descriptor. |


* * *

<a name="rtvref.validation"></a>

### rtvref.validation : <code>object</code>
<h2>RTV Validation</h2>

This namespace provides _type validations_ which verify values to be of
 the [types](#rtvref.types) defined in this library. If permitted values
 differ between [qualifiers](#rtvref.qualifiers), the validation must
 only permit the `REQUIRED` values. Validations strictly check for types;
 they do not consider [type arguments](#rtvref.types.type_arguments) or
 qualifiers like [type validators](#rtvref.validator) do.

Validations may also check for pseudo-types, such as the
 [isTypeset](rtvref.validation.isTypeset) validation verifying a value as
 a [typeset](#rtvref.types.typeset), which is not an actual type.

__Every validation module must provide the following interface:__

- `{function} default` (the default export): The
  [validation method](#rtvref.validation.method) itself.
- `{(string|undefined)} type`: The [type](#rtvref.types) verified;
  `undefined` for a pseudo-type (e.g. [primitive](#rtvref.types.primitives)
  or [typeset](#rtvref.types.typeset)).

Validations are meant to be leaf modules. They should not import other modules
 other than types and other validations. Validation modules should be named
 as `is<Type>` such that their default export is named `is<Type>`.

NOTE: Where possible, validations should use the other validations rather than
 third-party code (e.g. isTypeset.js needs to check for objects, so it should
 use the isObject.js validation rather than 'lodash/isObject', and let
 isObject.js decide the best way to check a value as being an 'object' as
 defined by this library in rtvref.types.OBJECT). This way, it makes it much
 easier to change the definition of a type later on.

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* * *

<a name="rtvref.validation.method"></a>

#### validation.method(value) ⇒ <code>boolean</code>
<h3>Type Validation Method</h3>

Verifies a value is of a certain [type](#rtvref.types).

**Kind**: static method of [<code>validation</code>](#rtvref.validation)  
**Returns**: <code>boolean</code> - `true` if the value matches the type; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to validate. |


* * *

<a name="rtvref.validator"></a>

### rtvref.validator : <code>object</code>
<h2>RTV Type Validators</h2>

This namespace provides validators for each supported [type](#rtvref.types),
 capable of fully validating a value against that type. Validators differ from
 type _validations_ provided by the [validation](#rtvref.validation)
 module in that validators verify a value against a single, specific type,
 considering [qualifiers](#rtvref.qualifiers) as well as
 [type arguments](#rtvref.types.type_arguments).

__Every validator module must provide the following interface:__

- `{function} default` (the default export): The
  [type validator](#rtvref.validator.type_validator) itself.
- `{string} type`: The [type](#rtvref.types) verified.
- `{function} config`: The
  [configuration function](#rtvref.validator.validator_config).

Validator modules should be named as `val<Type>` such that their default
 export is named `val<Type>`.

There can only be one validator for any given type. Where possible, each
 validator should use applicable [type validations](#rtvref.validation)
 rather than third-party code (e.g. lodash) to ensure that the semantics of
 each type is properly interpreted. If the validator introduces an entirely
 new type, then it should use whatever means necessary to properly identify
 the type which it validates.

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.validator](#rtvref.validator) : <code>object</code>
    * [.type_validator(value, [qualifier], [args])](#rtvref.validator.type_validator) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.validator_config(settings)](#rtvref.validator.validator_config)
    * [.validator_config_settings](#rtvref.validator.validator_config_settings) : <code>Object</code>


* * *

<a name="rtvref.validator.type_validator"></a>

#### validator.type_validator(value, [qualifier], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
<h3>Type Validator Function</h3>

NOTE: A validator must always give __precedence__ to
 [qualifier rules](#rtvref.types.rules) for the type it's validating, over
 any arguments specified. For example,

__NOTE:__ A validator must support all its qualifier rules, including proper
 handling of `null` values when [EXPECTED](#rtvref.qualifiers.EXPECTED)
 and `undefined` values when [OPTIONAL](#rtvref.qualifiers.OPTIONAL),
 __in addition to__ and type-specific qualifier rules. For example, the
 [STRING](#rtvref.types.STRING) type permits empty strings when not
 [REQUIRED](#rtvref.qualifiers.REQUIRED).

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid;
 `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to validate. |
| [qualifier] | <code>string</code> | The validation qualifier from the immediate  [typeset](#rtvref.types.typeset) in which the pertaining type was specified.  Validators should always explicitly default to  [REQUIRED](#rtvref.qualifiers.REQUIRED) to maintain consistent behavior. |
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
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |


* * *

<a name="rtvref.validator.validator_config_settings"></a>

#### validator.validator_config_settings : <code>Object</code>
<h3>Type Validator Configuration Settings</h3>

The settings provided to the
 [configuration function](#rtvref.validator.validator_config).

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| impl | [<code>impl</code>](#rtvref.impl) | Reference to the `impl` module. |


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

The shape descriptor itself must be an [OBJECT](#rtvref.types.OBJECT).

**Kind**: static typedef of [<code>rtvref</code>](#rtvref)  
**See**: [rtvref.validation.isShape](rtvref.validation.isShape)  

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
    * [.isTypeset()](#rtv.isTypeset)
    * [.check(value, typeset)](#rtv.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.c(value, typeset)](#rtv.c) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.verify(value, typeset)](#rtv.verify) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
    * [.v(value, typeset)](#rtv.v) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)


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

<a name="rtv.isTypeset"></a>

### rtv.isTypeset()
Determines if a value is a typeset.

**Kind**: static method of [<code>rtv</code>](#rtv)  
**See**: [default](#rtvref.validation.isTypeset.default)  

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

