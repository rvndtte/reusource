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

  return children;
}
