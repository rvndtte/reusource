import React from 'react';
import { Fire3DIcon, Money3DIcon, Warning3DIcon, Cloud3DIcon } from './ThreeDimensionalIcons';

export default function MarketFriction() {
  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 3.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.25rem',
        position: 'relative',
        alignItems: 'stretch'
      }}>
        {/* Left Card: MASALAH */}
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '280px'
        }}>
          {/* Left Text Column */}
          <div style={{ flex: '1 1 50%', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-dark)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Kenapa Selama Ini<br />Sulit Dijual?
            </h2>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#ef4444',
              letterSpacing: '0.05em',
              marginTop: '0.2rem'
            }}>
              MASALAH
            </span>

            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Fire3DIcon size={20} />
                <span>Jumlah sedikit, tidak laku.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Money3DIcon size={20} />
                <span>Boros ongkos & waktu cari pembeli.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Warning3DIcon size={20} />
                <span>Disimpan lama, berisiko kebakaran.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Cloud3DIcon size={20} />
                <span>Akhirnya dibakar, polusi & rugi.</span>
              </li>
            </ul>
          </div>

          {/* Right Transparent Illustration Column */}
          <div style={{
            flex: '1 1 50%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            position: 'relative'
          }}>
            <img
              src="/assets/problem_transparent.png"
              alt="Masalah Pembakaran Limbah"
              style={{
                maxHeight: '260px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* Center Divider Arrow Icon */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          color: '#1e293b',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          ➔
        </div>

        {/* Right Card: SOLUSI REUSOURCE */}
        <div style={{
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '20px',
          padding: '2rem',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '280px'
        }}>
          {/* Left Text Column */}
          <div style={{ flex: '1 1 50%', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#059669',
              letterSpacing: '0.05em'
            }}>
              SOLUSI REUSOURCE
            </span>

            <ul style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #059669', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  ✓
                </div>
                <span>Kumpulkan dari banyak bengkel.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #059669', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  ✓
                </div>
                <span>Auto agregasi hingga 1–2 ton.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #059669', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  ✓
                </div>
                <span>Dijemput sekali jalan.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #059669', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                  ✓
                </div>
                <span>Hemat waktu, hemat biaya, dapat uang.</span>
              </li>
            </ul>
          </div>

          {/* Right Transparent Illustration Column */}
          <div style={{
            flex: '1 1 50%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            position: 'relative'
          }}>
            <img
              src="/assets/solution_transparent.png"
              alt="Solusi ReuSource Logistics"
              style={{
                maxHeight: '260px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
