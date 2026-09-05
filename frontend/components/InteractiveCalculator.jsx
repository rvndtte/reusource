import React, { useState } from 'react';
import { Leaf3DIcon, Money3DIcon, Factory3DIcon, Cloud3DIcon } from './ThreeDimensionalIcons';

export default function InteractiveCalculator() {
  const [selectedGrade, setSelectedGrade] = useState('a');
  const [bagCount, setBagCount] = useState(47);

  // Price & impact formulas matching standard values
  const pricePerKg = selectedGrade === 'a' ? 300 : selectedGrade === 'b' ? 175 : 100;
  const buyerType = selectedGrade === 'a' ? 'Pabrik Briket' : selectedGrade === 'b' ? 'Pabrik Semen / Bata' : 'Petani Jamur';
  const gradeLabel = selectedGrade === 'a' ? 'Grade A – Kering' : selectedGrade === 'b' ? 'Grade B – Lembap' : 'Grade C – Basah';

  // 47 bags = 2,350 kg -> Rp 7.050.000 (at 300/kg) & 125 kg CO2e
  const totalKg = bagCount * 50;
  const totalRevenue = (totalKg * pricePerKg).toLocaleString('id-ID');
  const co2PreventedKg = Math.round(bagCount * 2.66); // 47 karung = ~125 kg CO2e

  return (
    <section id="kalkulator" style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 3.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Title & Subtitle */}
      <div>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 800,
          color: 'var(--text-dark)',
          letterSpacing: '-0.02em'
        }}>
          Hitung Potensi Material Anda
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Simulasi cepat untuk mengetahui nilai & dampak dari material Anda.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        alignItems: 'stretch'
      }}>
        {/* Left Input Parameters Card (Fixed Height Container) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '1.75rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: '1.5rem',
          alignItems: 'center',
          minHeight: '280px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          {/* Sub-column 1: Kondisi Material */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)', display: 'block', marginBottom: '0.85rem' }}>
              Kondisi Material
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {/* Option A: Kering */}
              <button
                type="button"
                onClick={() => setSelectedGrade('a')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  background: selectedGrade === 'a' ? 'linear-gradient(to right, #059669, #10b981)' : '#ffffff',
                  border: selectedGrade === 'a' ? 'none' : '1px solid #e2e8f0',
                  color: selectedGrade === 'a' ? '#ffffff' : 'var(--text-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: selectedGrade === 'a' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: selectedGrade === 'a' ? '#ffffff' : 'transparent',
                  border: selectedGrade === 'a' ? 'none' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#059669',
                  fontWeight: 'bold'
                }}>
                  {selectedGrade === 'a' && '✓'}
                </div>
                <span>Kering (≤15%)</span>
              </button>

              {/* Option B: Lembap */}
              <button
                type="button"
                onClick={() => setSelectedGrade('b')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  background: selectedGrade === 'b' ? 'linear-gradient(to right, #d97706, #f59e0b)' : '#ffffff',
                  border: selectedGrade === 'b' ? 'none' : '1px solid #e2e8f0',
                  color: selectedGrade === 'b' ? '#ffffff' : 'var(--text-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: selectedGrade === 'b' ? '0 4px 12px rgba(217, 119, 6, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: selectedGrade === 'b' ? '#ffffff' : 'transparent',
                  border: selectedGrade === 'b' ? 'none' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#d97706',
                  fontWeight: 'bold'
                }}>
                  {selectedGrade === 'b' && '✓'}
                </div>
                <span>Lembap (16–30%)</span>
              </button>

              {/* Option C: Basah */}
              <button
                type="button"
                onClick={() => setSelectedGrade('c')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  background: selectedGrade === 'c' ? 'linear-gradient(to right, #2563eb, #3b82f6)' : '#ffffff',
                  border: selectedGrade === 'c' ? 'none' : '1px solid #e2e8f0',
                  color: selectedGrade === 'c' ? '#ffffff' : 'var(--text-dark)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: selectedGrade === 'c' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: selectedGrade === 'c' ? '#ffffff' : 'transparent',
                  border: selectedGrade === 'c' ? 'none' : '1.5px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#2563eb',
                  fontWeight: 'bold'
                }}>
                  {selectedGrade === 'c' && '✓'}
                </div>
                <span>Basah (&gt;30%)</span>
              </button>
            </div>
          </div>

          {/* Sub-column 2: Jumlah Karung */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              Jumlah Karung
            </label>

            {/* Big Center Display */}
            <div style={{ textAlign: 'center' }}>
              <span className="tabular-nums" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>
                {bagCount}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
                karung
              </span>
            </div>

            {/* Slider Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                <span>10 karung</span>
                <span>100 karung</span>
              </div>

              <input
                type="range"
                min="10"
                max="100"
                value={bagCount}
                onChange={(e) => setBagCount(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  accentColor: '#059669',
                  cursor: 'pointer'
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Output Container (Flexible & Responsive) */}
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--card-border)',
          borderRadius: '20px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '280px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Leaf3DIcon size={20} />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                Hasil Estimasi
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
              Real-time Simulation
            </span>
          </div>

          {/* 3 Metric Cards Grid (Clean 3-column auto-fit layout) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
            gap: '0.75rem',
            alignItems: 'stretch',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            {/* Card 1: Perkiraan Uang (Soft Yellow #FFF7ED) */}
            <div style={{
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              borderRadius: '14px',
              padding: '0.9rem 0.8rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#c2410c', display: 'block' }}>
                  Perkiraan Uang
                </span>
                <div className="icon-3d-box" style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #fdba74',
                  marginTop: '4px'
                }}>
                  <Money3DIcon size={20} />
                </div>
              </div>

              <div>
                <div className="tabular-nums" style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.15, wordBreak: 'break-word' }}>
                  Rp {totalRevenue}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9a3412', fontWeight: 500, display: 'block', marginTop: '2px', lineHeight: 1.25 }}>
                  Estimasi pendapatan Anda
                </span>
              </div>
            </div>

            {/* Card 2: Potensial Pembeli (Soft Blue #EFF6FF) */}
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '0.9rem 0.8rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e40af', display: 'block' }}>
                  Potensial Pembeli
                </span>
                <div className="icon-3d-box" style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #93c5fd',
                  marginTop: '4px'
                }}>
                  <Factory3DIcon size={20} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.15, wordBreak: 'break-word' }}>
                  {buyerType}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 600, display: 'block', marginTop: '2px', lineHeight: 1.25 }}>
                  {gradeLabel}
                </span>
              </div>
            </div>

            {/* Card 3: Polusi Dicegah (Soft Green #ECFDF5) */}
            <div style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '14px',
              padding: '0.9rem 0.8rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '160px',
              gap: '0.5rem',
              boxSizing: 'border-box'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', display: 'block' }}>
                  Polusi Dicegah
                </span>
                <div className="icon-3d-box" style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #6ee7b7',
                  marginTop: '4px'
                }}>
                  <Cloud3DIcon size={20} />
                </div>
              </div>

              <div>
                <div className="tabular-nums" style={{ fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)', fontWeight: 800, color: '#1e293b', lineHeight: 1.15, wordBreak: 'break-word' }}>
                  {co2PreventedKg} kg CO₂e
                </div>
                <span style={{ fontSize: '0.68rem', color: '#047857', fontWeight: 500, display: 'block', marginTop: '2px', lineHeight: 1.25 }}>
                  Emisi berhasil dicegah
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
