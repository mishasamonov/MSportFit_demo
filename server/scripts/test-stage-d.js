/**
 * Automated test for Stage D (Auth + Favorites)
 * 
 * Requires:
 * - Node 18+ (native fetch)
 * - Server running on PORT (default 3001)
 * - JWT_SECRET set in server/.env
 * 
 * Usage: npm run test:stage-d
 */

require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 3001}`;

// Utility: fetch with strict error handling
async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  // REQUIREMENT 1: Check res.ok FIRST
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

  // REQUIREMENT 2: Check content-type before parsing JSON
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

  const data = await response.json();
  return data;
}

// Generate random test email
function generateTestEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `test-${timestamp}-${random}@msportfit.test`;
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🧪 Stage D Test: Auth + Favorites');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');

  // Check server health
  console.log('1️⃣  Checking server health...');
  try {
    const health = await apiFetch('/api/health');
    console.log('   ✓ Server is running:', health);
  } catch (err) {
    console.error('   ✗ Server is not reachable:', err.message);
    console.error('   Make sure server is running: npm run dev');
    process.exit(1);
  }

  // Register new user
  console.log('');
  console.log('2️⃣  Registering new user...');
  const email = generateTestEmail();
  const password = 'test123456';

  let token;
  try {
    const registerData = await apiFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    token = registerData.token;
    console.log(`   ✓ Registered: ${email}`);
    console.log(`   ✓ Token: ${token.substring(0, 30)}...`);
  } catch (err) {
    console.error('   ✗ Register failed:', err.message);
    process.exit(1);
  }

  // Get current user
  console.log('');
  console.log('3️⃣  Getting current user (GET /api/auth/me)...');
  try {
    const user = await apiFetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('   ✓ Current user:', { id: user.id, email: user.email });
  } catch (err) {
    console.error('   ✗ GET /me failed:', err.message);
    process.exit(1);
  }

  // Fetch products
  console.log('');
  console.log('4️⃣  Fetching products...');
  let productId;
  const products = await apiFetch('/api/products');
  if (products.length === 0) {
    console.log('   ⚠️  No products found. Run: npm run seed');
    console.log('   Skipping product favorites test.');
  } else {
    productId = products[0].id;
    console.log(`   ✓ Found ${products.length} products, using first: ${products[0].title}`);
  }

  // Fetch exercises
  console.log('');
  console.log('5️⃣  Fetching exercises...');
  let exerciseId;
  const exercises = await apiFetch('/api/exercises');
  if (exercises.length === 0) {
    console.log('   ⚠️  No exercises found. Run: npm run seed');
    console.log('   Skipping exercise favorites test.');
  } else {
    exerciseId = exercises[0].id;
    console.log(
      `   ✓ Found ${exercises.length} exercises, using first: ${exercises[0].title}`
    );
  }

  // Add product to favorites + VALIDATE
  if (productId) {
    console.log('');
    console.log('6️⃣  Adding product to favorites...');
    
    // Get initial count
    const initialProducts = await apiFetch('/api/favorites/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const initialCount = initialProducts.length;
    
    // Add to favorites
    await apiFetch('/api/favorites/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });
    console.log('   ✓ Product add request sent');
    
    // REQUIREMENT 3: Verify it was actually added
    const updatedProducts = await apiFetch('/api/favorites/products', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const productExists = updatedProducts.some((fp) => fp.productId === productId);
    const countIncreased = updatedProducts.length > initialCount;
    
    if (!productExists || !countIncreased) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ VALIDATION FAILED: Product was NOT added to favorites');
      console.error(`   Product ID: ${productId}`);
      console.error(`   Initial count: ${initialCount}`);
      console.error(`   Updated count: ${updatedProducts.length}`);
      console.error(`   Product exists in list: ${productExists}`);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(1);
    }
    
    console.log(`   ✓ VALIDATED: Product added (count: ${initialCount} → ${updatedProducts.length})`);
  }

  // Add exercise to favorites + VALIDATE
  if (exerciseId) {
    console.log('');
    console.log('7️⃣  Adding exercise to favorites...');
    
    // Get initial count
    const initialExercises = await apiFetch('/api/favorites/exercises', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const initialCount = initialExercises.length;
    
    // Add to favorites
    await apiFetch('/api/favorites/exercises', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ exerciseId }),
    });
    console.log('   ✓ Exercise add request sent');
    
    // REQUIREMENT 3: Verify it was actually added
    const updatedExercises = await apiFetch('/api/favorites/exercises', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const exerciseExists = updatedExercises.some((fe) => fe.exerciseId === exerciseId);
    const countIncreased = updatedExercises.length > initialCount;
    
    if (!exerciseExists || !countIncreased) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ VALIDATION FAILED: Exercise was NOT added to favorites');
      console.error(`   Exercise ID: ${exerciseId}`);
      console.error(`   Initial count: ${initialCount}`);
      console.error(`   Updated count: ${updatedExercises.length}`);
      console.error(`   Exercise exists in list: ${exerciseExists}`);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      process.exit(1);
    }
    
    console.log(`   ✓ VALIDATED: Exercise added (count: ${initialCount} → ${updatedExercises.length})`);
  }

  // Final verification - get all favorites
  console.log('');
  console.log('8️⃣  Final verification: getting all favorites...');
  const finalProducts = await apiFetch('/api/favorites/products', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const finalExercises = await apiFetch('/api/favorites/exercises', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log(`   ✓ Total favorite products: ${finalProducts.length}`);
  if (finalProducts.length > 0) {
    console.log('     Items:', finalProducts.map((fp) => fp.product.title).join(', '));
  }
  
  console.log(`   ✓ Total favorite exercises: ${finalExercises.length}`);
  if (finalExercises.length > 0) {
    console.log('     Items:', finalExercises.map((fe) => fe.exercise.title).join(', '));
  }

  // REQUIREMENT 4: Success summary (ONLY if we got here)
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📋 Verified functionality:');
  console.log('   ✓ Server health check');
  console.log('   ✓ User registration');
  console.log('   ✓ JWT authentication (/me endpoint)');
  console.log('   ✓ Product favorites (add + validate)');
  console.log('   ✓ Exercise favorites (add + validate)');
  console.log('   ✓ Favorites listing');
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
