const jwt = require('jsonwebtoken');

/**
 * Express-middleware для перевірки JWT Bearer-токена.
 *
 * Очікує заголовок запиту у форматі:
 * ```
 * Authorization: Bearer <token>
 * ```
 *
 * Поведінка:
 * - Якщо заголовок відсутній або має невірний формат — повертає `401 Unauthorized`.
 * - Якщо змінна середовища `JWT_SECRET` не встановлена — повертає `500 ServerConfigError`.
 * - Якщо токен невалідний або прострочений — повертає `401 Unauthorized`.
 * - Якщо токен валідний — встановлює `req.user = { id: decoded.sub }` і передає
 *   управління до наступного middleware через `next()`.
 *
 * @param {object} req - Об'єкт запиту Express (Request).
 *   Після успішної перевірки містить розширену властивість `req.user`.
 * @param {object} res - Об'єкт відповіді Express (Response).
 * @param {Function} next - Функція передачі управління (NextFunction)
 *   наступному middleware або обробнику маршруту.
 * @returns {void}
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Потрібна авторизація (відсутній токен)',
    });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Некоректний формат токена авторизації',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not set in environment variables');
    return res.status(500).json({
      error: 'ServerConfigError',
      message: 'Сервер авторизації некоректно налаштований',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded || !decoded.sub) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Невалідний токен',
      });
    }

    req.user = { id: decoded.sub };
    return next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Невірний або прострочений токен',
    });
  }
}

module.exports = authMiddleware;
