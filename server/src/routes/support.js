'use strict';

const express = require('express');
const { randomUUID } = require('crypto');
const logger = require('../utils/logger');
const { detectLang, getErrorText } = require('../i18n/errors');

const router = express.Router();

router.post('/report', (req, res) => {
  const anyReq = /** @type {any} */ (req);
  const body = req.body || {};

  const rawTitle = typeof body.title === 'string' ? body.title.trim() : '';
  const rawDescription = typeof body.description === 'string' ? body.description.trim() : '';

  if (!rawTitle && !rawDescription) {
    const lang = detectLang(req.headers['accept-language']);
    const { message, action } = getErrorText(400, lang);
    return res.status(400).json({ error: 'ValidationError', message, action });
  }

  const title = rawTitle.slice(0, 120);
  const description = rawDescription.slice(0, 2000);
  const steps = typeof body.steps === 'string' ? body.steps.trim().slice(0, 2000) : undefined;

  const { errorId, requestId, pageUrl, client } = body;
  const ticketId = randomUUID();
  const userId = anyReq.user?.id;
  const log = anyReq.log || logger;

  const meta = {
    module: 'support',
    ticketId,
    title,
    description,
    ...(steps !== undefined && { steps }),
    ...(errorId && { errorId }),
    ...(requestId && { requestId }),
    ...(pageUrl && { pageUrl }),
    ...(client && { client }),
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    ...(userId && { userId }),
  };

  if (errorId) {
    log.error('Support report received', meta);
  } else {
    log.warn('Support report received', meta);
  }

  return res.json({ ok: true, ticketId });
});

module.exports = router;
