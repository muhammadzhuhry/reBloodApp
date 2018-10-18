'use strict';

var winston = require('winston');
var appRoot = require('app-root-path');

var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: function () {
            return new Date();
        },
        humanReadableUnhandledException: true
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
        timestamp: function () {
            return new Date();
        }
    },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

logger.stream = {
    write: function(message, encoding)
    {
        logger.info(message);
    }
};

module.exports = logger;