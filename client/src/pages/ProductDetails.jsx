import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBackOrNavigate } from '../hooks/useBackOrNavigate.js';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api';
import { IconFlame, IconHeart } from '../components/HomeIcons';
import './ProductDetails.css';
import './Products.css';

function formatMacro(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  return Number.isFinite(n) ? n.toFixed(1) : String(v);
}

function kcalDisplay(v) {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : '—';
}

function parseMacroNum(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Відсотки частки Б/Ж/В у сумі грамів макросів (лише для відображення). При total ≤ 0 — безпечні нулі. */
function macroSharePercents(protein, fat, carbs) {
  const p = parseMacroNum(protein) ?? 0;
  const f = parseMacroNum(fat) ?? 0;
  const c = parseMacroNum(carbs) ?? 0;
  const total = p + f + c;
  if (total <= 0) {
    return { protein: 0, fat: 0, carbs: 0, hasData: false };
  }
  return {
    protein: Math.round((p / total) * 100),
    fat: Math.round((f / total) * 100),
    carbs: Math.round((c / total) * 100),
    hasData: true,
  };
}

function ProductDetails() {
  const { id } = useParams();
  const goBackToProducts = useBackOrNavigate('/products');
  const { isAuthed } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteReqRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Продукт не знайдено');
          }
          throw new Error(`Помилка завантаження: ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Product details fetch error', err);
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити продукт');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteState() {
      if (!isAuthed) {
        setIsFavorite(false);
        return;
      }

      try {
        const res = await apiFetch('/api/favorites/products');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) return;

        if (isMounted) {
          setIsFavorite(data.some((p) => p.id === id));
        }
      } catch (err) {
        console.error('Product favorite state error', err);
      }
    }

    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthed]);

  const handleToggleFavorite = async () => {
    if (!product || !isAuthed || favoriteReqRef.current) return;

    const prevFavorite = isFavorite;
    const nextFavorite = !prevFavorite;
    setIsFavorite(nextFavorite);
    favoriteReqRef.current = true;

    try {
      const method = nextFavorite ? 'POST' : 'DELETE';
      const res = await apiFetch(`/api/favorites/products/${id}`, { method });
      if (!res.ok) {
        throw new Error('Не вдалося оновити обране');
      }
    } catch (err) {
      setIsFavorite(prevFavorite);
      console.error('Toggle favorite product error', err);
      alert(err.message || 'Помилка оновлення обраного');
    } finally {
      favoriteReqRef.current = false;
    }
  };

  if (loading) {
    return (
      <div className="pd-page">
        <div className="prod-message pd-state">
          <p className="prod-message__text">Завантаження продукту…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pd-page">
        <div className="pd-state pd-state--center">
          <p className="prod-message__text prod-message__text--error">Помилка: {error}</p>
          <button
            type="button"
            className="pd-hero__back pd-hero__back--spaced"
            onClick={goBackToProducts}
          >
            ← До каталогу продуктів
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-page">
        <div className="prod-empty">
          <div className="prod-empty__icon" aria-hidden="true">
            📦
          </div>
          <h3 className="prod-empty__title">Продукт не знайдено</h3>
          <p className="prod-empty__text">
            Спробуйте повернутися до каталогу та обрати інший продукт.
          </p>
          <button
            type="button"
            className="pd-hero__back pd-hero__back--spaced"
            onClick={goBackToProducts}
          >
            ← До каталогу продуктів
          </button>
        </div>
      </div>
    );
  }

  const categoryLabel = product.category && String(product.category).trim();
  const proteinStr = formatMacro(product.protein);
  const fatStr = formatMacro(product.fat);
  const carbsStr = formatMacro(product.carbs);
  const kcalStr = kcalDisplay(product.calories);

  const descRaw = typeof product.description === 'string' ? product.description.trim() : '';
  const leadText =
    descRaw || 'Поживна цінність на 100 г продукту. Дані орієнтовні для планування раціону.';

  const shares = macroSharePercents(product.protein, product.fat, product.carbs);

  const pctLabel = (key) => {
    if (!shares.hasData) return '—';
    return `${shares[key]}% від БЖВ`;
  };

  return (
    <div className="pd-page">
      <section className="pd-hero" aria-labelledby="pd-product-title">
        <div className="pd-hero__glow" aria-hidden="true" />
        <div className="pd-hero__inner">
          <button type="button" className="pd-hero__back" onClick={goBackToProducts}>
            ← До каталогу продуктів
          </button>

          <div className="pd-hero__head">
            <div className="pd-hero__head-main">
              <div className="pd-hero__tags">
                {categoryLabel ? (
                  <span className="pd-hero__tag pd-hero__tag--accent">{categoryLabel}</span>
                ) : (
                  <span className="pd-hero__tag">Категорія не вказана</span>
                )}
              </div>
              <h1 id="pd-product-title" className="pd-hero__title">
                {product.title}
              </h1>
              <p className="pd-hero__lead">{leadText}</p>

              <div className="pd-hero__meta">
                <div
                  className="pd-hero__nutrition pd-hero__nutrition--compact"
                  aria-label="Калорійність на 100 грам"
                >
                  <div className="pd-hero__kcal-block">
                    <span className="pd-hero__kcal-icon" aria-hidden="true">
                      <IconFlame />
                    </span>
                    <div className="pd-hero__kcal-text">
                      <span className="pd-hero__kcal-value">{kcalStr}</span>
                      <span className="pd-hero__kcal-unit">
                        ккал <span className="pd-hero__kcal-per">/ 100 г</span>
                      </span>
                    </div>
                  </div>
                </div>

                {isAuthed && (
                  <button
                    type="button"
                    className={`pd-hero__fav-btn${isFavorite ? ' pd-hero__fav-btn--active' : ''}`}
                    onClick={handleToggleFavorite}
                    aria-pressed={isFavorite}
                    aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
                  >
                    <IconHeart filled={isFavorite} className="pd-hero__fav-heart" />
                    <span>{isFavorite ? 'В обраному' : 'Додати в обране'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pd-content">
        <div className="pd-main-grid">
          <section className="pd-card pd-macros-card" aria-labelledby="pd-macros-title">
            <div className="pd-card__header">
              <span className="pd-card__icon" aria-hidden="true">
                📊
              </span>
              <h2 id="pd-macros-title" className="pd-card__title">
                Макронутрієнти
              </h2>
              <span className="pd-macros-card__per">на 100 г</span>
            </div>
            <div className="pd-card__body">
              <ul className="pd-macro-rows">
                <li className="pd-macro-row pd-macro-row--protein">
                  <div className="pd-macro-row__top">
                    <span className="pd-macro-row__label">Білки</span>
                    <span className="pd-macro-row__value">
                      {proteinStr === '—' ? '—' : `${proteinStr} г`}
                    </span>
                  </div>
                  <div
                    className="pd-macro-row__track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={shares.hasData ? shares.protein : 0}
                    aria-label="Частка білків у сумі макронутрієнтів"
                  >
                    <span
                      className="pd-macro-row__fill"
                      style={{ width: shares.hasData ? `${shares.protein}%` : '0%' }}
                    />
                  </div>
                  <span className="pd-macro-row__pct">{pctLabel('protein')}</span>
                </li>
                <li className="pd-macro-row pd-macro-row--fat">
                  <div className="pd-macro-row__top">
                    <span className="pd-macro-row__label">Жири</span>
                    <span className="pd-macro-row__value">
                      {fatStr === '—' ? '—' : `${fatStr} г`}
                    </span>
                  </div>
                  <div
                    className="pd-macro-row__track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={shares.hasData ? shares.fat : 0}
                    aria-label="Частка жирів у сумі макронутрієнтів"
                  >
                    <span
                      className="pd-macro-row__fill"
                      style={{ width: shares.hasData ? `${shares.fat}%` : '0%' }}
                    />
                  </div>
                  <span className="pd-macro-row__pct">{pctLabel('fat')}</span>
                </li>
                <li className="pd-macro-row pd-macro-row--carbs">
                  <div className="pd-macro-row__top">
                    <span className="pd-macro-row__label">Вуглеводи</span>
                    <span className="pd-macro-row__value">
                      {carbsStr === '—' ? '—' : `${carbsStr} г`}
                    </span>
                  </div>
                  <div
                    className="pd-macro-row__track"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={shares.hasData ? shares.carbs : 0}
                    aria-label="Частка вуглеводів у сумі макронутрієнтів"
                  >
                    <span
                      className="pd-macro-row__fill"
                      style={{ width: shares.hasData ? `${shares.carbs}%` : '0%' }}
                    />
                  </div>
                  <span className="pd-macro-row__pct">{pctLabel('carbs')}</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="pd-right-stack">
            <section className="pd-card pd-quick-card" aria-labelledby="pd-quick-title">
              <div className="pd-card__header">
                <span className="pd-card__icon" aria-hidden="true">
                  ⚡
                </span>
                <h2 id="pd-quick-title" className="pd-card__title">
                  Швидка інформація
                </h2>
              </div>
              <div className="pd-card__body">
                <div className="pd-quick-grid">
                  <div className="pd-quick-tile pd-quick-tile--kcal">
                    <span className="pd-quick-tile__value">{kcalStr}</span>
                    <span className="pd-quick-tile__label">ккал</span>
                  </div>
                  <div className="pd-quick-tile pd-quick-tile--p">
                    <span className="pd-quick-tile__value">
                      {proteinStr === '—' ? '—' : `${proteinStr} г`}
                    </span>
                    <span className="pd-quick-tile__label">білка</span>
                  </div>
                  <div className="pd-quick-tile pd-quick-tile--f">
                    <span className="pd-quick-tile__value">
                      {fatStr === '—' ? '—' : `${fatStr} г`}
                    </span>
                    <span className="pd-quick-tile__label">жирів</span>
                  </div>
                  <div className="pd-quick-tile pd-quick-tile--c">
                    <span className="pd-quick-tile__value">
                      {carbsStr === '—' ? '—' : `${carbsStr} г`}
                    </span>
                    <span className="pd-quick-tile__label">вуглеводів</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="pd-bottom-row">
          <section className="pd-card pd-note-card" aria-labelledby="pd-note-title">
            <div className="pd-note-card__inner">
              <h2 id="pd-note-title" className="pd-note-card__title">
                Калорійність на порцію
              </h2>
              <p className="pd-note-card__text">
                Дані наведені на <strong>100 г</strong> продукту. Фактична калорійність може
                відрізнятися залежно від виробника та способу приготування.
              </p>
            </div>
          </section>

          <section
            className={`pd-fav-strip${!isAuthed ? ' pd-fav-strip--guest' : ''}`}
            aria-labelledby="pd-fav-title"
          >
            <div className="pd-fav-strip__icon" aria-hidden="true">
              <IconHeart filled={isAuthed} />
            </div>
            <div className="pd-fav-strip__body">
              <h2 id="pd-fav-title" className="pd-fav-strip__title">
                Обране
              </h2>
              <p className="pd-fav-strip__text">
                {isAuthed
                  ? 'Збережені продукти та вправи — в одному розділі.'
                  : 'Увійдіть, щоб додавати продукти в обране одним кліком.'}
                {!isAuthed && (
                  <>
                    {' '}
                    <Link to="/login" className="pd-inline-link">
                      Увійти
                    </Link>
                  </>
                )}
              </p>
            </div>
            <Link to="/favorites?tab=products" className="pd-fav-strip__link">
              {isAuthed ? 'Моє обране' : 'До розділу'}
              <span className="pd-fav-strip__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
