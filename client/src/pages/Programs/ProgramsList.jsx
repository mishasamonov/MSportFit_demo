import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'

function ProgramsList() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadPrograms() {
      try {
        setLoading(true)
        setError(null)

        const res = await apiFetch('/api/programs')

        if (!res.ok) {
          throw new Error('Не вдалося завантажити програми')
        }

        const data = await res.json()

        if (!isMounted) return

        setPrograms(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('ProgramsList fetch error', err)
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити програми')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPrograms()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <p>Завантаження програм...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  return (
    <div>
      <h1>Програми тренувань</h1>

      {programs.length === 0 ? (
        <p>Програми не знайдено.</p>
      ) : (
        <ul>
          {programs.map((program) => (
            <li key={program.id}>
              <h2>{program.title}</h2>
              <p>{program.description}</p>
              <p>
                Мета: {program.goal} | Рівень: {program.level} | Тривалість:{' '}
                {program.weeks} тижн.
              </p>
              <Link to={`/programs/${program.slug}`}>Детальніше</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProgramsList
