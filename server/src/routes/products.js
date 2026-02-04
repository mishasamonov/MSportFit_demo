const express = require('express');

/**
 * Маршрути для продуктів.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
function createProductsRouter(prisma) {
  const router = express.Router();

  // GET /api/products -> список продуктів (масив, як у Stage B)
  router.get('/', async (req, res) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(products);
    } catch (err) {
      console.error('GET /api/products error:', err);
      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати список продуктів',
      });
    }
  });

  // GET /api/products/:id -> продукт за id
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Продукт не знайдено',
        });
      }

      res.json(product);
    } catch (err) {
      console.error('GET /api/products/:id error:', err);
      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати продукт',
      });
    }
  });

  // POST /api/products -> створити продукт (мінімальна валідація)
  router.post('/', async (req, res) => {
    const { title, category, calories, protein, fat, carbs } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "title" є обовʼязковим і має бути рядком',
      });
    }

    const numericFields = { calories, protein, fat, carbs };
    for (const [key, value] of Object.entries(numericFields)) {
      if (value !== undefined && typeof value !== 'number') {
        return res.status(400).json({
          error: 'ValidationError',
          message: `Поле "${key}" має бути числом, якщо вказане`,
        });
      }
    }

    if (
      calories === undefined ||
      protein === undefined ||
      fat === undefined ||
      carbs === undefined
    ) {
      return res.status(400).json({
        error: 'ValidationError',
        message:
          'Поля "calories", "protein", "fat", "carbs" є обовʼязковими для продукту',
      });
    }

    try {
      const product = await prisma.product.create({
        data: {
          title,
          category: category || null,
          calories,
          protein,
          fat,
          carbs,
        },
      });

      res.status(201).json(product);
    } catch (err) {
      console.error('POST /api/products error:', err);

      // Просте розрізнення помилок Prisma
      if (err.code === 'P2002') {
        return res.status(400).json({
          error: 'UniqueConstraintError',
          message: 'Продукт з такими даними вже існує',
        });
      }

      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося створити продукт',
      });
    }
  });

  return router;
}

module.exports = createProductsRouter;

