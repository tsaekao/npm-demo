//// Enumeration \\\\

'use strict';

/**
 * Simple enumeration type.
 * @class Enumeration
 * @param {Object.<String,*>} map Object mapping keys to values. Values cannot
 *  be `undefined`.
 * @throws {Error} If `map` is falsy or empty.
 * @throws {Error} If `map` has a key that maps to `undefined`.
 */
var Enumeration = function(map) {
    map = map || {};

    var keys = Object.keys(map);
    var values = [];

    if (keys.length === 0) {
        throw new Error('map must contain at least one key');
    }

    // shallow-clone each key in the map into this
    keys.forEach((key) => {
        if (map[key] === undefined) {
            throw new Error('map[' + key + '] cannot be undefined');
        }

        var value = map[key];
        values.push(value);
        this[key] = value;
    });

    /**
     * [internal] List of enumeration values.
     * @name Enumeration#_values
     * @type Array.<String>
     */
    Object.defineProperty(this, '_values', {
        enumerable: false, // internal
        configurable: true,
        value: values
    });
};

/**
 * Validates a value as being in this enumeration. Throws an exception if the value
 *  is not in this enumeration, unless `silent` is true.
 * @method Enumeration#validate
 * @param {*} value Value to check. Cannot be undefined.
 * @param {Boolean} [silent=false] If truthy, returns `undefined` instead of throwing
 *  an exception if the specified value is not in this enumeration.
 * @returns {*} The specified value if it is in this enumeration, or `undefined` if
 *  `silent` is true and the value is not in this enumeration.
 */
Enumeration.prototype.validate = function(value, silent) {
    if (this._values.indexOf(value) >= 0) {
        return value;
    } else if (silent) {
        return undefined;
    } else {
        throw new Error('invalid value for enum[' + this._values.join(', ') + ']: ' + value);
    }
};

export default Enumeration;
