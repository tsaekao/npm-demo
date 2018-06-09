////// Utilities

// NOTE: Ideally, this module has no dependencies. If it must, they should be
//  third-party/external dependencies to avoid circular dependencies within
//  this library.

/**
 * RTV Utilities Module
 * @private
 * @namespace rtv.util
 */

/**
 * Pretty-print a value.
 * @function rtv.util.print
 * @param {*} value Value to print.
 * @returns {string} Pretty-printed value. It's not perfect and may not catch
 *  all types, but attempts to be good enough.
 */
export const print = function(value) {
  const replacer = function replacer(key, val) {
    if (typeof val === 'function') {
      return '<function>';
    } else if (typeof val === 'symbol') {
      return `<<${val.toString()}>>`;
    } else if (val === null || val === undefined) {
      return val + '';
    }

    return val;
  };

  // do an initial pass to see if we have a string
  const result = replacer(undefined, value);

  // if it's just a string, return it
  if (typeof result === 'string') {
    return result;
  }

  // otherwise, stringify it
  return JSON.stringify(value, replacer);
};
