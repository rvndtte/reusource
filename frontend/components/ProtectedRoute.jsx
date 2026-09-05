import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldIcon, AlertCircleIcon } from './common/Icons';

export default function ProtectedRoute({
  allowedRoles = [],
  requiredRoleName = 'Pengguna Terverifikasi',
  onOpenAuthModal,
  children
}) {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)'
      }}>
        Verifikasi otorisasi akun...
      </div>
    );
  }

  // If not logged in at all
  if (!isAuthenticated) {
    return (
      <div style={{
        maxWidth: '540px',
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        backgroundColor: '#ffffff',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ShieldIcon size={28} color="#2563eb" />
        </div>

        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
            Otentikasi Diperlukan
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
            Halaman ini dikunci dan hanya dapat diakses oleh akun <strong>{requiredRoleName}</strong> terverifikasi.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-green)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
            }}
          >
            Masuk Sekarang →
          </button>
        </div>
      </div>
    );
  }

  // If user role does not match allowed roles
  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(role);
  if (!hasRole) {
    return (
      <div style={{
        maxWidth: '540px',
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        backgroundColor: '#ffffff',
        border: '1.5px solid #fecaca',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(220, 38, 38, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <AlertCircleIcon size={28} color="#dc2626" />
        </div>

        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            HTTP 403 FORBIDDEN
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.5rem' }}>
            Akses Ditolak (Strict RBAC)
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
            Halaman ini khusus untuk akun <strong>{requiredRoleName}</strong>. Akun Anda saat ini (<strong>{user?.company_name || user?.full_name}</strong>) terdaftar dengan peran <code>{role}</code>.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            backgroundColor: '#f1f5f9',
            color: 'var(--text-dark)',
            border: '1px solid var(--card-border)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Keluar & Ganti Akun
        </button>
      </div>
    );
  }

  // Strict Verification Gate: Newly registered supplier or buyer must wait for admin verification
  const isPending = user?.verification_status === 'pending_verification';
  if (isPending && role !== 'admin' && role !== 'verifier') {
    return (
      <div style={{
        maxWidth: '560px',
        margin: '4rem auto',
        padding: '2.5rem 2rem',
        backgroundColor: '#ffffff',
        border: '1.5px solid #fef08a',
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(202, 138, 4, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.2rem'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#fefce8',
          border: '2px solid #fef08a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ca8a04',
          fontSize: '1.8rem'
        }}>
          ⏳
        </div>

        <div>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '3px 10px',
            borderRadius: '12px',
            letterSpacing: '0.04em'
          }}>
            ISO 27001 • MENUNGGU VERIFIKASI ADMIN
          </span>

          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '0.65rem' }}>
            Akun Menunggu Validasi Legalitas
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
            Halo <strong>{user?.full_name || 'Mitra'}</strong>, pendaftaran untuk <strong>{user?.company_name || 'Perusahaan Anda'}</strong> telah kami terima.
          </p>

          <div style={{
            margin: '1.25rem 0',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            textAlign: 'left',
            fontSize: '0.8rem',
            color: '#334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}>
            <div><strong>Perusahaan:</strong> {user?.company_name}</div>
            <div><strong>Kota/Provinsi:</strong> {user?.city}, {user?.province}</div>
            <div><strong>Status Audit:</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>Menunggu Validasi Verifier Lapangan</span></div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              💡 Verifier admin akan memvalidasi koordinat lokasi dan kelayakan mutu sebelum transaksi dapat dilakukan.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-green)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
            }}
          >
            🔄 Periksa Status Terbaru
          </button>

          <button
            type="button"
            onClick={logout}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              color: 'var(--text-dark)',
              border: '1px solid var(--card-border)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Keluar Akun
          </button>
        </div>
      </div>
    );
  }

  return children;
}
