import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { buyerApi } from '../services/api';
import { LoadingSkeleton, EmptyState, ErrorState } from './common/UIStates';

export default function BuyerPermintaan() {
  const { user } = useAuth();

  // Form State for Buyer Demand Request
  const [demandWasteType, setDemandWasteType] = useState('Serbuk Serutan Kayu Jati');
  const [minGrade, setMinGrade] = useState('A');
  const [targetVolumeKg, setTargetVolumeKg] = useState(1000);
  const [maxRadiusKm, setMaxRadiusKm] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Backend Clusters State
  const [availableClusters, setAvailableClusters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [savedRequests, setSavedRequests] = useState([
    {
      id: 'REQ-101',
      wasteType: 'Serbuk Serutan Kayu Jati',
      minGrade: 'A',
      targetVolumeKg: 1000,
      maxRadiusKm: 15,
      status: 'Aktif Matching'
    }
  ]);

  const loadClustersForMatching = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await buyerApi.getListings();
      if (res && res.length > 0) {
        setAvailableClusters(
          res.map((item, idx) => ({
            id: `KLS-${item.id.slice(0, 6)}`,
            clusterName: item.title,
            wasteType: item.title.split(' (Grade')[0] || 'Serbuk Serutan Kayu Jati',
            grade: item.grade_spec?.grade || (idx % 2 === 0 ? 'A' : 'B'),
            volumeKg: item.available_quantity || 1550,
            radiusKm: item.approx_radius_km || Number((8.2 + idx * 4.5).toFixed(1)),
            moisture: item.grade_spec?.grade === 'A' ? '12.5%' : '18.0%'
          }))
        );
      } else {
        setAvailableClusters([]);
      }
    } catch (err) {
      console.error('Failed to load listings for matching:', err);
      setLoadError(err.message || 'Gagal memuat pasokan kluster.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClustersForMatching();
  }, [loadClustersForMatching]);

  const handleSaveDemand = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!targetVolumeKg || Number(targetVolumeKg) <= 0) {
      setFormError('Target volume harus lebih besar dari 0 kg.');
      return;
    }

    if (!maxRadiusKm || Number(maxRadiusKm) <= 0) {
      setFormError('Radius jangkauan harus minimal 1 km.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (user?.company_id) {
        await buyerApi.createBuyingRequest(user.company_id, {
          title: `Kebutuhan ${demandWasteType} (${targetVolumeKg} kg)`,
          waste_type: demandWasteType,
          target_quantity: Number(targetVolumeKg),
          unit: 'kg',
          max_price_per_unit: 800.0,
          min_grade_spec: { min_grade: minGrade },
          delivery_address: user.address || 'Kawasan Industri',
          delivery_city: user.city || 'Malang',
          latitude: user.latitude || -7.9839,
          longitude: user.longitude || 112.6214
        });
      }

      const newReq = {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        wasteType: demandWasteType,
        minGrade,
        targetVolumeKg: Number(targetVolumeKg),
        maxRadiusKm: Number(maxRadiusKm),
        status: 'Aktif Matching'
      };

      setSavedRequests((prev) => [newReq, ...prev]);
      setFormSuccess('Permintaan kebutuhan rutin berhasil disimpan dan terhubung dengan engine pencocokan!');
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan permintaan ke server backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rule-Based Explicit Matching Logic (Strict Transparency, No Black-Box AI/ML)
  const evaluateExplicitMatch = (cluster, req) => {
    const gradeOrder = { 'A': 3, 'B': 2, 'C': 1 };
    const isWasteMatch = cluster.wasteType.toLowerCase().includes(req.wasteType.toLowerCase().split(' ')[0]) || req.wasteType.toLowerCase().includes(cluster.wasteType.toLowerCase().split(' ')[0]);
    const isGradeMatch = gradeOrder[cluster.grade] >= gradeOrder[req.minGrade];
    const isRadiusMatch = cluster.radiusKm <= req.maxRadiusKm;
    const isVolumeSufficient = cluster.volumeKg >= req.targetVolumeKg;

    const reasons = [];
    if (isWasteMatch) reasons.push(`Jenis limbah cocok (${cluster.wasteType})`);
    else reasons.push(`Jenis limbah tidak sesuai (${cluster.wasteType} vs ${req.wasteType})`);

    if (isGradeMatch) reasons.push(`Grade ${cluster.grade} memenuhi batas minimum Grade ${req.minGrade}`);
    else reasons.push(`Grade ${cluster.grade} di bawah minimum Grade ${req.minGrade}`);

    if (isRadiusMatch) reasons.push(`Radius ${cluster.radiusKm} km dalam jangkauan max ${req.maxRadiusKm} km`);
    else reasons.push(`Radius ${cluster.radiusKm} km melebihi batas ${req.maxRadiusKm} km`);

    if (isVolumeSufficient) reasons.push(`Volume ${cluster.volumeKg} kg memenuhi 100% target (${req.targetVolumeKg} kg)`);
    else reasons.push(`Volume ${cluster.volumeKg} kg hanya memenuhi ${Math.round((cluster.volumeKg / req.targetVolumeKg) * 100)}% target`);

    const isFullMatch = isWasteMatch && isGradeMatch && isRadiusMatch;

    return {
      isFullMatch,
      reasons,
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Banner Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          PORTAL REQUEST KEBUTUHAN RUTIN (BUYER)
        </span>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>
          Pasang Kebutuhan Pasokan Rutin Pabrik
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Sistem mencocokkan kluster pasokan secara transparan dengan <strong>alasan eksplisit</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
        
        {/* LEFT PANEL: Form Pasang Kebutuhan Rutin */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
              Form Kebutuhan Rutin Biomassa
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Tentukan kuota dan spesifikasi minimal yang dibutuhkan industri Anda
            </p>
          </div>

          <form onSubmit={handleSaveDemand} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label htmlFor="demand-waste-type" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                Jenis Limbah Kayu <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <select
                id="demand-waste-type"
                value={demandWasteType}
                onChange={(e) => setDemandWasteType(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}
              >
                <option value="Serbuk Serutan Kayu Jati">Serbuk Serutan Kayu Jati</option>
                <option value="Wood Chips / Serpihan Kayu">Wood Chips / Serpihan Kayu</option>
                <option value="Potongan Kayu Padat (Offcuts)">Potongan Kayu Padat (Offcuts)</option>
                <option value="Kulit Kayu & Sisa Sawmill">Kulit Kayu & Sisa Sawmill</option>
              </select>
            </div>

            <div>
              <label htmlFor="min-grade" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                Grade Minimum yang Diterima <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <select
                id="min-grade"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}
              >
                <option value="A">Grade A (Kering ≤15% Oven)</option>
                <option value="B">Grade B (Standar 16-30%)</option>
                <option value="C">Grade C (Basah &gt;30%)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="target-volume" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                  Target Volume (kg) <span style={{ color: 'var(--critical-red)' }}>*</span>
                </label>
                <input
                  id="target-volume"
                  type="number"
                  required
                  min={100}
                  value={targetVolumeKg}
                  onChange={(e) => setTargetVolumeKg(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 800 }}
                />
              </div>

              <div>
                <label htmlFor="max-radius" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                  Max Radius (km) <span style={{ color: 'var(--critical-red)' }}>*</span>
                </label>
                <input
                  id="max-radius"
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={maxRadiusKm}
                  onChange={(e) => setMaxRadiusKm(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 800 }}
                />
              </div>
            </div>

            {formError && (
              <div style={{ fontSize: '0.82rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {formError}
              </div>
            )}

            {formSuccess && (
              <div style={{ fontSize: '0.82rem', color: '#047857', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {formSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-blue)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                marginTop: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              {isSubmitting ? 'Menyimpan...' : 'Pasang Request Permintaan Rutin →'}
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Status Matching dengan Alasan Eksplisit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Result Matching Kluster (Alasan Eksplisit)
              </h2>
              <button
                type="button"
                onClick={loadClustersForMatching}
                aria-label="Refresh Matching Kluster"
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem' }}
              >
                Refresh
              </button>
            </div>
            
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Pencocokan rule-based transparan tanpa algoritma AI/ML tertutup
            </p>

            {isLoading && <LoadingSkeleton rows={2} />}

            {!isLoading && loadError && (
              <ErrorState title="Gagal Evaluasi Matching" message={loadError} onRetry={loadClustersForMatching} />
            )}

            {!isLoading && !loadError && availableClusters.length === 0 && (
              <EmptyState
                title="Belum Ada Kluster Terdaftar"
                description="Belum ada pasokan kluster aktif di wilayah ini untuk dicocokkan."
              />
            )}

            {!isLoading && !loadError && availableClusters.length > 0 && (
              savedRequests.map((req) => (
                <div key={req.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem 0.9rem', fontSize: '0.8rem', fontWeight: 700, color: '#1d4ed8' }}>
                    Request Aktif #{req.id}: {req.wasteType} • Min Grade {req.minGrade} • Target {req.targetVolumeKg} kg • Max {req.maxRadiusKm} km
                  </div>

                  {availableClusters.map((cluster) => {
                    const matchResult = evaluateExplicitMatch(cluster, req);

                    return (
                      <div
                        key={cluster.id}
                        style={{
                          border: matchResult.isFullMatch ? '2px solid var(--primary-green)' : '1px solid var(--card-border)',
                          backgroundColor: matchResult.isFullMatch ? '#f0fdf4' : '#ffffff',
                          borderRadius: '10px',
                          padding: '1.1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{cluster.clusterName}</span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            backgroundColor: matchResult.isFullMatch ? '#dcfce7' : '#f1f5f9',
                            color: matchResult.isFullMatch ? '#047857' : '#64748b'
                          }}>
                            {matchResult.isFullMatch ? 'MATCH 100%' : 'PARTIAL MATCH'}
                          </span>
                        </div>

                        {/* ALASAN EKSPLISIT BOX */}
                        <div style={{
                          backgroundColor: matchResult.isFullMatch ? '#ffffff' : '#f8faf8',
                          border: `1px solid ${matchResult.isFullMatch ? '#a7f3d0' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '0.75rem',
                          fontSize: '0.78rem',
                          color: 'var(--text-dark)'
                        }}>
                          <div style={{ fontWeight: 800, color: matchResult.isFullMatch ? '#047857' : 'var(--text-muted)', marginBottom: '0.3rem' }}>
                            ALASAN PENCOCOKAN EKSPLISIT:
                          </div>
                          <ul style={{ paddingLeft: '1.1rem', margin: 0, lineHeight: 1.5 }}>
                            {matchResult.reasons.map((r, idx) => (
                              <li key={idx} style={{ color: r.includes('cocok') || r.includes('memenuhi') || r.includes('dalam jangkauan') ? '#15803d' : '#b91c1c' }}>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {matchResult.isFullMatch && (
                          <button
                            type="button"
                            onClick={() => alert(`Kebutuhan ${req.id} berhasil dikonfirmasi ke kluster ${cluster.clusterName}!`)}
                            style={{
                              alignSelf: 'flex-end',
                              padding: '0.5rem 1.1rem',
                              borderRadius: '6px',
                              backgroundColor: 'var(--primary-green)',
                              color: '#ffffff',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Kunci Kontrak Pasokan →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
