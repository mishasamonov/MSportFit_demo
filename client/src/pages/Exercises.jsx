import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const MUSCLE_GROUPS = ['Груди', 'Спина', 'Ноги', 'Плечі', 'Біцепс', 'Трицепс', 'Сідниці', 'Кор'];
const LEVELS = ['Початковий', 'Середній'];
const EQUIPMENT = ['Без обладнання', 'Гантелі', 'Штанга', 'Тренажер', 'Турнік'];

const FILTER_KEYS = ['search', 'muscleGroup', 'level', 'equipment'];

const metaStyle = {
  color: '#666',
  fontSize: '0.9em',
};

const filtersFormStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  alignItems: 'flex-end',
  marginBottom: '1.5rem',
  padding: '1rem',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fafafa',
};

const filterGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
};

const labelStyle = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#555',
};

const controlStyle = {
  padding: '0.4rem 0.5rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '0.9rem',
};

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
    <div>
      <h1>Вправи</h1>

      <div style={filtersFormStyle}>
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}
        >
          <div style={filterGroupStyle}>
            <label htmlFor="filter-search" style={labelStyle}>
              Пошук
            </label>
            <input
              id="filter-search"
              name="search"
              type="text"
              placeholder="Назва або опис…"
              defaultValue={currentSearch}
              key={currentSearch}
              style={{ ...controlStyle, minWidth: '180px' }}
            />
          </div>
          <button type="submit" style={{ ...controlStyle, cursor: 'pointer' }}>
            Знайти
          </button>
        </form>

        <div style={filterGroupStyle}>
          <label htmlFor="filter-muscleGroup" style={labelStyle}>
            {"М'язова група"}
          </label>
          <select
            id="filter-muscleGroup"
            value={currentMuscleGroup}
            onChange={(e) => updateFilter('muscleGroup', e.target.value)}
            style={controlStyle}
          >
            <option value="">Усі</option>
            {MUSCLE_GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div style={filterGroupStyle}>
          <label htmlFor="filter-level" style={labelStyle}>
            Рівень
          </label>
          <select
            id="filter-level"
            value={currentLevel}
            onChange={(e) => updateFilter('level', e.target.value)}
            style={controlStyle}
          >
            <option value="">Усі</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div style={filterGroupStyle}>
          <label htmlFor="filter-equipment" style={labelStyle}>
            Обладнання
          </label>
          <select
            id="filter-equipment"
            value={currentEquipment}
            onChange={(e) => updateFilter('equipment', e.target.value)}
            style={controlStyle}
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
            style={{ ...controlStyle, cursor: 'pointer', color: '#c00' }}
          >
            Скинути фільтри
          </button>
        )}
      </div>

      {loading && <p>Завантаження вправ...</p>}

      {!loading && error && <p style={{ color: 'red' }}>Помилка: {error}</p>}

      {!loading && !error && !exercises.length && (
        <p>
          {hasActiveFilters
            ? 'Нічого не знайдено за обраними фільтрами.'
            : 'Поки що немає жодної вправи.'}
        </p>
      )}

      {!loading && !error && exercises.length > 0 && (
        <ul>
          {exercises.map((exercise) => (
            <li key={exercise.id}>
              <Link to={`/exercises/${exercise.slug || exercise.id}`}>{exercise.title}</Link>
              {exercise.category && <span> — {exercise.category}</span>}
              {(exercise.muscleGroup || exercise.level) && (
                <span style={metaStyle}>
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
