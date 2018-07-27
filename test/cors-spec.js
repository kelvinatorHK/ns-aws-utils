'use strict';

const assert = require('assert');
const cors = require('../src/cors');

describe('cors', function() {
    let handler = function(event, context, callback) {
        let res = {statusCode: 200, body: 'Hello'};
        callback(null, res);
    };

    it('should have CORS headers when the caller does not provide any options', function(done) {
        let event = {};
        let context = {};


        cors(handler)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Allow-Methods'], '*');
            done();
        });
    });

    it('should have CORS headers when providing options', function(done) {
        let event = {};
        let context = {};
        let options = {
            origins: null,
            allowCredentials: false,
            allowMethods: null,
            maxAge: null
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Allow-Methods'], '*');
            done();
        });
    });

    it('should have no CORS when headers.origin is an empty array', function(done) {
        let event = {
            headers: {
                origin: 'http://localhost'
            }
        };
        let context = {};
        let options = {
            origins: [],
            allowCredentials: false,
            allowMethods: null,
            maxAge: null
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers, null);
            done();
        });
    });

    it('should have no CORS when there is NO event.headers, but there is origins in the options', function(done) {
        let event = {};
        let context = {};
        let options = {
            origins: ['https://test.nuskin.com'],
            allowCredentials: false,
            allowMethods: null,
            maxAge: null
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers, null);
            done();
        });
    });

    it('should have no CORS when headers.origin is not in the options.origins', function(done) {
        let event = {
            headers: {
                origin: 'http://localhost'
            }
        };
        let context = {};
        let options = {
            origins: ['https://www.nuskin.com', 'https://test.nuskin.com'],
            allowCredentials: false,
            allowMethods: null,
            maxAge: null
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers, null);
            done();
        });
    });

    it('should have CORS header when headers.origin matching the options.origins', function(done) {
        let event = {
            headers: {
                origin: 'https://www.nuskin.com'
            }
        };
        let context = {};
        let options = {
            origins: ['https://www.nuskin.com'],
            allowCredentials: false,
            allowMethods: null,
            maxAge: null
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://www.nuskin.com');
            done();
        });
    });

    it('should have correct Access-Control-Allow-Methods when allowMethods is set', function(done) {
        let event = {
            headers: {
                origin: 'https://www.nuskin.com'
            }
        };
        let context = {};
        let options = {
            origins: null,
            allowCredentials: false,
            allowMethods: ['GET', 'POST']
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Allow-Methods'], 'GET,POST');
            done();
        });
    });

    it('should have correct Access-Control-Allow-Headers when allowHeaders is set', function(done) {
        let event = {
            headers: {
                origin: 'https://www.nuskin.com'
            }
        };
        let context = {};
        let options = {
            origins: null,
            allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key']
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Allow-Headers'],
                'Content-Type,X-Amz-Date,Authorization,X-Api-Key');
            done();
        });
    });

    it('should have correct Access-Control-Max-Age when maxAge is set', function(done) {
        let event = {
            headers: {
                origin: 'https://www.nuskin.com'
            }
        };
        let context = {};
        let options = {
            origins: ['https://www.nuskin.com'],
            allowCredentials: false,
            allowMethods: null,
            maxAge: 1800
        };

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers['Access-Control-Max-Age'], 1800);
            done();
        });
    });

    it('should have CORS headers even though options has a function prototype', function(done) {
        let event = {
            headers: {
                origin: 'http://localhost'
            }
        };
        let context = {};

        let TestObj = function() {};
        TestObj.prototype.gender = 'male';
        let options = new TestObj();
        options.origins = [];

        cors(handler, options)(event, context, function(err, res) {
            assert.equal(res.headers, null);
            done();
        });
    });

    it('should handle an error when the handler call callback with an error', async function() {
        let event = {};
        let context = {};

        let handlerWithError = (event, context, callback) => {
            callback(new Error('System Error'), null);
        };

        try {
            await new Promise(function(resolve, reject) {
                cors(handlerWithError)(event, context, function(err, res) {
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

    it('should have CORS headers when we are using async/await style of handler', async function() {
        let event = {};
        let context = {};

        let asyncHandler = async (event, context) => {
            return {statusCode: 200, body: 'Hello'};
        };

        try {
            let response = await cors(asyncHandler)(event, context);
            assert.equal(response.statusCode, 200, 'The response should be statusCode of 200');
        } catch (e) {
            assert.ifError(e);
        }
    });

    it('should throw an error when using async/await style of handler', async function() {
        let event = {};
        let context = {};

        let asyncHandler = async (event, context) => {
            throw new Error('Unexpected error');
        };

        try {
            await cors(asyncHandler)(event, context);
            assert(false, 'it should have an error');
        } catch (e) {
            assert.notEqual(e, null, 'Error should not be null');
        }
    });
});
