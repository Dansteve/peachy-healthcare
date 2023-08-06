import { AbstractControl } from '@angular/forms';
import * as utils from './form-validator';
import { trace } from './spec-runner';

describe('src/app/utils/form-validator.ts', () => {

  describe('matchRegExpPattern()', () => {
    const names = /^[a-zA-Z- ']+$/;
    const zipcodes = /^[0-9']{5}$/;

    const positive = [
      { type: 'names', input: 'geordi la forge', regex: names },
      { type: 'names', input: 'Jean-Luc Picard', regex: names },
      { type: 'names', input: 'WILLIAM RIKER', regex: names },
      { type: 'zipcodes', input: '12345', regex: zipcodes },
    ];

    const negative = [
      { type: 'names', input: 'Species 8472', regex: names },
      { type: 'names', input: 'picard@enterprise.com', regex: names },
      { type: 'names', input: 'WILLIAM RIKER !!!!', regex: names },
      { type: 'zipcodes', input: '12', regex: zipcodes },
      { type: 'zipcodes', input: '1234567', regex: zipcodes },
    ];

    positive.forEach(item => {
      const { type, input, regex } = item;
      it(`should return true for well-formatted ${type} (${trace(input)})`, () => {
        const expected = true;
        const actual = utils.matchRegExpPattern(input, regex);

        expect(actual).toBe(expected);
      });
    });

    negative.forEach(item => {
      const { type, input, regex } = item;
      it(`should return false for badly formatted ${type} (${trace(input)})`, () => {
        const expected = false;
        const actual = utils.matchRegExpPattern(input, regex);

        expect(actual).toBe(expected);
      });
    });
  });

  describe('validateInputWithReqExp()', () => {
    const names = /^[a-zA-Z- ']+$/;
    const zipcodes = /^[0-9']{5}$/;

    const positive = [
      { type: 'names', input: 'geordi la forge', regex: names },
      { type: 'names', input: 'Jean-Luc Picard', regex: names },
      { type: 'names', input: 'WILLIAM RIKER', regex: names },
      { type: 'zipcodes', input: '12345', regex: zipcodes },
    ];

    const negative = [
      { type: 'names', input: 'Species 8472', regex: names },
      { type: 'names', input: 'picard@enterprise.com', regex: names },
      { type: 'names', input: 'WILLIAM RIKER !!!!', regex: names },
      { type: 'zipcodes', input: '12', regex: zipcodes },
      { type: 'zipcodes', input: '1234567', regex: zipcodes },
    ];

    positive.forEach(item => {
      const { type, input, regex } = item;
      it(`should return true for well-formatted ${type} (${trace(input)})`, () => {
        const expected = true;
        const actual = utils.validateInputWithReqExp({ value: input } as AbstractControl)(regex);

        expect(actual).toBe(expected);
      });
    });

    negative.forEach(item => {
      const { type, input, regex } = item;
      it(`should return false for badly formatted ${type} (${trace(input)})`, () => {
        const expected = false;
        const actual = utils.validateInputWithReqExp({ value: input } as AbstractControl)(regex);

        expect(actual).toBe(expected);
      });
    });

    it('should return false if \'control\' is undefined', () => {
      const expected = false;
      const actual = utils.validateInputWithReqExp(undefined as unknown as AbstractControl)(names);

      expect(actual).toBe(expected);
    });

    it('should return false if \'control.value\' is undefined', () => {
      const expected = false;
      const actual = utils.validateInputWithReqExp({} as AbstractControl)(names);

      expect(actual).toBe(expected);
    });
  });

  describe('isValidZipCode()', () => {
    const positive = ['00000', '22222', '44444'];

    const negative = ['12', '1234567'];

    positive.forEach(input => {
      it(`should return true for well-formatted zipcodes (${trace(input)})`, () => {
        const expected = true;
        const actual = utils.isValidZipCode({ value: input } as AbstractControl);

        expect(actual).toBe(expected);
      });
    });

    negative.forEach(input => {
      it(`should return false for badly formatted zipcodes (${trace(input)})`, () => {
        const expected = false;
        const actual = utils.isValidZipCode({ value: input } as AbstractControl);

        expect(actual).toBe(expected);
      });
    });
  });

  describe('isValidName()', () => {
    const positive = ['geordi la forge', 'Jean-Luc Picard', 'WILLIAM RIKER',];

    const negative = ['Species 8472', 'picard@enterprise.com', 'WILLIAM RIKER !!!!'];

    positive.forEach(input => {
      it(`should return true for well-formatted names (${trace(input)})`, () => {
        const expected = true;
        const actual = utils.isValidName({ value: input } as AbstractControl);

        expect(actual).toBe(expected);
      });
    });

    negative.forEach(input => {
      it(`should return false for badly formatted names (${trace(input)})`, () => {
        const expected = false;
        const actual = utils.isValidName({ value: input } as AbstractControl);

        expect(actual).toBe(expected);
      });
    });
  });

});
