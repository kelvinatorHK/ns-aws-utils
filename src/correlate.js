'use strict';

const uuidv1 = require('uuid/v1');

let correlationId;


/**
 * Extract the correlation ID from the input, save it and return it.
 * @param {object} event
 * @param {object} context
 * @return {string}
 */
function captureCorrelationId(event, context) {
    let headers = (event && event.headers) ? event.headers: {};
    let lowerHeaderKeys = Object.keys(headers).reduce((map, key) => {
        map[key.toLowerCase()] = key; return map;
    }, {});

    if ('x-correlation-id' in lowerHeaderKeys) {
        correlationId = headers[lowerHeaderKeys['x-correlation-id']];
    } else if ('x-request-id' in lowerHeaderKeys) {
        correlationId = headers[lowerHeaderKeys['x-request-id']];
    } else if (process.env.X_AMZN_TRACE_ID) {
        correlationId = process.env.X_AMZN_TRACE_ID;
    } else if ('x-amzn-trace-id' in lowerHeaderKeys) {
        let id = headers[lowerHeaderKeys['x-amzn-trace-id']];
        correlationId = id.startsWith('Root=') ? id.substring(5) : id;
    } else if (context && context.awsRequestID) {
        correlationId = context.awsRequestID;
    } else {
        correlationId = uuidv1();
    }

    return correlationId;
}


/**
 * Return the previously saved correlation ID. If a coorelation ID has not previously been saved,
 * generate a UUID, save it and return it.
 *
 * @return {string} correlation id
 */
function retrieveCorrelationId() {
    if (!correlationId) {
        correlationId = uuidv1();
    }
    return correlationId;
}


module.exports = {
    captureCorrelationId,
    retrieveCorrelationId
};
