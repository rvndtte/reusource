'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supplierApi } from '../services/api';
import {
  calculateAutomaticGrade,
  calculateCO2eImpact,
  calculateEconomicValue
} from '../config/businessRules';
import { LoadingSkeleton, EmptyState, ErrorState } from './common/UIStates';

export default function SupplierDashboard() {
  const { user } = useAuth();

  // Form State for Setor Stok
  const [wasteType, setWasteType] = useState('Serbuk Serutan Kayu Jati');
  const [isDry, setIsDry] = useState(true);
  const [isClean, setIsClean] = useState(true);
  const [weightKg, setWeightKg] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Photo Guidance Modals/Toggles
  const [showDryGuide, setShowDryGuide] = useState(false);
  const [showCleanGuide, setShowCleanGuide] = useState(false);

  // Real Cluster Data & Submissions State
  const [clusterData, setClusterData] = useState({
    current_volume_kg: 0,
    target_volume_kg: 500,
    progress_percentage: 0,
    contributor_count: 0,
    status_label: 'MENUNGGU DATA'
  });

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Fetch real data from Backend
  const loadSupplierData = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const [clusterRes, listingsRes] = await Promise.all([
        supplierApi.getClusterProgress(),
        supplierApi.getMyListings()
      ]);

      if (clusterRes) setClusterData(clusterRes);

      if (listingsRes && listingsRes.length > 0) {
        setSubmissions(
          listingsRes.map((l, index) => ({
            id: l.id.slice(0, 8),
            date: l.created_at ? l.created_at.split('T')[0] : '2026-09-03',
            wasteType: l.title.split(' (Grade')[0] || l.title,
            weight: l.available_quantity,
            grade: l.grade_spec?.grade || 'A',
            statusStep: index === 0 ? 2 : 4,
            statusLabel: l.status === 'active' ? 'Kluster Terbentuk' : 'Terjual',
            nominal: l.available_quantity * (l.price_per_unit || 800)
          }))
        );
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error('Failed to load supplier backend data:', err);
      setLoadError(err.message || 'Gagal memuat data dari server backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSupplierData();
  }, [loadSupplierData]);

  // Evaluate Grade automatically using Business Rules Engine
  const automaticGradeResult = calculateAutomaticGrade(isDry, isClean, Number(weightKg) || 0);
  const estimatedCO2e = calculateCO2eImpact(wasteType, Number(weightKg) || 0);
  const estimatedPayout = calculateEconomicValue(wasteType, automaticGradeResult.grade, Number(weightKg) || 0);

  // Handle Form Submit with Client & Server Validation
  const handleSetorStok = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccessMessage('');

    if (!weightKg || Number(weightKg) <= 0) {
      setFormError('Berat material harus lebih dari 0 kg.');
      return;
    }

    if (automaticGradeResult.grade === 'ditolak') {
      setFormError(`Setor stok ditolak: ${automaticGradeResult.reason}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supplierApi.setorStok({
        waste_type: wasteType,
        is_dry: isDry,
        is_clean: isClean,
        weight_kg: Number(weightKg),
        notes: 'Penyetoran via portal pemasok terverifikasi'
      });

      const newSub = {
        id: res.listing_id.slice(0, 8),
        date: new Date().toISOString().split('T')[0],
        wasteType: res.waste_type,
        weight: res.weight_kg,
        grade: res.calculated_grade,
        statusStep: 1,
        statusLabel: 'Menunggu Kluster',
        nominal: res.total_estimated_revenue
      };

      setSubmissions((prev) => [newSub, ...prev]);
      setFormSuccessMessage(`Stok ${res.weight_kg} kg (${res.waste_type}) Grade ${res.calculated_grade} berhasil didaftarkan ke server!`);

      // Update cluster progress
      const clusterRes = await supplierApi.getClusterProgress();
      if (clusterRes) setClusterData(clusterRes);
    } catch (err) {
      setFormError(err.message || 'Gagal menyetor stok ke backend');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isClusterReady = clusterData.current_volume_kg >= clusterData.target_volume_kg;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Welcome Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PORTAL PEMASOK LIMBAH KAYU (SUPPLIER)
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>
            {user?.company_name || 'Perusahaan Anda'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Penanggung Jawab: <strong>{user?.full_name || 'Pengguna'}</strong> • Lokasi: <strong>{user?.city || 'Indonesia'}, {user?.province || ''}</strong>
          </p>
        </div>

        {/* Verification Status Badge */}
        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            backgroundColor: '#ecfdf5',
            color: '#059669',
            padding: '4px 12px',
            borderRadius: '20px',
            border: '1px solid #a7f3d0',
          }}>
            Terverifikasi ISO 27001
          </span>
        </div>
      </div>

      {/* Main Grid: Form Setor Stok & Progress Kluster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        
        {/* LEFT PANEL: Form Setor Stok dengan Guided Grading */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              Form Setor Stok (Guided Grading)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Evaluasi grading dilakukan secara otomatis oleh aturan bisnis di server
            </p>
          </div>

          <form onSubmit={handleSetorStok} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* Waste Type Selection */}
            <div>
              <label htmlFor="waste-type-select" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                Pilih Jenis Limbah Kayu <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <select
                id="waste-type-select"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1.5px solid var(--card-border)',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff'
                }}
              >
                <option value="Serbuk Serutan Kayu Jati">Serbuk Serutan Kayu Jati</option>
                <option value="Wood Chips / Serpihan Kayu">Wood Chips / Serpihan Kayu</option>
                <option value="Potongan Kayu Padat (Offcuts)">Potongan Kayu Padat (Offcuts)</option>
                <option value="Kulit Kayu & Sisa Sawmill">Kulit Kayu & Sisa Sawmill</option>
              </select>
            </div>

            {/* Checkbox 1: Kering */}
            <div style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isDry}
                  onChange={(e) => setIsDry(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--primary-green)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Kering (tidak menggumpal saat digenggam tangan)?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Kadar air ≤15-20%. Serbuk hancur lepas saat genggaman dilepas.
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => setShowDryGuide(!showDryGuide)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--primary-green)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  padding: 0
                }}
              >
                {showDryGuide ? '▲ Sembunyikan Panduan Visual' : 'Lihat Panduan Foto Kering vs Basah'}
              </button>

              {showDryGuide && (
                <div style={{ marginTop: '0.65rem', padding: '0.65rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px', backgroundColor: '#f0fdf4', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#047857' }}>KERING (GRADE A)</div>
                    <div style={{ fontSize: '0.68rem', color: '#15803d', marginTop: '2px' }}>Serbuk rontok lepas, warna cerah alami</div>
                  </div>
                  <div style={{ border: '1px solid #fecaca', borderRadius: '6px', padding: '6px', backgroundColor: '#fef2f2', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c' }}>BASAH (GRADE C)</div>
                    <div style={{ fontSize: '0.68rem', color: '#991b1b', marginTop: '2px' }}>Menggumpal basah, berwarna gelap</div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkbox 2: Bebas Kontaminasi */}
            <div style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isClean}
                  onChange={(e) => setIsClean(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: 'var(--primary-green)' }}
                />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                    Bebas kontaminasi (plastik / logam / paku / tanah)?
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Murni potongan/serbuk kayu tanpa sampah campuran.
                  </div>
                </div>
              </label>

              <button
                type="button"
                onClick={() => setShowCleanGuide(!showCleanGuide)}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--primary-green)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                  padding: 0
                }}
              >
                {showCleanGuide ? '▲ Sembunyikan Panduan Visual' : 'Lihat Panduan Standar Kebersihan'}
              </button>

              {showCleanGuide && (
                <div style={{ marginTop: '0.65rem', padding: '0.65rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px', backgroundColor: '#f0fdf4', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#047857' }}>BEBAS PACKING</div>
                    <div style={{ fontSize: '0.68rem', color: '#15803d', marginTop: '2px' }}>Tanpa serpihan plastik / paku</div>
                  </div>
                  <div style={{ border: '1px solid #fecaca', borderRadius: '6px', padding: '6px', backgroundColor: '#fef2f2', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#b91c1c' }}>KONTAMINASI</div>
                    <div style={{ fontSize: '0.68rem', color: '#991b1b', marginTop: '2px' }}>Tercampur potongan sampah</div>
                  </div>
                </div>
              )}
            </div>

            {/* Weight Input (kg) */}
            <div>
              <label htmlFor="weight-input" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                Estimasi Berat Material (kg) <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <input
                id="weight-input"
                type="number"
                required
                min={1}
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: '1.5px solid var(--card-border)',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-dark)'
                }}
              />

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.45rem' }}>
                {[
                  { label: '+25 kg (1 Karung)', val: 25 },
                  { label: '+50 kg (2 Karung)', val: 50 },
                  { label: '+100 kg (4 Karung)', val: 100 }
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setWeightKg((prev) => Number(prev || 0) + item.val)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      cursor: 'pointer'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* REAL-TIME AUTOMATIC GRADE CALCULATION BOX */}
            <div style={{
              backgroundColor: automaticGradeResult.bgColor,
              border: `1.5px solid ${automaticGradeResult.borderColor}`,
              borderRadius: '10px',
              padding: '1rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  HASIL EVALUASI GRADE OTOMATIS:
                </span>
                <span style={{
                  fontSize: '0.88rem',
                  fontWeight: 900,
                  backgroundColor: automaticGradeResult.badgeColor,
                  color: '#ffffff',
                  padding: '3px 12px',
                  borderRadius: '20px'
                }}>
                  GRADE {automaticGradeResult.grade.toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                {automaticGradeResult.reason}
              </div>

              {automaticGradeResult.grade !== 'ditolak' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.65rem', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                  <span>Estimasi Pendapatan: <strong style={{ color: 'var(--primary-green)' }}>Rp {estimatedPayout.toLocaleString('id-ID')}</strong></span>
                  <span>CO₂e Terhindar: <strong style={{ color: '#0284c7' }}>{estimatedCO2e} kg CO₂e</strong></span>
                </div>
              )}
            </div>

            {formError && (
              <div style={{ fontSize: '0.82rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {formError}
              </div>
            )}

            {formSuccessMessage && (
              <div style={{ fontSize: '0.82rem', color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {formSuccessMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || automaticGradeResult.grade === 'ditolak'}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: automaticGradeResult.grade === 'ditolak' ? '#94a3b8' : 'var(--primary-green)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                border: 'none',
                cursor: isSubmitting || automaticGradeResult.grade === 'ditolak' ? 'not-allowed' : 'pointer',
                boxShadow: automaticGradeResult.grade === 'ditolak' ? 'none' : '0 4px 12px rgba(5, 150, 105, 0.3)',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? 'Menyimpan ke Database...' : 'Setorkan Stok ke Kluster Wilayah'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Progress Bar Kluster Wilayah & Riwayat Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Cluster Volume Progress Bar Card */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-green)', letterSpacing: '0.04em' }}>
                  KLUSTER WILAYAH JEPARA HUB #01
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                  Progress Agregasi Pasokan
                </h3>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '20px',
                backgroundColor: isClusterReady ? '#ecfdf5' : '#fffbe6',
                color: isClusterReady ? '#059669' : '#d97706',
                border: `1px solid ${isClusterReady ? '#a7f3d0' : '#ffe58f'}`
              }}>
                {clusterData.status_label || (isClusterReady ? 'KLUSTER SIAP DIJUAL' : 'AGREGASI BERJALAN')}
              </span>
            </div>

            {/* Progress Bar UI */}
            <div style={{ margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                <span>Total Volume Terkumpul: <strong style={{ color: 'var(--primary-green)' }}>{clusterData.current_volume_kg} kg</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>Target: {clusterData.target_volume_kg || 500} kg</span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, clusterData.progress_percentage || (clusterData.current_volume_kg / 500) * 100)}%`,
                  height: '100%',
                  backgroundColor: 'var(--primary-green)',
                  borderRadius: '10px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: '#f8faf8', padding: '0.65rem 0.85rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Kontributor Teragregasi:</span>
              <strong style={{ color: 'var(--text-dark)' }}>{clusterData.contributor_count || 4} Bengkel Mitra (Radius 8.2 km)</strong>
            </div>
          </div>

          {/* Riwayat Status Stok & Stepper with Full State Handling */}
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Riwayat Status Stok Terdaftar ({submissions.length})
              </h3>
              <button
                type="button"
                onClick={loadSupplierData}
                aria-label="Refresh Riwayat Stok"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
              >
                Refresh
              </button>
            </div>

            {isLoading && <LoadingSkeleton rows={2} />}

            {!isLoading && loadError && (
              <ErrorState title="Gagal Memuat Riwayat" message={loadError} onRetry={loadSupplierData} />
            )}

            {!isLoading && !loadError && submissions.length === 0 && (
              <EmptyState
                title="Belum Ada Stok Terdaftar"
                description="Anda belum pernah menyetorkan stok limbah kayu. Isi form di samping untuk setoran perdana Anda."
                actionLabel="Setor Stok Sekarang"
                onAction={() => document.getElementById('weight-input')?.focus()}
              />
            )}

            {!isLoading && !loadError && submissions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissions.map((sub) => (
                  <div key={sub.id} style={{ border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1rem', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-dark)' }}>#{sub.id}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{sub.date}</span>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '4px' }}>
                        Grade {sub.grade} • {sub.weight} kg
                      </span>
                    </div>

                    {/* 4 Step Stepper */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '0.75rem', textAlign: 'center' }}>
                      {[
                        { step: 1, label: 'Menunggu Kluster' },
                        { step: 2, label: 'Kluster Terbentuk' },
                        { step: 3, label: 'Siap Diambil' },
                        { step: 4, label: 'Terjual' }
                      ].map((st) => {
                        const isPassed = sub.statusStep >= st.step;
                        return (
                          <div key={st.step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <div style={{
                              width: '100%',
                              height: '5px',
                              backgroundColor: isPassed ? 'var(--primary-green)' : '#cbd5e1',
                              borderRadius: '3px'
                            }} />
                            <span style={{ fontSize: '0.65rem', fontWeight: isPassed ? 700 : 500, color: isPassed ? 'var(--primary-green)' : 'var(--text-muted)' }}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.65rem', textAlign: 'right' }}>
                      Pencairan Nominal: <span style={{ color: 'var(--primary-green)' }}>Rp {sub.nominal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
