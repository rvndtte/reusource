import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Fire3DIcon, Truck3DIcon, Mushroom3DIcon, Gear3DIcon } from './ThreeDimensionalIcons';

const REFERENCES_DETAIL = [
  {
    title: '1. Risiko Kebakaran: Pembakaran Spontan (Spontaneous Combustion)',
    icon: <Fire3DIcon size={28} />,
    desc: 'Tumpukan residu serbuk kayu basah yang disimpan > 2 minggu mengalami reaksi oksidasi internal dan fermentasi mikroba yang dapat memicu titik nyala api mandiri.',
    links: [
      { name: 'NFPA 664 Standard', url: 'https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=664', note: 'Standard for the Prevention of Fires and Explosions in Wood Processing Facilities' },
      { name: 'OSHA Wood Dust Guidelines', url: 'https://www.osha.gov/wood-dust', note: 'Panduan keselamatan kerja pemerintah AS mengenai kontrol suhu internal & mitigasi ledakan debu kayu' }
    ]
  },
  {
    title: '2. Boros Ongkos: Penalti Logistik Kadar Air (Moisture Freight Penalty)',
    icon: <Truck3DIcon size={28} />,
    desc: 'Mengangkut serbuk kayu basah mengakibatkan 40% kapasitas tonase armada logistik habis hanya untuk mengangkut bobot air, menurunkan nilai kalor bersih (Net Calorific Value).',
    links: [
      { name: 'IEA Bioenergy Publications', url: 'https://www.ieabioenergy.com/publications/', note: 'Biomass Supply Chains and Transport Logistics analysis' },
      { name: 'USDA Forest Service Treesearch', url: 'https://www.fs.usda.gov/research/treesearch/', note: 'Studi komputasi penurunan nilai kalor bersih dan beban biaya pengeringan biomassa' }
    ]
  },
  {
    title: '3. Peluang Jamur: Standar Serbuk Kayu Segar untuk Substrat Baglog',
    icon: <Mushroom3DIcon size={28} />,
    desc: 'Budidaya jamur konsumsi membutuhkan serat serbuk kayu alami segar (non-treated) dan melarang keras bahan kayu yang mengandung lem resin sintesis (formaldehyde) atau pengawet.',
    links: [
      { name: 'Penn State Extension - Mushroom Cultivation', url: 'https://extension.psu.edu/oyster-mushroom-cultivation', note: 'Panduan ilmiah riset substrat jamur tiram & formulasi nutrisi selulosa' },
      { name: 'FAO Mushroom Cultivation Manual', url: 'https://www.fao.org/3/t0057e/T0057E00.htm', note: 'Panduan resmi FAO untuk pemilihan substrat selulosa alami' }
    ]
  },
  {
    title: '4. Kebersihan Mesin: Abrasi Pasir & Kerak Kaca (Boiler Slagging)',
    icon: <Gear3DIcon size={28} />,
    desc: 'Kandungan pasir silika & debu kotor pada limbah kayu mentah dapat menyebabkan kerak silika (slagging) pada dinding boiler industri dan mengikis burner.',
    links: [
      { name: 'ISO 17225-2 Standard', url: 'https://www.iso.org/standard/76086.html', note: 'Batas maksimal kadar abu (ash content < 0,7% untuk Grade A1) penentu pelet berkualitas' },
      { name: 'SNI 8021:2014 (BSN Indonesia)', url: 'https://akses-sni.bsn.go.id/', note: 'Regulasi Badan Standardisasi Nasional untuk parameter kadar abu & nilai kalor pelet kayu' }
    ]
  }
];

