'use strict';

const EID = 'eid';

/**
 * eidify is a function to transfer the eid from the authorizer to the response header and cookie.
 *
 * @param {function} handler the original handler function
 * @return {function} a handler function that has the eid in the header (if custom authroizer is hit)
 */
function eidify(handler) {
    return (event, context, callback) => {
        let rv;

        // if the handler function prototype has argument less than 3 (that means it has no callback)
        if (handler && handler.length < 3) {
            // add the EID to the returned value
            // Note that we purposely not throw any error, the await should do the 'catch'
            rv = handler(event, context).then((res) => addEid(res, event));
        } else {
            rv = handler(event, context, (err, res) => {
                if (res) {
                    res = addEid(res, event);
                }
                callback(err, res);
            });
        }

        return rv;
    };
}

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
