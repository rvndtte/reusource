# ReuSource (Reusable Resource) — B2B Industrial Biomass Supply Chain Network

Platform Agregasi Rantai Pasok Limbah Kayu & Biomassa Industri Terdesentralisasi B2B Berbasis Spasial (Spatial Clustering), Standar Mutu Berkelanjutan, dan Pelacakan Jejak Karbon (ESG LCA).

---

## 1. Penjelasan Aplikasi

### 1.1 Latar Belakang
Indonesia menghasilkan lebih dari **2,4 juta ton limbah kayu dan serbuk gergaji per tahun** dari ribuan sentra industri mebel, penggergajian (*sawmill*), dan bengkel kayu mikro (UMKM). Di sisi lain, industri hilir (pabrik briket arang, pelet biomassa, PLTU *co-firing*, dan boiler industri) membutuhkan pasokan biomassa dalam skala masif (**≥ 20–50 ton/bulan**) dengan spesifikasi mutu yang konsisten.

Namun, potensi ekonomi bernilai **Rp 4,8 Triliun** ini terhambat oleh fragmentasi pasokan, biaya logistik titik-ke-titik yang mahal, fluktuasi kadar air (*moisture content*), serta ketiadaan standardisasi kualitas yang transparan.

### 1.2 Konsep Masalah (*Problem Statement*)
1. **Fragmentasi Ekstrem Sisi Pasokan (*Supply Friction*):** Bengkel kayu mikro menghasilkan limbah harian dalam volume kecil (50–300 kg/hari) dan tersebar secara geografis, sehingga tidak ekonomis jika dijemput secara individual oleh industri besar.
2. **Ketiadaan Standardisasi Mutu (*Quality Mismatch*):** Limbah kayu sering tercampur kotoran (tanah, paku, lem, plastik) atau memiliki kadar air tinggi (>30%), yang berisiko merusak mesin pembakar (*boiler/extruder*).
3. **Ketidakpastian Logistik & Perantara Liar (*Middleman Dependency*):** Rantai pasok konvensional dikuasai tengkulak spekulatif, memangkas margin pengrajin kecil hingga 70% tanpa jaminan ketersediaan pasokan bagi pembeli.

### 1.3 Tujuan Aplikasi
**ReuSource** hadir sebagai platform *orchestration & aggregation* dua arah (B2B Two-Sided Network) untuk:
- Mengagregasi sisa limbah kayu dari UMKM ke dalam **kluster logistik terpadu (500–2.000 kg)** menggunakan rute efisien (*Milk-Run Routing System*).
- Menegakkan standarisasi mutu otomatis (*Rule-Based Guided Grading*) Grade A, B, dan C secara transparan tanpa bias.
- Menghubungkan pemasok mikro langsung dengan pembeli industri melalui **Smart Matching Spasial Geodesik (Haversine Distance Algorithm)**.
- Menyediakan pelaporan dampak lingkungan terverifikasi (*Life Cycle Assessment / LCA*) yang mendukung pemenuhan **SDG 8 (Pekerjaan Layak & Pertumbuhan Ekonomi)**, **SDG 12 (Konsumsi & Produksi Bertanggung Jawab)**, dan **SDG 13 (Penanganan Perubahan Iklim)**.

---

## 2. Fitur Utama & Nilai Pembeda (Novelty)

