import { expect } from 'chai';

import * as util from '../../src/lib/util';
import * as vtu from './validationTestUtil';

describe('module: lib/util', function () {
  describe('#print', function () {
    it('should print just about anything', function () {
      // simple/single values
      expect(util.print(null)).to.equal('null');
      expect(util.print(undefined)).to.equal('undefined');
      expect(util.print('')).to.equal('""');
      expect(util.print('foo')).to.equal('"foo"');
      expect(util.print(false)).to.equal('false');
      expect(util.print(123)).to.equal('123');
      expect(util.print(NaN)).to.equal('NaN');
      expect(util.print(() => {})).to.equal('<function>');
      expect(util.print(Symbol('foo'))).to.equal('Symbol(foo)');
      expect(util.print([])).to.equal('[]');
      expect(util.print({})).to.equal('{}');

      // complex values
      expect(util.print([true])).to.equal('[true]');
      expect(util.print([1, [2, 'three']])).to.equal('[1,[2,"three"]]');
      expect(util.print({ foo: 1 })).to.equal('{"foo":1}');
      expect(util.print({ foo: [1, { bar: 2 }] })).to.equal(
        '{"foo":[1,{"bar":2}]}'
      );
    });

    it('should special-case functions as validators when printing typesets', function () {
      expect(util.print(['STRING', () => {}], { isTypeset: true })).to.equal(
        '["STRING","<validator>"]'
      );
    });
  });

  describe('#hasOwnProp', function () {
    it('should determine that a prop is an own-prop of an object', function () {
      const obj = Object.create({ foo: 'not own-prop' });
      obj.bar = 'own-prop';

      expect(util.hasOwnProp(obj, 'foo')).to.equal(false);
      expect(util.hasOwnProp(obj, 'bar')).to.equal(true);
    });

    it('should return false if object is falsy', function () {
      vtu.getFalsyValues().forEach((falsyValue) => {
        expect(util.hasOwnProp(falsyValue)).to.equal(false);
      });
    });
  });
});
