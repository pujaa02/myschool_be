import winston from 'winston';
declare const consoleLogFormat: winston.Logform.Format;
declare const logger: winston.Logger;
declare const stream: {
    write: (message: string) => void;
};
export { logger, stream, consoleLogFormat };
