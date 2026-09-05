import React, { useState, useEffect } from 'react';
import { AnimatedLayersIcon, AnimatedTruckIcon, AnimatedShieldIcon } from './AnimatedIcons';

export default function MacroTicker() {
  const [tonnage, setTonnage] = useState(0);
  const [valuation, setValuation] = useState(0);

  useEffect(() => {
    let animationFrame;
    const duration = 1800;
    const startTime = performance.now();

    const targetTonnage = 2.4;
    const targetValuation = 4.8;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setTonnage(targetTonnage * easeOut);
      setValuation(targetValuation * easeOut);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div style={{
      marginTop: '2.5rem',
      paddingTop: '1.75rem',
      borderTop: '1px solid var(--border-industrial)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.25rem'
    }}>
      {/* Item 1: Tonase */}
      <div style={{
        backgroundColor: 'var(--surface-charcoal)',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '1.2rem 1.3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div style={{
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: 'var(--biomass-ochre-bg)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: 'var(--biomass-ochre)',
            display: 'flex'
          }}>
            <AnimatedLayersIcon size={18} color="var(--biomass-ochre)" />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            MACRO SUPPLY VOLUME
          </span>
        </div>
        <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {tonnage.toFixed(1)} Juta Ton<span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>/Thn</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
          Timbulan serbuk kayu mikro Indonesia yang rawan dibakar terbuka.
        </p>
      </div>

      {/* Item 2: Valuasi Hilang */}
      <div style={{
        backgroundColor: 'var(--surface-charcoal)',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '1.2rem 1.3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div style={{
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            color: 'var(--biomass-ochre-dark)',
            display: 'flex'
          }}>
            <AnimatedTruckIcon size={18} color="var(--biomass-ochre)" />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            LOST RAW MATERIAL VALUE
          </span>
        </div>
        <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          Rp {valuation.toFixed(1)} Triliun
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
          Valuasi bahan baku biomassa yang hilang akibat rantai pasok terfragmentasi.
        </p>
      </div>

      {/* Item 3: 0% Greenwashing */}
      <div style={{
        backgroundColor: 'var(--surface-charcoal)',
        border: '1px solid var(--border-industrial)',
        borderRadius: '8px',
        padding: '1.2rem 1.3rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <div style={{
            padding: '6px',
            borderRadius: '6px',
            backgroundColor: 'var(--verified-green-bg)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: 'var(--verified-green)',
            display: 'flex'
          }}>
            <AnimatedShieldIcon size={18} color="var(--verified-green)" />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
            PHYSICAL AUDIT PROTOCOL
          </span>
        </div>
        <div className="tabular-nums" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--verified-green)', lineHeight: 1.2 }}>
          0% Greenwashing
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
          Metrik dampak diverifikasi fisik saat handover, bukan self-declared.
        </p>
      </div>
    </div>
  );
}
