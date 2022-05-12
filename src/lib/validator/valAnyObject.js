////// valAnyObject validator

import _forEach from 'lodash/forEach';
import _difference from 'lodash/difference';

import { type, check as isAnyObject } from '../validation/isAnyObject';

import { qualifiers, valuePermitted } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';
import { check as isShape } from '../validation/isShape';
import { hasOwnProp } from '../util';

/**
 * Validator Module: valAnyObject
 * @typedef {Module} rtvref.validator.valAnyObject
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valAnyObject._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.ANY_OBJECT ANY_OBJECT}
 * @const {string} rtvref.validator.valAnyObject.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valAnyObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.ANY_OBJECT ANY_OBJECT} type.
 * @function rtvref.validator.valAnyObject.validate
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.shape_object_args} [args] Type arguments.
 * @param {rtvref.validator.type_validator_context} [context] Validation context.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export const validate = function valAnyObject(v, q = REQUIRED, args, context) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess({ mvv: v }); // `v` is a falsy value which is the MVV also
  }

  // validate the shape, if any
  const hasShape = !!(args && args.$ && isShape(args.$));
  const shape = hasShape ? args.$ : {};
  const exact =
    hasShape &&
    !!(hasOwnProp(args, 'exact') // args take precedence if specified; ignore if no shape
      ? args.exact
      : context && context.options && context.options.exactShapes);
  const extraProps = exact
    ? _difference(Object.keys(v), Object.keys(shape))
    : [];

  if (!isAnyObject(v) || extraProps.length > 0) {
    return new RtvError(
      v,
      impl.toTypeset(type, q, args),
      [],
      impl.toTypeset(type, q, args, true),
      extraProps.length > 0
        ? new Error(
            `Found unexpected properties in value: '${extraProps.join("', '")}'`
          )
        : undefined
    );
  }

  const mvv = {}; // ANY object is not necessarily a plain object, but we interpret it that way
  let err; // @type {(RtvError|undefined)}

  // only consider enumerable, own-properties of the shape
  _forEach(shape, function (typeset, prop) {
    if (!typeset) {
      return; // ignore unspecified property typesets
    }

    // check prop value against shape prop typeset
    const result = impl.check(v[prop], typeset, {
      originalValue: v, // let this get overwritten if `context` is specified
      ...context,
      parent: v,
      parentKey: prop,
    });

    if (result.valid) {
      mvv[prop] = result.mvv; // use downstream MVV from check, not prop value
    } else {
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

  return err || new RtvSuccess({ mvv });
};
