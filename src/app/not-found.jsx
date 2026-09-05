import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0f0d',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#10b981', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: '#94a3b8', maxWidth: '400px', marginBottom: '2rem' }}>
        Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#10b981',
          color: '#ffffff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
