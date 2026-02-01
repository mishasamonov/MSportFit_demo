import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Exercises from './pages/Exercises'
import ExerciseDetails from './pages/ExerciseDetails'
import Faq from './pages/Faq'
import Programs from './pages/Programs'
import Login from './pages/Login'
import Register from './pages/Register'
import Favorites from './pages/Favorites'
import NotFound from './pages/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="exercises/:id" element={<ExerciseDetails />} />
        <Route path="faq" element={<Faq />} />
        <Route path="programs" element={<Programs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
