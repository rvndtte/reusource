import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { normalizePhone } from './phone.js';

// Pre-hashed bcrypt for 'password123' and 'wa_otp_secure_login'
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);
const WA_OTP_PASSWORD_HASH = bcrypt.hashSync('wa_otp_secure_login', 10);

const DB_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'reusource_db_store.json')
  : path.join(process.cwd(), '.db_storage.json');

function generateId() {
  return crypto.randomUUID();
}

function createTable(onMutate = () => {}) {
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
      onMutate();
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
      onMutate();
      return { ...updated };
    },
    delete: (id) => {
      const res = items.delete(id);
      onMutate();
      return res;
    },
    clear: () => {
      items.clear();
      onMutate();
    },
    count: (predicate = () => true) => {
      let count = 0;
      for (const item of items.values()) {
        if (predicate(item)) count++;
      }
      return count;
    },
    loadAll: (arrayData) => {
      items.clear();
      if (Array.isArray(arrayData)) {
        for (const item of arrayData) {
          if (item && item.id) {
            items.set(item.id, { ...item });
          }
        }
      }
    },
    getAll: () => {
      return Array.from(items.values());
    },
    rawMap: items,
  };
}

class Database {
  constructor() {
    const notifyMutation = () => this.saveToFile();

    this.categories = createTable(notifyMutation);
    this.companies = createTable(notifyMutation);
    this.users = createTable(notifyMutation);
    this.material_listings = createTable(notifyMutation);
    this.buying_requests = createTable(notifyMutation);
    this.aggregated_supplies = createTable(notifyMutation);
    this.aggregated_supply_items = createTable(notifyMutation);
    this.orders = createTable(notifyMutation);
    this.order_items = createTable(notifyMutation);
    this.verifications = createTable(notifyMutation);
    this.impact_logs = createTable(notifyMutation);

    const loaded = this.loadFromFile();
    if (!loaded || this.companies.count() === 0) {
      this.seedInitialData();
      this.saveToFile();
    }
  }

  saveToFile() {
    try {
      const snapshot = {
        categories: this.categories.getAll(),
        companies: this.companies.getAll(),
        users: this.users.getAll(),
        material_listings: this.material_listings.getAll(),
        buying_requests: this.buying_requests.getAll(),
        aggregated_supplies: this.aggregated_supplies.getAll(),
        aggregated_supply_items: this.aggregated_supply_items.getAll(),
        orders: this.orders.getAll(),
        order_items: this.order_items.getAll(),
        verifications: this.verifications.getAll(),
        impact_logs: this.impact_logs.getAll(),
        saved_at: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(snapshot, null, 2), 'utf-8');
    } catch (err) {
      // Non-fatal if filesystem is readonly in certain cloud environments
      console.warn('Could not persist database to disk:', err.message);
    }
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data && data.companies && data.companies.length > 0) {
          this.categories.loadAll(data.categories);
          this.companies.loadAll(data.companies);
          this.users.loadAll(data.users);
          this.material_listings.loadAll(data.material_listings);
          this.buying_requests.loadAll(data.buying_requests);
          this.aggregated_supplies.loadAll(data.aggregated_supplies);
          this.aggregated_supply_items.loadAll(data.aggregated_supply_items);
          this.orders.loadAll(data.orders);
          this.order_items.loadAll(data.order_items);
          this.verifications.loadAll(data.verifications);
          this.impact_logs.loadAll(data.impact_logs);
          return true;
        }
      }
    } catch (err) {
      console.warn('Could not load database from disk:', err.message);
    }
    return false;
  }

  seedInitialData() {
    // 1. Biomass & Wood Categories
    const catWoodSawdust = this.categories.create({
      id: 'cat-wood-001',
      name: 'Serbuk Serutan Kayu Jati',
      description: 'Biomassa serbuk gergaji dan serutan kayu jati industri mebel',
      default_unit: 'kg',
      target_industry: 'Wood Pellet, Briket, Boiler Co-firing',
    });

    this.categories.create({
      id: 'cat-wood-002',
      name: 'Wood Chips / Serpihan Kayu',
      description: 'Serpihan kayu sengon & mahoni untuk boiler dan pulp',
      default_unit: 'kg',
      target_industry: 'Boiler Pembangkit Listrik Biomassa',
    });

    // 2. Companies
    // 2.1 Pemasok 1: Cimahi, Jawa Barat (650 kg Grade A)
    const sup1 = this.companies.create({
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
    const sup2 = this.companies.create({
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

    // 2.3 Pemasok 3: UD Freeport (Timika, 089876543)
    const supFreeport = this.companies.create({
      id: 'comp-sup-freeport',
      name: 'UD Freeport',
      company_type: 'umkm_supplier',
      phone: '089876543',
      address: 'Jl. Poros Timika - Tembagapura',
      city: 'Timika',
      province: 'Papua Tengah',
      latitude: -4.5468,
      longitude: 136.8837,
      verification_status: 'pending_verification',
      verification_notes: 'Menunggu peninjauan NIB dan verifikasi lapangan verifikator ISO 27001',
    });

    // 2.4 Pembeli Industri: Cikarang / Bekasi
    const buyer1 = this.companies.create({
      id: 'comp-buy-nusantara',
      name: 'PT Biomassa Nusantara Energi',
      company_type: 'enterprise_buyer',
      phone: '081234567892',
      address: 'Kawasan Industri GIIC Cikarang',
      city: 'Bekasi',
      province: 'Jawa Barat',
      latitude: -6.3005,
      longitude: 107.1690,
      verification_status: 'approved',
    });

    // 3. User Accounts (Pre-hashed bcrypt)
    this.users.create({
      id: 'usr-demo-admin',
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
      full_name: 'Budi Santoso (Supplier Cimahi)',
      phone: '081234567891',
      role: 'supplier_admin',
      company_id: sup1.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-demo-sup2',
      email: 'supplier.banda@reusource.id',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Hasan Banda (Supplier Neira)',
      phone: '081298765432',
      role: 'supplier_admin',
      company_id: sup2.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-freeport',
      email: 'freeport@supplier.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Pemasok UD Freeport',
      phone: '089876543',
      role: 'supplier_admin',
      company_id: supFreeport.id,
      is_active: true,
    });

    this.users.create({
      id: 'usr-demo-buy',
      email: 'test@buyer.com',
      password_hash: DEMO_PASSWORD_HASH,
      full_name: 'Sarah Wijaya (Buyer Pabrik)',
      phone: '081234567892',
      role: 'buyer_admin',
      company_id: buyer1.id,
      is_active: true,
    });

    // 4. Material Listings (2 Supplier Serbuk Serutan Jati Grade A)
    this.material_listings.create({
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

    this.material_listings.create({
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

// Global singleton instance for Next.js API Routes across invocations
const globalForDb = globalThis;
export const db = globalForDb.bylinkDb || (globalForDb.bylinkDb = new Database());
