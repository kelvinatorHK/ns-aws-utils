'use strict';

const defaultOptions = {
    // origins: ['https://www.nuskin.com', 'https://test.nuskin.com', 'https://dev.nuskin.com'],
    // if null, then all domains will be allowed
    origins: null,
    allowCredentials: false,
    // allowMethods: ['GET', 'POST'],
    // if null, then all methods will be allowed
    allowMethods: null,
    // allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
    // if null, then all headers will be allowed
    allowHeaders: null,
    maxAge: null
};

/**
 * cors is a function to return a new function which will put the CORS headers in the res.
 *
 * @param {function} handler the original handler function that does NOT have CORS headers in the callback res
 * @param {Object} [opts] is to override default options controlling the CORS headers
 * @return {function} a new handler function that will wrap the CORS headers
 */
function cors(handler, opts) {
    return (event, context, callback) =>
        handler(event, context, (err, res) => {
            let options;
            if (opts) {
                // deep copy from defaultOptions
                options = JSON.parse(JSON.stringify(defaultOptions));
                for (let prop in opts) {
                    if (opts.hasOwnProperty(prop)) {
                        options[prop] = opts[prop];
                    }
                }
            } else {
                options = defaultOptions;
            }

            if (options.origins) {
                if (options.origins.length > 0) {
                    if (event && event.headers && event.headers.origin) {
                        let origin = event.headers.origin;
                        // find out if the event.headers.origin contains in origins provided by the origin
                        let matchedCORS = options.origins
                            .map((o) => o.trim())
                            .filter((o) => o === origin);

                        if (matchedCORS.length > 0) {
                            addCORSHeaders(options, origin, res);
                        }
                    }
                }
            } else {
                // if origins is null, that means we allow all origins
                addCORSHeaders(options, '*', res);
            }

            callback(err, res);
        });
}


/**
 * addCORSHeaders is a helper function to add the CORS headers to res
 *
 * @param {Object} options the original handler function that does NOT have CORS headers in the callback res
 * @param {string} origin the origin of the request (e.g., https://test.nuskin.com)
 * @param {Object} res the results/response that we are going to add the CORS headers
 */
function addCORSHeaders(options, origin, res) {
    res.headers = res.headers || {};
    if (!!options.maxAge) {
        res.headers['Access-Control-Max-Age'] = options.maxAge;
    }
    res.headers['Access-Control-Allow-Methods'] =
        options.allowMethods ? options.allowMethods.join(',') : '*';
    res.headers['Access-Control-Allow-Credentials'] =
        JSON.stringify(!!options.allowCredentials);
    res.headers['Access-Control-Allow-Headers'] =
        options.allowHeaders ? options.allowHeaders.join(',') : '*';
    res.headers['Access-Control-Allow-Origin'] = origin;
}


// export the cors function
module.exports = cors;
