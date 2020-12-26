////// isTypeset validation module

import { default as _forEach } from 'lodash/forEach';

import { check as isArray } from './isArray';
import { check as isShape } from './isShape';
import { check as isTypeArgs } from './isTypeArgs';
import { check as isString } from './isString';
import { check as isCustomValidator } from './isCustomValidator';

import { types, argTypes, objTypes, DEFAULT_OBJECT_TYPE } from '../types';
import { qualifiers } from '../qualifiers';
import { print, hasOwnProp } from '../util';

// eslint-disable-next-line prefer-const -- needs to be declared, then defined, to allow helper functions to call isTypeset internally
let isTypeset; // {function}

// Deep-verify a shape.
// @param {string} type The in-scope type (should be an object type from types.objTypes).
// @param {Object} args The {@link rtvref.types.shape_object_args} for the `type`
//  containing the `$` property that provides the shape. The shape will first be
//  validated with the isShape() validation.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx=-1] The position of `rule` within an Array typeset (if the
//  shape is nested), or a negative value if the typeset is not an Array.
// @returns {boolean} True if the shape is valid, false otherwise.
const deepVerifyShape = function (
  type,
  args,
  options,
  failurePrefix,
  idx = -1
) {
  const shape = args.$;
  let valid = isShape(shape); // shape must be valid descriptor

  if (valid) {
    // validate all of the shape's typesets (each own-prop should be a typeset)
    _forEach(shape, function (ts, prop) {
      const opts = Object.assign({}, options); // options.rootCause should not exist at this point
      valid = isTypeset(ts, opts); // eslint-disable-line no-use-before-define
      options.rootCause =
        opts.rootCause &&
        `${failurePrefix} (${
          idx >= 0 ? `index=${idx}, ` : ''
        }prop="${prop}"): ${opts.rootCause}`;
      return valid; // break on first invalid
    });
  } else {
    options.rootCause = `${failurePrefix}: Expecting a valid shape descriptor for type=${print(
      type,
      { isTypeset: true }
    )}`;

    // NOTE: the only case where idx would be negative/not specified should be
    //  when the typeset is a shape descriptor with an implied type of DEFAULT_OBJECT_TYPE,
    //  or when its the first/second element in an Array typeset like `[{shape}]` or
    //  `[qualifier, {shape}]`; otherwise, the index should always be specified since all
    //  object types take args that specify the shape: [CLASS_OBJECT, {$: {...}}]
    if (idx >= 0) {
      options.rootCause += ` at index=${idx}`;
    }
  }

  return valid;
};

// Deep-verify a nested Array typeset.
// @param {rtvref.types.typeset} typeset The nested Array typeset to verify.
// @param {Object} options The options object originally given to isTypeset().
// @param {string} failurePrefix The prefix to use if a failure message is generated.
// @param {number} [idx] The position of `typeset` within the parent Array typeset.
const deepVerifyArray = function (typeset, options, failurePrefix, idx) {
  const opts = Object.assign({}, options); // options.rootCause should not exist at this point
  const valid = isTypeset(typeset, opts); // eslint-disable-line no-use-before-define
  options.rootCause =
    opts.rootCause && `${failurePrefix} (index=${idx}): ${opts.rootCause}`;
  return valid;
};

/**
 * Validation Module: isTypeset
 * @typedef {Module} rtvref.validation.isTypeset
 */

/**
 * Type: `undefined`, {@link rtvref.types.typeset typeset} pseudo-type.
 * @const {string} rtvref.validation.isTypeset.type
 */
export const type = undefined;

/**
 * Determines if a value is a typeset.
 * @function rtvref.validation.isTypeset.check
 * @param {*} v Value to validate.
 * @param {Object} [options] Validation options.
 * @param {boolean} [options.deep=false] If truthy, deeply-validates any nested
 *  typesets. Note that typesets in nested shapes are also deeply-validated.
 * @param {boolean} [options.fullyQualified=false] If truthy, the typeset must be
 *  fully-qualified to be valid.
 * @param {(string|undefined)} [options.rootCause] (Output property) If an options
 *  object is specified, this property will be added and set to a failure message
 *  IIF the validation fails.
 * @returns {boolean} `true` if it is; `false` otherwise.
 * @see {@link rtvref.types.typeset}
 */