const SDG_INFO = {
  8: {
    number: 8,
    code: 'SDG 8',
    title: 'Pekerjaan Layak & Pertumbuhan Ekonomi',
    subtitle: 'Decent Work and Economic Growth',
    color: '#a21942',
    bgColor: '#fdf2f4',
    borderColor: '#fda4af',
    tag: 'PILAR UTAMA EKONOMI',
    desc: 'ReuSource memberdayakan pemilik bengkel kayu lokal dan UMKM pengolah kayu mikro dengan mengubah limbah serbuk kayu bernilai nol menjadi komoditas ekonomi yang menghasilkan pendapatan tambahan berkelanjutan.',
    points: [
      'Peningkatan Kompensasi Ekonomi: Mengubah beban biaya pembuangan limbah bengkel menjadi margin laba bersih harian.',
      'Logistik Milk-Run Terintegrasi: Menghubungkan puluhan bengkel mikro ke dalam 1 muatan truk kolektif tanpa biaya armada mandiri.',
      'Formalisasi Rantai Pasok Biomassa: Menciptakan standar transaksi B2B yang transparan dan terverifikasi untuk UMKM lokal.'
    ]
  },
  12: {
    number: 12,
    code: 'SDG 12',
    title: 'Konsumsi & Produksi yang Bertanggung Jawab',
    subtitle: 'Responsible Consumption and Production',
    color: '#bf8b2e',
    bgColor: '#fffbe6',
    borderColor: '#fef08a',
    tag: 'EKONOMI SIRKULAR',
    desc: 'ReuSource memelopori rantai pasok sirkular (circular supply chain) biomassa kayu untuk memastikan tidak ada residu serbuk kayu yang dibuang sia-sia atau ditumpuk secara liar di lingkungan.',
    points: [
      'Valorisasi Limbah 100%: Setiap grade serbuk kayu (Grade A, B, C) dialokasikan tepat sasaran ke industri pembeli yang paling membutuhkan.',
      'Pengurangan Jejak Karbon Pengeringan: Pencocokan kadar air presisi mencegah pemborosan energi termal pada pengeringan industri.',
      'Sertifikasi & Pengawasan Mutu: Memastikan serbuk kayu bebas bahan kimia berbahaya sebelum didistribusikan ke produsen.'
    ]
  },
  13: {
    number: 13,
    code: 'SDG 13',
    title: 'Penanganan Perubahan Iklim',
    subtitle: 'Climate Action',
    color: '#2e6930',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    tag: 'DEKARBONISASI & ABRASI EMISI',
    desc: 'ReuSource secara aktif menurunkan emisi gas rumah kaca dengan memutarkan limbah biomassa menjadi bahan bakar terbarukan yang menggantikan bahan bakar fosil.',
    points: [
      'Pencegahan Pembakaran Spontan: Menghentikan tumpukan serbuk kayu basah liar yang berisiko teroksidasi dan menyulut gas metana mandiri.',
      'Substitusi Batubara Industri: Mengsuplai pelet & briket biomassa netral karbon untuk boiler pabrik pengganti fosil.',
      'Verifikasi CO₂e Digital: Menyediakan sertifikat pengurangan emisi yang dapat dilacak secara akurat oleh pembeli industri.'
    ]
  }
};

