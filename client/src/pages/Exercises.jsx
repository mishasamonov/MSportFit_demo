import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';
import MsportFitSelect from '../components/MsportFitSelect';
import './Exercises.css';

const MUSCLE_GROUPS = [
  'Груди',
  'Спина',
  'Ноги',
  'Плечі',
  'Руки',
  'Біцепс',
  'Трицепс',
  'Сідниці',
  'Кор',
];
const LEVELS = ['Початковий', 'Середній'];
const EQUIPMENT = [
  'Без обладнання',
  'Гантелі',
  'Штанга',
  'Тренажер',
  'Турнік',
  'Бруси',
  'Резинова стрічка',
];

const MUSCLE_GROUP_SELECT_OPTIONS = [
  { value: '', label: 'Усі' },
  ...MUSCLE_GROUPS.map((g) => ({ value: g, label: g })),
];
const LEVEL_SELECT_OPTIONS = [
  { value: '', label: 'Усі' },
  ...LEVELS.map((l) => ({ value: l, label: l })),
];
const EQUIPMENT_SELECT_OPTIONS = [
  { value: '', label: 'Усі' },
  ...EQUIPMENT.map((eq) => ({ value: eq, label: eq })),
];

const FILTER_KEYS = ['search', 'muscleGroup', 'level', 'equipment'];

function buildFetchUrl(params) {
  const qs = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const val = params.get(key);
    if (val) qs.set(key, val);
  }
  const str = qs.toString();
  return str ? `/api/exercises?${str}` : '/api/exercises';
}

function truncate(text, max = 100) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

function buildExerciseFilterContext(search, muscleGroup, level, equipment) {
  const parts = [];
  const q = typeof search === 'string' ? search.trim() : '';
  if (q) {
    parts.push(q.length > 56 ? `Пошук: «${q.slice(0, 56)}…»` : `Пошук: «${q}»`);
  }
  if (muscleGroup) parts.push(`Група: ${muscleGroup}`);
  if (level) parts.push(`Рівень: ${level}`);
  if (equipment) parts.push(`Обладнання: ${equipment}`);
  return parts.join(' · ');
}

