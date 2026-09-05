import React, { useState } from 'react';
import { AnimatedSlidersIcon, AnimatedMapPinIcon, AnimatedQrCodeIcon, AnimatedTruckIcon } from './AnimatedIcons';

export default function ThreeStepEngine() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '3rem',
      borderTop: '1px solid var(--border-industrial)'
    }}>
      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '4px 12px',
          borderRadius: '6px',
          backgroundColor: 'var(--biomass-ochre-bg)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: 'var(--biomass-ochre)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.85rem'
        }}>
          <span>THE 3-STEP ENGINE</span>
        </div>
        <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
          Cara Kerja Orkestrasi Pasokan Bylink
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Tiga langkah otomatisasi dari penyerahan limbah kayu mikro hingga penjemputan armada industri.
        </p>
      </div>

      {/* Interactive Step Switcher & Progress Bar */}
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          position: 'relative',
          marginBottom: '2rem'
        }}>
          {/* Progress Connecting Line */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            backgroundColor: 'var(--border-industrial)',
            zIndex: 1
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--biomass-ochre)',
              width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%',
              transition: 'width 0.4s ease'
            }} />
          </div>

          {/* Step Indicators */}
          {[1, 2, 3].map((step) => (
            <button
              key={step}
              onClick={() => setActiveStep(step)}
              style={{
                zIndex: 2,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: activeStep >= step ? 'var(--biomass-ochre)' : '#0d1117',
                border: activeStep >= step ? '2px solid var(--biomass-ochre)' : '2px solid var(--border-industrial)',
                color: activeStep >= step ? '#000000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: activeStep === step ? '0 0 16px rgba(245, 158, 11, 0.4)' : 'none'
              }}
            >
              0{step}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Step Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Step 1 */}
        <div
          onClick={() => setActiveStep(1)}
          style={{
            backgroundColor: 'var(--surface-charcoal)',
            border: activeStep === 1 ? '1px solid var(--biomass-ochre)' : '1px solid var(--border-industrial)',
            borderRadius: '8px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--biomass-ochre)' }}>
              STEP 01 • SUPPLIER
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre-bg)',
              color: 'var(--biomass-ochre)',
              display: 'flex'
            }}>
              <AnimatedSlidersIcon size={20} color="var(--biomass-ochre)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Input Parameter Fisik
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Isi 4 variabel diskrit (<strong style={{ color: '#fff' }}>jenis kayu, tipe mesin gergaji, penyimpanan, karung standar</strong>). Sistem langsung mengunci Grade A/B/C dan estimasi rupiah tanpa tawar-menawar.
          </p>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => setActiveStep(2)}
          style={{
            backgroundColor: 'var(--surface-charcoal)',
            border: activeStep === 2 ? '1px solid var(--biomass-ochre)' : '1px solid var(--border-industrial)',
            borderRadius: '8px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--biomass-ochre)' }}>
              STEP 02 • BACKEND ENGINE
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre-bg)',
              color: 'var(--biomass-ochre)',
              display: 'flex'
            }}>
              <AnimatedMapPinIcon size={20} color="var(--biomass-ochre)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Agregasi Kluster Otomatis
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Sistem menahan pasokan dalam radius 5–10 km hingga terkumpul <strong style={{ color: '#fff' }}>minimal 1.000 kg</strong>, lalu menerbitkan <strong style={{ color: '#fff' }}>Digital Pickup Manifest</strong> ke pembeli industri.
          </p>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => setActiveStep(3)}
          style={{
            backgroundColor: 'var(--surface-charcoal)',
            border: activeStep === 3 ? '1px solid var(--verified-green)' : '1px solid var(--border-industrial)',
            borderRadius: '8px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--verified-green)' }}>
              STEP 03 • BUYER & LOGISTICS
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--verified-green-bg)',
              color: 'var(--verified-green)',
              display: 'flex'
            }}>
              <AnimatedQrCodeIcon size={20} color="var(--verified-green)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Satu Rute & Web Handover
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Truk pembeli mengambil muatan mengikuti rute terpendek Google Maps. Sopir dan bengkel melakukan verifikasi serah terima instan via <strong style={{ color: '#fff' }}>Web PIN / QR Code</strong>.
          </p>
        </div>
      </div>

      {/* Digital Manifest Interactive Illustration Preview */}
      <div style={{
        backgroundColor: '#090c10',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AnimatedTruckIcon size={24} color="var(--biomass-ochre)" />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Digital Pickup Manifest #MNF-2026-881
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Status: 1.250 kg Teragregasi • Rute Efisien 7.4 km
            </div>
          </div>
        </div>

        <div style={{
          padding: '4px 10px',
          borderRadius: '4px',
          backgroundColor: 'var(--verified-green-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--verified-green)',
          fontSize: '0.75rem',
          fontWeight: 700,
          fontFamily: 'var(--font-mono)'
        }}>
          PIN VERIFIKASI: [ 892-104 ]
        </div>
      </div>
    </section>
  );
}
