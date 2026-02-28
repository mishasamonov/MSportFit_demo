const jwt = require('jsonwebtoken');

/**
 * JWT middleware.
 * Очікує заголовок Authorization: "Bearer <token>".
 * Якщо токен валідний — встановлює req.user = { id } і викликає next().
 * Якщо ні — повертає 401.
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
