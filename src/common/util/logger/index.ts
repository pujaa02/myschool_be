import winston from 'winston';
import { basename, join } from 'path';
import { promises as fsPromises } from 'fs';
import WinstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '../../../config';

// logs dir
const logDir = join(__dirname, LOG_DIR);

async function ensureLogDirectory() {
  try {
    // Check if the directory exists
    await fsPromises.access(logDir);
  } catch (error) {
    // Directory doesn't exist, create it recursively
    await fsPromises.mkdir(logDir);
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
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.label({ label: basename(require?.main?.filename || 'server') }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json(),
);

const consoleLogFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, label }) => {
    return `${timestamp} ${level} [${label}]: ${message}`;
  }),
);

const logger = winston.createLogger({
  format: fileLogFormat,
  ...(process.env.NODE_ENV === 'development' && {
    transports: [
      // debug log setting
      new WinstonDaily({
        level: 'debug',
        datePattern: 'YYYY-MM-DD',
        dirname: `${logDir}/debug`, // log file /logs/debug/*.log in save
        filename: '%DATE%.log',
        maxFiles: 30, // 30 Days saved
        json: false,
        zippedArchive: true,
      }),
      // error log setting
      new WinstonDaily({
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

logger.add(
  new winston.transports.Console({
    format: consoleLogFormat,
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream, consoleLogFormat };
