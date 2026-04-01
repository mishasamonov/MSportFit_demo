import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Чи є в стеку історії React Router попередній запис у межах цього SPA
 * (idx з pushState). Для першого входу / прямого відкриття idx === 0.
 */
export function hasAppHistoryBack() {
  const idx = window.history.state?.idx;
  return typeof idx === 'number' && idx > 0;
}

/**
 * Назад по історії браузера, якщо це можливо; інакше — навігація на fallback.
 */
export function useBackOrNavigate(fallbackTo) {
  const navigate = useNavigate();

  return useCallback(() => {
    if (hasAppHistoryBack()) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  }, [navigate, fallbackTo]);
}
