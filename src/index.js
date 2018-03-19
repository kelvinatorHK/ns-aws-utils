'use strict';

const cors = require('./cors');
const logger = require('./logger');
const scrub = require('./scrub');

module.exports = {
    cors: cors,
    logger: logger,
    scrub: scrub
};
