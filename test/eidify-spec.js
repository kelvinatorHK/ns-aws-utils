'use strict';

const assert = require('assert');
const eidify = require('../src/eidify');
const cors = require('../src/cors');

/**
 * createEidifyPromise is a helper function to return a promise wrapping the eidify function.
 *
 * @param {function} handler the original handler function
 * @param {Object} event an event data is passed by AWS Lambda service
 * @param {Object} context a runtime information is passed by AWS Lambda service
 * @return {Promise} a promise wrapping the eidify function
 */
function createEidifyPromise(handler, event, context) {
    return new Promise(function(resolve, reject) {
        eidify(handler)(event, context, function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

describe('eidify', function() {
    let simpleHandler = function(event, context, callback) {
        let res = {statusCode: 200, body: 'Hello'};
        callback(null, res);
    };

    let eid = 'someEid';
    let eventWithEid = {
        requestContext: {
            authorizer: {
                accountId: 'US00452484',
                eid: eid
            }
        }
    };

    it('should do nothing if there is no authorizer', function() {
        let event = {};
        let context = {};

        return createEidifyPromise(simpleHandler, event, context)
            .then(function(result) {
                assert.equal(result.headers, undefined, 'response should have no headers');
            }).catch(function(error) {
                assert.fail(error, '---', 'should have no error');
            });
    });

    it('should do nothing if there is no eid in the authorizer', function() {
        let event = {
            requestContext: {
                authorizer: {
                    accountId: 'US00452484'
                }
            }
        };
        let context = {};

        return createEidifyPromise(simpleHandler, event, context)
            .then(function(result) {
                assert.equal(result.headers, undefined, 'response should have no headers');
            }).catch(function(error) {
                assert.fail(error, '---', 'should have no error');
            });
    });

    it('should put eid in the response header and cookie if the authorizer has eid', function() {
        let context = {};

        return createEidifyPromise(simpleHandler, eventWithEid, context)
            .then(function(result) {
                assert.equal(result.headers.eid, eid, 'headers should have eid');
            }).catch(function(error) {
                assert.fail(error, '---', 'should have no error');
            });
    });

    it('should handle async/await style of handler', async function() {
        let asyncHandler = async (event, context) => {
            return {statusCode: 200, body: 'Hello'};
        };

        let response = await eidify(asyncHandler)(eventWithEid, {});
        assert(response, 'it should have a response');
        assert(response.headers, 'it should have a response header');
        assert.equal(response.headers.eid, eid, 'it should have a eid in the response header');
    });

    it('should handle both eidify/cors using together with node8', async function() {
        let asyncHandler = async (event, context) => {
            return {statusCode: 200, body: 'Hello'};
        };

        let response = await eidify(cors(asyncHandler))(eventWithEid, {});
        assert(response, 'it should have a response');
        assert(response.headers, 'it should have a response header');
        assert.equal(response.headers.eid, eid, 'it should have a eid in the response header');
        assert.equal(response.headers['Access-Control-Allow-Origin'], '*', 'it should have CORS');
    });

    it('should handle both cors/eidify using together with node8', async function() {
        let asyncHandler = async (event, context) => {
            return {statusCode: 200, body: 'Hello'};
        };

        let response = await cors(eidify(asyncHandler))(eventWithEid, {});
        assert(response, 'it should have a response');
        assert(response.headers, 'it should have a response header');
        assert.equal(response.headers.eid, eid, 'it should have a eid in the response header');
        assert.equal(response.headers['Access-Control-Allow-Origin'], '*', 'it should have CORS');
    });

    it('should handle an error when the handler call callback with an error', async function() {
        let event = {};
        let context = {};

        let handlerWithError = (event, context, callback) => {
            callback(new Error('System Error'), null);
        };

        try {
            await new Promise(function(resolve, reject) {
                eidify(handlerWithError)(event, context, function(err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            assert(false, 'it should have an error');
        } catch (e) {
            assert.notEqual(e, null, 'Error should not be null');
        }
    });
});
