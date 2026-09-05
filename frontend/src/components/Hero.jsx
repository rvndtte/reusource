import React from 'react';
import { AnimatedLayersIcon, AnimatedTruckIcon, AnimatedShieldIcon } from './AnimatedIcons';
import MacroTicker from './MacroTicker';
import GeospatialClusterMap from './GeospatialClusterMap';

export default function Hero({ onOpenSupplierModal, onOpenCatalogModal }) {
  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '3.5rem 1.5rem 4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    }}>
      {/* 2-Column Hero Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        {/* Left Column: Eyebrow, Headline, Dual-CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* Eyebrow Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', alignSelf: 'flex-start' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '5px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(29, 78, 216, 0.08)',
              border: '1px solid rgba(29, 78, 216, 0.25)',
              color: 'var(--primary-blue)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}>
              <AnimatedLayersIcon size={16} color="var(--primary-blue)" />
              <span>B2B Biomass Supply Chain Orchestrator</span>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.1rem, 4vw, 2.9rem)',
            fontWeight: 700,
            lineHeight: 1.16,
            color: 'var(--text-main)',
            letterSpacing: '-0.025em'
          }}>
            Mengubah Serbuk Kayu Mikro Menjadi Rantai Pasok Industri.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '560px'
          }}>
            Agregasi pasokan limbah bengkel kayu lokal secara otomatis menjadi satu pintu logistik siap jemput untuk pabrik biomassa.
          </p>

          {/* Dual-CTA Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '0.5rem'
          }}>
            <button
              onClick={onOpenSupplierModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.8rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <AnimatedLayersIcon size={18} color="#ffffff" />
              <span>Pasok Limbah Bengkel</span>
            </button>

            <button
              onClick={onOpenCatalogModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.8rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.05)',
                transition: 'all 0.15s ease'
              }}
            >
              <AnimatedTruckIcon size={18} color="var(--accent-amber)" />
              <span>Pesan Kluster Pasokan</span>
            </button>
          </div>

          {/* Verification Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--accent-emerald)',
            marginTop: '0.25rem'
          }}>
            <AnimatedShieldIcon size={18} color="var(--accent-emerald)" />
            <span>Audit fisik kadar air & volume saat penjemputan logistik</span>
          </div>
        </div>

        {/* Right Column: Interactive Geospatial Cluster Map Visual */}
        <div>
          <GeospatialClusterMap />
        </div>
      </div>

      {/* Live Macro Data Ticker */}
      <MacroTicker />
    </section>
  );
}
