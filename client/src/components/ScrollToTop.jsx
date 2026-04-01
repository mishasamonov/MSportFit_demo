import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Прокручує вікно на початок при переході на інший шлях (нова «сторінка»).
 * Query без зміни pathname не чіпаємо — щоб перемикання вкладок на /favorites не скролило вгору.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
