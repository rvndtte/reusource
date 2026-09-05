import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { buyerApi } from '../services/api';
import { calculateCO2eImpact, calculateEconomicValue } from '../config/businessRules';
import {
  FactoryIcon,
  CheckCircleIcon,
  RefreshIcon,
  ArrowRightIcon,
  PinIcon
} from './common/Icons';
import { LoadingSkeleton, EmptyState, ErrorState } from './common/UIStates';

export default function BuyerKatalog() {
  const { user: _user } = useAuth();

  // Filter States
  const [filterType, setFilterType] = useState('Semua');
  const [filterGrade, setFilterGrade] = useState('Semua');
  const [filterRadius, setFilterRadius] = useState(25);
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Backend Clusters List State
  const [clusters, setClusters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Checkout Modal State
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const loadListings = useCallback(async () => {
    setIsLoading(true);
    setLoadError('');
    try {
      const res = await buyerApi.getListings();
      if (res && res.length > 0) {
        setClusters(
          res.map((item, idx) => ({
            id: `KLS-${item.id.slice(0, 6)}`,
            clusterName: item.title,
            wasteType: item.title.split(' (Grade')[0] || 'Biomassa Kayu',
            grade: item.grade_spec?.grade || 'N/A',
            moisture: item.grade_spec?.grade === 'A' ? '12.5% (Kering Oven)' : item.grade_spec?.grade === 'B' ? '18.0% (Kering Alami)' : '20.0% (Kadar Air Tinggi)',
            totalVolumeKg: item.available_quantity || 0,
            radiusKm: item.approx_radius_km || 0,
            status: item.status === 'active' ? 'Siap Dijual' : 'Menunggu Agregasi',
            umkmCount: 1, // Single supplier for now
            locationName: item.city || 'Indonesia'
          }))
        );
      } else {
        setClusters([]);
      }
    } catch (err) {
      console.error('Failed to load listings from backend:', err);
      setLoadError(err.message || 'Gagal memuat katalog pasokan biomassa dari backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  // Filter Logic
  const filteredClusters = clusters.filter((cluster) => {
    if (filterType !== 'Semua' && cluster.wasteType !== filterType) return false;
    if (filterGrade !== 'Semua' && cluster.grade !== filterGrade) return false;
    if (cluster.radiusKm > filterRadius) return false;
    if (filterStatus !== 'Semua' && cluster.status !== filterStatus) return false;
    return true;
  });

  const handleOpenCheckout = (cluster) => {
    setSelectedCluster(cluster);
    setPurchaseSuccess(false);
  };

  const handleConfirmPurchase = () => {
    setPurchaseSuccess(true);
    setTimeout(() => {
      setSelectedCluster(null);
      setPurchaseSuccess(false);
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '1.5rem 1.75rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            PORTAL PEMBELI BIOMASSA INDUSTRI (BUYER)
          </span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '2px' }}>
            Katalog Kluster Pasokan Biomassa Teragregasi
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Data pasokan teragregasi secara live dari database kluster logistik tanpa perantara liar
          </p>
        </div>

        <button
          type="button"
          onClick={loadListings}
          aria-label="Refresh Katalog Pasokan"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            border: '1px solid var(--card-border)',
            color: 'var(--text-dark)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <RefreshIcon size={14} /> Refresh Katalog
        </button>
      </div>

      {/* FILTER BAR CONTAINER */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        {/* Filter 1: Jenis Limbah */}
        <div>
          <label htmlFor="filter-waste-type" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
            Jenis Limbah Kayu
          </label>
          <select
            id="filter-waste-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <option value="Semua">Semua Jenis Limbah</option>
            <option value="Serbuk Serutan Kayu Jati">Serbuk Serutan Kayu Jati</option>
            <option value="Wood Chips / Serpihan Kayu">Wood Chips / Serpihan Kayu</option>
            <option value="Potongan Kayu Padat (Offcuts)">Potongan Kayu Padat</option>
            <option value="Kulit Kayu & Sisa Sawmill">Kulit Kayu & Sawmill</option>
          </select>
        </div>

        {/* Filter 2: Grade */}
        <div>
          <label htmlFor="filter-grade" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
            Grade Spesifikasi
          </label>
          <select
            id="filter-grade"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <option value="Semua">Semua Grade (A, B, C)</option>
            <option value="A">Grade A (Kering ≤15%)</option>
            <option value="B">Grade B (Standar 16-30%)</option>
            <option value="C">Grade C (Basah &gt;30%)</option>
          </select>
        </div>

        {/* Filter 3: Radius Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <span>Radius Jangkauan:</span>
            <span style={{ color: 'var(--primary-blue)' }}>≤ {filterRadius} km</span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="1"
            value={filterRadius}
            onChange={(e) => setFilterRadius(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary-blue)', cursor: 'pointer' }}
          />
        </div>

        {/* Filter 4: Status Kluster */}
        <div>
          <label htmlFor="filter-status" style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
            Status Kluster
          </label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <option value="Semua">Semua Status</option>
            <option value="Siap Dijual">Siap Dijual (≥ 500kg)</option>
            <option value="Menunggu Agregasi">Menunggu Agregasi (&lt; 500kg)</option>
          </select>
        </div>
      </div>

      {/* FULL STATE HANDLING: LOADING, ERROR, EMPTY, LIST */}
      {isLoading && <LoadingSkeleton rows={3} />}

      {!isLoading && loadError && (
        <ErrorState title="Gagal Memuat Katalog" message={loadError} onRetry={loadListings} />
      )}

      {!isLoading && !loadError && filteredClusters.length === 0 && (
        <EmptyState
          title="Tidak Ada Kluster yang Cocok"
          description="Tidak ditemukan pasokan biomassa dengan filter yang Anda tentukan. Coba perbesar radius jangkauan atau pilih semua grade."
          actionLabel="Reset Semua Filter"
          onAction={() => {
            setFilterType('Semua');
            setFilterGrade('Semua');
            setFilterRadius(25);
            setFilterStatus('Semua');
          }}
        />
      )}

      {!isLoading && !loadError && filteredClusters.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredClusters.map((cluster) => {
            const co2eSaved = calculateCO2eImpact(cluster.wasteType, cluster.totalVolumeKg);
            const totalPrice = calculateEconomicValue(cluster.wasteType, cluster.grade, cluster.totalVolumeKg);
            const isReady = cluster.status === 'Siap Dijual';

            return (
              <div
                key={cluster.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--card-border)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.2rem',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>{cluster.id}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      backgroundColor: isReady ? '#ecfdf5' : '#fffbe6',
                      color: isReady ? '#059669' : '#d97706',
                      border: `1px solid ${isReady ? '#a7f3d0' : '#ffe58f'}`
                    }}>
                      {cluster.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    {cluster.clusterName}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <PinIcon size={14} color="#64748b" /> {cluster.locationName} • Radius <strong>±{cluster.radiusKm} km</strong> dari Pabrik
                  </p>
                </div>

                <div style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Volume Pasokan:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
                      {cluster.totalVolumeKg.toLocaleString('id-ID')} kg
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '6px' }}>
                      Grade {cluster.grade}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#f1f5f9', color: 'var(--text-dark)', padding: '3px 8px', borderRadius: '6px' }}>
                      {cluster.moisture}
                    </span>
                  </div>
                </div>

                {/* DAMPAK PREVIEW CARD */}
                <div style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ fontWeight: 800, color: '#047857', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircleIcon size={14} color="#047857" /> DAMPAK PREVIEW PEMBELIAN:
                  </div>
                  <div style={{ color: '#15803d', display: 'flex', flexDirection: 'column', gap: '2px', fontWeight: 600 }}>
                    <div>• Prevensi Emisi: <strong>{co2eSaved} kg CO₂e</strong> terhindar</div>
                    <div>• Pemberdayaan: Membantu <strong>{cluster.umkmCount} Bengkel Mikro</strong></div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--card-border)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estimasi Total:</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(cluster)}
                    style={{
                      padding: '0.65rem 1.35rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--primary-blue)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    Beli Pasokan <ArrowRightIcon size={15} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {selectedCluster && (
        <div className="modal-backdrop" onClick={() => setSelectedCluster(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              border: '1px solid var(--card-border)'
            }}
          >
            {purchaseSuccess ? (
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-green)' }}>Transaksi Pembelian Berhasil!</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Armada logistik milk-run Bylink dijadwalkan menjemput pasokan dari {selectedCluster.umkmCount} bengkel mitra ke lokasi pabrik Anda.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FactoryIcon size={20} color="var(--primary-blue)" /> Konfirmasi Pembelian Biomassa
                  </h3>
                  <button onClick={() => setSelectedCluster(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                <div style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '10px', padding: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-dark)' }}>{selectedCluster.clusterName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedCluster.wasteType}</div>

                  <div style={{ borderTop: '1px dashed #cbd5e1', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Volume:</span>
                      <strong>{selectedCluster.totalVolumeKg} kg</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Grade Material:</span>
                      <strong>Grade {selectedCluster.grade}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Jarak Pengiriman:</span>
                      <strong>±{selectedCluster.radiusKm} km</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--primary-blue)', borderTop: '1px solid #cbd5e1', paddingTop: '0.4rem' }}>
                      <span>Total Tagihan:</span>
                      <span>Rp {calculateEconomicValue(selectedCluster.wasteType, selectedCluster.grade, selectedCluster.totalVolumeKg).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmPurchase}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  Konfirmasi Pembelian & Jadwalkan Truk →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