| Fitur Utama | Keunggulan & Nilai Pembeda (*Novelty*) |
|---|---|
| **Dual-Role Onboarding & Geocoding Map** | Pendaftaran fleksibel untuk Pemasok & Pembeli via **WhatsApp OTP** dan **Email/Password**, terintegrasi langsung dengan **Peta Interaktif Leaflet OpenStreetMap** untuk penentuan titik koordinat lokasi bengkel & silo pabrik. |
| **Rule-Based Guided Grading Engine** | Evaluasi kualitas otomatis (*Grade A: Kering ≤15% & Bebas Kontaminasi*, *Grade B: 16–30%*, *Grade C: Lembap*, atau *Ditolak jika <30 kg / kotor*) dengan alasan teknis transparan. |
| **Spatial Haversine Smart Matching** | Algoritma pencocokan pasokan multi-pemasok berbasis radius geospasial real-time yang mengoptimalkan jarak tempuh armada penjemputan logistik terpadu. |
| **Live Milk-Run Logistics & Order Tracking** | Pelacakan pesanan (*Purchase Order*) 4 tahap (*PO Diterbitkan → Logistik Milk-Run → Audit Mutu ISO 27001 Lapangan → Silo Pabrik*) beserta informasi pengemudi dan nomor plat armada. |
| **ESG Impact & Decarbonization Certificate** | Dasbor metrik dampak kuantitatif (*kg material terselamatkan, kg reduksi emisi CO₂e, efisiensi biaya pengadaan, pendapatan mitra UMKM*) beserta sertifikat digital resmi. |
| **Verifier Console (ISO 27001 Standard)** | Panel internal verifikasi dokumen legalitas (NIB/NPWP) dan audit sampel kadar air lapangan sebelum material masuk ke pabrik pembeli. |

---

## 3. Teknologi yang Digunakan

### 3.1 Arsitektur Aplikasi
Aplikasi dibangun dengan arsitektur modern **Fullstack Next.js 15 (App Router)** dalam satu repository monolitik modular (*Single-Repo Architecture*), dirancang untuk performa tinggi, keamanan tipe data, dan *zero-configuration deployment* di platform serverless Vercel.

