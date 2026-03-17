/**
 * Automated test for Stage E (Training Programs)
 *
 * Requires:
 * - Node 18+ (native fetch)
 * - Server running on PORT (default 3001)
 * - JWT_SECRET set in server/.env
 * - Database seeded: npm run seed
 *
 * Usage: npm run test:stage-e
 */

require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3001}`;

async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const { headers: optionHeaders, ...restOptions } = options;
  const response = await fetch(url, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...optionHeaders,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`❌ HTTP ERROR: ${options.method || 'GET'} request failed`);
    console.error(`   Status: ${response.status} ${response.statusText}`);
    console.error(`   URL: ${url}`);
    console.error(`   Response body (first 300 chars):`);
    console.error(`   ${responseText.substring(0, 300)}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const responseText = await response.text();
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ CONTENT-TYPE ERROR: Expected JSON but got:', contentType);
    console.error(`   URL: ${url}`);
    console.error(`   Response body (first 300 chars):`);
    console.error(`   ${responseText.substring(0, 300)}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }

  return response.json();
}

function generateTestEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@msportfit.test`;
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Stage E Test: Training Programs');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // 1. Check server health
  console.log('1️⃣  Checking server health...');
  try {
    const health = await apiFetch('/api/health');
    console.log('   ✓ Server is running:', health);
  } catch (err) {
    console.error('   ✗ Server is not reachable:', err.message);
    console.error('   Make sure server is running: npm run dev');
    process.exit(1);
  }

  // 2. Register new test user
  console.log('');
  console.log('2️⃣  Registering new test user...');
  const email = generateTestEmail();
  const password = 'test123456';

  try {
    await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    console.log(`   ✓ Registered: ${email}`);
  } catch (err) {
    console.error('   ✗ Register failed:', err.message);
    process.exit(1);
  }

  // 3. Login and obtain token
  console.log('');
  console.log('3️⃣  Logging in (POST /api/auth/login)...');
  let token;
  try {
    const loginData = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    token = loginData.token;
    console.log(`   ✓ Login successful`);
    console.log(`   ✓ Token: ${token.substring(0, 30)}...`);
  } catch (err) {
    console.error('   ✗ Login failed:', err.message);
    process.exit(1);
  }

  // 4. GET /api/programs — assert array length > 0
  console.log('');
  console.log('4️⃣  Fetching programs list (GET /api/programs)...');
  const programs = await apiFetch('/api/programs', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!Array.isArray(programs) || programs.length === 0) {
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ No programs found. Run: npm run seed');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }

  console.log(`   ✓ Found ${programs.length} programs`);
  programs.forEach((p) => console.log(`     - [${p.slug || p.id}] ${p.title}`));

  // 5. GET /api/programs/:id — fetch first program details
  const firstProgram = programs[0];
  const identifier = firstProgram.slug || firstProgram.id;

  console.log('');
  console.log(`5️⃣  Fetching program details (GET /api/programs/${identifier})...`);
  const details = await apiFetch(`/api/programs/${encodeURIComponent(identifier)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(`   ✓ Received program: "${details.title}"`);

  // 6. Assert required fields: title, weeks, days, days.variants
  console.log('');
  console.log('6️⃣  Asserting program structure...');

  const missingFields = [];

  if (!details.title) missingFields.push('title');
  if (details.weeks == null) missingFields.push('weeks');
  if (!details.days) missingFields.push('days');
  if (!details.days?.variants) missingFields.push('days.variants');

  if (missingFields.length > 0) {
    console.error('');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ VALIDATION FAILED: Missing required fields');
    console.error(`   Missing: ${missingFields.join(', ')}`);
    console.error(`   Received keys: ${Object.keys(details).join(', ')}`);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(1);
  }

  const variantKeys = Object.keys(details.days.variants);
  console.log(`   ✓ title: "${details.title}"`);
  console.log(`   ✓ weeks: ${details.weeks}`);
  console.log(`   ✓ days: present`);
  console.log(`   ✓ days.variants: present (keys: ${variantKeys.join(', ')})`);

  // Success
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Verified functionality:');
  console.log('   ✓ Server health check');
  console.log('   ✓ User registration');
  console.log('   ✓ User login (JWT token)');
  console.log('   ✓ GET /api/programs (array, length > 0)');
  console.log('   ✓ GET /api/programs/:id (details with title, weeks, days, days.variants)');
  console.log('');
  console.log('💡 Test user credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('');
}

main().catch((err) => {
  console.error('');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ Test failed with error:');
  console.error(err);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(1);
});
