import { getToken } from './auth'

/**
 * Проста обгортка над fetch для роботи з API.
 * Автоматично додає JSON-headers та Authorization Bearer токен (якщо є).
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, token: explicitToken, headers = {}, ...rest } = options

  const token = explicitToken || getToken()

  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  })

  return response
}

