'use client';

import React, { useState, useEffect, useRef } from 'react';
import LocationPickerMap from './LocationPickerMap';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function AuthPage({ initialMode = 'register', onClose, onLoginSuccess }) {
  const { loginWithOtp, registerWithOtp, loginWithEmail, registerWithEmail } = useAuth();

  // Mode: 'register' | 'login'
  const [authMode, setAuthMode] = useState(initialMode);
  // Role: 'supplier' | 'buyer' | 'admin'
  const [role, setRole] = useState('supplier');
  // Method: 'whatsapp' | 'email'
  const [method, setMethod] = useState('whatsapp');

  // Multi-step Registration: 1 (Role & Method), 2 (Form Details), 3 (OTP Verification for WA), 4 (Success / Pending)
  const [step, setStep] = useState(1);

  // Email login / register state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    businessName: '',
    contactName: '',
    wasteTypes: ['Serbuk Serutan Kayu Jati'],
    location: { lat: -6.8722, lng: 107.5422, address: 'Kawasan Sentra Kayu Jepara / Bandung' },
    phone: '',
    email: '',
    password: '',
  });

  // Buyer Form State
  const [buyerForm, setBuyerForm] = useState({
    businessName: '',
    contactName: '',
    biomassNeed: 'Wood Pellet / Briket Kayu Ekspor',
    capacity: '10 - 50 Ton / Bulan',
    location: { lat: -7.9839, lng: 112.6214, address: 'Kawasan Industri Pabrik Briket Malang' },
    phone: '',
    email: '',
    password: '',
  });

  // Login WA state
  const [loginPhone, setLoginPhone] = useState('');

  // OTP State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpMessageToast, setOtpMessageToast] = useState('');
  const [registeredPayload, setRegisteredPayload] = useState(null);

  const inputRefs = useRef([]);

  // Countdown timer for OTP
  useEffect(() => {
    let timerInterval;
    if (otpSent && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpTimer]);

  // Handle WhatsApp OTP Request
  const handleSendOtp = async (phoneNum) => {
    if (!phoneNum || phoneNum.length < 8) {
      setOtpError('Masukkan nomor WhatsApp yang valid (minimal 8 digit)');
      return;
    }

    setOtpError('');
    setIsVerifying(true);

    try {
      const res = await authApi.requestOtp(phoneNum);
      setOtpSent(true);
      setOtpTimer(60);
      setStep(3);
      setOtpMessageToast(`[WA Gateway] ${res.message} ${res.demo_otp_code ? `(Kode Dev: ${res.demo_otp_code})` : ''}`);
    } catch (err) {
      setOtpError(err.message || 'Gagal mengirim OTP ke nomor WhatsApp.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle digit input in OTP box
  const handleDigitChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Masukkan 6 digit kode OTP secara lengkap');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      if (authMode === 'register') {
        const formData = role === 'supplier' ? supplierForm : buyerForm;
        const res = await registerWithOtp({
          phone: formData.phone,
          otp_code: enteredCode,
          role: role === 'supplier' ? 'supplier_admin' : 'buyer_admin',
          business_name: formData.businessName,
          contact_name: formData.contactName,
          address: formData.location.address,
          city: formData.location.address.split(',')[0] || '',
          province: '',
          latitude: formData.location.lat,
          longitude: formData.location.lng,
          waste_types: role === 'supplier' ? supplierForm.wasteTypes : null,
          capacity: role === 'buyer' ? buyerForm.capacity : null,
        });

        setRegisteredPayload(res);
        setStep(4);
      } else {
        const res = await loginWithOtp(loginPhone, enteredCode);
        if (onLoginSuccess) onLoginSuccess(res);
        onClose();
      }
    } catch (err) {
      setOtpError(err.message || 'Kode OTP salah atau verifikasi gagal.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Email Registration Handler (Instant Registration for Supplier or Buyer)
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError('');

    const formData = role === 'supplier' ? supplierForm : buyerForm;
    if (!formData.email || !formData.password) {
      setOtpError('Harap lengkapi email dan kata sandi.');
      setIsVerifying(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.contactName || 'Penanggung Jawab',
        phone: formData.phone || '081234567890',
        company_name: formData.businessName || (role === 'supplier' ? 'Bengkel Kayu Mitra' : 'PT Industri Biomassa'),
        company_type: role === 'supplier' ? 'umkm_supplier' : 'enterprise_buyer',
        address: formData.location.address || 'Kawasan Industri',
        city: formData.location.address.split(',')[0] || 'Kota Usaha',
        province: 'Jawa',
        latitude: formData.location.lat || -6.9,
        longitude: formData.location.lng || 107.6,
        role: role === 'supplier' ? 'supplier_admin' : 'buyer_admin',
      };

      const res = await registerWithEmail(payload);
      setRegisteredPayload(res);
      setStep(4);
    } catch (err) {
      setOtpError(err.message || 'Gagal mendaftarkan akun via email.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Email Login Handler
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError('');

    try {
      const res = await loginWithEmail(emailInput, passwordInput);
      if (onLoginSuccess) onLoginSuccess(res);
      onClose();
    } catch (err) {
      setOtpError(err.message || 'Login email gagal: Email atau password tidak sesuai.');
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleWasteType = (type) => {
    setSupplierForm((prev) => {
      const exists = prev.wasteTypes.includes(type);
      return {
        ...prev,
        wasteTypes: exists ? prev.wasteTypes.filter((t) => t !== type) : [...prev.wasteTypes, type],
      };
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: step === 2 ? '640px' : '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)',
          border: '1px solid var(--card-border)',
          position: 'relative',
          padding: '2rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-dark)' }}>
              ReuSource Portal Akses
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Platform Agregasi Rantai Pasok Biomassa &amp; Limbah Kayu
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              color: 'var(--text-muted)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Primary Auth Mode Tabs: DAFTAR vs MASUK */}
        {step < 3 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            border: '1px solid var(--card-border)',
          }}>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setStep(1);
                setOtpError('');
              }}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: authMode === 'register' ? '#ffffff' : 'transparent',
                color: authMode === 'register' ? 'var(--primary-green)' : 'var(--text-muted)',
                boxShadow: authMode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Daftar Akun Baru
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setStep(1);
                setOtpError('');
              }}
              style={{
                padding: '0.65rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
                color: authMode === 'login' ? 'var(--primary-blue)' : 'var(--text-muted)',
                boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              Masuk (Login)
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* FLOW 1: DAFTAR (REGISTRASI) - STEP 1: PILIH PERAN & METODE    */}
        {/* ============================================================== */}
        {authMode === 'register' && step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Pilih Peran Akun Anda
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Pilih apakah Anda mendaftar sebagai penyedia pasokan limbah atau pembeli industri
              </p>
            </div>

            {/* Role Cards: Supplier vs Buyer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setRole('supplier')}
                style={{
                  border: role === 'supplier' ? '2.5px solid var(--primary-green)' : '1.5px solid var(--card-border)',
                  backgroundColor: role === 'supplier' ? '#f0fdf4' : '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--primary-green-light)',
                  color: 'var(--primary-green)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                }}>
                  PEMASOK
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--primary-green-hover)' }}>
                  Pemasok Limbah
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                  Bengkel kayu, mebel, &amp; sentra sawmill mikro
                </div>
              </div>

              <div
                onClick={() => setRole('buyer')}
                style={{
                  border: role === 'buyer' ? '2.5px solid var(--primary-blue)' : '1.5px solid var(--card-border)',
                  backgroundColor: role === 'buyer' ? '#eff6ff' : '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--primary-blue-light)',
                  color: 'var(--primary-blue)',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                }}>
                  PEMBELI
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--primary-blue-hover)' }}>
                  Pembeli Biomassa
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                  Pabrik briket, pelet, boiler industri, &amp; budidaya
                </div>
              </div>
            </div>

            {/* Method Switcher: WhatsApp vs Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                Pilih Metode Pendaftaran:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setMethod('whatsapp')}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: method === 'whatsapp' ? '2px solid var(--primary-green)' : '1px solid var(--card-border)',
                    backgroundColor: method === 'whatsapp' ? 'var(--primary-green-light)' : '#ffffff',
                    color: method === 'whatsapp' ? 'var(--primary-green-hover)' : 'var(--text-dark)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  WhatsApp OTP
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('email')}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    border: method === 'email' ? '2px solid var(--primary-blue)' : '1px solid var(--card-border)',
                    backgroundColor: method === 'email' ? 'var(--primary-blue-light)' : '#ffffff',
                    color: method === 'email' ? 'var(--primary-blue-hover)' : 'var(--text-dark)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Email &amp; Password
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: role === 'supplier' ? 'var(--primary-green)' : 'var(--primary-blue)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '0.5rem',
              }}
            >
              Lanjutkan Pengisian Formulir ({role === 'supplier' ? 'Pemasok' : 'Pembeli'}) →
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* FLOW 1: DAFTAR (REGISTRASI) - STEP 2: FORM DETAIL PROFIL      */}
        {/* ============================================================== */}
        {authMode === 'register' && step === 2 && (
          <form
            onSubmit={(e) => {
              if (method === 'whatsapp') {
                e.preventDefault();
                const phoneNum = role === 'supplier' ? supplierForm.phone : buyerForm.phone;
                handleSendOtp(phoneNum);
              } else {
                handleEmailRegister(e);
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.65rem' }}>
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: role === 'supplier' ? 'var(--primary-green-light)' : 'var(--primary-blue-light)',
                  color: role === 'supplier' ? 'var(--primary-green)' : 'var(--primary-blue)',
                }}>
                  {role === 'supplier' ? 'PENDAFTARAN PEMASOK' : 'PENDAFTARAN PEMBELI'} • METODE {method.toUpperCase()}
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '4px' }}>
                  Lengkapi Profil Usaha Anda
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Ubah Pilihan
              </button>
            </div>

            {/* SUPPLIER FORM FIELDS */}
            {role === 'supplier' ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama Bengkel / Usaha Kayu <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: UD WoodCraft Berkah"
                    value={supplierForm.businessName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama Penanggung Jawab <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap Anda"
                    value={supplierForm.contactName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <LocationPickerMap
                  value={supplierForm.location}
                  onChange={(loc) => setSupplierForm({ ...supplierForm, location: loc })}
                  label="Pin Titik Lokasi Bengkel (Leaflet Map)"
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Jenis Limbah yang Dihasilkan
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {[
                      'Serbuk Serutan Kayu Jati',
                      'Wood Chips / Serpihan Kayu',
                      'Potongan Kayu Padat (Offcuts)',
                      'Kulit Kayu & Sisa Sawmill',
                    ].map((type) => {
                      const isSelected = supplierForm.wasteTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleWasteType(type)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '20px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: isSelected ? '1.5px solid var(--primary-green)' : '1px solid var(--card-border)',
                            backgroundColor: isSelected ? 'var(--primary-green-light)' : '#ffffff',
                            color: isSelected ? 'var(--primary-green-hover)' : 'var(--text-muted)',
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '} {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Method Specific Inputs */}
                {method === 'whatsapp' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                      Nomor WhatsApp Aktif <span style={{ color: 'var(--critical-red)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={supplierForm.phone}
                      onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                        Alamat Email <span style={{ color: 'var(--critical-red)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@bengkel.com"
                        value={supplierForm.email}
                        onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                        Kata Sandi <span style={{ color: 'var(--critical-red)' }}>*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Minimal 6 karakter"
                        value={supplierForm.password}
                        onChange={(e) => setSupplierForm({ ...supplierForm, password: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* BUYER FORM FIELDS */
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama Perusahaan / Pabrik Pembeli <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PT BioEnergi Nusantara"
                    value={buyerForm.businessName}
                    onChange={(e) => setBuyerForm({ ...buyerForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama PIC / Penanggung Jawab <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama perwakilan industri"
                    value={buyerForm.contactName}
                    onChange={(e) => setBuyerForm({ ...buyerForm, contactName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                      Jenis Kebutuhan Biomassa <span style={{ color: 'var(--critical-red)' }}>*</span>
                    </label>
                    <select
                      value={buyerForm.biomassNeed}
                      onChange={(e) => setBuyerForm({ ...buyerForm, biomassNeed: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.85rem' }}
                    >
                      <option value="Wood Pellet / Briket Kayu Ekspor">Wood Pellet / Briket Kayu</option>
                      <option value="Bahan Bakar Boiler Industri">Bahan Bakar Boiler (Co-Firing)</option>
                      <option value="Industri Papan Partikel / MDF">Industri Papan Partikel / MDF</option>
                      <option value="Substrat Budidaya Jamur">Substrat Budidaya Jamur</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                      Kapasitas Serap Kebutuhan <span style={{ color: 'var(--critical-red)' }}>*</span>
                    </label>
                    <select
                      value={buyerForm.capacity}
                      onChange={(e) => setBuyerForm({ ...buyerForm, capacity: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.85rem' }}
                    >
                      <option value="10 - 50 Ton / Bulan">10 - 50 Ton / Bulan</option>
                      <option value="50 - 100 Ton / Bulan">50 - 100 Ton / Bulan</option>
                      <option value="> 100 Ton / Bulan">&gt; 100 Ton / Bulan</option>
                    </select>
                  </div>
                </div>

                <LocationPickerMap
                  value={buyerForm.location}
                  onChange={(loc) => setBuyerForm({ ...buyerForm, location: loc })}
                  label="Pin Titik Pabrik / Gudang Penerimaan (Leaflet Map)"
                />

                {/* Method Specific Inputs */}
                {method === 'whatsapp' ? (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                      Nomor WhatsApp Perwakilan PIC <span style={{ color: 'var(--critical-red)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081987654321"
                      value={buyerForm.phone}
                      onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                    />
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                        Email Perusahaan <span style={{ color: 'var(--critical-red)' }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="procurement@pabrik.com"
                        value={buyerForm.email}
                        onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                        Kata Sandi <span style={{ color: 'var(--critical-red)' }}>*</span>
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Minimal 6 karakter"
                        value={buyerForm.password}
                        onChange={(e) => setBuyerForm({ ...buyerForm, password: e.target.value })}
                        style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {otpError && (
              <div style={{ fontSize: '0.82rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                {otpError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: role === 'supplier' ? 'var(--primary-green)' : 'var(--primary-blue)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: isVerifying ? 'wait' : 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                marginTop: '0.5rem',
              }}
            >
              {isVerifying
                ? 'Memproses Pendaftaran...'
                : method === 'whatsapp'
                ? 'Kirim OTP ke WhatsApp →'
                : 'Selesaikan Pendaftaran Akun →'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* FLOW 2: MASUK (LOGIN) - PILIHAN METODE EMAIL / WHATSAPP       */}
        {/* ============================================================== */}
        {authMode === 'login' && step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Sub-Tabs: Login Email vs Login WA */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              backgroundColor: '#f8faf8',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
            }}>
              <button
                type="button"
                onClick={() => { setMethod('email'); setOtpError(''); }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: method === 'email' ? '#ffffff' : 'transparent',
                  color: method === 'email' ? 'var(--primary-blue)' : 'var(--text-muted)',
                  boxShadow: method === 'email' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                Masuk via Email
              </button>

              <button
                type="button"
                onClick={() => { setMethod('whatsapp'); setOtpError(''); }}
                style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: method === 'whatsapp' ? '#ffffff' : 'transparent',
                  color: method === 'whatsapp' ? 'var(--primary-green)' : 'var(--text-muted)',
                  boxShadow: method === 'whatsapp' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                Masuk via WhatsApp OTP
              </button>
            </div>

            {/* EMAIL LOGIN FORM */}
            {method === 'email' && (
              <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Masuk dengan Email Terdaftar
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Gunakan kredensial Pemasok, Pembeli, atau Admin Verifikator
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                    Alamat Email <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@perusahaan.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                    Kata Sandi <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                {/* Quick Demo Login Box */}
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: '#334155', marginBottom: '0.35rem' }}>
                    Login Cepat dengan Akun Uji Coba:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => { setEmailInput('test@supplier.com'); setPasswordInput('password123'); }}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Pemasok
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmailInput('test@buyer.com'); setPasswordInput('password123'); }}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Pembeli
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEmailInput('admin@bylink.id'); setPasswordInput('admin123'); }}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {otpError && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    {otpError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  style={{
                    padding: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--navy-dark)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    border: 'none',
                    cursor: isVerifying ? 'wait' : 'pointer',
                  }}
                >
                  {isVerifying ? 'Memverifikasi Kredensial...' : 'Masuk ke Portal Resmi →'}
                </button>
              </form>
            )}

            {/* WHATSAPP OTP LOGIN FORM */}
            {method === 'whatsapp' && (
              <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(loginPhone); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                    Masuk via WhatsApp OTP
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Sistem akan mengirimkan 6 digit kode verifikasi ke nomor Anda
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nomor WhatsApp Terdaftar <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="tel"
                      placeholder="Contoh: 081234567890"
                      required
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      style={{ flex: 1, padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                    <button
                      type="submit"
                      disabled={isVerifying}
                      style={{
                        padding: '0.65rem 1.25rem',
                        backgroundColor: 'var(--primary-green)',
                        color: '#ffffff',
                        fontWeight: 700,
                        borderRadius: '8px',
                        border: 'none',
                        cursor: isVerifying ? 'wait' : 'pointer',
                      }}
                    >
                      Kirim OTP
                    </button>
                  </div>
                </div>

                {/* Quick Demo WhatsApp Numbers */}
                <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: '#334155', marginBottom: '0.35rem' }}>
                    Nomor WhatsApp Uji Coba:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setLoginPhone('081234567891')}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #a7f3d0', backgroundColor: '#ecfdf5', color: '#047857', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Pemasok
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginPhone('081234567892')}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Pembeli
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginPhone('081199887766')}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#b91c1c', fontWeight: 700, cursor: 'pointer', fontSize: '0.72rem' }}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {otpError && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    {otpError}
                  </div>
                )}
              </form>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: VERIFIKASI 6 DIGIT OTP WHATSAPP                       */}
        {/* ============================================================== */}
        {step === 3 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Verifikasi OTP WhatsApp
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Masukkan 6 digit kode OTP yang terkirim ke nomor Anda
              </p>
            </div>

            {otpMessageToast && (
              <div style={{
                backgroundColor: '#ecfdf5',
                border: '1px solid #6ee7b7',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.78rem',
                color: '#047857',
              }}>
                {otpMessageToast}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '46px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    border: digit ? '2px solid var(--primary-green)' : '1.5px solid var(--card-border)',
                    borderRadius: '10px',
                    backgroundColor: digit ? '#f0fdf4' : '#ffffff',
                    outline: 'none',
                  }}
                />
              ))}
            </div>

            {otpError && (
              <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', textAlign: 'center' }}>
                {otpError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-green)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: isVerifying ? 'wait' : 'pointer',
              }}
            >
              {isVerifying ? 'Memverifikasi Kode OTP...' : 'Verifikasi & Masuk Portal →'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* STEP 4: STATUS PENDAFTARAN BERHASIL                            */}
        {/* ============================================================== */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#ecfdf5',
                color: '#047857',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid #a7f3d0',
                marginBottom: '0.5rem',
              }}>
                PENDAFTARAN BERHASIL DISIMPAN
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Selamat Datang di ReuSource!
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Akun <strong>{registeredPayload?.company_name || 'Perusahaan Anda'}</strong> telah terdaftar secara resmi di sistem backend.
              </p>
            </div>

            <div style={{
              backgroundColor: '#f8faf8',
              border: '1px solid var(--card-border)',
              borderRadius: '10px',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}>
              <div style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓ Kredensial Akun Berhasil Diotentikasi</div>
              <div style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓ Profil Usaha &amp; Titik Geospasial Tersimpan</div>
              <div style={{ color: '#0284c7', fontWeight: 700 }}>✦ Akses Penuh ke Dashboard {role === 'supplier' ? 'Pemasok' : 'Pembeli'}</div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onLoginSuccess && registeredPayload) {
                  onLoginSuccess(registeredPayload);
                }
                onClose();
              }}
              style={{
                padding: '0.85rem',
                borderRadius: '8px',
                backgroundColor: role === 'supplier' ? 'var(--primary-green)' : 'var(--primary-blue)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Buka Dashboard {role === 'supplier' ? 'Pemasok' : 'Pembeli'} Anda →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
