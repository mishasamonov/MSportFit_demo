const express = require('express');

/**
 * Маршрути для вправ.
 * @param {object} prisma - Екземпляр Prisma Client для роботи з базою даних.
 * @returns {object} Express Router
 */
function createExercisesRouter(prisma) {
  const router = express.Router();

  // GET /api/exercises -> список вправ з опціональними фільтрами
  router.get('/', async (req, res) => {
    try {
      const { search, muscleGroup, level, equipment } = req.query;
      const where = {};

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (muscleGroup) {
        where.muscleGroup = { contains: muscleGroup, mode: 'insensitive' };
      }

      if (level) {
        where.level = { equals: level, mode: 'insensitive' };
      }

      if (equipment) {
        where.equipment = { contains: equipment, mode: 'insensitive' };
      }

      const exercises = await prisma.exercise.findMany({
        where,
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

  // GET /api/exercises/:id -> вправа за id або slug
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      let exercise = null;

      try {
        exercise = await prisma.exercise.findUnique({ where: { id } });
      } catch {
        // param може бути slug, а не UUID — продовжуємо пошук за slug
      }

      if (!exercise) {
        exercise = await prisma.exercise.findUnique({ where: { slug: id } });
      }

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
    const { title, category, calories, muscleGroup, level, videoUrl } = req.body || {};

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
