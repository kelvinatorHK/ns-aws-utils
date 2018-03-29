'use strict';

const assert = require('assert');
const eidify = require('../src/eidify');

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
                    accountId: 'US00452484',
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
});
