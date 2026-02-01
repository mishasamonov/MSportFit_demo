import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <nav className="layout__nav">
        <Link to="/">Головна</Link>
        <Link to="/products">Продукти</Link>
        <Link to="/exercises">Вправи</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/favorites">Обране</Link>
        <Link to="/login">Вхід</Link>
        <Link to="/register">Реєстрація</Link>
      </nav>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
