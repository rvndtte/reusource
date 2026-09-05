import React from 'react';
import { Puzzle3DIcon, Radar3DIcon, Route3DIcon, Shield3DIcon } from './ThreeDimensionalIcons';

export default function DualEngineFeatures() {
  return (
    <section id="carakerja" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 3.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1.5rem'
    }}>
      {/* Left Container: Cara Kerja ReuSource */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: 'var(--text-dark)',
          letterSpacing: '-0.02em'
        }}>
          Cara Kerja ReuSource
        </h2>

        {/* Top Illustrations Row: Supplier Input -> Buyer Input -> Auto Agregasi & Matchmaking */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {/* Step 1 3D Image: Supplier Input Data Kayu */}
          <div style={{
            height: '110px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
          }}>
            <img src="/assets/icon3d_wood.jpg" alt="Supplier Input Data Kayu" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* Curved Orange Arrow 1 */}
          <div style={{ fontSize: '1.25rem', color: '#f97316', fontWeight: 'bold' }}>
            ➔
          </div>

          {/* Step 2 3D Image: Buyer Input Kebutuhan */}
          <div style={{
            height: '110px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
          }}>
            <img src="/assets/icon3d_factory.jpg" alt="Buyer Input Kebutuhan" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* Curved Blue Arrow 2 */}
          <div style={{ fontSize: '1.25rem', color: '#2563eb', fontWeight: 'bold' }}>
            ➔
          </div>

          {/* Step 3 3D Image: Auto Agregasi & Matchmaking */}
          <div style={{
            height: '110px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
          }}>
            <img src="/assets/step2.jpg" alt="Auto Agregasi & Matchmaking" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        {/* Bottom Text Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          {/* Step 1 Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#059669', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                1
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Supplier Input Data
              </h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Pemasok/bengkel kayu menginput volume serbuk kayu (kg), kadar air (%), dan lokasi penjemputan.
            </p>
          </div>

          {/* Step 2 Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Buyer Input Kebutuhan
              </h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Pabrik briket & pelet menginput kuota tonase yang dibutuhkan, grade kalori, serta lokasi pabrik.
            </p>
          </div>

          {/* Step 3 Text */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#d97706', color: '#fff', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                3
              </div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Agregasi & Matchmaking
              </h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
              Sistem backend otomatis menggabungkan pasokan radius optimal & mencocokkan (*matchmaking*) dengan pembeli.
            </p>
          </div>
        </div>
      </div>

      {/* Right Container: Fitur Unggulan (Deep Navy Card #0F172A) */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        color: '#ffffff'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.02em'
        }}>
          Fitur Unggulan
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem'
        }}>
          {/* Card 1: Matchmaking Pintar (Upgraded 3D Puzzle Icon) */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            padding: '1.15rem 0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div className="icon-3d-box icon-3d-navy" style={{ width: '56px', height: '56px', borderRadius: '14px' }}>
              <Puzzle3DIcon size={44} />
            </div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Matchmaking Pintar
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Cocokkan kebutuhan pembeli dengan pasokan terdekat & sesuai grade.
            </p>
          </div>

          {/* Card 2: Auto Agregasi Radius (Upgraded 3D Radar Icon) */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            padding: '1.15rem 0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div className="icon-3d-box icon-3d-navy" style={{ width: '56px', height: '56px', borderRadius: '14px' }}>
              <Radar3DIcon size={44} />
            </div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Auto Agregasi Radius
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Kumpulkan pasokan dalam radius tertentu hingga mencapai target tonase.
            </p>
          </div>

          {/* Card 3: Rute Optimal (Upgraded 3D Route Icon) */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            padding: '1.15rem 0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div className="icon-3d-box icon-3d-navy" style={{ width: '56px', height: '56px', borderRadius: '14px' }}>
              <Route3DIcon size={44} />
            </div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Rute Optimal
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Tentukan rute jemput terpendek untuk hemat biaya & waktu.
            </p>
          </div>

          {/* Card 4: Transaksi Aman (Upgraded 3D Shield Icon) */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            padding: '1.15rem 0.85rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start'
          }}>
            <div className="icon-3d-box icon-3d-navy" style={{ width: '56px', height: '56px', borderRadius: '14px' }}>
              <Shield3DIcon size={44} />
            </div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
              Transaksi Aman
            </h4>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Terapkan verifikasi & pembayaran aman, transparan untuk semua.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
