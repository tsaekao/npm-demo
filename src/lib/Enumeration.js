////// Enumeration

import {print} from './util';

/**
 * Simple enumeration type. Own-properties on an instance are the keys in the
 *  specified `map`, with their associated values. Key names cannot start with
 *  "$".
 *
 * <pre><code>const state = new Enumeration({
 *   READY: 1,
 *   RUNNING: 2,
 *   STOPPED: 3,
 *   COMPLETE: 4
 * });
 *
 * state.RUNNING; // 2
 * state.verify(3); // 3 (returns the value since found in enumeration)
 * state.verify(5); // ERROR thrown
 * state.check(3); // 3 (same as verify(3) since found in enumeration)
 * state.check(5); // undefined (silent failure)
 * state.$values; // [1, 2, 3, 4] (special non-enumerable own-property)
 * </code></pre>
 *
 * @class rtvref.Enumeration
 * @param {Object.<String,*>} map Object mapping keys to values. Values cannot
 *  be `undefined`.
 * @param {string} [name] Friendly name used to identify this enumeration,
 *  especially in validation error messages.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 * @throws {Error} If `map` contains a duplicate value.
 * @throws {Error} If `map` has a key that is a restricted property (starts with
 *  "$").
 */
export default class Enumeration {
  // JSDoc is provided at the @class level
  constructor(map, name) {
    map = map || {};

    const keys = Object.keys(map);
    const values = [];

    if (keys.length === 0) {
      throw new Error('map must contain at least one key');
    }

    // shallow-clone each key in the map into this
    keys.forEach((key) => {
      if (key.indexOf('$') === 0) {
        throw new Error(`map key "${key}" cannot start with "$"`);
      }

      if (map[key] === undefined) {
        throw new Error(`map[${key}] cannot be undefined`);
      }

      const value = map[key];
      if (values.indexOf(value) >= 0) {
        throw new Error(`map[${key}] is a duplicate value: ${print(value)}`);
      }

      values.push(value);
      this[key] = value;
    });

    /**
     * Friendly name (not necessarily unique among all enumeration instances)
     *  used to identify this enumeration, especially in validation error
     *  messages. Empty string if not specified during construction.
     * @readonly
     * @name rtvref.Enumeration#$name
     * @type {string}
     */
    Object.defineProperty(this, '$name', {
      enumerable: false,
      configurable: true,
      value: name || ''
    });

    /**
     * List of enumeration values. Values are _references_ to values in this
     *  enumeration.
     *
     * Note that this own-property is non-enumerable on purpose. Enumerable
     *  properties on this instance are the keys in this enumeration.
     *
     * @readonly
     * @name rtvref.Enumeration#$values
     * @type {Array.<String>}
     */
    Object.defineProperty(this, '$values', {
      enumerable: false,
      configurable: true,
      get() {
        return values.concat(); // shallow clone
      }
    });
  }

  /**
   * Checks if a value is in this enumeration.
   * @method rtvref.Enumeration#check
   * @param {*} value Value to check. Cannot be undefined.
   * @returns {(*|undefined)} The specified value if it is in this enumeration, or `undefined`
   *  if not. An exception is __not__ thrown if the value is not in this enumeration.
   * @see {@link rtvref.Enumeration#verify}
   */
  check(value) {
    if (this.$values.indexOf(value) >= 0) {
      return value;
    }

    return undefined;
  }

  /**
   * Validates a value as being in this enumeration. Throws an exception if the value
   *  is not in this enumeration, unless `silent` is true.
   * @method rtvref.Enumeration#verify
   * @param {*} value Value to check. Cannot be undefined.
   * @param {boolean} [silent=false] If truthy, returns `undefined` instead of throwing
   *  an exception if the specified value is not in this enumeration.
   * @returns {*} The specified value if it is in this enumeration, or `undefined` if
   *  `silent` is true and the value is not in this enumeration.
   * @throws {Error} If not `silent` and the value is not in this enumeration.
   * @see {@link rtvref.Enumeration#check}
   */
  verify(value, silent) {
    const result = this.check(value);

    if (result === undefined && !silent) {
      throw new Error(`Invalid value for ${this.$name ? `${print(this.$name)} ` : ''}enumeration (${this.$values.map(print).join(', ')}): ${print(value)}`);
    }

    return result;
  }

  /**
   * A string representation of this Enumeration.
   * @method rtvref.Enumeration#toString
   * @returns {string} String representation.
   */
  toString() {
    const pairs = Object.keys(this).map((k) => [k, this[k]]);
    return `{rtvref.Enumeration $name=${print(this.$name)} pairs=[${pairs.map(print).join(', ')}]}`;
  }
}
