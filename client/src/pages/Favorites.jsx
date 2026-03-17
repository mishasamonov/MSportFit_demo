import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../lib/api';

function Favorites() {
  const [products, setProducts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
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

        if (!isMounted) return;

        setProducts(Array.isArray(productsData) ? productsData : []);
        setExercises(Array.isArray(exercisesData) ? exercisesData : []);
      } catch (err) {
        console.error('Favorites fetch error', err);
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити обране');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <p>Завантаження обраного...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>;
  }

  return (
    <div>
      <h1>Обране</h1>

      <section>
        <h2>Улюблені продукти</h2>
        {products.length === 0 ? (
          <p>Немає обраних продуктів.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <Link to={`/products/${product.id}`}>{product.title}</Link>
                {product.category && <span> — {product.category}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Улюблені вправи</h2>
        {exercises.length === 0 ? (
          <p>Немає обраних вправ.</p>
        ) : (
          <ul>
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <Link to={`/exercises/${exercise.id}`}>{exercise.title}</Link>
                {exercise.category && <span> — {exercise.category}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Favorites;
