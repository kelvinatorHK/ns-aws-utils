'use strict';

const PATTERN = /^(pan|CardNumber|TrackOne|IBAN|VerificationCode|BankAccount|Pass|password|Password).*/;
const REPLACEMENT = '********';

/**
 * scrub is a function to scrub the sensitive information. The sensitive data is anything matching
 * the regex defined in PATTERN.  The value will be replaced with '********'.
 * Note that this function will scrub recursively if any value is a JSON object.
 * Also, it will not scrub the value if it is a JSON object.
 *
 * @param {!object} obj a JSON object to be scrubbed
 * @return {object} a JSON object with the sensitive information scrubbed.
 */
function scrub(obj) {
    let rv = {};

    let value;
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            // note that 'null' is an object
            if (value && (typeof value === 'object') && (value.constructor !== Array)) {
                // if it is another substructure, call scrub again
                rv[key] = scrub(value);
            } else {
                if (key.match(PATTERN)) {
                    rv[key] = REPLACEMENT;
                } else {
                    rv[key] = value;
                }
            }
        }
    }

    return rv;
}

module.exports = scrub;
