'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Header({
  buyerTab = 'katalog',
  onSwitchBuyerTab,
  onOpenAuthModal
}) {
  const { user, isSupplier, isBuyer, isAdmin, isAuthenticated, logout } = useAuth();

  // --------------------------------------------------------------------------
  // 1. SUPPLIER PORTAL HEADER (Strict RBAC for Supplier Role)
  // --------------------------------------------------------------------------
  if (isAuthenticated && isSupplier) {
    return (
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #059669',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand & Supplier Badge */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-dark)' }}>
                ReuSource Pemasok
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: '#ecfdf5',
                color: '#059669',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #a7f3d0'
              }}>
                PORTAL SUPPLIER
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {user?.company_name || 'Perusahaan Anda'} ({user?.full_name || 'Pengguna'})
            </div>
          </div>

          {/* Supplier Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
              Setor Stok & Kluster Wilayah
            </span>
            <button
              onClick={logout}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fecaca',
                cursor: 'pointer',
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
    );
  }

  // --------------------------------------------------------------------------
  // 2. BUYER PORTAL HEADER (Strict RBAC for Buyer Role)
  // --------------------------------------------------------------------------
  if (isAuthenticated && isBuyer) {
    return (
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #2563eb',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand & Buyer Badge */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-dark)' }}>
                ReuSource Pembeli
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe'
              }}>
                PORTAL BUYER
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {user?.company_name || 'Perusahaan Anda'} ({user?.full_name || 'Pengguna'})
            </div>
          </div>

          {/* Buyer Navigation Sub-Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 700 }}>
            <button
              onClick={() => onSwitchBuyerTab && onSwitchBuyerTab('katalog')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: buyerTab === 'katalog' ? '#2563eb' : 'var(--text-muted)',
                borderBottom: buyerTab === 'katalog' ? '2.5px solid #2563eb' : '2.5px solid transparent',
                paddingBottom: '4px',
                fontWeight: 700
              }}
            >
              Katalog Pasokan
            </button>

            <button
              onClick={() => onSwitchBuyerTab && onSwitchBuyerTab('permintaan')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: buyerTab === 'permintaan' ? '#2563eb' : 'var(--text-muted)',
                borderBottom: buyerTab === 'permintaan' ? '2.5px solid #2563eb' : '2.5px solid transparent',
                paddingBottom: '4px',
                fontWeight: 700
              }}
            >
              Request Kebutuhan
            </button>

            <button
              onClick={() => onSwitchBuyerTab && onSwitchBuyerTab('pesanan')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: buyerTab === 'pesanan' ? '#2563eb' : 'var(--text-muted)',
                borderBottom: buyerTab === 'pesanan' ? '2.5px solid #2563eb' : '2.5px solid transparent',
                paddingBottom: '4px',
                fontWeight: 700
              }}
            >
              Pantau Pesanan &amp; Logistik
            </button>

            <button
              onClick={logout}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fecaca',
                cursor: 'pointer',
                marginLeft: '0.5rem',
              }}
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
    );
  }

  // --------------------------------------------------------------------------
  // 3. ADMIN CONSOLE HEADER (Strict RBAC for Admin Role)
  // --------------------------------------------------------------------------
  if (isAuthenticated && isAdmin) {
    return (
      <header style={{
        backgroundColor: '#0f172a',
        borderBottom: '2px solid #334155',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        color: '#ffffff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand & Admin Badge */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                Bylink Admin Console
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(239, 68, 68, 0.4)'
              }}>
                INTERNAL SYSTEM (ISO 27001)
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8' }}>
              Verifier: {user?.full_name || 'Admin'} ({user?.email})
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700 }}>
              Verifikasi Akun Baru & Dashboard Ringkas
            </span>
            <button
              onClick={logout}
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '6px',
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: '1px solid #475569',
                cursor: 'pointer',
              }}
            >
              Keluar Konsol
            </button>
          </div>
        </div>
      </header>
    );
  }

  // --------------------------------------------------------------------------
  // 4. PUBLIC LANDING PAGE HEADER (Guest / Unauthenticated)
  // --------------------------------------------------------------------------
  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--card-border)',
      padding: '0.85rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-dark)', lineHeight: 1.1 }}>
              ReuSource
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Material, Connected.
            </div>
          </div>
        </div>

        {/* Center Nav Links for Landing Page */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.75rem',
          fontSize: '0.88rem',
          fontWeight: 600
        }}>
          <a href="#hero-section" style={{ color: 'var(--primary-green)', textDecoration: 'none', borderBottom: '2px solid var(--primary-green)', paddingBottom: '4px' }}>Beranda</a>
          <a href="#cara-kerja-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Cara Kerja</a>
          <a href="#masalah-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Tentang Kami</a>
          <a href="#fakta-sdg-section" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Edukasi</a>
        </nav>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
            style={{
              padding: '0.5rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: 'var(--text-dark)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer'
            }}
          >
            Masuk
          </button>

          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              borderRadius: '6px',
              backgroundColor: 'var(--primary-green)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
            }}
          >
            Daftar
          </button>
        </div>
      </div>
    </header>
  );
}
