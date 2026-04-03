import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Індекс запису в історії, який виставляє React Router у history.state.idx (див. getHistoryState).
 * Якщо idx відсутній або не число — трактуємо як 0 (немає «внутрішнього» кроку назад у межах SPA).
 */
function historyIndexFromState() {
  if (typeof window === 'undefined') return 0;
  const st = window.history.state;
  if (st == null || typeof st !== 'object') return 0;
  const raw = st.idx;
  const n = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Чи є в стеку історії React Router попередній запис у межах цього SPA
 * (idx з pushState). Для першого входу / прямого відкриття idx === 0.
 */
export function hasAppHistoryBack() {
  return historyIndexFromState() > 0;
}

/**
 * Назад по історії браузера, якщо це можливо; інакше — навігація на fallback.
 * Завжди читає актуальний history.state на момент кліку (не кешує idx).
 */
export function useBackOrNavigate(fallbackTo) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (hasAppHistoryBack()) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo);
  }, [navigate, fallbackTo]);
}
