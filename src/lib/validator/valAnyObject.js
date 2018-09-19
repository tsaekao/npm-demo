////// valAnyObject validator

import _forEach from 'lodash/forEach';

import {type, default as isAnyObject} from '../validation/isAnyObject';

import {default as qualifiers, nilPermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';
import isShape from '../validation/isShape';

/**
 * Validator Module: valAnyObject
 * @typedef {Module} rtvref.validator.valAnyObject
 */

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valAnyObject._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.ANY_OBJECT ANY_OBJECT}
 * @const {string} rtvref.validator.valAnyObject.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valAnyObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 * @function rtvref.validator.valAnyObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.numeric_args} [args] Type arguments.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valAnyObject(v, q = REQUIRED, args) {
  if (nilPermitted(v, q)) {
    return new RtvSuccess();
  }

  if (!isAnyObject(v)) {
    return new RtvError(v, impl.toTypeset(type, q), [], impl.toTypeset(type, q, true));
  }

  // args is the optional shape: ignore if it isn't a shape, like other validators
  //  ignore invalid args properties
  const shape = (args && isShape(args)) ? args : undefined;
  let err; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  _forEach(shape, function(typeset, prop) {
    const result = impl.check(v[prop], typeset); // check prop value against shape prop typeset

    if (!result.valid) {
      err = new RtvError(v, shape, [prop].concat(result.path), result.cause);
    }

    return !err; // break on first error
  });

  return err || (new RtvSuccess());
}
