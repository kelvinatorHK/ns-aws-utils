'use strict';

const scrubber = require('./scrubber');

// All the possible values for the LOG_LEVELS
// Note that 0 (debug), 1 (info), 2 (warn), 3 (error)
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

// The default config is 'info', users can set different level (e.g., 'debug', 'info', 'warn', and 'error').
// If the user set the value to a value other than those four values, it will NOT log anything
// For example, if the user do config.level = "off", then no logging will be shown
const config = {
    level: LOG_LEVELS[1], // default log level is 'info'
    scrubbing: true // default scrubbing is true
};

// This tag is perpetual.  That means if this tag is set, the subsequent log message will contain it.
let tag = '';

/**
 * setTag is a setter function to set the tag in the log message.
 *
 * @param {string | object} [newTag] a string or object to be tagged
 */
function setTag(newTag) {
    if (typeof newTag === 'string') {
        // force it to become a JSON object with the key name as 'key'...
        tag = {key: newTag};
    } else {
        tag = newTag;
    }
}

/**
 * getTag is a getter function to get the current tag in the log message.
 *
 * @return {string | object} the current tag in the logger
 */
function getTag() {
    return tag;
}

/**
 * addTag is a function to add additional tag.  It will try to add the new tag into the current one.
 * If the incoming tag is a string, it will be converted to become an object with the key = 'key'.
 *
 * @param {string | object} [newTag] a string or object to be tagged
 */
function addTag(newTag) {
    // if the current tag is null or undefined
    // (I made an assumption that the tag is not '0' or false - who would do that?)
    if (!tag) {
        setTag(newTag); // call setTag to set it
    } else {
        if (newTag) {
            // We are trying to combine the two JSON objects together, we will overwrite the props using the newTag
            // Note that we override the original with a new Object to prevent the unexpected behavior.
            let combined = {};

            // Copy the attributes of the original tag
            Object.keys(tag).forEach(function(prop) {
                combined[prop] = tag[prop];
            });

            if (typeof newTag === 'string') {
                combined['key'] = newTag; // if the newTag is a string, put that under 'key'
            } else {
                // otherwise, overwrite the combined JSON with the newTag's attributes
                Object.keys(newTag).forEach(function(prop) {
                    combined[prop] = newTag[prop];
                });
            }

            tag = combined;
        }
    }
}

/**
 * setLevel is a setter function to set the log level.
 *
 * @param {string} level to be set as
 */
function setLevel(level) {
    config.level = level;
}

/**
 * setScrubbing is a setter function to control if the logger scrubs sensitive data or not.
 *
 * @param {boolean} scrubbing a boolean to control the scrubbing
 */
function setScrubbing(scrubbing) {
    config.scrubbing = scrubbing;
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
    let method = level === LOG_LEVELS[0]? 'log' : level;

    if (isPrintingMessage(level)) {
        let data = {level: level};

        if (tag) {
            data.tag = tag;
        }

        if (isError(msg)) {
            data.msg = {message: msg.message, stack: msg.stack};
        } else {
            // if msg is of JSON type object
            if (msg && (typeof msg === 'object') && (msg.constructor !== Array)) {
                if (config.scrubbing) {
                    data.msg = scrubber.scrub(msg);
                } else {
                    data.msg = msg;
                }
            } else {
                data.msg = {message: msg};
            }
        }
        // calling the specific console method (log, info, warn, or error)
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
        configuredLevelValue = LOG_LEVELS.indexOf(config.level); // it will be -1 if not found
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
    debug: (msg) => {
        log(LOG_LEVELS[0], msg);
    },
    info: (msg) => {
        log(LOG_LEVELS[1], msg);
    },
    warn: (msg) => {
        log(LOG_LEVELS[2], msg);
    },
    error: (msg) => {
        log(LOG_LEVELS[3], msg);
    },
    setLevel: setLevel,
    getLevel: getLevel,
    setTag: setTag,
    getTag: getTag,
    addTag: addTag,
    setScrubbing: setScrubbing,
    config: config
};
