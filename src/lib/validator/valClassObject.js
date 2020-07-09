////// valClassObject validator

import _forEach from 'lodash/forEach';

import {type, default as isClassObject} from '../validation/isClassObject';

import {default as qualifiers, valuePermitted} from '../qualifiers';
import RtvSuccess from '../RtvSuccess';
import RtvError from '../RtvError';
import isShape from '../validation/isShape';
import isFunction from '../validation/isFunction';

/**
 * Validator Module: valClassObject
 * @typedef {Module} rtvref.validator.valClassObject
 */

const {REQUIRED} = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valClassObject._impl
 * @type {rtvref.impl}
 */
export {impl as _impl};

/**
 * Type: {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT}
 * @const {string} rtvref.validator.valClassObject.type
 */
export {type};

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valClassObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function(settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} type.
 * @function rtvref.validator.valClassObject.default
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.shape_object_args} [args] Type arguments.
 * @param {rtvref.validator.type_validator_context} context Validation context.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export default function valClassObject(v, q = REQUIRED, args, context) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess();
  }

  let valid = isClassObject(v);
  let result; // @type {(rtvref.RtvSuccess|rtvref.RtvError)}

  if (valid && args) { // then check args
    // check constructor first since it's more efficient than the shape
    if (args.ctor && isFunction(args.ctor)) {
      valid = (v instanceof args.ctor);
    }

    if (valid) {
      // now validate the shape, if any
      const shape = (args.$ && isShape(args.$)) ? args.$ : undefined;
      let err; // @type {(RtvError|undefined)}

      // only consider enumerable, own-properties of the shape
      _forEach(shape, function(typeset, prop) {
        // check prop value against shape prop typeset
        const propResult = impl.check(v[prop], typeset, {
          originalValue: v, // let this get overwritten if `context` is specified
          ...context,
          parent: v,
          parentKey: prop
        });

        if (!propResult.valid) {
          err = new RtvError(v, impl.toTypeset(type, q, args),
              [prop].concat(propResult.path), propResult.mismatch, propResult.rootCause);
        }

        return !err; // break on first error
      });

      valid = !err;
      result = err;
    }
  }

  if (!result) {
    if (valid) {
      result = new RtvSuccess();
    } else {
      result = new RtvError(v, impl.toTypeset(type, q, args), [],
          impl.toTypeset(type, q, args, true));
    }
  }

  return result;
}
