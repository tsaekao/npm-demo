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
 * @param {*} printValue Value to print.
 * @returns {string} Pretty-printed value. It's not perfect and may not catch
 *  all types, but attempts to be good enough.
 */
export const print = function(printValue) {
  // NOTE: key will be undefined when the replacer is called outside of the
  //  JSON.stringify() call, as well as for the first stringify() call
  const replacer = function(stringifying, key, value) {
    if (value === undefined || value === null) {
      return stringifying ? value : (value + '');
    }

    if (typeof value === 'string') {
      return stringifying ? value : `"${value}"`;
    }

    if (typeof value === 'number') { // also catches NaN
      return stringifying ? value : `${value}`;
    }

    if (typeof value === 'boolean') {
      return stringifying ? value : `${value}`;
    }

    if (typeof value === 'function') {
      return '<function>';
    }

    if (typeof value === 'symbol') {
      return value.toString();
    }

    return value; // keep stringifying since we're returning an object
  };

  const result = replacer(false, undefined, printValue);

  if (typeof result === 'string') {
    return result;
  }

  return JSON.stringify(result, replacer.bind(null, true)); // recursive
};
