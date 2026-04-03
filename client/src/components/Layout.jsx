import { useCallback, useEffect, useState } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logoNavbar from '../assets/brand/logo-navbar.png';
import Footer from './Footer';
import ScrollRestoration from './ScrollRestoration';

function navItemsForAuth(isAuthed) {
  const items = [];
  if (isAuthed) items.push({ to: '/programs', label: 'Програми' });
  items.push(
    { to: '/exercises', label: 'Вправи' },
    { to: '/products', label: 'Продукти' },
    { to: '/calculators', label: 'Калькулятори' },
    { to: '/faq', label: 'FAQ' },
  );
  if (isAuthed) items.push({ to: '/favorites', label: 'Обране' });
  return items;
}

function Layout() {
  const { isAuthed, logout } = useAuth();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const navItems = navItemsForAuth(isAuthed);

  const closeNav = useCallback(() => setNavOpen(false), []);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) setNavOpen(false);
    });
    return () => {
      alive = false;
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeNav();
    };
    window.addEventListener('keydown', onKey);
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      window.scrollTo(scrollX, scrollY);
    };
  }, [navOpen, closeNav]);

  return (
    <div className="layout">
      <ScrollRestoration />
      <header className={`header${navOpen ? ' header--nav-open' : ''}`}>
        <div className="header__inner">
          <Link to="/" className="header__brand" onClick={closeNav}>
            <img src={logoNavbar} alt="MSportFit" className="header__brand-logo" />
          </Link>

          <nav className="header__nav" aria-label="Головна навігація">
            {navItems.map(({ to, label }) => (
              <NavLink key={to} to={to} className="header__nav-link">
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="header__auth">
            {isAuthed ? (
              <button type="button" className="header__btn header__btn--logout" onClick={logout}>
                Вийти
              </button>
            ) : (
              <>
                <NavLink to="/login" className="header__auth-link">
                  Увійти
                </NavLink>
                <NavLink to="/register" className="header__btn header__btn--register">
                  Реєстрація
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="header__menu-btn"
            aria-expanded={navOpen}
            aria-controls="msf-header-sheet"
            aria-label={navOpen ? 'Закрити меню' : 'Відкрити меню'}
            onClick={() => setNavOpen((o) => !o)}
          >
            <span className="header__menu-icon" aria-hidden>
              <span />
            </span>
          </button>
        </div>

        <button
          type="button"
          className="header__backdrop"
          aria-label="Закрити меню"
          tabIndex={navOpen ? 0 : -1}
          onClick={closeNav}
        />

        <div
          id="msf-header-sheet"
          className="header__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Меню навігації"
          aria-hidden={!navOpen}
        >
          <div className="header__sheet-inner">
            <nav className="header__sheet-nav" aria-label="Розділи сайту">
              {navItems.map(({ to, label }) => (
                <NavLink key={to} to={to} className="header__sheet-link" onClick={closeNav}>
                  {label}
                </NavLink>
              ))}
            </nav>

            {!isAuthed && (
              <>
                <div className="header__sheet-divider" aria-hidden />
                <div className="header__sheet-foot">
                  <NavLink to="/login" className="header__auth-link" onClick={closeNav}>
                    Увійти
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="header__btn header__btn--register"
                    onClick={closeNav}
                  >
                    Реєстрація
                  </NavLink>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default Layout;
