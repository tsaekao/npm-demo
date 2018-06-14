////// Main Implementation Module

import {default as _forEach} from 'lodash/forEach';

// NOTE: These 4 validators are used to verify the basic types related to typesets.
//  Validation of actual VALUES being checked should always be done via the
//  _validatorMap.
import isArray from './validator/isArray';
import isObject from './validator/isObject';
import isString from './validator/isString';
import isFunction from './validator/isFunction';

import isTypeset from './validation/isTypeset';

import {DEFAULT_OBJECT_TYPE, default as types} from './types';
import {DEFAULT_QUALIFIER, default as qualifiers} from './qualifiers';
import {print} from './util';
import RtvSuccess from './RtvSuccess';
import RtvError from './RtvError';

/**
 * <h2>RTV Implementation Module</h2>
 *
 * Provides the internal implementation for the externally-facing {@link rtv RTV}
 *  API, as well as utilities for {@link rtvref.validator type validators}.
 *
 * @namespace rtvref.impl
 */

/**
 * [Internal] Map of validator type (string) to validator function.
 * @private
 * @name rtvref.impl._validatorMap
 * @type {Object.<string,rtvref.validator.type_validator>}
 */
const _validatorMap = {};

/**
 * Get the qualifier given any kind of typeset.
 * @param {rtvref.types.typeset} typeset The typeset in question.
 * @returns {string} The applicable {@link rtvref.qualifiers qualifier} for the
 *  specified typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
const getQualifier = function(typeset) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

  let qualifier = DEFAULT_QUALIFIER;

  if (isArray(typeset)) {
    // if there's a qualifier, it must be the first element, and since it's a
    //  valid typeset, it cannot be an empty array
    if (isString(typeset[0]) && qualifiers.check(typeset[0])) {
      qualifier = typeset[0];
    }
  }
  // else, it's either an object, function, or string, which implies the default
  //  qualifier

  return qualifier;
};

/**
 * Fully-qualifies a typeset, shallow (i.e. the first level only; nested typesets
 *  are not fully-qualified).
 *
 * This function does not modify the input `typeset`.
 *
 * @function rtvref.impl.fullyQualify
 * @param {rtvref.types.typeset} typeset Typeset to fully-qualify.
 * @returns {rtvref.types.fully_qualified_typeset} A new, fully-qualified typeset
 *  representing the input `typeset`. Only the first/immediate level of the
 *  input typeset is fully-qualified. The new array returned contains references
 *  to elements within the input typeset.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
const fullyQualify = function(typeset) {
  if (!isTypeset(typeset)) { // start by validating so we can be confident later
    throw new Error(`Invalid typeset="${print(typeset)}"`);
  }

  // NOTE: from this point on, we ASSUME that the typeset is valid, which lets
  //  us make assumptions about what we find within it; without this knowledge,
  //  the algorithm below would not work

  if (!isArray(typeset)) {
    // must be either a string, object, or function with an implied qualifier
    if (isObject(typeset)) {
      // must be a nested shape descriptor with default object type
      return [DEFAULT_QUALIFIER, DEFAULT_OBJECT_TYPE, typeset];
    }

    // if a function, it has an implied type of ANY
    if (isFunction(typeset)) {
      return [DEFAULT_QUALIFIER, types.ANY, typeset];
    }

    // string (basic type)
    return [DEFAULT_QUALIFIER, typeset];
  }

  const fqts = []; // ALWAYS a new array
  let curType; // @type {(string|undefined)} current type in scope or undefined if none

  // typeset is an array: iterate its elements and build fqts iteratively
  typeset.forEach(function(rule, i) {
    // qualifiers are non-empty strings
    if (i === 0 && (!isString(rule) || !qualifiers.check(rule))) {
      fqts.push(DEFAULT_QUALIFIER); // add implied qualifier
    }

    if (isString(rule)) {
      // must be a type
      curType = rule;
      fqts.push(curType);
    } else if (isObject(rule)) {
      if (i === 0) {
        // must be a nested shape descriptor using default object type
        curType = DEFAULT_OBJECT_TYPE;
        fqts.push(curType, rule);
      } else {
        // must be args for curType since typeset is an array and object is not
        //  in first position
        fqts.push(rule);
      }
    // must be a validator, ANY is implied type if none specified
    } else if (isFunction(rule)) {
      if (!curType) {
        curType = types.ANY;
        fqts.push(curType);
      }

      fqts.push(rule);
    } else { // must be an array
      if (curType !== types.ARRAY) {
        // add implied ARRAY type
        curType = types.ARRAY;
        fqts.push(curType);
      }

      fqts.push(rule);
    }
  });

  return fqts;
};

/**
 * [Internal] Common options for the various `check*()` functions.
 * @private
 * @typedef rtvref.impl._checkOptions
 * @property {Array.<string>} path The current path into the typeset. Initially
 *  empty to signify the root (top-level) value being checked.
 * @property {boolean} isTypeset `true` if the typeset specified in the public
 *  parameters has already been validated as being a typeset; `false` otherwise.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
 */

