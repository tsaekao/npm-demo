////// isTypeset validation module

import {default as _forEach} from 'lodash/forEach';

import isArray from './isArray';
import isShape from './isShape';
import isTypeArgs from './isTypeArgs';
import isString from './isString';
import isValidator from './isValidator';

import {default as types, argTypes, objTypes, DEFAULT_OBJECT_TYPE} from '../types';
import qualifiers from '../qualifiers';
import {print} from '../util';

// Deep-verify a shape.
// @param {string} type The in-scope type (should be an object type from types.objTypes).
// @param {Object} rule The rule from the typeset being evaluated. This should be the args
//  for the `type`, which is either the shape itself, or an args object containing a
//  property that provides the shape.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx=-1] The position of `rule` within an Array typeset (if the
//  shape is nested), or a negative value if the typeset is not an Array.
// @returns {boolean} True if the shape is valid, false otherwise.
const deepVerifyShape = function(type, rule, options, failurePrefix, idx = -1) {
  let valid = true;

  // if it's a class object, the shape is an optional sub-property of the object;
  //  if it's a map object, there is no shape (the args are rtvref.types.collection_args);
  //  otherwise, the shape is the rule/object itself
  let shape;

  if (type === types.CLASS_OBJECT && rule.hasOwnProperty('shape')) {
    // shape must be valid descriptor
    valid = isShape(rule.shape);
    if (valid) {
      shape = rule.shape;
    } else {
      // NOTE: since the type is CLASS_OBJECT, `idx` _must_ be >= 0 because an
      //  Array typeset is required to specify this object type along with a shape:
      //  [CLASS_OBJECT, {shape: {...}}]
      options.failure = `${failurePrefix}: Expecting a valid shape descriptor in "shape" property of args for type=${print(type)} at index=${idx}`;
    }
  } else {
    valid = isShape(rule);
    if (valid) {
      shape = rule;
    } else {
      options.failure = `${failurePrefix}: Expecting a valid shape descriptor for type=${print(type)}${idx >= 0 ? ` at index=${idx}` : ''}`;
    }
  }

  if (shape) { // undefined if not valid or not provided
    // validate all of the shape's typesets (each own-prop should be a typeset)
    _forEach(shape, function(ts, prop) {
      const opts = Object.assign({}, options); // options.failure should not exist at this point
      valid = isTypeset(ts, opts); // eslint-disable-line no-use-before-define
      options.failure = opts.failure && `${failurePrefix} (${idx >= 0 ? `index=${idx}, ` : ''}prop="${prop}"): ${opts.failure}`;
      return valid; // break on first invalid
    });
  }

  return valid;
};

// Deep-verify a nested Array typeset.
// @param {rtvref.types.typeset} typeset The nested Array typeset to verify.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx] The position of `typeset` within the parent Array typeset.
const deepVerifyArray = function(typeset, options, failurePrefix, idx) {
  const opts = Object.assign({}, options); // options.failure should not exist at this point
  const valid = isTypeset(typeset, opts); // eslint-disable-line no-use-before-define
  options.failure = opts.failure && `${failurePrefix} (index=${idx}): ${opts.failure}`;
  return valid;
};

/**
 * Type: `undefined`, {@link rtvref.types.typeset typeset} pseudo-type.
 * @const {string} rtvref.validation.isTypeset.type
 */
export const type = undefined;

