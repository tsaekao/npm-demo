# Objects

<dl>
<dt><a href="#rtv">rtv</a> : <code>object</code></dt>
<dd><h3>RTV.js Public Interface</h3>

<p>Provides the externally-facing API. It wraps the
 <a href="#rtvref.impl">implementation</a>, adding a bit of syntactic sugar, and
 adds the <a href="#rtv.config">configuration</a> facilities.</p>
</dd>
<dt><a href="#rtvref">rtvref</a> : <code>object</code></dt>
<dd><h3>RTV.js Reference</h3>

<p>Members herein are <em>indirectly</em> accessed and/or exposed through the
 <a href="#rtv">RTV.js Public Interface</a>.</p>
</dd>
</dl>

<a name="rtv"></a>

# rtv : <code>object</code>
<h3>RTV.js Public Interface</h3>

Provides the externally-facing API. It wraps the
 [implementation](#rtvref.impl), adding a bit of syntactic sugar, and
 adds the [configuration](#rtv.config) facilities.

**Kind**: global namespace  

* [rtv](#rtv) : <code>object</code>
    * [.t](#rtv.t) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.q](#rtv.q) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.e](#rtv.e) : <code>boolean</code>
    * [.version](#rtv.version) : <code>string</code>
    * [.config](#rtv.config) : <code>object</code>
        * [.enabled](#rtv.config.enabled) : <code>boolean</code>
    * [.isTypeset()](#rtv.isTypeset)
    * [.check(value, typeset)](#rtv.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.verify(value, typeset)](#rtv.verify) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)

<a name="rtv.t"></a>

## rtv.t : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration of [types](#rtvref.types.types).

**Kind**: static property of [<code>rtv</code>](#rtv)  
**Read only**: true  
<a name="rtv.q"></a>

## rtv.q : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration of [qualifiers](#rtvref.qualifiers.qualifiers).

**Kind**: static property of [<code>rtv</code>](#rtv)  
**Read only**: true  
<a name="rtv.e"></a>

## rtv.e : <code>boolean</code>
Shortcut proxy for reading [enabled](#rtv.config.enabled).

**Kind**: static property of [<code>rtv</code>](#rtv)  
**Read only**: true  
<a name="rtv.version"></a>

## rtv.version : <code>string</code>
Library version.

**Kind**: static property of [<code>rtv</code>](#rtv)  
**Read only**: true  
<a name="rtv.config"></a>

## rtv.config : <code>object</code>
<h3>RTV.js Configuration</h3>

**Kind**: static namespace of [<code>rtv</code>](#rtv)  
<a name="rtv.config.enabled"></a>

### config.enabled : <code>boolean</code>
Globally enables or disables [verify](#rtv.verify) and [check](#rtv.check).

Use this, or the shortcut [e](#rtv.e), to enable code optimization
 when building source with a bundler that supports _tree shaking_, like
 [Rollup](https://rollupjs.org/) or [Webpack](https://webpack.js.org/).

The following plugins can redefine the statement `rtv.e` or `rtv.config.enabled`
 as `false` prior to code optimizations that remove unreachable code:

- Rollup: [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace)
- Webpack: [DefinePlugin](https://webpack.js.org/plugins/define-plugin/)

<h4>Enabled Example: Rollup</h4>

By conditionally calling [verify](#rtv.verify) based on the state of
 [enabled](#rtv.config.enabled), a bundler can be configured to completely
 remove the code from a production build.

Given this module code snippet:

<pre><code>...

if (rtv.config.enabled) {
 rtv.verify(jsonResult, expectedShape);
}

rtv.e && rtv.verify(jsonResult, expectedShape); // shorter

...
</code></pre>

And using this `rollup.config.js` snippet:

<pre><code>const replacePlugin = require('rollup-plugin-replace');

module.exports = {
  ...
  plugins: [
    // invoke this plugin _before_ any other plugins
    replacePlugin({
      'rtv.e': 'false',
      'rtv.config.enabled': 'false'
    }),
    ...
  ]
};
</code></pre>

The code in the module snippet above would be completely removed from the
 build's output, thereby removing any rtv.js overhead from production.

**Kind**: static property of [<code>config</code>](#rtv.config)  
**See**: [rtv.enabled](rtv.enabled)  
<a name="rtv.isTypeset"></a>

## rtv.isTypeset()
Determines if a value is a typeset.

**Kind**: static method of [<code>rtv</code>](#rtv)  
**See**: [isTypeset](#rtvref.validation.isTypeset)  
<a name="rtv.check"></a>

## rtv.check(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
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
- [shape_descriptor](#rtvref.types.shape_descriptor)


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.types.shape_descriptor). |

<a name="rtv.verify"></a>

## rtv.verify(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess)
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
- [shape_descriptor](#rtvref.types.shape_descriptor)


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Expected shape of (or typeset describing)  the `value`. A shape is a kind of typeset. Normally, this is a  [shape descriptor](#rtvref.types.shape_descriptor). |

<a name="rtvref"></a>

# rtvref : <code>object</code>
<h3>RTV.js Reference</h3>

Members herein are _indirectly_ accessed and/or exposed through the
 [RTV.js Public Interface](#rtv).

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
        * [new RtvError(value, typeset, path, cause, [failure])](#new_rtvref.RtvError_new)
        * [.valid](#rtvref.RtvError+valid) : <code>boolean</code>
        * [.value](#rtvref.RtvError+value) : <code>\*</code>
        * [.typeset](#rtvref.RtvError+typeset) : [<code>typeset</code>](#rtvref.types.typeset)
        * [.path](#rtvref.RtvError+path) : <code>Array.&lt;string&gt;</code>
        * [.cause](#rtvref.RtvError+cause) : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
        * [.failure](#rtvref.RtvError+failure) : <code>Error</code> \| <code>undefined</code>
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
        * [.checkWithType(value, singleType)](#rtvref.impl.checkWithType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.checkWithShape(value, shape)](#rtvref.impl.checkWithShape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.checkWithArray(value, array)](#rtvref.impl.checkWithArray) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.qualifiers](#rtvref.qualifiers) : <code>object</code>
        * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
        * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
        * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
        * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
        * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>
        * [.nilPermitted(v, [q])](#rtvref.qualifiers.nilPermitted) ⇒ <code>boolean</code>
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
        * [.SAFE_INT](#rtvref.types.SAFE_INT) : <code>string</code>
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
        * [.primitives](#rtvref.types.primitives) : <code>void</code>
        * [.qualifier_rules](#rtvref.types.qualifier_rules) : <code>void</code>
        * [.shape_descriptor](#rtvref.types.shape_descriptor) : <code>Object</code>
        * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
        * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
        * [.SYMBOL_args](#rtvref.types.SYMBOL_args) : <code>Object</code>
        * [.numeric_args](#rtvref.types.numeric_args) : <code>Object</code>
        * [.shape_object_args](#rtvref.types.shape_object_args) : <code>Object</code>
        * [.ARRAY_args](#rtvref.types.ARRAY_args) : <code>Object</code>
        * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
        * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
        * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
        * [.custom_validator](#rtvref.types.custom_validator) : <code>function</code>
    * [.util](#rtvref.util) : <code>object</code>
        * [.print(printValue)](#rtvref.util.print) ⇒ <code>string</code>
    * [.validation](#rtvref.validation) : <code>object</code>
        * [.method(value)](#rtvref.validation.method) ⇒ <code>boolean</code>
        * [.isAny](#rtvref.validation.isAny) : <code>Module</code>
            * [.type](#rtvref.validation.isAny.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isAny.default) ⇒ <code>boolean</code>
        * [.isAnyObject](#rtvref.validation.isAnyObject) : <code>Module</code>
            * [.type](#rtvref.validation.isAnyObject.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isAnyObject.default) ⇒ <code>boolean</code>
        * [.isArray](#rtvref.validation.isArray) : <code>Module</code>
            * [.type](#rtvref.validation.isArray.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isArray.default) ⇒ <code>boolean</code>
        * [.isBoolean](#rtvref.validation.isBoolean) : <code>Module</code>
            * [.type](#rtvref.validation.isBoolean.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isBoolean.default) ⇒ <code>boolean</code>
        * [.isClassObject](#rtvref.validation.isClassObject) : <code>Module</code>
            * [.type](#rtvref.validation.isClassObject.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isClassObject.default) ⇒ <code>boolean</code>
        * [.isCustomValidator](#rtvref.validation.isCustomValidator) : <code>Module</code>
            * [.type](#rtvref.validation.isCustomValidator.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isCustomValidator.default) ⇒ <code>boolean</code>
        * [.isDate](#rtvref.validation.isDate) : <code>Module</code>
            * [.type](#rtvref.validation.isDate.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isDate.default) ⇒ <code>boolean</code>
        * [.isError](#rtvref.validation.isError) : <code>Module</code>
            * [.type](#rtvref.validation.isError.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isError.default) ⇒ <code>boolean</code>
        * [.isFinite](#rtvref.validation.isFinite) : <code>Module</code>
            * [.type](#rtvref.validation.isFinite.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isFinite.default) ⇒ <code>boolean</code>
        * [.isFloat](#rtvref.validation.isFloat) : <code>Module</code>
            * [.type](#rtvref.validation.isFloat.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isFloat.default) ⇒ <code>boolean</code>
        * [.isFunction](#rtvref.validation.isFunction) : <code>Module</code>
            * [.type](#rtvref.validation.isFunction.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isFunction.default) ⇒ <code>boolean</code>
        * [.isHashMap](#rtvref.validation.isHashMap) : <code>Module</code>
            * [.type](#rtvref.validation.isHashMap.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isHashMap.default) ⇒ <code>boolean</code>
        * [.isInt](#rtvref.validation.isInt) : <code>Module</code>
            * [.type](#rtvref.validation.isInt.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isInt.default) ⇒ <code>boolean</code>
        * [.isJson](#rtvref.validation.isJson) : <code>Module</code>
            * [.type](#rtvref.validation.isJson.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isJson.default) ⇒ <code>boolean</code>
        * [.isMap](#rtvref.validation.isMap) : <code>Module</code>
            * [.type](#rtvref.validation.isMap.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isMap.default) ⇒ <code>boolean</code>
        * [.isNull](#rtvref.validation.isNull) : <code>Module</code>
            * [.type](#rtvref.validation.isNull.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isNull.default) ⇒ <code>boolean</code>
        * [.isNumber](#rtvref.validation.isNumber) : <code>Module</code>
            * [.type](#rtvref.validation.isNumber.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isNumber.default) ⇒ <code>boolean</code>
        * [.isObject](#rtvref.validation.isObject) : <code>Module</code>
            * [.type](#rtvref.validation.isObject.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isObject.default) ⇒ <code>boolean</code>
        * [.isPlainObject](#rtvref.validation.isPlainObject) : <code>Module</code>
            * [.type](#rtvref.validation.isPlainObject.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isPlainObject.default) ⇒ <code>boolean</code>
        * [.isPrimitive](#rtvref.validation.isPrimitive) : <code>Module</code>
            * [.type](#rtvref.validation.isPrimitive.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isPrimitive.default) ⇒ <code>boolean</code>
        * [.isPromise](#rtvref.validation.isPromise) : <code>Module</code>
            * [.type](#rtvref.validation.isPromise.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isPromise.default) ⇒ <code>boolean</code>
        * [.isRegExp](#rtvref.validation.isRegExp) : <code>Module</code>
            * [.type](#rtvref.validation.isRegExp.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isRegExp.default) ⇒ <code>boolean</code>
        * [.isSafeInt](#rtvref.validation.isSafeInt) : <code>Module</code>
            * [.type](#rtvref.validation.isSafeInt.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isSafeInt.default) ⇒ <code>boolean</code>
        * [.isSet](#rtvref.validation.isSet) : <code>Module</code>
            * [.type](#rtvref.validation.isSet.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isSet.default) ⇒ <code>boolean</code>
        * [.isShape](#rtvref.validation.isShape) : <code>Module</code>
            * [.type](#rtvref.validation.isShape.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isShape.default) ⇒ <code>boolean</code>
        * [.isString](#rtvref.validation.isString) : <code>Module</code>
            * [.type](#rtvref.validation.isString.type) : <code>string</code>
            * [.default(v, [options])](#rtvref.validation.isString.default) ⇒ <code>boolean</code>
        * [.isSymbol](#rtvref.validation.isSymbol) : <code>Module</code>
            * [.type](#rtvref.validation.isSymbol.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isSymbol.default) ⇒ <code>boolean</code>
        * [.isTypeArgs](#rtvref.validation.isTypeArgs) : <code>Module</code>
            * [.type](#rtvref.validation.isTypeArgs.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isTypeArgs.default) ⇒ <code>boolean</code>
        * [.isTypeset](#rtvref.validation.isTypeset) : <code>Module</code>
            * [.type](#rtvref.validation.isTypeset.type) : <code>string</code>
            * [.default(v, [options])](#rtvref.validation.isTypeset.default) ⇒ <code>boolean</code>
        * [.isWeakMap](#rtvref.validation.isWeakMap) : <code>Module</code>
            * [.type](#rtvref.validation.isWeakMap.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isWeakMap.default) ⇒ <code>boolean</code>
        * [.isWeakSet](#rtvref.validation.isWeakSet) : <code>Module</code>
            * [.type](#rtvref.validation.isWeakSet.type) : <code>string</code>
            * [.default(v)](#rtvref.validation.isWeakSet.default) ⇒ <code>boolean</code>
    * [.validator](#rtvref.validator) : <code>object</code>
        * [.type_validator(value, [qualifier], [args])](#rtvref.validator.type_validator) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.validator_config(settings)](#rtvref.validator.validator_config)
        * [.valAny](#rtvref.validator.valAny) : <code>Module</code>
            * [.type](#rtvref.validator.valAny.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valAny.config)
            * [.default(v, [q])](#rtvref.validator.valAny.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valAnyObject](#rtvref.validator.valAnyObject) : <code>Module</code>
            * [.type](#rtvref.validator.valAnyObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valAnyObject.config)
            * [.default(v, [q], [args])](#rtvref.validator.valAnyObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valArray](#rtvref.validator.valArray) : <code>Module</code>
            * [.type](#rtvref.validator.valArray.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valArray.config)
            * [.default(v, [q], [args])](#rtvref.validator.valArray.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valBoolean](#rtvref.validator.valBoolean) : <code>Module</code>
            * [.type](#rtvref.validator.valBoolean.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valBoolean.config)
            * [.default(v, [q])](#rtvref.validator.valBoolean.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valClassObject](#rtvref.validator.valClassObject) : <code>Module</code>
            * [.type](#rtvref.validator.valClassObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valClassObject.config)
            * [.default(v, [q], [args])](#rtvref.validator.valClassObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valDate](#rtvref.validator.valDate) : <code>Module</code>
            * [.type](#rtvref.validator.valDate.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valDate.config)
            * [.default(v, [q])](#rtvref.validator.valDate.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valError](#rtvref.validator.valError) : <code>Module</code>
            * [.type](#rtvref.validator.valError.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valError.config)
            * [.default(v, [q])](#rtvref.validator.valError.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valFinite](#rtvref.validator.valFinite) : <code>Module</code>
            * [.type](#rtvref.validator.valFinite.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valFinite.config)
            * [.default(v, [q], [args])](#rtvref.validator.valFinite.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valFloat](#rtvref.validator.valFloat) : <code>Module</code>
            * [.type](#rtvref.validator.valFloat.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valFloat.config)
            * [.default(v, [q], [args])](#rtvref.validator.valFloat.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valFunction](#rtvref.validator.valFunction) : <code>Module</code>
            * [.type](#rtvref.validator.valFunction.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valFunction.config)
            * [.default(v, [q])](#rtvref.validator.valFunction.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valHashMap](#rtvref.validator.valHashMap) : <code>Module</code>
            * [.type](#rtvref.validator.valHashMap.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valHashMap.config)
            * [.default(v, [q], [args])](#rtvref.validator.valHashMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valInt](#rtvref.validator.valInt) : <code>Module</code>
            * [.type](#rtvref.validator.valInt.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valInt.config)
            * [.default(v, [q], [args])](#rtvref.validator.valInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valJson](#rtvref.validator.valJson) : <code>Module</code>
            * [.type](#rtvref.validator.valJson.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valJson.config)
            * [.default(v, [q])](#rtvref.validator.valJson.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valMap](#rtvref.validator.valMap) : <code>Module</code>
            * [.type](#rtvref.validator.valMap.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valMap.config)
            * [.default(v, [q], [args])](#rtvref.validator.valMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valNull](#rtvref.validator.valNull) : <code>Module</code>
            * [.type](#rtvref.validator.valNull.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valNull.config)
            * [.default(v, [q])](#rtvref.validator.valNull.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valNumber](#rtvref.validator.valNumber) : <code>Module</code>
            * [.type](#rtvref.validator.valNumber.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valNumber.config)
            * [.default(v, [q], [args])](#rtvref.validator.valNumber.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valObject](#rtvref.validator.valObject) : <code>Module</code>
            * [.type](#rtvref.validator.valObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valObject.config)
            * [.default(v, [q], [args])](#rtvref.validator.valObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valPlainObject](#rtvref.validator.valPlainObject) : <code>Module</code>
            * [.type](#rtvref.validator.valPlainObject.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valPlainObject.config)
            * [.default(v, [q], [args])](#rtvref.validator.valPlainObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valPromise](#rtvref.validator.valPromise) : <code>Module</code>
            * [.type](#rtvref.validator.valPromise.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valPromise.config)
            * [.default(v, [q])](#rtvref.validator.valPromise.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valRegExp](#rtvref.validator.valRegExp) : <code>Module</code>
            * [.type](#rtvref.validator.valRegExp.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valRegExp.config)
            * [.default(v, [q])](#rtvref.validator.valRegExp.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valSafeInt](#rtvref.validator.valSafeInt) : <code>Module</code>
            * [.type](#rtvref.validator.valSafeInt.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valSafeInt.config)
            * [.default(v, [q], [args])](#rtvref.validator.valSafeInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valSet](#rtvref.validator.valSet) : <code>Module</code>
            * [.type](#rtvref.validator.valSet.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valSet.config)
            * [.default(v, [q], [args])](#rtvref.validator.valSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valString](#rtvref.validator.valString) : <code>Module</code>
            * [.type](#rtvref.validator.valString.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valString.config)
            * [.default(v, [q], [args])](#rtvref.validator.valString.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valSymbol](#rtvref.validator.valSymbol) : <code>Module</code>
            * [.type](#rtvref.validator.valSymbol.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valSymbol.config)
            * [.default(v, [q], [args])](#rtvref.validator.valSymbol.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valWeakMap](#rtvref.validator.valWeakMap) : <code>Module</code>
            * [.type](#rtvref.validator.valWeakMap.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valWeakMap.config)
            * [.default(v, [q])](#rtvref.validator.valWeakMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.valWeakSet](#rtvref.validator.valWeakSet) : <code>Module</code>
            * [.type](#rtvref.validator.valWeakSet.type) : <code>string</code>
            * [.config(settings)](#rtvref.validator.valWeakSet.config)
            * [.default(v, [q])](#rtvref.validator.valWeakSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
        * [.validator_config_settings](#rtvref.validator.validator_config_settings) : <code>Object</code>

<a name="rtvref.Enumeration"></a>

## rtvref.Enumeration
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.Enumeration](#rtvref.Enumeration)
    * [new Enumeration(map, [name])](#new_rtvref.Enumeration_new)
    * [.$name](#rtvref.Enumeration+$name) : <code>string</code>
    * [.$values](#rtvref.Enumeration+$values) : <code>Array.&lt;String&gt;</code>
    * [.check(value)](#rtvref.Enumeration+check) ⇒ <code>\*</code> \| <code>undefined</code>
    * [.verify(value, [silent])](#rtvref.Enumeration+verify) ⇒ <code>\*</code>
    * [.toString()](#rtvref.Enumeration+toString) ⇒ <code>string</code>

<a name="new_rtvref.Enumeration_new"></a>

### new Enumeration(map, [name])
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

<a name="rtvref.Enumeration+$name"></a>

### enumeration.$name : <code>string</code>
Friendly name (not necessarily unique among all enumeration instances)
 used to identify this enumeration, especially in validation error
 messages. Empty string if not specified during construction.

**Kind**: instance property of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Read only**: true  
<a name="rtvref.Enumeration+$values"></a>

### enumeration.$values : <code>Array.&lt;String&gt;</code>
List of enumeration values. Values are _references_ to values in this
 enumeration.

Note that this own-property is non-enumerable on purpose. Enumerable
 properties on this instance are the keys in this enumeration.

**Kind**: instance property of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Read only**: true  
<a name="rtvref.Enumeration+check"></a>

### enumeration.check(value) ⇒ <code>\*</code> \| <code>undefined</code>
Checks if a value is in this enumeration.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>\*</code> \| <code>undefined</code> - The specified value if it is in this enumeration, or `undefined`
 if not. An exception is __not__ thrown if the value is not in this enumeration.  
**See**: [verify](#rtvref.Enumeration+verify)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | Value to check. Cannot be undefined. |

<a name="rtvref.Enumeration+verify"></a>

### enumeration.verify(value, [silent]) ⇒ <code>\*</code>
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

<a name="rtvref.Enumeration+toString"></a>

### enumeration.toString() ⇒ <code>string</code>
A string representation of this Enumeration.

**Kind**: instance method of [<code>Enumeration</code>](#rtvref.Enumeration)  
**Returns**: <code>string</code> - String representation.  
<a name="rtvref.RtvError"></a>

## rtvref.RtvError ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
**Kind**: static class of [<code>rtvref</code>](#rtvref)  
**Extends**: [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)  

* [.RtvError](#rtvref.RtvError) ⇐ [<code>JS_Error</code>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
    * [new RtvError(value, typeset, path, cause, [failure])](#new_rtvref.RtvError_new)
    * [.valid](#rtvref.RtvError+valid) : <code>boolean</code>
    * [.value](#rtvref.RtvError+value) : <code>\*</code>
    * [.typeset](#rtvref.RtvError+typeset) : [<code>typeset</code>](#rtvref.types.typeset)
    * [.path](#rtvref.RtvError+path) : <code>Array.&lt;string&gt;</code>
    * [.cause](#rtvref.RtvError+cause) : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
    * [.failure](#rtvref.RtvError+failure) : <code>Error</code> \| <code>undefined</code>
    * [.toString()](#rtvref.RtvError+toString) ⇒ <code>string</code>

<a name="new_rtvref.RtvError_new"></a>

### new RtvError(value, typeset, path, cause, [failure])
Runtime Verification Error Indicator

Describes a failed runtime verification of a value against a given
 [shape](#rtvref.types.shape_descriptor) or [typeset](#rtvref.types.typeset)
 (note that a shape is a type of typeset).

**Throws**:

- <code>Error</code> If `typeset`, `path`, or `cause` is invalid.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value being verified. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | The typeset used for verification. |
| path | <code>Array.&lt;string&gt;</code> | The path deep into `value` where the failure occurred.  An empty array signifies the _root_ (top-level) value that was checked. |
| cause | [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset) | The fully qualified typeset  that caused the failure. This is normally the fully-qualified version of `typeset`,  but could be a sub-type if `typeset` is an Array typeset or a  [shape descriptor](#rtvref.types.shape_descriptor). |
| [failure] | <code>Error</code> | [Custom Validator](#rtvref.types.custom_validator)  error, if the `RtvError` is a result of a failed custom validation. |

<a name="rtvref.RtvError+valid"></a>

### rtvError.valid : <code>boolean</code>
Flag indicating the validation failed. Always `false`.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
**See**: [valid](#rtvref.RtvSuccess+valid)  
<a name="rtvref.RtvError+value"></a>

### rtvError.value : <code>\*</code>
Value that failed verification against the
 [typeset](#rtvref.RtvError+typeset).

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
<a name="rtvref.RtvError+typeset"></a>

### rtvError.typeset : [<code>typeset</code>](#rtvref.types.typeset)
Reference to the typeset used for verification.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
<a name="rtvref.RtvError+path"></a>

### rtvError.path : <code>Array.&lt;string&gt;</code>
Path from [value](#rtvref.RtvError+value) to the nested property that
 caused the failure.

__SECURITY:__ Some collection types, such as [MAP](#rtvref.types.MAP) and
 [SET](#rtvref.types.SET), can have actual objects as keys or elements,
 and these are used (in JSON-stringified form) as part of the error path.
 If these objects happen to contain sensitive information, that information
 may end-up in the path, and the path gets included in this error's
 `message` property, which may get logged by your systems.

 __It is YOUR responsibility to exercise necessary caution when validating
  data structures containing sensitive data.__

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
<a name="rtvref.RtvError+cause"></a>

### rtvError.cause : [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
Fully qualified typeset that caused the failure. This will be a subset of
 the [typeset](#rtvref.RtvError+typeset), and possibly of a nested
 typeset within it, expressing only the direct cause of the failure.

If `typeset` is `[[rtv.t.STRING]]` (a required array of required strings),
 and `value` is `['a', 2]`, this property would be `[rtv.q.REQUIRED, rtv.t.STRING]`
 because the failure would ultimately have been caused by the nested `rtv.t.STRING`
 typeset.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
<a name="rtvref.RtvError+failure"></a>

### rtvError.failure : <code>Error</code> \| <code>undefined</code>
Validation error thrown by a [Custom Validator](#rtvref.types.custom_validator),
 which resulted in this `RtvError`. `undefined` if this error was not the result
 of a failed custom validation.

**Kind**: instance property of [<code>RtvError</code>](#rtvref.RtvError)  
**Read only**: true  
<a name="rtvref.RtvError+toString"></a>

### rtvError.toString() ⇒ <code>string</code>
A string representation of this instance.

**Kind**: instance method of [<code>RtvError</code>](#rtvref.RtvError)  
**Returns**: <code>string</code> - String representation.  
<a name="rtvref.RtvSuccess"></a>

## rtvref.RtvSuccess
**Kind**: static class of [<code>rtvref</code>](#rtvref)  

* [.RtvSuccess](#rtvref.RtvSuccess)
    * [new RtvSuccess()](#new_rtvref.RtvSuccess_new)
    * [.valid](#rtvref.RtvSuccess+valid) : <code>boolean</code>
    * [.toString()](#rtvref.RtvSuccess+toString) ⇒ <code>string</code>

<a name="new_rtvref.RtvSuccess_new"></a>

### new RtvSuccess()
Runtime Verification Success Indicator

Describes a successful runtime verification of a value against a given
 [shape](#rtvref.types.shape_descriptor) or [typeset](#rtvref.types.typeset)
 (note that a shape is a type of typeset).

<a name="rtvref.RtvSuccess+valid"></a>

### rtvSuccess.valid : <code>boolean</code>
Flag indicating the validation succeeded. Always `true`.

**Kind**: instance property of [<code>RtvSuccess</code>](#rtvref.RtvSuccess)  
**Read only**: true  
**See**: [valid](#rtvref.RtvError+valid)  
<a name="rtvref.RtvSuccess+toString"></a>

### rtvSuccess.toString() ⇒ <code>string</code>
A string representation of this instance.

**Kind**: instance method of [<code>RtvSuccess</code>](#rtvref.RtvSuccess)  
**Returns**: <code>string</code> - String representation.  
<a name="rtvref.impl"></a>

## rtvref.impl : <code>object</code>
<h3>RTV.js Implementation</h3>

Provides the internal implementation for the externally-facing [RTV](#rtv)
 API, as well as utilities for [type validators](#rtvref.validator).

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.impl](#rtvref.impl) : <code>object</code>
    * [.getQualifier(typeset)](#rtvref.impl.getQualifier) ⇒ <code>string</code>
    * [.toTypeset(type, [qualifier], [args], [fullyQualified])](#rtvref.impl.toTypeset) ⇒ [<code>typeset</code>](#rtvref.types.typeset)
    * [.fullyQualify(typeset, [qualifier])](#rtvref.impl.fullyQualify) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
    * [.extractNextType(typeset, [qualifier])](#rtvref.impl.extractNextType) ⇒ [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code>
    * [.checkWithType(value, singleType)](#rtvref.impl.checkWithType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.checkWithShape(value, shape)](#rtvref.impl.checkWithShape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.checkWithArray(value, array)](#rtvref.impl.checkWithArray) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.check(value, typeset)](#rtvref.impl.check) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.impl.getQualifier"></a>

### impl.getQualifier(typeset) ⇒ <code>string</code>
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

<a name="rtvref.impl.toTypeset"></a>

### impl.toTypeset(type, [qualifier], [args], [fullyQualified]) ⇒ [<code>typeset</code>](#rtvref.types.typeset)
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

<a name="rtvref.impl.fullyQualify"></a>

### impl.fullyQualify(typeset, [qualifier]) ⇒ [<code>fully_qualified_typeset</code>](#rtvref.types.fully_qualified_typeset)
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
| [qualifier] | [<code>qualifiers</code>](#rtvref.qualifiers) | Optional qualifier to be used.  If the typeset is a simple [type](#rtvref.types),   a [shape](#rtvref.types.shape_descriptor), or   a [custom validator](#rtvref.types.custom_validator) that was   cherry-picked out of a typeset whose qualifier should be used instead of   the [default](#rtvref.qualifiers.DEFAULT_QUALIFIER) one.  If `typeset` is an Array typeset, specifying this parameter will __override__   the typeset's qualifier (otherwise, its own qualifier will be used). |

<a name="rtvref.impl.extractNextType"></a>

### impl.extractNextType(typeset, [qualifier]) ⇒ [<code>typeset</code>](#rtvref.types.typeset) \| <code>Array</code>
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

<a name="rtvref.impl.checkWithType"></a>

### impl.checkWithType(value, singleType) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
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
| singleType | <code>string</code> \| <code>Array</code> \| <code>Object</code> | Either a simple type name (one of  [types](#rtvref.types.types)), a [shape descriptor](#rtvref.types.shape_descriptor),  or an Array [typeset](#rtvref.types.typeset) which represents a single type.  In the string/simple case, the   [default qualifier](#rtvref.qualifiers.DEFAULT_QUALIFIER) is assumed.  In the shape descriptor case, the   [default object type](#rtvref.types.DEFAULT_OBJECT_TYPE) is assumed.  In the Array case, the qualifier is optional, and a type, along with args,   if any, is expected (e.g. `[type]`, `[qualifier, type]`, `[type, args]`, or   `[qualifier, type, args]`). Note that the type may be implied the shorthand   notation is being used for an ARRAY, or if the   [default object type](#rtvref.types.DEFAULT_OBJECT_TYPE) is being implied.  NOTE: A [custom validator](#rtvref.types.custom_validator) is not considered   a valid single type. It's also considered a __separate type__ if it were passed-in   via an Array, e.g. `[STRING, validator]`, which would violate the fact that   `singleType` should be one type, and therefore cause an exception to be thrown. |

<a name="rtvref.impl.checkWithShape"></a>

### impl.checkWithShape(value, shape) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
Checks a value using a [shape descriptor](#rtvref.types.shape_descriptor) and
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

<a name="rtvref.impl.checkWithArray"></a>

### impl.checkWithArray(value, array) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
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
| array | <code>Array</code> | The Array [typeset](#rtvref.types.typeset) to check  against. |

<a name="rtvref.impl.check"></a>

### impl.check(value, typeset) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
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

<a name="rtvref.qualifiers"></a>

## rtvref.qualifiers : <code>object</code>
<h3>Qualifiers</h3>

Qualifiers determine the degree at which a value must be of a given type.

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  

* [.qualifiers](#rtvref.qualifiers) : <code>object</code>
    * [.qualifiers](#rtvref.qualifiers.qualifiers) : [<code>Enumeration</code>](#rtvref.Enumeration)
    * [.REQUIRED](#rtvref.qualifiers.REQUIRED) : <code>string</code>
    * [.EXPECTED](#rtvref.qualifiers.EXPECTED) : <code>string</code>
    * [.OPTIONAL](#rtvref.qualifiers.OPTIONAL) : <code>string</code>
    * [.DEFAULT_QUALIFIER](#rtvref.qualifiers.DEFAULT_QUALIFIER) : <code>string</code>
    * [.nilPermitted(v, [q])](#rtvref.qualifiers.nilPermitted) ⇒ <code>boolean</code>

<a name="rtvref.qualifiers.qualifiers"></a>

### qualifiers.qualifiers : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of all qualifiers:

- [REQUIRED](#rtvref.qualifiers.REQUIRED)
- [EXPECTED](#rtvref.qualifiers.EXPECTED)
- [OPTIONAL](#rtvref.qualifiers.OPTIONAL)

**Kind**: static property of [<code>qualifiers</code>](#rtvref.qualifiers)  
<a name="rtvref.qualifiers.REQUIRED"></a>

### qualifiers.REQUIRED : <code>string</code>
Required qualifier: The value __must__ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier does not
 allow the value to be `null` or `undefined`.

Note the fact the value cannot be `undefined` implicitly requires a
 [shape](#rtvref.types.shape_descriptor)'s property to be defined _somewhere_
 its prototype chain (if it weren't, then its value would be `undefined`,
 violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 would require the `name` property to exist and not be `undefined`, but would
 allow it to be `null` or even an empty string.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**

- [types](#rtvref.types)
- [STRING](#rtvref.types.STRING)

<a name="rtvref.qualifiers.EXPECTED"></a>

### qualifiers.EXPECTED : <code>string</code>
Expected qualifier: The value _should_ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier does _not_ allow
 the value to be `undefined`, but does _allow_ it to be `null`.

Note the fact the value cannot be `undefined` implicitly requires a
 [shape](#rtvref.types.shape_descriptor)'s property to be defined _somewhere_
 its prototype chain (if it weren't, then its value would be `undefined`,
 violating the requirements). For example, the shape `{name: [EXPECTED, STRING]}`
 would require the `name` property to exist and not be `undefined`, but would
 allow it to be `null` or even an empty string.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**

- [types](#rtvref.types)
- [STRING](#rtvref.types.STRING)

<a name="rtvref.qualifiers.OPTIONAL"></a>

### qualifiers.OPTIONAL : <code>string</code>
Optional qualifier: The value _may_ be of the expected type. Depending on
 the type, additional requirements may be enforced.

Unless otherwise stated in type-specific rules, this qualifier _allows_ a
 the value to be `null` as well as `undefined`,

Note the fact the value can be `undefined` implies it does _not_ require a
 [shape](#rtvref.types.shape_descriptor)'s property to be defined anywhere in
 its prototype chain.

See specific type for additional rules.

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
**See**: [types](#rtvref.types)  
<a name="rtvref.qualifiers.DEFAULT_QUALIFIER"></a>

### qualifiers.DEFAULT_QUALIFIER : <code>string</code>
Default qualifier: [REQUIRED](#rtvref.qualifiers.REQUIRED)

**Kind**: static constant of [<code>qualifiers</code>](#rtvref.qualifiers)  
<a name="rtvref.qualifiers.nilPermitted"></a>

### qualifiers.nilPermitted(v, [q]) ⇒ <code>boolean</code>
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

<a name="rtvref.types"></a>

## rtvref.types : <code>object</code>
<h3>Types</h3>

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
    * [.SAFE_INT](#rtvref.types.SAFE_INT) : <code>string</code>
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
    * [.primitives](#rtvref.types.primitives) : <code>void</code>
    * [.qualifier_rules](#rtvref.types.qualifier_rules) : <code>void</code>
    * [.shape_descriptor](#rtvref.types.shape_descriptor) : <code>Object</code>
    * [.type_arguments](#rtvref.types.type_arguments) : <code>Object</code>
    * [.STRING_args](#rtvref.types.STRING_args) : <code>Object</code>
    * [.SYMBOL_args](#rtvref.types.SYMBOL_args) : <code>Object</code>
    * [.numeric_args](#rtvref.types.numeric_args) : <code>Object</code>
    * [.shape_object_args](#rtvref.types.shape_object_args) : <code>Object</code>
    * [.ARRAY_args](#rtvref.types.ARRAY_args) : <code>Object</code>
    * [.collection_args](#rtvref.types.collection_args) : <code>Object</code>
    * [.typeset](#rtvref.types.typeset) : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
    * [.fully_qualified_typeset](#rtvref.types.fully_qualified_typeset) : <code>Array</code>
    * [.custom_validator](#rtvref.types.custom_validator) : <code>function</code>

<a name="rtvref.types.objTypes"></a>

### types.objTypes : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of __object__ types:

- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

**Kind**: static property of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.argTypes"></a>

### types.argTypes : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of types that accept arguments:

- [STRING](#rtvref.types.STRING)
- [SYMBOL](#rtvref.types.SYMBOL)
- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)
- [ARRAY](#rtvref.types.ARRAY)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [HASH_MAP](#rtvref.types.HASH_MAP)
- [MAP](#rtvref.types.MAP)
- [SET](#rtvref.types.SET)

**Kind**: static property of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.types"></a>

### types.types : [<code>Enumeration</code>](#rtvref.Enumeration)
Enumeration (`string -> string`) of all types:

- [ANY](#rtvref.types.ANY)
- [NULL](#rtvref.types.NULL)
- [STRING](#rtvref.types.STRING)
- [BOOLEAN](#rtvref.types.BOOLEAN)
- [SYMBOL](#rtvref.types.SYMBOL)
- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)
- [FUNCTION](#rtvref.types.FUNCTION)
- [REGEXP](#rtvref.types.REGEXP)
- [DATE](#rtvref.types.DATE)
- [ERROR](#rtvref.types.ERROR)
- [PROMISE](#rtvref.types.PROMISE)
- [ARRAY](#rtvref.types.ARRAY)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)
- [HASH_MAP](#rtvref.types.HASH_MAP)
- [MAP](#rtvref.types.MAP)
- [WEAK_MAP](#rtvref.types.WEAK_MAP)
- [SET](#rtvref.types.SET)
- [WEAK_SET](#rtvref.types.WEAK_SET)
- [JSON](#rtvref.types.JSON)

**Kind**: static property of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.ANY"></a>

### types.ANY : <code>string</code>
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
 as well not be included in a [shape descriptor](#rtvref.types.shape_descriptor)
 unless a [custom validator](#rtvref.types.custom_validator) is being
 used to do customized verification.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.NULL"></a>

### types.NULL : <code>string</code>
Null rules per qualifiers: must be the `null` [primitive](#rtvref.types.primitives).

Use this special type to explicitly test for a `null` value. For example,
 a [shape](#rtvref.types.shape_descriptor)'s property may be required to be
 `null` under certain circumstances.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.STRING"></a>

### types.STRING : <code>string</code>
String rules per qualifiers:

- REQUIRED: Must be a non-empty string.
- EXPECTED | OPTIONAL: May be an empty string.

In all cases, the value must be a string [primitive](#rtvref.types.primitives).
 Note that `new String('hello') !== 'hello'` because the former is an _object_, not a string.

Arguments (optional): [STRING_args](#rtvref.types.STRING_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.BOOLEAN"></a>

### types.BOOLEAN : <code>string</code>
Boolean rules per qualifiers: Must be a boolean [primitive](#rtvref.types.primitives).
 Note that `new Boolean(true) !== true` because the former is an _object_, not a boolean.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.SYMBOL"></a>

### types.SYMBOL : <code>string</code>
Symbol rules per qualifiers: Must be a symbol [primitive](#rtvref.types.primitives).

Arguments (optional): [SYMBOL_args](#rtvref.types.SYMBOL_args).

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.NUMBER"></a>

### types.NUMBER : <code>string</code>
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
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)

<a name="rtvref.types.FINITE"></a>

### types.FINITE : <code>string</code>
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
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)

<a name="rtvref.types.INT"></a>

### types.INT : <code>string</code>
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
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)

<a name="rtvref.types.SAFE_INT"></a>

### types.SAFE_INT : <code>string</code>
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

<a name="rtvref.types.FLOAT"></a>

### types.FLOAT : <code>string</code>
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
- [SAFE_INT](#rtvref.types.SAFE_INT)

<a name="rtvref.types.FUNCTION"></a>

### types.FUNCTION : <code>string</code>
Function rules per qualifiers: Must be a `function`.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.REGEXP"></a>

### types.REGEXP : <code>string</code>
RegExp rules per qualifiers: Must be a `RegExp` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

<a name="rtvref.types.DATE"></a>

### types.DATE : <code>string</code>
Date rules per qualifiers: Must be a `Date` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

<a name="rtvref.types.ERROR"></a>

### types.ERROR : <code>string</code>
Error rules per qualifiers: Must be an `Error` instance, which includes `TypeError`,
 `RangeError`, `ReferenceError`, etc.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

<a name="rtvref.types.PROMISE"></a>

### types.PROMISE : <code>string</code>
Promise rules per qualifiers: Must be a `Promise` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<a name="rtvref.types.ARRAY"></a>

### types.ARRAY : <code>string</code>
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

<h4>Array Example: Simple array</h4>

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

<h4>Array Example: Shorthand notation</h4>

The `value` property must be an array (possibly empty) of finite numbers of
 any value.

<pre><code>{
  value: [[FINITE]]
}
</code></pre>

<h4>Array Example: Shorthand, mixed types</h4>

The `value` property must be either a boolean; or an array (possibly empty) of
 finite numbers of any value, or non-empty strings, or a mix of both.

<pre><code>{
  value: [BOOLEAN, [FINITE, STRING]]
}
</code></pre>

<h4>Array Example: Fully-qualified notation, no typeset</h4>

The `value` property must be a non-empty array of any type of value.

<pre><code>{
  value: [REQUIRED, ARRAY, {min: 1}]
}
</code></pre>

<h4>Array Example: Fully-qualified notation</h4>

The `value` property must be an array (possibly empty) of finite numbers of
 any value (nested typeset is not fully-qualified).

<pre><code>{
  value: [REQUIRED, ARRAY, {ts: [FINITE]}]
}
</code></pre>

<h4>Array Example: Fully-qualified, mixed types</h4>

The `value` property must be either a boolean; or an array (possibly empty) of
 finite numbers of any value, or non-empty strings, or a mix of both
 (nested typeset is not fully-qualified).

<pre><code>{
  value: [REQUIRED, BOOLEAN, ARRAY, {ts: [FINITE, STRING]}]
}
</code></pre>

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**: [qualifiers](#rtvref.qualifiers)  
<a name="rtvref.types.ANY_OBJECT"></a>

### types.ANY_OBJECT : <code>string</code>
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

Arguments (optional): [shape_object_args](#rtvref.types.shape_object_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

<a name="rtvref.types.OBJECT"></a>

### types.OBJECT : <code>string</code>
An object is one that extends from `JavaScript.Object` (i.e. an _instance_
 of _something_ that extends from Object) and is not a
 [function](#rtvref.types.FUNCTION), [array](#rtvref.types.ARRAY),
 [regular expression](#rtvref.types.REGEXP), [DATE](#rtvref.types.DATE),
 function arguments object,
 [map](#rtvref.types.MAP), [weak map](#rtvref.types.WEAK_MAP),
 [set](#rtvref.types.SET), [weak set](#rtvref.types.WEAK_SET), nor a
 [primitive](#rtvref.types).

This is the __default__ (imputed) type for
 [shape descriptors](#rtvref.types.shape_descriptor), which means the object itself
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

Arguments (optional): [shape_object_args](#rtvref.types.shape_object_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

<a name="rtvref.types.PLAIN_OBJECT"></a>

### types.PLAIN_OBJECT : <code>string</code>
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

Arguments (optional): [shape_object_args](#rtvref.types.shape_object_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

<a name="rtvref.types.CLASS_OBJECT"></a>

### types.CLASS_OBJECT : <code>string</code>
A _class_ object is one that is created by invoking the `new` operator on a
 function (other than a primitive type function), generating a new object,
 commonly referred to as a _class instance_. This object's prototype
 (`__proto__`) is a reference to that function's `prototype` and has a
 `constructor` property that is `===` to the function.

The following values are considered class objects:

- `new (function() {}) | new (class {})()` (tip: use the `ctor`
  [argument](#rtvref.types.shape_object_args) to test for a specific class)

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

Arguments (optional): [shape_object_args](#rtvref.types.shape_object_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)

<a name="rtvref.types.HASH_MAP"></a>

### types.HASH_MAP : <code>string</code>
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

<a name="rtvref.types.MAP"></a>

### types.MAP : <code>string</code>
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

<a name="rtvref.types.WEAK_MAP"></a>

### types.WEAK_MAP : <code>string</code>
An ES6 weak map supports any _object_ as its keys, unlike a
 [HASH_MAP](#rtvref.types.HASH_MAP) that only supports strings,
 and a [MAP](#rtvref.types.MAP) that supports any type of value.

Weak map rules per qualifiers: Must be a `WeakMap` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [HASH_MAP](#rtvref.types.HASH_MAP)
- [MAP](#rtvref.types.MAP)

<a name="rtvref.types.SET"></a>

### types.SET : <code>string</code>
An ES6 set is a collection of _unique_ values without associated keys. Values can
 be described using a [typeset](#rtvref.types.typeset). Empty sets are permitted
 by default.

Set rules per qualifiers: Must be a `Set` instance.

Arguments (optional): [collection_args](#rtvref.types.collection_args)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [WEAK_SET](#rtvref.types.WEAK_SET)

<a name="rtvref.types.WEAK_SET"></a>

### types.WEAK_SET : <code>string</code>
An ES6 weak set is a collection of weakly held _unique_ _objects_ without
 associated keys.

Weak set rules per qualifiers: Must be a `WeakSet` instance.

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
**See**

- [qualifiers](#rtvref.qualifiers)
- [SET](#rtvref.types.SET)

<a name="rtvref.types.JSON"></a>

### types.JSON : <code>string</code>
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
<a name="rtvref.types.DEFAULT_OBJECT_TYPE"></a>

### types.DEFAULT_OBJECT_TYPE : <code>string</code>
Default object type: [OBJECT](#rtvref.types.OBJECT)

**Kind**: static constant of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.primitives"></a>

### types.primitives : <code>void</code>
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
**See**: [isPrimitive](#rtvref.validation.isPrimitive)  
<a name="rtvref.types.qualifier_rules"></a>

### types.qualifier_rules : <code>void</code>
<h3>Rules Per Qualifiers</h3>

[Qualifiers](#rtvref.qualifiers) state basic rules. Unless otherwise stated,
 every type herein abides by those basic rules. Each type will also impose
 additional rules specific to the type of value it represents.

For example, while the [FINITE](#rtvref.types.FINITE) type states that the
 value must not be `NaN`, `+Infinity`, nor `-Infinity`; it could be `null` if
 the qualifier used is `EXPECTED`; and it could be `undefined` if the qualifier
 used is `OPTIONAL`.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.shape_descriptor"></a>

### types.shape_descriptor : <code>Object</code>
<h3>Shape Descriptor</h3>

Describes the shape (i.e. interface) of an object as a map of properties to
 [typesets](#rtvref.types.typeset). Each typeset indicates whether the
 property is required, expected, or optional, using [qualifiers](#rtvref.qualifiers),
 along with possible types. Only enumerable, own-properties of the shape are
 considered part of the shape.

When a value is [checked](#rtv.check) or [verified](#rtv.verify) against
 a given shape, _properties on the value that are not part of the shape are
 ignored_ (this is to stay true to the concept of an _interface_ whereby an object
 may have other functionality, but remains _compatible_ or _usable_ as long as it
 meets the specified contract as a subset of its properties and methods). If
 successfully checked/verified, the value is guaranteed to provide the properties
 described in the shape, and each property is guaranteed to be assigned to a value
 of at least one type described in each property's typeset.

The shape descriptor itself must be an [OBJECT](#rtvref.types.OBJECT).

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [isShape](#rtvref.validation.isShape)  
<a name="rtvref.types.type_arguments"></a>

### types.type_arguments : <code>Object</code>
<h3>Type Arguments</h3>

Some types will accept, or may even expect, one or more arguments. Each type
 will specify whether it has arguments, and if they're optional or required.
 Arguments are specified as a single [object](#rtvref.types.OBJECT)
 immediately following a type in an __Array__ [typeset](#rtvref.types.typeset)
 (i.e. an Array must be used as the typeset in order to provide arguments for
 a type).

An arguments object immediately follows its type in a typeset, such as
 `[PLAIN_OBJECT, {$: {hello: STRING}}]`. This would specify the value must be a
 [plain object](#rtvref.types.PLAIN_OBJECT) with a shape that includes a
 property named 'hello', that property being a
 [required](#rtvref.qualifiers.REQUIRED) [string](#rtvref.types.STRING).
 Another example would be `[STRING, {min: 5}]`, which would require a string
 of at least 5 characters in length.

Since [qualifiers](#rtvref.qualifiers) may affect how a value is validated
 against a type, [qualifier rules](#rtvref.types.qualifier_rules) always take
 __precedence__ over any argument specified. For example, `[STRING, {min: 0}]`
 would fail to validate an empty string because the _implied_ qualifier
 is `REQUIRED`, and per [STRING](#rtvref.types.STRING) qualifier rules,
 required strings cannot be empty.

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [isTypeArgs](#rtvref.validation.isTypeArgs)  
<a name="rtvref.types.STRING_args"></a>

### types.STRING_args : <code>Object</code>
<h3>String Arguments</h3>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [STRING](#rtvref.types.STRING)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [oneOf] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | An exact string to match (`===`).  Can also be a list of strings, one of which must be an exact match. An empty  string is allowed. Note, however, that the [qualifier](#rtvref.qualifiers)  must not be `REQUIRED` because that will disallow an empty string as the value  being checked regardless of this value/list. An empty list will be ignored. |
| [partial] | <code>string</code> | A partial value to match (must be somewhere  within the string). Ignored if empty string, or `exact` is specified. `min`  and `max` take __precedence__ over this argument (the length will be  validated first, then a partial match will be attempted). |
| [min] | <code>number</code> | Minimum inclusive length. Defaults to 1 for a  `REQUIRED` string, and 0 for an `EXPECTED` or `OPTIONAL` string. Ignored if  `exact` is specified, or `min` is not a [FINITE](#rtvref.types.FINITE)  number >= 0. |
| [max] | <code>number</code> | Maximum inclusive length. Negative means no maximum.  Ignored if `exact` is specified, `max` is not a  [FINITE](#rtvref.types.FINITE) number, or `max` is less than `min`. |

<a name="rtvref.types.SYMBOL_args"></a>

### types.SYMBOL_args : <code>Object</code>
<h3>Symbol Arguments</h3>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [SYMBOL](#rtvref.types.SYMBOL)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [oneOf] | <code>symbol</code> \| <code>Array.&lt;symbol&gt;</code> | An exact symbol to match (`===`).  Can also be a list of symbols, one of which must be an exact match. Values to  match are ignored if they are not symbols. An empty list will be ignored. |

<a name="rtvref.types.numeric_args"></a>

### types.numeric_args : <code>Object</code>
<h3>Numeric Value Arguments</h3>

Applicable to all numeric types:

- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**

- [NUMBER](#rtvref.types.NUMBER)
- [FINITE](#rtvref.types.FINITE)
- [INT](#rtvref.types.INT)
- [SAFE_INT](#rtvref.types.SAFE_INT)
- [FLOAT](#rtvref.types.FLOAT)
- [qualifiers](#rtvref.qualifiers)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [oneOf] | <code>number</code> \| <code>Array.&lt;number&gt;</code> | An exact number to match (`===`).  Can also be a list of numbers, one of which must be an exact match. An empty  list will be ignored.  Values to match are ignored if they are not within normal range of the type   (e.g. for `NUMBER`, could be `+Infinity`, or even `NaN` if the qualifier is   not `REQUIRED`; but these values would be ignored by `FINITE` since they   aren't part of the `FINITE` range), or not numbers at all. |
| [min] | <code>number</code> | Minimum inclusive value. Ignored if `exact` is  specified, `min` is `NaN`, or `min` is not within normal range of the type. |
| [max] | <code>number</code> | Maximum inclusive value. Ignored if `exact` is  specified, `max` is `NaN`, `max` is not within normal range of the type,  or `max` is less than `min`. |

<a name="rtvref.types.shape_object_args"></a>

### types.shape_object_args : <code>Object</code>
<h3>Shape Object Arguments</h3>

Applicable to all object types that may have a shape:

- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**

- [ANY_OBJECT](#rtvref.types.ANY_OBJECT)
- [OBJECT](#rtvref.types.OBJECT)
- [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)
- [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [$] | <code>Object</code> | The [shape descriptor](#rtvref.types.shape_descriptor)  describing the expected interface of the value being verified. If not specified,  none of the value's properties will be verified.  Applies to all shape object types. |
| [ctor] | <code>function</code> | A reference to a constructor function. If specified,  the class object (instance) must have this class function in its inheritance  chain such that `<class_object> instanceof ctor === true`. Note that this  property is not serializable to JSON. Ignored if not a  [function](#rtvref.types.FUNCTION). Applies to: [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT). |

<a name="rtvref.types.ARRAY_args"></a>

### types.ARRAY_args : <code>Object</code>
<h3>Array Arguments</h3>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
**See**: [ARRAY](#rtvref.types.ARRAY)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [ts] | [<code>typeset</code>](#rtvref.types.typeset) | The typeset which every value in the  array must match. Defaults to [ANY](#rtvref.types.ANY) which means any  value will match. |
| [length] | <code>number</code> | Exact length. Ignored if not a  [FINITE](#rtvref.types.FINITE) number >= 0. |
| [min] | <code>number</code> | Minimum inclusive length. Ignored if `exact` is  specified, or `min` is not a [FINITE](#rtvref.types.FINITE) number >= 0. |
| [max] | <code>number</code> | Maximum inclusive length. Negative means no maximum.  Ignored if `exact` is specified, `max` is not a  [FINITE](#rtvref.types.FINITE) number, or `max` is less than `min`. |

<a name="rtvref.types.collection_args"></a>

### types.collection_args : <code>Object</code>
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

<a name="rtvref.types.typeset"></a>

### types.typeset : <code>Object</code> \| <code>string</code> \| <code>Array</code> \| <code>function</code>
<h3>Typeset</h3>

Describes the possible types for a given value. It can be any one of the following
 JavaScript types:

- [Object](#rtvref.types.OBJECT): For the root or a nested
  [shape descriptor](#rtvref.types.shape_descriptor) of _implied_
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
  - If the __first__ element is an `Object` (or second, if a
    [qualifier](rtvref.types.qualifiers) is provided, and this, in a typeset that
    is _not_ [fully-qualified](#rtvref.types.fully_qualified_typeset)),
    it's treated as a nested [shape descriptor](#rtvref.types.shape_descriptor)
    describing an object of the [default object type](#rtvref.types.DEFAULT_OBJECT_TYPE).
    To include a shape descriptor at any other position within the array, it
    __must__ be preceded by a type, even if the default object type is being
    used (i.e. `OBJECT` must be specified as the type). For example, all
    these typesets are equivalent (and equivalent to just `{name: STRING}`
    as the typeset): `[{name: STRING}]`, `[REQUIRED, {name: STRING}]`, and
    `[REQUIRED, OBJECT, {$: {name: STRING}}]`, describing an object that has a name
    property which is a non-empty string. Changing it to `[STRING, {$: name: STRING}}]`,
    however, does __not__ mean, "a non-empty string, or an object with a name
    property which is a non-empty string". In this case, the
    [object arguments](rtvref.types.object_args) `{$: {name: STRING}}` would
    be treated as [STRING arguments](#rtvref.types.STRING_args), which is
    likely not the desired intent. The arguments would have to be preceded by an
    object type (e.g. [OBJECT](#rtvref.types.OBJECT),
    [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT), etc.) to have it interpreted
    as in the former "OR" case.
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
- [CLASS_OBJECT arguments](#rtvref.types.shape_object_args) 'ctor' property

Those exceptions are due to the fact that these represent functions, and functions
 are not serializable to JSON. They will be ignored in the stringification process,
 unless a custom _replacer_ is provided which, _somehow_ (up to you), handles them.

This could, among other possibilities, enable the transmission of typesets
 over network requests, perhaps embedded in JSON payloads, similar to
 [JSON-LD](https://json-ld.org/) schemas.

<h4>Typeset Example: Object</h4>

<pre><code>const contactShape = {
  name: rtv.t.STRING, // required, non-empty, string
  tags: [rtv.t.ARRAY, [rtv.t.STRING]], // required array of non-empty strings
  // tags: [[rtv.t.STRING]], // same as above, but using shortcut array format
  details: { // required nested object of type `OBJECT` (default)
    birthday: [rtv.q.EXPECTED, rtv.t.DATE] // Date (could be null)
  },
  notes: [rtv.q.OPTIONAL, rtv.t.STRING, function(value) { // optional string...
    if (value && !value.test(/^[A-Z].+\.$/)) {
      throw new Error('Note must start with a capital letter, end with a ' +
          period, and have something in between, if specified.');
    }
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

<h4>Typeset Example: String</h4>

<pre><code>rtv.verify('foo', rtv.t.STRING); // OK
rtv.verify('foo', rtv.t.FINITE); // ERROR
</code></pre>

<h4>Typeset Example: Array</h4>

<pre><code>const typeset = [rtv.t.STRING, rtv.t.FINITE]; // non-empty string, or finite number
rtv.verify('foo', typeset); // OK
rtv.verify(1, typeset); // OK
</code></pre>

<h4>Typeset Example: Function</h4>

<pre><code>const validator = (v) => {
  if (v % 10) {
    throw new Error('Number must be a factor of 10.');
  }
};

rtv.verify(100, validator); // OK
rtv.verify(120, [rtv.t.INT, validator]); // OK
</code></pre>

<h4>Typeset Example: Alternate Qualifier</h4>

<pre><code>const person = {
  name: rtv.t.STRING, // required, non-empty
  age: [rtv.q.OPTIONAL, rtv.t.FINITE, (v) => { // 18 or older, if specified
    if (v < 18) {
      throw new Error('Must be 18 or older.');
    }
  }]
};
rtv.verify({name: 'Bob'}, person); // OK
rtv.verify({name: ''}, person); // ERROR
rtv.verify({name: 'Steve', age: 17}, person); // ERROR
rtv.verify({name: 'Steve', age: null}, person); // OK
</code></pre>

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.fully_qualified_typeset"></a>

### types.fully_qualified_typeset : <code>Array</code>
<h3>Fully-Qualified Typeset</h3>

A [typeset](#rtvref.types.typeset) expressed without any shortcut notations
 or implied/default types to make it easier to parse, especially as the `match`
 parameter given to a [custom validator](#rtvref.types.custom_validator).
 A fully-qualified typeset always uses the array notation, and has a single
 [qualifier](#rtvref.qualifiers) as its first element, followed by
 at least one type, and at most one validator.

For example:

- `STRING` -> `[REQUIRED, STRING]`
- `{note: STRING}` -> `[REQUIRED, OBJECT, {$: {note: [REQUIRED, STRING]}}]`
- `[[FINITE]]` -> `[REQUIRED, ARRAY, [REQUIRED, FINITE]]`
- `(v) => if (!v) { throw new Error(); }` -> `[REQUIRED, ANY, (v) => if (!v) { throw new Error(); }]`

**Kind**: static typedef of [<code>types</code>](#rtvref.types)  
<a name="rtvref.types.custom_validator"></a>

### types.custom_validator : <code>function</code>
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
**Throws**:

- <code>Error</code> If the validation fails. This error will fail the overall
 verification, and will be included in the resulting `RtvError` as its
 [failure](#rtvref.RtvError+failure) property, as well as part of its
 `message`.

  It's recommended to throw an error with a message that will help the developer
   determine why the custom validation failed, while avoiding exposing any sensitive
   information that may be found in the `value` (such as passwords).

**See**: [isCustomValidator](#rtvref.validation.isCustomValidator)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value being verified. |
| match | <code>Array</code> | A [fully-qualified](#rtvref.types.fully_qualified_typeset)  typeset describing the sub-type with the `typeset` parameter that matched, resulting  in the custom validator being called (if no sub-types matched, it would not get called).  For example, if the typeset used for verification was `[PLAIN_OBJECT, {$: {note: STRING}}, validator]`,   this parameter would be a new Array typeset `[REQUIRED, PLAIN_OBJECT, {$: {note: STRING}}]`,   and the `typeset` parameter would be the original `[PLAIN_OBJECT, {$: {note: STRING}}, validator]`.  If the verification typeset was `[STRING, FINITE, validator]` and FINITE matched, this parameter   would be `[REQUIRED, FINITE]` and the `typeset` parameter would be the original  `[STRING, FINITE, validator]`.  NOTE: If the verification typeset was `validator` (just the validator itself), the `match`   would be `[REQUIRED, ANY]` (because of the implied [ANY](#rtvref.types.ANY) type) and   the `typeset` would be `validator`. |
| typeset | [<code>typeset</code>](#rtvref.types.typeset) | Reference to the typeset used for  verification. Note the typeset may contain nested typeset(s), and may  be part of a larger parent typeset (though there would be no reference to  the parent typeset, if any). |

<a name="rtvref.util"></a>

## rtvref.util : <code>object</code>
<h3>RTV.js Utilities</h3>

**Kind**: static namespace of [<code>rtvref</code>](#rtvref)  
<a name="rtvref.util.print"></a>

### util.print(printValue) ⇒ <code>string</code>
Pretty-print a value.

**Kind**: static method of [<code>util</code>](#rtvref.util)  
**Returns**: <code>string</code> - Pretty-printed value. It's not perfect and may not catch
 all types, but attempts to be good enough.  

| Param | Type | Description |
| --- | --- | --- |
| printValue | <code>\*</code> | Value to print. |

<a name="rtvref.validation"></a>

## rtvref.validation : <code>object</code>
<h3>RTV.js Validation</h3>

This namespace provides _type validations_ which verify values to be of
 the [types](#rtvref.types) defined in this library. If permitted values
 differ between [qualifiers](#rtvref.qualifiers), the validation must
 only permit the `REQUIRED` values. Validations strictly check for types;
 they do not consider [type arguments](#rtvref.types.type_arguments) or
 qualifiers like [type validators](#rtvref.validator) do.

Validations may also check for pseudo-types, such as the
 [isTypeset](#rtvref.validation.isTypeset) validation verifying a value as
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

* [.validation](#rtvref.validation) : <code>object</code>
    * [.method(value)](#rtvref.validation.method) ⇒ <code>boolean</code>
    * [.isAny](#rtvref.validation.isAny) : <code>Module</code>
        * [.type](#rtvref.validation.isAny.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isAny.default) ⇒ <code>boolean</code>
    * [.isAnyObject](#rtvref.validation.isAnyObject) : <code>Module</code>
        * [.type](#rtvref.validation.isAnyObject.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isAnyObject.default) ⇒ <code>boolean</code>
    * [.isArray](#rtvref.validation.isArray) : <code>Module</code>
        * [.type](#rtvref.validation.isArray.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isArray.default) ⇒ <code>boolean</code>
    * [.isBoolean](#rtvref.validation.isBoolean) : <code>Module</code>
        * [.type](#rtvref.validation.isBoolean.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isBoolean.default) ⇒ <code>boolean</code>
    * [.isClassObject](#rtvref.validation.isClassObject) : <code>Module</code>
        * [.type](#rtvref.validation.isClassObject.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isClassObject.default) ⇒ <code>boolean</code>
    * [.isCustomValidator](#rtvref.validation.isCustomValidator) : <code>Module</code>
        * [.type](#rtvref.validation.isCustomValidator.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isCustomValidator.default) ⇒ <code>boolean</code>
    * [.isDate](#rtvref.validation.isDate) : <code>Module</code>
        * [.type](#rtvref.validation.isDate.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isDate.default) ⇒ <code>boolean</code>
    * [.isError](#rtvref.validation.isError) : <code>Module</code>
        * [.type](#rtvref.validation.isError.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isError.default) ⇒ <code>boolean</code>
    * [.isFinite](#rtvref.validation.isFinite) : <code>Module</code>
        * [.type](#rtvref.validation.isFinite.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isFinite.default) ⇒ <code>boolean</code>
    * [.isFloat](#rtvref.validation.isFloat) : <code>Module</code>
        * [.type](#rtvref.validation.isFloat.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isFloat.default) ⇒ <code>boolean</code>
    * [.isFunction](#rtvref.validation.isFunction) : <code>Module</code>
        * [.type](#rtvref.validation.isFunction.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isFunction.default) ⇒ <code>boolean</code>
    * [.isHashMap](#rtvref.validation.isHashMap) : <code>Module</code>
        * [.type](#rtvref.validation.isHashMap.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isHashMap.default) ⇒ <code>boolean</code>
    * [.isInt](#rtvref.validation.isInt) : <code>Module</code>
        * [.type](#rtvref.validation.isInt.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isInt.default) ⇒ <code>boolean</code>
    * [.isJson](#rtvref.validation.isJson) : <code>Module</code>
        * [.type](#rtvref.validation.isJson.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isJson.default) ⇒ <code>boolean</code>
    * [.isMap](#rtvref.validation.isMap) : <code>Module</code>
        * [.type](#rtvref.validation.isMap.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isMap.default) ⇒ <code>boolean</code>
    * [.isNull](#rtvref.validation.isNull) : <code>Module</code>
        * [.type](#rtvref.validation.isNull.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isNull.default) ⇒ <code>boolean</code>
    * [.isNumber](#rtvref.validation.isNumber) : <code>Module</code>
        * [.type](#rtvref.validation.isNumber.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isNumber.default) ⇒ <code>boolean</code>
    * [.isObject](#rtvref.validation.isObject) : <code>Module</code>
        * [.type](#rtvref.validation.isObject.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isObject.default) ⇒ <code>boolean</code>
    * [.isPlainObject](#rtvref.validation.isPlainObject) : <code>Module</code>
        * [.type](#rtvref.validation.isPlainObject.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isPlainObject.default) ⇒ <code>boolean</code>
    * [.isPrimitive](#rtvref.validation.isPrimitive) : <code>Module</code>
        * [.type](#rtvref.validation.isPrimitive.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isPrimitive.default) ⇒ <code>boolean</code>
    * [.isPromise](#rtvref.validation.isPromise) : <code>Module</code>
        * [.type](#rtvref.validation.isPromise.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isPromise.default) ⇒ <code>boolean</code>
    * [.isRegExp](#rtvref.validation.isRegExp) : <code>Module</code>
        * [.type](#rtvref.validation.isRegExp.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isRegExp.default) ⇒ <code>boolean</code>
    * [.isSafeInt](#rtvref.validation.isSafeInt) : <code>Module</code>
        * [.type](#rtvref.validation.isSafeInt.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isSafeInt.default) ⇒ <code>boolean</code>
    * [.isSet](#rtvref.validation.isSet) : <code>Module</code>
        * [.type](#rtvref.validation.isSet.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isSet.default) ⇒ <code>boolean</code>
    * [.isShape](#rtvref.validation.isShape) : <code>Module</code>
        * [.type](#rtvref.validation.isShape.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isShape.default) ⇒ <code>boolean</code>
    * [.isString](#rtvref.validation.isString) : <code>Module</code>
        * [.type](#rtvref.validation.isString.type) : <code>string</code>
        * [.default(v, [options])](#rtvref.validation.isString.default) ⇒ <code>boolean</code>
    * [.isSymbol](#rtvref.validation.isSymbol) : <code>Module</code>
        * [.type](#rtvref.validation.isSymbol.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isSymbol.default) ⇒ <code>boolean</code>
    * [.isTypeArgs](#rtvref.validation.isTypeArgs) : <code>Module</code>
        * [.type](#rtvref.validation.isTypeArgs.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isTypeArgs.default) ⇒ <code>boolean</code>
    * [.isTypeset](#rtvref.validation.isTypeset) : <code>Module</code>
        * [.type](#rtvref.validation.isTypeset.type) : <code>string</code>
        * [.default(v, [options])](#rtvref.validation.isTypeset.default) ⇒ <code>boolean</code>
    * [.isWeakMap](#rtvref.validation.isWeakMap) : <code>Module</code>
        * [.type](#rtvref.validation.isWeakMap.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isWeakMap.default) ⇒ <code>boolean</code>
    * [.isWeakSet](#rtvref.validation.isWeakSet) : <code>Module</code>
        * [.type](#rtvref.validation.isWeakSet.type) : <code>string</code>
        * [.default(v)](#rtvref.validation.isWeakSet.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.method"></a>

### validation.method(value) ⇒ <code>boolean</code>
<h3>Type Validation Method</h3>

Verifies a value is of a certain [type](#rtvref.types).

**Kind**: static method of [<code>validation</code>](#rtvref.validation)  
**Returns**: <code>boolean</code> - `true` if the value matches the type; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to validate. |

<a name="rtvref.validation.isAny"></a>

### validation.isAny : <code>Module</code>
Validation Module: isAny

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isAny](#rtvref.validation.isAny) : <code>Module</code>
    * [.type](#rtvref.validation.isAny.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isAny.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isAny.type"></a>

#### isAny.type : <code>string</code>
Type: [ANY](#rtvref.types.ANY)

**Kind**: static constant of [<code>isAny</code>](#rtvref.validation.isAny)  
<a name="rtvref.validation.isAny.default"></a>

#### isAny.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [ANY](#rtvref.types.ANY) type.

**Kind**: static method of [<code>isAny</code>](#rtvref.validation.isAny)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isAnyObject"></a>

### validation.isAnyObject : <code>Module</code>
Validation Module: isAnyObject

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isAnyObject](#rtvref.validation.isAnyObject) : <code>Module</code>
    * [.type](#rtvref.validation.isAnyObject.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isAnyObject.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isAnyObject.type"></a>

#### isAnyObject.type : <code>string</code>
Type: [ANY_OBJECT](#rtvref.types.ANY_OBJECT)

**Kind**: static constant of [<code>isAnyObject</code>](#rtvref.validation.isAnyObject)  
<a name="rtvref.validation.isAnyObject.default"></a>

#### isAnyObject.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [ANY_OBJECT](#rtvref.types.ANY_OBJECT) type.

**Kind**: static method of [<code>isAnyObject</code>](#rtvref.validation.isAnyObject)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isArray"></a>

### validation.isArray : <code>Module</code>
Validation Module: isArray

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isArray](#rtvref.validation.isArray) : <code>Module</code>
    * [.type](#rtvref.validation.isArray.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isArray.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isArray.type"></a>

#### isArray.type : <code>string</code>
Type: [ARRAY](#rtvref.types.ARRAY)

**Kind**: static constant of [<code>isArray</code>](#rtvref.validation.isArray)  
<a name="rtvref.validation.isArray.default"></a>

#### isArray.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [ARRAY](#rtvref.types.ARRAY) type.

**Kind**: static method of [<code>isArray</code>](#rtvref.validation.isArray)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isBoolean"></a>

### validation.isBoolean : <code>Module</code>
Validation Module: isBoolean

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isBoolean](#rtvref.validation.isBoolean) : <code>Module</code>
    * [.type](#rtvref.validation.isBoolean.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isBoolean.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isBoolean.type"></a>

#### isBoolean.type : <code>string</code>
Type: [BOOLEAN](#rtvref.types.BOOLEAN)

**Kind**: static constant of [<code>isBoolean</code>](#rtvref.validation.isBoolean)  
<a name="rtvref.validation.isBoolean.default"></a>

#### isBoolean.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [BOOLEAN](#rtvref.types.BOOLEAN) type.

Determines if a value is a boolean literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Boolean(true)`, which is an object that is a boolean.

**Kind**: static method of [<code>isBoolean</code>](#rtvref.validation.isBoolean)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isClassObject"></a>

### validation.isClassObject : <code>Module</code>
Validation Module: isClassObject

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isClassObject](#rtvref.validation.isClassObject) : <code>Module</code>
    * [.type](#rtvref.validation.isClassObject.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isClassObject.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isClassObject.type"></a>

#### isClassObject.type : <code>string</code>
Type: [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

**Kind**: static constant of [<code>isClassObject</code>](#rtvref.validation.isClassObject)  
<a name="rtvref.validation.isClassObject.default"></a>

#### isClassObject.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) type.

**Kind**: static method of [<code>isClassObject</code>](#rtvref.validation.isClassObject)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isCustomValidator"></a>

### validation.isCustomValidator : <code>Module</code>
Validation Module: isCustomValidator

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isCustomValidator](#rtvref.validation.isCustomValidator) : <code>Module</code>
    * [.type](#rtvref.validation.isCustomValidator.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isCustomValidator.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isCustomValidator.type"></a>

#### isCustomValidator.type : <code>string</code>
Type: `undefined`, [custom validator](#rtvref.types.custom_validator) pseudo-type.

**Kind**: static constant of [<code>isCustomValidator</code>](#rtvref.validation.isCustomValidator)  
<a name="rtvref.validation.isCustomValidator.default"></a>

#### isCustomValidator.default(v) ⇒ <code>boolean</code>
Determines if a value is a [custom validator](#rtvref.types.custom_validator).

**Kind**: static method of [<code>isCustomValidator</code>](#rtvref.validation.isCustomValidator)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isDate"></a>

### validation.isDate : <code>Module</code>
Validation Module: isDate

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isDate](#rtvref.validation.isDate) : <code>Module</code>
    * [.type](#rtvref.validation.isDate.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isDate.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isDate.type"></a>

#### isDate.type : <code>string</code>
Type: [DATE](#rtvref.types.DATE)

**Kind**: static constant of [<code>isDate</code>](#rtvref.validation.isDate)  
<a name="rtvref.validation.isDate.default"></a>

#### isDate.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [DATE](#rtvref.types.DATE) type.

**Kind**: static method of [<code>isDate</code>](#rtvref.validation.isDate)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isError"></a>

### validation.isError : <code>Module</code>
Validation Module: isError

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isError](#rtvref.validation.isError) : <code>Module</code>
    * [.type](#rtvref.validation.isError.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isError.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isError.type"></a>

#### isError.type : <code>string</code>
Type: [ERROR](#rtvref.types.ERROR)

**Kind**: static constant of [<code>isError</code>](#rtvref.validation.isError)  
<a name="rtvref.validation.isError.default"></a>

#### isError.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [ERROR](#rtvref.types.ERROR) type.

**Kind**: static method of [<code>isError</code>](#rtvref.validation.isError)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isFinite"></a>

### validation.isFinite : <code>Module</code>
Validation Module: isFinite

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isFinite](#rtvref.validation.isFinite) : <code>Module</code>
    * [.type](#rtvref.validation.isFinite.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isFinite.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isFinite.type"></a>

#### isFinite.type : <code>string</code>
Type: [FINITE](#rtvref.types.FINITE)

**Kind**: static constant of [<code>isFinite</code>](#rtvref.validation.isFinite)  
<a name="rtvref.validation.isFinite.default"></a>

#### isFinite.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [FINITE](#rtvref.types.FINITE) type.

Determines if a value is a finite number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>isFinite</code>](#rtvref.validation.isFinite)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isFloat"></a>

### validation.isFloat : <code>Module</code>
Validation Module: isFloat

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isFloat](#rtvref.validation.isFloat) : <code>Module</code>
    * [.type](#rtvref.validation.isFloat.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isFloat.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isFloat.type"></a>

#### isFloat.type : <code>string</code>
Type: [FLOAT](#rtvref.types.FLOAT)

**Kind**: static constant of [<code>isFloat</code>](#rtvref.validation.isFloat)  
<a name="rtvref.validation.isFloat.default"></a>

#### isFloat.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [FLOAT](#rtvref.types.FLOAT) type.

Determines if a value is a floating point literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1.5)`, which is an object that is a number.

**Kind**: static method of [<code>isFloat</code>](#rtvref.validation.isFloat)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isFunction"></a>

### validation.isFunction : <code>Module</code>
Validation Module: isFunction

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isFunction](#rtvref.validation.isFunction) : <code>Module</code>
    * [.type](#rtvref.validation.isFunction.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isFunction.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isFunction.type"></a>

#### isFunction.type : <code>string</code>
Type: [FUNCTION](#rtvref.types.FUNCTION)

**Kind**: static constant of [<code>isFunction</code>](#rtvref.validation.isFunction)  
<a name="rtvref.validation.isFunction.default"></a>

#### isFunction.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [FUNCTION](#rtvref.types.FUNCTION) type.

**Kind**: static method of [<code>isFunction</code>](#rtvref.validation.isFunction)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isHashMap"></a>

### validation.isHashMap : <code>Module</code>
Validation Module: isHashMap

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isHashMap](#rtvref.validation.isHashMap) : <code>Module</code>
    * [.type](#rtvref.validation.isHashMap.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isHashMap.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isHashMap.type"></a>

#### isHashMap.type : <code>string</code>
Type: [HASH_MAP](#rtvref.types.HASH_MAP)

**Kind**: static constant of [<code>isHashMap</code>](#rtvref.validation.isHashMap)  
<a name="rtvref.validation.isHashMap.default"></a>

#### isHashMap.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [HASH_MAP](#rtvref.types.HASH_MAP) type.

**Kind**: static method of [<code>isHashMap</code>](#rtvref.validation.isHashMap)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isInt"></a>

### validation.isInt : <code>Module</code>
Validation Module: isInt

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isInt](#rtvref.validation.isInt) : <code>Module</code>
    * [.type](#rtvref.validation.isInt.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isInt.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isInt.type"></a>

#### isInt.type : <code>string</code>
Type: [INT](#rtvref.types.INT)

**Kind**: static constant of [<code>isInt</code>](#rtvref.validation.isInt)  
<a name="rtvref.validation.isInt.default"></a>

#### isInt.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [INT](#rtvref.types.INT) type.

Determines if a value is an integer literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>isInt</code>](#rtvref.validation.isInt)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isJson"></a>

### validation.isJson : <code>Module</code>
Validation Module: isJson

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isJson](#rtvref.validation.isJson) : <code>Module</code>
    * [.type](#rtvref.validation.isJson.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isJson.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isJson.type"></a>

#### isJson.type : <code>string</code>
Type: [JSON](#rtvref.types.JSON)

**Kind**: static constant of [<code>isJson</code>](#rtvref.validation.isJson)  
<a name="rtvref.validation.isJson.default"></a>

#### isJson.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [JSON](#rtvref.types.JSON) type.

**Kind**: static method of [<code>isJson</code>](#rtvref.validation.isJson)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isMap"></a>

### validation.isMap : <code>Module</code>
Validation Module: isMap

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isMap](#rtvref.validation.isMap) : <code>Module</code>
    * [.type](#rtvref.validation.isMap.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isMap.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isMap.type"></a>

#### isMap.type : <code>string</code>
Type: [MAP](#rtvref.types.MAP)

**Kind**: static constant of [<code>isMap</code>](#rtvref.validation.isMap)  
<a name="rtvref.validation.isMap.default"></a>

#### isMap.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [MAP](#rtvref.types.MAP) type.

**Kind**: static method of [<code>isMap</code>](#rtvref.validation.isMap)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isNull"></a>

### validation.isNull : <code>Module</code>
Validation Module: isNull

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isNull](#rtvref.validation.isNull) : <code>Module</code>
    * [.type](#rtvref.validation.isNull.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isNull.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isNull.type"></a>

#### isNull.type : <code>string</code>
Type: [NULL](#rtvref.types.NULL)

**Kind**: static constant of [<code>isNull</code>](#rtvref.validation.isNull)  
<a name="rtvref.validation.isNull.default"></a>

#### isNull.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [NULL](#rtvref.types.NULL) type.

**Kind**: static method of [<code>isNull</code>](#rtvref.validation.isNull)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isNumber"></a>

### validation.isNumber : <code>Module</code>
Validation Module: isNumber

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isNumber](#rtvref.validation.isNumber) : <code>Module</code>
    * [.type](#rtvref.validation.isNumber.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isNumber.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isNumber.type"></a>

#### isNumber.type : <code>string</code>
Type: [NUMBER](#rtvref.types.NUMBER)

**Kind**: static constant of [<code>isNumber</code>](#rtvref.validation.isNumber)  
<a name="rtvref.validation.isNumber.default"></a>

#### isNumber.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [NUMBER](#rtvref.types.NUMBER) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number, neither does it
 validate `NaN`.

**Kind**: static method of [<code>isNumber</code>](#rtvref.validation.isNumber)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isObject"></a>

### validation.isObject : <code>Module</code>
Validation Module: isObject

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isObject](#rtvref.validation.isObject) : <code>Module</code>
    * [.type](#rtvref.validation.isObject.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isObject.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isObject.type"></a>

#### isObject.type : <code>string</code>
Type: [OBJECT](#rtvref.types.OBJECT)

**Kind**: static constant of [<code>isObject</code>](#rtvref.validation.isObject)  
<a name="rtvref.validation.isObject.default"></a>

#### isObject.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [OBJECT](#rtvref.types.OBJECT) type.

**Kind**: static method of [<code>isObject</code>](#rtvref.validation.isObject)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isPlainObject"></a>

### validation.isPlainObject : <code>Module</code>
Validation Module: isPlainObject

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isPlainObject](#rtvref.validation.isPlainObject) : <code>Module</code>
    * [.type](#rtvref.validation.isPlainObject.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isPlainObject.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isPlainObject.type"></a>

#### isPlainObject.type : <code>string</code>
Type: [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)

**Kind**: static constant of [<code>isPlainObject</code>](#rtvref.validation.isPlainObject)  
<a name="rtvref.validation.isPlainObject.default"></a>

#### isPlainObject.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) type.

**Kind**: static method of [<code>isPlainObject</code>](#rtvref.validation.isPlainObject)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isPrimitive"></a>

### validation.isPrimitive : <code>Module</code>
Validation Module: isPrimitive

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isPrimitive](#rtvref.validation.isPrimitive) : <code>Module</code>
    * [.type](#rtvref.validation.isPrimitive.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isPrimitive.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isPrimitive.type"></a>

#### isPrimitive.type : <code>string</code>
Type: `undefined`, [primitive](#rtvref.types.primitives) pseudo-type.

**Kind**: static constant of [<code>isPrimitive</code>](#rtvref.validation.isPrimitive)  
<a name="rtvref.validation.isPrimitive.default"></a>

#### isPrimitive.default(v) ⇒ <code>boolean</code>
Determines if a value is a JavaScript [primitive](#rtvref.types.primitives).

**Kind**: static method of [<code>isPrimitive</code>](#rtvref.validation.isPrimitive)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isPromise"></a>

### validation.isPromise : <code>Module</code>
Validation Module: isPromise

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isPromise](#rtvref.validation.isPromise) : <code>Module</code>
    * [.type](#rtvref.validation.isPromise.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isPromise.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isPromise.type"></a>

#### isPromise.type : <code>string</code>
Type: [PROMISE](#rtvref.types.PROMISE)

**Kind**: static constant of [<code>isPromise</code>](#rtvref.validation.isPromise)  
<a name="rtvref.validation.isPromise.default"></a>

#### isPromise.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [PROMISE](#rtvref.types.PROMISE) type.

**Kind**: static method of [<code>isPromise</code>](#rtvref.validation.isPromise)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isRegExp"></a>

### validation.isRegExp : <code>Module</code>
Validation Module: isRegExp

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isRegExp](#rtvref.validation.isRegExp) : <code>Module</code>
    * [.type](#rtvref.validation.isRegExp.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isRegExp.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isRegExp.type"></a>

#### isRegExp.type : <code>string</code>
Type: [REGEXP](#rtvref.types.REGEXP)

**Kind**: static constant of [<code>isRegExp</code>](#rtvref.validation.isRegExp)  
<a name="rtvref.validation.isRegExp.default"></a>

#### isRegExp.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [REGEXP](#rtvref.types.REGEXP) type.

**Kind**: static method of [<code>isRegExp</code>](#rtvref.validation.isRegExp)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isSafeInt"></a>

### validation.isSafeInt : <code>Module</code>
Validation Module: isSafeInt

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isSafeInt](#rtvref.validation.isSafeInt) : <code>Module</code>
    * [.type](#rtvref.validation.isSafeInt.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isSafeInt.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isSafeInt.type"></a>

#### isSafeInt.type : <code>string</code>
Type: [SAFE_INT](#rtvref.types.SAFE_INT)

**Kind**: static constant of [<code>isSafeInt</code>](#rtvref.validation.isSafeInt)  
<a name="rtvref.validation.isSafeInt.default"></a>

#### isSafeInt.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [SAFE_INT](#rtvref.types.SAFE_INT) type.

Determines if a value is an integer literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>isSafeInt</code>](#rtvref.validation.isSafeInt)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isSet"></a>

### validation.isSet : <code>Module</code>
Validation Module: isSet

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isSet](#rtvref.validation.isSet) : <code>Module</code>
    * [.type](#rtvref.validation.isSet.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isSet.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isSet.type"></a>

#### isSet.type : <code>string</code>
Type: [SET](#rtvref.types.SET)

**Kind**: static constant of [<code>isSet</code>](#rtvref.validation.isSet)  
<a name="rtvref.validation.isSet.default"></a>

#### isSet.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [SET](#rtvref.types.SET) type.

**Kind**: static method of [<code>isSet</code>](#rtvref.validation.isSet)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isShape"></a>

### validation.isShape : <code>Module</code>
Validation Module: isShape

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isShape](#rtvref.validation.isShape) : <code>Module</code>
    * [.type](#rtvref.validation.isShape.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isShape.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isShape.type"></a>

#### isShape.type : <code>string</code>
Type: `undefined`, [shape](#rtvref.types.shape_descriptor) pseudo-type.

**Kind**: static constant of [<code>isShape</code>](#rtvref.validation.isShape)  
<a name="rtvref.validation.isShape.default"></a>

#### isShape.default(v) ⇒ <code>boolean</code>
Determines if a value is a [shape](#rtvref.types.shape_descriptor).

**Kind**: static method of [<code>isShape</code>](#rtvref.validation.isShape)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isString"></a>

### validation.isString : <code>Module</code>
Validation Module: isString

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isString](#rtvref.validation.isString) : <code>Module</code>
    * [.type](#rtvref.validation.isString.type) : <code>string</code>
    * [.default(v, [options])](#rtvref.validation.isString.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isString.type"></a>

#### isString.type : <code>string</code>
Type: [STRING](#rtvref.types.STRING)

**Kind**: static constant of [<code>isString</code>](#rtvref.validation.isString)  
<a name="rtvref.validation.isString.default"></a>

#### isString.default(v, [options]) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [STRING](#rtvref.types.STRING) type.

Determines if a value is a string literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)), __including an empty string__.
 It does not validate `new String('value')`, which is an object that is a
 string.

**Kind**: static method of [<code>isString</code>](#rtvref.validation.isString)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| v | <code>\*</code> |  | Value to validate. |
| [options] | <code>Object</code> |  | Validation options. |
| [options.allowEmpty] | <code>boolean</code> | <code>false</code> | If truthy, empty strings are  permitted. |

<a name="rtvref.validation.isSymbol"></a>

### validation.isSymbol : <code>Module</code>
Validation Module: isSymbol

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isSymbol](#rtvref.validation.isSymbol) : <code>Module</code>
    * [.type](#rtvref.validation.isSymbol.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isSymbol.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isSymbol.type"></a>

#### isSymbol.type : <code>string</code>
Type: [SYMBOL](#rtvref.types.SYMBOL)

**Kind**: static constant of [<code>isSymbol</code>](#rtvref.validation.isSymbol)  
<a name="rtvref.validation.isSymbol.default"></a>

#### isSymbol.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [SYMBOL](#rtvref.types.SYMBOL) type.

**Kind**: static method of [<code>isSymbol</code>](#rtvref.validation.isSymbol)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isTypeArgs"></a>

### validation.isTypeArgs : <code>Module</code>
Validation Module: isTypeArgs

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isTypeArgs](#rtvref.validation.isTypeArgs) : <code>Module</code>
    * [.type](#rtvref.validation.isTypeArgs.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isTypeArgs.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isTypeArgs.type"></a>

#### isTypeArgs.type : <code>string</code>
Type: `undefined`, [type arguments](#rtvref.types.type_arguments) pseudo-type.

**Kind**: static constant of [<code>isTypeArgs</code>](#rtvref.validation.isTypeArgs)  
<a name="rtvref.validation.isTypeArgs.default"></a>

#### isTypeArgs.default(v) ⇒ <code>boolean</code>
Determines if a value is a [type arguments](#rtvref.types.type_arguments)
 object.

**Kind**: static method of [<code>isTypeArgs</code>](#rtvref.validation.isTypeArgs)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isTypeset"></a>

### validation.isTypeset : <code>Module</code>
Validation Module: isTypeset

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isTypeset](#rtvref.validation.isTypeset) : <code>Module</code>
    * [.type](#rtvref.validation.isTypeset.type) : <code>string</code>
    * [.default(v, [options])](#rtvref.validation.isTypeset.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isTypeset.type"></a>

#### isTypeset.type : <code>string</code>
Type: `undefined`, [typeset](#rtvref.types.typeset) pseudo-type.

**Kind**: static constant of [<code>isTypeset</code>](#rtvref.validation.isTypeset)  
<a name="rtvref.validation.isTypeset.default"></a>

#### isTypeset.default(v, [options]) ⇒ <code>boolean</code>
Determines if a value is a typeset.

**Kind**: static method of [<code>isTypeset</code>](#rtvref.validation.isTypeset)  
**Returns**: <code>boolean</code> - `true` if it is; `false` otherwise.  
**See**: [typeset](#rtvref.types.typeset)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| v | <code>\*</code> |  | Value to validate. |
| [options] | <code>Object</code> |  | Validation options. |
| [options.deep] | <code>boolean</code> | <code>false</code> | If truthy, deeply-validates any nested  typesets. Note that typesets in nested shapes are also deeply-validated. |
| [options.fullyQualified] | <code>boolean</code> | <code>false</code> | If truthy, the typeset must be  fully-qualified. |
| [options.failure] | <code>string</code> \| <code>undefined</code> |  | (Output property) If an options  object is specified, this property will be added and set to a failure message  IIF the validation fails. |

<a name="rtvref.validation.isWeakMap"></a>

### validation.isWeakMap : <code>Module</code>
Validation Module: isWeakMap

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isWeakMap](#rtvref.validation.isWeakMap) : <code>Module</code>
    * [.type](#rtvref.validation.isWeakMap.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isWeakMap.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isWeakMap.type"></a>

#### isWeakMap.type : <code>string</code>
Type: [WEAK_MAP](#rtvref.types.WEAK_MAP)

**Kind**: static constant of [<code>isWeakMap</code>](#rtvref.validation.isWeakMap)  
<a name="rtvref.validation.isWeakMap.default"></a>

#### isWeakMap.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [WEAK_MAP](#rtvref.types.WEAK_MAP) type.

**Kind**: static method of [<code>isWeakMap</code>](#rtvref.validation.isWeakMap)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validation.isWeakSet"></a>

### validation.isWeakSet : <code>Module</code>
Validation Module: isWeakSet

**Kind**: static typedef of [<code>validation</code>](#rtvref.validation)  

* [.isWeakSet](#rtvref.validation.isWeakSet) : <code>Module</code>
    * [.type](#rtvref.validation.isWeakSet.type) : <code>string</code>
    * [.default(v)](#rtvref.validation.isWeakSet.default) ⇒ <code>boolean</code>

<a name="rtvref.validation.isWeakSet.type"></a>

#### isWeakSet.type : <code>string</code>
Type: [WEAK_SET](#rtvref.types.WEAK_SET)

**Kind**: static constant of [<code>isWeakSet</code>](#rtvref.validation.isWeakSet)  
<a name="rtvref.validation.isWeakSet.default"></a>

#### isWeakSet.default(v) ⇒ <code>boolean</code>
[Validation](#rtvref.validation.method) for the
 [WEAK_SET](#rtvref.types.WEAK_SET) type.

**Kind**: static method of [<code>isWeakSet</code>](#rtvref.validation.isWeakSet)  
**Returns**: <code>boolean</code> - `true` if validated; `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |

<a name="rtvref.validator"></a>

## rtvref.validator : <code>object</code>
<h3>RTV.js Type Validators</h3>

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
    * [.valAny](#rtvref.validator.valAny) : <code>Module</code>
        * [.type](#rtvref.validator.valAny.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valAny.config)
        * [.default(v, [q])](#rtvref.validator.valAny.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valAnyObject](#rtvref.validator.valAnyObject) : <code>Module</code>
        * [.type](#rtvref.validator.valAnyObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valAnyObject.config)
        * [.default(v, [q], [args])](#rtvref.validator.valAnyObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valArray](#rtvref.validator.valArray) : <code>Module</code>
        * [.type](#rtvref.validator.valArray.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valArray.config)
        * [.default(v, [q], [args])](#rtvref.validator.valArray.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valBoolean](#rtvref.validator.valBoolean) : <code>Module</code>
        * [.type](#rtvref.validator.valBoolean.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valBoolean.config)
        * [.default(v, [q])](#rtvref.validator.valBoolean.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valClassObject](#rtvref.validator.valClassObject) : <code>Module</code>
        * [.type](#rtvref.validator.valClassObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valClassObject.config)
        * [.default(v, [q], [args])](#rtvref.validator.valClassObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valDate](#rtvref.validator.valDate) : <code>Module</code>
        * [.type](#rtvref.validator.valDate.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valDate.config)
        * [.default(v, [q])](#rtvref.validator.valDate.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valError](#rtvref.validator.valError) : <code>Module</code>
        * [.type](#rtvref.validator.valError.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valError.config)
        * [.default(v, [q])](#rtvref.validator.valError.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valFinite](#rtvref.validator.valFinite) : <code>Module</code>
        * [.type](#rtvref.validator.valFinite.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valFinite.config)
        * [.default(v, [q], [args])](#rtvref.validator.valFinite.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valFloat](#rtvref.validator.valFloat) : <code>Module</code>
        * [.type](#rtvref.validator.valFloat.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valFloat.config)
        * [.default(v, [q], [args])](#rtvref.validator.valFloat.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valFunction](#rtvref.validator.valFunction) : <code>Module</code>
        * [.type](#rtvref.validator.valFunction.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valFunction.config)
        * [.default(v, [q])](#rtvref.validator.valFunction.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valHashMap](#rtvref.validator.valHashMap) : <code>Module</code>
        * [.type](#rtvref.validator.valHashMap.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valHashMap.config)
        * [.default(v, [q], [args])](#rtvref.validator.valHashMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valInt](#rtvref.validator.valInt) : <code>Module</code>
        * [.type](#rtvref.validator.valInt.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valInt.config)
        * [.default(v, [q], [args])](#rtvref.validator.valInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valJson](#rtvref.validator.valJson) : <code>Module</code>
        * [.type](#rtvref.validator.valJson.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valJson.config)
        * [.default(v, [q])](#rtvref.validator.valJson.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valMap](#rtvref.validator.valMap) : <code>Module</code>
        * [.type](#rtvref.validator.valMap.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valMap.config)
        * [.default(v, [q], [args])](#rtvref.validator.valMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valNull](#rtvref.validator.valNull) : <code>Module</code>
        * [.type](#rtvref.validator.valNull.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valNull.config)
        * [.default(v, [q])](#rtvref.validator.valNull.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valNumber](#rtvref.validator.valNumber) : <code>Module</code>
        * [.type](#rtvref.validator.valNumber.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valNumber.config)
        * [.default(v, [q], [args])](#rtvref.validator.valNumber.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valObject](#rtvref.validator.valObject) : <code>Module</code>
        * [.type](#rtvref.validator.valObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valObject.config)
        * [.default(v, [q], [args])](#rtvref.validator.valObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valPlainObject](#rtvref.validator.valPlainObject) : <code>Module</code>
        * [.type](#rtvref.validator.valPlainObject.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valPlainObject.config)
        * [.default(v, [q], [args])](#rtvref.validator.valPlainObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valPromise](#rtvref.validator.valPromise) : <code>Module</code>
        * [.type](#rtvref.validator.valPromise.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valPromise.config)
        * [.default(v, [q])](#rtvref.validator.valPromise.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valRegExp](#rtvref.validator.valRegExp) : <code>Module</code>
        * [.type](#rtvref.validator.valRegExp.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valRegExp.config)
        * [.default(v, [q])](#rtvref.validator.valRegExp.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valSafeInt](#rtvref.validator.valSafeInt) : <code>Module</code>
        * [.type](#rtvref.validator.valSafeInt.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valSafeInt.config)
        * [.default(v, [q], [args])](#rtvref.validator.valSafeInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valSet](#rtvref.validator.valSet) : <code>Module</code>
        * [.type](#rtvref.validator.valSet.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valSet.config)
        * [.default(v, [q], [args])](#rtvref.validator.valSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valString](#rtvref.validator.valString) : <code>Module</code>
        * [.type](#rtvref.validator.valString.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valString.config)
        * [.default(v, [q], [args])](#rtvref.validator.valString.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valSymbol](#rtvref.validator.valSymbol) : <code>Module</code>
        * [.type](#rtvref.validator.valSymbol.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valSymbol.config)
        * [.default(v, [q], [args])](#rtvref.validator.valSymbol.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valWeakMap](#rtvref.validator.valWeakMap) : <code>Module</code>
        * [.type](#rtvref.validator.valWeakMap.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valWeakMap.config)
        * [.default(v, [q])](#rtvref.validator.valWeakMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.valWeakSet](#rtvref.validator.valWeakSet) : <code>Module</code>
        * [.type](#rtvref.validator.valWeakSet.type) : <code>string</code>
        * [.config(settings)](#rtvref.validator.valWeakSet.config)
        * [.default(v, [q])](#rtvref.validator.valWeakSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
    * [.validator_config_settings](#rtvref.validator.validator_config_settings) : <code>Object</code>

<a name="rtvref.validator.type_validator"></a>

### validator.type_validator(value, [qualifier], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
<h3>Type Validator Function</h3>

NOTE: A validator must always give __precedence__ to
 [qualifier rules](#rtvref.types.qualifier_rules) for the type it's
 validating, over any arguments specified. For example,

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

<a name="rtvref.validator.validator_config"></a>

### validator.validator_config(settings)
<h3>Type Validator Configuration Function</h3>

This function is called to provide the
 [type validator](#rtvref.validator.type_validator) with access to
 internal utilities.

**Kind**: static method of [<code>validator</code>](#rtvref.validator)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valAny"></a>

### validator.valAny : <code>Module</code>
Validator Module: valAny

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valAny](#rtvref.validator.valAny) : <code>Module</code>
    * [.type](#rtvref.validator.valAny.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valAny.config)
    * [.default(v, [q])](#rtvref.validator.valAny.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valAny.type"></a>

#### valAny.type : <code>string</code>
Type: [ANY](#rtvref.types.ANY)

**Kind**: static constant of [<code>valAny</code>](#rtvref.validator.valAny)  
<a name="rtvref.validator.valAny.config"></a>

#### valAny.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valAny</code>](#rtvref.validator.valAny)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valAny.default"></a>

#### valAny.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [ANY](#rtvref.types.ANY) type.

**Kind**: static method of [<code>valAny</code>](#rtvref.validator.valAny)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valAnyObject"></a>

### validator.valAnyObject : <code>Module</code>
Validator Module: valAnyObject

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valAnyObject](#rtvref.validator.valAnyObject) : <code>Module</code>
    * [.type](#rtvref.validator.valAnyObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valAnyObject.config)
    * [.default(v, [q], [args])](#rtvref.validator.valAnyObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valAnyObject.type"></a>

#### valAnyObject.type : <code>string</code>
Type: [ANY_OBJECT](#rtvref.types.ANY_OBJECT)

**Kind**: static constant of [<code>valAnyObject</code>](#rtvref.validator.valAnyObject)  
<a name="rtvref.validator.valAnyObject.config"></a>

#### valAnyObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valAnyObject</code>](#rtvref.validator.valAnyObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valAnyObject.default"></a>

#### valAnyObject.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [ANY_OBJECT](#rtvref.types.ANY_OBJECT) type.

**Kind**: static method of [<code>valAnyObject</code>](#rtvref.validator.valAnyObject)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valArray"></a>

### validator.valArray : <code>Module</code>
Validator Module: valArray

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valArray](#rtvref.validator.valArray) : <code>Module</code>
    * [.type](#rtvref.validator.valArray.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valArray.config)
    * [.default(v, [q], [args])](#rtvref.validator.valArray.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valArray.type"></a>

#### valArray.type : <code>string</code>
Type: [ARRAY](#rtvref.types.ARRAY)

**Kind**: static constant of [<code>valArray</code>](#rtvref.validator.valArray)  
<a name="rtvref.validator.valArray.config"></a>

#### valArray.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valArray</code>](#rtvref.validator.valArray)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valArray.default"></a>

#### valArray.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [ARRAY](#rtvref.types.ARRAY) type.

**Kind**: static method of [<code>valArray</code>](#rtvref.validator.valArray)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>ARRAY_args</code>](#rtvref.types.ARRAY_args) | Type arguments. |

<a name="rtvref.validator.valBoolean"></a>

### validator.valBoolean : <code>Module</code>
Validator Module: valBoolean

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valBoolean](#rtvref.validator.valBoolean) : <code>Module</code>
    * [.type](#rtvref.validator.valBoolean.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valBoolean.config)
    * [.default(v, [q])](#rtvref.validator.valBoolean.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valBoolean.type"></a>

#### valBoolean.type : <code>string</code>
Type: [BOOLEAN](#rtvref.types.BOOLEAN)

**Kind**: static constant of [<code>valBoolean</code>](#rtvref.validator.valBoolean)  
<a name="rtvref.validator.valBoolean.config"></a>

#### valBoolean.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valBoolean</code>](#rtvref.validator.valBoolean)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valBoolean.default"></a>

#### valBoolean.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [BOOLEAN](#rtvref.types.BOOLEAN) type.

Determines if a value is a boolean literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Boolean(true)`, which is an object that is a boolean.

**Kind**: static method of [<code>valBoolean</code>](#rtvref.validator.valBoolean)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valClassObject"></a>

### validator.valClassObject : <code>Module</code>
Validator Module: valClassObject

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valClassObject](#rtvref.validator.valClassObject) : <code>Module</code>
    * [.type](#rtvref.validator.valClassObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valClassObject.config)
    * [.default(v, [q], [args])](#rtvref.validator.valClassObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valClassObject.type"></a>

#### valClassObject.type : <code>string</code>
Type: [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT)

**Kind**: static constant of [<code>valClassObject</code>](#rtvref.validator.valClassObject)  
<a name="rtvref.validator.valClassObject.config"></a>

#### valClassObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valClassObject</code>](#rtvref.validator.valClassObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valClassObject.default"></a>

#### valClassObject.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [CLASS_OBJECT](#rtvref.types.CLASS_OBJECT) type.

**Kind**: static method of [<code>valClassObject</code>](#rtvref.validator.valClassObject)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valDate"></a>

### validator.valDate : <code>Module</code>
Validator Module: valDate

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valDate](#rtvref.validator.valDate) : <code>Module</code>
    * [.type](#rtvref.validator.valDate.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valDate.config)
    * [.default(v, [q])](#rtvref.validator.valDate.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valDate.type"></a>

#### valDate.type : <code>string</code>
Type: [DATE](#rtvref.types.DATE)

**Kind**: static constant of [<code>valDate</code>](#rtvref.validator.valDate)  
<a name="rtvref.validator.valDate.config"></a>

#### valDate.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valDate</code>](#rtvref.validator.valDate)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valDate.default"></a>

#### valDate.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [DATE](#rtvref.types.DATE) type.

**Kind**: static method of [<code>valDate</code>](#rtvref.validator.valDate)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valError"></a>

### validator.valError : <code>Module</code>
Validator Module: valError

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valError](#rtvref.validator.valError) : <code>Module</code>
    * [.type](#rtvref.validator.valError.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valError.config)
    * [.default(v, [q])](#rtvref.validator.valError.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valError.type"></a>

#### valError.type : <code>string</code>
Type: [ERROR](#rtvref.types.ERROR)

**Kind**: static constant of [<code>valError</code>](#rtvref.validator.valError)  
<a name="rtvref.validator.valError.config"></a>

#### valError.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valError</code>](#rtvref.validator.valError)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valError.default"></a>

#### valError.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [ERROR](#rtvref.types.ERROR) type.

**Kind**: static method of [<code>valError</code>](#rtvref.validator.valError)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valFinite"></a>

### validator.valFinite : <code>Module</code>
Validator Module: valFinite

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valFinite](#rtvref.validator.valFinite) : <code>Module</code>
    * [.type](#rtvref.validator.valFinite.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valFinite.config)
    * [.default(v, [q], [args])](#rtvref.validator.valFinite.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valFinite.type"></a>

#### valFinite.type : <code>string</code>
Type: [FINITE](#rtvref.types.FINITE)

**Kind**: static constant of [<code>valFinite</code>](#rtvref.validator.valFinite)  
<a name="rtvref.validator.valFinite.config"></a>

#### valFinite.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valFinite</code>](#rtvref.validator.valFinite)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valFinite.default"></a>

#### valFinite.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [FINITE](#rtvref.types.FINITE) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>valFinite</code>](#rtvref.validator.valFinite)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valFloat"></a>

### validator.valFloat : <code>Module</code>
Validator Module: valFloat

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valFloat](#rtvref.validator.valFloat) : <code>Module</code>
    * [.type](#rtvref.validator.valFloat.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valFloat.config)
    * [.default(v, [q], [args])](#rtvref.validator.valFloat.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valFloat.type"></a>

#### valFloat.type : <code>string</code>
Type: [FLOAT](#rtvref.types.FLOAT)

**Kind**: static constant of [<code>valFloat</code>](#rtvref.validator.valFloat)  
<a name="rtvref.validator.valFloat.config"></a>

#### valFloat.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valFloat</code>](#rtvref.validator.valFloat)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valFloat.default"></a>

#### valFloat.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [FLOAT](#rtvref.types.FLOAT) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1.5)`, which is an object that is a number.

**Kind**: static method of [<code>valFloat</code>](#rtvref.validator.valFloat)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valFunction"></a>

### validator.valFunction : <code>Module</code>
Validator Module: valFunction

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valFunction](#rtvref.validator.valFunction) : <code>Module</code>
    * [.type](#rtvref.validator.valFunction.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valFunction.config)
    * [.default(v, [q])](#rtvref.validator.valFunction.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valFunction.type"></a>

#### valFunction.type : <code>string</code>
Type: [FUNCTION](#rtvref.types.FUNCTION)

**Kind**: static constant of [<code>valFunction</code>](#rtvref.validator.valFunction)  
<a name="rtvref.validator.valFunction.config"></a>

#### valFunction.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valFunction</code>](#rtvref.validator.valFunction)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valFunction.default"></a>

#### valFunction.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [FUNCTION](#rtvref.types.FUNCTION) type.

**Kind**: static method of [<code>valFunction</code>](#rtvref.validator.valFunction)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valHashMap"></a>

### validator.valHashMap : <code>Module</code>
Validator Module: valHashMap

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valHashMap](#rtvref.validator.valHashMap) : <code>Module</code>
    * [.type](#rtvref.validator.valHashMap.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valHashMap.config)
    * [.default(v, [q], [args])](#rtvref.validator.valHashMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valHashMap.type"></a>

#### valHashMap.type : <code>string</code>
Type: [HASH_MAP](#rtvref.types.HASH_MAP)

**Kind**: static constant of [<code>valHashMap</code>](#rtvref.validator.valHashMap)  
<a name="rtvref.validator.valHashMap.config"></a>

#### valHashMap.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valHashMap</code>](#rtvref.validator.valHashMap)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valHashMap.default"></a>

#### valHashMap.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [HASH_MAP](#rtvref.types.HASH_MAP) type.

**Kind**: static method of [<code>valHashMap</code>](#rtvref.validator.valHashMap)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>collection_args</code>](#rtvref.types.collection_args) | Type arguments. |

<a name="rtvref.validator.valInt"></a>

### validator.valInt : <code>Module</code>
Validator Module: valInt

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valInt](#rtvref.validator.valInt) : <code>Module</code>
    * [.type](#rtvref.validator.valInt.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valInt.config)
    * [.default(v, [q], [args])](#rtvref.validator.valInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valInt.type"></a>

#### valInt.type : <code>string</code>
Type: [INT](#rtvref.types.INT)

**Kind**: static constant of [<code>valInt</code>](#rtvref.validator.valInt)  
<a name="rtvref.validator.valInt.config"></a>

#### valInt.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valInt</code>](#rtvref.validator.valInt)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valInt.default"></a>

#### valInt.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [INT](#rtvref.types.INT) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>valInt</code>](#rtvref.validator.valInt)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valJson"></a>

### validator.valJson : <code>Module</code>
Validator Module: valJson

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valJson](#rtvref.validator.valJson) : <code>Module</code>
    * [.type](#rtvref.validator.valJson.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valJson.config)
    * [.default(v, [q])](#rtvref.validator.valJson.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valJson.type"></a>

#### valJson.type : <code>string</code>
Type: [JSON](#rtvref.types.JSON)

**Kind**: static constant of [<code>valJson</code>](#rtvref.validator.valJson)  
<a name="rtvref.validator.valJson.config"></a>

#### valJson.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valJson</code>](#rtvref.validator.valJson)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valJson.default"></a>

#### valJson.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [JSON](#rtvref.types.JSON) type.

**Kind**: static method of [<code>valJson</code>](#rtvref.validator.valJson)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valMap"></a>

### validator.valMap : <code>Module</code>
Validator Module: valMap

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valMap](#rtvref.validator.valMap) : <code>Module</code>
    * [.type](#rtvref.validator.valMap.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valMap.config)
    * [.default(v, [q], [args])](#rtvref.validator.valMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valMap.type"></a>

#### valMap.type : <code>string</code>
Type: [MAP](#rtvref.types.MAP)

**Kind**: static constant of [<code>valMap</code>](#rtvref.validator.valMap)  
<a name="rtvref.validator.valMap.config"></a>

#### valMap.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valMap</code>](#rtvref.validator.valMap)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valMap.default"></a>

#### valMap.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [MAP](#rtvref.types.MAP) type.

**Kind**: static method of [<code>valMap</code>](#rtvref.validator.valMap)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>collection_args</code>](#rtvref.types.collection_args) | Type arguments. |

<a name="rtvref.validator.valNull"></a>

### validator.valNull : <code>Module</code>
Validator Module: valNull

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valNull](#rtvref.validator.valNull) : <code>Module</code>
    * [.type](#rtvref.validator.valNull.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valNull.config)
    * [.default(v, [q])](#rtvref.validator.valNull.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valNull.type"></a>

#### valNull.type : <code>string</code>
Type: [NULL](#rtvref.types.NULL)

**Kind**: static constant of [<code>valNull</code>](#rtvref.validator.valNull)  
<a name="rtvref.validator.valNull.config"></a>

#### valNull.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valNull</code>](#rtvref.validator.valNull)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valNull.default"></a>

#### valNull.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [NULL](#rtvref.types.NULL) type.

**Kind**: static method of [<code>valNull</code>](#rtvref.validator.valNull)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valNumber"></a>

### validator.valNumber : <code>Module</code>
Validator Module: valNumber

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valNumber](#rtvref.validator.valNumber) : <code>Module</code>
    * [.type](#rtvref.validator.valNumber.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valNumber.config)
    * [.default(v, [q], [args])](#rtvref.validator.valNumber.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valNumber.type"></a>

#### valNumber.type : <code>string</code>
Type: [NUMBER](#rtvref.types.NUMBER)

**Kind**: static constant of [<code>valNumber</code>](#rtvref.validator.valNumber)  
<a name="rtvref.validator.valNumber.config"></a>

#### valNumber.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valNumber</code>](#rtvref.validator.valNumber)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valNumber.default"></a>

#### valNumber.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [NUMBER](#rtvref.types.NUMBER) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>valNumber</code>](#rtvref.validator.valNumber)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valObject"></a>

### validator.valObject : <code>Module</code>
Validator Module: valObject

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valObject](#rtvref.validator.valObject) : <code>Module</code>
    * [.type](#rtvref.validator.valObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valObject.config)
    * [.default(v, [q], [args])](#rtvref.validator.valObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valObject.type"></a>

#### valObject.type : <code>string</code>
Type: [OBJECT](#rtvref.types.OBJECT)

**Kind**: static constant of [<code>valObject</code>](#rtvref.validator.valObject)  
<a name="rtvref.validator.valObject.config"></a>

#### valObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valObject</code>](#rtvref.validator.valObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valObject.default"></a>

#### valObject.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [OBJECT](#rtvref.types.OBJECT) type.

**Kind**: static method of [<code>valObject</code>](#rtvref.validator.valObject)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valPlainObject"></a>

### validator.valPlainObject : <code>Module</code>
Validator Module: valPlainObject

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valPlainObject](#rtvref.validator.valPlainObject) : <code>Module</code>
    * [.type](#rtvref.validator.valPlainObject.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valPlainObject.config)
    * [.default(v, [q], [args])](#rtvref.validator.valPlainObject.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valPlainObject.type"></a>

#### valPlainObject.type : <code>string</code>
Type: [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT)

**Kind**: static constant of [<code>valPlainObject</code>](#rtvref.validator.valPlainObject)  
<a name="rtvref.validator.valPlainObject.config"></a>

#### valPlainObject.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valPlainObject</code>](#rtvref.validator.valPlainObject)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valPlainObject.default"></a>

#### valPlainObject.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [PLAIN_OBJECT](#rtvref.types.PLAIN_OBJECT) type.

**Kind**: static method of [<code>valPlainObject</code>](#rtvref.validator.valPlainObject)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valPromise"></a>

### validator.valPromise : <code>Module</code>
Validator Module: valPromise

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valPromise](#rtvref.validator.valPromise) : <code>Module</code>
    * [.type](#rtvref.validator.valPromise.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valPromise.config)
    * [.default(v, [q])](#rtvref.validator.valPromise.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valPromise.type"></a>

#### valPromise.type : <code>string</code>
Type: [PROMISE](#rtvref.types.PROMISE)

**Kind**: static constant of [<code>valPromise</code>](#rtvref.validator.valPromise)  
<a name="rtvref.validator.valPromise.config"></a>

#### valPromise.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valPromise</code>](#rtvref.validator.valPromise)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valPromise.default"></a>

#### valPromise.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [PROMISE](#rtvref.types.PROMISE) type.

**Kind**: static method of [<code>valPromise</code>](#rtvref.validator.valPromise)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valRegExp"></a>

### validator.valRegExp : <code>Module</code>
Validator Module: valRegExp

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valRegExp](#rtvref.validator.valRegExp) : <code>Module</code>
    * [.type](#rtvref.validator.valRegExp.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valRegExp.config)
    * [.default(v, [q])](#rtvref.validator.valRegExp.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valRegExp.type"></a>

#### valRegExp.type : <code>string</code>
Type: [REGEXP](#rtvref.types.REGEXP)

**Kind**: static constant of [<code>valRegExp</code>](#rtvref.validator.valRegExp)  
<a name="rtvref.validator.valRegExp.config"></a>

#### valRegExp.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valRegExp</code>](#rtvref.validator.valRegExp)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valRegExp.default"></a>

#### valRegExp.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [REGEXP](#rtvref.types.REGEXP) type.

**Kind**: static method of [<code>valRegExp</code>](#rtvref.validator.valRegExp)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valSafeInt"></a>

### validator.valSafeInt : <code>Module</code>
Validator Module: valSafeInt

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valSafeInt](#rtvref.validator.valSafeInt) : <code>Module</code>
    * [.type](#rtvref.validator.valSafeInt.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valSafeInt.config)
    * [.default(v, [q], [args])](#rtvref.validator.valSafeInt.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valSafeInt.type"></a>

#### valSafeInt.type : <code>string</code>
Type: [SAFE_INT](#rtvref.types.SAFE_INT)

**Kind**: static constant of [<code>valSafeInt</code>](#rtvref.validator.valSafeInt)  
<a name="rtvref.validator.valSafeInt.config"></a>

#### valSafeInt.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valSafeInt</code>](#rtvref.validator.valSafeInt)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valSafeInt.default"></a>

#### valSafeInt.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [SAFE_INT](#rtvref.types.SAFE_INT) type.

Determines if a value is a number literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new Number(1)`, which is an object that is a number.

**Kind**: static method of [<code>valSafeInt</code>](#rtvref.validator.valSafeInt)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valSet"></a>

### validator.valSet : <code>Module</code>
Validator Module: valSet

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valSet](#rtvref.validator.valSet) : <code>Module</code>
    * [.type](#rtvref.validator.valSet.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valSet.config)
    * [.default(v, [q], [args])](#rtvref.validator.valSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valSet.type"></a>

#### valSet.type : <code>string</code>
Type: [SET](#rtvref.types.SET)

**Kind**: static constant of [<code>valSet</code>](#rtvref.validator.valSet)  
<a name="rtvref.validator.valSet.config"></a>

#### valSet.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valSet</code>](#rtvref.validator.valSet)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valSet.default"></a>

#### valSet.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [SET](#rtvref.types.SET) type.

**Kind**: static method of [<code>valSet</code>](#rtvref.validator.valSet)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>collection_args</code>](#rtvref.types.collection_args) | Type arguments. |

<a name="rtvref.validator.valString"></a>

### validator.valString : <code>Module</code>
Validator Module: valString

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valString](#rtvref.validator.valString) : <code>Module</code>
    * [.type](#rtvref.validator.valString.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valString.config)
    * [.default(v, [q], [args])](#rtvref.validator.valString.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valString.type"></a>

#### valString.type : <code>string</code>
Type: [STRING](#rtvref.types.STRING)

**Kind**: static constant of [<code>valString</code>](#rtvref.validator.valString)  
<a name="rtvref.validator.valString.config"></a>

#### valString.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valString</code>](#rtvref.validator.valString)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valString.default"></a>

#### valString.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [STRING](#rtvref.types.STRING) type.

Determines if a value is a string literal __only__ (i.e. a
 [primitive](#rtvref.types.primitives)). It does not validate
 `new String('value')`, which is an object that is a string.

**Kind**: static method of [<code>valString</code>](#rtvref.validator.valString)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>STRING_args</code>](#rtvref.types.STRING_args) | Type arguments. |

<a name="rtvref.validator.valSymbol"></a>

### validator.valSymbol : <code>Module</code>
Validator Module: valSymbol

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valSymbol](#rtvref.validator.valSymbol) : <code>Module</code>
    * [.type](#rtvref.validator.valSymbol.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valSymbol.config)
    * [.default(v, [q], [args])](#rtvref.validator.valSymbol.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valSymbol.type"></a>

#### valSymbol.type : <code>string</code>
Type: [SYMBOL](#rtvref.types.SYMBOL)

**Kind**: static constant of [<code>valSymbol</code>](#rtvref.validator.valSymbol)  
<a name="rtvref.validator.valSymbol.config"></a>

#### valSymbol.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valSymbol</code>](#rtvref.validator.valSymbol)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valSymbol.default"></a>

#### valSymbol.default(v, [q], [args]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [SYMBOL](#rtvref.types.SYMBOL) type.

**Kind**: static method of [<code>valSymbol</code>](#rtvref.validator.valSymbol)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |
| [args] | [<code>numeric_args</code>](#rtvref.types.numeric_args) | Type arguments. |

<a name="rtvref.validator.valWeakMap"></a>

### validator.valWeakMap : <code>Module</code>
Validator Module: valWeakMap

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valWeakMap](#rtvref.validator.valWeakMap) : <code>Module</code>
    * [.type](#rtvref.validator.valWeakMap.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valWeakMap.config)
    * [.default(v, [q])](#rtvref.validator.valWeakMap.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valWeakMap.type"></a>

#### valWeakMap.type : <code>string</code>
Type: [WEAK_MAP](#rtvref.types.WEAK_MAP)

**Kind**: static constant of [<code>valWeakMap</code>](#rtvref.validator.valWeakMap)  
<a name="rtvref.validator.valWeakMap.config"></a>

#### valWeakMap.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valWeakMap</code>](#rtvref.validator.valWeakMap)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valWeakMap.default"></a>

#### valWeakMap.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [WEAK_MAP](#rtvref.types.WEAK_MAP) type.

**Kind**: static method of [<code>valWeakMap</code>](#rtvref.validator.valWeakMap)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.valWeakSet"></a>

### validator.valWeakSet : <code>Module</code>
Validator Module: valWeakSet

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  

* [.valWeakSet](#rtvref.validator.valWeakSet) : <code>Module</code>
    * [.type](#rtvref.validator.valWeakSet.type) : <code>string</code>
    * [.config(settings)](#rtvref.validator.valWeakSet.config)
    * [.default(v, [q])](#rtvref.validator.valWeakSet.default) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)

<a name="rtvref.validator.valWeakSet.type"></a>

#### valWeakSet.type : <code>string</code>
Type: [WEAK_SET](#rtvref.types.WEAK_SET)

**Kind**: static constant of [<code>valWeakSet</code>](#rtvref.validator.valWeakSet)  
<a name="rtvref.validator.valWeakSet.config"></a>

#### valWeakSet.config(settings)
[Configuration Function](#rtvref.validator.validator_config)

**Kind**: static method of [<code>valWeakSet</code>](#rtvref.validator.valWeakSet)  

| Param | Type | Description |
| --- | --- | --- |
| settings | [<code>validator_config_settings</code>](#rtvref.validator.validator_config_settings) | Configuration settings. |

<a name="rtvref.validator.valWeakSet.default"></a>

#### valWeakSet.default(v, [q]) ⇒ [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError)
[Validator](#rtvref.validator.type_validator) for the
 [WEAK_SET](#rtvref.types.WEAK_SET) type.

**Kind**: static method of [<code>valWeakSet</code>](#rtvref.validator.valWeakSet)  
**Returns**: [<code>RtvSuccess</code>](#rtvref.RtvSuccess) \| [<code>RtvError</code>](#rtvref.RtvError) - An `RtvSuccess` if valid; `RtvError` if not.  

| Param | Type | Description |
| --- | --- | --- |
| v | <code>\*</code> | Value to validate. |
| [q] | <code>string</code> | Validation qualifier. Defaults to  [REQUIRED](#rtvref.qualifiers.REQUIRED). |

<a name="rtvref.validator.validator_config_settings"></a>

### validator.validator_config_settings : <code>Object</code>
<h3>Type Validator Configuration Settings</h3>

The settings provided to the
 [configuration function](#rtvref.validator.validator_config).

**Kind**: static typedef of [<code>validator</code>](#rtvref.validator)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| impl | [<code>impl</code>](#rtvref.impl) | Reference to the `impl` module. |

