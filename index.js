const LOG_LEVEL = {
    LOG: 'LOG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR'
};

const _log = console.log; 
const _info = console.info; 
const _warn = console.warn;
const _error = console.error;

function loggerFactory(logLevel) {
    let aFunc;

    switch (logLevel) {
        case LOG_LEVEL.INFO:
            aFunc = _info;
            break;
        case LOG_LEVEL.WARN:
            aFunc = _warn;
            break;
        case LOG_LEVEL.ERROR:
            aFunc = _error;
            break;
        // default to be LOG level (e.g., console.log)
        case LOG_LEVEL.LOG:
        default:
            aFunc = _log;
    }

    return function(...args) {
        if (args && args.length > 0) {
            args[0] = '[' + logLevel + '] ' + args[0]; 
        }

        return aFunc.apply(this, args); 
    };
}

// Overwriting the original console log functions
console.log = loggerFactory(LOG_LEVEL.LOG); 
console.info = loggerFactory(LOG_LEVEL.INFO); 
console.warn = loggerFactory(LOG_LEVEL.WARN); 
console.error = loggerFactory(LOG_LEVEL.ERROR); 
