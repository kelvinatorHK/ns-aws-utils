'use strict';

const uuidv1 = require('uuid/v1');

let correlationId;


/**
 * Extract the correlation ID from the input, save it and return it.
 * @param event
 * @param context
 */
function captureCorrelationId(event, context) {
    if (event && event.headers) {

        // produce lower case mapping of keys for case insensitive compare
        let lowerCaseKeys = {};
        Object.keys(event.headers).forEach(key => lowerCaseKeys[key.toLowerCase()] = key);

        if ('x-correlation-id' in lowerCaseKeys) {
            correlationId = event.headers[lowerCaseKeys['x-correlation-id']];
        } else if ('x-request-id' in lowerCaseKeys) {
            correlationId = event.headers[lowerCaseKeys['x-request-id']];
        }
    } else if (process.env.X_AMZN_TRACE_ID) {
        correlationId = process.env.X_AMZN_TRACE_ID;
    } else if (context && context.awsRequestID) {
        correlationId = context.awsRequestID;
    } else {
        correlationId = uuidv1();
    }

    return correlationId;
}


/**
 * Return the previously saved correlation ID. If a coorelation ID has not previously been saved, generate a UUID, save it and return it.
 * @return {*}
 */
function retrieveCorrelationId() {
    if(!correlationId) {
        correlationId = uuidv1();
    }
    return correlationId;
}


module.exports = {
    captureCorrelationId,
    retrieveCorrelationId
};
