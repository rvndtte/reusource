'use client';

import React from 'react';
import { Fire3DIcon, Money3DIcon, Warning3DIcon, Cloud3DIcon } from './ThreeDimensionalIcons';
import { ArrowRight } from 'lucide-react';

export default function MarketFriction() {
  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1.25rem 2.5rem',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
        gap: '1.25rem',
        position: 'relative',
        alignItems: 'stretch'
      }}>
        {/* Left Card: MASALAH */}
        <div style={{
          backgroundColor: '#fff5f5',
          border: '1.5px solid #fecaca',
          borderRadius: '24px',
          padding: '1.75rem 1.5rem 1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '280px',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.04)'
        }}>
          {/* Left Text Column */}
          <div style={{ flex: '1 1 54%', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#1e293b',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: 0
            }}>
              Kenapa<br />Selama Ini<br />Sulit Dijual?
            </h2>

            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#ef4444',
              letterSpacing: '0.06em',
              marginTop: '0.15rem'
            }}>
              MASALAH
            </span>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Fire3DIcon size={18} />
                <span>Jumlah sedikit, tidak laku.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Money3DIcon size={18} />
                <span>Boros ongkos & waktu cari pembeli.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Warning3DIcon size={18} />
                <span>Disimpan lama, berisiko kebakaran.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                <Cloud3DIcon size={18} />
                <span>Akhirnya dibakar, polusi & rugi.</span>
              </li>
            </ul>
          </div>

          {/* Right Transparent Illustration Column */}
          <div style={{
            flex: '1 1 46%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            position: 'relative',
            maxHeight: '220px'
          }}>
            <img
              src="/assets/problem_transparent.png"
              alt="Masalah Pembakaran Limbah"
              style={{
                maxHeight: '210px',
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
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
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          color: '#1e293b',
        }}>
          <ArrowRight size={18} strokeWidth={2.5} />
        </div>

        {/* Right Card: SOLUSI REUSOURCE */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #bbf7d0',
          borderRadius: '24px',
          padding: '1.75rem 1.5rem 1.75rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '280px',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.04)'
        }}>
          {/* Left Text Column */}
          <div style={{ flex: '1 1 50%', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#059669',
              letterSpacing: '0.06em',
              marginBottom: '0.1rem'
            }}>
              SOLUSI REUSOURCE
            </span>

            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.8px solid #059669',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <span>Kumpulkan dari banyak bengkel.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.8px solid #059669',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <span>Auto agregasi hingga 1–2 ton.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.8px solid #059669',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <span>Dijemput sekali jalan.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.83rem', color: '#1e293b', fontWeight: 600 }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1.8px solid #059669',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
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
            position: 'relative',
            maxHeight: '230px'
          }}>
            <img
              src="/assets/solution_transparent.png"
              alt="Solusi ReuSource Logistics"
              style={{
                maxHeight: '215px',
                maxWidth: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
