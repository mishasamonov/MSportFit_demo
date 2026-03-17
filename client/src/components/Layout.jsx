import { Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function Layout() {
  const { isAuthed, logout } = useAuth()

  return (
    <div className="layout">
      <nav className="layout__nav">
        <Link to="/">Головна</Link>
        <Link to="/products">Продукти</Link>
        <Link to="/exercises">Вправи</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/calculators">Калькулятори</Link>
        {isAuthed ? (
          <>
            <Link to="/programs">Програми</Link>
            <Link to="/favorites">Обране</Link>
            <button type="button" onClick={logout}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Вхід</Link>
            <Link to="/register">Реєстрація</Link>
          </>
        )}
      </nav>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
