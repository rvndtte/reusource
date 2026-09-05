import React from 'react';
import { Fire3DIcon, Box3DIcon, Mushroom3DIcon } from './ThreeDimensionalIcons';

const GRADES = [
  {
    grade: 'GRADE A',
    name: 'Kering (≤ 15%)',
    badgeColor: '#059669',
    badgeBg: '#ecfdf5',
    image: '/assets/grade_a.jpg',
    desc: 'Serbuk halus dari kayu olahan kering (oven).',
    buyer: 'Pabrik briket arang ekspor, pelet kayu, boiler pabrik.',
    price: 'Rp 500 – 800 /kg',
    icon: <Fire3DIcon size={30} />
  },
  {
    grade: 'GRADE B',
    name: 'Lembap (16–30%)',
    badgeColor: '#d97706',
    badgeBg: '#fffbe6',
    image: '/assets/grade_b.jpg',
    desc: 'Serpihan kayu campur, disimpan di tempat semi-tertutup.',
    buyer: 'Pembakaran bata merah, pabrik semen, alas kandang.',
    price: 'Rp 250 – 400 /kg',
    icon: <Box3DIcon size={30} />
  },
  {
    grade: 'GRADE C',
    name: 'Basah (> 30%)',
    badgeColor: '#2563eb',
    badgeBg: '#eff6ff',
    image: '/assets/grade_c.jpg',
    desc: 'Serbuk kayu basah segar dari potongan log.',
    buyer: 'Petani jamur, pembuat kompos, media tanam.',
    price: 'Rp 150 – 250 /kg',
    icon: <Mushroom3DIcon size={30} />
  }
];

export default function MaterialGrades() {
  return (
    <section style={{
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2.5rem 1.5rem 3.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.75rem'
    }}>
      <h2 style={{
        fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
        fontWeight: 800,
        color: 'var(--text-dark)',
        letterSpacing: '-0.02em'
      }}>
        3 Grade Material, Semua Punya Nilai
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {GRADES.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--card-border)',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: item.badgeColor, letterSpacing: '0.05em' }}>
                    {item.grade}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    {item.name}
                  </h3>
                </div>
                <div className="icon-3d-box" style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: item.badgeBg
                }}>
                  {item.icon}
                </div>
              </div>

              <div style={{
                width: '100%',
                height: '160px',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '1rem',
                border: '1px solid #e2e8f0'
              }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '0.5rem' }}>
                {item.desc}
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Pembeli:</strong> {item.buyer}
              </div>
            </div>

            <div style={{
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span className="tabular-nums" style={{ fontSize: '1.15rem', fontWeight: 800, color: item.badgeColor }}>
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