export default function FactsAndImpact() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSdgModal, setActiveSdgModal] = useState(null);

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 3.5rem',
      display: 'grid',
      gridTemplateColumns: 'minmax(400px, 2.1fr) minmax(340px, 1.5fr) minmax(300px, 1.3fr)',
      gap: '1.25rem',
      alignItems: 'stretch'
    }}>
      {/* Container 1: Fakta Lapangan yang Jarang Diketahui */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '20px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            Fakta Lapangan yang Jarang Diketahui
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--primary-green)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>Lihat semua rujukan</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* 4 Cards Row with Hyperlinks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {/* Card 1: Risiko Kebakaran */}
          <div style={{
            backgroundColor: '#fcfdfc',
            border: '1px solid #e2eae0',
            borderRadius: '16px',
            padding: '1rem 0.65rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.45rem'
          }}>
            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Fire3DIcon size={30} />
              </div>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2, marginTop: '4px' }}>
                Risiko Kebakaran
              </h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
                Serbuk kayu basah yang menumpuk &gt; 2 minggu bisa terbakar sendiri.
              </p>
            </div>

            <div style={{ fontSize: '0.66rem', color: 'var(--primary-green)', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0', width: '100%' }}>
              Rujukan:{' '}
              <a href="https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=664" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                NFPA 664
              </a>
              {' • '}
              <a href="https://www.osha.gov/wood-dust" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                OSHA
              </a>
            </div>
          </div>

          {/* Card 2: Boros Ongkos */}
          <div style={{
            backgroundColor: '#fcfdfc',
            border: '1px solid #e2eae0',
            borderRadius: '16px',
            padding: '1rem 0.65rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.45rem'
          }}>
            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck3DIcon size={30} />
              </div>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2, marginTop: '4px' }}>
                Boros Ongkos
              </h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
                40% kapasitas truk habis untuk air jika angkut serbuk basah.
              </p>
            </div>

            <div style={{ fontSize: '0.66rem', color: 'var(--primary-green)', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0', width: '100%' }}>
              Rujukan:{' '}
              <a href="https://www.ieabioenergy.com/publications/" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                IEA Bioenergy
              </a>
              {' • '}
              <a href="https://www.fs.usda.gov/research/treesearch/" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                USDA
              </a>
            </div>
          </div>

          {/* Card 3: Peluang Jamur */}
          <div style={{
            backgroundColor: '#fcfdfc',
            border: '1px solid #e2eae0',
            borderRadius: '16px',
            padding: '1rem 0.65rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.45rem'
          }}>
            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mushroom3DIcon size={30} />
              </div>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2, marginTop: '4px' }}>
                Peluang Jamur
              </h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
                Budidaya jamur butuh serbuk kayu basah segar, bukan kering oven.
              </p>
            </div>

            <div style={{ fontSize: '0.66rem', color: 'var(--primary-green)', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0', width: '100%' }}>
              Rujukan:{' '}
              <a href="https://extension.psu.edu/oyster-mushroom-cultivation" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                Penn State
              </a>
              {' • '}
              <a href="https://www.fao.org/3/t0057e/T0057E00.htm" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                FAO
              </a>
            </div>
          </div>

          {/* Card 4: Kebersihan Mesin */}
          <div style={{
            backgroundColor: '#fcfdfc',
            border: '1px solid #e2eae0',
            borderRadius: '16px',
            padding: '1rem 0.65rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.45rem'
          }}>
            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Gear3DIcon size={30} />
              </div>
              <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2, marginTop: '4px' }}>
                Kebersihan Mesin
              </h5>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '4px' }}>
                Pasir & debu dapat merusak mesin pabrik jadi kerugian besar.
              </p>
            </div>

            <div style={{ fontSize: '0.66rem', color: 'var(--primary-green)', fontWeight: 700, paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0', width: '100%' }}>
              Rujukan:{' '}
              <a href="https://www.iso.org/standard/76086.html" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                ISO 17225-2
              </a>
              {' • '}
              <a href="https://akses-sni.bsn.go.id/" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                SNI 8021
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Container 2: Dampak Nyata, Selaras SDG (Enlarged Interactive SDG Cards) */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '20px',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>
            Dampak Nyata, Selaras SDG
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
            Klik kartu untuk melihat detail alignment resmi
          </p>
        </div>

        {/* SDG Hierarchy: SDG 8 Large at Center Top, Supporting SDGs 12 & 13 Enlarged Below */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, justifyContent: 'center' }}>
          {/* Top Row: SDG 8 Large Centered Primary Pillar (Clickable) */}
          <div
            onClick={() => setActiveSdgModal(SDG_INFO[8])}
            style={{
              width: '100%',
              backgroundColor: '#fdf2f4',
              border: '2px solid #a21942',
              borderRadius: '18px',
              padding: '1.25rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.1rem',
              boxShadow: '0 8px 24px rgba(162, 25, 66, 0.15)'
            }}
            className="sdg-card-interactive"
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '14px',
              backgroundColor: '#a21942',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(162, 25, 66, 0.35)',
              border: '2px solid #fda4af',
              flexShrink: 0
            }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, lineHeight: 1 }}>SDG</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1 }}>8</span>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#a21942', letterSpacing: '0.05em', display: 'block' }}>
                PILAR UTAMA EKONOMI
              </span>
              <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
                Pekerjaan Layak & Pertumbuhan Ekonomi
              </h5>
              <p style={{ fontSize: '0.75rem', color: '#881337', fontWeight: 600, marginTop: '3px' }}>
                Penghasilan Tambahan & Agregasi 140+ UMKM
              </p>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#a21942', textDecoration: 'underline', marginTop: '4px', display: 'inline-block' }}>
                Detail Info &gt;
              </span>
            </div>
          </div>

          {/* Bottom Row: Supporting SDGs 12 & 13 Enlarged Below (Clickable) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', width: '100%' }}>
            {/* SDG 12 (Clickable) */}
            <div
              onClick={() => setActiveSdgModal(SDG_INFO[12])}
              style={{
                backgroundColor: '#fffbe6',
                border: '1.5px solid #bf8b2e',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 14px rgba(191, 139, 46, 0.12)'
              }}
              className="sdg-card-interactive"
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#bf8b2e',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 800, lineHeight: 1 }}>SDG</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>12</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#bf8b2e', display: 'block' }}>
                  EKONOMI SIRKULAR
                </span>
                <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.15 }}>
                  Produksi Responsif
                </h5>
                <span style={{ fontSize: '0.62rem', color: '#78350f', fontWeight: 700, textDecoration: 'underline', marginTop: '2px', display: 'block' }}>
                  Detail info &gt;
                </span>
              </div>
            </div>

            {/* SDG 13 (Clickable) */}
            <div
              onClick={() => setActiveSdgModal(SDG_INFO[13])}
              style={{
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #059669',
                borderRadius: '16px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.12)'
              }}
              className="sdg-card-interactive"
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: '#059669',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 800, lineHeight: 1 }}>SDG</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>13</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.58rem', fontWeight: 800, color: '#059669', display: 'block' }}>
                  AKSI IKLIM
                </span>
                <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.15 }}>
                  Perubahan Iklim
                </h5>
                <span style={{ fontSize: '0.62rem', color: '#047857', fontWeight: 700, textDecoration: 'underline', marginTop: '2px', display: 'block' }}>
                  Detail info &gt;
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container 3: Sertifikat Pengurangan Emisi */}
      <div style={{
        backgroundColor: '#ecfdf5',
        border: '1.5px solid #a7f3d0',
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 6px 16px rgba(5, 150, 105, 0.1)'
      }}>
        {/* Plant Sprout Graphic (Background Accent Right) */}
        <div style={{
          position: 'absolute',
          right: '-15px',
          bottom: '-15px',
          opacity: 0.2,
          pointerEvents: 'none'
        }}>
          <svg width="140" height="140" viewBox="0 0 100 100" fill="none">
            <path d="M70 20 C40 20, 30 50, 20 80 M70 20 C85 40, 60 60, 40 60 C30 60, 25 40, 35 30 C45 20, 60 20, 70 20 Z" fill="#059669" />
          </svg>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', letterSpacing: '0.05em' }}>
              ✦ CERTIFICATE OF IMPACT
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#d1fae5', color: '#059669', padding: '2px 8px', borderRadius: '12px' }}>
              VERIFIED
            </span>
          </div>

          <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', lineHeight: 1.1 }}>
            ReuSource
          </h4>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
            Sertifikat Pengurangan Emisi
          </span>

          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.85rem',
            backgroundColor: '#ffffff',
            padding: '0.85rem',
            borderRadius: '12px',
            border: '1px solid #a7f3d0'
          }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, display: 'block' }}>ID Transaksi</span>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                RS-2024-05-00123
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, display: 'block' }}>CO₂e Reduced</span>
              <span className="tabular-nums" style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                125 kg
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, display: 'block' }}>Verifikasi</span>
              <span style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 800 }}>
                Fisik Handover
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, display: 'block' }}>Status</span>
              <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800 }}>
                100% Valid
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Barcode Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '1rem',
          paddingTop: '0.65rem',
          borderTop: '1px dashed #a7f3d0',
          zIndex: 2
        }}>
          <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 600 }}>
            Scan untuk otentikasi digital
          </span>
          <div style={{ backgroundColor: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <path d="M14 14h3v3h-3z" fill="#059669" />
              <path d="M18 18h3v3h-3z" fill="#059669" />
            </svg>
          </div>
        </div>
      </div>

      {/* Modal 1: Detailed Academic References (Using React Portal to body) */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '82vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              position: 'relative',
              margin: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', pb: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-green)' }}>✦ STANDAR INDUSTRI & JURNAL ILMIAH</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  Rujukan Ilmiah & Regulasi Resmi
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {REFERENCES_DETAIL.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    {item.icon}
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      {item.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {item.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'block',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          textDecoration: 'none',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.8rem'
                        }}
                      >
                        <div>➔ {link.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400, marginTop: '2px' }}>
                          {link.note}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal 2: Interactive SDG Alignment Detail Popup Modal (Using React Portal to body) */}
      {activeSdgModal && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setActiveSdgModal(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '82vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              position: 'relative',
              border: `2.5px solid ${activeSdgModal.color}`,
              margin: 'auto'
            }}
          >
            {/* Header Badge & Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  backgroundColor: activeSdgModal.color,
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 6px 16px ${activeSdgModal.color}40`,
                  flexShrink: 0
                }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, lineHeight: 1 }}>SDG</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{activeSdgModal.number}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: activeSdgModal.color, letterSpacing: '0.05em', display: 'block' }}>
                    ✦ {activeSdgModal.tag}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.2 }}>
                    {activeSdgModal.title}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {activeSdgModal.subtitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveSdgModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            {/* Description */}
            <div style={{
              backgroundColor: activeSdgModal.bgColor,
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              border: `1px solid ${activeSdgModal.borderColor}`,
              marginBottom: '1.25rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: 1.5, fontWeight: 600 }}>
                {activeSdgModal.desc}
              </p>
            </div>

            {/* Detailed Alignment Points */}
            <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.75rem' }}>
              Bagaimana ReuSource Mewujudkan Target Ini?
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activeSdgModal.points.map((pt, pIdx) => (
                <div key={pIdx} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  backgroundColor: '#f8fafc',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{ color: activeSdgModal.color, fontSize: '1.1rem', lineHeight: 1 }}>✔</span>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dark)', lineHeight: 1.4, fontWeight: 500 }}>
                    {pt}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer Button */}
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setActiveSdgModal(null)}
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '10px',
                  backgroundColor: activeSdgModal.color,
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${activeSdgModal.color}40`
                }}
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
