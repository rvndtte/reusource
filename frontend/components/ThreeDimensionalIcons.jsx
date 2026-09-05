import React from 'react';

// 1. 3D Matchmaking Jigsaw Puzzle Icon
export function Puzzle3DIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="puzGrad1" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="puzGrad3" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="shadow3d" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path
        d="M12 16C12 13.7909 13.7909 12 16 12H28C28 15.3137 30.6863 18 34 18C37.3137 18 40 15.3137 40 12H48C50.2091 12 52 13.7909 52 16V28C48.6863 28 46 30.6863 46 34C46 37.3137 48.6863 40 52 40V48C52 50.2091 50.2091 52 48 52H40C40 48.6863 37.3137 46 34 46C30.6863 46 28 48.6863 28 52H16C13.7909 52 12 50.2091 12 48V40C15.3137 40 18 37.3137 18 34C18 30.6863 15.3137 28 12 28V16Z"
        fill="url(#puzGrad1)"
        filter="url(#shadow3d)"
      />
      <path d="M16 14H26C28.5 18 39.5 18 42 14H46" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <circle cx="34" cy="34" r="7" fill="url(#puzGrad3)" filter="url(#shadow3d)" />
      <circle cx="34" cy="34" r="3" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

// 2. 3D Auto Agregasi Target Radar Icon
export function Radar3DIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ringGrad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#radarGlow)" />
      <circle cx="32" cy="32" r="22" stroke="url(#ringGrad)" strokeWidth="4" />
      <circle cx="32" cy="32" r="14" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="4 3" opacity="0.85" />
      <circle cx="32" cy="32" r="3.5" fill="#ffffff" />
      <line x1="32" y1="6" x2="32" y2="58" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

// 3. 3D Rute Optimal Map Pin Icon
export function Route3DIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pinGrad" x1="32" y1="6" x2="32" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <filter id="pinShadow">
          <feDropShadow dx="3" dy="5" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>
      <path d="M10 48 C 22 38, 42 58, 54 44" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g filter="url(#pinShadow)">
        <path d="M32 6C23.1634 6 16 13.1634 16 22C16 32.5 32 46 32 46C32 46 48 32.5 48 22C48 13.1634 40.8366 6 32 6Z" fill="url(#pinGrad)" />
        <circle cx="32" cy="21" r="7" fill="#ffffff" />
        <circle cx="32" cy="21" r="4" fill="#b91c1c" />
      </g>
    </svg>
  );
}

// 4. 3D Transaksi Aman Golden Shield Icon
export function Shield3DIcon({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <filter id="shieldShadow">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter="url(#shieldShadow)">
        <path d="M32 6L14 14V28C14 41.5 22.5 53.5 32 58C41.5 53.5 50 41.5 50 28V14L32 6Z" fill="url(#shieldGrad)" />
        <path d="M25 29L30.5 34.5L39.5 23.5" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// 5. 3D Fire / Flame Icon 🔥
export function Fire3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fireGrad1" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="fireGrad2" x1="24" y1="16" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <path d="M24 4C24 4 12 18 12 28C12 34.6274 17.3726 40 24 40C30.6274 40 36 34.6274 36 28C36 18 24 4 24 4Z" fill="url(#fireGrad1)" />
      <path d="M24 16C24 16 18 24 18 30C18 33.3137 20.6863 36 24 36C27.3137 36 30 33.3137 30 30C30 24 24 16 24 16Z" fill="url(#fireGrad2)" />
    </svg>
  );
}

// 6. 3D Money / Coins Stack Icon 💰 💸
export function Money3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="coinGrad" x1="6" y1="12" x2="42" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="18" fill="url(#coinGrad)" stroke="#d97706" strokeWidth="2" />
      <circle cx="24" cy="24" r="13" border="1.5px stroke #fef08a" stroke="#fef08a" strokeWidth="1.5" />
      <text x="24" y="31" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#78350f" fontFamily="sans-serif">$</text>
    </svg>
  );
}

// 7. 3D Warning Triangle Icon ⚠️
export function Warning3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="warnGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <path d="M24 6L44 40H4L24 6Z" fill="url(#warnGrad)" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 18V28" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <circle cx="24" cy="34" r="2.5" fill="#ffffff" />
    </svg>
  );
}

// 8. 3D Smoke / Cloud Icon 💨 ☁️
export function Cloud3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cloudGrad" x1="8" y1="12" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <path d="M14 34C9.58172 34 6 30.4183 6 26C6 22.0435 8.86879 18.751 12.671 18.1187C14.072 12.8797 18.826 9 24.5 9C31.4036 9 37 14.5964 37 21.5C40.866 21.5 44 24.634 44 28.5C44 32.366 40.866 35.5 37 35.5H14" fill="url(#cloudGrad)" />
    </svg>
  );
}

// 9. 3D Eco Leaf Sprout Icon 🌱
export function Leaf3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <path d="M38 10C24 10 12 20 12 36C22 36 38 28 38 10Z" fill="url(#leafGrad)" />
      <path d="M12 36C18 28 26 22 34 16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// 10. 3D Factory Building Icon 🏬
export function Factory3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="factGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>
      <path d="M8 40V20L18 26V20L28 26V12L40 6V40H8Z" fill="url(#factGrad)" stroke="#1e3a8a" strokeWidth="2" />
      <rect x="14" y="30" width="4" height="6" fill="#ffffff" opacity="0.8" />
      <rect x="22" y="30" width="4" height="6" fill="#ffffff" opacity="0.8" />
      <rect x="30" y="30" width="4" height="6" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

// 11. 3D Parcel Box Icon 📦
export function Box3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boxGrad" x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
      </defs>
      <path d="M24 6L40 14V34L24 42L8 34V14L24 6Z" fill="url(#boxGrad)" stroke="#78350f" strokeWidth="2" />
      <path d="M24 6V42" stroke="#78350f" strokeWidth="1.5" />
      <path d="M8 14L24 22L40 14" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  );
}

// 12. 3D Mushroom / Bio Sprout Icon 🍄
export function Mushroom3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mushCap" x1="8" y1="8" x2="40" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>
      <path d="M18 26V40C18 41.1 19.8 42 24 42C28.2 42 30 41.1 30 40V26" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <path d="M8 26C8 15 15 8 24 8C33 8 40 15 40 26H8Z" fill="url(#mushCap)" />
      <circle cx="16" cy="18" r="3" fill="#ffffff" />
      <circle cx="30" cy="16" r="2.5" fill="#ffffff" />
      <circle cx="24" cy="22" r="2" fill="#ffffff" />
    </svg>
  );
}

// 13. 3D Logistics Truck Icon 🚚
export function Truck3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="truckGrad" x1="6" y1="10" x2="42" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="24" height="18" rx="3" fill="url(#truckGrad)" />
      <path d="M30 20H38L42 26V32H30V20Z" fill="#2563eb" />
      <circle cx="14" cy="34" r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="34" cy="34" r="4" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

// 14. 3D Gear Machine Icon ⚙️
export function Gear3DIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gearGrad" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="16" fill="url(#gearGrad)" stroke="#1e293b" strokeWidth="2" />
      <circle cx="24" cy="24" r="6" fill="#f8fafc" />
    </svg>
  );
}
