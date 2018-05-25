////// Validation Module

import {default as _isArray} from 'lodash/isArray';
import {default as _isObject} from 'lodash/isObject';
import {default as _isObjectLike} from 'lodash/isObjectLike';
import {default as _isMap} from 'lodash/isMap';
import {default as _isWeakMap} from 'lodash/isWeakMap';
import {default as _isSet} from 'lodash/isSet';
import {default as _isWeakSet} from 'lodash/isWeakSet';
import {default as _forEach} from 'lodash/forEach';

import {default as types, argTypes, objTypes, DEFAULT_OBJECT_TYPE} from './types';
import qualifiers from './qualifiers';

/**
 * RTV Validation Namespace
 *
 * This namespace provides a {@link rtvref.validation.validator validator function}
 *  for each type, capable of validating a value against that type, considering any
 *  optional arguments provided.
 *
 * The default export for all modules is a
 *  {@link rtvref.validation.validator validator function}.
 *
 * @namespace rtvref.validation
 */

// NOTE: Modules in this namespace are the only ones where third-party validation
//  code (i.e. lodash methods) should be referenced. The rest of the library should
//  use these methods for any type validation needed.
//
// The only functions that should be defined directly in this module are those
//  that don't map to a type, such as `isTypeset()` or `isPrimitive()`. Where
//  possible, these functions should use the type validators rather than third-party
//  code.

// NOTE: Validator modules are essentially precursors to plugins. For the time being,
//  the expected interface for a validator module is:
//  - 'validator: function': has the rtvref.validation.validator signature
//  - 'type: string': The type the validator validates (e.g. rtvref.types.STRING
//    for the STRING type validator)
//
// There can only be one validator for any given type.
//
// Later, if we ever expose a plugin architecture, we might change this to pass
//  some type of registration function into the plugin, or the plugin calls a
//  registration method on rtv, or maybe something else. Whatever we do, the basics
//  would be to register a new type and provide the function for rtv to call to
//  validate values for that type. Perhaps we might even allow overriding the
//  default validator for an existing type.

/**
 * Type Validator Function.
 * @function rtvref.validation.validator
 * @param {*} value The value to validate.
 * @param {string} [qualifier] The validation qualifier from the immediate
 *  {@link rtvref.types.typeset typeset} in which the pertaining type was specified.
 *  Validators should always default to {@link rtvref.qualifiers.REQUIRED REQUIRED}
 *  to maintain consistent behavior.
 * @param {Object} [args] The arguments object, if any/applicable, for the type
 *  being validated. For example, {@link rtvref.types.STRING_args string args} in
 *  a typeset such as `[rtv.t.STRING, {min: 5}]` (a required string of at least
 *  5 characters in length).
 * @returns {boolean} `true` if the value is verified according to the qualifier
 *  and args; `false` otherwise.
 */

/**
 * Determines if a value is a map.
 * @function rtvref.validation.isMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.MAP}
 */
export const isMap = _isMap;

/**
 * Determines if a value is a weak map.
 * @function rtvref.validation.isWeakMap
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.WEAK_MAP}
 */
export const isWeakMap = _isWeakMap;

/**
 * Determines if a value is a set.
 * @function rtvref.validation.isSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.SET}
 */
export const isSet = _isSet;

/**
 * Determines if a value is a weak set.
 * @function rtvref.validation.isWeakSet
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.WEAK_SET}
 */
export const isWeakSet = _isWeakSet;

