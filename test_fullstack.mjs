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
  if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);

  const token = loginData.access_token;

  console.log('\n--- 2. Testing /auth/me ---');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('Me Response:', meRes.status, meData.email, meData.company_name);
  if (!meRes.ok) throw new Error(`Me failed: ${JSON.stringify(meData)}`);

  console.log('\n--- 3. Testing Setor Stok (120 kg Grade A) ---');
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
  if (!setorRes.ok) throw new Error(`Setor stok failed: ${JSON.stringify(setorData)}`);

  console.log('\n--- 4. Testing Cluster Progress ---');
  const clusterRes = await fetch(`${BASE_URL}/material-listings/cluster-progress`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const clusterData = await clusterRes.json();
  console.log('Cluster Progress:', clusterRes.status, 'Current Volume:', clusterData.current_volume_kg, 'kg, Progress:', clusterData.progress_percentage, '%');
  if (!clusterRes.ok) throw new Error(`Cluster progress failed: ${JSON.stringify(clusterData)}`);

  console.log('\n--- 5. Testing Buyer Listings Catalog (Aggregated Clusters) ---');
  const listingsRes = await fetch(`${BASE_URL}/material-listings`);
  const listingsData = await listingsRes.json();
  console.log('Public Aggregated Clusters Count:', listingsData.length);
  if (!listingsRes.ok) throw new Error(`Catalog fetch failed: ${JSON.stringify(listingsData)}`);
  
  const cimahiCluster = listingsData.find((c) => c.city?.toLowerCase().includes('cimahi'));
  if (cimahiCluster) {
    console.log('Found Cimahi Aggregated Cluster:', cimahiCluster.cluster_name, 'Volume:', cimahiCluster.available_quantity, 'kg, Contributions:', cimahiCluster.contributions?.length);
  }

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
  if (!matchRes.ok) throw new Error(`Smart matching failed: ${JSON.stringify(matchData)}`);

  console.log('\n--- 7. Testing Admin Verifications Pending Accounts ---');
  const verifierLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'verifier@reusource.id', password: 'password123' }),
  });
  const verifierData = await verifierLogin.json();
  if (!verifierLogin.ok) throw new Error(`Verifier login failed: ${JSON.stringify(verifierData)}`);
  const verifierToken = verifierData.access_token;

  const pendingRes = await fetch(`${BASE_URL}/verifications/pending-accounts`, {
    headers: { Authorization: `Bearer ${verifierToken}` },
  });
  const pendingData = await pendingRes.json();
  console.log('Pending Accounts:', pendingRes.status, 'Count:', Array.isArray(pendingData) ? pendingData.length : 0);
  if (!pendingRes.ok) throw new Error(`Pending accounts failed: ${JSON.stringify(pendingData)}`);

  console.log('\n--- 8. Testing Buyer Purchase of Aggregated Cluster ---');
  const buyerLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@buyer.com', password: 'password123' }),
  });
  const buyerData = await buyerLogin.json();
  if (!buyerLogin.ok) throw new Error(`Buyer login failed: ${JSON.stringify(buyerData)}`);

  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerData.access_token}`,
    },
    body: JSON.stringify({
      cluster_id: cimahiCluster?.id,
      listing_ids: cimahiCluster?.listing_ids,
      quantity: 100, // Buy 100 kg from cluster
      buyer_company_id: buyerData.company_id,
    }),
  });
  const orderData = await orderRes.json();
  console.log('Order Creation:', orderRes.status, 'Order ID:', orderData.id, 'Total Amount:', orderData.total_amount, 'Items Count:', orderData.items?.length);
  if (!orderRes.ok) throw new Error(`Order creation failed: ${JSON.stringify(orderData)}`);

  console.log('\n--- 9. Testing Impact Dashboard ---');
  const impactRes = await fetch(`${BASE_URL}/impact/dashboard`);
  const impactData = await impactRes.json();
  console.log('Impact Dashboard:', impactRes.status, 'CO2 Avoided:', impactData.total_co2_avoided_kg, 'kg, Orders:', impactData.total_completed_orders);
  if (!impactRes.ok) throw new Error(`Impact dashboard failed: ${JSON.stringify(impactData)}`);

  console.log('\n>>> ALL NEXT.JS FULLSTACK TESTS PASSED 100% SUCCESSFULLY! <<<');
}

testAll().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
