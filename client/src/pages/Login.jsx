import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Помилка авторизації')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Вхід</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Вхід...' : 'Увійти'}
        </button>
      </form>
    </div>
  )
}

export default Login
