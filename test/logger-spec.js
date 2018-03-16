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

        it('should output {level: "debug", msg:"test information"}', function() {
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
            assert.equal(resultObj.msg, outputMessage, 'The msg should be the same');
        });

        it('should be able output error', function() {
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
        });

        it('should have no debug message when log level is not "debug", "info", "warn", or "error"', function() {
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
    });

    describe('#info', function() {
        it('should output {level: "info", msg:"test information"}', function () {
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
            assert.equal(resultObj.msg, outputMessage, 'The msg should be the same');
        });
    });

    describe('#warn', function() {
        it('should output {level: "warn", msg:"test information"}', function () {
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
            assert.equal(resultObj.msg, outputMessage, 'The msg should be the same');
        });
    });

    describe('#error', function() {
        it('should output {level: "error", msg:"test information"}', function () {
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
            assert.equal(resultObj.msg, outputMessage, 'The msg should be the same');
        });
    });


    // it('should output {level: "info", msg:"test information"}', function() {
    //     let oldInfo = console.info;
    //     let outputMessage = 'info information';
    //
    //     let errorMessage = {};
    //     console.info = loggerTestFactory('info', outputMessage, errorMessage);
    //
    //     log.info(outputMessage);
    //
    //     console.info = oldInfo;
    //     assert.equal(Object.keys(errorMessage).length, 0, errorMessage.msg);
    // });
    //
    // it('should output {level: "warn", msg:"test warning"}', function() {
    //     let oldWarn = console.warn;
    //     let outputMessage = 'warn information';
    //
    //     let errorMessage = {};
    //     console.warn = loggerTestFactory('warn', outputMessage, errorMessage);
    //
    //     log.warn(outputMessage);
    //
    //     console.warn = oldWarn;
    //     assert.equal(Object.keys(errorMessage).length, 0, errorMessage.msg);
    // });
    //
    // it('should output {level: "error", msg:"test error"}', function() {
    //     let oldError = console.error;
    //     let outputMessage = 'error information';
    //
    //     let errorMessage = {};
    //     console.error = loggerTestFactory('error', outputMessage, errorMessage);
    //
    //     log.error(outputMessage);
    //
    //     console.error = oldError;
    //     assert.equal(Object.keys(errorMessage).length, 0, errorMessage.msg);
    // });
    //
    // it('should output {level: "info", msg:"test information", stack}', function() {
    //     let oldInfo = console.info;
    //     let outputMessage = 'info information';
    //
    //     let errorMessage = {};
    //     console.info = loggerTestFactory('info', outputMessage, errorMessage);
    //
    //     log.info(outputMessage);
    //
    //     console.info = oldInfo;
    //     assert.equal(Object.keys(errorMessage).length, 0, errorMessage.msg);
    // });
});
