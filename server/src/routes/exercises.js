const express = require('express');

/* ------------------------------------------------------------------ */
/*  Keyword map: canonical UI group  →  substrings that indicate it   */
/* ------------------------------------------------------------------ */
const MUSCLE_GROUP_KEYWORDS = {
  Груди: ['груди', 'грудн'],
  Спина: ['спин', 'найширш', 'ромбоподібн', "круглі м'язи"],
  Ноги: ['ноги', 'квадрицепс', 'стегн', 'литков'],
  Плечі: ['плечі', 'дельт', 'ротатор', 'трапеці'],
  Руки: ['біцепс', 'трицепс', 'брахіаліс'],
  Біцепс: ['біцепс', 'брахіаліс'],
  Трицепс: ['трицепс'],
  Сідниці: ['сідниц'],
  Кор: ['кор', 'прес', 'живот', "косі м'язи"],
};

function normalizeText(text) {
  return text.toLowerCase().replace(/[\u2018\u2019\u02BC]/g, "'");
}

/**
 * Перевіряє, чи відповідає вправа обраній канонічній м'язовій групі.
 * Спершу робить пряме порівняння (для legacy-даних зі збігом назви групи),
 * потім — пошук за ключовими словами зі спеціальною обробкою
 * "біцепс стегна" (задня поверхня стегна ≠ біцепс руки).
 * @param {object} exercise - Об'єкт вправи з полями muscleGroup та category.
 * @param {string} selectedGroup - Канонічна назва м'язової групи з UI-фільтра.
 * @returns {boolean} true, якщо вправа належить до обраної групи.
 */
function matchesMuscleGroup(exercise, selectedGroup) {
  const muscleText = normalizeText(exercise.muscleGroup || '');
  const categoryText = normalizeText(exercise.category || '');
  const groupLower = selectedGroup.toLowerCase();
  const needsBicepsGuard = selectedGroup === 'Руки' || selectedGroup === 'Біцепс';

  if (!needsBicepsGuard) {
    if (muscleText.includes(groupLower) || categoryText.includes(groupLower)) {
      return true;
    }
  }

  const keywords = MUSCLE_GROUP_KEYWORDS[selectedGroup];
  if (!keywords) {
    return muscleText.includes(groupLower) || categoryText.includes(groupLower);
  }

  for (const kw of keywords) {
    const found = muscleText.includes(kw) || categoryText.includes(kw);
    if (!found) continue;

    if (kw === 'біцепс' && needsBicepsGuard) {
      const src = muscleText.includes(kw) ? muscleText : categoryText;
      if (src.includes('біцепс стегн')) {
        const cleaned = src.replace(/біцепс стегн\S*/g, '');
        if (!cleaned.includes('біцепс')) continue;
      }
    }

    return true;
  }

  return false;
}

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
          { category: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (level) {
        where.level = { equals: level, mode: 'insensitive' };
      }

      if (equipment) {
        where.equipment = { contains: equipment, mode: 'insensitive' };
      }

      let exercises = await prisma.exercise.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      if (muscleGroup) {
        const group = String(muscleGroup);
        exercises = exercises.filter((ex) => matchesMuscleGroup(ex, group));
      }

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
