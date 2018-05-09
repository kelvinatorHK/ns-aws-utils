'use strict';

const DEFAULT_KEYS = ['pan', 'CardNumber', 'TrackOne', 'IBAN',
    'VerificationCode', 'BankAccount', 'pass', 'password', 'taxIDs', 'newPassword', 'Authorization', 'soa-auth'];

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
    const seen = new WeakSet;

    return recursiveScrub(obj, seen);
}

/**
 * recursiveScrub is a helper function to scrub the object recursively.
 *
 * @param {*} original the original object to be scrubbed
 * @param {WeakSet} seen a dictionary of the object that we have seen
 * @return {*} a scrubbed data
 */
function recursiveScrub(original, seen) {
    let rv;

    if ((original !== null) && (typeof original === 'object')) {
        // Note that we are going to scrub the object which is Recursive
        if (seen.has(original)) {
            rv = config.replacement;
        } else {
            seen.add(original);
            if (original.constructor === Array) {
                // if it is an Array, we go scrub each individual item
                rv = original.map(function(item) {
                    return recursiveScrub(item, seen);
                });
            } else {
                rv = {};
                Object.keys(original).forEach(function(key) {
                    if (key.match(config.pattern)) {
                        rv[key] = config.replacement;
                    } else {
                        rv[key] = recursiveScrub(original[key], seen);
                    }
                });
            }
        }
    } else {
        rv = original;
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
