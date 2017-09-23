//// Qualifier Definitions \\\\

'use strict';

/**
 * @namespace qualifiers
 */

/**
 * Required qualifier: Property _must_ exist and be of the expected type.
 *  Depending on the type, additional requirements may be enforced.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.REQUIRED
 * @const {String}
 * @see {@link types}
 */
export var REQUIRED = '!';

/**
 * Expected qualifier: Property _should_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced.
 *
 * In general, an expected property must be defined, but could be `null`.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.EXPECTED
 * @const {String}
 * @see {@link types}
 */
export var EXPECTED = '+';

/**
 * Optional qualifier: Property _may_ exist and be of the expected type.
 *  Depending on the type, some requirements may not be enforced (i.e. less so
 *  than with the `EXPECTED` qualifier).
 *
 * In general, an optional property could be `undefined` (i.e does not need to be
 *  defined). If it is defined, then it is treated as an `EXPECTED` property.
 *
 * See specific type for additional rules.
 *
 * @name qualifiers.OPTIONAL
 * @const {String}
 * @see {@link types}
 */
export var OPTIONAL = '?';
