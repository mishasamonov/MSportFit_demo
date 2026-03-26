import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Login.css';

function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Помилка авторизації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero" aria-labelledby="login-hero-title">
        <div className="login-hero__glow" aria-hidden="true" />
        <div className="login-hero__content">
          <div className="login-hero__icon-box" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="11" width="16" height="11" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </div>
          <div className="login-hero__text">
            <h1 id="login-hero-title" className="login-hero__title">
              Вхід
            </h1>
            <p className="login-hero__subtitle">
              Увійдіть до облікового запису, щоб зберігати обране, працювати з програмами та
              користуватися персональними можливостями платформи.
            </p>
          </div>
        </div>
      </section>

      <div className="login-body">
        <div className="login-card">
          <form className="login-card__form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                className="login-field__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-password">
                Пароль
              </label>
              <div className="login-field__input-wrap">
                <span className="login-field__input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2a5 5 0 0 0-5 5v4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-2V7a5 5 0 0 0-5-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  id="login-password"
                  className="login-field__input login-field__input--with-leading-icon login-field__input--with-toggle"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                  aria-pressed={showPassword}
                >
                  <span className="login-field__toggle-icon" aria-hidden="true">
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.12 14.12a3 3 0 1 1-4.24-4.24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 2l20 20"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </div>
            {error && (
              <p className="login-card__error" role="alert">
                {error}
              </p>
            )}
            <button className="login-card__submit" type="submit" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
          </form>
          <p className="login-card__footer">
            <span className="login-card__footer-muted">Ще не маєте акаунта? </span>
            <Link to="/register" className="login-card__link">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
