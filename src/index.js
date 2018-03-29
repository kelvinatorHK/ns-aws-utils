'use strict';

const cors = require('./cors');
const logger = require('./logger');
const scrubber = require('./scrubber');
const eidify = require('./eidify');

module.exports = {
    cors: cors,
    eidify: eidify,
    logger: logger,
    scrubber: scrubber
};
