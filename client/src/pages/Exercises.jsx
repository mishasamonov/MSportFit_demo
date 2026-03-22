import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const MUSCLE_GROUPS = ['Груди', 'Спина', 'Ноги', 'Плечі', 'Біцепс', 'Трицепс', 'Сідниці', 'Кор'];
const LEVELS = ['Початковий', 'Середній'];
const EQUIPMENT = ['Без обладнання', 'Гантелі', 'Штанга', 'Тренажер', 'Турнік'];

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

function Exercises() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentSearch = searchParams.get('search') || '';
  const currentMuscleGroup = searchParams.get('muscleGroup') || '';
  const currentLevel = searchParams.get('level') || '';
  const currentEquipment = searchParams.get('equipment') || '';

  const hasActiveFilters = FILTER_KEYS.some((k) => searchParams.get(k));

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
    updateFilter('search', formData.get('search')?.trim() || '');
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div className="catalog-page">
      <h1 className="catalog-page__title">Вправи</h1>

      <div className="catalog-filters">
        <form onSubmit={handleSearchSubmit} className="catalog-filters__search-form">
          <div className="catalog-filters__group">
            <label htmlFor="filter-search" className="catalog-filters__label">
              Пошук
            </label>
            <input
              id="filter-search"
              name="search"
              type="text"
              placeholder="Назва або опис…"
              defaultValue={currentSearch}
              key={currentSearch}
              className="catalog-filters__input"
            />
          </div>
          <button type="submit" className="catalog-filters__btn">
            Знайти
          </button>
        </form>

        <div className="catalog-filters__group">
          <label htmlFor="filter-muscleGroup" className="catalog-filters__label">
            {"М'язова група"}
          </label>
          <select
            id="filter-muscleGroup"
            value={currentMuscleGroup}
            onChange={(e) => updateFilter('muscleGroup', e.target.value)}
            className="catalog-filters__select"
          >
            <option value="">Усі</option>
            {MUSCLE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog-filters__group">
          <label htmlFor="filter-level" className="catalog-filters__label">
            Рівень
          </label>
          <select
            id="filter-level"
            value={currentLevel}
            onChange={(e) => updateFilter('level', e.target.value)}
            className="catalog-filters__select"
          >
            <option value="">Усі</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="catalog-filters__group">
          <label htmlFor="filter-equipment" className="catalog-filters__label">
            Обладнання
          </label>
          <select
            id="filter-equipment"
            value={currentEquipment}
            onChange={(e) => updateFilter('equipment', e.target.value)}
            className="catalog-filters__select"
          >
            <option value="">Усі</option>
            {EQUIPMENT.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="catalog-filters__btn catalog-filters__btn--reset"
          >
            Скинути фільтри
          </button>
        )}
      </div>

      {loading && <p className="catalog-message">Завантаження вправ...</p>}

      {!loading && error && (
        <p className="catalog-message catalog-message--error">Помилка: {error}</p>
      )}

      {!loading && !error && !exercises.length && (
        <p className="catalog-message">
          {hasActiveFilters
            ? 'Нічого не знайдено за обраними фільтрами.'
            : 'Поки що немає жодної вправи.'}
        </p>
      )}

      {!loading && !error && exercises.length > 0 && (
        <ul className="catalog-list">
          {exercises.map((exercise) => (
            <li key={exercise.id} className="catalog-list__item">
              <Link
                to={`/exercises/${exercise.slug || exercise.id}`}
                className="catalog-list__link"
              >
                {exercise.title}
              </Link>
              {exercise.category && (
                <span className="catalog-list__meta">
                  <span className="catalog-list__separator"> — </span>
                  {exercise.category}
                </span>
              )}
              {(exercise.muscleGroup || exercise.level) && (
                <span className="catalog-list__meta">
                  {exercise.muscleGroup ? ` · ${exercise.muscleGroup}` : ''}
                  {exercise.level ? ` · ${exercise.level}` : ''}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Exercises;
