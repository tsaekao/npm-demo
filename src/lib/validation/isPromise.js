////// isPromise validation

import types from '../types';

/**
 * Type: {@link rtvref.types.PROMISE PROMISE}
 * @const {string} rtvref.validation.isPromise.type
 */
export const type = types.PROMISE;

/**
 * {@link rtvref.validation.method Validation} for the
 *  {@link rtvref.types.PROMISE PROMISE} type.
 * @function rtvref.validation.isPromise.default
 * @param {*} v Value to validate.
 * @returns {boolean} `true` if validated; `false` otherwise.
 */
export default function isPromise(v) {
  return (v instanceof Promise);
}
