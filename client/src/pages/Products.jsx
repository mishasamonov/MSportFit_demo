import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import { IconFlame } from '../components/HomeIcons';
import './Products.css';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Усі категорії' },
  { value: 'Крупи', label: 'Крупи' },
  { value: 'Мʼясо', label: 'Мʼясо' },
  { value: 'Молочні продукти', label: 'Молочні продукти' },
  { value: 'Фрукти', label: 'Фрукти' },
  { value: 'Овочі', label: 'Овочі' },
  { value: 'Горіхи', label: 'Горіхи' },
];

const FILTER_KEYS = ['search', 'category'];

function formatMacro(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(1) : String(v);
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthed } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [favToggling, setFavToggling] = useState(new Set());

  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || '';

  const hasActiveFilters = FILTER_KEYS.some((k) => searchParams.get(k));

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (currentSearch) params.set('search', currentSearch);
        if (currentCategory) params.set('category', currentCategory);

        const qs = params.toString();
        const url = `/api/products${qs ? `?${qs}` : ''}`;

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Помилка завантаження: ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : data.items || []);
        }
      } catch (err) {
        console.error('Products fetch error', err);
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити продукти');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [currentSearch, currentCategory]);

  useEffect(() => {
    if (!isAuthed) {
      setFavoriteIds(new Set());
      return;
    }

    let isMounted = true;

    async function loadFavorites() {
      try {
        const res = await apiFetch('/api/favorites/products');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setFavoriteIds(new Set(data.map((p) => p.id)));
        }
      } catch (err) {
        console.error('Failed to load product favorites', err);
      }
    }

    loadFavorites();
    return () => {
      isMounted = false;
    };
  }, [isAuthed]);

  const handleToggleFavorite = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed || favToggling.has(productId)) return;

    setFavToggling((prev) => new Set(prev).add(productId));

    const wasFavorite = favoriteIds.has(productId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      wasFavorite ? next.delete(productId) : next.add(productId);
      return next;
    });

    try {
      const method = wasFavorite ? 'DELETE' : 'POST';
      const res = await apiFetch(`/api/favorites/products/${productId}`, { method });
      if (!res.ok) throw new Error('Не вдалося оновити обране');
    } catch (err) {
      console.error('Toggle favorite error', err);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.add(productId) : next.delete(productId);
        return next;
      });
    } finally {
      setFavToggling((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = formData.get('search');
    updateFilter('search', typeof raw === 'string' ? raw.trim() : '');
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="prod-page">
      <section className="prod-hero">
        <div className="prod-hero__inner">
          <h1 className="prod-hero__title">Продукти</h1>
          <p className="prod-hero__desc">
            Каталог продуктів із калорійністю та макронутрієнтами. Знайдіть продукт для
            збалансованого раціону та контролю харчування.
          </p>
        </div>
        <div className="prod-hero__glow" />
      </section>

      <div className="prod-content">
        <div className="prod-filters">
          <form onSubmit={handleSearchSubmit} className="prod-filters__search-form">
            <div className="prod-filters__group">
              <label htmlFor="prod-filter-search" className="prod-filters__label">
                Пошук
              </label>
              <input
                id="prod-filter-search"
                name="search"
                type="text"
                placeholder="Назва продукту…"
                defaultValue={currentSearch}
                key={currentSearch}
                className="prod-filters__input"
              />
            </div>
            <button type="submit" className="prod-filters__btn">
              Знайти
            </button>
          </form>

          <div className="prod-filters__group">
            <label htmlFor="prod-filter-category" className="prod-filters__label">
              Категорія
            </label>
            <select
              id="prod-filter-category"
              value={currentCategory}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="prod-filters__select"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="prod-filters__btn prod-filters__btn--reset"
            >
              Скинути фільтри
            </button>
          )}
        </div>

        {loading && (
          <div className="prod-message">
            <p className="prod-message__text">Завантаження продуктів…</p>
          </div>
        )}

        {!loading && error && (
          <div className="prod-message">
            <p className="prod-message__text prod-message__text--error">Помилка: {error}</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <p className="prod-results-info">
              Знайдено <span className="prod-results-info__count">{products.length}</span>{' '}
              {products.length === 1 ? 'продукт' : products.length < 5 ? 'продукти' : 'продуктів'}
            </p>

            <div className="prod-grid">
              {products.map((product) => {
                const link = `/products/${product.id}`;
                return (
                  <article key={product.id} className="prod-card">
                    {isAuthed && (
                      <button
                        type="button"
                        className={`prod-card__fav-btn${favoriteIds.has(product.id) ? ' prod-card__fav-btn--active' : ''}`}
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        disabled={favToggling.has(product.id)}
                        aria-label={
                          favoriteIds.has(product.id) ? 'Прибрати з обраного' : 'Додати в обране'
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                    )}

                    <h3 className="prod-card__title">
                      <Link to={link} className="prod-card__title-link">
                        {product.title}
                      </Link>
                    </h3>

                    {product.category && (
                      <span className="prod-card__category">{product.category}</span>
                    )}

                    <div className="prod-card__kcal-row">
                      <IconFlame aria-hidden="true" />
                      <span className="prod-card__kcal-value">
                        {product.calories != null ? Math.round(product.calories) : '—'}
                      </span>
                      <span className="prod-card__kcal-unit">ккал</span>
                    </div>

                    <div className="prod-card__macros">
                      <div className="prod-card__stat">
                        <span className="prod-card__stat-value">
                          {formatMacro(product.protein)}г
                        </span>
                        <span className="prod-card__stat-label">Білки</span>
                      </div>
                      <div className="prod-card__stat">
                        <span className="prod-card__stat-value">{formatMacro(product.fat)}г</span>
                        <span className="prod-card__stat-label">Жири</span>
                      </div>
                      <div className="prod-card__stat">
                        <span className="prod-card__stat-value">{formatMacro(product.carbs)}г</span>
                        <span className="prod-card__stat-label">Вуглеводи</span>
                      </div>
                    </div>

                    <div className="prod-card__footer">
                      <Link to={link} className="prod-card__cta">
                        Переглянути деталі →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {!loading && !error && !products.length && (
          <div className="prod-empty">
            <div className="prod-empty__icon">🔍</div>
            <h3 className="prod-empty__title">
              {hasActiveFilters ? 'Нічого не знайдено' : 'Поки що немає продуктів'}
            </h3>
            <p className="prod-empty__text">
              {hasActiveFilters
                ? 'Спробуйте змінити фільтри або скинути їх для перегляду всього каталогу.'
                : "Каталог продуктів поки порожній. Продукти з'являться найближчим часом."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
