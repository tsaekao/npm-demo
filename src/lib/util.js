//// Utilities \\\\

/**
 * RTV Utilities Module
 * @private
 * @namespace rtv.util
 */

/**
 * Pretty-print a value.
 * @param {*} value Value to print.
 * @returns {string} Pretty-printed value. It's not perfect and may not catch
 *  all types, but attempts to be good enough.
 */
export const print = function(value) {
  if (typeof value === 'function') {
    return '<function>';
  } else if (value === null || value === undefined) {
    return value + '';
  }

  return JSON.stringify(value);
};
