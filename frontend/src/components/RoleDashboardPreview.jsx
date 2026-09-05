import React, { useState } from 'react';

export default function RoleDashboardPreview({ userRole = 'supplier', userData = {}, onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const isSupplier = userRole === 'supplier';

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem'
    }}>
      {/* Top Banner / User Welcome */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            backgroundColor: isSupplier ? 'var(--primary-green-light)' : 'var(--primary-blue-light)',
            color: isSupplier ? 'var(--primary-green)' : 'var(--primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            fontWeight: 800
          }}>
            {isSupplier ? '🪵' : '🏭'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                {userData.businessName || (isSupplier ? 'UD WoodCraft Jaya' : 'PT BioEnergi Utama')}
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '20px',
                backgroundColor: isSupplier ? 'var(--primary-green-light)' : 'var(--primary-blue-light)',
                color: isSupplier ? 'var(--primary-green)' : 'var(--primary-blue)',
                border: `1px solid ${isSupplier ? 'rgba(5, 150, 105, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
              }}>
                {isSupplier ? 'ROLE: PEMASOK LIMBAH' : 'ROLE: PEMBELI BIOMASSA'}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              No. WhatsApp: <strong>{userData.phone || '-'}</strong> • Lokasi: <strong>{userData.locationAddress || 'Indonesia'}</strong>
            </p>
          </div>
        </div>

        {/* Verification Status Card */}
        <div style={{
          backgroundColor: '#fffbe6',
          border: '1px solid #ffe58f',
          padding: '0.75rem 1.1rem',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{ fontSize: '1.4rem' }}>⏳</div>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Status Akun: Menunggu Verifikasi Admin
            </div>
            <div style={{ fontSize: '0.75rem', color: '#8c6b00', marginTop: '1px' }}>
              Tim Bylink akan menjadwalkan audit sampel kadar air ke lokasi Anda.
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {isSupplier ? (
          <>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Volume Pasokan Terdaftar</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-green)', marginTop: '0.3rem' }}>
                {userData.volume ? `${userData.volume} kg/hari` : '1.200 kg/hari'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Grade A (Kering ≤15%)</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Potensi Nilai Penjualan</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.3rem' }}>
                Rp 28.800.000 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/bln</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-green)', fontWeight: 600, marginTop: '0.2rem' }}>Est. Harga: Rp 800/kg</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Agregasi Kluster</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '0.3rem' }}>
                85% <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>(4.5 / 5.4 Ton)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Radius kluster aktif</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pengurangan Emisi Karbon</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-green)', marginTop: '0.3rem' }}>
                2,45 Ton CO₂e
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-green)', fontWeight: 600, marginTop: '0.2rem' }}>Bebas Pembakaran Terbuka</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Target Serap Biomassa</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-blue)', marginTop: '0.3rem' }}>
                {userData.capacity || '50 Ton'} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/periode</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Kebutuhan: {userData.biomassType || 'Wood Pellet / Briket'}</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pasokan Terkontrak</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.3rem' }}>
                38,5 Ton <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>(77%)</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600, marginTop: '0.2rem' }}>Dari 14 Bengkel Mikro Teragregasi</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Pengiriman Armada</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-green)', marginTop: '0.3rem' }}>
                2 Truk <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Dalam Perjalanan</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ETA: Hari ini, 15:30 WIB</div>
            </div>

            <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sertifikat ESG & Karbon</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-blue)', marginTop: '0.3rem' }}>
                Grade A ISO
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', fontWeight: 600, marginTop: '0.2rem' }}>Siap Klaim Kredit Karbon</div>
            </div>
          </>
        )}
      </div>

      {/* Main Interactive Tab Area */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setActiveTab('ringkasan')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'ringkasan' ? (isSupplier ? 'var(--primary-green-light)' : 'var(--primary-blue-light)') : 'transparent',
              color: activeTab === 'ringkasan' ? (isSupplier ? 'var(--primary-green)' : 'var(--primary-blue)') : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            📋 Ringkasan Aktivitas
          </button>

          <button
            onClick={() => setActiveTab('kluster')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.88rem',
              fontWeight: 700,
              backgroundColor: activeTab === 'kluster' ? (isSupplier ? 'var(--primary-green-light)' : 'var(--primary-blue-light)') : 'transparent',
              color: activeTab === 'kluster' ? (isSupplier ? 'var(--primary-green)' : 'var(--primary-blue)') : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🗺️ Peta Agregasi Geospasial
          </button>
        </div>

        {activeTab === 'ringkasan' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)' }}>
              {isSupplier ? 'Daftar Penawaran Pasokan Limbah Anda' : 'Katalog Biomassa Siap Kirim'}
            </h3>
            
            <div style={{ border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-eco)', borderBottom: '1px solid var(--card-border)' }}>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>ID Pasokan</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Jenis Material</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Kadar Air (%)</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Volume Harian</th>
                    <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Status Audit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-dark)' }}>#BYL-8821</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{userData.wasteType || 'Serbuk Serutan Kayu Jati'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span style={{ color: 'var(--primary-green)', fontWeight: 700 }}>12.5% (Grade A)</span></td>
                    <td style={{ padding: '0.75rem 1rem' }}>1.200 kg</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        Menunggu Audit Fisik
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-dark)' }}>#BYL-8822</td>
                    <td style={{ padding: '0.75rem 1rem' }}>Potongan Kayu Hardwood</td>
                    <td style={{ padding: '0.75rem 1rem' }}><span style={{ color: 'var(--text-muted)' }}>18.0% (Grade B)</span></td>
                    <td style={{ padding: '0.75rem 1rem' }}>850 kg</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        Terverifikasi
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', backgroundColor: '#0f172a', borderRadius: '8px', color: '#ffffff', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Kluster Agregasi Geospasial Aktif</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: '500px', margin: '0.5rem auto 1.25rem' }}>
              Titik lokasi Anda sudah terdaftar dalam jangkauan rute truk logistik Bylink Radius 10 km.
            </p>
            <div style={{ display: 'inline-block', backgroundColor: 'rgba(5, 150, 105, 0.2)', color: '#34d399', border: '1px solid #059669', padding: '0.5rem 1.25rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 700 }}>
              📍 Lokasi Terdaftar — Koordinat Terkunci
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer Action */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button
          onClick={onBackToLanding}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: '#ffffff',
            border: '1.5px solid var(--card-border)',
            borderRadius: '8px',
            color: 'var(--text-dark)',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          ← Kembali ke Beranda Utama ReuSource
        </button>
      </div>
    </div>
  );
}
