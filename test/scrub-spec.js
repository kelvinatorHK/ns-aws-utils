'use strict';

const assert = require('assert');
const scrub = require('../src/scrub');

describe('scrub', function() {
    it('should return an empty object', function() {
        let obj = {};

        assert.deepEqual(scrub(obj), obj, 'It should be the same');
    });

    it('should return the same simple object without scrubbing', function() {
        let obj = {
            attr1: 'abc',
            attr2: 'xyz'
        };

        assert.deepEqual(scrub(obj), obj, 'It should be the same');
    });

    it('should return the same complex object without scrubbing', function() {
        let obj = {
            attr1: 'abc',
            attr2: 'xyz',
            attr3: {
                sub1: 'sub value',
                sub2: {
                    smaller1: 'smaller1 value',
                    smaller2: 'smaller2 value'
                }
            }
        };

        assert.deepEqual(scrub(obj), obj, 'It should be the same');
    });

    it('should handle the array without scrubbing', function() {
        let obj = {
            attr1: 'abc',
            attr2: ['a1', 'a2']
        };

        assert.deepEqual(scrub(obj), obj, 'It should be the same');
    });

    it('should scrub the sensitive data in the first level', function() {
        let obj = {
            password: 'secret',
            attr2: 'xyz'
        };

        let scrubbed = scrub(obj);
        assert.equal(scrubbed.password, '********', 'The sensitive data should be scrubbed');
    });

    it('should scrub the sensitive data in the inner structure', function() {
        let obj = {
            attr1: {
                IBAN: 'secret',
                inner1: 'abc'
            },
            attr2: 'xyz'
        };

        let scrubbed = scrub(obj);
        assert.equal(scrubbed.attr1.IBAN, '********', 'The sensitive data should be scrubbed');
    });

    it('should scrub the sensitive data even if it is an array', function() {
        let obj = {
            attr1: 'abc',
            CardNumber: ['xyz', 'aaa', 'bbb']
        };

        let scrubbed = scrub(obj);

        assert.equal(scrubbed.CardNumber, '********', 'The sensitive data should be scrubbed');
    });

    it('should handle a function prototype object (coverage for obj.hasOwnProperty(key))', function() {
        let TestObj = function() {};
        TestObj.prototype.gender = 'male';
        let obj = new TestObj();
        obj.attr1 = 'abc';
        // note that the obj should NOT have 'gender' attribute, but it is in the function prototype
        // console.log(obj['gender']);  // will return male

        assert.deepEqual(scrub(obj), JSON.parse(JSON.stringify(obj)), 'It should be the same');
    });
});
