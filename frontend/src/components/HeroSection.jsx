import React from 'react';
import { Leaf3DIcon, Money3DIcon, Radar3DIcon } from './ThreeDimensionalIcons';

export default function HeroSection({ onOpenSupplierModal, onOpenCatalogModal, onOpenAuthModal }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: '750px',
      backgroundColor: '#1b382b',
      backgroundImage: 'radial-gradient(circle at 50% 30%, #2a4d3b 0%, #132a20 70%, #0c1a14 100%)',
      overflow: 'hidden',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1.5rem 1.5rem'
    }}>
      {/* BACKGROUND ISOMETRIC LANDSCAPE CANVAS (SHIFTED UP SIGNIFICANTLY) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1400 780" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Winding Asphalt Roads in Middle Landscape (Shifted Up Y: 220px to 540px) */}
          <path d="M 180 220 C 260 260, 240 360, 380 375 C 480 395, 520 515, 440 615" stroke="#334155" strokeWidth="24" strokeLinecap="round" />
          <path d="M 180 220 C 260 260, 240 360, 380 375 C 480 395, 520 515, 440 615" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" opacity="0.4" />

          <path d="M 160 355 C 220 375, 300 385, 380 375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
          <path d="M 160 515 C 240 515, 300 455, 380 375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />
          <path d="M 260 595 C 340 595, 380 515, 380 375" stroke="#334155" strokeWidth="20" strokeLinecap="round" />

          {/* Main Delivery Highway from Central Hub to Factory */}
          <path d="M 380 375 C 580 355, 680 475, 840 455 C 960 435, 1080 495, 1220 455" stroke="#334155" strokeWidth="28" strokeLinecap="round" />
          <path d="M 380 375 C 580 355, 680 475, 840 455 C 960 435, 1080 495, 1220 455" stroke="#f59e0b" strokeWidth="2" strokeDasharray="10 8" opacity="0.6" />

          {/* ANIMATED GREEN GLOWING SUPPLY ROUTES */}
          <path d="M 180 220 C 260 260, 240 360, 380 375" stroke="#34d399" strokeWidth="4" strokeDasharray="8 6" className="animate-dash-flow" filter="url(#greenGlow)" />
          <path d="M 160 355 C 220 375, 300 385, 380 375" stroke="#34d399" strokeWidth="4" strokeDasharray="8 6" className="animate-dash-flow" filter="url(#greenGlow)" />
          <path d="M 160 515 C 240 515, 300 455, 380 375" stroke="#34d399" strokeWidth="4" strokeDasharray="8 6" className="animate-dash-flow" filter="url(#greenGlow)" />
          <path d="M 260 595 C 340 595, 380 515, 380 375" stroke="#34d399" strokeWidth="4" strokeDasharray="8 6" className="animate-dash-flow" filter="url(#greenGlow)" />

          {/* Highway Delivery Route from Hub to Factory */}
          <path d="M 380 375 C 580 355, 680 475, 840 455 C 960 435, 1080 495, 1220 455" stroke="#60a5fa" strokeWidth="4" strokeDasharray="10 8" className="animate-dash-flow" />

          {/* Concentric Radar Rings around Central Hub */}
          <circle cx="380" cy="375" r="140" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4" />
          <circle cx="380" cy="375" r="85" stroke="#34d399" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <circle cx="380" cy="375" r="35" fill="rgba(52, 211, 153, 0.2)" stroke="#34d399" strokeWidth="2" className="animate-pulse-ring" />

          {/* ISOMETRIC WORKSHOP BUILDINGS ON LEFT */}
          <g transform="translate(110, 180)">
            <polygon points="40,0 80,20 40,40 0,20" fill="#475569" />
            <polygon points="0,20 40,40 40,70 0,50" fill="#334155" />
            <polygon points="40,40 80,20 80,50 40,70" fill="#1e293b" />
            <rect x="50" y="45" width="25" height="12" rx="3" fill="#b45309" />
          </g>

          <g transform="translate(90, 315)">
            <polygon points="40,0 80,20 40,40 0,20" fill="#475569" />
            <polygon points="0,20 40,40 40,70 0,50" fill="#334155" />
            <polygon points="40,40 80,20 80,50 40,70" fill="#1e293b" />
          </g>

          <g transform="translate(90, 475)">
            <polygon points="40,0 80,20 40,40 0,20" fill="#475569" />
            <polygon points="0,20 40,40 40,70 0,50" fill="#334155" />
            <polygon points="40,40 80,20 80,50 40,70" fill="#1e293b" />
          </g>

          <g transform="translate(190, 555)">
            <polygon points="40,0 80,20 40,40 0,20" fill="#475569" />
            <polygon points="0,20 40,40 40,70 0,50" fill="#334155" />
            <polygon points="40,40 80,20 80,50 40,70" fill="#1e293b" />
          </g>

          {/* ISOMETRIC LOG WAREHOUSE CENTRAL HUB */}
          <g transform="translate(335, 335)">
            <polygon points="45,0 90,22 45,44 0,22" fill="#059669" />
            <polygon points="0,22 45,44 45,75 0,53" fill="#047857" />
            <polygon points="45,44 90,22 90,53 45,75" fill="#065f46" />
            <rect x="-15" y="50" width="35" height="15" rx="3" fill="#d97706" />
            <rect x="70" y="50" width="35" height="15" rx="3" fill="#d97706" />
          </g>

          {/* ISOMETRIC BIOMASS FACTORY ON RIGHT */}
          <g transform="translate(1080, 395)">
            <polygon points="70,0 140,35 70,70 0,35" fill="#475569" />
            <polygon points="0,35 70,70 70,120 0,85" fill="#334155" />
            <polygon points="70,70 140,35 140,85 70,120" fill="#1e293b" />
            <rect x="30" y="-30" width="12" height="40" fill="#64748b" />
            <rect x="50" y="-40" width="12" height="50" fill="#64748b" />
            <circle cx="36" cy="-45" r="8" fill="#e2e8f0" opacity="0.5" />
            <circle cx="56" cy="-55" r="10" fill="#e2e8f0" opacity="0.5" />
          </g>

          {/* ANIMATED GREEN LOGISTICS TRUCK (Driving along Highway) */}
          <g transform="translate(720, 430)" className="animate-truck-move">
            <rect x="0" y="0" width="70" height="38" rx="6" fill="#059669" />
            <rect x="52" y="8" width="28" height="30" rx="4" fill="#2563eb" />
            <circle cx="18" cy="38" r="7.5" fill="#0f172a" />
            <circle cx="60" cy="38" r="7.5" fill="#0f172a" />
            <text x="35" y="24" fontSize="10" fontWeight="800" textAnchor="middle" fill="#ffffff">REUSOURCE</text>
          </g>
        </svg>

        {/* ANIMATED FLOATING CHAT BUBBLE OVERLAYS (SHIFTED UP MATCHING MAP) */}

        {/* Chat Bubble 1: Bengkel A */}
        <div
          className="animate-float-bubble chat-bubble-container"
          style={{
            position: 'absolute',
            top: '160px',
            left: '80px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: '1.5px solid #34d399',
            boxShadow: '0 8px 20px rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🪵 Bengkel A</span>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Stok: 180 kg</span>
          <span style={{ color: '#34d399' }} className="animate-pulse-ring">●</span>
          <div className="chat-bubble-tail-left" style={{ color: '#34d399' }} />
        </div>

        {/* Chat Bubble 2: Bengkel B */}
        <div
          className="animate-float-bubble-alt chat-bubble-container"
          style={{
            position: 'absolute',
            top: '290px',
            left: '60px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: '1.5px solid #f59e0b',
            boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🪚 Bengkel B</span>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Stok: 190 kg</span>
          <span style={{ color: '#f59e0b' }} className="animate-pulse-ring">●</span>
          <div className="chat-bubble-tail-left" style={{ color: '#f59e0b' }} />
        </div>

        {/* Chat Bubble 3: Bengkel C */}
        <div
          className="animate-float-bubble chat-bubble-container"
          style={{
            position: 'absolute',
            top: '450px',
            left: '60px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: '1.5px solid #34d399',
            boxShadow: '0 8px 20px rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🪵 Bengkel C</span>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Stok: 150 kg</span>
          <span style={{ color: '#34d399' }} className="animate-pulse-ring">●</span>
          <div className="chat-bubble-tail-left" style={{ color: '#34d399' }} />
        </div>

        {/* Chat Bubble 4: Bengkel D */}
        <div
          className="animate-float-bubble-alt chat-bubble-container"
          style={{
            position: 'absolute',
            top: '530px',
            left: '160px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: '1.5px solid #34d399',
            boxShadow: '0 8px 20px rgba(52, 211, 153, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🪚 Bengkel D</span>
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Stok: 200 kg</span>
          <span style={{ color: '#34d399' }} className="animate-pulse-ring">●</span>
          <div className="chat-bubble-tail-left" style={{ color: '#34d399' }} />
        </div>

        {/* Auto Agregasi Card (Clean White Card - Shifted Up) */}
        <div
          style={{
            position: 'absolute',
            top: '395px',
            left: '290px',
            backgroundColor: '#ffffff',
            color: '#1e293b',
            padding: '0.75rem 1rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            border: '1px solid #e2eae0',
            minWidth: '165px'
          }}
        >
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', letterSpacing: '0.04em', display: 'block' }}>
            AUTO AGREGASI
          </span>
          <span style={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, display: 'block' }}>
            Berdasarkan Radius
          </span>
          <span className="tabular-nums" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669', display: 'block', margin: '2px 0' }}>
            1.520 kg
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '8px', display: 'inline-block' }}>
            ✓ SIAP JEMPUT
          </span>
        </div>

        {/* Chat Bubble 6: MILK-RUN ROUTE */}
        <div
          className="animate-float-bubble-alt chat-bubble-container"
          style={{
            position: 'absolute',
            top: '450px',
            left: '800px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid #34d399',
            color: '#ffffff',
            padding: '0.55rem 0.9rem',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🛵</span>
          <div>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em', display: 'block' }}>
              MILK-RUN ROUTE
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#e2e8f0' }}>
              Jemput rute paling efisien
            </span>
          </div>
          <div className="chat-bubble-tail-left" style={{ color: '#34d399' }} />
        </div>

        {/* Pabrik Briket Malang Card (Ultra-Minimal Map Callout Label - Shifted Up) */}
        <div
          className="animate-float-bubble chat-bubble-container"
          style={{
            position: 'absolute',
            top: '405px',
            right: '85px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: '0.65rem 0.95rem',
            borderRadius: '14px',
            textAlign: 'center',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
            border: '1.5px solid #60a5fa',
            minWidth: '155px'
          }}
        >
          <h5 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ffffff' }}>
            Pabrik Briket Malang
          </h5>
          <span className="tabular-nums" style={{ fontSize: '1rem', fontWeight: 800, color: '#60a5fa', display: 'block', margin: '2px 0' }}>
            1.500 kg / Hari
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.2)', padding: '2px 8px', borderRadius: '6px', display: 'inline-block' }}>
            ✓ AUTO MATCHED
          </span>
          <div className="chat-bubble-tail-right" style={{ color: '#60a5fa' }} />
        </div>
      </div>

      {/* FOREGROUND TOP CONTENT: Eyebrow, Headline, Subtitle, & Dual CTA */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: '880px',
        margin: '0.2rem auto 0',
        gap: '1.1rem'
      }}>

        {/* Big Bold Headline */}
        <h1 style={{
          fontSize: 'clamp(2.35rem, 4.8vw, 3.75rem)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)'
        }}>
          Ubah Tumpukan Serbuk Kayu<br />
          Jadi Pasokan Pabrik <span style={{ color: '#34d399' }}>Tanpa Ribet.</span>
        </h1>

        {/* Readable Subheadline */}
        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
          color: '#f1f5f9',
          lineHeight: 1.6,
          maxWidth: '740px',
          fontWeight: 600,
          textShadow: '0 2px 10px rgba(0,0,0,0.85)'
        }}>
          ReuSource mengumpulkan pasokan mikro serbuk kayu dari bengkel lokal di area Anda, lalu mengantarkannya langsung ke pabrik pembeli dalam satu muatan truk hemat biaya.
        </p>

        {/* Dual CTA Buttons (iPhone Liquid Glassmorphism) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginTop: '0.2rem'
        }}>
          {/* Primary Green Glass CTA */}
          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : onOpenSupplierModal()}
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.65), rgba(4, 120, 87, 0.45))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(5, 150, 105, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.25s ease'
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, display: 'block', lineHeight: 1.15, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Saya Punya Material
            </span>
            <span style={{ fontSize: '0.73rem', color: '#a7f3d0', fontWeight: 600, marginTop: '3px' }}>
              Setorkan limbah kayu
            </span>
          </button>

          {/* Secondary Blue Glass CTA */}
          <button
            onClick={() => onOpenAuthModal ? onOpenAuthModal('register') : onOpenCatalogModal()}
            style={{
              padding: '0.9rem 2.2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.65), rgba(29, 78, 216, 0.45))',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'all 0.25s ease'
            }}
          >
            <span style={{ fontSize: '1rem', fontWeight: 800, display: 'block', lineHeight: 1.15, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Saya Butuh Material
            </span>
            <span style={{ fontSize: '0.73rem', color: '#bfdbfe', fontWeight: 600, marginTop: '3px' }}>
              Cari pasokan sesuai kebutuhan
            </span>
          </button>
        </div>
      </div>

      {/* FLOATING BOTTOM LIVE MACRO DATA TICKER CARD (MOVED UP AGGRESSIVELY) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1100px',
        margin: '-2rem auto 0',
        transform: 'translateY(-30px)',
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #e2eae0',
        borderRadius: '20px',
        padding: '1.15rem 1.75rem',
        boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
        color: 'var(--text-dark)'
      }}>
        {/* Metric 1 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingRight: '1rem',
          borderRight: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#d1fae5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Leaf3DIcon size={30} />
          </div>
          <div>
            <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              2,4 Juta Ton
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
              Sisa serbuk kayu di Indonesia tiap tahun.
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingRight: '1rem',
          borderRight: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Money3DIcon size={30} />
          </div>
          <div>
            <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              Rp 4,8 Triliun
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
              Potensi uang yang hilang setiap tahun.
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Radar3DIcon size={30} />
          </div>
          <div>
            <div className="tabular-nums" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              100% Termanfaatkan
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
              Setiap grade serbuk kayu punya industrinya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
