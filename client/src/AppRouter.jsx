import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Exercises from './pages/Exercises';
import ExerciseDetails from './pages/ExerciseDetails';
import Faq from './pages/Faq';
import Programs from './pages/Programs';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import Calculators from './pages/Calculators';
import NotFound from './pages/NotFound';
import ReportIssue from './pages/ReportIssue';
import { useAuth } from './context/AuthContext.jsx';

function RequireAuth({ children }) {
  const { isAuthed, loading } = useAuth();

  if (loading) {
    return <p>Перевірка авторизації...</p>;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

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
        <Route path="calculators" element={<Calculators />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="favorites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route path="report" element={<ReportIssue />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
