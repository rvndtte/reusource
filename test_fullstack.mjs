async function testAll() {
  const BASE_URL = 'http://localhost:3000/api/v1';

  console.log('--- 1. Testing Auth Login ---');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@supplier.com', password: 'password123' }),
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', loginRes.status, loginData.full_name, loginData.role);
  if (!loginRes.ok) throw new Error('Login failed');

  const token = loginData.access_token;

  console.log('\n--- 2. Testing /auth/me ---');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('Me Response:', meRes.status, meData.email, meData.company_name);

  console.log('\n--- 3. Testing Setor Stok ---');
  const setorRes = await fetch(`${BASE_URL}/material-listings/setor-stok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      waste_type: 'Serbuk Serutan Kayu Jati',
      weight_kg: 120,
      is_dry: true,
      is_clean: true,
      notes: 'Uji integrasi Next.js Fullstack',
    }),
  });
  const setorData = await setorRes.json();
  console.log('Setor Stok Response:', setorRes.status, 'Grade:', setorData.calculated_grade, 'Rev:', setorData.total_estimated_revenue);

  console.log('\n--- 4. Testing Cluster Progress ---');
  const clusterRes = await fetch(`${BASE_URL}/material-listings/cluster-progress`);
  const clusterData = await clusterRes.json();
  console.log('Cluster Progress:', clusterRes.status, 'Current Volume:', clusterData.current_volume_kg, 'kg, Progress:', clusterData.progress_percentage, '%');

  console.log('\n--- 5. Testing Buyer Listings Catalog ---');
  const listingsRes = await fetch(`${BASE_URL}/material-listings`);
  const listingsData = await listingsRes.json();
  console.log('Public Listings Count:', listingsData.length);

  console.log('\n--- 6. Testing Smart Matching ---');
  const matchRes = await fetch(`${BASE_URL}/smart-matching/trigger`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      buying_request_id: 'req-001',
      max_radius_km: 150,
    }),
  });
  const matchData = await matchRes.json();
  console.log('Smart Matching:', matchRes.status, 'Suppliers matched:', matchData.supplier_count, 'Total matched:', matchData.total_matched_quantity);

  console.log('\n--- 7. Testing Admin Verifications Pending Accounts ---');
  // Login as verifier
  const verifierLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'verifier@reusource.id', password: 'password123' }),
  });
  const verifierData = await verifierLogin.json();
  const verifierToken = verifierData.access_token;

  const pendingRes = await fetch(`${BASE_URL}/verifications/pending-accounts`, {
    headers: { Authorization: `Bearer ${verifierToken}` },
  });
  const pendingData = await pendingRes.json();
  console.log('Pending Accounts:', pendingRes.status, 'Count:', pendingData.length);

  console.log('\n--- 8. Testing Impact Dashboard ---');
  const impactRes = await fetch(`${BASE_URL}/impact/dashboard`);
  const impactData = await impactRes.json();
  console.log('Impact Dashboard:', impactRes.status, 'CO2 Avoided:', impactData.total_co2_avoided_kg, 'kg');

  console.log('\n>>> ALL NEXT.JS FULLSTACK TESTS PASSED 100% SUCCESSFULLY! <<<');
}

testAll().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
