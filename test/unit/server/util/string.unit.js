'use strict';

const chai = require('chai');
const expect = chai.expect;
const stringUtils = require('common/string.js');

describe('String utilities', () => {
  describe('String capitalization', () => {
    it('should convert "test" to "Test"', () => {
      expect(stringUtils.capitalize('test')).to.equal('Test');
    });

    it('should leave "Test" as "Test"', () => {
      expect(stringUtils.capitalize('Test')).to.equal('Test');
    });

    it('should leave "TEST" as "TEST"', () => {
      expect(stringUtils.capitalize('TEST')).to.equal('TEST');
    });

    it('should leave null as null', () => {
      expect(stringUtils.capitalize(null)).to.be.null;
    });

    it('should leave undefined as undefined', () => {
      expect(stringUtils.capitalize(undefined)).to.be.undefined;
    });

    it('should leave "" as ""', () => {
      expect(stringUtils.capitalize('a')).to.equal('A');
    });

    it('should convert "a" to "A"', () => {
      expect(stringUtils.capitalize('a')).to.equal('A');
    });
  });

  describe('String value parse', () => {
    it('should parse "undefined" as undefined', () => {
      expect(stringUtils.parseText('undefined')).to.be.undefined;
    });

    it('should parse "null" as null', () => {
      expect(stringUtils.parseText('null')).to.be.null;
    });

    it('should parse "NULL" as null', () => {
      expect(stringUtils.parseText('NULL')).to.be.null;
    });

    it('should parse "1.1" as the number 1.1', () => {
      const val = stringUtils.parseText('1.1');
      expect(val).to.be.a('number');
      expect(val).to.be.closeTo(1.1, 0.01);
    });

    it('should parse "true" as the boolean true', () => {
      const val = stringUtils.parseText('true');
      expect(val).to.be.a('boolean');
      expect(val).to.be.true;
    });

    it('should parse "TRUE" as the boolean true', () => {
      const val = stringUtils.parseText('TRUE');
      expect(val).to.be.a('boolean');
      expect(val).to.be.true;
    });

    it('should parse "false" as the boolean false', () => {
      const val = stringUtils.parseText('false');
      expect(val).to.be.a('boolean');
      expect(val).to.be.false;
    });

    it('should parse "FALSE" as the boolean false', () => {
      const val = stringUtils.parseText('FALSE');
      expect(val).to.be.a('boolean');
      expect(val).to.be.false;
    });

    it('should parse parse "abc" as NaN', () => {
      const val = stringUtils.parseText('abc');
      expect(val).to.be.NaN;
    });
  });
});