/**
 * Gets check options for any of the `check*()` functions.
 * @private
 * @function rtvref.impl._getCheckOptions
 * @param {Object} [given] Given options, used as a basis for new options.
 * @returns {rtvref.impl._checkOptions} A full, new options object, based on
 *  `given` options, if any. Invalid given options will be ignored. The object
 *  returned may contain references to objects in `given` depending on property
 *  types.
 * @see {@link rtvref.impl.check}
 * @see {@link rtvref.impl.checkShape}
 * @see {@link rtvref.impl.checkType}
 * @throws {Error} If `given.path` is specified and not an array.
 */
const _getCheckOptions = function(given = {}) {
  if (given.path && !isArray(given.path)) {
    throw new Error(`given.path must be an Array when specified, given.path=${print(given.path)}`);
  }

  return {
    path: given.path || [],
    isTypeset: !!given.isTypeset || false
  };
};

/**
 * Checks a value against a simple type using the
 *  {@link rtvref.qualifiers.DEFAULT_QUALIFIER default qualifier}.
 * @function rtvref.impl.checkType
 * @param {*} value Value to check.
 * @param {string} type Simple type name, must be one of {@link rtvref.types.types}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the type; an error indicator if not.
 * @throws {Error} If `type` is not a valid type name.
 * @see {@link rtvref.types}
 */
// @param {rtvref.impl._checkOptions} options (internal parameter)
const checkType = function(value, type /*, options*/) {
  types.verify(type);

  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  if (_validatorMap[type]) {
    // call the validator for the specified type
    const valid = _validatorMap[type](value, DEFAULT_QUALIFIER);

    if (valid) {
      return new RtvSuccess();
    }

    return new RtvError(value, type, options.path, fullyQualify(type));
  }

  throw new Error(`Missing validator for type="${print(type)}"`);
};

/**
 * Checks a value against a {@link rtvref.shape_descriptor shape descriptor} and
 *  ensure the value's type is the default object type.
 * @function rtvref.impl.checkShape
 * @param {Object} value Value to check. Must be of the
 *  {@link rtvref.types.DEFAULT_OBJECT_TYPE default} object type.
 * @param {Object} shape Expected shape of the `value`. Must be an
 *  {@link rtvref.types.OBJECT OBJECT}.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} A success indicator if the
 *  `value` is compliant to the shape; an error indicator if not.
 * @throws {Error} If `shape` is not an {@link rtvref.types.OBJECT OBJECT}.
 */
// @param {rtvref.impl._checkOptions} options (internal parameter)
const checkShape = function(value, shape /*, options*/) {
  if (!isObject(shape)) {
    throw new Error(`Invalid shape=${print(shape)}`);
  }

  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);
  const shapeType = types.DEFAULT_OBJECT_TYPE;

  // value must be default object type
  if (!checkType(value, shapeType)) { // NOTE: always check values with the _validatorMap
    return new RtvError(value, shapeType, options.path, fullyQualify(shapeType));
  }

  let err; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  _forEach(shape, function(typeset, prop) {
    // first, consider the qualifier and test the existence of the property
    const qualifier = getQualifier(typeset);
    if ((value[prop] === undefined && qualifier !== qualifiers.OPTIONAL) ||
        (value[prop] === null && qualifier === qualifiers.REQUIRED)) {

      // REQUIRED and EXPECTED require the property NOT to be undefined and to
      //  be somewhere in the prototype chain; if it wasn't in the prototype chain,
      //  it would still be undefined, so we don't need an 'in' operator check

      // REQUIRED properties cannot have a value of null/undefined, and they must
      //  exist somewhere in the prototype chain; if the property wasn't in the
      //  prototype chain, the value would be undefined, so we don't need to test
      //  this here either

      err = new RtvError(value, typeset, options.path.concat(prop), fullyQualify(typeset));
      return false; // break
    }

    // then, test the property's value against the typeset (indirectly recursive)
    const result = check(value[prop], typeset, {path: options.path.concat(prop)}); // eslint-disable-line no-use-before-define
    if (!result.valid) {
      err = result;
      return false; // break
    }
  });

  return err || (new RtvSuccess());
};

