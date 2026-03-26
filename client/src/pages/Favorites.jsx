import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import { IconFlame } from '../components/HomeIcons';
import './Exercises.css';
import './Products.css';
import './Favorites.css';

const TAB_EX = 'exercises';
const TAB_PROD = 'products';

function truncate(text, max = 120) {
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function formatMacro(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(1) : String(v);
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function Favorites() {
  const [products, setProducts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(TAB_EX);
  const [removingEx, setRemovingEx] = useState(() => new Set());
  const [removingProd, setRemovingProd] = useState(() => new Set());
  const tabInitRef = useRef(false);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, exercisesRes] = await Promise.all([
        apiFetch('/api/favorites/products'),
        apiFetch('/api/favorites/exercises'),
      ]);

      if (!productsRes.ok || !exercisesRes.ok) {
        throw new Error('Не вдалося завантажити обране');
      }

      const [productsData, exercisesData] = await Promise.all([
        productsRes.json(),
        exercisesRes.json(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setExercises(Array.isArray(exercisesData) ? exercisesData : []);
    } catch (err) {
      console.error('Favorites fetch error', err);
      setError(err.message || 'Не вдалося завантажити обране');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (loading) return;
    if (!tabInitRef.current) {
      tabInitRef.current = true;
      if (exercises.length === 0 && products.length > 0) {
        setActiveTab(TAB_PROD);
      }
    }
  }, [loading, exercises.length, products.length]);

  const handleRemoveExercise = async (exerciseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (removingEx.has(exerciseId)) return;

    const removed = exercises.find((x) => x.id === exerciseId);
    setRemovingEx((prev) => new Set(prev).add(exerciseId));
    setExercises((prev) => prev.filter((x) => x.id !== exerciseId));

    try {
      const res = await apiFetch(`/api/favorites/exercises/${exerciseId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося оновити обране');
    } catch (err) {
      console.error('Remove exercise favorite error', err);
      if (removed) {
        setExercises((prev) => [...prev, removed]);
      }
    } finally {
      setRemovingEx((prev) => {
        const next = new Set(prev);
        next.delete(exerciseId);
        return next;
      });
    }
  };

  const handleRemoveProduct = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (removingProd.has(productId)) return;

    const removed = products.find((x) => x.id === productId);
    setRemovingProd((prev) => new Set(prev).add(productId));
    setProducts((prev) => prev.filter((x) => x.id !== productId));

    try {
      const res = await apiFetch(`/api/favorites/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Не вдалося оновити обране');
    } catch (err) {
      console.error('Remove product favorite error', err);
      if (removed) {
        setProducts((prev) => [...prev, removed]);
      }
    } finally {
      setRemovingProd((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const bothEmpty = !loading && !error && exercises.length === 0 && products.length === 0;
  const exCountLabel = loading ? '' : ` (${exercises.length})`;
  const prodCountLabel = loading ? '' : ` (${products.length})`;

  return (
    <div className="fav-page">
      <section className="fav-hero">
        <div className="fav-hero__glow" aria-hidden="true" />
        <div className="fav-hero__content">
          <div className="fav-hero__icon-box" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div>
            <h1 className="fav-hero__title">Обране</h1>
            <p className="fav-hero__subtitle">
              Збережені вправи та продукти в одному місці. Поверніться до деталей, техніки виконання
              та харчових значень без повторного пошуку.
            </p>
          </div>
        </div>
      </section>

      <div className="fav-content">
        {loading && (
          <div className="fav-loading" aria-busy="true" aria-live="polite">
            <div className="fav-loading__bar" />
            <p className="fav-loading__text">Завантаження обраного…</p>
            <div className="fav-loading__grid">
              <div className="fav-loading__card" />
              <div className="fav-loading__card" />
              <div className="fav-loading__card" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="fav-error">
            <p className="fav-error__text">{error}</p>
            <button type="button" className="fav-error__retry" onClick={loadFavorites}>
              Спробувати ще раз
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="fav-tabs" role="tablist" aria-label="Тип обраного">
              <button
                type="button"
                role="tab"
                id="fav-tab-ex"
                aria-selected={activeTab === TAB_EX}
                aria-controls="fav-panel-ex"
                className={`fav-tabs__btn${activeTab === TAB_EX ? ' fav-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab(TAB_EX)}
              >
                Вправи{exCountLabel}
              </button>
              <button
                type="button"
                role="tab"
                id="fav-tab-prod"
                aria-selected={activeTab === TAB_PROD}
                aria-controls="fav-panel-prod"
                className={`fav-tabs__btn${activeTab === TAB_PROD ? ' fav-tabs__btn--active' : ''}`}
                onClick={() => setActiveTab(TAB_PROD)}
              >
                Продукти{prodCountLabel}
              </button>
            </div>

            {bothEmpty && (
              <div className="fav-global-empty" role="status">
                <p className="fav-global-empty__text">
                  Поки що немає збережених вправ і продуктів — скористайтеся вкладками нижче або
                  перейдіть у каталоги.
                </p>
              </div>
            )}

            <div
              id="fav-panel-ex"
              role="tabpanel"
              aria-labelledby="fav-tab-ex"
              aria-hidden={activeTab !== TAB_EX}
              className={`fav-tab-panel${activeTab === TAB_EX ? ' fav-tab-panel--visible' : ''}`}
            >
              {exercises.length > 0 ? (
                <div className="ex-grid">
                  {exercises.map((exercise) => {
                    const link = `/exercises/${exercise.slug || exercise.id}`;
                    return (
                      <article key={exercise.id} className="ex-card">
                        <button
                          type="button"
                          className="ex-card__fav-btn ex-card__fav-btn--active"
                          onClick={(e) => handleRemoveExercise(exercise.id, e)}
                          disabled={removingEx.has(exercise.id)}
                          aria-label="Прибрати з обраного"
                        >
                          <HeartIcon />
                        </button>

                        <div className="ex-card__tags">
                          {exercise.muscleGroup && (
                            <span className="ex-card__tag ex-card__tag--accent">
                              {exercise.muscleGroup}
                            </span>
                          )}
                          {exercise.level && <span className="ex-card__tag">{exercise.level}</span>}
                          {exercise.equipment && (
                            <span className="ex-card__tag">{exercise.equipment}</span>
                          )}
                        </div>

                        <h3 className="ex-card__title">
                          <Link to={link} className="ex-card__title-link">
                            {exercise.title}
                          </Link>
                        </h3>

                        {exercise.description && (
                          <p className="ex-card__desc">{truncate(exercise.description, 120)}</p>
                        )}

                        {exercise.category && (
                          <p className="ex-card__muscles">
                            <span className="ex-card__muscles-label">Категорія:</span>{' '}
                            <span className="ex-card__muscles-value">{exercise.category}</span>
                          </p>
                        )}

                        <div className="ex-card__footer">
                          <Link to={link} className="ex-card__cta">
                            Переглянути техніку →
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="ex-empty fav-empty-block">
                  <div className="ex-empty__icon" aria-hidden="true">
                    ♡
                  </div>
                  <h3 className="ex-empty__title">У вас ще немає збережених вправ</h3>
                  <p className="ex-empty__text">
                    Додавайте вправи в обране, щоб швидко повертатися до техніки виконання.
                  </p>
                  <div className="fav-empty__actions">
                    <Link to="/exercises" className="fav-empty__btn fav-empty__btn--primary">
                      До вправ
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              id="fav-panel-prod"
              role="tabpanel"
              aria-labelledby="fav-tab-prod"
              aria-hidden={activeTab !== TAB_PROD}
              className={`fav-tab-panel${activeTab === TAB_PROD ? ' fav-tab-panel--visible' : ''}`}
            >
              {products.length > 0 ? (
                <div className="prod-grid">
                  {products.map((product) => {
                    const link = `/products/${product.id}`;
                    return (
                      <article key={product.id} className="prod-card">
                        <button
                          type="button"
                          className="prod-card__fav-btn prod-card__fav-btn--active"
                          onClick={(e) => handleRemoveProduct(product.id, e)}
                          disabled={removingProd.has(product.id)}
                          aria-label="Прибрати з обраного"
                        >
                          <HeartIcon />
                        </button>

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
                            <span className="prod-card__stat-value">
                              {formatMacro(product.fat)}г
                            </span>
                            <span className="prod-card__stat-label">Жири</span>
                          </div>
                          <div className="prod-card__stat">
                            <span className="prod-card__stat-value">
                              {formatMacro(product.carbs)}г
                            </span>
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
              ) : (
                <div className="prod-empty fav-empty-block">
                  <div className="prod-empty__icon" aria-hidden="true">
                    ♡
                  </div>
                  <h3 className="prod-empty__title">У вас ще немає збережених продуктів</h3>
                  <p className="prod-empty__text">
                    Додавайте продукти в обране, щоб швидко переглядати калорійність і
                    макронутрієнти.
                  </p>
                  <div className="fav-empty__actions">
                    <Link to="/products" className="fav-empty__btn fav-empty__btn--primary">
                      До продуктів
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Favorites;