function Exercises() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthed } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const favInflightRef = useRef(new Set());

  const currentSearch = searchParams.get('search') || '';
  const currentMuscleGroup = searchParams.get('muscleGroup') || '';
  const currentLevel = searchParams.get('level') || '';
  const currentEquipment = searchParams.get('equipment') || '';

  const hasActiveFilters = FILTER_KEYS.some((k) => searchParams.get(k));
  const exerciseFilterContext = hasActiveFilters
    ? buildExerciseFilterContext(currentSearch, currentMuscleGroup, currentLevel, currentEquipment)
    : null;

  useEffect(() => {
    let isMounted = true;

    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(buildFetchUrl(searchParams));
        if (!res.ok) {
          throw new Error(`Помилка завантаження: ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setExercises(Array.isArray(data) ? data : data.items || []);
        }
      } catch (err) {
        console.error('Exercises fetch error', err);
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити вправи');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadExercises();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  useEffect(() => {
    if (!isAuthed) {
      setFavoriteIds(new Set());
      return;
    }

    let isMounted = true;

    async function loadFavorites() {
      try {
        const res = await apiFetch('/api/favorites/exercises');
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setFavoriteIds(new Set(data.map((e) => e.id)));
        }
      } catch (err) {
        console.error('Failed to load exercise favorites', err);
      }
    }

    loadFavorites();
    return () => {
      isMounted = false;
    };
  }, [isAuthed]);

  const handleToggleFavorite = async (exerciseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed || favInflightRef.current.has(exerciseId)) return;
    favInflightRef.current.add(exerciseId);

    const wasFavorite = favoriteIds.has(exerciseId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      wasFavorite ? next.delete(exerciseId) : next.add(exerciseId);
      return next;
    });

    try {
      const method = wasFavorite ? 'DELETE' : 'POST';
      const res = await apiFetch(`/api/favorites/exercises/${exerciseId}`, { method });
      if (!res.ok) throw new Error('Не вдалося оновити обране');
    } catch (err) {
      console.error('Toggle favorite error', err);
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        wasFavorite ? next.add(exerciseId) : next.delete(exerciseId);
        return next;
      });
    } finally {
      favInflightRef.current.delete(exerciseId);
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
    <div className="ex-page">
      <section className="ex-hero">
        <div className="ex-hero__inner">
          <h1 className="ex-hero__title">Вправи</h1>
          <p className="ex-hero__desc">
            Каталог вправ з детальною технікою виконання, рекомендаціями та альтернативами. Знайдіть
            вправу під ваші цілі та рівень підготовки.
          </p>
        </div>
        <div className="ex-hero__glow" />
      </section>

      <div className="ex-content">
        <div className="ex-filters">
          <form onSubmit={handleSearchSubmit} className="ex-filters__search-form">
            <div className="ex-filters__group">
              <label htmlFor="filter-search" className="ex-filters__label">
                Пошук
              </label>
              <input
                id="filter-search"
                name="search"
                type="text"
                placeholder="Назва або опис…"
                defaultValue={currentSearch}
                key={currentSearch}
                className="ex-filters__input"
              />
            </div>
            <button type="submit" className="ex-filters__btn">
              Знайти
            </button>
          </form>

          <div className="ex-filters__group ex-filters__group--muscle-select">
            <label htmlFor="filter-muscleGroup" className="ex-filters__label">
              {"М'язова група"}
            </label>
            <MsportFitSelect
              id="filter-muscleGroup"
              variant="filter"
              value={currentMuscleGroup}
              options={MUSCLE_GROUP_SELECT_OPTIONS}
              maxMenuHeight={420}
              onChange={(v) => updateFilter('muscleGroup', v)}
            />
          </div>

          <div className="ex-filters__group">
            <label htmlFor="filter-level" className="ex-filters__label">
              Рівень
            </label>
            <MsportFitSelect
              id="filter-level"
              variant="filter"
              value={currentLevel}
              options={LEVEL_SELECT_OPTIONS}
              onChange={(v) => updateFilter('level', v)}
            />
          </div>

          <div className="ex-filters__group">
            <label htmlFor="filter-equipment" className="ex-filters__label">
              Обладнання
            </label>
            <MsportFitSelect
              id="filter-equipment"
              variant="filter"
              value={currentEquipment}
              options={EQUIPMENT_SELECT_OPTIONS}
              onChange={(v) => updateFilter('equipment', v)}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="ex-filters__btn ex-filters__btn--reset"
            >
              Скинути фільтри
            </button>
          )}
        </div>

        {loading && (
          <div className="ex-message">
            <p className="ex-message__text">Завантаження вправ…</p>
          </div>
        )}

        {!loading && error && (
          <div className="ex-message">
            <p className="ex-message__text ex-message__text--error">Помилка: {error}</p>
          </div>
        )}

        {!loading && !error && exercises.length > 0 && (
          <>
            <p className="ex-results-info">
              Знайдено <span className="ex-results-info__count">{exercises.length}</span>{' '}
              {exercises.length === 1 ? 'вправу' : exercises.length < 5 ? 'вправи' : 'вправ'}
            </p>

            <div className="ex-grid">
              {exercises.map((exercise) => {
                const link = `/exercises/${exercise.slug || exercise.id}`;
                return (
                  <article key={exercise.id} className="ex-card">
                    {isAuthed && (
                      <button
                        type="button"
                        className={`ex-card__fav-btn${favoriteIds.has(exercise.id) ? ' ex-card__fav-btn--active' : ''}`}
                        onClick={(e) => handleToggleFavorite(exercise.id, e)}
                        aria-label={
                          favoriteIds.has(exercise.id) ? 'Прибрати з обраного' : 'Додати в обране'
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
          </>
        )}

        {!loading && !error && !exercises.length && (
          <div className="ex-empty ex-empty--catalog" role="status">
            <div className="ex-empty__row">
              <div className="ex-empty__icon" aria-hidden="true">
                🔍
              </div>
              <div className="ex-empty__body">
                <h3 className="ex-empty__title">
                  {hasActiveFilters ? 'Нічого не знайдено' : 'Поки що немає вправ'}
                </h3>
                {exerciseFilterContext ? (
                  <p className="ex-empty__context">{exerciseFilterContext}</p>
                ) : null}
                <p className="ex-empty__text">
                  {hasActiveFilters
                    ? 'Змініть умови пошуку або скиньте фільтри, щоб побачити весь каталог.'
                    : "Каталог вправ поки порожній. Вправи з'являться найближчим часом."}
                </p>
                {hasActiveFilters ? (
                  <div className="ex-empty__actions">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="ex-filters__btn ex-filters__btn--reset ex-empty__reset"
                    >
                      Скинути фільтри
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Exercises;
