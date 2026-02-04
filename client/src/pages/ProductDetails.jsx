import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return <p>Завантаження продукту...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  if (!product) {
    return <p>Продукт не знайдено.</p>
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
      {typeof product.calories === 'number' && (
        <p>
          <strong>Калорії:</strong> {product.calories}
        </p>
      )}
      {typeof product.protein === 'number' && (
        <p>
          <strong>Білки:</strong> {product.protein}
        </p>
      )}
      {typeof product.fat === 'number' && (
        <p>
          <strong>Жири:</strong> {product.fat}
        </p>
      )}
      {typeof product.carbs === 'number' && (
        <p>
          <strong>Вуглеводи:</strong> {product.carbs}
        </p>
      )}
    </div>
  )
}

export default ProductDetails
