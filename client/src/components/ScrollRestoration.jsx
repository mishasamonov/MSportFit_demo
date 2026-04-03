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

function maxWindowScrollX() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  const h = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0);
  return Math.max(0, h - window.innerWidth);
}

function maxWindowScrollY() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 0;
  const h = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0);
  return Math.max(0, h - window.innerHeight);
}

const POP_RESTORE_MAX_MS = 4000;
const POP_RESTORE_MAX_FRAMES = 200;
const POP_RESTORE_EPS = 1;

/**
 * Після POP довгі сторінки ще не мають повної висоти: перший scrollTo обрізається
 * до maxScroll. Повторюємо після layout (rAF + ResizeObserver), не змінюючи sessionStorage.
 */
function runPendingPopRestore(pos, lastScrollRef, getCancelled) {
  const started = typeof performance !== 'undefined' ? performance.now() : 0;
  let frameCount = 0;
  let rafId = 0;
  let coalesced = false;

  const schedule = () => {
    if (getCancelled() || coalesced) return;
    coalesced = true;
    rafId = window.requestAnimationFrame(() => {
      coalesced = false;
      if (getCancelled()) return;
      step();
    });
  };

  const step = () => {
    if (getCancelled()) return;
    frameCount += 1;
    const elapsed = typeof performance !== 'undefined' ? performance.now() - started : 0;
    if (frameCount > POP_RESTORE_MAX_FRAMES || elapsed > POP_RESTORE_MAX_MS) {
      return;
    }

    const maxX = maxWindowScrollX();
    const maxY = maxWindowScrollY();
    const heightNotReady = pos.y > maxY + POP_RESTORE_EPS;
    const widthNotReady = pos.x > maxX + POP_RESTORE_EPS;

    if (heightNotReady || widthNotReady) {
      schedule();
      return;
    }

    window.scrollTo(pos.x, pos.y);
    lastScrollRef.current = pos;

    const dx = Math.abs(window.scrollX - pos.x);
    const dy = Math.abs(window.scrollY - pos.y);
    if (dx > POP_RESTORE_EPS || dy > POP_RESTORE_EPS) {
      schedule();
    }
  };

  step();
  schedule();

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => {
      if (getCancelled()) return;
      schedule();
    });
    ro.observe(document.documentElement);
  }

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    ro?.disconnect();
  };
}

/**
 * Власник збереженої прокрутки — завжди поточний history entry: location.key.
 * Під час активного маршруту RAF-після-scroll пише лише в sessionStorage під цим ключем.
 * При PUSH/REPLACE і зміні pathname — scrollTo(0,0) і початковий запис для нового ключа.
 * При POP — відновлення з readScroll(location.key); запис під попередній ключ з window
 * не робимо: після коміту списку window уже не позиція деталі (перезаписував би збереження деталі).
 * При зміні ключа без POP — фіксуємо покинутий запис з lastScrollRef (останній скрол на тому entry).
 */
function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const scrollOwnerKeyRef = useRef(location.key);

  useLayoutEffect(() => {
    scrollOwnerKeyRef.current = location.key;
  }, [location.key]);

  useLayoutEffect(() => {
    try {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {
      // ignore
    }
  }, []);

  const lastScrollRef = useRef({
    x: typeof window !== 'undefined' ? window.scrollX : 0,
    y: typeof window !== 'undefined' ? window.scrollY : 0,
  });
  const prevHistoryKeyRef = useRef(location.key);
  const prevPathnameRef = useRef(location.pathname);

  const popRestoreCleanupRef = useRef(null);

  useLayoutEffect(() => {
    const prevKey = prevHistoryKeyRef.current;
    const prevPathname = prevPathnameRef.current;

    if (prevKey !== location.key) {
      if (navigationType !== 'POP') {
        // Остання позиція запису, який покидаємо: з lastScrollRef (RAF після scroll), не з
        // window у цьому кадрі — після коміту нового маршруту window інколи вже 0, тоді б
        // перезатерли збережений скрол списку.
        writeScroll(prevKey, lastScrollRef.current);
      }
      prevHistoryKeyRef.current = location.key;
    }

    const physical = {
      x: typeof window !== 'undefined' ? window.scrollX : 0,
      y: typeof window !== 'undefined' ? window.scrollY : 0,
    };
    lastScrollRef.current = physical;

    let popCancelled = false;
    if (popRestoreCleanupRef.current) {
      popRestoreCleanupRef.current();
      popRestoreCleanupRef.current = null;
    }

    if (navigationType === 'POP') {
      const pos = readScroll(location.key);
      if (pos) {
        popRestoreCleanupRef.current = runPendingPopRestore(pos, lastScrollRef, () => popCancelled);
      }
    } else if (location.pathname !== prevPathname) {
      window.scrollTo(0, 0);
      lastScrollRef.current = { x: 0, y: 0 };
      writeScroll(location.key, { x: 0, y: 0 });
    }

    prevPathnameRef.current = location.pathname;

    return () => {
      popCancelled = true;
      if (popRestoreCleanupRef.current) {
        popRestoreCleanupRef.current();
        popRestoreCleanupRef.current = null;
      }
    };
  }, [location.key, location.pathname, navigationType]);

  useEffect(() => {
    let rafId = null;

    const flush = () => {
      rafId = null;
      const next = { x: window.scrollX, y: window.scrollY };
      lastScrollRef.current = next;
      writeScroll(scrollOwnerKeyRef.current, next);
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
