import React from 'react';

export default function BottomCTA({ onOpenSupplierModal, onOpenCatalogModal }) {
  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto 4rem',
      padding: '0 1.5rem'
    }}>
      <div style={{
        backgroundColor: '#059669',
        borderRadius: '20px',
        padding: '2.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(5, 150, 105, 0.25)'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
            fontWeight: 800,
            lineHeight: 1.2
          }}>
            Siap Mengubah Limbah Jadi Manfaat?
          </h2>
          <p style={{
            fontSize: '0.92rem',
            opacity: 0.95,
            marginTop: '0.4rem',
            lineHeight: 1.5
          }}>
            Gabung bersama ribuan bengkel, petani, dan industri menghasilkan dampak positif untuk lingkungan & ekonomi.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.85rem' }}>
          <button
            onClick={onOpenSupplierModal}
            style={{
              padding: '0.8rem 1.4rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '8px',
              backgroundColor: '#047857',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>Saya Punya Material</span>
            <span>➔</span>
          </button>

          <button
            onClick={onOpenCatalogModal}
            style={{
              padding: '0.8rem 1.4rem',
              fontSize: '0.88rem',
              fontWeight: 800,
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <span>Saya Butuh Material</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </section>
  );
}
