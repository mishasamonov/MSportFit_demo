import { Link } from 'react-router-dom';
import logoFull from '../assets/brand/logo-full.png';
import './Footer.css';

const PLATFORM_LINKS = [
  { to: '/programs', label: 'Програми' },
  { to: '/exercises', label: 'Вправи' },
  { to: '/products', label: 'Продукти' },
  { to: '/calculators', label: 'Калькулятори' },
];

const EXTRA_LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/favorites', label: 'Обране' },
  { to: '/login', label: 'Увійти' },
  { to: '/register', label: 'Реєстрація' },
];

/** За потреби замініть на реальні URL соцмереж */
const SOCIAL_LINKS = [
  {
    href: '#',
    label: 'Telegram',
    icon: (
      <svg
        className="ft__social-svg ft__social-svg--telegram"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.38-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.833-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
        />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'Instagram',
    icon: (
      <svg
        className="ft__social-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '#',
    label: 'GitHub',
    icon: (
      <svg
        className="ft__social-svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
];

function Footer() {
  return (
    <footer className="ft" role="contentinfo">
      <div className="ft__inner">
        <div className="ft__top">
          <div className="ft__brand">
            <div className="ft__brand-head">
              <img src={logoFull} alt="MSportFit" className="ft__brand-logo" />
            </div>
            <p className="ft__brand-desc">
              Платформа для тренувань, збалансованого харчування та корисних фітнес-інструментів —
              усе в одному місці.
            </p>
          </div>

          <nav className="ft__col ft__col--nav" aria-label="Розділи платформи">
            <p className="ft__col-title">Платформа</p>
            <ul className="ft__link-list">
              {PLATFORM_LINKS.map(({ to, label }) => (
                <li key={to} className="ft__link-item">
                  <Link to={to} className="ft__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ft__col ft__col--extra" aria-label="Швидкий доступ">
            <p className="ft__col-title">Швидкий доступ</p>
            <ul className="ft__link-list">
              {EXTRA_LINKS.map(({ to, label }) => (
                <li key={to} className="ft__link-item">
                  <Link to={to} className="ft__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft__col ft__col--social">
            <p className="ft__col-title">Соцмережі</p>
            <ul className="ft__social-list" aria-label="Соціальні мережі">
              {SOCIAL_LINKS.map(({ href, label, icon }) => {
                const isExternal = /^https?:\/\//i.test(href);
                return (
                  <li key={label} className="ft__social-item">
                    <a
                      href={href}
                      className="ft__social-link"
                      aria-label={label}
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {icon}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="ft__bottom">
          <p className="ft__copy">© 2026 MSportFit. Усі права захищені.</p>
          <p className="ft__credit">Розробник сайту — Misha Samonov</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
