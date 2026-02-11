import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { apiFetch } from '../lib/api'

function ProductDetails() {
  const { id } = useParams()
  const { isAuthed } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadProduct() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Продукт не знайдено')
          }
          throw new Error(`Помилка завантаження: ${res.status}`)
        }

        const data = await res.json()
        if (isMounted) {
          setProduct(data)
        }
      } catch (err) {
        console.error('Product details fetch error', err)
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити продукт')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProduct()

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
        const res = await apiFetch('/api/favorites/products')
        if (!res.ok) {
          return
        }
        const data = await res.json()
        if (!Array.isArray(data)) return

        if (isMounted) {
          setIsFavorite(data.some((p) => p.id === id))
        }
      } catch (err) {
        console.error('Product favorite state error', err)
      }
    }

    loadFavoriteState()

    return () => {
      isMounted = false
    }
  }, [id, isAuthed])

  const handleToggleFavorite = async () => {
    if (!product || !isAuthed || favoriteLoading) return

    setFavoriteLoading(true)
    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await apiFetch(`/api/favorites/products/${id}`, { method })
      if (!res.ok) {
        throw new Error('Не вдалося оновити обране')
      }
      setIsFavorite(!isFavorite)
    } catch (err) {
      console.error('Toggle favorite product error', err)
      alert(err.message || 'Помилка оновлення обраного')
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) {
    return <p>Завантаження продукту...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  if (!product) {
    return <p>Продукт не знайдено.</p>
  }

  const hasValue = (v) => v !== null && v !== undefined && v !== ''
  const formatMacro = (v) => {
    if (!hasValue(v)) return null
    const n = Number(v)
    return Number.isFinite(n) ? n.toFixed(1) : String(v)
  }

  return (
    <div>
      <h1>Картка продукту</h1>
      <p>
        <strong>Назва:</strong> {product.title}
      </p>
      {product.category && (
        <p>
          <strong>Категорія:</strong> {product.category}
        </p>
      )}
      {hasValue(product.calories) && (
        <p>
          <strong>Калорії:</strong> {formatMacro(product.calories)}
        </p>
      )}
      {hasValue(product.protein) && (
        <p>
          <strong>Білки:</strong> {formatMacro(product.protein)}
        </p>
      )}
      {hasValue(product.fat) && (
        <p>
          <strong>Жири:</strong> {formatMacro(product.fat)}
        </p>
      )}
      {hasValue(product.carbs) && (
        <p>
          <strong>Вуглеводи:</strong> {formatMacro(product.carbs)}
        </p>
      )}

      {!isAuthed ? (
        <p>Увійдіть, щоб додавати продукт в обране.</p>
      ) : (
        <button type="button" onClick={handleToggleFavorite} disabled={favoriteLoading}>
          {isFavorite ? 'Видалити з обраного' : 'Додати в обране'}
        </button>
      )}
    </div>
  )
}

export default ProductDetails
