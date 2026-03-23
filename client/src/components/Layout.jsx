import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logoNavbar from '../assets/brand/logo-navbar.png';

function Layout() {
  const { isAuthed, logout } = useAuth();

  return (
    <div className="layout">
      <header className="header">
        <div className="header__inner">
          <Link to="/" className="header__brand">
            <img src={logoNavbar} alt="MSportFit" className="header__brand-logo" />
          </Link>

          <nav className="header__nav">
            {isAuthed && (
              <NavLink to="/programs" className="header__nav-link">
                Програми
              </NavLink>
            )}
            <NavLink to="/exercises" className="header__nav-link">
              Вправи
            </NavLink>
            <NavLink to="/products" className="header__nav-link">
              Продукти
            </NavLink>
            <NavLink to="/calculators" className="header__nav-link">
              Калькулятори
            </NavLink>
            <NavLink to="/faq" className="header__nav-link">
              FAQ
            </NavLink>
            {isAuthed && (
              <NavLink to="/favorites" className="header__nav-link">
                Обране
              </NavLink>
            )}
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
        </div>
      </header>

      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
