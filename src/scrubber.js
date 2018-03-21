'use strict';

const DEFAULT_KEYS = ['pan', 'CardNumber', 'TrackOne', 'IBAN',
    'VerificationCode', 'BankAccount', 'pass', 'password', 'taxIDs', 'newPassword'];

const config = {
    // The default RegExp pattern is
    // /^(pan|CardNumber|TrackOne|IBAN|VerificationCode|BankAccount|pass|password|taxIDs|newPassword)$/;
    pattern: createRegExpFromKeys(DEFAULT_KEYS),
    // The default replacement string is '********'
    replacement: '********'
};

/**
 * createRegExpPromKeys is a function to create a RegExp object based on the given array.
 * Note that you cannot have '|' in the value of the keys.
 *
 * @param {Array} keys the array of keys whose value needs to be scrubbed
 * @return {RegExp} a regular expression to match any key i the keys array
 */
function createRegExpFromKeys(keys) {
    let rv = null;

    if (keys && (keys.constructor === Array) && (keys.length > 0)) {
        // 'i' means case-insensitive
        rv = new RegExp('^(' + keys.join('|') + ')$', 'i');
    }

    return rv;
}

/**
 * setKeysToScrub is a function to set the RegExp pattern in the config with the given array.
 *
 * @param {Array} keys of the sensitive data to be scrubbed
 */
function setKeysToScrub(keys) {
    setPattern(createRegExpFromKeys(keys));
}

/**
 * setKeysWithDefaultToScrub is a function to set the RegExp pattern in the config with
 * the given array in additional to the DEFAULT_KEYS.
 *
 * @param {Array} keys of the sensitive data to be scrubbed
 */
function setKeysWithDefaultToScrub(keys) {
    setKeysToScrub(DEFAULT_KEYS.concat(keys));
}

/**
 * setPattern is a setter function to set the matching pattern (RegExp) of the key.
 *
 * @param {RegExp} pattern a pattern for the scrubber to match
 */
function setPattern(pattern) {
    if (pattern && (pattern.constructor === RegExp)) {
        config.pattern = pattern;
    }
}

/**
 * setReplacement is a setter function to set the replacement string.
 *
 * @param {string} replacement a string to be replaced with
 */
function setReplacement(replacement) {
    if ((typeof replacement !== 'undefined') && (replacement != null)) {
        config.replacement = replacement;
    }
}

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
        // Note that queryStringParameters is a null prototype in the event object of AWS serverless
        // https://github.com/hapijs/hapi/issues/3280
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            value = obj[key];
            // note that 'null' is an object
            if (value && (typeof value === 'object') && (value.constructor !== Array)) {
                // if it is another substructure, call scrub again
                rv[key] = scrub(value);
            } else {
                if (key.match(config.pattern)) {
                    rv[key] = config.replacement;
                } else {
                    rv[key] = value;
                }
            }
        }
    }

    return rv;
}

module.exports = {
    config: config,
    scrub: scrub,
    setKeysToScrub: setKeysToScrub,
    setKeysWithDefaultToScrub: setKeysWithDefaultToScrub,
    setPattern: setPattern,
    setReplacement: setReplacement
};
