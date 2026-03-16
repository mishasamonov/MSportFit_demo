const express = require('express');
const authMiddleware = require('../middleware/auth');

/**
 * Маршрути для тренувальних програм.
 * Усі маршрути захищені JWT (authMiddleware).
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
function createProgramsRouter(prisma) {
  const router = express.Router();

  // Усі нижчі маршрути потребують авторизації
  router.use(authMiddleware);

  // GET /api/programs
  router.get('/', async (req, res) => {
    try {
      const programs = await prisma.program.findMany({
        where: { isActive: true },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          goal: true,
          level: true,
          weeks: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json(programs);
    } catch (err) {
      console.error('GET /api/programs error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати список програм',
      });
    }
  });

  // GET /api/programs/:id
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      let program = await prisma.program.findUnique({
        where: { id },
      });

      if (!program) {
        program = await prisma.program.findUnique({
          where: { slug: id },
        });
      }

      if (!program) {
        return res.status(404).json({ error: 'Program not found' });
      }

      return res.json(program);
    } catch (err) {
      console.error('GET /api/programs/:id error:', err);
      return res.status(500).json({
        error: 'DatabaseError',
        message: 'Не вдалося отримати програму',
      });
    }
  });

  return router;
}

module.exports = createProgramsRouter;
