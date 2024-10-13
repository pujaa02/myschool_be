"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleLogFormat = exports.stream = exports.logger = void 0;
const tslib_1 = require("tslib");
const winston_1 = tslib_1.__importDefault(require("winston"));
const config_1 = require("../config");
const path_1 = require("path");
const fs_1 = require("fs");
const winston_daily_rotate_file_1 = tslib_1.__importDefault(require("winston-daily-rotate-file"));
// logs dir
const logDir = (0, path_1.join)(__dirname, config_1.LOG_DIR);
async function ensureLogDirectory() {
    try {
        // Check if the directory exists
        await fs_1.promises.access(logDir);
    }
    catch (error) {
        // Directory doesn't exist, create it recursively
        await fs_1.promises.mkdir(logDir);
    }
}
ensureLogDirectory()
    .then(() => {
    logger.info('Log directory is ready.');
})
    .catch((error) => {
    logger.info('Error creating log directory:', error);
});
// Define log format
const fileLogFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.label({ label: (0, path_1.basename)(require?.main?.filename || 'server') }), winston_1.default.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }), winston_1.default.format.json());
const consoleLogFormat = winston_1.default.format.combine(winston_1.default.format.splat(), winston_1.default.format.colorize(), winston_1.default.format.printf(({ timestamp, level, message, label }) => {
    return `${timestamp} ${level} [${label}]: ${message}`;
}));
exports.consoleLogFormat = consoleLogFormat;
const logger = winston_1.default.createLogger({
    format: fileLogFormat,
    ...(process.env.NODE_ENV === 'development' && {
        transports: [
            // debug log setting
            new winston_daily_rotate_file_1.default({
                level: 'debug',
                datePattern: 'YYYY-MM-DD',
                dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
                filename: '%DATE%.log',
                maxFiles: 30, // 30 Days saved
                json: false,
                zippedArchive: true,
            }),
            // error log setting
            new winston_daily_rotate_file_1.default({
                level: 'error',
                datePattern: 'YYYY-MM-DD',
                dirname: `${logDir}/error`, // log file /logs/error/*.log in save
                filename: '%DATE%.log',
                maxFiles: 30, // 30 Days saved
                handleExceptions: true,
                json: false,
                zippedArchive: true,
            }),
        ],
    }),
});
exports.logger = logger;
logger.add(new winston_1.default.transports.Console({
    format: consoleLogFormat,
}));
const stream = {
    write: (message) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};
exports.stream = stream;
//# sourceMappingURL=logger.js.map