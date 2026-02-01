import { useParams } from 'react-router-dom'

function ProductDetails() {
  const { id } = useParams()
  return (
    <div>
      <h1>Картка продукту</h1>
      <p>ID: {id}</p>
    </div>
  )
}

export default ProductDetails
