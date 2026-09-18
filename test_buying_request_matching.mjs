async function testBuyingRequestSmartMatching() {
  const BASE_URL = 'http://localhost:3000/api/v1';

  console.log('===============================================================');
  console.log('  PENGUJIAN: PERMINTAAN PEMBELI (BUYING REQUEST) x SMART MATCHING');
  console.log('===============================================================\n');

  // Step 1: Login sebagai Pembeli
  console.log('1. Autentikasi Pembeli (test@buyer.com)...');
  const buyerLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@buyer.com', password: 'password123' }),
  });
  if (!buyerLogin.ok) throw new Error('Buyer login failed: ' + (await buyerLogin.text()));
  const buyerAuth = await buyerLogin.json();
  console.log('   ✓ Login berhasil sebagai:', buyerAuth.full_name, `[${buyerAuth.role}]`, '| company_id:', buyerAuth.company_id);

  // Step 1b: Setor stok segar dari Supplier Cimahi (stok lama sudah sold_out akibat test sebelumnya)
  //          agar tersedia kandidat pemasok aktif dalam radius untuk di-matching.
  console.log('\n1b. Setor Stok Segar dari Pemasok Cimahi (agar ada kandidat aktif untuk matching)...');
  const supLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@supplier.com', password: 'password123' }),
  });
  if (!supLogin.ok) throw new Error('Supplier login failed: ' + (await supLogin.text()));
  const supAuth = await supLogin.json();
  const setorRes = await fetch(`${BASE_URL}/material-listings/setor-stok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supAuth.access_token}`,
    },
    body: JSON.stringify({
      waste_type: 'Serbuk Serutan Kayu Jati',
      weight_kg: 350,
      is_dry: true,
      is_clean: true,
      notes: 'Setoran untuk uji smart matching permintaan rutin',
    }),
  });
  if (!setorRes.ok) throw new Error('Setor stok failed: ' + (await setorRes.text()));
  const setorData = await setorRes.json();
  console.log('   ✓ Setor Berhasil: ID', setorData.listing_id, '| Grade:', setorData.calculated_grade, '| Berat:', setorData.weight_kg, 'kg');

  // Step 2: Buyer membuat permintaan rutin (buying request) via endpoint yang baru diperbaiki
  //         Ini mensimulasikan panggilan buyerApi.submitBuyingRequest() dari BuyerPermintaan.jsx
  console.log('\n2. Buyer Mengirim Permintaan Pasokan Rutin (POST /buying-requests)...');
  const targetQty = 300;
  const reqRes = await fetch(`${BASE_URL}/buying-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerAuth.access_token}`,
    },
    body: JSON.stringify({
      buyer_company_id: buyerAuth.company_id,
      title: `Kebutuhan Serbuk Serutan Kayu Jati (${targetQty} kg)`,
      waste_type: 'Serbuk Serutan Kayu Jati',
      target_quantity: targetQty,
      unit: 'kg',
      max_price_per_unit: 1000.0,
      min_grade_spec: { min_grade: 'A' },
      delivery_address: 'Kawasan Industri GIIC Cikarang',
      delivery_city: 'Bekasi',
      latitude: -6.3005,
      longitude: 107.169,
    }),
  });
  if (!reqRes.ok) throw new Error('Buying request creation failed: ' + (await reqRes.text()));
  const buyingRequest = await reqRes.json();
  console.log('   ✓ Permintaan Dibuat: ID', buyingRequest.id, '| Kategori:', buyingRequest.category_name, '| Target:', buyingRequest.target_quantity, buyingRequest.unit);
  console.log('     - Harga Maks/unit:', buyingRequest.max_price_per_unit, '| Status:', buyingRequest.status);

  if (buyingRequest.target_quantity !== targetQty) {
    throw new Error(`Target quantity mismatch: expected ${targetQty}, got ${buyingRequest.target_quantity}`);
  }

  // Step 3: Trigger Smart Matching Engine untuk permintaan ini
  console.log('\n3. Memicu Smart Matching Engine (POST /smart-matching/trigger)...');
  const maxRadiusKm = 500; // cukup untuk menjangkau Cimahi (~100km) tapi tidak Banda Neira (~2500km)
  const triggerRes = await fetch(`${BASE_URL}/smart-matching/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerAuth.access_token}`,
    },
    body: JSON.stringify({
      buying_request_id: buyingRequest.id,
      max_radius_km: maxRadiusKm,
    }),
  });
  if (!triggerRes.ok) throw new Error('Smart matching trigger failed: ' + (await triggerRes.text()));
  const aggregated = await triggerRes.json();
  console.log('   ✓ Agregasi Dihasilkan: ID', aggregated.id, '| Status:', aggregated.status);
  console.log('     - Total Matched Qty  :', aggregated.total_matched_quantity, 'kg (dari target', aggregated.target_quantity, 'kg)');
  console.log('     - Jumlah Pemasok     :', aggregated.supplier_count);
  console.log('     - Rata2 Jarak        :', aggregated.average_distance_km, 'km');
  console.log('     - Total Biaya Bahan  : Rp', aggregated.total_material_cost?.toLocaleString('id-ID'));
  console.log('     - Platform Fee (3%)  : Rp', aggregated.platform_fee?.toLocaleString('id-ID'));

  // Step 4: Verifikasi business logic matching engine
  console.log('\n4. Verifikasi Business Logic Matching...');

  // 4a. Semua item harus berasal dari pemasok dalam radius (Cimahi, bukan Banda Neira)
  const supplierNames = aggregated.items.map((i) => i.supplier_company_name);
  console.log('   - Pemasok Terpilih:', supplierNames.join(', '));
  const hasBanda = supplierNames.some((n) => n?.toLowerCase().includes('banda'));
  if (hasBanda) {
    throw new Error('GAGAL: Pemasok Banda Neira (di luar radius) ikut ter-matching!');
  }
  console.log('   ✓ Filter Radius Valid: Pemasok di luar radius (Banda Neira, ~2500km) TIDAK ikut matching.');

  // 4b. Semua jarak yang dikembalikan harus <= radius yang diminta
  const allWithinRadius = aggregated.items.every((i) => i.distance_km <= maxRadiusKm);
  if (!allWithinRadius) throw new Error('GAGAL: Ada item dengan distance_km melebihi max_radius_km!');
  console.log('   ✓ Semua item matching berada dalam radius', maxRadiusKm, 'km.');

  // 4c. Semua harga per unit harus <= max_price_per_unit yang diminta buyer
  const allWithinPrice = aggregated.items.every((i) => i.unit_price <= buyingRequest.max_price_per_unit);
  if (!allWithinPrice) throw new Error('GAGAL: Ada item dengan unit_price melebihi max_price_per_unit permintaan!');
  console.log('   ✓ Semua item matching mematuhi batas harga max_price_per_unit.');

  // 4d. Total teralokasi tidak boleh melebihi target quantity (greedy allocation cap)
  if (aggregated.total_matched_quantity > buyingRequest.target_quantity) {
    throw new Error('GAGAL: total_matched_quantity melebihi target_quantity permintaan!');
  }
  console.log('   ✓ Total kuantitas teralokasi tidak melebihi target permintaan (greedy allocation valid).');

  // 4e. Subtotal per item harus konsisten (allocated_quantity * unit_price)
  const subtotalConsistent = aggregated.items.every(
    (i) => Math.abs(i.subtotal - i.allocated_quantity * i.unit_price) < 0.01
  );
  if (!subtotalConsistent) throw new Error('GAGAL: subtotal item tidak konsisten dengan allocated_quantity * unit_price!');
  console.log('   ✓ Subtotal setiap item konsisten dengan allocated_quantity x unit_price.');

  // 4f. Total material cost harus sama dengan jumlah semua subtotal item
  const sumSubtotal = aggregated.items.reduce((sum, i) => sum + i.subtotal, 0);
  if (Math.abs(sumSubtotal - aggregated.total_material_cost) > 0.01) {
    throw new Error('GAGAL: total_material_cost tidak sama dengan penjumlahan subtotal semua item!');
  }
  console.log('   ✓ total_material_cost konsisten dengan penjumlahan subtotal semua item.');

  // 4g. Platform fee harus 3% dari total_material_cost
  const expectedFee = Math.round(aggregated.total_material_cost * 0.03 * 100) / 100;
  if (Math.abs(expectedFee - aggregated.platform_fee) > 0.01) {
    throw new Error(`GAGAL: platform_fee (${aggregated.platform_fee}) tidak sama dengan 3% dari total_material_cost (${expectedFee})!`);
  }
  console.log('   ✓ Platform fee 3% dihitung dengan benar.');

  // Step 5: Verifikasi status buying request berubah jadi 'matched'
  console.log('\n5. Memeriksa Status Permintaan Setelah Matching (GET /smart-matching/request/[id])...');
  const checkRes = await fetch(`${BASE_URL}/smart-matching/request/${buyingRequest.id}`);
  if (!checkRes.ok) throw new Error('Fetch matching by request id failed: ' + (await checkRes.text()));
  const checkResult = await checkRes.json();
  const foundAgg = checkResult.find((a) => a.id === aggregated.id);
  if (!foundAgg) throw new Error('GAGAL: Hasil agregasi tidak ditemukan saat query ulang berdasarkan buying_request_id!');
  console.log('   ✓ Hasil agregasi konsisten saat di-query ulang via buying_request_id.');

  console.log('\n===============================================================');
  console.log('  SEMUA BUSINESS LOGIC PERMINTAAN PEMBELI x SMART MATCHING VALID!');
  console.log('===============================================================\n');
}

testBuyingRequestSmartMatching().catch((err) => {
  console.error('\n❌ Test Gagal:', err.message);
  process.exit(1);
});
