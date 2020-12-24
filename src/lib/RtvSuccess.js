////// RtvSuccess Class

/**
 * Runtime Verification Success Indicator
 *
 * Describes a successful runtime verification of a value against a given
 *  {@link rtvref.types.shape_descriptor shape} or {@link rtvref.types.typeset typeset}
 *  (note that a shape is a type of typeset).
 *
 * @class rtvref.RtvSuccess
 */
export class RtvSuccess {
  // JSDoc is provided at the @class level
  constructor() {
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
