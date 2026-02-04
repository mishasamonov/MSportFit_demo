import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/products')
        if (!res.ok) {
          throw new Error(`Помилка завантаження: ${res.status}`)
        }

        const data = await res.json()
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : data.items || [])
        }
      } catch (err) {
        console.error('Products fetch error', err)
        if (isMounted) {
          setError(err.message || 'Не вдалося завантажити продукти')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <p>Завантаження продуктів...</p>
  }

  if (error) {
    return <p style={{ color: 'red' }}>Помилка: {error}</p>
  }

  if (!products.length) {
    return (
      <div>
        <h1>Каталог продуктів</h1>
        <p>Поки що немає жодного продукту.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Каталог продуктів</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
            {product.category && <span> — {product.category}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Products
