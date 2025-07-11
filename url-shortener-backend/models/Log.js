const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

function logger(level, message, meta = {}) {
    const logEntry = `${new Date().toISOString()} [${level}] ${message} ${JSON.stringify(meta)}\n`;
    fs.appendFileSync(logFile, logEntry);
}

module.exports = logger;
