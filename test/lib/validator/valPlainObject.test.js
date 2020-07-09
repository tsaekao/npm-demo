import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valPlainObject';

/* eslint-disable no-new-wrappers */

describe('module: lib/validator/valPlainObject', function() {
  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.PLAIN_OBJECT);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, {});
    });

    it('valid values', function() {
      expect(vtu.testValues(val.type, val.default).failures).to.eql([]);
    });

    it('other types/values', function() {
      const validValues = vtu.getValidValues(); // @type {Object}
      const validTypes = Object.keys(validValues); // @type {Array}
      const overlaps = [
        types.ANY_OBJECT,
        types.OBJECT,
        types.PLAIN_OBJECT,
        types.CLASS_OBJECT,
        types.HASH_MAP
      ];

      // remove overlaps
      _.pullAll(validTypes, overlaps);

      let invalidValues = [];
      _.forEach(validTypes, function(type) {
        invalidValues = invalidValues.concat(validValues[type]);
      });

      // add some non-overlap values back in
      invalidValues = invalidValues.concat([
        new String('new-string'),
        new Boolean(true),
        new Boolean(false),
        new Number(1),
        new (class {})()
      ]);

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    describe('rules are supported', function() {
      it('REQUIRED (other than values previously tested)', function() {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.REQUIRED);
        vtu.expectAllToFail(val.type, val.default, restrictedValues, qualifiers.REQUIRED);

        const permittedValues = vtu.getPermittedValues(qualifiers.REQUIRED);
        vtu.expectAllToPass(val.type, val.default, permittedValues, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.EXPECTED);
        vtu.expectAllToFail(val.type, val.default, restrictedValues, qualifiers.EXPECTED);

        const permittedValues = vtu.getPermittedValues(qualifiers.EXPECTED);
        vtu.expectAllToPass(val.type, val.default, permittedValues, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.OPTIONAL);
        vtu.expectAllToFail(val.type, val.default, restrictedValues, qualifiers.OPTIONAL);

        const permittedValues = vtu.getPermittedValues(qualifiers.OPTIONAL);
        vtu.expectAllToPass(val.type, val.default, permittedValues, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function() {
        const restrictedValues = vtu.getRestrictedValues(qualifiers.TRUTHY);
        vtu.expectAllToFail(val.type, val.default, restrictedValues, qualifiers.TRUTHY);

        const permittedValues = vtu.getPermittedValues(qualifiers.TRUTHY);
        vtu.expectAllToPass(val.type, val.default, permittedValues, qualifiers.TRUTHY);
      });
    });

    describe('are used in error typesets', function() {
      it('DEFAULT', function() {
        vtu.expectValidatorError(val, 1); // default should be REQUIRED
      });

      it('REQUIRED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, 1, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorError(val, 1, qualifiers.OPTIONAL);
      });

      it('TRUTHY', function() {
        vtu.expectValidatorError(val, 1, qualifiers.TRUTHY);
      });
    });
  });

  describe('arguments', function() {
    let checkStub;

    beforeEach(function() {
      checkStub = sinon.stub(val._impl, 'check');
    });

    afterEach(function() {
      checkStub.restore();
    });

    it('should ignore args.$ if not a shape', function() {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, {foo: 3}, {});
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, {foo: 3}, {$: undefined});
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, {foo: 3}, {$: null});
      expect(checkStub.called).to.be.false;

      vtu.expectValidatorSuccess(val, {foo: 3}, {$: [3]});
      expect(checkStub.called).to.be.false;
    });

    it('should check value against shape', function() {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, {foo: 3}, undefined, {$: {foo: types.FINITE}});
      expect(checkStub.called).to.be.true;

      checkStub.resetHistory();
      checkStub.callThrough();

      vtu.expectValidatorError(val, {foo: 3}, undefined, {$: {foo: types.STRING}}, {
        typeset: {foo: types.STRING},
        mismatch: [qualifiers.REQUIRED, types.STRING],
        path: ['foo']
      });
      expect(checkStub.called).to.be.true;
    });
  });

  describe('context', function() {
    it('should set parent to object and parentKey to property', function() {
      const validator = sinon.spy();
      const shape = {
        foo: validator
      };
      const value = {
        foo: 'bar'
      };
      val.default(value, undefined, {$: shape});

      expect(validator.callCount).to.equal(1);
      expect(validator.firstCall.args).to.eql([
        'bar',
        [qualifiers.REQUIRED, types.ANY],
        validator,
        {originalValue: value, parent: value, parentKey: 'foo'}
      ]);
    });
  });
});
