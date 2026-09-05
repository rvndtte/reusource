import React, { useState } from 'react';
import { AnimatedSlidersIcon, AnimatedCoinsIcon, AnimatedLeafIcon, AnimatedShieldIcon } from './AnimatedIcons';

export default function InteractiveSimulator({ onOpenSupplierModal }) {
  const [bagCount, setBagCount] = useState(40); // 10 to 100 bags (50 kg / bag)

  // Calculations
  const totalKg = bagCount * 50;
  const estimatedRevenueMin = (totalKg * 450).toLocaleString('id-ID'); // Rp 450 / kg
  const estimatedRevenueMax = (totalKg * 650).toLocaleString('id-ID'); // Rp 650 / kg
  const co2ReducedKg = Math.round(totalKg * 0.92); // 0.92 kg CO2e reduced per kg sawdust
  const aggregationHours = Math.max(12, Math.round(72 - (bagCount * 0.5)));

  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '4rem 1.5rem 5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
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
          <AnimatedSlidersIcon size={14} color="var(--biomass-ochre)" />
          <span>INTERACTIVE SIMULATOR</span>
        </div>
        <h2 className="font-headline" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
          Hitung Nilai Ekonomi & Dampak Bengkel Anda.
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Geser slider di bawah ini untuk melihat estimasi langsung pendapatan dan reduksi karbon dari limbah kayu Anda.
        </p>
      </div>

      {/* Simulator Control Box */}
      <div style={{
        backgroundColor: 'var(--surface-charcoal)',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '860px',
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Slider Input */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Kapasitas Limbah Serbuk Kayu Harian / Mingguan:
            </label>
            <div className="tabular-nums" style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--biomass-ochre)',
              backgroundColor: '#0d1117',
              padding: '4px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-industrial)'
            }}>
              {bagCount} Karung Standard <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({totalKg.toLocaleString('id-ID')} kg)</span>
            </div>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={bagCount}
            onChange={(e) => setBagCount(Number(e.target.value))}
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#0d1117',
              borderRadius: '4px',
              accentColor: 'var(--biomass-ochre)',
              cursor: 'pointer'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
            <span>10 Karung (500 kg)</span>
            <span>50 Karung (2.500 kg)</span>
            <span>100 Karung (5.000 kg)</span>
          </div>
        </div>

        {/* Real-time Output Counters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Revenue */}
          <div style={{
            backgroundColor: '#0d1117',
            border: '1px solid var(--border-industrial)',
            borderRadius: '6px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--biomass-ochre)', marginBottom: '0.4rem' }}>
              <AnimatedCoinsIcon size={18} color="var(--biomass-ochre)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>ESTIMASI PENDAPATAN</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Rp {estimatedRevenueMin} - {estimatedRevenueMax}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Per siklus penjemputan</span>
          </div>

          {/* CO2 Reduction */}
          <div style={{
            backgroundColor: '#0d1117',
            border: '1px solid var(--border-industrial)',
            borderRadius: '6px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--verified-green)', marginBottom: '0.4rem' }}>
              <AnimatedLeafIcon size={18} color="var(--verified-green)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>CO₂e TERALIHKAN</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--verified-green)' }}>
              {co2ReducedKg.toLocaleString('id-ID')} kg CO₂e
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Cegah pembakaran terbuka</span>
          </div>

          {/* Aggregation Time */}
          <div style={{
            backgroundColor: '#0d1117',
            border: '1px solid var(--border-industrial)',
            borderRadius: '6px',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <AnimatedShieldIcon size={18} color="var(--text-muted)" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em' }}>WAKTU AGREGASI</span>
            </div>
            <div className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ~{aggregationHours} Jam
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Pencapaian kuota kluster</span>
          </div>
        </div>

        {/* CTA Trigger */}
        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={onOpenSupplierModal}
            style={{
              padding: '0.85rem 2rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre)',
              color: '#000000',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            Daftarkan Pasokan Bengkel Sekarang
          </button>
        </div>
      </div>
    </section>
  );
}
