import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import { types } from '../../../src/lib/types';
import { qualifiers } from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valAnyObject';

describe('module: lib/validator/valAnyObject', function () {
  describe('validator', function () {
    // module, and value only
    it('#type', function () {
      expect(val.type).to.equal(types.ANY_OBJECT);
    });

    it('succeeds with an RtvSuccess', function () {
      vtu.expectValidatorSuccess(val, {});
    });

    it('should validate any object', function () {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}

      // remove primitives
      _.pull(
        validTypes,
        types.ANY,
        types.NULL,
        types.STRING,
        types.BOOLEAN,
        types.NUMBER,
        types.FINITE,
        types.INT,
        types.SAFE_INT,
        types.FLOAT,
        types.SYMBOL
      );

      let values = [];
      _.forEach(validTypes, function (type) {
        values = values.concat(validValues[type]);
      });

      expect(vtu.testValues(val.type, val.default, values).failures).to.eql([]);
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

    it('should ignore args.$ if not a shape', function () {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, { foo: 3 }, {});
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: undefined });
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: null });
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, { foo: 3 }, { $: [3] });
      expect(checkStub.called).to.be.false;
    });

    it('should check value against shape', function () {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, { foo: 3 }, undefined, {
        $: { foo: types.FINITE },
      });
      expect(checkStub.called).to.be.true;

      checkStub.resetHistory();
      checkStub.callThrough();

      vtu.expectValidatorError(
        val,
        { foo: 3 },
        undefined,
        { $: { foo: types.STRING } },
        {
          typeset: { foo: types.STRING },
          mismatch: [qualifiers.REQUIRED, types.STRING],
          path: ['foo'],
        }
      );
      expect(checkStub.called).to.be.true;
    });
  });

  describe('context', function () {
    it('should set parent to object and parentKey to property', function () {
      const validator = sinon.spy();
      const shape = {
        foo: validator,
      };
      const value = {
        foo: 'bar',
      };
      val.default(value, undefined, { $: shape });

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        { originalValue: value, parent: value, parentKey: 'foo' },
      ]);
    });
  });
});
