import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Pre-hashed bcrypt for 'password123' and 'wa_otp_secure_login'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);
const WA_OTP_PASSWORD_HASH = bcrypt.hashSync('wa_otp_secure_login', 10);

function generateId() {
  return crypto.randomUUID();
}

function createTable() {
  const items = new Map();

  return {
    find: (predicate = () => true) => {
      const results = [];
      for (const item of items.values()) {
        if (predicate(item)) {
          results.push({ ...item });
        }
      }
      return results;
    },
    findById: (id) => {
      const item = items.get(id);
      return item ? { ...item } : null;
    },
    findOne: (predicate) => {
      for (const item of items.values()) {
        if (predicate(item)) {
          return { ...item };
        }
      }
      return null;
    },
    create: (data) => {
      const id = data.id || generateId();
      const now = new Date().toISOString();
      const record = {
        ...data,
        id,
        created_at: data.created_at || now,
        updated_at: data.updated_at || now,
      };
      items.set(id, record);
      return { ...record };
    },
    update: (id, updates) => {
      const existing = items.get(id);
      if (!existing) return null;
      const updated = {
        ...existing,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      items.set(id, updated);
      return { ...updated };
    },
    delete: (id) => {
      return items.delete(id);
    },
    clear: () => {
      items.clear();
    },
    count: (predicate = () => true) => {
      let count = 0;
      for (const item of items.values()) {
        if (predicate(item)) count++;
      }
      return count;
    },
    rawMap: items,
  };
}

class Database {
  constructor() {
    this.categories = createTable();
    this.companies = createTable();
    this.users = createTable();
    this.material_listings = createTable();
    this.buying_requests = createTable();
    this.aggregated_supplies = createTable();
    this.aggregated_supply_items = createTable();
    this.orders = createTable();
    this.order_items = createTable();
    this.verifications = createTable();
    this.impact_logs = createTable();

    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Biomass & Wood Categories
    const catWoodSawdust = this.categories.create({
      id: 'cat-wood-001',
      name: 'Serbuk Serutan Kayu Jati',
      description: 'Biomassa serbuk gergaji dan serutan kayu jati industri mebel',
      default_unit: 'kg',
      co2_saved_factor_per_unit: 1.25,
    });

    const catWoodChips = this.categories.create({
      id: 'cat-wood-002',
      name: 'Wood Chips / Serpihan Kayu',
      description: 'Serpihan kayu keras dan lunak untuk bahan baku pelet/boiler',
      default_unit: 'kg',
      co2_saved_factor_per_unit: 1.15,
    });

    const catWoodOffcuts = this.categories.create({
      id: 'cat-wood-003',
      name: 'Potongan Kayu Padat (Offcuts)',
      description: 'Potongan balok kayu sisa industri mebel dan pertukangan',
      default_unit: 'kg',
      co2_saved_factor_per_unit: 1.05,
    });

    const catWoodBark = this.categories.create({
      id: 'cat-wood-004',
      name: 'Kulit Kayu & Sisa Sawmill',
      description: 'Limbah kupasan kulit kayu dan sisa penggergajian sentra sawmill',
      default_unit: 'kg',
      co2_saved_factor_per_unit: 0.95,
    });

    // 2. Companies
    const sup1 = this.companies.create({
      id: 'comp-sup-001',
      name: 'UD Kayu Lestari Cimahi',
      company_type: 'umkm_supplier',
      nib_npwp: '9120001234567',
      address: 'Jl. Raya Cimahi No. 45',
      city: 'Cimahi',
      province: 'Jawa Barat',
      latitude: -6.8722,
      longitude: 107.5422,
      verification_status: 'approved',
      verification_notes: 'Dokumen legalitas & verifikasi lokasi fisik valid.',
      is_micro_business: 'true',
      is_first_time_seller: 'false',
    });

    const sup2 = this.companies.create({
      id: 'comp-sup-002',
      name: 'Sentra Mebel Jati Barokah Sumedang',
      company_type: 'umkm_supplier',
      nib_npwp: '9120007654321',
      address: 'Jl. Raya Jatinangor No. 12',
      city: 'Sumedang',
      province: 'Jawa Barat',
      latitude: -6.9311,
      longitude: 107.7719,
      verification_status: 'approved',
      verification_notes: 'Dokumen legalitas terverifikasi.',
      is_micro_business: 'true',
      is_first_time_seller: 'false',
    });

    const sup3 = this.companies.create({
      id: 'comp-sup-003',
      name: 'Koperasi Sawmill Resik Bandung',
      company_type: 'umkm_supplier',
      nib_npwp: '9120009988776',
      address: 'Jl. Soekarno-Hatta No. 210',
      city: 'Bandung',
      province: 'Jawa Barat',
      latitude: -6.945,
      longitude: 107.64,
      verification_status: 'approved',
      verification_notes: 'Tersertifikasi ramah lingkungan.',
      is_micro_business: 'true',
      is_first_time_seller: 'false',
    });

    const buyer1 = this.companies.create({
      id: 'comp-buy-001',
      name: 'PT Biomassa Nusantara Energi (Pabrik Pelet)',
      company_type: 'enterprise_buyer',
      nib_npwp: '013456789012000',
      address: 'Kawasan Industri Jababeka 5, Cikarang',
      city: 'Bekasi',
      province: 'Jawa Barat',
      latitude: -6.3005,
      longitude: 107.169,
      verification_status: 'approved',
      verification_notes: 'Perusahaan pembeli enterprise lolos audit verifikasi finansial.',
      is_micro_business: 'false',
      is_first_time_seller: 'false',
    });

    // 3. Users
    this.users.create({
      id: 'usr-sup-001',
      email: 'supplier1@cimahi.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Budi Santoso',
      phone: '081234567890',
      role: 'supplier_admin',
      company_id: sup1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-buy-001',
      email: 'buyer@ecopolymer.co.id',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Sarah Wijaya',
      phone: '081987654321',
      role: 'buyer_admin',
      company_id: buyer1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-admin-001',
      email: 'admin@bylink.id',
      password_hash: bcrypt.hashSync('admin123', 10),
      full_name: 'Super Admin Verifier',
      phone: '081199887766',
      role: 'admin',
      company_id: sup1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-ver-001',
      email: 'verifier@reusource.id',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Ahmad Field Verifier',
      phone: '081122334455',
      role: 'verifier',
      company_id: sup1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-demo-sup',
      email: 'test@supplier.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Demo Supplier Bengkel',
      phone: '081234567891',
      role: 'supplier_admin',
      company_id: sup1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-demo-buy',
      email: 'test@buyer.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Demo Buyer Pabrik',
      phone: '081234567892',
      role: 'buyer_admin',
      company_id: buyer1.id,
      is_active: true,
    });

    // 4. Material Listings (All Wood & Biomass in kg)
    const list1 = this.material_listings.create({
      id: 'list-001',
      company_id: sup1.id,
      category_id: catWoodSawdust.id,
      title: 'Serbuk Serutan Kayu Jati (Grade A)',
      description: 'Kondisi kering oven, kadar air ≤12%, bebas paku dan residu lem.',
      grade_spec: {
        grade: 'A',
        is_dry: true,
        is_clean: true,
        evaluated_reason: 'Kering sempurna, bebas kontaminasi, volume >= 100 kg',
        co2e_saved_kg: 812.5,
      },
      available_quantity: 650.0,
      initial_quantity: 650.0,
      unit: 'kg',
      price_per_unit: 800.0,
      frequency: 'weekly',
      latitude: sup1.latitude,
      longitude: sup1.longitude,
      city: sup1.city,
      status: 'active',
      photos: [],
    });

    const list2 = this.material_listings.create({
      id: 'list-002',
      company_id: sup2.id,
      category_id: catWoodChips.id,
      title: 'Wood Chips / Serpihan Kayu (Grade A)',
      description: 'Serpihan kayu mahoni & jati seragam, kadar air 14%, siap proses pellet.',
      grade_spec: {
        grade: 'A',
        is_dry: true,
        is_clean: true,
        evaluated_reason: 'Serpihan seragam, kering, bebas tanah & paku',
        co2e_saved_kg: 920.0,
      },
      available_quantity: 800.0,
      initial_quantity: 800.0,
      unit: 'kg',
      price_per_unit: 750.0,
      frequency: 'weekly',
      latitude: sup2.latitude,
      longitude: sup2.longitude,
      city: sup2.city,
      status: 'active',
      photos: [],
    });

    const list3 = this.material_listings.create({
      id: 'list-003',
      company_id: sup3.id,
      category_id: catWoodOffcuts.id,
      title: 'Potongan Kayu Padat (Offcuts) (Grade B)',
      description: 'Potongan balok kayu sisa industri mebel, kadar air standar 18%.',
      grade_spec: {
        grade: 'B',
        is_dry: true,
        is_clean: false,
        evaluated_reason: 'Kualitas standar dengan volume agregasi memadai',
        co2e_saved_kg: 472.5,
      },
      available_quantity: 450.0,
      initial_quantity: 450.0,
      unit: 'kg',
      price_per_unit: 500.0,
      frequency: 'monthly',
      latitude: sup3.latitude,
      longitude: sup3.longitude,
      city: sup3.city,
      status: 'active',
      photos: [],
    });

    const list4 = this.material_listings.create({
      id: 'list-004',
      company_id: sup1.id,
      category_id: catWoodBark.id,
      title: 'Kulit Kayu & Sisa Sawmill (Grade B)',
      description: 'Ampas kupasan kayu sawmill untuk bahan bakar boiler industri.',
      grade_spec: {
        grade: 'B',
        is_dry: false,
        is_clean: true,
        evaluated_reason: 'Kadar air alami 22%, bebas kontaminasi logam',
        co2e_saved_kg: 522.5,
      },
      available_quantity: 550.0,
      initial_quantity: 550.0,
      unit: 'kg',
      price_per_unit: 350.0,
      frequency: 'weekly',
      latitude: sup1.latitude,
      longitude: sup1.longitude,
      city: 'Bandung',
      status: 'active',
      photos: [],
    });

    const list5 = this.material_listings.create({
      id: 'list-005',
      company_id: sup2.id,
      category_id: catWoodSawdust.id,
      title: 'Serbuk Gergaji Basah Segar Alami (Grade C)',
      description: 'Serbuk kayu basah alami dari potongan kayu segar, kadar air >30%, ideal untuk media baglog budidaya jamur & kompos organik.',
      grade_spec: {
        grade: 'C',
        is_dry: false,
        is_clean: true,
        evaluated_reason: 'Kondisi basah segar alami (>30%), bebas resin & bahan kimia pengawet',
        co2e_saved_kg: 625.0,
      },
      available_quantity: 500.0,
      initial_quantity: 500.0,
      unit: 'kg',
      price_per_unit: 250.0,
      frequency: 'weekly',
      latitude: sup2.latitude,
      longitude: sup2.longitude,
      city: sup2.city,
      status: 'active',
      photos: [],
    });

    const list6 = this.material_listings.create({
      id: 'list-006',
      company_id: sup3.id,
      category_id: catWoodBark.id,
      title: 'Residu Sawmill Basah Alami (Grade C)',
      description: 'Limbah kupasan sawmill basah kadar air 35%, siap olah pupuk kompos organik & media tanam pertanian.',
      grade_spec: {
        grade: 'C',
        is_dry: false,
        is_clean: true,
        evaluated_reason: 'Kadar air tinggi basah (>30%), cocok untuk fermentasi kompos dan biomasa lembap',
        co2e_saved_kg: 380.0,
      },
      available_quantity: 400.0,
      initial_quantity: 400.0,
      unit: 'kg',
      price_per_unit: 180.0,
      frequency: 'monthly',
      latitude: sup3.latitude,
      longitude: sup3.longitude,
      city: sup3.city,
      status: 'active',
      photos: [],
    });

    // 5. Buying Request
    const buyingReq = this.buying_requests.create({
      id: 'req-001',
      buyer_company_id: buyer1.id,
      category_id: catWoodSawdust.id,
      title: 'Dibutuhkan 2.000 kg Serbuk Kayu Jati Grade A untuk Pabrik Briket',
      target_quantity: 2000.0,
      unit: 'ton',
      max_price_per_unit: 12000000.0,
      min_grade_spec: { purity: '95%', max_moisture: '2.0%' },
      delivery_address: buyer1.address,
      delivery_city: buyer1.city,
      latitude: buyer1.latitude,
      longitude: buyer1.longitude,
      status: 'open',
    });

    // 6. Demo Aggregation, Order, and Impact Log
    const demoAgg = this.aggregated_supplies.create({
      id: 'agg-001',
      buying_request_id: buyingReq.id,
      total_matched_quantity: 8.0,
      total_material_cost: 91000000.0,
      platform_fee: 2730000.0,
      total_estimated_price: 93730000.0,
      supplier_count: 2,
      average_distance_km: 42.5,
      status: 'converted_to_order',
    });

    this.aggregated_supply_items.create({
      id: 'agg-item-001',
      aggregated_supply_id: demoAgg.id,
      material_listing_id: list1.id,
      allocated_quantity: 3.5,
      unit_price: 11500000.0,
      subtotal: 40250000.0,
      distance_km: 45.2,
    });

    this.aggregated_supply_items.create({
      id: 'agg-item-002',
      aggregated_supply_id: demoAgg.id,
      material_listing_id: list2.id,
      allocated_quantity: 4.5,
      unit_price: 11000000.0,
      subtotal: 49500000.0,
      distance_km: 39.8,
    });

    const demoOrder = this.orders.create({
      id: 'ord-001',
      aggregated_supply_id: demoAgg.id,
      buying_request_id: buyingReq.id,
      buyer_company_id: buyer1.id,
      total_amount: 93730000.0,
      platform_fee: 2730000.0,
      order_status: 'completed',
    });

    this.order_items.create({
      id: 'ord-item-001',
      order_id: demoOrder.id,
      supplier_company_id: sup1.id,
      material_listing_id: list1.id,
      quantity: 3.5,
      unit_price: 11500000.0,
      subtotal: 40250000.0,
    });

    this.order_items.create({
      id: 'ord-item-002',
      order_id: demoOrder.id,
      supplier_company_id: sup2.id,
      material_listing_id: list2.id,
      quantity: 4.5,
      unit_price: 11000000.0,
      subtotal: 49500000.0,
    });

    this.impact_logs.create({
      id: 'imp-001',
      order_id: demoOrder.id,
      buyer_company_id: buyer1.id,
      category_id: catWoodSawdust.id,
      total_material_reused: 8.0,
      co2_avoided_kg: 14400.0,
      supplier_revenue_earned: 91000000.0,
      buyer_cost_saved: 13650000.0,
    });

    this.verifications.create({
      id: 'ver-001',
      order_id: demoOrder.id,
      verifier_user_id: 'usr-ver-001',
      status: 'passed',
      actual_received_quantity: 8.0,
      quality_notes: 'Material sesuai spesifikasi grade A bening. Kadar air < 1%.',
      inspection_photos: [],
    });
  }
}

// Global singleton instance for Next.js API Routes across invocations
const globalForDb = globalThis;
export const db = globalForDb.bylinkDb || (globalForDb.bylinkDb = new Database());
