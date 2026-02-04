const express = require('express');
const { PrismaClient } = require('@prisma/client');

const productsRoutesFactory = require('./routes/products');
const exercisesRoutesFactory = require('./routes/exercises');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/products', productsRoutesFactory(prisma));
app.use('/api/exercises', exercisesRoutesFactory(prisma));

// Fallback JSON error handler (safety net)
// Note: most Prisma errors are handled directly in route handlers.
// This ensures we always return JSON and never crash the server.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status && Number.isInteger(err.status) ? err.status : 500;
  res.status(status).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
