'use strict';

// All the possible values for the LOG_LEVELS
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

// The default config is 'info', users can set different level (e.g., 'debug', 'info', 'warn', and 'error').
// If the user set the value to a value other than those four values, it will NOT log anything
// For example, if the user do config.level = "off", then no logging will be shown
const config = {
    level: 'info'
};

/**
 * setLevel is a setter function to set the log level.
 *
 * @param {string} level to be set as
 */
function setLevel(level) {
    config.level = level;
}

/**
 * getLevel is a getter function to retrieve the current log level.
 *
 * @return {string} to indicate the log level
 */
function getLevel() {
    return config.level;
}

/**
 * log is a function to print out a message in a given level.
 *
 * @param {string} level the log level of the message
 * @param {string | object} msg the message to print out
 */
function log(level, msg) {
    let method = level === 'debug'? 'log' : level;

    if (isPrintingMessage(level)) {
        let data = {level: level};

        if (isError(msg)) {
            data.msg = { message: msg.message, stack: msg.stack };
        } else {
            // if msg is of JSON type
            if (msg && (typeof msg === 'object')) {
                data.msg = msg;
            } else {
                data.msg = { message: msg };
            }
        }

        console[method](JSON.stringify(data));
    }
}

/**
 * isPrintingMessage is a function to determine if we should print the log message.
 *
 * @param {!string} level log level which the user is calling (e.g., log.warn())
 * @return {boolean} a boolean to indicate if log message
 */
function isPrintingMessage(level) {
    let rv = false;
    let configuredLevelValue = -1;
    if (config.level) {
        configuredLevelValue = LOG_LEVELS.indexOf(config.level);
    }

    // make sure that the user's configured level is a value defined in LOG_LEVELS
    if (configuredLevelValue >= 0) {
        let logLevelValue = LOG_LEVELS.indexOf(level);
        // if the log level is a defined value in LOG_LEVELS and logLevel is equal or higher than the configured level
        if ((logLevelValue >= 0) && (logLevelValue >= configuredLevelValue)) {
            rv = true;
        }
    }

    return rv;
}

/**
 * isError is a function to determine if the given input is an Error.
 *
 * @param {Object} val
 * @return {boolean} a boolean to indicate if the input is an Error
 */
function isError(val) {
    // Note that !!val means to make the result into a boolean type
    // if val is null, undefined or empty, or a number 0,  it will become false (boolean)
    // if val is 'aString', a number (e.g., 5), or an object (even if it is empty), it will become true
    return !!val && typeof val === 'object'
        && (val instanceof Error || (val.hasOwnProperty('message') && val.hasOwnProperty('stack')));
}

module.exports = {
    debug: (msg) => { log('debug', msg); },
    info: (msg) => { log('info', msg); },
    warn: (msg) => { log('warn', msg); },
    error: (msg) => { log('error', msg); },
    setLevel: setLevel,
    getLevel: getLevel
};
