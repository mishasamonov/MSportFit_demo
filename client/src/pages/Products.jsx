import { Link } from 'react-router-dom'

function Products() {
  return (
    <div>
      <h1>Каталог продуктів</h1>
      <p>Placeholder — список продуктів харчування.</p>
      <p>
        <Link to="/products/123">Відкрити продукт 123</Link>
      </p>
    </div>
  )
}

export default Products
