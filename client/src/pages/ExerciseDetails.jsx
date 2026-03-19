import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../lib/api';

const sectionStyle = {
  marginTop: '24px',
};

const subSectionStyle = {
  marginTop: '12px',
};

const ALTERNATIVES_MAP = {
  home: 'Вдома',
  outdoor: 'На вулиці / турнік / бруси',
  band: 'З резиною',
};

function AlternativesSection({ alternatives }) {
  if (!alternatives || typeof alternatives !== 'object') return null;

  const entries = Object.entries(ALTERNATIVES_MAP).filter(
    ([key]) => Array.isArray(alternatives[key]) && alternatives[key].length > 0,
  );

  if (entries.length === 0) return null;

  return (
    <div style={sectionStyle}>
      <h3>Альтернативи</h3>
      {entries.map(([key, label]) => (
        <div key={key} style={subSectionStyle}>
          <strong>{label}</strong>
          <ul>
            {alternatives[key].map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ExerciseDetails() {
  const { id } = useParams();
  const { isAuthed } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadExercise() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/exercises/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Вправу не знайдено');
          }
          throw new Error(`Помилка завантаження: ${res.status}`);
        }

        const data = await res.json();
        if (isMounted) {
          setExercise(data);
        }
      } catch (err) {
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
      if (!isAuthed) {
        setIsFavorite(false);
        return;
      }

      try {
        const res = await apiFetch('/api/favorites/exercises');
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (!Array.isArray(data)) return;

        if (isMounted) {
          setIsFavorite(data.some((e) => e.id === id));
        }
      } catch (err) {
        console.error('Exercise favorite state error', err);
      }
    }

    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [id, isAuthed]);

  const handleToggleFavorite = async () => {
    if (!exercise || !isAuthed || favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await apiFetch(`/api/favorites/exercises/${id}`, { method });
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
    return <p>Завантаження вправи...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>;
  }

  if (!exercise) {
    return <p>Вправу не знайдено.</p>;
  }

  return (
    <div>
      {/* A. Header / meta */}
      <h1>{exercise.title}</h1>
      {exercise.category && (
        <p>
          <strong>Категорія:</strong> {exercise.category}
        </p>
      )}
      {exercise.muscleGroup && (
        <p>
          <strong>Мʼязові групи:</strong> {exercise.muscleGroup}
        </p>
      )}
      {exercise.level && (
        <p>
          <strong>Рівень:</strong> {exercise.level}
        </p>
      )}
      {typeof exercise.calories === 'number' && (
        <p>
          <strong>Орієнтовні калорії:</strong> {exercise.calories}
        </p>
      )}

      {/* Favorite toggle */}
      {!isAuthed ? (
        <p>Увійдіть, щоб додавати вправу в обране.</p>
      ) : (
        <button type="button" onClick={handleToggleFavorite} disabled={favoriteLoading}>
          {isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        </button>
      )}

      {/* B. Description */}
      {exercise.description && (
        <div style={sectionStyle}>
          <h3>Опис</h3>
          <p>{exercise.description}</p>
        </div>
      )}

      {/* C. Video */}
      {exercise.videoUrl && (
        <div style={sectionStyle}>
          <h3>Відео</h3>
          <a href={exercise.videoUrl} target="_blank" rel="noreferrer">
            Відкрити відео
          </a>
        </div>
      )}

      {/* D. Steps */}
      {Array.isArray(exercise.steps) && exercise.steps.length > 0 && (
        <div style={sectionStyle}>
          <h3>Покрокове виконання</h3>
          <ol>
            {exercise.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* E. Tips */}
      {Array.isArray(exercise.tips) && exercise.tips.length > 0 && (
        <div style={sectionStyle}>
          <h3>Важливі поради</h3>
          <ul>
            {exercise.tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* F. Mistakes */}
      {Array.isArray(exercise.mistakes) && exercise.mistakes.length > 0 && (
        <div style={sectionStyle}>
          <h3>Поширені помилки</h3>
          <ul>
            {exercise.mistakes.map((mistake, idx) => (
              <li key={idx}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}

      {/* G. Alternatives */}
      <AlternativesSection alternatives={exercise.alternatives} />
    </div>
  );
}

export default ExerciseDetails;
