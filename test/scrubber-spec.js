'use strict';

const assert = require('assert');
const scrubber = require('../src/scrubber');

describe('scrubber', function() {
    describe('#scrub', function() {
        it('should return an empty object', function() {
            let obj = {};

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should handle an object with a null attribute', function() {
            let obj = {abc: null};

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should handle an object with a null prototype', function() {
            let obj = Object.create(null);
            obj['countryCode'] = 'US';
            obj['atp'] = 'true';

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should handle a recursive object', function() {
            let obj = {a: 'abc'};
            obj.b = obj;

            let scrubbed = scrubber.scrub(obj);

            assert.equal(scrubbed.a, obj.a, 'It should be the same');
            assert.equal(scrubbed.b, '********', 'The recursive value should be masked');
        });

        it('should return the same simple object without scrubbing', function() {
            let obj = {
                attr1: 'abc',
                attr2: 'xyz'
            };

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
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

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should handle an array without scrubbing', function() {
            let obj = {
                attr1: 'abc',
                attr2: ['a1', 'a2']
            };

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should handle an array with sensitive information inside', function() {
            let obj = {
                attr1: 'abc',
                attr2: ['a1', 'a2', {username: 'no-secret', password: 'secret'}]
            };

            let scrubbed = scrubber.scrub(obj);
            assert.equal(scrubbed.attr2[2].username, 'no-secret', 'The result should be no-secret');
            assert.equal(scrubbed.attr2[2].password, '********', 'The sensitive data should be scrubbed');
            assert.equal(scrubbed.attr2[0], 'a1', 'The result should be a1');
        });

        it('should scrub the sensitive data in the first level', function() {
            let obj = {
                password: 'secret',
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            assert.equal(scrubbed.password, '********', 'The sensitive data should be scrubbed');
        });

        it('should not scrub if the key is not a exact match of the DEFAULT_KEYS', function() {
            let obj = {
                password2: 'abc',
                attr2: 'xyz'
            };

            assert.deepEqual(scrubber.scrub(obj), obj, 'It should be the same');
        });

        it('should scrub the sensitive data in the inner structure', function() {
            let obj = {
                attr1: {
                    IBAN: 'secret',
                    number: 'number',
                    inner1: 'abc'
                },
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            assert.equal(scrubbed.attr1.IBAN, '********', 'IBAN should be scrubbed');
            assert.equal(scrubbed.attr1.number, '********', 'number should be scrubbed');
        });

        it('should scrub the sensitive data even if it is an array', function() {
            let obj = {
                attr1: 'abc',
                CardNumber: ['xyz', 'aaa', 'bbb']
            };

            let scrubbed = scrubber.scrub(obj);

            assert.equal(scrubbed.CardNumber, '********', 'The sensitive data should be scrubbed');
        });

        it('should handle a function prototype object (coverage for obj.hasOwnProperty(key))', function() {
            let TestObj = function() {};
            TestObj.prototype.gender = 'male';
            let obj = new TestObj();
            obj.attr1 = 'abc';
            // note that the obj should NOT have 'gender' attribute, but it is in the function prototype
            // console.log(obj['gender']);  // will return male

            assert.deepEqual(scrubber.scrub(obj), JSON.parse(JSON.stringify(obj)), 'It should be the same');
        });

        it('should scrub the sensitive data even if it is in stringified json', function() {
            let obj = {
                attr1: 'abc',
                'data': '{\"IBAN\":\"asdf412341234\",   \"pan\": \"4111111111111111\",\"CardNumber\":  \"1234567890\",\"number\"  :\t\"1234567890\"}'
            };

            let scrubbed = scrubber.scrub(obj);
            
            assert.equal(scrubbed.data, '{\"IBAN\":\"********\",   \"pan\": \"********\",\"CardNumber\":  \"********\",\"number\"  :\t\"********\"}', 'Sensitive data in String should be scrubbed');
        });

    });

    describe('#setReplacement', function() {
        it('should scrub the sensitive data with the new replacement', function() {
            let original = scrubber.config.replacement;
            scrubber.setReplacement('##hidden##');

            let obj = {
                password: 'secret',
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            scrubber.setReplacement(original); // set the original replacement back
            assert.equal(scrubbed.password, '##hidden##', 'The sensitive data should be scrubbed');
        });

        it('should NOT set to a new replacement if the input is not string', function() {
            let original = scrubber.config.replacement;
            let temp = {};
            scrubber.setReplacement(temp.something);
            assert.equal(scrubber.config.replacement, original, 'The replacement should not be changed');

            scrubber.setReplacement(null);
            assert.equal(scrubber.config.replacement, original, 'The replacement should not be changed');
        });
    });

    describe('#setPattern', function() {
        it('should be able to set a new matching pattern', function() {
            let original = scrubber.config.pattern;
            scrubber.setPattern(/^(testme)$/);

            let obj = {
                testme: 'new secret',
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            scrubber.setPattern(original); // set the original pattern back
            assert.equal(scrubbed.testme, '********', 'The sensitive data should be scrubbed');
        });
    });

    describe('#setKeysToScrub', function() {
        it('should be able to scrub the data with the new keys', function() {
            let original = scrubber.config.pattern;
            scrubber.setKeysToScrub(['non-sensitive', 'myNewKey']);

            let obj = {
                myNewKey: 'new secret',
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            scrubber.setPattern(original); // set the original pattern back
            assert.equal(scrubbed.myNewKey, '********', 'The sensitive data should be scrubbed');
        });

        it('should NOT set to a new pattern if the input is not an array', function() {
            let original = scrubber.config.pattern;
            scrubber.setKeysToScrub(null);
            assert.equal(scrubber.config.pattern, original, 'The pattern should not be changed');
        });
    });

    describe('#setKeysWithDefaultToScrub', function() {
        it('should be able to scrub the data correctly', function() {
            let original = scrubber.config.pattern;
            scrubber.setKeysWithDefaultToScrub(['non-sensitive', 'myNewKey']);

            let obj = {
                password: 'new secret',
                myNewKey: 'new secret2',
                attr2: 'xyz'
            };

            let scrubbed = scrubber.scrub(obj);
            scrubber.setPattern(original); // set the original pattern back
            assert.equal(scrubbed.password, '********', 'The sensitive data should be scrubbed');
            assert.equal(scrubbed.myNewKey, '********', 'The sensitive data should be scrubbed');
            assert.notEqual(scrubbed.attr2, '********', 'The sensitive data should NOT be scrubbed');
        });
    });
});