isTypeset = function (v, options = { deep: false, fullyQualified: false }) {
  const deep = !!options.deep;
  const fullyQualified = !!options.fullyQualified;

  // FIRST: make sure it's an acceptable type for a typeset: shape, string
  //  (just a plain type name), function (validator), or array (non-empty)
  let valid = !!(
    (v && isShape(v)) ||
    (isString(v) && types.check(v)) ||
    isCustomValidator(v) ||
    (isArray(v) && v.length > 0)
  );

  if (!valid) {
    options.rootCause = `Value v=${print(
      v
    )} is not a valid type for a typeset: Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset, non-empty)`;
  }

  // THEN: check if needs to be fully-qualified, and check deep within if requested
  if (valid && fullyQualified) {
    const failurePrefix = `Fully-qualified ${
      deep ? 'deep' : 'shallow'
    } typeset=${print(v, { isTypeset: true })}`;

    // must now be an array with at least 2 elements: [qualifier, type]
    if (isArray(v) && v.length >= 2) {
      let curType; // @type {string} current in-scope type
      let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args

      // Updates the current in-scope type (curType) and marks it as used in usedTypes.
      //  If the type has already been used, it sets valid to false.
      // @param {string} newType New in-scope type.
      const updateCurType = function (newType) {
        // set the rule as the current in-scope type
        curType = newType;
        // NOTE: there's no restriction on having a type appear only once in a typeset,
        //  but if there was, this is where we'd catch it, using a map to track which
        //  types have been used already
      };

      // iterate through each element in the typeset array to make sure all required
      //  rules/properties of a fully-qualified typeset are specified
      _forEach(v, function (rule, idx) {
        if (idx === 0) {
          // first position must always be the qualifier
          // more efficient to check for a string first than to always iterate
          //  all qualifiers (or all types, below) when it isn't since we know
          //  they're always strings
          valid = isString(rule) && !!qualifiers.check(rule);
          if (!valid) {
            options.rootCause = `${failurePrefix}: Expected a qualifier at index=${idx}, found ${print(
              rule
            )}`;
          }
        } else if (isString(rule)) {
          // additional qualifier, or simple type
          if (qualifiers.check(rule)) {
            // cannot have more than one qualifier and qualifier must be in first position
            //  (and this is not the first position because that's handled specially, above)
            valid = false;
            options.rootCause = `${failurePrefix}: Cannot have more than one qualifier, and qualifier must be in first position, index=${idx}`;
          } else if (!types.check(rule)) {
            // if not a qualifier, it must be a valid type (since it's a string)
            valid = false;
            options.rootCause = `${failurePrefix}: Expected a valid type in ${types} at index=${idx}, found ${print(
              rule
            )}`;
          } else {
            // set the rule as the current in-scope type
            updateCurType(rule);

            // update the in-scope arg type: reset to undefined if it doesn't take
            //  args; otherwise, update it (NOTE: currently, there are no types that
            //  _require_ args, only ones that optionally have args, so we don't
            //  have to ensure that args were given when we change the type)
            argType = argTypes.check(rule);
          }
        } else if (isCustomValidator(rule)) {
          // must be a validator, but there can't be more than 1, it must be
          //  in the last position (which enforces the 1 count), always after the
          //  qualifier, and since the typeset must be FQ'd, we must have an
          //  in-scope type
          valid = !!(curType && idx + 1 === v.length);
          if (!valid) {
            options.rootCause = `${failurePrefix}: Unexpected custom validator at index=${idx}: Must be in the last position, must not be more than 1 in the typeset, must be after the qualifier, and must be preceded by a type`;
          }
        } else if (isTypeArgs(rule)) {
          // since the typeset must be fully-qualified, argType must already be
          //  a type that takes arguments, since arguments are always provided
          //  via objects
          // NOTE: for shape object types, the shape is specified within the args
          // NOTE: for the ARRAY type, the typeset is specified within the args
          if (argType) {
            // consume the object as the in-scope arg type's arguments
            argType = undefined;
          } else {
            // since the typeset must be fully-qualified and we don't already
            //  have an in-scope arg type, the typeset is invalid
            valid = false;
            options.rootCause = `${failurePrefix}: Expecting a type that takes arguments at index=${
              idx - 1
            }`;
          }

          // only go deep if the rule is shape object args with `$` specified (which
          //  means the current in-scope type must be an object type) or ARRAY args with
          //  `ts` specified
          if (
            valid &&
            deep &&
            objTypes.check(curType) &&
            hasOwnProp(rule, '$')
          ) {
            valid = deepVerifyShape(curType, rule, options, failurePrefix, idx);
          } else if (
            valid &&
            deep &&
            curType === types.ARRAY &&
            hasOwnProp(rule, 'ts')
          ) {
            // ARRAY type with args.ts specified, and we're deep-validating
            valid = deepVerifyArray(rule.ts, options, failurePrefix, idx);
          }
          // else, either not valid, not deep, or neither shape object nor ARRAY args, so assume
          //  the rule (object) needs no further validation
        } else {
          // any other type in a fully-qualified array typeset is not supported
          // NOTE: the ARRAY shorthand notation is not supported in fully-qualified
          //  typesets, therefore a rule whose JavaScript type is an Array is not valid
          valid = false;
          options.rootCause = `${failurePrefix}: Unexpected value at index=${idx}: Expecting shape object args, ${types.ARRAY} args, non-empty string (single type), or function (custom validator)`;
        }

        return valid; // break if no longer valid
      });
    } else {
      // automatically invalid if not an array because a typeset must be in the
      //  array form in order to be FQ'd
      valid = false;
      options.rootCause = `${failurePrefix}: Typeset cannot be fully-qualified unless it is an Array of minimum length=2`;
    }

    // NEXT: if it's an array, valid, and does not need to be FQ'd, check its
    //  definition, and deep (if requested)
  } else if (valid && !fullyQualified && isArray(v)) {
    const failurePrefix = `Non-qualified ${
      deep ? 'deep' : 'shallow'
    } typeset=${print(v, { isTypeset: true })}`;
    let curType; // @type {string} current in-scope type
    let argType; // @type {(string|undefined)} current in-scope type IIF it accepts args
    let hasQualifier = false; // true if a qualifier is specified (not implied)

    // Updates the current in-scope type (curType).
    // @param {string} newType New in-scope type.
    const updateCurType = function (newType) {
      // set the rule as the current in-scope type
      curType = newType;
      // NOTE: there's no restriction on having a type appear only once in a typeset,
      //  but if there was, this is where we'd catch it, using a map to track which
      //  types have been used already
    };

    // iterate through each element in the typeset array to make sure all required
    //  rules/properties of a typeset are specified
    _forEach(v, function (rule, idx) {
      if (isString(rule)) {
        if (qualifiers.check(rule)) {
          hasQualifier = true;
          valid = idx === 0; // must be in the first position
          if (!valid) {
            options.rootCause = `${failurePrefix}: Unexpected qualifier at index=${idx}: There must be at most one qualifier and it may only be in the first position`;
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
          options.rootCause = `${failurePrefix}: Unknown/invalid qualifier/type=${print(
            rule
          )} at index=${idx}`;
        }
      } else if (isCustomValidator(rule)) {
        // must be a validator, but there can't be more than 1, and it must be
        //  in the last position (which enforces the 1 count), and always after
        //  the qualifier (if any)
        valid = idx + 1 === v.length;
        if (valid && !curType) {
          // if we have a validator but no in-scope type, ANY is implied
          updateCurType(types.ANY);
        } else if (!valid) {
          options.rootCause = `${failurePrefix}: Unexpected custom validator at index=${idx}: Must be at the last position`;
        }
      } else if (isTypeArgs(rule)) {
        let soArgs; // shape object args

        // NOTE: for shape object types, the shape is specified within the args
        // NOTE: for the ARRAY type, the typeset is specified within the args
        if (!argType) {
          // since there's no in-scope arg type, the object must be a shape using
          //  the default OBJECT type, but it must be in the first position (or
          //  second if the first element was a qualifier)
          // NOTE: we do not set argType (it remains undefined here) because the
          //  rule is the type and args all in one, therefore we consume the
          //  rule/object as the in-scope arg type's arguments
          updateCurType(DEFAULT_OBJECT_TYPE);

          soArgs = { $: rule }; // build default args since the rule is the shape itself
          valid = idx === 0 || (hasQualifier && idx === 1);
          // NOTE: do not set argType because the shape is the default object type's
          //  args, so they should be consumed by the in-scope arg type
          if (!valid) {
            options.rootCause = `${failurePrefix}: Shape at index=${idx} is missing an object type in ${objTypes}, and should be wrapped in shape object args: Only in the first position (or second if a qualifier is specified) does a shape assume the default object type of "${DEFAULT_OBJECT_TYPE}"`;
          }
        } else {
          // consume the object as the in-scope arg type's arguments
          // NOTE: currently, there are no types that _require_ args, only ones
          //  that optionally have args, so we don't have to ensure that args
          //  were given when we change the type
          argType = undefined;
          // since we had an in-scope arg type, the rule could be shape object args
          //  if the current in-scope type is an object type
          soArgs = rule;
        }

        // only go deep if we have a shape (i.e. the current in-scope type must be
        //  an object type, and the rule is either the shape itself, or shape object
        //  args with a `$` property that specifies the shape) or ARRAY args with
        //  `typeset` specified
        if (
          valid &&
          deep &&
          objTypes.check(curType) &&
          hasOwnProp(soArgs, '$')
        ) {
          valid = deepVerifyShape(curType, soArgs, options, failurePrefix, idx);
        } else if (
          valid &&
          deep &&
          curType === types.ARRAY &&
          hasOwnProp(rule, 'ts')
        ) {
          // ARRAY type with args.ts specified, and we're deep-validating
          valid = deepVerifyArray(rule.ts, options, failurePrefix, idx);
        }
        // else, either not valid, not deep, or neither shape object nor ARRAY args, so assume
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

        if (deep) {
          const opts = { deep, fullyQualified };
          valid = isTypeset(rule, opts); // recursive
          options.rootCause =
            opts.rootCause &&
            `${failurePrefix} (index=${idx}): ${opts.rootCause}`;
        }
      } else {
        // any other type in a non-qualified array typeset is not supported
        // NOTE: ARRAY shorthand notation is permitted in non-qualified typesets,
        //  therefore a rule whose JavaScript type is an Array is valid
        valid = false;
        if (idx === 0 || (idx === 1 && hasQualifier)) {
          options.rootCause = `${failurePrefix}: Unexpected value at index=${idx}: Expecting object (shape), non-empty string (single type), function (custom validator), or array (typeset)`;
        } else {
          options.rootCause = `${failurePrefix}: Unexpected value at index=${idx}: Expecting object (type args), non-empty string (single type), function (custom validator), or array (typeset)`;
        }
      }

      return valid; // break if no longer valid
    });

    // make sure at least one type was specified
    if (valid) {
      valid = !!curType;
      if (!valid) {
        options.rootCause = `${failurePrefix}: Failed to find a type in the typeset`;
      }
    }

    // NEXT: if it's a shape descriptor, check if deep is requested as long as it's
    //  valid and does not need to be FQ'd (otherwise, 'v' must be an array and
    //  would be invalid as a FQ'd typeset)
  } else if (valid && deep && !fullyQualified && isShape(v)) {
    const failurePrefix = `Non-qualified deep shape=${print(v, {
      isTypeset: true,
    })}`;

    // we need to deep-validate a shape descriptor, which means each one of its
    //  own-properties must be a valid typeset
    valid = deepVerifyShape(
      DEFAULT_OBJECT_TYPE,
      { $: v },
      options,
      failurePrefix
    );
  }

  // ELSE: must be valid (but non-array/shape and doesn't need to be FQ'd), or invalid

  return valid;
};

export const check = isTypeset;
