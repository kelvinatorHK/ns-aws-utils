'use strict';

const assert = require('assert');
const correlate = require('../src/correlate');


describe('correlate', function() {
    it('should generate uuid, save it and return it in subsequent retrieve', function() {
        let id = correlate.captureCorrelationId();
        assert(id.length > 10, 'correlation id returned');
        assert.equal(id, correlate.retrieveCorrelationId(), 'saved id returned');
    });

    it('should use aws request id', function() {
        let event;
        let context = {
            'awsRequestID': 'awsRequestID'
        };

        assert.equal(correlate.captureCorrelationId(event, context), 'awsRequestID', 'aws Request ID');
    });

    it('should use xray id', function() {
        process.env.X_AMZN_TRACE_ID = 'x_amzn_trace_id';
        assert.equal(correlate.captureCorrelationId(), 'x_amzn_trace_id');
    });

    it('should use client X-Correlation-ID, test case insensitive', function() {
        let event = {
            'headers': {
                'x-Correlation-Id': 'x-correlation-id',
                'X-Request-ID': 'x-request-id'
            }
        };

        assert.equal(correlate.captureCorrelationId(event), 'x-correlation-id', 'client x-correlation-id');
    });

    it('should use client X-Request-ID, test case insensitive', function() {
        let event = {
            'headers': {
                'X-REQUEST-ID': 'x-request-id'
            }
        };

        assert.equal(correlate.captureCorrelationId(event), 'x-request-id', 'client x-request-id');
    });

});
