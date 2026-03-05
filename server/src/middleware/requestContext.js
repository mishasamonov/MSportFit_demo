'use strict';

const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

/**
 * Middleware: призначає requestId кожному запиту,
 * додає req.requestId, res header X-Request-Id та req.log (child logger).
 *
 * requestId береться із заголовка X-Request-Id або генерується як UUID.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requestContext(req, res, next) {
  const anyReq = /** @type {any} */ (req);

  const requestId =
    (typeof req.headers['x-request-id'] === 'string' && req.headers['x-request-id'].trim()) ||
    randomUUID();

  anyReq.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  anyReq.log = logger.child({
    module: 'http',
    requestId,
    method: req.method,
    path: req.path,
  });

  next();
}

/**
 * Middleware: логує завершення відповіді.
 * Рівень: 5xx → error, 4xx → warn, решта → info.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function requestLogger(req, res, next) {
  const anyReq = /** @type {any} */ (req);
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    const { statusCode } = res;

    const meta = { statusCode, durationMs };
    const log = anyReq.log || logger.child({ module: 'http' });

    if (statusCode >= 500) {
      log.error('Response sent', meta);
    } else if (statusCode >= 400) {
      log.warn('Response sent', meta);
    } else {
      log.info('Response sent', meta);
    }
  });

  next();
}

module.exports = { requestContext, requestLogger };
