const express = require('express');

/**
 * Маршрути для вправ.
 * @param {import('@prisma/client').PrismaClient} prisma
 */
function createExercisesRouter(prisma) {
  const router = express.Router();

  // GET /api/exercises -> список вправ
  router.get('/', async (req, res) => {
    try {
      const exercises = await prisma.exercise.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(exercises);
    } catch (err) {
      console.error('GET /api/exercises error:', err);
      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати список вправ',
      });
    }
  });

  // GET /api/exercises/:id -> вправа за id
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const exercise = await prisma.exercise.findUnique({
        where: { id },
      });

      if (!exercise) {
        return res.status(404).json({
          error: 'NotFound',
          message: 'Вправу не знайдено',
        });
      }

      res.json(exercise);
    } catch (err) {
      console.error('GET /api/exercises/:id error:', err);
      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати вправу',
      });
    }
  });

  // POST /api/exercises -> створити вправу (мінімальна валідація)
  router.post('/', async (req, res) => {
    const {
      title,
      category,
      calories,
      muscleGroup,
      level,
      videoUrl,
    } = req.body || {};

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "title" є обовʼязковим і має бути рядком',
      });
    }

    if (calories !== undefined && typeof calories !== 'number') {
      return res.status(400).json({
        error: 'ValidationError',
        message: 'Поле "calories" має бути числом, якщо вказане',
      });
    }

    try {
      const exercise = await prisma.exercise.create({
        data: {
          title,
          category: category || null,
          calories: calories ?? null,
          muscleGroup: muscleGroup || null,
          level: level || null,
          videoUrl: videoUrl || null,
        },
      });

      res.status(201).json(exercise);
    } catch (err) {
      console.error('POST /api/exercises error:', err);

      res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося створити вправу',
      });
    }
  });

  return router;
}

module.exports = createExercisesRouter;

