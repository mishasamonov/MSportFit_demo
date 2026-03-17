const express = require('express');
const authMiddleware = require('../middleware/auth');

/**
 * Маршрути для обраного (продукти + вправи).
 * Усі маршрути захищені JWT (authMiddleware).
 *
 * @param {object} prisma - Екземпляр Prisma Client для роботи з базою даних.
 * @returns {object} Express Router
 */
function createFavoritesRouter(prisma) {
  const router = express.Router();

  // Усі нижчі маршрути потребують авторизації
  router.use(authMiddleware);

  // ---------- Products favorites ----------

  // GET /api/favorites/products
  router.get('/products', async (req, res) => {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user.id },
        include: {
          product: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const products = favorites.map((f) => f.product).filter(Boolean);

      return res.json(products);
    } catch (err) {
      console.error('GET /api/favorites/products error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати обрані продукти',
      });
    }
  });

  // POST /api/favorites/products/:productId
  router.post('/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Продукт не знайдено',
        });
      }

      await prisma.favorite.upsert({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId,
          },
        },
        update: {},
        create: {
          userId: req.user.id,
          productId,
        },
      });

      return res.json({ ok: true });
    } catch (err) {
      console.error('POST /api/favorites/products/:productId error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося додати продукт до обраного',
      });
    }
  });

  // DELETE /api/favorites/products/:productId
  router.delete('/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
      await prisma.favorite.deleteMany({
        where: {
          userId: req.user.id,
          productId,
        },
      });

      return res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/favorites/products/:productId error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося видалити продукт з обраного',
      });
    }
  });

  // ---------- Exercises favorites ----------

  // GET /api/favorites/exercises
  router.get('/exercises', async (req, res) => {
    try {
      const favorites = await prisma.exerciseFavorite.findMany({
        where: { userId: req.user.id },
        include: {
          exercise: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      const exercises = favorites.map((f) => f.exercise).filter(Boolean);

      return res.json(exercises);
    } catch (err) {
      console.error('GET /api/favorites/exercises error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати обрані вправи',
      });
    }
  });

  // POST /api/favorites/exercises/:exerciseId
  router.post('/exercises/:exerciseId', async (req, res) => {
    const { exerciseId } = req.params;

    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseId },
      });

      if (!exercise) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Вправу не знайдено',
        });
      }

      await prisma.exerciseFavorite.upsert({
        where: {
          userId_exerciseId: {
            userId: req.user.id,
            exerciseId,
          },
        },
        update: {},
        create: {
          userId: req.user.id,
          exerciseId,
        },
      });

      return res.json({ ok: true });
    } catch (err) {
      console.error('POST /api/favorites/exercises/:exerciseId error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося додати вправу до обраного',
      });
    }
  });

  // DELETE /api/favorites/exercises/:exerciseId
  router.delete('/exercises/:exerciseId', async (req, res) => {
    const { exerciseId } = req.params;

    try {
      await prisma.exerciseFavorite.deleteMany({
        where: {
          userId: req.user.id,
          exerciseId,
        },
      });

      return res.json({ ok: true });
    } catch (err) {
      console.error('DELETE /api/favorites/exercises/:exerciseId error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося видалити вправу з обраного',
      });
    }
  });

  return router;
}

module.exports = createFavoritesRouter;
