import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../../lib/api'

const DAY_OPTIONS = ['2', '3', '4']

function ExerciseList({ exercises }) {
  if (!Array.isArray(exercises) || exercises.length === 0) return null

  return (
    <ul>
      {exercises.map((ex, idx) => (
        <li key={idx}>
          <strong>{ex.name}</strong> — {ex.sets}×{ex.reps}
          {ex.restSec ? `, відпочинок ${ex.restSec}с` : ''}
          {ex.notes ? ` (${ex.notes})` : ''}
        </li>
      ))}
    </ul>
  )
}

function DayBlock({ day }) {
  return (
    <div>
      <h3>
        День {day.day}: {day.title}
      </h3>
      <ExerciseList exercises={day.exercises} />
    </div>
  )
}

function VariantDays({ variant, daysPerWeek }) {
  const [week, setWeek] = useState('A')

  if (daysPerWeek === '3') {
    const days = week === 'A' ? variant.weekA : variant.weekB

    return (
      <div>
        {variant.note && (
          <p>
            <em>{variant.note}</em>
          </p>
        )}
        <div>
          <button type="button" disabled={week === 'A'} onClick={() => setWeek('A')}>
            Тиждень A
          </button>
          <button type="button" disabled={week === 'B'} onClick={() => setWeek('B')}>
            Тиждень B
          </button>
        </div>
        {days.map((day) => (
          <DayBlock key={day.day} day={day} />
        ))}
      </div>
    )
  }

  return (
    <div>
      {variant.map((day) => (
        <DayBlock key={day.day} day={day} />
      ))}
    </div>
  )
}

function ProgramDetails() {
  const { id } = useParams()
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [daysPerWeek, setDaysPerWeek] = useState('3')

  useEffect(() => {
    let isMounted = true

    async function loadProgram() {
      try {
        setLoading(true)
        setError(null)

        const res = await apiFetch(`/api/programs/${encodeURIComponent(id)}`)

        if (!res.ok) {
          throw new Error('Не вдалося завантажити програму')
        }

        const data = await res.json()

        if (!isMounted) return

        setProgram(data)
      } catch (err) {
        console.error('ProgramDetails fetch error', err)
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити програму')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProgram()

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return <p>Завантаження програми...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  if (!program) return null

  const currentVariant = program.days?.variants?.[daysPerWeek]

  return (
    <div>
      <h1>{program.title}</h1>
      <p>{program.description}</p>
      <p>
        Мета: {program.goal} | Рівень: {program.level} | Тривалість: {program.weeks} тижн.
      </p>

      <div>
        <strong>Тренувань на тиждень:</strong>{' '}
        {DAY_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={daysPerWeek === opt}
            onClick={() => setDaysPerWeek(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {currentVariant ? (
        <VariantDays key={daysPerWeek} variant={currentVariant} daysPerWeek={daysPerWeek} />
      ) : (
        <p>Варіант не знайдено.</p>
      )}
    </div>
  )
}

export default ProgramDetails
