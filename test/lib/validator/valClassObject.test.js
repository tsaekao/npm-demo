import {expect} from 'chai';
import sinon from 'sinon';
import _ from 'lodash';

import * as vtu from '../validationTestUtil';
import types from '../../../src/lib/types';
import qualifiers from '../../../src/lib/qualifiers';
import * as val from '../../../src/lib/validator/valClassObject';

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

describe('module: lib/validator/valClassObject', function() {
  let classObject;

  beforeEach(function() {
    classObject = new Rectangle();
  });

  describe('validator', function() { // module, and value only
    it('#type', function() {
      expect(val.type).to.equal(types.CLASS_OBJECT);
    });

    it('succeeds with an RtvSuccess', function() {
      vtu.expectValidatorSuccess(val, classObject);
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
        new Object(),
        Object.create(null),
        {}
      ]);

      // nothing should pass
      expect(vtu.testValues(val.type, val.default, invalidValues).passes).to.eql([]);
    });
  });

  describe('qualifiers', function() {
    describe('rules are supported', function() {
      it('REQUIRED (other than values previously tested)', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.REQUIRED);
        vtu.expectValidatorError(val, null, qualifiers.REQUIRED);
      });

      it('EXPECTED', function() {
        vtu.expectValidatorError(val, undefined, qualifiers.EXPECTED);
        vtu.expectValidatorSuccess(val, null, qualifiers.EXPECTED);
      });

      it('OPTIONAL', function() {
        vtu.expectValidatorSuccess(val, undefined, qualifiers.OPTIONAL);
        vtu.expectValidatorSuccess(val, null, qualifiers.OPTIONAL);
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

    it('should ignore args.ctr if not a function', function() {
      vtu.expectValidatorSuccess(val, classObject, undefined, {ctr: 3});
    });

    it('should require being an instanceof args.ctr', function() {
      vtu.expectValidatorSuccess(val, classObject, undefined, {ctr: Shape});

      vtu.expectValidatorError(val, classObject, undefined, {
        ctr: class {}
      });
    });

    it('should ignore args.shape if not a shape', function() {
      val.default(classObject, undefined, {shape: 3});
      expect(checkStub.called).to.be.false;
    });

    it('should check value against shape', function() {
      checkStub.callThrough();

      vtu.expectValidatorSuccess(val, classObject, undefined, {
        shape: {name: types.STRING}
      });
      expect(checkStub.called).to.be.true;

      checkStub.reset();
      checkStub.callThrough();

      vtu.expectValidatorError(val, classObject, undefined, {
        shape: {name: types.INT}
      }, {
        cause: [qualifiers.REQUIRED, types.INT],
        path: ['name']
      });
      expect(checkStub.called).to.be.true;
    });

    it('should not check args.shape if not an instanceof args.ctr', function() {
      vtu.expectValidatorError(val, classObject, undefined, {
        ctr: class{}, // this will fail
        shape: {name: types.STRING} // shape would match
      });
      expect(checkStub.called).to.be.false;
    });
  });
});