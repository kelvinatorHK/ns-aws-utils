'use strict';

const cors = require('./cors');
const logger = require('./logger');
const scrubber = require('./scrubber');

module.exports = {
    cors: cors,
    logger: logger,
    scrubber: scrubber
};
