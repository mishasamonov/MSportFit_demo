import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_PREFIX = 'msportfit:scroll:';

function storageKey(historyKey) {
  return `${STORAGE_PREFIX}${historyKey}`;
}

function readScroll(historyKey) {
  try {
    const raw = sessionStorage.getItem(storageKey(historyKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.x === 'number' &&
      typeof parsed?.y === 'number' &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {
    // ignore
  }
  return null;
}

function writeScroll(historyKey, pos) {
  try {
    sessionStorage.setItem(storageKey(historyKey), JSON.stringify(pos));
  } catch {
    // ignore
  }
}

/**
 * PUSH/REPLACE зі зміною pathname — прокрутка вгору (як раніше).
 * Зміна лише query на тому ж pathname — позицію не скидаємо (наприклад /favorites).
 * POP (назад/вперед) — відновлення збереженої позиції для location.key.
 */
function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const lastScrollRef = useRef({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
  });
  const prevHistoryKeyRef = useRef(location.key);
  const prevPathnameRef = useRef(location.pathname);

  useLayoutEffect(() => {
    const prevKey = prevHistoryKeyRef.current;
    const prevPathname = prevPathnameRef.current;

    if (prevKey !== location.key) {
      writeScroll(prevKey, lastScrollRef.current);
      prevHistoryKeyRef.current = location.key;
    }

    if (navigationType === 'POP') {
      const pos = readScroll(location.key);
      if (pos) {
        window.scrollTo(pos.x, pos.y);
        lastScrollRef.current = pos;
      }
    } else if (location.pathname !== prevPathname) {
      window.scrollTo(0, 0);
      lastScrollRef.current = { x: 0, y: 0 };
    }

    prevPathnameRef.current = location.pathname;
  }, [location.key, location.pathname, navigationType]);

  useEffect(() => {
    let rafId = null;

    const flush = () => {
      rafId = null;
      const next = { x: window.scrollX, y: window.scrollY };
      lastScrollRef.current = next;
      writeScroll(location.key, next);
    };

    const onScroll = () => {
      if (rafId == null) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [location.key]);

  return null;
}

export default ScrollRestoration;
