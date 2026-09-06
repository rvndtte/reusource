<div align="center">

<img src="https://img.shields.io/badge/Next.js-15.2.1-black?style=for-the-badge&logo=next.js&logoColor=white"/>
<img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white"/>
<img src="https://img.shields.io/badge/SDG-8%20%7C%2012%20%7C%2013-green?style=for-the-badge"/>
<img src="https://img.shields.io/badge/License-Educational-blue?style=for-the-badge"/>

</div>

<br/>

<div align="center">
  <h1>🌿 ReuSource — B2B Industrial Biomass Supply Chain Network</h1>
  <p><strong>Platform Agregasi Rantai Pasok Limbah Kayu & Biomassa Industri Berbasis Spasial</strong></p>
  <p><em>Menghubungkan Bengkel Kayu UMKM Lokal → Kluster Logistik Terpadu → Pabrik Industri Pembeli</em></p>
  <br/>
  <a href="https://reusource.vercel.app"><strong>🔗 Demo Langsung (Live Demo)</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/rvndtte/reusource"><strong>📦 Repository</strong></a>
</div>

---

## 📋 Daftar Isi

1. [Penjelasan Aplikasi](#1-penjelasan-aplikasi)
2. [Fitur Utama & Nilai Pembeda](#2-fitur-utama--nilai-pembeda-novelty)
3. [Teknologi yang Digunakan](#3-teknologi-yang-digunakan)
4. [Cara Instalasi](#4-cara-instalasi-setup-environment)
5. [Cara Penggunaan](#5-cara-penggunaan-running-locally)
6. [Struktur Direktori](#6-struktur-direktori-project)
7. [Akun Demo](#7-akun-demo)
8. [Tangkapan Layar](#8-tangkapan-layar)
9. [Alignment SDG & Dampak Sosial](#9-alignment-sdg--dampak-sosial)
10. [Kontribusi & Lisensi](#10-kontribusi--lisensi)

---

## 1. Penjelasan Aplikasi

### 1.1 Latar Belakang

Indonesia menghasilkan lebih dari **2,4 juta ton limbah kayu dan serbuk gergaji per tahun** dari ribuan sentra industri mebel, penggergajian (*sawmill*), dan bengkel kayu mikro (UMKM). Data terbaru tahun 2024 menunjukkan bahwa total produksi kayu bulat nasional mencapai **64,84 juta meter kubik**, di mana **40–50%** dari proses produksi berakhir menjadi limbah serbuk dan potongan kayu yang belum dimanfaatkan secara optimal.

Di sisi lain, industri hilir — pabrik briket arang, pelet biomassa, PLTU *co-firing*, dan boiler industri — membutuhkan pasokan biomassa dalam skala masif (**≥ 20–50 ton/bulan**) dengan spesifikasi mutu yang konsisten. Indonesia bahkan menargetkan konsumsi biomassa untuk pembangkit listrik mencapai **2,83 juta metrik ton pada tahun 2024**, hampir tiga kali lipat dari tahun sebelumnya (991.000 ton pada 2023).

Namun, potensi ekonomi bernilai **Rp 4,8 Triliun** ini terhambat oleh fragmentasi pasokan, biaya logistik titik-ke-titik yang mahal, fluktuasi kadar air (*moisture content*), serta ketiadaan standardisasi kualitas yang transparan.

> **Fakta Kritis:** Serbuk kayu mengandung nilai kalor sekitar **18.850 kalori/kg**, tetapi mayoritas UMKM masih membakarnya langsung atau menumpuknya begitu saja, menimbulkan risiko kebakaran spontan (*spontaneous combustion*) dan emisi gas rumah kaca tanpa manfaat ekonomi apapun.

---

### 1.2 Konsep Masalah (*Problem Statement*)

```
💥 SUPPLY SIDE                          💥 DEMAND SIDE
─────────────────────────               ─────────────────────────
Bengkel UMKM A: 80 kg/hari      ≠       Pabrik Briket: 5 ton/minggu
Bengkel UMKM B: 120 kg/hari     ≠       PLTU Co-Firing: 20 ton/bulan
Bengkel UMKM C: 200 kg/hari     ≠       Boiler Industri: 15 ton/bulan

→ Tidak pernah ketemu karena volume terlalu kecil, kualitas tidak standar,
  biaya logistik tidak efisien, dan tidak ada platform penghubung.
```

| # | Masalah Utama | Dampak Negatif |
|---|---|---|
| **1** | **Fragmentasi Ekstrem Sisi Pasokan** — Bengkel kayu mikro menghasilkan limbah harian 50–300 kg dan tersebar secara geografis | Tidak ekonomis dijemput individual oleh industri besar |
| **2** | **Ketiadaan Standardisasi Mutu** — Limbah sering tercampur kotoran atau kadar air tinggi (>30%) | Merusak mesin boiler/ekstruder pabrik pembeli |
| **3** | **Ketergantungan Perantara Liar** — Tengkulak spekulatif memangkas margin pengrajin kecil hingga 70% | Tanpa jaminan ketersediaan pasokan bagi pembeli |
| **4** | **Risiko Lingkungan** — Tumpukan serbuk kayu basah memicu oksidasi internal (*spontaneous combustion*) | Kebakaran bengkel & emisi metana liar |

---

### 1.3 Tujuan Aplikasi

**ReuSource** hadir sebagai platform *orchestration & aggregation* dua arah (B2B Two-Sided Network) untuk:

- 🔗 **Agregasi Multi-Pemasok** — Mengumpulkan sisa limbah kayu dari puluhan UMKM bengkel ke dalam **kluster logistik terpadu (500–2.000 kg)** menggunakan rute efisien *Milk-Run Routing System*.
- ✅ **Standardisasi Mutu Otomatis** — Menegakkan evaluasi kualitas berbasis aturan (*Rule-Based Guided Grading*) Grade A, B, dan C secara transparan.
- 📍 **Smart Matching Spasial** — Menghubungkan pemasok mikro langsung dengan pembeli industri melalui **Algoritma Haversine Geodesik** berbasis radius nyata.
- 🌱 **Pelaporan Dampak ESG** — Menyediakan sertifikat digital pengurangan emisi CO₂e yang terverifikasi, mendukung SDG 8, 12, dan 13.
- 🔒 **Verifikasi Legalitas ISO 27001** — Panel admin internal untuk validasi NIB/NPWP dan audit lapangan sebelum transaksi.

---

## 2. Fitur Utama & Nilai Pembeda (*Novelty*)

| Fitur | Deskripsi | Keunggulan Kompetitif |
|---|---|---|
| **🗺️ Dual-Role Onboarding + Geocoding** | Pendaftaran via **WhatsApp OTP** atau **Email/Password**, langsung terintegrasi peta interaktif Leaflet OSM | Tidak perlu install app — cukup WhatsApp, koordinat lokasi bengkel/pabrik langsung akurat |
| **⚖️ Guided Grading Engine** | Evaluasi otomatis Grade A (kering ≤15%, bersih), B (16–30%), C (lembap >30%), atau Tolak | Standar berbasis SNI 8021:2014 & ISO 17225-2 — tidak bisa dimanipulasi pemasok |
| **📡 Spatial Haversine Matching** | Radius slider real-time (10 km – 3.000 km) menghitung jarak geodesik ke semua pemasok | Pembeli bisa filter pasokan secara geografis — logistik efisien, biaya transparan |
| **🚛 Live Milk-Run Order Tracking** | Pelacakan 4 tahap: PO Diterbitkan → Logistik → Audit Mutu Lapangan → Silo Pabrik | Eliminasi ketidakpastian pengiriman — pembeli tahu status real-time |
| **📊 ESG Certificate & CO₂e Dashboard** | Sertifikat digital pengurangan emisi per transaksi + dasbor dampak kuantitatif | Pembeli industri mendapat bukti audit jejak karbon untuk pelaporan ESG |
| **🛡️ Verifier Console (ISO 27001)** | Panel admin internal untuk verifikasi dokumen legalitas NIB/NPWP sebelum akses penuh | Ekosistem B2B terverifikasi, tidak ada aktor anonim |
| **🔐 Persistent Auth + RBAC** | Sesi login tersimpan permanen di browser — pengguna tetap masuk tanpa re-login | UX bersih: halaman awal hanya muncul saat logout eksplisit |
| **⚙️ Profil & Akun Terkelola** | Supplier dan Buyer dapat lihat & edit data akun (NIB, NPWP, PIC, Koordinat) | Self-service tanpa perlu kontak admin untuk update data |

---

## 3. Teknologi yang Digunakan

### 3.1 Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                      │
│                  (Serverless Deployment)                    │
├─────────────────┬───────────────────────────────────────────┤
│   FRONTEND      │               BACKEND (API Routes)        │
│  ─────────────  │  ────────────────────────────────────     │
│  React 19       │  Next.js 15 App Router (22 Endpoints)     │
│  Vanilla CSS    │  JWT Auth (HMAC-SHA256 via jose)           │
│  Leaflet OSM    │  Password Hashing (bcryptjs)               │
│  Context API    │  Haversine Matching Engine                 │
│  localStorage   │  ESG LCA CO₂e Calculator                  │
│  (Persist Auth) │  In-Memory DB + /tmp Disk Persistence      │
└─────────────────┴───────────────────────────────────────────┘
```

### 3.2 Tech Stack Lengkap

| Kategori | Teknologi | Versi | Fungsi Spesifik |
|---|---|---|---|
| **Framework Inti** | [Next.js](https://nextjs.org/) | 15.2.1 | App Router, Server Components, API Route Handlers |
| **UI Library** | [React](https://react.dev/) | 19.0.0 | Reactive UI, Context API, Portal |
| **Styling** | Vanilla CSS | — | CSS Custom Properties, Glassmorphism, Micro-animations |
| **Peta & Geospasial** | [Leaflet](https://leafletjs.com/) | 1.9.4 | Peta interaktif OpenStreetMap, Nominatim reverse geocoding |
| **Autentikasi JWT** | [jose](https://github.com/panva/jose) | 5.9.6 | Token signing & verification HMAC-SHA256 |
| **Password Hashing** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4.3 | One-way password hash & compare |
| **Icons** | [lucide-react](https://lucide.dev/) | 1.38.0 | Iconografi UI modern |
| **Custom Icons** | SVG 3D Isometric | — | Engine isometrik custom untuk visual peta & HeroSection |
| **Deployment** | [Vercel](https://vercel.com/) | — | Serverless edge deployment, CI/CD otomatis |
| **Standar Keamanan** | ISO 27001 | — | Role-Based Access Control, verifikasi dokumen legalitas |

### 3.3 API Endpoints (22 Route Handlers)

```
src/app/api/v1/
├── auth/
│   ├── login                    # POST  Email/password login
│   ├── register                 # POST  Email registration
│   ├── request-otp              # POST  Kirim OTP ke WhatsApp (simulasi)
│   ├── verify-otp-login         # POST  Verifikasi OTP untuk login
│   ├── verify-otp-register      # POST  Verifikasi OTP untuk registrasi baru
│   └── me                       # GET/PUT Profil & update data akun
├── material-listings/
│   ├── (route)                  # GET   Katalog pasokan aktif (filter radius)
│   ├── setor-stok               # POST  Supplier setor stok limbah kayu
│   ├── cluster-progress         # GET   Progress kluster wilayah supplier
│   └── my-listings              # GET   Stok saya (riwayat setor)
├── buying-requests/
│   ├── (route)                  # POST  Submit request permintaan buyer
│   └── my-requests              # GET   Riwayat request buyer
├── orders/
│   ├── (route)                  # POST/GET  Buat & lihat pesanan
│   ├── [id]                     # GET   Detail pesanan
│   └── [id]/status              # PATCH Update status pesanan
├── smart-matching/
│   └── request/[id]             # GET   Hasil match spatial Haversine
├── verifications/
│   ├── pending-accounts         # GET   Daftar akun menunggu verifikasi admin
│   ├── accounts/[id]/verify     # POST  Approve/reject akun (admin only)
│   └── order/[id]               # POST  Verifikasi tahap pesanan
└── impact/
    └── dashboard                # GET   Dasbor dampak ESG & CO₂e
```

---

## 4. Cara Instalasi (Setup Environment)

### Prasyarat Sistem

| Prasyarat | Versi Minimum | Versi Disarankan |
|---|---|---|
| **Node.js** | 18.18.0 | v20.x LTS atau v22.x LTS |
| **npm** | 9.x | Bawaan Node.js |
| **Git** | 2.x | Versi terbaru |

### Langkah-Langkah Instalasi

**1. Clone Repository**
```bash
git clone https://github.com/rvndtte/reusource.git
cd reusource
```

**2. Install Dependensi**
```bash
npm install
```

> ⏱️ Proses instalasi membutuhkan sekitar 30–60 detik. Pastikan tidak ada error merah setelah selesai.

**3. Konfigurasi Environment Variables**

Buat berkas `.env` di root project:
```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit isi berkas `.env`:
```env
# JWT Secret — Ganti dengan string acak panjang di production
JWT_SECRET=reusource_super_secret_jwt_key_2026_change_in_production

# Base URL API (tidak perlu diubah untuk development lokal)
NEXT_PUBLIC_API_URL=/api/v1
```

> **⚠️ Penting:** Nilai `JWT_SECRET` harus diganti sebelum deployment production. Generate string aman dengan:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 5. Cara Penggunaan (Running Locally)

### 5.1 Mode Development (Hot-Reload)

```bash
npm run dev
```

Buka browser pada: **`http://localhost:3000`**

### 5.2 Build & Validasi Produksi

```bash
# Build optimasi produksi (22 route akan dikompilasi)
npm run build

# Jalankan server produksi setelah build berhasil
npm start
```

Output build yang sukses:

```
✓ Compiled successfully in 4.4s
✓ Generating static pages (22/22)

Route (app)                    Size    First Load JS
┌ ○ /                          48.6 kB  151 kB
└ ƒ /api/v1/...                177 B   103 kB each
```

### 5.3 Linting

```bash
npm run lint
```

---

## 6. Struktur Direktori Project

```text
ByLink/                          ← Root Monorepo
│
├── src/                         ← Next.js 15 Fullstack Entry Points
│   ├── app/
│   │   ├── api/v1/              ← 22 REST API Route Handlers (Serverless)
│   │   │   ├── auth/            ← Login, Register, OTP, Me (GET/PUT)
│   │   │   ├── material-listings/ ← Setor Stok, Kluster, Katalog
│   │   │   ├── buying-requests/ ← Request Permintaan Buyer
│   │   │   ├── smart-matching/  ← Haversine Spatial Aggregation
│   │   │   ├── orders/          ← PO Creation & Live Status Stepper
│   │   │   ├── verifications/   ← Admin Verification & Audit
│   │   │   └── impact/          ← ESG CO₂e Analytics Dashboard
│   │   ├── layout.jsx           ← Root layout & Leaflet stylesheet CDN
│   │   ├── page.jsx             ← Dynamic Landing Page & Role Gateway
│   │   └── globals.css
│   ├── components/              ← Komponen UI Utama
│   │   ├── Header.jsx           ← Navbar adaptif berbasis RBAC (3 role)
│   │   ├── HeroSection.jsx      ← Visual isometrik SVG & dual CTA
│   │   ├── AuthPage.jsx         ← Dual-mode Auth (WhatsApp OTP & Email)
│   │   ├── SupplierDashboard.jsx← Setor stok, grading, kluster monitoring
│   │   ├── BuyerKatalog.jsx     ← Katalog + Haversine radius filter
│   │   ├── BuyerPermintaan.jsx  ← Form kebutuhan & smart matching
│   │   ├── BuyerOrders.jsx      ← Order tracking 4-step + ESG cert
│   │   ├── AdminVerifikasi.jsx  ← Console verifikasi akun & audit
│   │   ├── AccountProfileModal.jsx ← Edit profil supplier & buyer
│   │   ├── ProtectedRoute.jsx   ← RBAC guard + pending verification gate
│   │   └── LocationPickerMap.jsx← Peta Leaflet & Nominatim geocoding
│   ├── context/
│   │   └── AuthContext.jsx      ← JWT auth provider + localStorage persist
│   ├── services/
│   │   └── api.js               ← Client SDK terpusat untuk interaksi API
│   └── lib/
│       └── phone.js             ← Normalisasi format nomor WhatsApp
│
├── frontend/                    ← Modul Frontend & Antarmuka Pengguna
│   ├── components/              ← Komponen UI tambahan & reusable
│   ├── config/
│   │   └── businessRules.js     ← Aturan grading, harga acuan, faktor emisi
│   ├── context/
│   │   └── AuthContext.jsx      ← Auth context (frontend mirror)
│   └── services/
│       └── api.js               ← Client SDK (frontend mirror)
│
├── backend/                     ← Logika Bisnis & Database Server
│   └── lib/
│       ├── auth.js              ← JWT generator & RBAC middleware
│       ├── db.js                ← In-memory relational database + seed data
│       ├── impactEngine.js      ← Kalkulasi dampak emisi karbon LCA
│       ├── matchingEngine.js    ← Algoritma Haversine matching engine
│       └── otpStore.js          ← OTP manager & rate limiter
│
├── public/
│   └── assets/                  ← Aset statis (gambar ilustrasi, ikon)
│
├── jsconfig.json                ← Path alias monorepo (@/ mapping)
├── vercel.json                  ← Konfigurasi deployment serverless Vercel
├── package.json                 ← Dependensi & npm scripts
└── README.md                    ← Dokumentasi resmi project ini
```

---

## 7. Akun Demo

Langsung coba semua fitur tanpa perlu mendaftar dari awal:

| Peran | Metode Login | Kredensial | Akses |
|---|---|---|---|
| **Pemasok (Supplier)** | Email | `test@supplier.com` / `password123` | Portal Setor Stok, Guided Grading, Kluster Monitoring |
| **Pembeli (Buyer)** | Email | `test@buyer.com` / `password123` | Katalog Pasokan, Request Kebutuhan, Pantau Pesanan |
| **Admin / Verifier** | Email | `admin@bylink.id` / `admin123` | Konsol Verifikasi Akun, Audit Legalitas, ESG Dashboard |
| **Pemasok (Demo WA)** | WhatsApp OTP | `081234567891` | Sama dengan Supplier di atas |
| **Pembeli (Demo WA)** | WhatsApp OTP | `081234567892` | Sama dengan Buyer di atas |

> **💡 Tips:** Klik tombol **"Demo Cepat"** di halaman login WhatsApp OTP — sistem akan otomatis mengisi nomor dan menampilkan OTP simulasi (tidak memerlukan WhatsApp nyata).

---

## 8. Tangkapan Layar

### 🏠 Landing Page — Hero Isometrik & Dual CTA
Halaman utama dengan visualisasi rantai pasok isometrik real-time (SVG animasi), menampilkan bengkel pemasok, kluster logistik terpusat, dan pabrik pembeli dalam satu kanvas.

![Landing Page Hero](public/assets/ss/hero_screenshot.png)

---

### 🏭 Portal Pemasok — Setor Stok & Guided Grading Engine
Supplier mengisi data stok kayu (jenis, berat, kadar air) dan sistem secara otomatis mengevaluasi grade (A/B/C/Tolak) dengan alasan teknis transparan berbasis SNI 8021:2014.

![Supplier Dashboard](public/assets/ss/supplier_dashboard.png)

---

### 📦 Portal Pemasok — Kluster Wilayah & Progress Agregasi
Visualisasi kluster logistik wilayah: progress bar agregasi (target 500 kg), jumlah bengkel mitra dalam radius, dan riwayat status stok dengan pencairan nominal Rupiah.

![Supplier Cluster](public/assets/ss/supplier_cluster.png)

---

### 🔍 Portal Pembeli — Katalog Pasokan + Radius Filter Haversine
Buyer melihat semua stok tersedia, filter berdasarkan radius (slider 10–3.000 km), dan jarak real-time ke setiap pemasok berdasarkan koordinat GPS.

![Buyer Katalog](public/assets/ss/buyer_katalog.png)

---

### 🚛 Portal Pembeli — Pantau Pesanan & Logistik 4-Step
Pelacakan pesanan real-time: PO Diterbitkan → Logistik Milk-Run → Audit Mutu ISO → Silo Pabrik, lengkap dengan informasi pengemudi dan nomor plat armada.

![Buyer Orders](public/assets/ss/buyer_orders.png)

---

### 🛡️ Admin Console — Verifikasi Akun & Audit Legalitas
Panel admin untuk menyetujui atau menolak akun baru (supplier/buyer) berdasarkan validasi dokumen NIB/NPWP dan audit sampel kadar air lapangan.

![Admin Console](public/assets/ss/admin_console.png)

---

### 🌱 ESG Impact Dashboard — Sertifikat Pengurangan Emisi CO₂e
Setiap transaksi berhasil menghasilkan sertifikat digital dengan ID unik, jumlah emisi CO₂e tereduksi, dan detail verifikasi fisik yang dapat diaudit.

![ESG Certificate](public/assets/ss/esg_certificate.png)

---

### 📱 Alur Registrasi — WhatsApp OTP + Peta Geocoding
Proses pendaftaran multi-step: pilih peran → isi data perusahaan → tentukan lokasi via peta interaktif Leaflet → verifikasi OTP → menunggu validasi admin.

![Auth Flow](public/assets/ss/auth_otp_flow.png)

---

## 9. Alignment SDG & Dampak Sosial

ReuSource dirancang secara eksplisit untuk berkontribusi pada tiga Tujuan Pembangunan Berkelanjutan (SDGs) PBB:

```
┌──────────────────────────────────────────────────────────────────┐
│  SDG 8  │ Pekerjaan Layak & Pertumbuhan Ekonomi                 │
│  ───────  │ ───────────────────────────────────────────────────  │
│           │ • Mengubah biaya buang limbah → pendapatan baru UMKM │
│           │ • Milk-run kolektif tanpa armada mandiri bengkel      │
│           │ • Standar transaksi B2B terverifikasi & transparan    │
├──────────────────────────────────────────────────────────────────┤
│  SDG 12  │ Konsumsi & Produksi Bertanggung Jawab                │
│  ────────  │ ───────────────────────────────────────────────────  │
│           │ • Valorisasi 100% — Grade A/B/C semua punya industri │
│           │ • Pencocokan kadar air presisi → hemat energi drying  │
│           │ • Sertifikasi mutu bebas kontaminan kimia             │
├──────────────────────────────────────────────────────────────────┤
│  SDG 13  │ Penanganan Perubahan Iklim                           │
│  ────────  │ ───────────────────────────────────────────────────  │
│           │ • Cegah pembakaran spontan & emisi metana liar        │
│           │ • Substitusi batubara → pelet/briket netral karbon    │
│           │ • Sertifikat CO₂e digital per transaksi (LCA)        │
└──────────────────────────────────────────────────────────────────┘
```

### Referensi Ilmiah & Regulasi

| Standar / Publikasi | Relevansi |
|---|---|
| **SNI 8021:2014** (BSN Indonesia) | Parameter kadar abu & nilai kalor pelet kayu |
| **ISO 17225-2** | Batas kadar abu Grade A1 ≤0,7% untuk pelet premium |
| **NFPA 664** | Standar pencegahan kebakaran fasilitas pengolahan kayu |
| **IEA Bioenergy Publications** | Analisis rantai pasok biomassa & logistik transportasi |
| **FAO Mushroom Cultivation Manual** | Substrat serbuk kayu Grade C untuk budidaya jamur |
| **OSHA Wood Dust Guidelines** | Kontrol suhu internal & mitigasi ledakan debu kayu |

---

## 10. Kontribusi & Lisensi

Dikembangkan untuk kompetisi inovasi teknologi rantai pasok industri hijau dan ekonomi sirkular terdesentralisasi di Indonesia.

```
Made with 🌿 by the ReuSource / Bylink Team
Standar Keamanan: ISO 27001  |  Deployment: Vercel Edge Network
Stack: Next.js 15 + React 19 + Leaflet + jose + bcryptjs
```

---

<div align="center">

**© 2026 ReuSource / Bylink B2B Biomass Supply Chain Network**

*Mengubah Tumpukan Serbuk Kayu Jadi Pasokan Pabrik — Tanpa Ribet.*

</div>
