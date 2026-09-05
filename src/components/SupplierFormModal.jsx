import React, { useState } from 'react';
import { AnimatedLayersIcon, AnimatedShieldIcon } from './AnimatedIcons';

export default function SupplierFormModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    workshopName: '',
    dailyVolumeKg: '',
    moisturePercent: '12',
    woodType: 'Jati / Hardwood Mixed',
    location: '',
    contactName: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-charcoal)',
          border: '1px solid var(--border-industrial)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '540px',
          padding: '1.75rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        {/* Header Modal */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '6px',
              borderRadius: '6px',
              backgroundColor: 'var(--biomass-ochre-bg)',
              color: 'var(--biomass-ochre)',
              display: 'flex'
            }}>
              <AnimatedLayersIcon size={20} color="var(--biomass-ochre)" />
            </div>
            <div>
              <h2 className="font-headline" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Form Input Parameter Limbah Bengkel
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Daftarkan pasokan serbuk kayu mikro untuk agregasi kluster
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div style={{ margin: '0 auto 1rem', display: 'flex', justifyContent: 'center' }}>
              <AnimatedShieldIcon size={52} color="var(--verified-green)" />
            </div>
            <h3 className="font-headline" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>Pasokan Berhasil Terdaftar!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Tim verifikasi fisik Bylink akan menjadwalkan audit sampel kadar air ke lokasi Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Nama Bengkel / Penggergajian Kayu <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: UD Limbah Jaya"
                value={formData.workshopName}
                onChange={(e) => setFormData({ ...formData, workshopName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  backgroundColor: '#0d1117',
                  border: '1px solid var(--border-industrial)',
                  borderRadius: '6px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Volume Limbah Harian (kg/hari) <span style={{ color: 'var(--critical-red)' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 500"
                  value={formData.dailyVolumeKg}
                  onChange={(e) => setFormData({ ...formData, dailyVolumeKg: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid var(--border-industrial)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Estimasi Kadar Air / Moisture (%)
                </label>
                <select
                  value={formData.moisturePercent}
                  onChange={(e) => setFormData({ ...formData, moisturePercent: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid var(--border-industrial)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                >
                  <option value="10">&lt; 10% (Kering Oven / Grade A)</option>
                  <option value="12">10% - 14% (Kering Alami / Grade B)</option>
                  <option value="18">&gt; 15% (Lembap / Grade C)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  Kota / Kabupaten Lokasi <span style={{ color: 'var(--critical-red)' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bandung, Jawa Barat"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid var(--border-industrial)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  No. WhatsApp Penanggung Jawab <span style={{ color: 'var(--critical-red)' }}>*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#0d1117',
                    border: '1px solid var(--border-industrial)',
                    borderRadius: '6px',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--verified-green)',
              backgroundColor: 'var(--verified-green-bg)',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <AnimatedShieldIcon size={18} color="var(--verified-green)" />
              <span>Metrik kuantitas & kualitas akan diverifikasi fisik saat handover.</span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-industrial)',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '0.65rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--biomass-ochre)',
                  border: 'none',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                Kirim Parameter Pasokan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
