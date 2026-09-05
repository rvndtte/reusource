import React from 'react';

// Custom Animated Layers Icon (Agregasi)
export function AnimatedLayersIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" className="animate-layer" />
      <path d="M2 12l10 5 10-5" style={{ animation: 'layer-float 3s ease-in-out infinite 0.2s' }} />
      <path d="M2 17l10 5 10-5" style={{ animation: 'layer-float 3s ease-in-out infinite 0.4s' }} />
    </svg>
  );
}

// Custom Animated Truck Icon (Logistik Langsung)
export function AnimatedTruckIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" fill="none" stroke={color} style={{ transformOrigin: '5.5px 18.5px', animation: 'wheel-spin 2s linear infinite' }} />
      <circle cx="18.5" cy="18.5" r="2.5" fill="none" stroke={color} style={{ transformOrigin: '18.5px 18.5px', animation: 'wheel-spin 2s linear infinite' }} />
      <path d="M0 22h24" stroke={color} strokeWidth="1.5" className="animate-dash" />
    </svg>
  );
}

// Custom Animated Shield Check Icon (Verifikasi Fisik & Audit)
export function AnimatedShieldIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="rgba(16, 185, 129, 0.08)" />
      <path d="M9 12l2 2 4-4" strokeDasharray="24" style={{ animation: 'check-draw 1.2s ease-out forwards' }} />
    </svg>
  );
}

// Custom Animated Flame Icon (Pembakaran Liar / Risk)
export function AnimatedFlameIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
    </svg>
  );
}

// Custom Animated Trending Down Icon (Kapasitas Pabrik Menganggur)
export function AnimatedTrendingDownIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

// Custom Animated Git Merge Icon (Penyatuan Suplai)
export function AnimatedGitMergeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 9v12" />
      <path d="M21 3a9 9 0 0 0-9 9v1" />
    </svg>
  );
}

// Custom Animated Sliders Icon (Parameter Fisik)
export function AnimatedSlidersIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

// Custom Animated Map Pin Icon (Agregasi Rute)
export function AnimatedMapPinIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" fill={color} />
    </svg>
  );
}

// Custom Animated QR Code Icon (Validasi Instan)
export function AnimatedQrCodeIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" fill={color} />
      <path d="M18 18h3v3h-3z" fill={color} />
      <path d="M14 18h1v3h-1z" />
    </svg>
  );
}

// Custom Animated Coins Icon (Pendapatan UMKM - SDG 8)
export function AnimatedCoinsIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M18 8a6 6 0 0 1-6 6" />
      <path d="M16 16a6 6 0 0 1-6 6" />
    </svg>
  );
}

// Custom Animated Refresh Icon (Sirkularitas - SDG 12)
export function AnimatedRefreshIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
    </svg>
  );
}

// Custom Animated Leaf Icon (Reduksi Karbon - SDG 13)
export function AnimatedLeafIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A60 60 0 0 0 2 2c10 0 17 2 20 11-1 3-3 6-7 8a13 13 0 0 1-4-1z" fill="rgba(16, 185, 129, 0.1)" />
      <path d="M2 2l10 10" />
    </svg>
  );
}

// Custom Animated Activity Icon
export function AnimatedActivityIcon({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="animate-dash" />
    </svg>
  );
}
