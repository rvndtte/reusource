'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MarketFriction from '@/components/MarketFriction';
import MaterialGrades from '@/components/MaterialGrades';
import DualEngineFeatures from '@/components/DualEngineFeatures';
import InteractiveCalculator from '@/components/InteractiveCalculator';
import FactsAndImpact from '@/components/FactsAndImpact';
import BottomCTA from '@/components/BottomCTA';
import SupplierFormModal from '@/components/SupplierFormModal';
import FactoryCatalogModal from '@/components/FactoryCatalogModal';
import ScrollRevealSection from '@/components/ScrollRevealSection';
import AuthPage from '@/components/AuthPage';
import SupplierDashboard from '@/components/SupplierDashboard';
import BuyerKatalog from '@/components/BuyerKatalog';
import BuyerPermintaan from '@/components/BuyerPermintaan';
import BuyerOrders from '@/components/BuyerOrders';
import AdminVerifikasi from '@/components/AdminVerifikasi';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/common/UIStates';

function MainApp() {
  const { isSupplier, isBuyer, isAdmin, isAuthenticated, isLoading } = useAuth();

  // Buyer Sub-Tab Selector: 'katalog' | 'permintaan' | 'pesanan'
  const [buyerTab, setBuyerTab] = useState('katalog');

  // Modals State
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('register'); // 'register' | 'login' | 'email_login'

  const openSupplierModal = () => setIsSupplierModalOpen(true);
  const openCatalogModal = () => setIsCatalogModalOpen(true);

  const openAuthModal = (mode = 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-eco, #0a0f0d)',
        }}
      >
        <LoadingSpinner text="Memverifikasi Sesi Autentikasi Backend..." />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-eco, #0a0f0d)' }}>
      {/* Strict Role-Based Header */}
      <Header
        buyerTab={buyerTab}
        onSwitchBuyerTab={(tab) => setBuyerTab(tab)}
        onOpenSupplierModal={openSupplierModal}
        onOpenCatalogModal={openCatalogModal}
        onOpenAuthModal={openAuthModal}
      />

      {/* Main Content Area Protected by RBAC Guards */}
      <main style={{ overflow: 'hidden' }}>
        {/* 1. SUPPLIER PORTAL (Protected for Supplier Role) */}
        {isAuthenticated && isSupplier && (
          <ProtectedRoute
            allowedRoles={['supplier_admin', 'supplier']}
            requiredRoleName="Pemasok (Supplier)"
            onOpenAuthModal={openAuthModal}
          >
            <SupplierDashboard />
          </ProtectedRoute>
        )}

        {/* 2. BUYER PORTAL (Protected for Buyer Role) */}
        {isAuthenticated && isBuyer && (
          <ProtectedRoute
            allowedRoles={['buyer_admin', 'buyer']}
            requiredRoleName="Pembeli (Buyer)"
            onOpenAuthModal={openAuthModal}
          >
            {buyerTab === 'katalog' && (
              <BuyerKatalog onNavigateToOrders={() => setBuyerTab('pesanan')} />
            )}
            {buyerTab === 'permintaan' && (
              <BuyerPermintaan onNavigateToOrders={() => setBuyerTab('pesanan')} />
            )}
            {buyerTab === 'pesanan' && (
              <BuyerOrders onSwitchToKatalog={() => setBuyerTab('katalog')} />
            )}
          </ProtectedRoute>
        )}

        {/* 3. ADMIN CONSOLE (Protected for Admin / Verifier Role) */}
        {isAuthenticated && isAdmin && (
          <ProtectedRoute
            allowedRoles={['admin', 'verifier']}
            requiredRoleName="Administrator / Verifier"
            onOpenAuthModal={openAuthModal}
          >
            <AdminVerifikasi />
          </ProtectedRoute>
        )}

        {/* 4. PUBLIC LANDING PAGE (Guest / Unauthenticated) */}
        {!isAuthenticated && (
          <>
            <ScrollRevealSection id="hero-section">
              <HeroSection
                onOpenSupplierModal={openSupplierModal}
                onOpenCatalogModal={openCatalogModal}
                onOpenAuthModal={openAuthModal}
              />
            </ScrollRevealSection>

            <ScrollRevealSection id="masalah-section">
              <MarketFriction />
            </ScrollRevealSection>

            <ScrollRevealSection id="grade-section">
              <MaterialGrades />
            </ScrollRevealSection>

            <ScrollRevealSection id="cara-kerja-section">
              <DualEngineFeatures />
            </ScrollRevealSection>

            <ScrollRevealSection id="kalkulator-section">
              <InteractiveCalculator />
            </ScrollRevealSection>

            <ScrollRevealSection id="fakta-sdg-section">
              <FactsAndImpact />
            </ScrollRevealSection>

            <ScrollRevealSection id="bottom-cta-section">
              <BottomCTA
                onOpenSupplierModal={() => openAuthModal('register')}
                onOpenCatalogModal={() => openAuthModal('register')}
              />
            </ScrollRevealSection>
          </>
        )}
      </main>

      {/* Shared Footer */}
      <footer
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--card-border, #e2e8f0)',
          padding: '1.75rem 1.5rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-muted, #64748b)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            © 2026 <strong>ReuSource / Bylink B2B Biomass Supply Chain Network</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Standar Keamanan ISO 27001</span>
            <span>•</span>
            <span>Kebijakan Privasi</span>
            <span>•</span>
            <span>Bantuan & Kontak</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SupplierFormModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
      />

      <FactoryCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
      />

      {/* Auth Modal (/daftar & /masuk) */}
      {isAuthModalOpen && (
        <AuthPage
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
