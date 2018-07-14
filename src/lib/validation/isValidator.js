////// isValidator validation module

import isFunction from '../validator/isFunction';

/**
 * Determines if a value is a {@link rtvref.types.custom_validator custom validator}.
 * @function rtvref.validation.isValidator
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if it is; `false` otherwise.
 */
export default function isValidator(v) {
  // TODO[plugins]: should this module be renamed to isCustomValidator since it's
  //  perhaps overloaded with 'validator' concept for plugins @see rtvref.validator?
  return isFunction(v);
}
