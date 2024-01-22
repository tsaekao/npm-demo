import * as util from '../../src/lib/util';
import * as vtu from './validationTestUtil';

describe('module: lib/util', () => {
  describe('#print', () => {
    it('should print just about anything', () => {
      // simple/single values
      expect(util.print(null)).toBe('null');
      expect(util.print(undefined)).toBe('undefined');
      expect(util.print('')).toBe('""');
      expect(util.print('foo')).toBe('"foo"');
      expect(util.print(false)).toBe('false');
      expect(util.print(123)).toBe('123');
      expect(util.print(NaN)).toBe('NaN');
      expect(util.print(() => {})).toBe('<function>');
      expect(util.print(Symbol('foo'))).toBe('Symbol(foo)');
      expect(util.print([])).toBe('[]');
      expect(util.print({})).toBe('{}');

      // complex values
      expect(util.print([true])).toBe('[true]');
      expect(util.print([1, [2, 'three']])).toBe('[1,[2,"three"]]');
      expect(util.print({ foo: 1 })).toBe('{"foo":1}');
      expect(util.print({ foo: [1, { bar: 2 }] })).toBe(
        '{"foo":[1,{"bar":2}]}'
      );
    });

    it('should special-case functions as validators when printing typesets', () => {
      expect(util.print(['STRING', () => {}], { isTypeset: true })).toBe(
        '["STRING","<validator>"]'
      );
    });

    it('should special-case "ctor" as "<constructor>" and other as "<function>"', () => {
      expect(
        util.print(
          ['CLASS_OBJECT', { ctor: () => {}, foo: () => {} }, () => {}],
          { isTypeset: true }
        )
      ).toBe(
        '["CLASS_OBJECT",{"ctor":"<constructor>","foo":"<function>"},"<validator>"]'
      );
    });
  });

  describe('#hasOwnProp', () => {
    it('should determine that a prop is an own-prop of an object', () => {
      const obj = Object.create({ foo: 'not own-prop' });
      obj.bar = 'own-prop';

      expect(util.hasOwnProp(obj, 'foo')).toBe(false);
      expect(util.hasOwnProp(obj, 'bar')).toBe(true);
    });

    it('should return false if object is falsy', () => {
      vtu.getFalsyValues().forEach((falsyValue) => {
        expect(util.hasOwnProp(falsyValue)).toBe(false);
      });
    });
  });
});
