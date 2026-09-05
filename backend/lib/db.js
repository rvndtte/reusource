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

    // 2. Demo Companies (Approved)
    const sup1 = this.companies.create({
      id: 'comp-sup-001',
      name: 'UD Kayu Lestari Cimahi (Demo Supplier)',
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

    const buyer1 = this.companies.create({
      id: 'comp-buy-001',
      name: 'PT Biomassa Nusantara Energi (Demo Buyer)',
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

    // 3. Demo Users
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

    // 4. Material Listings (Hanya 1 Data Pasokan Awal)
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
  }
}

// Global singleton instance for Next.js API Routes across invocations
const globalForDb = globalThis;
export const db = globalForDb.bylinkDb || (globalForDb.bylinkDb = new Database());
