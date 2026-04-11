import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Register.css';

function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== passwordRepeat) {
      setError('Паролі не співпадають');
      return;
    }

    if (password.length < 6) {
      setError('Пароль має містити щонайменше 6 символів');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
    } catch (err) {
      setError(err.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <section className="register-hero" aria-labelledby="register-hero-title">
        <div className="register-hero__glow" aria-hidden="true" />
        <div className="register-hero__content">
          <div className="register-hero__icon-box" aria-hidden="true">
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <div className="register-hero__text">
            <h1 id="register-hero-title" className="register-hero__title">
              Реєстрація
            </h1>
            <p className="register-hero__subtitle">
              Створіть обліковий запис, щоб зберігати обране, працювати з програмами та
              користуватися персональними можливостями платформи.
            </p>
          </div>
        </div>
      </section>

      <div className="register-body">
        <div className="register-card">
          <form className="register-card__form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label className="register-field__label" htmlFor="register-email">
                Email
              </label>
              <input
                id="register-email"
                className="register-field__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="register-field">
              <label className="register-field__label" htmlFor="register-password">
                Пароль
              </label>
              <div className="register-field__input-wrap">
                <span className="register-field__input-icon" aria-hidden="true">
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
                  id="register-password"
                  className="register-field__input register-field__input--with-leading-icon register-field__input--with-toggle"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  autoComplete="new-password"
                  onInvalid={(e) =>
                    e.target.setCustomValidity('Поле повинно містити щонайменше 6 символів')
                  }
                  onInput={(e) => e.target.setCustomValidity('')}
                />
                <button
                  type="button"
                  className="register-field__toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                  aria-pressed={showPassword}
                >
                  <span className="register-field__toggle-icon" aria-hidden="true">
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
            <div className="register-field">
              <label className="register-field__label" htmlFor="register-password-repeat">
                Повторіть пароль
              </label>
              <div className="register-field__input-wrap">
                <span className="register-field__input-icon" aria-hidden="true">
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
                  id="register-password-repeat"
                  className="register-field__input register-field__input--with-leading-icon register-field__input--with-toggle"
                  type={showPasswordRepeat ? 'text' : 'password'}
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  minLength={6}
                  required
                  autoComplete="new-password"
                  onInvalid={(e) =>
                    e.target.setCustomValidity('Поле повинно містити щонайменше 6 символів')
                  }
                  onInput={(e) => e.target.setCustomValidity('')}
                />
                <button
                  type="button"
                  className="register-field__toggle"
                  onClick={() => setShowPasswordRepeat((v) => !v)}
                  aria-label={
                    showPasswordRepeat ? 'Приховати повтор пароля' : 'Показати повтор пароля'
                  }
                  aria-pressed={showPasswordRepeat}
                >
                  <span className="register-field__toggle-icon" aria-hidden="true">
                    {showPasswordRepeat ? (
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
              <p className="register-card__error" role="alert">
                {error}
              </p>
            )}
            <button className="register-card__submit" type="submit" disabled={loading}>
              {loading ? 'Реєстрація...' : 'Зареєструватися'}
            </button>
          </form>
          <p className="register-card__footer">
            <span className="register-card__footer-muted">Вже маєте акаунт? </span>
            <Link to="/login" className="register-card__link">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
