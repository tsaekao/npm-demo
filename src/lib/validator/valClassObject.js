////// valClassObject validator

import _forEach from 'lodash/forEach';
import _difference from 'lodash/difference';

import { type, check as isClassObject } from '../validation/isClassObject';

import { qualifiers, valuePermitted } from '../qualifiers';
import { RtvSuccess } from '../RtvSuccess';
import { RtvError } from '../RtvError';
import { check as isShape } from '../validation/isShape';
import { check as isFunction } from '../validation/isFunction';
import { hasOwnProp } from '../util';

/**
 * Validator Module: valClassObject
 * @typedef {Module} rtvref.validator.valClassObject
 */

const { REQUIRED } = qualifiers;
let impl; // @type {rtvref.impl}

/**
 * [Internal] __FOR UNIT TESTING ONLY:__ The {@link rtvref.impl} instance
 *  configured on this validator.
 * @private
 * @name rtvref.validator.valClassObject._impl
 * @type {rtvref.impl}
 */
export { impl as _impl };

/**
 * Type: {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT}
 * @const {string} rtvref.validator.valClassObject.type
 */
export { type };

/**
 * {@link rtvref.validator.validator_config Configuration Function}
 * @function rtvref.validator.valClassObject.config
 * @param {rtvref.validator.validator_config_settings} settings Configuration settings.
 */
export const config = function (settings) {
  impl = settings.impl;
};

/**
 * {@link rtvref.validator.type_validator Validator} for the
 *  {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT} type.
 * @function rtvref.validator.valClassObject.validate
 * @param {*} v Value to validate.
 * @param {string} [q] Validation qualifier. Defaults to
 *  {@link rtvref.qualifiers.REQUIRED REQUIRED}.
 * @param {rtvref.types.shape_object_args} [args] Type arguments.
 * @param {rtvref.validator.type_validator_context} [context] Validation context.
 * @returns {(rtvref.RtvSuccess|rtvref.RtvError)} An `RtvSuccess` if valid; `RtvError` if not.
 */
export const validate = function valClassObject(
  v,
  q = REQUIRED,
  args,
  context
) {
  if (valuePermitted(v, q)) {
    return new RtvSuccess({ mvv: v }); // `v` is a falsy value which is the MVV also
  }

  const mvv = {}; // CLASS object is not necessarily a plain object, but we interpret it that way
  let valid = isClassObject(v);
  let error; // @type {rtvref.RtvError}
  let extraProps = []; // {Array<string>}

  if (valid && args) {
    // then check args
    // check constructor first since it's more efficient than the shape
    if (args.ctor && isFunction(args.ctor)) {
      valid = v instanceof args.ctor;
    }

    // now validate the shape, if any
    const hasShape = !!(args && args.$ && isShape(args.$));
    const shape = hasShape ? args.$ : {};
    const exact =
      hasShape &&
      !!(hasOwnProp(args, 'exact') // args take precedence if specified; ignore if no shape
        ? args.exact
        : context && context.options && context.options.exactShapes);

    if (valid && exact) {
      extraProps = _difference(Object.keys(v), Object.keys(shape));
      valid = extraProps.length <= 0;
    }

    if (valid) {
      let err; // @type {(RtvError|undefined)}

      // only consider enumerable, own-properties of the shape
      _forEach(shape, function (typeset, prop) {
        if (!typeset) {
          return; // ignore unspecified property typesets
        }

        // check prop value against shape prop typeset
        const propResult = impl.check(v[prop], typeset, {
          originalValue: v, // let this get overwritten if `context` is specified
          ...context,
          parent: v,
          parentKey: prop,
        });

        if (propResult.valid) {
          mvv[prop] = propResult.mvv; // use downstream MVV from check, not prop value
        } else {
          err = new RtvError(
            v,
            impl.toTypeset(type, q, args),
            [prop].concat(propResult.path),
            propResult.mismatch,
            propResult.rootCause
          );
        }

        return !err; // break on first error
      });

      valid = !err;
      error = err;
    }
  }

  if (!error) {
    if (valid) {
      error = new RtvSuccess({ mvv });
    } else {
      error = new RtvError(
        v,
        impl.toTypeset(type, q, args),
        [],
        impl.toTypeset(type, q, args, true),
        extraProps.length > 0
          ? new Error(
              `Found unexpected properties in value: '${extraProps.join(
                "', '"
              )}'`
            )
          : undefined
      );
    }
  }

  return error;
};
