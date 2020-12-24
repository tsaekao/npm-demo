import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valClassObject';

/* eslint-disable no-new-wrappers */

class Shape {
  constructor(name = 'shape') {
    this.name = name;
  }
}

class Rectangle extends Shape {
  constructor() {
    super('rectangle');
  }
}

describe('module: lib/validator/valClassObject', function () {
  let classObject;

  beforeEach(function () {
    classObject = new Rectangle();
  });

  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.CLASS_OBJECT);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, classObject);
    });

    it('valid values', function () {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}
      const overlaps = [
        types.ANY_OBJECT,
        types.OBJECT,
        types.PLAIN_OBJECT,
        types.CLASS_OBJECT,
        types.HASH_MAP,
      ];

      // remove overlaps
      _.pullAll(validTypes, overlaps);

      let invalidValues = [];
      _.forEach(validTypes, function (type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some non-overlap values back in
      invalidValues = invalidValues.concat([
        new String('new-string'),
        new Boolean(true),
        new Boolean(false),
        new Number(1),
        new Object(),
        Object.create(null),
        {},
      ]);

      // nothing should pass
      expect(
        vtu.testValues(val.type, val.default, invalidValues).passes
      ).to.eql([]);
    });
  });

  describe('qualifiers', function () {
    describe('rules are supported', function () {
      it('REQUIRED (other than values previously tested)', function () {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.REQUIRED);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.REQUIRED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.REQUIRED);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.REQUIRED
        );
      });

      it('EXPECTED', function () {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.EXPECTED);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.EXPECTED
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.EXPECTED);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.EXPECTED
        );
      });

      it('OPTIONAL', function () {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.OPTIONAL);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.OPTIONAL
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.OPTIONAL);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.OPTIONAL
        );
      });

      it('TRUTHY', function () {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.TRUTHY);
        vtu.expectAllToFail(
          val.type,
          val.default,
          restrictedValues,
          qualifiers.TRUTHY
        );

        const permittedValues = vtu.getPermittedValues(qualifiers.TRUTHY);
        vtu.expectAllToPass(
          val.type,
          val.default,
          permittedValues,
          qualifiers.TRUTHY
        );
      });
    });

    describe('are used in error typesets', function () {
      it('DEFAULT', function () {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function () {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function () {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function () {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });

  describe('arguments', function () {
    let checkStub;

    beforeEach(function () {
      checkStub = sinon.stub(val._impl, 'check');
    });

    afterEach(function () {
      checkStub.restore();
    });

    it('should ignore args.ctor if not a function', function () {
      vtu.expectValidatorSuccess(val, classObject, undefined, { ctor: 3 });
    });

    it('should require being an instanceof args.ctor', function () {
      vtu.expectValidatorSuccess(val, classObject, undefined, { ctor: Shape });

      vtu.expectValidatorError(val, classObject, undefined, {
        ctor: class {},
      });
    });

    it('should ignore args.$ if not a shape', function () {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, classObject, {});
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, classObject, { $: undefined });
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, classObject, { $: null });
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, classObject, { $: [3] });
      expect(checkStub.called).to.be.false;
    });

    it('should check value against shape', function () {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, classObject, undefined, {
        $: { name: types.STRING },
      });
      expect(checkStub.called).to.be.true;

      checkStub.resetHistory();
      checkStub.callThrough();

      vtu.expectValidatorError(
        val,
        classObject,
        undefined,
        {
          $: { name: types.INT },
        },
        {
          mismatch: [qualifiers.REQUIRED, types.INT],
          path: ['name'],
        }
      );
      expect(checkStub.called).to.be.true;
    });

    it('should not check args.$ if not an instanceof args.ctor', function () {
      vtu.expectValidatorError(val, classObject, undefined, {
        ctor: class {}, // this will fail
        $: { name: types.STRING }, // shape would match
      });
      expect(checkStub.called).to.be.false;
    });
  });

  describe('context', function () {
    it('should set parent to object and parentKey to property', function () {
      const validator = sinon.spy();
      const shape = {
        name: validator,
      };
      val.default(classObject, undefined, { $: shape });

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        classObject.name,
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: classObject, parent: classObject, parentKey: 'name' },
      ]);
    });
  });
});