/**
 * Determines if a value is a typeset.
 * @function rtvref.validation.isTypeset.default
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.deep=false] If truthy, deeply-validates any nested
 *  typesets. Note that typesets in nested shapes are also deeply-validated.
 * @param {boolean} [options.fullyQualified=false] If truthy, the typeset must be
 *  fully-qualified.
 * @param {(string|undefined)} [options.failure] (Output property) If an options
 *  object is specified, this property will be added and set to a failure message
 *  IIF the validation fails.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
export default function isTypeset(v, options = {deep: false, fullyQualified: false}) {
  const deep = !!options.deep;
  const fullyQualified = !!options.fullyQualified;

  // FIRST: make sure it's an acceptable type for a typeset: shape, string
  //  (just a plain type name), function (validator), or array (non-empty)
  let valid = !!(v && (isShape(v) || (isString(v) && types.check(v)) || isValidator(v) ||
      (isArray(v) && v.length > 0)));

  if (!valid) {
    options.failure = `Value v=${print(v)} is not a valid type for a typeset: Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset, non-empty)`;
  }

  // THEN: check if needs to be fully-qualified, and check deep within if requested
  if (valid && fullyQualified) {
    const failurePrefix = `Fully-qualified ${deep ? 'deep' : 'shallow'} typeset=${print(v)}`;

    // must now be an array with at least 2 elements: [qualifier, type]
    if (isArray(v) && v.length >= 2) {
      const usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
      let curType; // @type {string} current in-scope type
      let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args

      // Updates the current in-scope type (curType) and marks it as used in usedTypes.
      //  If the type has already been used, it sets valid to false.
      // @param {string} newType New in-scope type.
      const updateCurType = function(newType) {
        // set the rule as the current in-scope type
        curType = newType;

        if (usedTypes[curType]) {
          // a type cannot appear more than once in a typeset (but nested is OK)
          valid = false;
          options.failure = `${failurePrefix}: Type "${curType}" may not be included more than once in the typeset (but may appear again in a nested typeset)`;
        }

        usedTypes[curType] = true;
      };

      // iterate through each element in the typeset array to make sure all required
      //  rules/properties of a fully-qualified typeset are specified
      _forEach(v, function(rule, idx) {
        if (idx === 0) {
          // first position must always be the qualifier
          // more efficient to check for a string first than to always iterate
          //  all qualifiers (or all types, below) when it isn't since we know
          //  they're always strings
          valid = isString(rule) && !!qualifiers.check(rule);
          if (!valid) {
            options.failure = `${failurePrefix}: Expected a qualifier at index=${idx}, found ${print(rule)}`;
          }
        } else if (isString(rule)) {
          // additional qualifier, or simple type
          if (qualifiers.check(rule)) {
            // cannot have more than one qualifier and qualifier must be in first position
            //  (and this is not the first position because that's handled specially, above)
            valid = false;
            options.failure = `${failurePrefix}: Cannot have more than one qualifier, and qualifier must be in first position, index=${idx}`;
          } else if (!types.check(rule)) {
            // if not a qualifier, it must be a valid type (since it's a string)
            valid = false;
            options.failure = `${failurePrefix}: Expected a valid type in ${types} at index=${idx}, found ${print(rule)}`;
          } else {
            // set the rule as the current in-scope type
            updateCurType(rule);

            // update the in-scope arg type: reset to undefined if it doesn't take
            //  args; otherwise, update it (NOTE: currently, there are no types that
            //  _require_ args, only ones that optionally have args, so we don't
            //  have to ensure that args were given when we change the type)
            argType = argTypes.check(rule);
          }
        } else if (isValidator(rule)) {
          // must be a validator, but there can't be more than 1, it must be
          //  in the last position (which enforces the 1 count), always after the
          //  qualifier, and since the typeset must be FQ'd, we must have an
          //  in-scope type
          valid = !!(curType && (idx + 1 === v.length));
          if (!valid) {
            options.failure = `${failurePrefix}: Unexpected custom validator at index=${idx}: Must be in the last position, must not be more than 1 in the typeset, must be after the qualifier, and must be preceded by a type`;
          }
        } else if (isTypeArgs(rule)) {
          // could be a shape, or type args (either way, it's a single object)
          // since the typeset must be fully-qualified, argType must already be
          //  a type that takes arguments, since arguments are always provided
          //  via objects
          // NOTE: for object types, the args are the shapes themselves, except
          //  for CLASS_OBJECT where the shape is specified within the args;
          //  still, there is always only ever at most one object per type that
          //  accepts args, never more
          // NOTE: for the ARRAY type, the typeset is specified within the args
          if (argType) {
            // consume the object as the in-scope arg type's arguments
            argType = undefined;
          } else {
            // since the typeset must be fully-qualified and we don't already
            //  have an in-scope arg type, the typeset is invalid
            valid = false;
            options.failure = `${failurePrefix}: Expecting a type that takes arguments at index=${idx - 1}`;
          }

          // only go deep if the rule is a shape (which means the current in-scope
          //  type must be an object type) or ARRAY args with `typeset` specified
          if (valid && deep && objTypes.check(curType)) {
            valid = deepVerifyShape(curType, rule, options, failurePrefix, idx);
          } else if (valid && deep && curType === types.ARRAY && rule.hasOwnProperty('typeset')) {
            // ARRAY type with args.typeset specified, and we're deep-validating
            valid = deepVerifyArray(rule.typeset, options, failurePrefix, idx);
          }
          // else, either not valid, not deep, or neither shape nor ARRAY args, so assume
          //  the rule (object) needs no further validation
        } else {
          // any other type in a fully-qualified array typeset is not supported
          // NOTE: the ARRAY shorthand notation is not supported in fully-qualified
          //  typesets, therefore a rule whose JavaScript type is an Array is not valid
          valid = false;
          options.failure = `${failurePrefix}: Unexpected value at index=${idx}: Expecting object (shape), non-empty string (single type), or function (custom validator)`;
        }

        return valid; // break if no longer valid
      });
    } else {
      // automatically invalid if not an array because a typeset must be in the
      //  array form in order to be FQ'd
      valid = false;
      options.failure = `${failurePrefix}: Typeset cannot be fully-qualified unless it is an Array of minimum length=2`;
    }

  // NEXT: if it's an array, valid, and does not need to be FQ'd, check its
  //  definition, and deep (if requested)
  } else if (valid && !fullyQualified && isArray(v)) {
    const failurePrefix = `Non-qualified ${deep ? 'deep' : 'shallow'} typeset=${print(v)}`;
    const usedTypes = {}; // @type {Object.<string,boolean>} map of simple type to `true`
    let curType; // @type {string} current in-scope type
    let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args
    let hasQualifier = false; // true if a qualifier is specified (not implied)

    // Updates the current in-scope type (curType) and marks it as used in usedTypes.
    //  If the type has already been used, it sets valid to false.
    // @param {string} newType New in-scope type.
    const updateCurType = function(newType) {
      // set the rule as the current in-scope type
      curType = newType;

      if (usedTypes[curType]) {
        // a type cannot appear more than once in a typeset (but nested is OK)
        valid = false;
        options.failure = `${failurePrefix}: Type "${curType}" may not be included more than once in the typeset (but may appear again in a nested typeset)`;
      }

      usedTypes[curType] = true;
    };

    // iterate through each element in the typeset array to make sure all required
    //  rules/properties of a typeset are specified
    _forEach(v, function(rule, idx) {
      if (isString(rule)) {
        if (qualifiers.check(rule)) {
          hasQualifier = true;
          valid = (idx === 0); // must be in the first position
          if (!valid) {
            options.failure = `${failurePrefix}: Unexpected qualifier at index=${idx}: There must be at most one qualifier and it may only be in the first position`;
          }
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
          options.failure = `${failurePrefix}: Unknown/invalid qualifier/type=${print(rule)} at index=${idx}`;
        }
      } else if (isValidator(rule)) {
        // must be a validator, but there can't be more than 1, and it must be
        //  in the last position (which enforces the 1 count), and always after
        //  the qualifier (if any)
        valid = (idx + 1 === v.length);
        if (valid && !curType) {
          // if we have a validator but no in-scope type, ANY is implied
          updateCurType(types.ANY);
        } else if (!valid) {
          options.failure = `${failurePrefix}: Unexpected custom validator at index=${idx}: Must be at the last position`;
        }
      } else if (isTypeArgs(rule)) {
        // could be a shape, or type args (either way, it's just one object)
        // NOTE: for object types, the args are the shapes themselves, except
        //  for CLASS_OBJECT where the shape is specified within the args; still,
        //  there is always only ever at most one object per type that accepts
        //  args, never more
        // NOTE: for the ARRAY type, the typeset is specified within the args
        if (!argType) {
          // since there's no in-scope arg type, the object must be a shape using
          //  the default OBJECT type, but it must be in the first position (or
          //  second if the first element was a qualifier)
          // NOTE: we do not set argType (it remains undefined here) because the
          //  rule is the type and args all in one, therefore we consume the
          //  rule/object as the in-scope arg type's arguments
          updateCurType(DEFAULT_OBJECT_TYPE);
          if (valid) {
            valid = (idx === 0 || (hasQualifier && idx === 1));
            // NOTE: do not set argType because the shape is the default object type's
            //  args, so they should be consumed by the in-scope arg type
            if (!valid) {
              options.failure = `${failurePrefix}: Shape at index=${idx} is missing an object type in ${objTypes}: Only in the first position (or second if a qualifier is specified) does a shape assume the default object type of "${DEFAULT_OBJECT_TYPE}"`;
            }
          }
        } else {
          // consume the object as the in-scope arg type's arguments
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          argType = undefined;
        }

        // only go deep if the rule is a shape, which means the current in-scope
        //  type must be an object type, or ARRAY args with `typeset` specified
        if (valid && deep && objTypes.check(curType)) {
          valid = deepVerifyShape(curType, rule, options, failurePrefix, idx);
        } else if (valid && deep && curType === types.ARRAY && rule.hasOwnProperty('typeset')) {
          // ARRAY type with args.typeset specified, and we're deep-validating
          valid = deepVerifyArray(rule.typeset, options, failurePrefix, idx);
        }
        // else, either not valid, not deep, or neither shape nor ARRAY args, so assume
        //  the rule (object) needs no further validation
      } else if (isArray(rule)) {
        // a nested array implies the ARRAY type in shorthand notation
        updateCurType(types.ARRAY);

        // in this case, the in-scope arg type should be updated to ARRAY since
        //  arrays accept optional args, but since this rule is a short-hand ARRAY
        //  notation, which means args cannot be specified, we update argType to
        //  undefined to clear it from the previous type (if it was set) and clear
        //  it from this type as well
        argType = undefined;

        if (valid && deep) {
          const opts = {deep, fullyQualified};
          valid = isTypeset(rule, opts); // recursive
          options.failure = opts.failure && `${failurePrefix} (index=${idx}): ${opts.failure}`;
        }
      } else {
        // any other type in a non-qualified array typeset is not supported
        // NOTE: ARRAY shorthand notation is permitted in non-qualified typesets,
        //  therefore a rule whose JavaScript type is an Array is valid
        valid = false;
        options.failure = `${failurePrefix}: Unexpected value at index=${idx}: Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset)`;
      }

      return valid; // break if no longer valid
    });

    // make sure at least one type was specified
    if (valid) {
      valid = !!curType;
      if (!valid) {
        options.failure = `${failurePrefix}: Failed to find a type in the typeset`;
      }
    }

  // NEXT: if it's a shape descriptor, check if deep is requested as long as it's
  //  valid and does not need to be FQ'd (otherwise, 'v' must be an array and
  //  would be invalid as a FQ'd typeset)
  } else if (valid && deep && !fullyQualified && isShape(v)) {
    const failurePrefix = `Non-qualified deep shape=${print(v)}`;

    // we need to deep-validate a shape descriptor, which means each one of its
    //  own-properties must be a valid typeset
    valid = deepVerifyShape(DEFAULT_OBJECT_TYPE, v, options, failurePrefix);
  }

  // ELSE: must be valid (but non-array/shape and doesn't need to be FQ'd), or invalid

  return valid;
}
