'use strict';

const EID = 'eid';

/**
 * eidify is a function to transfer the eid from the authorizer to the response header and cookie.
 *
 * @param {function} handler the original handler function
 * @return {function} a handler function that has the eid in the header (if custom authroizer is hit)
 */
function eidify(handler) {
    // if the handler function prototype has argument less than 3 (that means it has no callback)
    if (handler && handler.length < 3) {
        // add the EID to the returned value
        // Note that we purposely not throw any error, the await should do the 'catch'
        // Basically, we need to return a function with two parameters so that it is satisfying the JS8 async/await
        return (event, context) => handler(event, context).then((res) => addEid(res, event));
    } else {
        return (event, context, callback) => handler(event, context, (err, res) => {
            if (res) {
                res = addEid(res, event);
            }
            callback(err, res);
        });
    }
}

/**
 * addEid is a helper function to add the EID from the Custom Authorizer to the response.
 *
 * @param {object} res the response to the HTTP client
 * @param {object} event the incoming Lambda event
 * @return {object} the response to the HTTP client
 */
function addEid(res, event) {
    // we need to check the event to see if we hit the authorizer at all
    if (event && event.requestContext && event.requestContext.authorizer) {
        let eid = event.requestContext.authorizer.eid;

        // add the eid to the response header and cookie
        if (eid) {
            res.headers = res.headers || {};
            res.headers[EID] = eid; // set the eid to the header
        }
    }

    return res;
}

module.exports = eidify;
