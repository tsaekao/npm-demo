////// RtvSuccess Class

/**
 * Runtime Verification Success Indicator
 *
 * Describes a successful runtime verification of a value against a given
 *  {@link rtvref.types.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvSuccess
 * @param {Object} params
 * @param {*} params.mvv Minimum Viable Value representing the smallest version of the
 *  original value checked that satisfies the original Typeset against which it was
 *  checked. See the {@link rtvref.RtvSuccess#mvv mvv} property for more information.
 */
export class RtvSuccess {
  // JSDoc is provided at the @class level
  constructor({ mvv }) {
    Object.defineProperties(this, {
      /**
       * Flag indicating the validation succeeded. Always `true`.
       * @readonly
       * @name rtvref.RtvSuccess#valid
       * @type {boolean}
       * @see {@link rtvref.RtvError#valid}
       */
      valid: {
        enumerable: true,
        configurable: true,
        value: true,
      },

      /**
       * Minimum Viable Value (MVV). If the original value checked is one that can be deeply checked
       *  (see list below of supported types), this is essentially a __representation__ (stressing
       *  it is __not__ necessarily a clone) of the original value, __filtered__  by removing any
       *  parts of it that were not specifically checked (i.e. extra properties in an object that
       *  were not included in a shape, however deep it was nested, even in the key of a `Map`).
       *  Otherwise, it's a reference to the original value.
       *
       * Validating this value (instead of the original value) against the same Typeset would
       *  yield the same successful result.
       *
       * This property is most useful when checking a plain array or object (e.g. JSON API response)
       *  against an expected shape when the shape you care about is much smaller than the payload
       *  itself. Once the the check is complete, keep the minimum viable value instead of the larger
       *  original payload to reduce the overall memory footprint of your code.
       *
       * The following types are deeply checked and so will produce an MVV, but note the stated
       *  exceptions to types that are not plain objects (`{}`) or arrays (`[]`):
       *
       * - {@link rtvref.types.ARRAY ARRAY}: Note that none of the
       *   {@link rtvref.types.ARRAY_args ARRAY_args} except for the typeset (`$`) are used,
       *   which means items won't be removed if the array is longer than a stated `length`
       *   or `max` length.
       * - {@link rtvref.types.PLAIN_OBJECT PLAIN_OBJECT}
       * - {@link rtvref.types.OBJECT OBJECT}: Interpreted as an object (`{}`).
       * - {@link rtvref.types.CLASS_OBJECT CLASS_OBJECT}: Interpreted as an object (`{}`).
       * - {@link rtvref.types.HASH_MAP HASH_MAP}: Interpreted as an object (`{}`).
       * - {@link rtvref.types.ANY_OBJECT ANY_OBJECT}: Interpreted as an object (`{}`) because
       *   it's essentially treated as one when it's being checked.
       * - {@link rtvref.types.MAP MAP}: Interpreted as the native `Map` type.
       * - {@link rtvref.types.SET SET}: Interpreted as the native `Set` type.
       *
       * All other types will be referenced, not interpreted.
       *
       * __NOTE:__ The MVV will based on the {@link rtvref.types.typeset Typeset} that validates
       *  the original value. If you use an Array Typeset with multiple possibilities for an
       *  object value to check (e.g. `[OBJECT, { $: { foo: NUMBER } }, OBJECT, { $: { bar: STRING } }]`),
       *  the resulting MVV will use the matching sub-Typeset. Checking `{ foo: 1, bar: 'a' }` would
       *  result in `{ foo: 1 }` as the MVV because `OBJECT, { $: { foo: NUMBER } }` is the first
       *  sub-Typeset in the list, and so the first match.
       *
       * @readonly
       * @name rtvref.RtvSuccess#mvv
       * @type {*}
       */
      mvv: {
        enumerable: true,
        configurable: true,
        value: mvv,
      },
    });
  }

  /**
   * A string representation of this instance.
   * @method rtvref.RtvSuccess#toString
   * @returns {string} String representation.
   */
  toString() {
    return '{rtvref.RtvSuccess}';
  }
}
