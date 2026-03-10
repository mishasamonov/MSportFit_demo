/**
 * API Benchmark Script
 *
 * Measures response time for main API scenarios.
 * Uses built-in fetch (Node.js 18+), no extra dependencies.
 *
 * Usage: npm run benchmark
 */

require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3001}`;
const ITERATIONS = 10;

// ─── helpers ────────────────────────────────────────────────────────────────

async function timedFetch(url, options = {}) {
  const start = performance.now();
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const elapsed = performance.now() - start;
  return { status: res.status, ok: res.ok, elapsed, res };
}

function calcStats(times) {
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  return {
    count: times.length,
    avg: avg.toFixed(2),
    min: Math.min(...times).toFixed(2),
    max: Math.max(...times).toFixed(2),
  };
}

async function runScenario(label, fn) {
  const times = [];
  let error = null;

  for (let i = 0; i < ITERATIONS; i++) {
    try {
      const ms = await fn();
      times.push(ms);
    } catch (err) {
      error = err.message;
      break;
    }
  }

  if (error) {
    return { label, error };
  }
  return { label, ...calcStats(times) };
}

function generateTestEmail() {
  return `bench-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@msportfit.test`;
}

// ─── scenarios ───────────────────────────────────────────────────────────────

async function scenarioHealth() {
  const { elapsed, ok } = await timedFetch(`${BASE_URL}/api/health`);
  if (!ok) throw new Error('GET /api/health returned non-2xx');
  return elapsed;
}

async function scenarioProducts() {
  const { elapsed, ok } = await timedFetch(`${BASE_URL}/api/products`);
  if (!ok) throw new Error('GET /api/products returned non-2xx');
  return elapsed;
}

async function scenarioExercises() {
  const { elapsed, ok } = await timedFetch(`${BASE_URL}/api/exercises`);
  if (!ok) throw new Error('GET /api/exercises returned non-2xx');
  return elapsed;
}

// Auth register — кожна ітерація реєструє нового унікального юзера
async function scenarioAuthRegister() {
  const body = JSON.stringify({ email: generateTestEmail(), password: 'bench123456' });
  const { elapsed, ok } = await timedFetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    body,
  });
  if (!ok) throw new Error('POST /api/auth/register returned non-2xx');
  return elapsed;
}

// Favorites list — потребує валідного токена, отримуємо його один раз
async function makeScenarioFavorites(token) {
  return async function scenarioFavoritesList() {
    const { elapsed, ok } = await timedFetch(`${BASE_URL}/api/favorites/products`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!ok) throw new Error('GET /api/favorites/products returned non-2xx');
    return elapsed;
  };
}

// ─── table output ─────────────────────────────────────────────────────────────

function printTable(results) {
  const COL = { label: 32, count: 7, avg: 10, min: 10, max: 10 };

  const hr = () =>
    console.log(
      '+-' +
        '-'.repeat(COL.label) +
        '-+-' +
        '-'.repeat(COL.count) +
        '-+-' +
        '-'.repeat(COL.avg) +
        '-+-' +
        '-'.repeat(COL.min) +
        '-+-' +
        '-'.repeat(COL.max) +
        '-+',
    );

  const row = (a, b, c, d, e) =>
    console.log(
      `| ${a.padEnd(COL.label)} | ${b.padStart(COL.count)} | ${c.padStart(COL.avg)} | ${d.padStart(COL.min)} | ${e.padStart(COL.max)} |`,
    );

  hr();
  row('Scenario', 'Runs', 'Avg (ms)', 'Min (ms)', 'Max (ms)');
  hr();

  for (const r of results) {
    if (r.error) {
      row(r.label, '-', 'ERROR', r.error.slice(0, COL.min), '-');
    } else {
      row(r.label, String(r.count), r.avg, r.min, r.max);
    }
  }

  hr();
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  API Benchmark  |  ${BASE_URL}  |  ${ITERATIONS} iterations each`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Перевірка доступності сервера
  try {
    const { ok } = await timedFetch(`${BASE_URL}/api/health`);
    if (!ok) throw new Error('non-2xx');
  } catch {
    console.error('  ✗ Server is not reachable. Start it first: npm run dev');
    process.exit(1);
  }

  const results = [];

  // Базові сценарії
  results.push(await runScenario('GET /api/health', scenarioHealth));
  results.push(await runScenario('GET /api/products', scenarioProducts));
  results.push(await runScenario('GET /api/exercises', scenarioExercises));

  // Auth сценарій
  results.push(await runScenario('POST /api/auth/register', scenarioAuthRegister));

  // Favorites — отримуємо токен один раз, потім міряємо GET список
  try {
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: generateTestEmail(), password: 'bench123456' }),
    });
    if (regRes.ok) {
      const { token } = await regRes.json();
      const scenarioFavorites = await makeScenarioFavorites(token);
      results.push(await runScenario('GET /api/favorites/products', scenarioFavorites));
    } else {
      results.push({ label: 'GET /api/favorites/products', error: 'auth unavailable' });
    }
  } catch (err) {
    results.push({ label: 'GET /api/favorites/products', error: err.message });
  }

  console.log('  Results:\n');
  printTable(results);
  console.log('');
}

main().catch((err) => {
  console.error('');
  console.error('  Benchmark failed:', err.message);
  process.exit(1);
});
