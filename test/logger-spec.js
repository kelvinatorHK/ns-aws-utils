'use strict';

const assert = require('assert');
const log = require('../src/logger');

/**
 * loggerTestFactory is a function to generate a mock console log function.
 *
 * @param {object} output is the thing we are going to put the payload to
 * @return {function} a generated test function
 */
function loggerTestFactory(output) {
    // returning a function replacing either console.log, console.info, console.warn, or console.error
    return function(s) {
        output.payload = s;
    };
}

describe('logger', function() {
    describe('#getLevel', function() {
        it('should have "info" as the default log level', function() {
            assert.equal(log.getLevel(), 'info');
        });
    });

    describe('#setLevel', function() {
        it('should not log anything if you set the log level to nothing', function() {
            log.setLevel('');

            let oldLog = console.log;
            let outputMessage = 'debug information';

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputMessage);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'undefined', 'The result should be undefined');
        });
    });

    describe('#setScrubbing', function() {
        it('should scrub the sensitive data by default', function() {
            log.setLevel('info');

            let oldInfo = console.info;
            let outputMessage = {
                password: 'secret'
            };

            let output = {};

            console.info = loggerTestFactory(output);
            log.info(outputMessage);
            console.info = oldInfo;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.msg.password, '********', 'The data should be scrubbed');
        });

        describe('#setTag', function() {
            it('should display tag', function() {
                log.setLevel('info');

                let oldInfo = console.info;
                let outputTag = 'my tag';
                log.setTag(outputTag);

                let output = {};

                console.info = loggerTestFactory(output);
                log.info('first message');
                log.info('second message');
                console.info = oldInfo;

                let result = output.payload;
                assert.equal(typeof result, 'string', 'The result should be a string');
                let resultObj = JSON.parse(result);
                assert.equal(resultObj.tag, outputTag, 'The tag should be displayed in the log');
                assert.equal(resultObj.msg.message, 'second message', 'The result should be second message');
            });
        });

        describe('#getTag', function() {
            it('should return the tag ', function() {
                let aTag = 'my tag';
                log.setTag(aTag);
                let result = log.getTag();

                assert.equal(result, aTag, 'getTag should return the same result');
            });
        });

        it('should be able to turn off scrubbing', function() {
            log.setLevel('info');
            log.setScrubbing(false);

            let oldInfo = console.info;
            let outputMessage = {
                password: 'secret'
            };

            let output = {};

            console.info = loggerTestFactory(output);
            log.info(outputMessage);
            console.info = oldInfo;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.notEqual(resultObj.msg.password, '********', 'The data should NOT be scrubbed');
        });
    });

    describe('#config', function() {
        it('should control the log level using log.config.level', function() {
            log.config.level = 'warn';
            assert.equal(log.getLevel(), 'warn');
        });
    });

    describe('#debug', function() {
        it('should have no debug message when log level=info', function() {
            log.setLevel('info');

            let oldLog = console.log;
            let outputMessage = 'debug information';

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputMessage);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'undefined', 'The result should be undefined');
        });

        it('should output {level: "debug", msg:{message: "test information"}}', function() {
            log.setLevel('debug');

            let oldLog = console.log;
            let outputMessage = 'test information';

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputMessage);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'debug', 'The level should be debug');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });

        it('should output an error', function() {
            log.setLevel('debug');

            let oldLog = console.log;
            let outputMessage = 'an exception is happening';
            let outputError = new Error(outputMessage);

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputError);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'debug', 'The level should be debug');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });

        it('should output an error structure when it is a JSON object with message and stack ', function() {
            log.setLevel('debug');

            let oldLog = console.log;
            let outputMessage = 'an exception is happening';
            let outputError = {
                message: outputMessage,
                stack: 'something'
            };

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputError);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'debug', 'The level should be debug');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });

        it('should output {level: "debug", msg:"test information"}', function() {
            log.setLevel('off');
            let oldLog = console.log;
            let outputMessage = 'debug information';

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputMessage);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'undefined', 'The result should be undefined');
        });

        it('should output {level: "debug", msg:{ key1: \'value1\', key2: \'value2\' }}', function() {
            log.setLevel('debug');
            let oldLog = console.log;
            let outputJson = {key1: 'value1', key2: 'value2'};

            let output = {};

            console.log = loggerTestFactory(output);
            log.debug(outputJson);
            console.log = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'debug', 'The level should be debug');
            assert.deepEqual(resultObj.msg, outputJson, 'The json should be the same');
        });
    });

    describe('#info', function() {
        it('should output {level: "info", msg:"test information"}', function() {
            log.setLevel('info');

            let oldLog = console.info;
            let outputMessage = 'test information';

            let output = {};

            console.info = loggerTestFactory(output);
            log.info(outputMessage);
            console.info = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'info', 'The level should be info');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });
    });

    describe('#warn', function() {
        it('should output {level: "warn", msg:"test information"}', function() {
            log.setLevel('info');

            let oldLog = console.warn;
            let outputMessage = 'test information';

            let output = {};

            console.warn = loggerTestFactory(output);
            log.warn(outputMessage);
            console.warn = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'warn', 'The level should be warn');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });
    });

    describe('#error', function() {
        it('should output {level: "error", msg:"test information"}', function() {
            log.setLevel('info');

            let oldLog = console.error;
            let outputMessage = 'test information';

            let output = {};

            console.error = loggerTestFactory(output);
            log.error(outputMessage);
            console.error = oldLog;

            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'error', 'The level should be error');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
        });
    });

    describe('#setTag', function() {
        it('should see the tag in the log', function() {
            let oldLog = console.info;
            let outputMessage = 'test information';
            let tagMessage = {requestId: 'some Id', resourceId: '12345'};
            let output = {};

            console.info = loggerTestFactory(output);
            log.setTag(tagMessage); // set the tag with a JSON object
            log.info(outputMessage);
            console.info = oldLog;


            let result = output.payload;
            assert.equal(typeof result, 'string', 'The result should be a string');
            let resultObj = JSON.parse(result);
            assert.equal(resultObj.level, 'info', 'The level should be info');
            assert.equal(resultObj.msg.message, outputMessage, 'The msg should be the same');
            assert.deepEqual(resultObj.tag, tagMessage, 'The tag should be the same');
        });
    });
});
