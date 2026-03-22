import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Усі категорії' },
  { value: 'Крупи', label: 'Крупи' },
  { value: 'Мʼясо', label: 'Мʼясо' },
  { value: 'Молочні продукти', label: 'Молочні продукти' },
  { value: 'Фрукти', label: 'Фрукти' },
  { value: 'Овочі', label: 'Овочі' },
  { value: 'Горіхи', label: 'Горіхи' },
];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [searchInput, setSearchInput] = useState(searchParam);
  const [categoryInput, setCategoryInput] = useState(categoryParam);

  useEffect(() => {
    setSearchInput(searchParam);
    setCategoryInput(categoryParam);
  }, [searchParam, categoryParam]);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchParam) params.set('search', searchParam);
        if (categoryParam) params.set('category', categoryParam);

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
  }, [searchParam, categoryParam]);

  function applyFilters(e) {
    e.preventDefault();
    const next = {};
    if (searchInput.trim()) next.search = searchInput.trim();
    if (categoryInput) next.category = categoryInput;
    setSearchParams(next);
  }

  function resetFilters() {
    setSearchInput('');
    setCategoryInput('');
    setSearchParams({});
  }

  const hasActiveFilters = searchParam || categoryParam;

  return (
    <div className="catalog-page">
      <h1 className="catalog-page__title">Каталог продуктів</h1>

      <form className="catalog-filters" onSubmit={applyFilters}>
        <div className="catalog-filters__group">
          <label htmlFor="filter-search" className="catalog-filters__label">
            Пошук
          </label>
          <input
            id="filter-search"
            className="catalog-filters__input"
            type="text"
            placeholder="Пошук за назвою…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="catalog-filters__group">
          <label htmlFor="filter-category" className="catalog-filters__label">
            Категорія
          </label>
          <select
            id="filter-category"
            className="catalog-filters__select"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button className="catalog-filters__btn" type="submit">
          Застосувати
        </button>

        {hasActiveFilters && (
          <button
            className="catalog-filters__btn catalog-filters__btn--reset"
            type="button"
            onClick={resetFilters}
          >
            Скинути
          </button>
        )}
      </form>

      {loading && <p className="catalog-message">Завантаження продуктів...</p>}

      {!loading && error && (
        <p className="catalog-message catalog-message--error">Помилка: {error}</p>
      )}

      {!loading && !error && !products.length && (
        <p className="catalog-message">
          {hasActiveFilters
            ? 'Нічого не знайдено за обраними фільтрами.'
            : 'Поки що немає жодного продукту.'}
        </p>
      )}

      {!loading && !error && products.length > 0 && (
        <ul className="catalog-list">
          {products.map((product) => (
            <li key={product.id} className="catalog-list__item">
              <Link to={`/products/${product.id}`} className="catalog-list__link">
                {product.title}
              </Link>
              {product.category && (
                <span className="catalog-list__meta">
                  <span className="catalog-list__separator"> — </span>
                  {product.category}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Products;
