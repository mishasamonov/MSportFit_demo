/**
 * Ключ, під яким JWT-токен зберігається у `localStorage`.
 *
 * @type {string}
 */
const TOKEN_KEY = 'msportfit_token';

/**
 * Повертає збережений JWT-токен із `localStorage`.
 *
 * Якщо доступ до `localStorage` неможливий (наприклад, у режимі private browsing
 * або у середовищі без DOM) — повертає `null` замість викидання виключення.
 *
 * @returns {string|null} JWT-токен або `null`, якщо токен відсутній чи недоступний.
 * @example
 * const token = getToken();
 * if (token) {
 *   console.log('Користувач авторизований');
 * }
 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * Зберігає JWT-токен у `localStorage`, або видаляє його, якщо передано falsy-значення.
 *
 * Помилки доступу до `localStorage` ігноруються (наприклад, переповнення сховища,
 * заблокований доступ у приватному режимі браузера).
 *
 * @param {string|null|undefined} token - JWT-токен для збереження.
 *   Якщо `null`, `undefined` або порожній рядок — токен буде видалено.
 * @returns {void}
 * @example
 * setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *
 * // Видалити токен:
 * setToken(null);
 */
export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ігноруємо помилки доступу до localStorage
  }
}

/**
 * Видаляє JWT-токен із `localStorage`.
 *
 * Є семантичним еквівалентом `setToken(null)`, але явно виражає намір виходу/очищення.
 * Помилки доступу до `localStorage` ігноруються.
 *
 * @returns {void}
 * @example
 * clearToken(); // Токен видалено, сесія завершена
 */
export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