/**
 * Determines if a value is a JavaScript {@link rtvref.types.primitives primitive}.
 * @function rtvref.validation.isPrimitive
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isPrimitive = function(v) {
  return v === undefined ||
      v === null ||
      isString(v, {emptyOk: true}) || // empty strings are still strings in this case
      isBoolean(v) ||
      isNumber(v) ||
      isSymbol(v);
};

/**
 * Determines if a value is _any_ type of object except a primitive.
 * @function rtvref.validation.isAnyObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isAnyObject = _isObject;

/**
 * Determines if a value is an object that extends from `JavaScript.Object` and
 *  is not a function, array, regex, map, weak map, set, weak set, or primitive.
 * @function rtvref.validation.isObject
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export const isObject = function(v) {
  return _isObjectLike(v) && // excludes primitives and functions
      !isArray(v) && // excludes arrays which are otherwise object-like (typeof [] === 'object')
      !isMap(v) && !isWeakMap(v) && // excludes weak/maps
      !isSet(v) && !isWeakSet(v) && // excludes weak/sets
      !isRegExp(v); // excludes regex
};

/**
 * Determines if a value is a typeset.
 * @function rtvref.validation.isValidTypeset
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.deep=false] If truthy, deeply-validates any nested typesets. Note
 *  that typesets in nested shapes are also deeply-validated.
 * @param {boolean} [options.fullyQualified=false] If truthy, the typeset must be fully-qualified.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
export const isTypeset = function(v, {deep = false, fullyQualified = false} = {}) {
  let valid = !!(isObject(v) || (isString(v) && types.check(v)) || isFunction(v) ||
      (isArray(v) && v.length > 0));

  // FIRST: check if needs to be fully-qualified, and check deep within if requested
  if (valid && fullyQualified) {
    // must now be an array with at least 2 elements: [qualifier, type]
    if (isArray(v) && v.length >= 2) {
      const usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
      let curType; // @type {string} current in-scope type
      let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args

      // Updates the current in-scope type (curType) and marks it as used in usedTypes.
      //  If the type has already been used, it sets valid to false.
      // @param {string} type New in-scope type.
      const updateCurType = function(type) {
        // set the rule as the current in-scope type
        curType = type;

        if (usedTypes[curType]) {
          // a type cannot appear more than once in a typeset (but nested is OK)
          valid = false;
        }
        usedTypes[curType] = true;
      };

      // iterate through each element in the typeset array to make sure all required
      //  rules/properties of a fully-qualified typeset are specified
      _forEach(v, function(rule, i) {
        if (i === 0) {
          // first position must always be the qualifier
          // more efficient to check for a string first than to always iterate
          //  all qualifiers (or all types, below) when it isn't since we know
          //  they're always strings
          valid = isString(rule) && !!qualifiers.check(rule);
        } else if (isString(rule)) {
          // additional qualifier, or simple type
          if (qualifiers.check(rule)) {
            // cannot have more than one qualifier and qualifier must be in first position
            //  (and this is not the first position because that's handled specially, above)
            valid = false;
          } else if (!types.check(rule)) {
            // if not a qualifier, it must be a valid type (since it's a string)
            valid = false;
          } else {
            // set the rule as the current in-scope type
            updateCurType(rule);

            // update the in-scope arg type: reset to undefined if it doesn't take
            //  args; otherwise, update it (NOTE: currently, there are no types that
            //  _require_ args, only ones that optionally have args, so we don't
            //  have to ensure that args were given when we change the type)
            argType = argTypes.check(rule);
          }
        } else if (isFunction(rule)) {
          // must be a validator, but there can't be more than 1, it must be
          //  in the last position (and always after the qualifier), and since
          //  the typeset must be FQ'd, we must have an in-scope type
          valid = !!(curType && (i + 1 === v.length));
        } else if (isObject(rule)) {
          // could be a shape, or type args (either way, it's a single object)
          // since the typeset must be fully-qualified, argType must already be
          //  a type that takes arguments, since arguments are always provided
          //  via objects (NOTE: for object types, the args are the shapes themselves,
          //  except for CLASS_OBJECT where the shape is specified within the args;
          //  still, there is always only ever at most one object per type that
          //  accepts args, never more)
          if (argType) {
            // consume the object as the in-scope arg type's arguments
            argType = undefined;
          } else {
            // since the typeset must be fully-qualified and we don't already
            //  have an in-scope arg type, the typeset is invalid
            valid = false;
          }

          // only go deep if the object is a shape, which means the current in-scope
          //  type must be an object type
          if (valid && deep && objTypes.check(curType)) {
            // if it's a class object, the shape is an optional sub-property of the object;
            //  if it's a map object, there is no shape; otherwise, it's the object itself
            const shape = (curType === types.CLASS_OBJECT) ? rule.shape :
              ((curType === types.MAP_OBJECT) ? undefined : rule);

            // validate all of the shape's typesets (each own-prop should be a typeset)
            shape && _forEach(shape, function(ts, prop) {
              valid = isTypeset(ts, {deep, fullyQualified}); // recursive
              return valid; // break on first invalid
            });
          }
        } else if (isArray(rule)) {
          // nested typeset for an array type: in-scope type must be ARRAY
          if (curType === types.ARRAY) {
            // go deep if requested; otherwise, assume it's valid
            valid = !deep || isTypeset(rule, {deep, fullyQualified});
          } else {
            valid = false;
          }
        } else {
          // any other type in an array typeset is not supported
          valid = false;
        }

        return valid; // break if no longer valid
      });

      // make sure at least one type was specified
      valid = valid && !!curType;
    } else {
      // automatically invalid if not an array because a typeset must be in the
      //  array form in order to be FQ'd
      valid = false;
    }

  // NEXT: if it's an array, valid, and does not need to be FQ'd, check its
  //  definition, and deep (if requested)
  } else if (valid && !fullyQualified && isArray(v)) {
    const usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
    let curType; // @type {string} current in-scope type
    let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args
    let hasQualifier = false; // true if a qualifier is specified (not implied)

    // Updates the current in-scope type (curType) and marks it as used in usedTypes.
    //  If the type has already been used, it sets valid to false.
    // @param {string} type New in-scope type.
    const updateCurType = function(type) {
      // set the rule as the current in-scope type
      curType = type;

      if (usedTypes[curType]) {
        // a type cannot appear more than once in a typeset (but nested is OK)
        valid = false;
      }
      usedTypes[curType] = true;
    };

    // iterate through each element in the typeset array to make sure all required
    //  rules/properties of a typeset are specified
    _forEach(v, function(rule, i) {
      if (isString(rule)) {
        if (qualifiers.check(rule)) {
          hasQualifier = true;
          valid = (i === 0); // must be in the first position
        } else if (types.check(rule)) {
          // set the rule as the current in-scope type
          updateCurType(rule);
          // update current in-scope arg type IIF it accepts args
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          argType = argTypes.check(rule);
        } else {
          // some unknown/invalid qualifier or type
          valid = false;
        }
      } else if (isFunction(rule)) {
        // must be a validator, but there can't be more than 1, and it must be
        //  in the last position (and always after the qualifier, if any)
        valid = (i + 1 === v.length);
        if (valid && !curType) {
          // if we have a validator but no in-scope type, ANY is implied
          updateCurType(types.ANY);
        }
      } else if (isObject(rule)) {
        // could be a shape, or type args (either way, it's just one object)
        // NOTE: for object types, the args are the shapes themselves, except
        //  for CLASS_OBJECT where the shape is specified within the args; still,
        //  there is always only ever at most one object per type that accepts
        //  args, never more
        if (!argType) {
          // since there's no in-scope arg type, the object must be a shape using
          //  the default OBJECT type, but it must be in the first position (or
          //  second if the first element was a qualifier)
          updateCurType(DEFAULT_OBJECT_TYPE);
          valid = valid && (i === 0 || (hasQualifier && i === 1));
          // NOTE: do not set argType because the shape is the default object type's
          //  args, so they should be consumed by the in-scope arg type
        } else {
          // consume the object as the in-scope arg type's arguments
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          argType = undefined;
        }

        // only go deep if the object is a shape, which means the current in-scope
        //  type must be an object type
        if (valid && deep && objTypes.check(curType)) {
          // if it's a class object, the shape is an optional sub-property of the object;
          //  if it's a map object, there is no shape; otherwise, it's the object itself
          const shape = (curType === types.CLASS_OBJECT) ? rule.shape :
            ((curType === types.MAP_OBJECT) ? undefined : rule);

          // validate all of the shape's typesets (each own-prop should be a typeset)
          shape && _forEach(shape, function(ts, prop) {
            valid = isTypeset(ts, {deep, fullyQualified}); // recursive
            return valid; // break on first invalid
          });
        }
      } else if (isArray(rule)) {
        // if the current in-scope type is not ARRAY, set it since a nested array
        //  implies the ARRAY type
        if (curType !== types.ARRAY) {
          updateCurType(types.ARRAY);
          // in this case, the in-scope arg type should be updated to ARRAY since
          //  arrays accept optional args, but since the current in-scope type
          //  was not set, this must be a short-hand ARRAY notation, which means
          //  args cannot be specified, therefore we update argType to undefined
          //  to clear it from the previous type (if it was set) and clear it
          //  from this type as well
          argType = undefined;
        }

        if (valid && deep) {
          valid = isTypeset(rule, {deep, fullyQualified}); // recursive
        }
      } else {
        // any other type in an array typeset is not supported
        valid = false;
      }

      return valid; // break if no longer valid
    });

    // make sure at least one type was specified
    valid = valid && !!curType;

  // NEXT: if it's a shape descriptor, check if deep is requested as long as it's
  //  valid and does not need to be FQ'd (otherwise, 'v' must be an array and
  //  would be invalid as a FQ'd typeset)
  } else if (valid && deep && !fullyQualified && isObject(v)) {
    // we need to deep-validate a shape descriptor, which means each one of its
    //  own-properties must be a valid typeset
    const props = Object.keys(v);
    _forEach(props, function(prop) {
      valid = isTypeset(v[prop], {deep, fullyQualified}); // recursive
      return valid; // break if no longer valid
    });
  }
  // else, must be invalid, or valid but non-array and doesn't need to be FQ'd
  //  (and we can't go deep because it isn't an array)

  return valid;
};
