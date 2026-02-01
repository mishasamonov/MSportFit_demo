import { Link } from 'react-router-dom'

function Exercises() {
  return (
    <div>
      <h1>Вправи</h1>
      <p>Placeholder — список вправ.</p>
      <p>
        <Link to="/exercises/abc">Відкрити вправу abc</Link>
      </p>
    </div>
  )
}

export default Exercises
