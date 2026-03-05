'use strict';

const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Express error-handling middleware (4 аргументи — обовʼязково).
 *
 * Генерує унікальний errorId, формує безпечну відповідь JSON,
 * логує деталі помилки з контекстом запиту.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  const anyErr = /** @type {any} */ (err);
  const anyReq = /** @type {any} */ (req);

  const errorId = randomUUID();
  const status = Number(anyErr.status || anyErr.statusCode || 500);

  const errorName = status === 404 ? 'NotFound' : err.name || 'InternalServerError';

  const userMessage =
    status === 404
      ? 'Ресурс не знайдено'
      : status >= 400 && status < 500
        ? err.message || 'Некоректний запит'
        : 'Внутрішня помилка сервера. Спробуйте пізніше';

  const log = anyReq.log || logger.child({ module: 'http' });

  const logMethod = status >= 500 ? 'error' : 'warn';
  log[logMethod]('Request error', {
    errorId,
    requestId: anyReq.requestId,
    method: req.method,
    path: req.path,
    params: req.params,
    query: req.query,
    userId: anyReq.user?.id ?? null,
    status,
    errorName,
    errMessage: err.message,
    stack: err.stack,
  });

  const body = { errorId, error: errorName, message: userMessage };

  if (isDev) {
    body.debug = { message: err.message, stack: err.stack };
  }

  res.status(status).json(body);
}

module.exports = errorHandler;
