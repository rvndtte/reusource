import React, { useState } from 'react';
import { AnimatedTruckIcon, AnimatedShieldIcon } from './AnimatedIcons';

const CLUSTER_CATALOG = [
  { id: 'CL-ID-01', name: 'Kluster Pasokan Regional #1', volumeTon: '25.0 Ton', caloricValue: '4,350 kcal/kg', moisture: '11.2%', status: 'Ready Pickup', eta: 'Besok, 09:00 WIB' },
  { id: 'CL-ID-02', name: 'Kluster Industri Regional #2', volumeTon: '50.0 Ton', caloricValue: '4,420 kcal/kg', moisture: '10.8%', status: 'Ready Pickup', eta: 'Hari ini, 14:00 WIB' },
  { id: 'CL-ID-03', name: 'Kluster Agregat Regional #3', volumeTon: '15.5 Ton', caloricValue: '4,200 kcal/kg', moisture: '12.0%', status: 'Dalam Pemenuhan (85%)', eta: '2 Hari Lagi' },
];

export default function FactoryCatalogModal({ isOpen, onClose }) {
  const [orderedId, setOrderedId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-charcoal)',
          border: '1px solid var(--border-industrial)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '640px',
          padding: '1.75rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              color: 'var(--biomass-ochre-dark)',
              display: 'flex'
            }}>
              <AnimatedTruckIcon size={20} color="var(--biomass-ochre)" />
            </div>
            <div>
              <h2 className="font-headline" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Katalog Kluster Pasokan Biomassa Pabrik
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Order pasokan biomassa teragregasi siap kirim dengan garansi spesifikasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Catalog Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {CLUSTER_CATALOG.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid var(--border-industrial)',
                borderRadius: '6px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-dim)' }}>
                    [{item.id}]
                  </span>
                  <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  <span>Volume: <strong style={{ color: 'var(--text-primary)' }}>{item.volumeTon}</strong></span>
                  <span>Kalori: <strong style={{ color: 'var(--text-primary)' }}>{item.caloricValue}</strong></span>
                  <span>Kadar Air: <strong style={{ color: 'var(--text-primary)' }}>{item.moisture}</strong></span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--verified-green)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
                  <AnimatedShieldIcon size={14} color="var(--verified-green)" />
                  <span>Jadwal Penjemputan Armada: {item.eta}</span>
                </div>
              </div>

              {orderedId === item.id ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--verified-green)',
                  backgroundColor: 'var(--verified-green-bg)',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <span>✓ Booked</span>
                </div>
              ) : (
                <button
                  onClick={() => setOrderedId(item.id)}
                  style={{
                    padding: '0.55rem 0.95rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--biomass-ochre)',
                    color: '#000000',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)'
                  }}
                >
                  Pesan Kluster
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