### 3.2 Tech Stack & Library Spesifik
- **Framework Inti:** [Next.js 15.2.1](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **UI & Reaktivitas:** [React 19.0.0](https://react.dev/) & React DOM
- **Styling:** CSS Modern Vanilla dengan Sistem Variabel Desain Token Industri, Glassmorphism & Micro-animations.
- **Geospasial & Peta:** [Leaflet 1.9.4](https://leafletjs.com/) & OpenStreetMap Tiles dengan Nominatim Forward/Reverse Geocoding.
- **Autentikasi & Keamanan:**
  - Token JWT berbasis standar industri menggunakan library [`jose`](https://github.com/panva/jose) (HMAC SHA-256).
  - Hashing kata sandi satu arah menggunakan [`bcryptjs`](https://github.com/dcodeIO/bcrypt.js).
  - Role-Based Access Control (RBAC) Guard pada 3 peran: `supplier_admin`, `buyer_admin`, dan `admin` / `verifier`.
- **Iconography:** [`lucide-react`](https://lucide.dev/) & Custom SVG 3D Isometric Engine.
- **API Engine:** 22 Route Handlers modular di `src/app/api/v1/...` (RESTful API architecture).

---

## 4. Cara Instalasi (Setup Environment)

Pastikan komputer Anda telah terpasang:
- **Node.js**: Versi 18.18.0 atau lebih baru (Disarankan Node v20.x atau v24.x LTS).
- **NPM**: Versi 9.x atau lebih baru (bawaan Node.js).
- **Git**: Untuk manajemen repository.

### Langkah-Langkah Instalasi:

1. **Clone Repository dari GitHub:**
   ```bash
   git clone https://github.com/rvndtte/reusource.git
   cd reusource
   ```

2. **Instal Dependensi Project:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat berkas `.env` atau salin dari `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *Isi berkas `.env`:*
   ```env
   JWT_SECRET=reusource_super_secret_jwt_key_2026_change_in_production
   NEXT_PUBLIC_API_URL=/api/v1
   ```

---

## 5. Cara Penggunaan (Running Locally)

### 5.1 Menjalankan Mode Development
Jalankan dev server dengan hot-reload:
```bash
npm run dev
```
Buka browser pada alamat: **`http://localhost:3000`**

### 5.2 Menjalankan Mode Produksi (Optimized Build)
Untuk memvalidasi performa dan kompilasi produksi sebelum deploy:
```bash
# 1. Build aplikasi
npm run build

# 2. Jalankan server produksi
npm start
```

### 5.3 Kredensial Akun Demo (Preset Cepat)
Anda dapat langsung mencoba semua peran aplikasi tanpa perlu mendaftar dari awal:

| Peran (*Role*) | Email Akun Demo | Kata Sandi | Akses Portal |
|---|---|---|---|
| **Pemasok (Supplier)** | `test@supplier.com` | `password123` | Portal Setor Stok, Evaluasi Grading, & Monitoring Kluster |
| **Pembeli (Buyer)** | `test@buyer.com` | `password123` | Katalog Pasokan, Permintaan Kebutuhan, & Pelacakan Pesanan Milk-Run |
| **Admin / Verifier** | `admin@bylink.id` | `admin123` | Konsol Verifikasi Akun Legalitas & Laporan Dampak ESG |

---

## 6. Struktur Direktori Project (Modular Monorepo)

```text
ByLink/ (Root Monorepo)
├── frontend/                   # Modul Khusus Frontend & Antarmuka Pengguna
│   ├── components/             # Komponen UI Reusable (Header, Hero, Peta Leaflet, Stepper)
│   │   ├── Header.jsx          # Navbar adaptif berbasis RBAC
│   │   ├── HeroSection.jsx     # Visual isometrik & Call-to-Actions
│   │   ├── AuthPage.jsx        # Dual-mode Auth (WhatsApp OTP & Email)
│   │   ├── LocationPickerMap.jsx # Peta Leaflet & reverse geocoding OSM
│   │   ├── SupplierDashboard.jsx # Form guided grading & setor stok
│   │   ├── BuyerKatalog.jsx    # Katalog pasokan agregasi live
│   │   ├── BuyerPermintaan.jsx # Form pencocokan permintaan rutin
│   │   ├── BuyerOrders.jsx     # Monitoring pesanan & sertifikat ESG
│   │   ├── AdminVerifikasi.jsx # Konsol verifikasi akun & audit fisik
│   │   └── FactsAndImpact.jsx  # Visualisasi dampak SDG 8, 12, dan 13
│   ├── context/
│   │   └── AuthContext.jsx     # Global JWT authentication provider
│   ├── services/
│   │   └── api.js              # Client SDK terpusat untuk interaksi API
│   ├── config/
│   │   └── businessRules.js    # Aturan bisnis grading, harga acuan, & faktor emisi
│   └── styles/
│       ├── globals.css         # Industrial design system CSS tokens
│       └── index.css           # Styling dasar & utilitas komponen
├── backend/                    # Modul Khusus Logika Bisnis & Database Server
│   ├── lib/
│   │   ├── auth.js             # JWT token generator & RBAC middleware
│   │   ├── db.js               # In-memory relational database & seed data
│   │   ├── impactEngine.js     # Engine kalkulasi dampak emisi karbon LCA
│   │   ├── matchingEngine.js   # Algoritma pencocokan jarak spasial Haversine
│   │   └── otpStore.js         # Pengelola kode OTP WhatsApp & rate limit
├── src/
│   └── app/                    # Next.js 15 Fullstack Entry Points
│       ├── api/v1/             # 22 REST API Route Handlers (Serverless)
│       │   ├── auth/           # Login, Register, Request OTP, Verify OTP
│       │   ├── material-listings/ # Setor Stok, Kluster, My Listings
│       │   ├── buying-requests/   # Form Kebutuhan Permintaan Buyer
│       │   ├── smart-matching/    # Spatial Haversine Aggregation
│       │   ├── orders/            # PO Creation & Live Status Stepper
│       │   ├── verifications/     # Admin Verification & Audit
│       │   └── impact/            # ESG CO2e Analytics Engine
│       ├── layout.jsx          # Root layout & Leaflet stylesheet CDN
│       ├── page.jsx            # Dynamic Landing Page & Role Gateway
│       └── globals.css
├── public/                     # Aset statis (ikon, visual edukasi, favicon)
├── jsconfig.json               # Path alias monorepo (@/frontend, @/backend)
├── vercel.json                 # Konfigurasi deployment serverless Vercel
├── package.json                # Dependensi dan scripts
└── README.md                   # Dokumentasi teknis resmi project
```

---

## 7. Kontribusi & Lisensi
Dikembangkan untuk kompetisi inovasi teknologi rantai pasok industri hijau dan ekonomi sirkular terdesentralisasi di Indonesia.
