import React from 'react';
import { AlertCircleIcon, BoxIcon, RefreshIcon } from './Icons';

export function LoadingSpinner({ text = 'Memuat data dari server...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      gap: '0.75rem',
      color: 'var(--text-muted)',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid var(--primary-green)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{text}</div>
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            height: '70px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export function EmptyState({
  title = 'Belum Ada Data Tersedia',
  description = 'Data saat ini masih kosong atau belum ada entri yang terdaftar.',
  actionLabel = null,
  onAction = null,
  icon = null,
}) {
  return (
    <div style={{
      border: '1.5px dashed var(--card-border)',
      borderRadius: '14px',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#fafcfa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      margin: '0.5rem 0',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
      }}>
        {icon || <BoxIcon size={24} color="#64748b" />}
      </div>

      <div style={{ maxWidth: '420px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            marginTop: '0.5rem',
            padding: '0.55rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-green)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat menghubungkan ke server backend.',
  onRetry = null,
}) {
  return (
    <div style={{
      border: '1.5px solid #fecaca',
      borderRadius: '14px',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      backgroundColor: '#fef2f2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      margin: '0.5rem 0',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AlertCircleIcon size={24} color="#dc2626" />
      </div>

      <div style={{ maxWidth: '420px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.82rem', color: '#b91c1c', marginTop: '4px', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            marginTop: '0.35rem',
            padding: '0.5rem 1.15rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            color: '#991b1b',
            border: '1px solid #fca5a5',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <RefreshIcon size={14} color="#991b1b" /> Coba Lagi (Retry)
        </button>
      )}
    </div>
  );
}