/**
 * Checks a value against an Array typeset.
 * @function rtvref.impl.checkTypeset
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset The Array typeset to check against.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid Array typeset.
 */
// @param {rtvref.impl._checkOptions} options (internal parameter)
const checkTypeset = function(value, typeset /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  if (!(options.isTypeset || isTypeset(typeset)) || !isArray(typeset)) {
    throw new Error(); // DEBUG TODO
  }

  // DEBUG TODO
};

/**
 * Checks a value against a typeset.
 * @function rtvref.impl.check
 * @param {*} value Value to check.
 * @param {rtvref.types.typeset} typeset Expected shape/type of the value.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} Success indicator if the `value`
 *  is compliant to the `typeset`; error indicator otherwise. An exception is
 *  __not__ thrown if the `value` is non-compliant.
 * @throws {Error} If `typeset` is not a valid typeset.
 */
// @param {rtvref.impl._checkOptions} options (internal parameter)
const check = function(value, typeset /*, options*/) {
  const options = _getCheckOptions(arguments.length > 2 ? arguments[2] : undefined);

  try {
    if (isTypeset(typeset)) {
      options.isTypeset = true;

      if (isString(typeset)) {
        // simple type: check value is of the type
        return checkType(value, typeset, options);
      }

      if (isFunction(typeset)) {
        // property validator: bare function implies the ANY type
        const tsMatch = types.ANY;
        const tsMatchFQ = fullyQualify(types.ANY);

        // value must be ANY type, and property validator must return true
        // NOTE: always check values against the _validatorMap
        const result = checkType(value, tsMatch, options);
        if (!result.valid) {
          return result;
        }

        if (typeset(value, tsMatchFQ, tsMatch)) {
          return new RtvSuccess();
        }

        return new RtvError(value, tsMatch, options.path, tsMatchFQ);
      }

      if (isObject(typeset)) {
        // shape descriptor: check value against shape
        return checkShape(value, typeset, options);
      }

      if (isArray(typeset)) {
        // Array typeset: check value against all types in typeset
        return checkTypeset(value, typeset, options);
      }

      throw new Error(`Missing handler for type of specified typeset="${print(typeset)}"`);
    } else {
      throw new Error(`Invalid typeset="${print(typeset)}" specified`);
    }
  } catch (checkErr) {
    const err = new Error(`Cannot check value: ${checkErr.message}`);
    err.rootCause = checkErr;
    throw err;
  }
};

/**
 * [Internal] Registers a validator, adding a new type that can be
 *  {@link rtvref.impl.check checked}.
 *
 * If a validator has already been registered for a particular type, the previous
 *  validator is replaced by the newer one.
 *
 * @private
 * @function rtvref.impl._registerType
 * @param {rtvref.validator} validator The validator representing the type to be
 *  registered.
 * @throws {Error} if `validator` does not have the expected interface.
 */
const _registerType = function(validator) {
  // NOTE: we can't dogfood and describe a shape to check() because the types
  //  needed may not have been registered yet
  if (!isObject(validator) || !types.check(validator.type) ||
      !isFunction(validator.config) || !isFunction(validator.default)) {

    throw new Error(`Cannot register an invalid validator for type="${print(validator && validator.type)}": missing at least one required property in [type, config, default]`);
  }

  _validatorMap[validator.type] = validator.default;
};

////////////////////////////////////////////////////////////////////////////////
// Define and export the module

// define the module to be exported: properties/methods with an underscore prefix
//  will be converted to non-enumerable properties/methods
const impl = {
  // internal
  _validatorMap, // exposed mainly to support unit testing
  _registerType,
  _getCheckOptions,
  // public
  fullyQualify,
  checkType,
  checkShape,
  checkTypeset,
  check
};

// make properties/methods with underscore prefix internal by making them
//  non-enumerable (but otherwise, a normal property)
Object.keys(impl).forEach(function(prop) {
  if (prop.indexOf('_') === 0) {
    Object.defineProperty(impl, prop, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: impl[prop]
    });
  }
});

export default impl;
