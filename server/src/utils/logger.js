'use strict';

const path = require('path');
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, timestamp, json, colorize, printf, errors } = winston.format;

const isDev = process.env.NODE_ENV !== 'production';

const resolvedLogLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

const logsDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const devConsoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp: ts, level, message, module: mod, requestId, ...rest }) => {
    const ctx = [];
    if (mod) ctx.push(`[${mod}]`);
    if (requestId) ctx.push(`rid=${requestId}`);
    const extra = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
    return `${ts} ${level} ${ctx.join(' ')} ${message}${extra}`;
  }),
);

const jsonFormat = combine(timestamp(), errors({ stack: true }), json());

const transports = [];

transports.push(
  new winston.transports.Console({
    format: isDev ? devConsoleFormat : jsonFormat,
  }),
);

transports.push(
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: resolvedLogLevel,
    maxSize: '10m',
    maxFiles: '14d',
    format: jsonFormat,
  }),
);

transports.push(
  new winston.transports.DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '10m',
    maxFiles: '30d',
    format: jsonFormat,
  }),
);

const logger = winston.createLogger({
  level: resolvedLogLevel,
  transports,
});

logger.warn('Logger initialized', { module: 'logger', level: resolvedLogLevel });

module.exports = logger;
