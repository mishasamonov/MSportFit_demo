import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const metaStyle = {
  color: '#666',
  fontSize: '0.9em',
};

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadExercises() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/exercises');
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
  }, []);

  if (loading) {
    return <p>Завантаження вправ...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>;
  }

  if (!exercises.length) {
    return (
      <div>
        <h1>Вправи</h1>
        <p>Поки що немає жодної вправи.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Вправи</h1>
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
    </div>
  );
}

export default Exercises;
