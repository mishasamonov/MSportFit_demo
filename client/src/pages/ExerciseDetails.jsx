import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../lib/api'

function ExerciseDetails() {
  const { id } = useParams()
  const { isAuthed } = useAuth()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadExercise() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/exercises/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Вправу не знайдено')
          }
          throw new Error(`Помилка завантаження: ${res.status}`)
        }

        const data = await res.json()
        if (isMounted) {
          setExercise(data)
        }
      } catch (err) {
        console.error('Exercise details fetch error', err)
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити вправу')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadExercise()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    let isMounted = true

    async function loadFavoriteState() {
      if (!isAuthed) {
        setIsFavorite(false)
        return
      }

      try {
        const res = await apiFetch('/api/favorites/exercises')
        if (!res.ok) {
          return
        }
        const data = await res.json()
        if (!Array.isArray(data)) return

        if (isMounted) {
          setIsFavorite(data.some((e) => e.id === id))
        }
      } catch (err) {
        console.error('Exercise favorite state error', err)
      }
    }

    loadFavoriteState()

    return () => {
      isMounted = false
    }
  }, [id, isAuthed])

  const handleToggleFavorite = async () => {
    if (!exercise || !isAuthed || favoriteLoading) return

    setFavoriteLoading(true)
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await apiFetch(`/api/favorites/exercises/${id}`, { method })
      if (!res.ok) {
        throw new Error('Не вдалося оновити обране')
      }
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error('Toggle favorite exercise error', err)
      alert(err.message || 'Помилка оновлення обраного')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return <p>Завантаження вправи...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  if (!exercise) {
    return <p>Вправу не знайдено.</p>
  }

  return (
    <div>
      <h1>Деталі вправи</h1>
      <p>
        <strong>Назва:</strong> {exercise.title}
      </p>
      {exercise.category && (
        <p>
          <strong>Категорія:</strong> {exercise.category}
        </p>
      )}
      {typeof exercise.calories === 'number' && (
        <p>
          <strong>Орієнтовні калорії:</strong> {exercise.calories}
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
      {exercise.videoUrl && (
        <p>
          <strong>Відео:</strong>{' '}
          <a href={exercise.videoUrl} target="_blank" rel="noreferrer">
            Відкрити відео
          </a>
        </p>
      )}

      {!isAuthed ? (
        <p>Увійдіть, щоб додавати вправу в обране.</p>
      ) : (
        <button type="button" onClick={handleToggleFavorite} disabled={favoriteLoading}>
          {isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        </button>
      )}
    </div>
  )
}

export default ExerciseDetails
