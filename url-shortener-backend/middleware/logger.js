const Log = require('../models/Log');

const logger = (level, message, meta = {}) => {
    const logEntry = new Log({
        level,
        message,
        meta
    });

    logEntry.save().catch(err => {
        // Avoid console.log, skip error logging for logging errors
    });
};

module.exports = logger;
