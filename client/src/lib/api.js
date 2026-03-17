import { getToken } from './auth';

/**
 * Обгортка над нативним `fetch` для взаємодії з REST API застосунку.
 *
 * Автоматично:
 * - виставляє заголовок `Content-Type: application/json`;
 * - серіалізує `body` у JSON;
 * - додає заголовок `Authorization: Bearer <token>`, якщо токен передано
 *   явно через `options.token` або наявний у `localStorage` (через {@link getToken}).
 *
 * @param {string} path - URL або шлях запиту (наприклад, `/api/auth/me`).
 * @param {object} [options={}] - Додаткові параметри запиту.
 * @param {string} [options.method='GET'] - HTTP-метод (`GET`, `POST`, `PUT`, `DELETE` тощо).
 * @param {unknown} [options.body] - Тіло запиту. Буде серіалізовано через `JSON.stringify`.
 * @param {string} [options.token] - JWT-токен для авторизації. Якщо не вказано —
 *   береться з `localStorage` через `getToken()`.
 * @param {Record<string, string>} [options.headers={}] - Додаткові HTTP-заголовки,
 *   що мерджяться поверх стандартних.
 * @returns {Promise<Response>} Нативний об'єкт `Response` від `fetch`.
 * @example
 * // Публічний GET-запит без авторизації
 * const res = await apiFetch('/api/products');
 * const products = await res.json();
 *
 * @example
 * // POST із тілом (токен береться з localStorage автоматично)
 * const res = await apiFetch('/api/auth/login', {
 *   method: 'POST',
 *   body: { email: 'user@example.com', password: 'secret123' },
 * });
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, token: explicitToken, headers = {}, ...rest } = options;

  const token = explicitToken || getToken();

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });

  return response;
}
