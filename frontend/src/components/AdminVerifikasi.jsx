import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import {
  ShieldIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshIcon,
  BoxIcon,
  FactoryIcon
} from './common/Icons';
import { LoadingSkeleton, EmptyState, ErrorState } from './common/UIStates';

export default function AdminVerifikasi() {
  const { user } = useAuth();

  // Pending Accounts Queue from Backend
  const [pendingList, setPendingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Selected User for Detailed Modal
  const [selectedUser, setSelectedUser] = useState(null);

  // Inclusive Criteria Checkbox State
  const [criteriaCheck, setCriteriaCheck] = useState({
    isMicro: true,
    isFirstTime: true,
    isGeoValid: true,
  });

  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  // Aggregate Impact Dashboard Metrics
  const [impactMetrics, setImpactMetrics] = useState({
    total_material_reused_tons: 8.0,
    total_co2_avoided_kg: 14400.0,
    total_supplier_revenue_idr: 91000000.0,
    total_buyer_savings_idr: 13650000.0
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [accRes, impactRes] = await Promise.all([
        adminApi.getPendingAccounts(),
        adminApi.getImpactDashboard()
      ]);

      if (accRes) setPendingList(accRes);
      if (impactRes) setImpactMetrics(impactRes);
    } catch (err) {
      console.error('Failed to load admin verification data:', err);
      setLoadError(err.message || 'Gagal memuat antrian audit dari server backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenReview = (u) => {
    setSelectedUser(u);
    setActionSuccess('');
    setCriteriaCheck({
      isMicro: u.is_micro_business ?? true,
      isFirstTime: u.is_first_time_seller ?? true,
      isGeoValid: true,
    });
    setAdminNotes(u.verification_notes || 'Lokasi usaha telah diverifikasi geospasial & memenuhi kriteria inklusivitas UMKM.');
  };

  const handleVerifyAction = async (decision) => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await adminApi.verifyAccount(selectedUser.company_id, decision, adminNotes);
      setActionSuccess(res.message || `Akun ${selectedUser.company_name} berhasil diverifikasi.`);
      setTimeout(() => {
        setSelectedUser(null);
        setActionSuccess('');
      }, 1500);
      await loadData();
    } catch (err) {
      alert(`Gagal memverifikasi akun: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header */}
      <div style={{
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderRadius: '14px',
        padding: '1.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldIcon size={14} color="#38bdf8" /> KONSOL ADMINISTRATOR & VERIFIER (ISO 27001)
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
            Audit & Verifikasi Pendaftaran Akun Inklusif
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Login sebagai: <strong>{user?.full_name || 'Admin'}</strong> ({user?.email})
          </p>
        </div>

        <button
          type="button"
          onClick={loadData}
          aria-label="Refresh Data Admin"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshIcon size={14} color="#ffffff" /> Refresh Audit
        </button>
      </div>

      {/* METRIK AGREGAT DAMPAK (PERSISTENT BACKEND) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL MATERIAL TERSALURKAN</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary-green)', marginTop: '4px' }}>
            {impactMetrics.total_material_reused_tons} Ton
          </div>
          <div style={{ fontSize: '0.72rem', color: '#15803d', marginTop: '2px' }}>Biomassa & Limbah Terkelola</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>EMISI KARBON TERHINDAR</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284c7', marginTop: '4px' }}>
            {impactMetrics.total_co2_avoided_kg.toLocaleString('id-ID')} kg CO₂e
          </div>
          <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: '2px' }}>Prevensi Pembakaran Terbuka</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDAPATAN PEMASOK UMKM</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-dark)', marginTop: '4px' }}>
            Rp {impactMetrics.total_supplier_revenue_idr.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Terserap ke Ekonomi Mikro</div>
        </div>
      </div>

      {/* ANTRIAN VERIFIKASI AKUN DENGAN FULL STATE HANDLING */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
          Antrian Verifikasi Pendaftaran Akun ({pendingList.length})
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Verifikasi profil legalitas, geospasial, dan terapkan checklist kriteria inklusivitas UMKM
        </p>

        {isLoading && <LoadingSkeleton rows={3} />}

        {!isLoading && loadError && (
          <ErrorState title="Gagal Memuat Antrian" message={loadError} onRetry={loadData} />
        )}

        {!isLoading && !loadError && pendingList.length === 0 && (
          <EmptyState
            title="Antrian Audit Bersih"
            description="Tidak ada pendaftaran akun yang berstatus pending verification saat ini."
          />
        )}

        {!isLoading && !loadError && pendingList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingList.map((item) => {
              const isPending = item.verification_status === 'pending_verification';
              const isApproved = item.verification_status === 'approved';
              const isSupplierType = item.company_type.includes('supplier');

              return (
                <div
                  key={item.company_id}
                  style={{
                    border: '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '1.2rem',
                    backgroundColor: isApproved ? '#f0fdf4' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      backgroundColor: isSupplierType ? '#ecfdf5' : '#eff6ff',
                      color: isSupplierType ? '#059669' : '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isSupplierType ? <BoxIcon size={22} color="#059669" /> : <FactoryIcon size={22} color="#2563eb" />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>
                          {item.company_name}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: isApproved ? '#dcfce7' : isPending ? '#fef3c7' : '#fee2e2',
                          color: isApproved ? '#15803d' : isPending ? '#92400e' : '#b91c1c'
                        }}>
                          {isApproved ? 'TERVERIFIKASI' : isPending ? 'MENUNGGU AUDIT' : 'DITOLAK'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Kontak: <strong>{item.contact_name}</strong> • WA: <strong>{item.phone}</strong> • Lokasi: {item.address} ({item.city})
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(item)}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      backgroundColor: isPending ? 'var(--navy-dark)' : '#ffffff',
                      color: isPending ? '#ffffff' : 'var(--text-dark)',
                      border: isPending ? 'none' : '1px solid var(--card-border)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isPending ? 'Review & Audit →' : 'Lihat Detail Audit'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL AUDIT & CHECKLIST KRITERIA INKLUSIF */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid var(--card-border)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {actionSuccess ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <CheckCircleIcon size={32} color="#059669" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)' }}>Status Berhasil Diperbarui</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{actionSuccess}</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-green)', letterSpacing: '0.04em' }}>
                      AUDIT PENDAFTARAN MITRA
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      {selectedUser.company_name}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedUser(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Profile Summary */}
                <div style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div>Penanggung Jawab: <strong>{selectedUser.contact_name}</strong></div>
                  <div>Nomor WhatsApp: <strong>{selectedUser.phone}</strong></div>
                  <div>Alamat Usaha: <strong>{selectedUser.address}, {selectedUser.city}</strong></div>
                  <div>Koordinat Geospasial: <strong>{selectedUser.latitude}, {selectedUser.longitude}</strong></div>
                </div>

                {/* CHECKLIST KRITERIA INKLUSIF */}
                <div style={{ backgroundColor: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1d4ed8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldIcon size={16} color="#1d4ed8" /> CHECKLIST KRITERIA INKLUSIF:
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={criteriaCheck.isMicro}
                        onChange={(e) => setCriteriaCheck({ ...criteriaCheck, isMicro: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                      />
                      <span>Usaha berskala mikro / sentra pengrajin (&lt; 5 pekerja)?</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={criteriaCheck.isFirstTime}
                        onChange={(e) => setCriteriaCheck({ ...criteriaCheck, isFirstTime: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                      />
                      <span>Belum pernah menjual limbah ini secara komersial sebelumnya?</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={criteriaCheck.isGeoValid}
                        onChange={(e) => setCriteriaCheck({ ...criteriaCheck, isGeoValid: e.target.checked })}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--primary-blue)' }}
                      />
                      <span>Titik pin peta geospasial valid & berada di wilayah kluster aktif?</span>
                    </label>
                  </div>
                </div>

                {/* Admin Notes Field */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="admin-audit-notes" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Catatan Verifikasi Admin <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <textarea
                    id="admin-audit-notes"
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Tuliskan catatan verifikasi fisik / alasan..."
                    style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.82rem' }}
                  />
                </div>

                {/* Action Buttons: Approve / Reject */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleVerifyAction('reject')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      border: '1px solid #fca5a5',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <AlertCircleIcon size={16} color="#b91c1c" /> Tolak Pendaftaran
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleVerifyAction('approve')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-green)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircleIcon size={16} color="#ffffff" /> Setujui (Approve) Akun
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
