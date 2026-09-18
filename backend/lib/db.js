import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

// Pre-hashed bcrypt for 'password123' and 'wa_otp_secure_login'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

const CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_PRISMA_URL;

if (!CONNECTION_STRING) {
  throw new Error(
    'No Postgres connection string found. Set DATABASE_URL (or POSTGRES_URL) in your environment / Vercel project storage settings.'
  );
}

const sql = neon(CONNECTION_STRING);

const TABLE_NAMES = [
  'categories',
  'companies',
  'users',
  'material_listings',
  'buying_requests',
  'aggregated_supplies',
  'aggregated_supply_items',
  'orders',
  'order_items',
  'verifications',
  'impact_logs',
];

function generateId() {
  return crypto.randomUUID();
}

// Postgres identifiers can't be parameterized, so this guards table() against
// ever being called with anything other than one of our own fixed table names.
function assertKnownTable(name) {
  if (!TABLE_NAMES.includes(name)) {
    throw new Error(`Unknown table: ${name}`);
  }
}

function pgTable(tableName) {
  assertKnownTable(tableName);

  return {
    async find(predicate = () => true) {
      const rows = await sql.query(`SELECT data FROM ${tableName}`);
      return rows.map((r) => ({ ...r.data })).filter(predicate);
    },
    async findById(id) {
      const rows = await sql.query(`SELECT data FROM ${tableName} WHERE id = $1`, [id]);
      return rows.length > 0 ? { ...rows[0].data } : null;
    },
    async findOne(predicate) {
      const rows = await sql.query(`SELECT data FROM ${tableName}`);
      const match = rows.map((r) => r.data).find(predicate);
      return match ? { ...match } : null;
    },
    async create(data) {
      const id = data.id || generateId();
      const now = new Date().toISOString();
      const record = {
        ...data,
        id,
        created_at: data.created_at || now,
        updated_at: data.updated_at || now,
      };
      await sql.query(
        `INSERT INTO ${tableName} (id, data) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
        [id, JSON.stringify(record)]
      );
      return { ...record };
    },
    async update(id, updates) {
      const rows = await sql.query(`SELECT data FROM ${tableName} WHERE id = $1`, [id]);
      if (rows.length === 0) return null;
      const updated = {
        ...rows[0].data,
        ...updates,
        updated_at: new Date().toISOString(),
      };
      await sql.query(`UPDATE ${tableName} SET data = $2 WHERE id = $1`, [id, JSON.stringify(updated)]);
      return { ...updated };
    },
    async delete(id) {
      const rows = await sql.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING id`, [id]);
      return rows.length > 0;
    },
    async clear() {
      await sql.query(`DELETE FROM ${tableName}`);
    },
    async count(predicate = () => true) {
      if (predicate.length === 0 && predicate.toString().includes('=> true')) {
        const rows = await sql.query(`SELECT COUNT(*)::int AS n FROM ${tableName}`);
        return rows[0]?.n || 0;
      }
      const rows = await sql.query(`SELECT data FROM ${tableName}`);
      return rows.map((r) => r.data).filter(predicate).length;
    },
    async getAll() {
      const rows = await sql.query(`SELECT data FROM ${tableName}`);
      return rows.map((r) => ({ ...r.data }));
    },
  };
}

class Database {
  constructor() {
    this.categories = pgTable('categories');
    this.companies = pgTable('companies');
    this.users = pgTable('users');
    this.material_listings = pgTable('material_listings');
    this.buying_requests = pgTable('buying_requests');
    this.aggregated_supplies = pgTable('aggregated_supplies');
    this.aggregated_supply_items = pgTable('aggregated_supply_items');
    this.orders = pgTable('orders');
    this.order_items = pgTable('order_items');
    this.verifications = pgTable('verifications');
    this.impact_logs = pgTable('impact_logs');

    this._readyPromise = null;
  }

  // Called (and awaited) at the top of every API route before any db.<table>
  // call, so the schema/seed exists before the first real query runs -
  // memoized per warm serverless instance so it's a no-op after the first hit.
  async ready() {
    if (!this._readyPromise) {
      this._readyPromise = this._ensureSchemaAndSeed();
    }
    return this._readyPromise;
  }

  async _ensureSchemaAndSeed() {
    for (const table of TABLE_NAMES) {
      await sql.query(
        `CREATE TABLE IF NOT EXISTS ${table} (id TEXT PRIMARY KEY, data JSONB NOT NULL)`
      );
    }

    const companyCount = await this.companies.count();
    if (companyCount === 0) {
      await this.seedInitialData();
      return;
    }

    // Auto-upgrade missing essential test accounts/requests (kept from the
    // previous file-backed store so already-seeded environments stay in sync).
    if (!(await this.users.findById('usr-demo-verifier'))) {
      await this.users.create({
        id: 'usr-demo-verifier',
        email: 'verifier@reusource.id',
        password_hash: DEMO_PASSWORD_HASH,
        full_name: 'Audit Verifikator Lapangan',
        phone: '081122334455',
        role: 'verifier',
        company_id: 'comp-sup-cimahi',
        is_active: true,
      });
    }
    if (!(await this.buying_requests.findById('req-001'))) {
      await this.buying_requests.create({
        id: 'req-001',
        buyer_company_id: 'comp-buy-nusantara',
        category_id: 'cat-wood-001',
        target_quantity: 500.0,
        fulfilled_quantity: 0.0,
        unit: 'kg',
        max_price_per_unit: 1000.0,
        delivery_address: 'Kawasan Industri GIIC Cikarang',
        latitude: -6.3005,
        longitude: 107.169,
        required_grade: 'A',
        status: 'open',
      });
    }
  }

