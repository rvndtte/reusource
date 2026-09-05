import React, { useState, useEffect } from 'react';
import { AnimatedCoinsIcon, AnimatedRefreshIcon, AnimatedLeafIcon, AnimatedShieldIcon } from './AnimatedIcons';

export default function QuantifiableImpact() {
  const [accumulatedCo2, setAccumulatedCo2] = useState(14820);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccumulatedCo2((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

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
          backgroundColor: 'var(--verified-green-bg)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: 'var(--verified-green)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.85rem'
        }}>
          <span>QUANTIFIABLE IMPACT & SDG CERTIFICATION</span>
        </div>
        <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
          Dampak Terukur & Sirkularitas Bersertifikasi
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Metrik keberlanjutan terverifikasi fisik yang langsung diterjemahkan menjadi nilai ekonomi dan aksi iklim nyata.
        </p>
      </div>

      {/* 3 Impact Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* SDG 8 */}
        <div style={{
          backgroundColor: 'var(--surface-charcoal)',
          border: '1px solid var(--border-industrial)',
          borderRadius: '8px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--biomass-ochre)', letterSpacing: '0.05em' }}>
              SDG 8 • EKONOMI INKLUSIF
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre-bg)',
              color: 'var(--biomass-ochre)',
              display: 'flex'
            }}>
              <AnimatedCoinsIcon size={20} color="var(--biomass-ochre)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Monetisasi Sektor Informal
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Monetisasi limbah serbuk kayu mikro untuk pengrajin dan bengkel kayu skala mikro tanpa potongan perantara liar.
          </p>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-industrial)', paddingTop: '0.75rem' }}>
            Transparansi harga terkunci otomatis berdasarkan Grade parameter fisik.
          </div>
        </div>

        {/* SDG 12 */}
        <div style={{
          backgroundColor: 'var(--surface-charcoal)',
          border: '1px solid var(--border-industrial)',
          borderRadius: '8px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--biomass-ochre)', letterSpacing: '0.05em' }}>
              SDG 12 • SIRKULARITAS MATERIAL
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre-bg)',
              color: 'var(--biomass-ochre)',
              display: 'flex'
            }}>
              <AnimatedRefreshIcon size={20} color="var(--biomass-ochre)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Pengalihan Limbah Terbakar
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Serbuk gergaji dialihkan dari sisa pembakaran limbah menjadi bahan baku energi terbarukan kelas industri.
          </p>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-industrial)', paddingTop: '0.75rem' }}>
            Mencegah pencemaran abu partikulat mikro di permukiman lokal.
          </div>
        </div>

        {/* SDG 13 */}
        <div style={{
          backgroundColor: 'var(--surface-charcoal)',
          border: '1px solid var(--verified-green)',
          borderRadius: '8px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--verified-green)', letterSpacing: '0.05em' }}>
              SDG 13 • AKSI IKLIM NYATA
            </span>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--verified-green-bg)',
              color: 'var(--verified-green)',
              display: 'flex'
            }}>
              <AnimatedLeafIcon size={20} color="var(--verified-green)" />
            </div>
          </div>

          <h3 className="font-headline" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Sertifikat Reduksi Emisi CO2e
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
            Setiap transaksi menerbitkan sertifikat reduksi emisi $CO_2e$ yang diaudit matematis saat handover fisik.
          </p>

          <div style={{ fontSize: '0.78rem', color: 'var(--verified-green)', borderTop: '1px solid var(--border-industrial)', paddingTop: '0.75rem', fontWeight: 600 }}>
            Terverifikasi ISO 14064 Carbon Footprint Accounting.
          </div>
        </div>
      </div>

      {/* Industrial Certificate & Realtime Accumulated Emission Box */}
      <div className="cert-border-glow" style={{
        backgroundColor: '#090c10',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <AnimatedShieldIcon size={20} color="var(--verified-green)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--verified-green)', letterSpacing: '0.05em' }}>
              AKUMULASI REDUKSI EMISI EMISI REAL-TIME AUDITED
            </span>
          </div>
          <div className="tabular-nums" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.1 }}>
            {accumulatedCo2.toLocaleString('id-ID')} <span style={{ fontSize: '1.1rem', color: 'var(--verified-green)' }}>kg CO₂e</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Terakumulasi otomatis dari penyerahan fisik 148 node kluster jaringan Bylink.
          </p>
        </div>

        {/* Industrial Digital Stamp */}
        <div style={{
          border: '2px dashed var(--verified-green)',
          borderRadius: '8px',
          padding: '0.75rem 1.25rem',
          textAlign: 'center',
          backgroundColor: 'rgba(16, 185, 129, 0.05)'
        }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
            VERIFIED INDUSTRIAL STAMP
          </div>
          <div className="font-headline" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--verified-green)', marginTop: '2px' }}>
            BYLINK 0% GREENWASHING
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            MANIFEST AUDIT #2026-OK
          </div>
        </div>
      </div>
    </section>
  );
}
