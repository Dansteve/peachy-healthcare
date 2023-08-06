import * as utils from './functional';
import { trace, kind } from './spec-runner';

describe('src/app/utils/functional.ts', () => {

  describe('isNil()', () => {

    const positive = [null, undefined, NaN];
    const negative = [0, 1, '', 'any length', true, false, {}, []];

    positive.forEach(item => {
      it(`should return true for ${trace(item)}`, () => {
        const expected = true;
        const actual = utils.isNil(item);
        expect(actual).toBe(expected);
      });
    });

    negative.forEach(item => {
      it(`should return false for ${kind(item)}`, () => {
        const expected = false;
        const actual = utils.isNil(item);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('isEmpty()', () => {

    it('should return true for empty arrays', () => {
      const expected = true;
      const actual = utils.isEmpty([]);
      expect(actual).toBe(expected);
    });

    it('should return false for non-empty arrays', () => {
      const expected = false;
      const actual = utils.isEmpty(['not empty']);
      expect(actual).toBe(expected);
    });

    const negative = [0, 1, '', 'any length', true, false, {}];

    negative.forEach(item => {
      it(`should return false for ${kind(item)}`, () => {
        const expected = false;
        const actual = utils.isNil(item);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('isEmptyArray()', () => {
    const positive = [1, '2', true, 0, '4', NaN, {}, []];
    const negative = [1, '2', true, 0, '4', NaN, {}, ['not empty']];

    it('should return true for lists with empty arrays', () => {
      const expected = true;
      const actual = utils.isEmptyArray(positive);
      expect(actual).toBe(expected);
    });

    it('should return false for lists with no empty arrays', () => {
      const expected = false;
      const actual = utils.isEmptyArray(negative);
      expect(actual).toBe(expected);
    });
  });

  describe('isEmptyObject()', () => {
    it('should return true for empty objects', () => {
      const expected = true;
      const actual = utils.isEmptyObject({});
      expect(actual).toBe(expected);
    });

    it('should return false for non-empty objects', () => {
      const expected = false;
      const actual = utils.isEmptyObject({ hello: 'world' });
      expect(actual).toBe(expected);
    });
  });

  describe('isString()', () => {

    const positive = ['', 'any length'];
    const negative = [0, 1, true, false, {}, []];

    it('should return true for strings of any length', () => {
      positive.forEach(item => {
        const expected = true;
        const actual = utils.isString(item);
        expect(actual).toBe(expected);
      });
    });

    negative.forEach(item => {
      it(`should return false for ${kind(item)}`, () => {
        const expected = false;
        const actual = utils.isString(item);
        expect(actual).toBe(expected);
      });
    });

  });

  describe('maybe()', () => {
    const positive = [0, 1, '2', true, false, {}, []];
    const negative = [null, undefined, NaN];

    positive.forEach(item => {
      it(`should return the data for ${kind(item)}`, () => {
        const expected = item;
        const actual = utils.maybe(item).unwrapOr('fallback');
        expect(actual).toBe(expected);
      });
    });

    negative.forEach(item => {
      it(`should return the fallback for ${trace(item)}`, () => {
        const expected = 'fallback';
        const actual = utils.maybe(item).unwrapOr('fallback');
        expect(actual).toBe(expected);
      });
    });
  });
});