  async seedInitialData() {
    // 1. Biomass & Wood Categories
    const catWoodSawdust = await this.categories.create({
      id: 'cat-wood-001',
      name: 'Serbuk Serutan Kayu Jati',
      description: 'Biomassa serbuk gergaji dan serutan kayu jati industri mebel',
      default_unit: 'kg',
      target_industry: 'Wood Pellet, Briket, Boiler Co-firing',
    });

    await this.categories.create({
      id: 'cat-wood-002',
      name: 'Wood Chips / Serpihan Kayu',
      description: 'Serpihan kayu sengon & mahoni untuk boiler dan pulp',
      default_unit: 'kg',
      target_industry: 'Boiler Pembangkit Listrik Biomassa',
    });

    // 2. Companies
    // 2.1 Pemasok 1: Cimahi, Jawa Barat (650 kg Grade A)
    const sup1 = await this.companies.create({
      id: 'comp-sup-cimahi',
      name: 'UD Kayu Lestari Cimahi',
      company_type: 'umkm_supplier',
      phone: '081234567891',
      address: 'Sentra Bengkel Mebel Cimahi',
      city: 'Cimahi',
      province: 'Jawa Barat',
      latitude: -6.8722,
      longitude: 107.5422,
      verification_status: 'approved',
      verification_notes: 'Bengkel binaan sentra kayu Cimahi, verified ISO 27001',
    });

    // 2.2 Pemasok 2: Banda Neira, Maluku (120 kg Grade A)
    const sup2 = await this.companies.create({
      id: 'comp-sup-banda',
      name: 'UD Banda Biomassa Neira',
      company_type: 'umkm_supplier',
      phone: '081298765432',
      address: 'Kawasan Pesisir Banda Neira',
      city: 'Banda Neira',
      province: 'Maluku',
      latitude: -4.5262,
      longitude: 129.9042,
      verification_status: 'approved',
      verification_notes: 'Sentra olah kayu pulau Banda, verified ISO 27001',
    });

    // 2.3 Pembeli Industri: Cikarang / Bekasi
    const buyer1 = await this.companies.create({
      id: 'comp-buy-nusantara',
      name: 'PT Biomassa Nusantara Energi',
      company_type: 'enterprise_buyer',
      phone: '081234567892',
      address: 'Kawasan Industri GIIC Cikarang',
      city: 'Bekasi',
      province: 'Jawa Barat',
      latitude: -6.3005,
      longitude: 107.169,
      verification_status: 'approved',
    });

    // 3. User Accounts (Pre-hashed bcrypt)
    await this.users.create({
      id: 'usr-demo-admin',
      email: 'admin@bylink.id',
      password_hash: bcrypt.hashSync('admin123', 10),
      full_name: 'Super Admin Verifier',
      phone: '081199887766',
      role: 'admin',
      company_id: sup1.id,
      is_active: true,
    });

    await this.users.create({
      id: 'usr-demo-verifier',
      email: 'verifier@reusource.id',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Audit Verifikator Lapangan',
      phone: '081122334455',
      role: 'verifier',
      company_id: sup1.id,
      is_active: true,
    });

    await this.users.create({
      id: 'usr-demo-sup',
      email: 'test@supplier.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Budi Santoso (Supplier Cimahi)',
      phone: '081234567891',
      role: 'supplier_admin',
      company_id: sup1.id,
      is_active: true,
    });

    await this.users.create({
      id: 'usr-demo-sup2',
      email: 'supplier.banda@reusource.id',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Hasan Banda (Supplier Neira)',
      phone: '081298765432',
      role: 'supplier_admin',
      company_id: sup2.id,
      is_active: true,
    });

    await this.users.create({
      id: 'usr-demo-buy',
      email: 'test@buyer.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Sarah Wijaya (Buyer Pabrik)',
      phone: '081234567892',
      role: 'buyer_admin',
      company_id: buyer1.id,
      is_active: true,
    });

    // 4. Initial Buying Request for Smart Matching
    await this.buying_requests.create({
      id: 'req-001',
      buyer_company_id: buyer1.id,
      category_id: catWoodSawdust.id,
      target_quantity: 500.0,
      fulfilled_quantity: 0.0,
      unit: 'kg',
      max_price_per_unit: 1000.0,
      delivery_address: buyer1.address,
      latitude: buyer1.latitude,
      longitude: buyer1.longitude,
      required_grade: 'A',
      status: 'open',
    });

    // 5. Material Listings (2 Supplier Serbuk Serutan Jati Grade A)
    await this.material_listings.create({
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

    await this.material_listings.create({
      id: 'list-002',
      company_id: sup2.id,
      category_id: catWoodSawdust.id,
      title: 'Serbuk Serutan Kayu Jati Banda (Grade A)',
      description: 'Serbuk kayu jati alami kering pulau Banda Neira, kadar air 13.5%, siap olah briket/pelet.',
      grade_spec: {
        grade: 'A',
        is_dry: true,
        is_clean: true,
        evaluated_reason: 'Kering alami, murni serat jati, volume >= 100 kg',
        co2e_saved_kg: 150.0,
      },
      available_quantity: 120.0,
      initial_quantity: 120.0,
      unit: 'kg',
      price_per_unit: 750.0,
      frequency: 'weekly',
      latitude: sup2.latitude,
      longitude: sup2.longitude,
      city: sup2.city,
      status: 'active',
      photos: [],
    });
  }
}

// Global singleton per warm serverless instance (or per dev-server process).
const globalForDb = globalThis;
export const db = globalForDb.bylinkDb || (globalForDb.bylinkDb = new Database());
