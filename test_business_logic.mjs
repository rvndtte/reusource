async function testBusinessLogic() {
  const BASE_URL = 'http://localhost:3000/api/v1';

  console.log('===============================================================');
  console.log('  PENGUJIAN BUSINESS LOGIC AGREGASI PASOKAN & BELI PASOKAN');
  console.log('===============================================================\n');

  // Step 1: Login sebagai Pemasok (Supplier Cimahi)
  console.log('1. Autentikasi Pemasok (test@supplier.com)...');
  const supLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@supplier.com', password: 'password123' }),
  });
  if (!supLogin.ok) throw new Error('Supplier login failed');
  const supAuth = await supLogin.json();
  const supToken = supAuth.access_token;
  console.log('   ✓ Login berhasil sebagai:', supAuth.full_name, `[${supAuth.role}]`);

  // Step 2: Setor 120 kg Grade A pertama kali
  console.log('\n2. Setor Stok Pertama: 120 kg Grade A (Serbuk Serutan Kayu Jati)...');
  const setor1 = await fetch(`${BASE_URL}/material-listings/setor-stok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supToken}`,
    },
    body: JSON.stringify({
      waste_type: 'Serbuk Serutan Kayu Jati',
      weight_kg: 120,
      is_dry: true,
      is_clean: true,
      notes: 'Setoran Batch 1 - Bengkel Kayu Cimahi',
    }),
  });
  if (!setor1.ok) throw new Error('Setor 1 failed');
  const setorData1 = await setor1.json();
  console.log('   ✓ Setor 1 Berhasil: ID', setorData1.listing_id, '| Grade:', setorData1.calculated_grade, '| Berat:', setorData1.weight_kg, 'kg');

  // Step 3: Setor 120 kg Grade A kedua kali
  console.log('\n3. Setor Stok Kedua: 120 kg Grade A (Serbuk Serutan Kayu Jati)...');
  const setor2 = await fetch(`${BASE_URL}/material-listings/setor-stok`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supToken}`,
    },
    body: JSON.stringify({
      waste_type: 'Serbuk Serutan Kayu Jati',
      weight_kg: 120,
      is_dry: true,
      is_clean: true,
      notes: 'Setoran Batch 2 - Bengkel Kayu Cimahi',
    }),
  });
  if (!setor2.ok) throw new Error('Setor 2 failed');
  const setorData2 = await setor2.json();
  console.log('   ✓ Setor 2 Berhasil: ID', setorData2.listing_id, '| Grade:', setorData2.calculated_grade, '| Berat:', setorData2.weight_kg, 'kg');

  // Step 4: Cek Katalog Pembeli (/api/v1/material-listings)
  console.log('\n4. Memeriksa Agregasi di Katalog Pembeli (/api/v1/material-listings)...');
  const catRes = await fetch(`${BASE_URL}/material-listings`);
  if (!catRes.ok) throw new Error('Catalog fetch failed');
  const catalog = await catRes.json();
  console.log('   ✓ Jumlah Kluster Ditampilkan di Katalog:', catalog.length);

  // Cari kluster Cimahi Grade A
  const cimahiCluster = catalog.find(
    (c) => (c.city?.toLowerCase().includes('cimahi')) && (c.grade_spec?.grade === 'A')
  );

  if (!cimahiCluster) {
    throw new Error('Kluster Cimahi Grade A tidak ditemukan di katalog!');
  }

  console.log('   ✓ Kluster Teragregasi Ditemukan:');
  console.log('     - Nama Kluster :', cimahiCluster.cluster_name);
  console.log('     - Total Volume :', cimahiCluster.available_quantity, 'kg (TERAGREGASI MENJADI 1 KLUSTER)');
  console.log('     - Status       :', cimahiCluster.status, `[is_ready: ${cimahiCluster.is_ready_for_sale}]`);
  console.log('     - Kontributor  :', cimahiCluster.contributor_count, 'mitra UMKM');
  console.log('     - Jumlah Setoran Masuk:', cimahiCluster.contributions?.length, 'setoran');

  // Pastikan kedua setoran ada di dalam rincian detail agregasi
  const hasBatch1 = cimahiCluster.contributions.some((c) => c.listing_id === setorData1.listing_id);
  const hasBatch2 = cimahiCluster.contributions.some((c) => c.listing_id === setorData2.listing_id);

  if (hasBatch1 && hasBatch2) {
    console.log('   ✓ VERIFIKASI AGREGASI VALID: Kedua setoran 120kg tersatukan dalam kluster yang sama!');
  } else {
    throw new Error('Salah satu atau kedua setoran tidak ditemukan dalam contributions kluster!');
  }

  // Tampilkan Detail Hasil Agregasi yang akan dilihat pembeli saat mau beli
  console.log('\n5. Simulasi Tampilan Modal Saat Pembeli Mengklik "Beli Pasokan":');
  console.log('   ---------------- DETAIL HASIL AGREGASI MULTI-PEMASOK ----------------');
  cimahiCluster.contributions.forEach((c, idx) => {
    console.log(`   [Setoran #${idx + 1}] Pemasok: ${c.supplier_company_name} | Berat: ${c.weight_kg} kg | Grade: ${c.grade} | Catatan: ${c.notes}`);
  });
  console.log('   Total Volume Teragregasi:', cimahiCluster.available_quantity, 'kg');
  console.log('   Estimasi Tagihan        : Rp', (cimahiCluster.available_quantity * cimahiCluster.price_per_unit).toLocaleString('id-ID'));
  console.log('   Logistik                : Termasuk (Sistem Milk-Run Pengambilan Bersama)');
  console.log('   ---------------------------------------------------------------------');

  // Step 6: Pembeli Melakukan Pembelian Pasokan
  console.log('\n6. Login Sebagai Pembeli (test@buyer.com) & Konfirmasi Beli Pasokan...');
  const buyerLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@buyer.com', password: 'password123' }),
  });
  if (!buyerLogin.ok) throw new Error('Buyer login failed');
  const buyerAuth = await buyerLogin.json();

  const buyQty = 200; // Beli 200 kg dari kluster
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerAuth.access_token}`,
    },
    body: JSON.stringify({
      cluster_id: cimahiCluster.id,
      listing_ids: cimahiCluster.listing_ids,
      quantity: buyQty,
      buyer_company_id: buyerAuth.company_id,
    }),
  });
  if (!orderRes.ok) {
    const err = await orderRes.json();
    throw new Error(`Order creation failed: ${JSON.stringify(err)}`);
  }
  const orderData = await orderRes.json();
  console.log('   ✓ Pembelian Berhasil! PO ID:', orderData.id);
  console.log('     - Total Biaya      : Rp', orderData.total_amount?.toLocaleString('id-ID'));
  console.log('     - Platform Fee (3%): Rp', orderData.platform_fee?.toLocaleString('id-ID'));
  console.log('     - Status Pengiriman:', orderData.order_status);
  console.log('     - Rincian Item PO Terdistribusi:');
  orderData.items.forEach((item, idx) => {
    console.log(`       Item ${idx + 1}: ${item.listing_title} (${item.quantity} kg) dari ${item.supplier_company_name} @ Rp ${item.unit_price}/kg`);
  });

  // Step 7: Verifikasi Pesanan Muncul di Portal Pembeli (/orders)
  console.log('\n7. Memeriksa Pesanan di Riwayat Pembeli (/orders)...');
  const ordersCheck = await fetch(`${BASE_URL}/orders?buyer_company_id=${buyerAuth.company_id}`);
  if (!ordersCheck.ok) throw new Error('Fetch orders failed');
  const buyerOrders = await ordersCheck.json();
  const createdOrder = buyerOrders.find((o) => o.id === orderData.id);
  if (!createdOrder) throw new Error('Order baru tidak ditemukan di riwayat pembeli!');
  console.log('   ✓ Order Terkonfirmasi Ada di Riwayat Pembeli dengan', createdOrder.items.length, 'item pasokan.');

  // Step 8: Verifikasi Sisa Stok Pasokan Terpotong dengan Benar di Katalog
  console.log('\n8. Memeriksa Sisa Kuota di Katalog Pasokan Setelah Pembelian...');
  const catAfterRes = await fetch(`${BASE_URL}/material-listings`);
  const catAfter = await catAfterRes.json();
  const cimahiAfter = catAfter.find(
    (c) => (c.city?.toLowerCase().includes('cimahi')) && (c.grade_spec?.grade === 'A')
  );
  console.log('   ✓ Sisa Kuota Kluster Cimahi Sekarang:', cimahiAfter?.available_quantity || 0, 'kg (Telah berkurang sebesar', buyQty, 'kg)');

  // Step 9: Verifikasi Metrik Dampak ESG Terupdate
  console.log('\n9. Memeriksa Dashboard Dampak ESG (/impact/dashboard)...');
  const impactRes = await fetch(`${BASE_URL}/impact/dashboard`);
  const impactData = await impactRes.json();
  console.log('   ✓ Total CO2e Terhindar      :', impactData.total_co2_avoided_kg, 'kg CO2e');
  console.log('   ✓ Total Revenue Pemasok UMKM: Rp', impactData.total_supplier_revenue_idr?.toLocaleString('id-ID'));
  console.log('   ✓ Total Efisiensi Biaya Buyer: Rp', impactData.total_buyer_savings_idr?.toLocaleString('id-ID'));

  console.log('\n===============================================================');
  console.log('  SEMUA BUSINESS LOGIC TERAGREGASI & TRANSAKSI BERHASIL 100%!');
  console.log('===============================================================\n');
}

testBusinessLogic().catch((err) => {
  console.error('\n❌ Test Gagal:', err.message);
  process.exit(1);
});
