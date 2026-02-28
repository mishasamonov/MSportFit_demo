import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { getToken, setToken as saveToken, clearToken } from '../lib/auth';

const AuthContext = createContext(null);

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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
