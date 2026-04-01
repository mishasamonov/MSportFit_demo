import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBackOrNavigate } from '../hooks/useBackOrNavigate.js';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api';
import { getExerciseFallback, resolveExerciseSlug } from '../data/exerciseDetailsMap';
import { IconHeart } from '../components/HomeIcons';
import './ExerciseDetails.css';

const ALTERNATIVES_GROUPS = [
  { keys: ['gym'], label: 'У залі', icon: '🏋️' },
  { keys: ['home', 'outdoor', 'band'], label: 'Вдома / на вулиці / з резиною', icon: '🏠' },
];

function SectionCard({ title, icon, children }) {
  return (
    <div className="ed-card">
      <div className="ed-card__header">
        {icon && (
          <span className="ed-card__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <h3 className="ed-card__title">{title}</h3>
      </div>
      <div className="ed-card__body">{children}</div>
    </div>
  );
}

function Placeholder({ text }) {
  return <p className="ed-placeholder">{text}</p>;
}

function StepsSection({ steps }) {
  return (
    <SectionCard title="Техніка виконання" icon="📋">
      {Array.isArray(steps) && steps.length > 0 ? (
        <ol className="ed-steps">
          {steps.map((step, idx) => (
            <li key={idx} className="ed-steps__item">
              {step}
            </li>
          ))}
        </ol>
      ) : (
        <Placeholder text="Техніка буде додана" />
      )}
    </SectionCard>
  );
}

function TipsSection({ tips }) {
  return (
    <SectionCard title="Поради" icon="💡">
      {Array.isArray(tips) && tips.length > 0 ? (
        <ul className="ed-list">
          {tips.map((tip, idx) => (
            <li key={idx} className="ed-list__item">
              {tip}
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder text="Поради будуть додані" />
      )}
    </SectionCard>
  );
}

function MistakesSection({ mistakes }) {
  return (
    <SectionCard title="Типові помилки" icon="⚠️">
      {Array.isArray(mistakes) && mistakes.length > 0 ? (
        <ul className="ed-list">
          {mistakes.map((m, idx) => (
            <li key={idx} className="ed-list__item ed-list__item--warn">
              {m}
            </li>
          ))}
        </ul>
      ) : (
        <Placeholder text="Помилки будуть додані" />
      )}
    </SectionCard>
  );
}

function collectGroupItems(alternatives, keys) {
  const items = [];
  for (const key of keys) {
    const val = alternatives[key];
    if (Array.isArray(val)) {
      items.push(...val);
    } else if (typeof val === 'string' && val.trim()) {
      items.push(val);
    }
  }
  return items;
}

function AlternativeRow({ name }) {
  const slug = resolveExerciseSlug(name);

  if (slug) {
    return (
      <Link to={`/exercises/${slug}`} className="ed-alt-item ed-alt-item--link">
        <span className="ed-alt-item__name">{name}</span>
        <span className="ed-alt-item__meta">
          <span className="ed-alt-item__hint">Переглянути техніку</span>
          <span className="ed-alt-item__arrow" aria-hidden="true">
            →
          </span>
        </span>
      </Link>
    );
  }

  return (
    <div className="ed-alt-item">
      <span className="ed-alt-item__name">{name}</span>
    </div>
  );
}

function AlternativesSection({ alternatives }) {
  const groups = ALTERNATIVES_GROUPS.map((group) => ({
    ...group,
    items:
      alternatives && typeof alternatives === 'object'
        ? collectGroupItems(alternatives, group.keys)
        : [],
  })).filter((g) => g.items.length > 0);

  return (
    <SectionCard title="Альтернативи" icon="🔄">
      {groups.length > 0 ? (
        <div className="ed-alt-grid">
          {groups.map((group) => (
            <div key={group.label} className="ed-alt-group">
              <div className="ed-alt-group__label">
                <span className="ed-alt-group__icon" aria-hidden="true">
                  {group.icon}
                </span>
                {group.label}
              </div>
              <div className="ed-alt-group__items">
                {group.items.map((name, idx) => (
                  <AlternativeRow key={idx} name={name} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text="Альтернативи будуть додані" />
      )}
    </SectionCard>
  );
}

function EquipmentSection({ equipment }) {
  return (
    <SectionCard title="Інвентар" icon="🏋️">
      {equipment ? (
        <div className="ed-equipment">
          <span className="ed-equipment__badge">{equipment}</span>
        </div>
      ) : (
        <Placeholder text="Інформація буде додана" />
      )}
    </SectionCard>
  );
}

function ExerciseDetails() {
  const { id } = useParams();
  const goBackOrExercises = useBackOrNavigate('/exercises');
  const { isAuthed } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [source, setSource] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExercise() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/exercises/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setExercise(data);
            setSource('api');
          }
          return;
        }

        if (res.status === 404) {
          const fallback = getExerciseFallback(id);
          if (fallback && isMounted) {
            setExercise({ ...fallback, id: null });
            setSource('fallback');
            return;
          }
        }

        throw new Error(`Помилка завантаження: ${res.status}`);
      } catch (err) {
        const fallback = getExerciseFallback(id);
        if (fallback && isMounted) {
          setExercise({ ...fallback, id: null });
          setSource('fallback');
          return;
        }
        console.error('Exercise details fetch error', err);
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити вправу');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadExercise();

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteState() {
      if (!isAuthed || !exercise || source !== 'api') {
        setIsFavorite(false);
        return;
      }

      try {
        const res = await apiFetch('/api/favorites/exercises');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        if (isMounted) {
          setIsFavorite(data.some((e) => e.id === exercise.id));
        }
      } catch (err) {
        console.error('Exercise favorite state error', err);
      }
    }

    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [exercise, isAuthed, source]);

  const handleToggleFavorite = async () => {
    if (!exercise || !isAuthed || favoriteLoading || source !== 'api') return;

    setFavoriteLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await apiFetch(`/api/favorites/exercises/${exercise.id}`, { method });
      if (!res.ok) {
        throw new Error('Не вдалося оновити обране');
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Toggle favorite exercise error', err);
      alert(err.message || 'Помилка оновлення обраного');
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ed-page">
        <div className="ed-loading">
          <p className="ed-loading__text">Завантаження вправи...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ed-page">
        <div className="ed-error">
          <p className="ed-error__text">Помилка: {error}</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="ed-page">
        <div className="ed-not-found">
          <h1 className="ed-not-found__title">Вправу не знайдено</h1>
          <p className="ed-not-found__text">Такої вправи не існує або вона була видалена.</p>
          <Link to="/exercises" className="ed-not-found__link">
            &larr; Повернутись до вправ
          </Link>
        </div>
      </div>
    );
  }

  const tags = [
    exercise.category,
    exercise.level,
    typeof exercise.calories === 'number' ? `~${exercise.calories} ккал` : null,
  ].filter(Boolean);

  return (
    <div className="ed-page">
      <section className="ed-hero">
        <div className="ed-hero__inner">
          <button type="button" className="ed-hero__back" onClick={goBackOrExercises}>
            &larr; Назад
          </button>

          {tags.length > 0 && (
            <div className="ed-hero__tags">
              {tags.map((tag, idx) => (
                <span
                  key={tag}
                  className={`ed-hero__tag${idx === 0 ? ' ed-hero__tag--accent' : ''}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="ed-hero__title">{exercise.title}</h1>

          {exercise.description ? (
            <p className="ed-hero__description">{exercise.description}</p>
          ) : (
            <p className="ed-hero__description ed-placeholder">Опис буде додано</p>
          )}

          {exercise.muscleGroup && (
            <div className="ed-hero__muscles">
              <span className="ed-hero__muscle-group">
                <strong>Основні м&rsquo;язи:</strong> {exercise.muscleGroup}
              </span>
            </div>
          )}

          <div className="ed-hero__actions">
            {exercise.videoUrl && (
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="ed-hero__video-btn"
              >
                ▶ Дивитись відео
              </a>
            )}

            {isAuthed && source === 'api' && (
              <button
                type="button"
                className={`ed-hero__fav-btn${isFavorite ? ' ed-hero__fav-btn--active' : ''}`}
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
              >
                {favoriteLoading ? (
                  'Оновлення…'
                ) : (
                  <>
                    <IconHeart filled={isFavorite} className="ed-hero__fav-heart" />
                    <span>{isFavorite ? 'В обраному' : 'Додати в обране'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
        <div className="ed-hero__glow" aria-hidden="true" />
      </section>

      <div className="ed-content">
        <div className="ed-grid">
          <StepsSection steps={exercise.steps} />
          <TipsSection tips={exercise.tips} />
          <MistakesSection mistakes={exercise.mistakes} />
          <AlternativesSection alternatives={exercise.alternatives} />
          <EquipmentSection equipment={exercise.equipment} />
        </div>
      </div>
    </div>
  );
}

export default ExerciseDetails;
