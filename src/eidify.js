'use strict';

const EID = 'eid';

/**
 * eidify is a function to transfer the eid from the authorizer to the response header and cookie.
 *
 * @param {function} handler the original handler function
 * @return {function} a handler function that has the eid in the header (if custom authroizer is hit)
 */
function eidify(handler) {
    return (event, context, callback) =>
        handler(event, context, (err, res) => {
            // we need to check the event to see if we hit the authorizer at all
            if (event && event.requestContext && event.requestContext.authorizer) {
                let eid = event.requestContext.authorizer.eid;

                // add the eid to the response header and cookie
                if (eid) {
                    res.headers = res.headers || {};
                    res.headers[EID] = eid; // set the eid to the header
                }
            }

            // do the callback
            callback(err, res);
        });
}

module.exports = eidify;
