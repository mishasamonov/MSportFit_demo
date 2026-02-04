import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ExerciseDetails() {
  const { id } = useParams()
  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    </div>
  )
}

export default ExerciseDetails
