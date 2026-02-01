import { useParams } from 'react-router-dom'

function ExerciseDetails() {
  const { id } = useParams()
  return (
    <div>
      <h1>Деталі вправи</h1>
      <p>ID: {id}</p>
    </div>
  )
}

export default ExerciseDetails
