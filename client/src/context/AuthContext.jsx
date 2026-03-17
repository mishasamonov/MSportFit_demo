import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { getToken, setToken as saveToken, clearToken } from '../lib/auth';

/**
 * Дані користувача, які повертає API.
 * @typedef {Object} AuthUser
 * @property {string} id ID користувача (UUID)
 * @property {string} email Email користувача
 * @property {string} [createdAt] ISO-рядок дати створення облікового запису
 */

/**
 * Значення AuthContext, яке використовується у клієнті.
 * @typedef {Object} AuthContextValue
 * @property {AuthUser|null} user Поточний авторизований користувач або null
 * @property {string|null} token JWT Bearer-токен або null
 * @property {boolean} isAuthed Ознака авторизації (true якщо є user і token)
 * @property {boolean} loading Стан завантаження під час початкової перевірки сесії
 * @property {function(string, string): Promise<void>} login Вхід (email, password)
 * @property {function(string, string): Promise<void>} register Реєстрація (email, password)
 * @property {function(): void} logout Вихід (очищає токен та стан)
 */

const AuthContext = createContext(null);

/**
 * Провайдер контексту авторизації для застосунку MSportFit.
 *
 * При монтуванні перевіряє наявність збереженого JWT-токена і,
 * якщо він є, завантажує дані поточного користувача через `GET /api/auth/me`.
 * Надає нащадкам {@link AuthContextValue} через React Context.
 *
 * @param {object} props - Пропси компонента.
 * @param {React.ReactNode} props.children - Дочірні React-елементи.
 * @returns {React.ReactElement} Провайдер контексту з обгорнутими дочірніми елементами.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(() => getToken());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthed = Boolean(user && token);

  useEffect(() => {
    let isMounted = true;

    async function loadMe(currentToken) {
      if (!currentToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await apiFetch('/api/auth/me', { token: currentToken });
        if (res.status === 401) {
          clearToken();
          if (isMounted) {
            setUser(null);
            setTokenState(null);
          }
          return;
        }

        if (!res.ok) {
          console.error('Auth /me error:', res.status);
          return;
        }

        const data = await res.json();
        if (isMounted) {
          setUser(data);
        }
      } catch (err) {
        console.error('Auth /me fetch error', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMe(token);

    return () => {
      isMounted = false;
    };
  }, [token]);

  const applyAuth = (nextToken, userData) => {
    saveToken(nextToken);
    setTokenState(nextToken || null);
    setUser(userData || null);
  };

  const login = async (email, password) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const msg = errorBody.message || 'Не вдалося виконати вхід';
      throw new Error(msg);
    }

    const data = await res.json();
    applyAuth(data.token, data.user);
    navigate('/favorites');
  };

  const register = async (email, password) => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: { email, password },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const msg = errorBody.message || 'Не вдалося зареєструватися';
      throw new Error(msg);
    }

    const data = await res.json();
    applyAuth(data.token, data.user);
    navigate('/favorites');
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setTokenState(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthed,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * React-хук для доступу до контексту авторизації.
 *
 * Повертає поточний {@link AuthContextValue}: дані користувача, токен,
 * статус завантаження та методи `login`, `register`, `logout`.
 *
 * @returns {AuthContextValue} Значення контексту авторизації.
 * @throws {Error} Якщо хук викликається поза деревом компонентів, що обгорнуті
 *   у {@link AuthProvider}.
 * @example
 * function ProfileButton() {
 *   const { user, logout, isAuthed } = useAuth();
 *   if (!isAuthed) return null;
 *   return <button onClick={logout}>{user.email}</button>;
 * }
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
