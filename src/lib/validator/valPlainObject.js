////// valPlainObject validator

import _forEach from 'lodash/forEach';

import { type, check as isPlainObject } from '../validation/isPlainObject';

import { qualifiers, valuePermitted } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';
import { check as isShape } from '../validation/isShape';

/**
 * Validator Module: valPlainObject
 * @typedef {Module} rtvref.validator.valPlainObject
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valPlainObject._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}
 * @const {string} rtvref.validator.valPlainObject.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valPlainObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT} type.
 * @function rtvref.validator.valPlainObject.validate
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.shape_object_args} [args] Type arguments.
 * @param {rtvref.validator.type_validator_context} context Validation context.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export const validate = function valPlainObject(
  v,
  q = REQUIRED,
  args,
  context
) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  if (!isPlainObject(v)) {
    return new RtvError(
      v,
      impl.toTypeset(type, q),
      [],
      impl.toTypeset(type, q, true)
    );
  }

  // validate the shape, if any
  const shape = args && args.$ && isShape(args.$) ? args.$ : undefined;
  let err; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  _forEach(shape, function (typeset, prop) {
    // check prop value against shape prop typeset
    const result = impl.check(v[prop], typeset, {
      originalValue: v, // let this get overwritten if `context` is specified
      ...context,
      parent: v,
      parentKey: prop,
    });

    if (!result.valid) {
      err = new RtvError(
        v,
        shape,
        [prop].concat(result.path),
        result.mismatch,
        result.rootCause
      );
    }

    return !err; // break on first error
  });

  return err || new RtvSuccess();
};
