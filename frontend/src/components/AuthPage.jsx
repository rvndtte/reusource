import React, { useState, useEffect, useRef } from 'react';
import LocationPickerMap from './LocationPickerMap';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export default function AuthPage({ initialMode = 'register', onClose, onLoginSuccess }) {
  const { loginWithOtp, registerWithOtp, loginWithEmail } = useAuth();

  const [authMode, setAuthMode] = useState(initialMode); // 'register' | 'login' | 'email_login'
  const [role, setRole] = useState('supplier'); // 'supplier' | 'buyer'
  
  // Auto-switch auth mode based on role for optimal UX
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Supplier uses WhatsApp, Buyer uses Email
    if (newRole === 'supplier') {
      setAuthMode('register');
    } else {
      setAuthMode('email_login');
    }
  };
  const [step, setStep] = useState(1); // 1: role selection/form, 2: form detail, 3: otp verification, 4: pending status

  // Email login state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Supplier Form State
  const [supplierForm, setSupplierForm] = useState({
    businessName: '',
    contactName: '',
    wasteTypes: [],
    location: { lat: 0, lng: 0, address: '' },
    phone: ''
  });

  // Buyer Form State
  const [buyerForm, setBuyerForm] = useState({
    businessName: '',
    contactName: '',
    biomassNeed: '',
    capacity: '',
    location: { lat: 0, lng: 0, address: '' },
    phone: ''
  });

  // Login Form State
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

  // Timer countdown effect for OTP resend
  useEffect(() => {
    let timerInterval;
    if (otpSent && otpTimer > 0) {
      timerInterval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [otpSent, otpTimer]);

  // Handle sending OTP (Fonnte / Wablas API Gateway)
  const handleSendOtp = async (phoneNum) => {
    if (!phoneNum || phoneNum.length < 8) {
      setOtpError('Masukkan nomor WhatsApp yang valid (minimal 8 digit)');
      return;
    }

    setOtpError('');
    setIsVerifying(true);

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await authApi.requestOtp(phoneNum);
      clearTimeout(timeoutId);

      setOtpSent(true);
      setOtpTimer(60);
      setStep(3);
      setOtpMessageToast(`📱 [Fonnte WA Gateway] ${res.message} ${res.demo_otp_code ? `(Dev Mode: ${res.demo_otp_code})` : ''}`);
    } catch (err) {
      if (err.name === 'AbortError') {
        setOtpError('Request timeout. Backend mungkin tidak merespon. Coba lagi atau gunakan login email.');
      } else {
        setOtpError(err.message || 'Gagal mengirim OTP ke nomor WhatsApp');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle digit typing in OTP box
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

  // Verify OTP submit with backend API
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
      // Add timeout for verification
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
        clearTimeout(timeoutId);

        setRegisteredPayload(res);
        setStep(4); // Move to Menunggu Verifikasi screen
      } else {
        const res = await loginWithOtp(loginPhone, enteredCode);
        clearTimeout(timeoutId);

        if (onLoginSuccess) {
          onLoginSuccess(res);
        }
        onClose();
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setOtpError('Request timeout. Backend mungkin tidak merespon. Coba lagi.');
      } else {
        setOtpError(err.message || 'Kode OTP salah atau verifikasi gagal');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Direct Email Login (for Admin, Verifier, or existing users)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setOtpError('');
    try {
      const res = await loginWithEmail(emailInput, passwordInput);
      if (onLoginSuccess) {
        onLoginSuccess(res);
      }
      onClose();
    } catch (err) {
      setOtpError(err.message || 'Login email gagal: Email atau password tidak cocok');
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
          maxWidth: step === 2 && role === 'supplier' ? '680px' : '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.3)',
          border: '1px solid var(--card-border)',
          position: 'relative',
          padding: '2rem',
        }}
      >
        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}>
              R
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                ReuSource / Bylink Auth
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                FastAPI Backend Connected & Protected
              </div>
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

        {/* Mode Switcher Tabs - Role-based */}
        {step < 3 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: role === 'supplier' ? '1fr 1fr' : '1fr',
            backgroundColor: '#f8faf8',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            border: '1px solid var(--card-border)',
          }}>
            {role === 'supplier' && (
              <>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setStep(1); setOtpError(''); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: authMode === 'register' ? '#ffffff' : 'transparent',
                    color: authMode === 'register' ? 'var(--primary-green)' : 'var(--text-muted)',
                    boxShadow: authMode === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  📝 Registrasi WA
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setStep(1); setOtpError(''); }}
                  style={{
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: authMode === 'login' ? '#ffffff' : 'transparent',
                    color: authMode === 'login' ? 'var(--primary-green)' : 'var(--text-muted)',
                    boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  🔑 Masuk WA OTP
                </button>
              </>
            )}
            
            {role === 'buyer' && (
              <button
                type="button"
                onClick={() => { setAuthMode('email_login'); setStep(1); setOtpError(''); }}
                style={{
                  padding: '0.55rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: authMode === 'email_login' ? '#ffffff' : 'transparent',
                  color: authMode === 'email_login' ? 'var(--primary-blue)' : 'var(--text-muted)',
                  boxShadow: authMode === 'email_login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                🛡️ Login Email Enterprise
              </button>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* EMAIL & PASSWORD LOGIN (Instant Admin / Verifier / Demo Accounts) */}
        {/* ============================================================== */}
        {authMode === 'email_login' && step === 1 && (
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.35rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>Login Akun Terdaftar (ISO RBAC)</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Masuk dengan kredensial terverifikasi untuk membuka portal sesuai peran Anda
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                Alamat Email <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
                Kata Sandi (Password) <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
              />
            </div>

            {/* Fast Login Alternative */}
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem' }}>
              <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '0.35rem' }}>
                ⚡ Login Lebih Cepat dengan Email
              </div>
              <div style={{ fontSize: '0.7rem', color: '#78350f', marginBottom: '0.35rem' }}>
                Jika OTP WhatsApp lambat, gunakan login email untuk akses instan.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => { setEmailInput('test@supplier.com'); setPasswordInput('password123'); }}
                  style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--primary-green)', fontWeight: 700, cursor: 'pointer' }}
                >
                  🪵 Demo Supplier: test@supplier.com
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailInput('test@buyer.com'); setPasswordInput('password123'); }}
                  style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 700, cursor: 'pointer' }}
                >
                  🏭 Demo Buyer: test@buyer.com
                </button>
              </div>
            </div>

            {otpError && (
              <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                ⚠️ {otpError}
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

        {/* ============================================================== */}
        {/* LOGIN VIA WHATSAPP OTP                                         */}
        {/* ============================================================== */}
        {authMode === 'login' && step === 1 && (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(loginPhone); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>Masuk via WhatsApp OTP</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Sistem akan memverifikasi nomor dan memberikan akses sesuai peran Anda
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                Nomor WhatsApp Terdaftar <span style={{ color: 'var(--critical-red)' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ backgroundColor: '#f8faf8', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '0.7rem 0.85rem', fontSize: '0.88rem', fontWeight: 700 }}>
                  🇮🇩 +62
                </span>
                <input
                  type="tel"
                  required
                  placeholder="081234567890"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  style={{ flex: 1, padding: '0.7rem 0.9rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600 }}
                />
              </div>
            </div>

            {otpError && (
              <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                ⚠️ {otpError}
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
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              }}
            >
              {isVerifying ? 'Menghubungi WA Gateway...' : 'Kirim OTP via WhatsApp →'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* REGISTRASI - STEP 1 (PILIH ROLE)                               */}
        {/* ============================================================== */}
        {authMode === 'register' && step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)' }}>Pilih Peran Akun Anda</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Hak akses portal akan dibatasi secara ketat sesuai peran yang dipilih
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
              <div
                onClick={() => handleRoleChange('supplier')}
                style={{
                  border: role === 'supplier' ? '2.5px solid var(--primary-green)' : '1.5px solid var(--card-border)',
                  backgroundColor: role === 'supplier' ? '#f0fdf4' : '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🪵</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-green-hover)' }}>
                  Pemasok Limbah
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Bengkel kayu & penggergajian (WhatsApp OTP)
                </div>
              </div>

              <div
                onClick={() => handleRoleChange('buyer')}
                style={{
                  border: role === 'buyer' ? '2.5px solid var(--primary-blue)' : '1.5px solid var(--card-border)',
                  backgroundColor: role === 'buyer' ? '#eff6ff' : '#ffffff',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏭</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-blue-hover)' }}>
                  Pembeli Biomassa
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Pabrik industri (Email Login)
                </div>
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
              }}
            >
              Lanjutkan Pengisian Profil ({role === 'supplier' ? 'Pemasok' : 'Pembeli'}) →
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* REGISTRASI - STEP 2 (FORM PROFIL DINAMIS)                       */}
        {/* ============================================================== */}
        {authMode === 'register' && step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const phoneNum = role === 'supplier' ? supplierForm.phone : buyerForm.phone;
              handleSendOtp(phoneNum);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  backgroundColor: role === 'supplier' ? 'var(--primary-green-light)' : 'var(--primary-blue-light)',
                  color: role === 'supplier' ? 'var(--primary-green)' : 'var(--primary-blue)',
                }}>
                  {role === 'supplier' ? 'PROFIL PEMASOK' : 'PROFIL PEMBELI'}
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-dark)', marginTop: '4px' }}>
                  Detail Profil Usaha
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Ubah Role
              </button>
            </div>

            {role === 'supplier' ? (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama Bengkel / Penggergajian Kayu <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={supplierForm.businessName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <LocationPickerMap
                  value={supplierForm.location}
                  onChange={(loc) => setSupplierForm({ ...supplierForm, location: loc })}
                  label="Pin Lokasi Usaha di Peta (Leaflet OpenStreetMap)"
                />

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                    Jenis Limbah Kayu yang Dihasilkan <span style={{ color: 'var(--critical-red)' }}>*</span>
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nomor WhatsApp Penanggung Jawab <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nama Perusahaan Pembeli <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerForm.businessName}
                    onChange={(e) => setBuyerForm({ ...buyerForm, businessName: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Jenis Kebutuhan Biomassa <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <select
                    value={buyerForm.biomassNeed}
                    onChange={(e) => setBuyerForm({ ...buyerForm, biomassNeed: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="Wood Pellet / Briket Kayu">Wood Pellet / Briket Kayu Ekspor</option>
                    <option value="Bahan Bakar Boiler Pabrik">Bahan Bakar Boiler Industri (Co-Firing)</option>
                    <option value="Papan Partikel / MDF">Industri Papan Partikel / MDF</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Kapasitas Serap Per Periode <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <select
                    value={buyerForm.capacity}
                    onChange={(e) => setBuyerForm({ ...buyerForm, capacity: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  >
                    <option value="10 - 50 Ton / Bulan">10 - 50 Ton / Bulan</option>
                    <option value="50 - 100 Ton / Bulan">50 - 100 Ton / Bulan</option>
                    <option value="> 100 Ton / Bulan">&gt; 100 Ton / Bulan</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                    Nomor WhatsApp Perwakilan <span style={{ color: 'var(--critical-red)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={buyerForm.phone}
                    onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1.5px solid var(--card-border)', borderRadius: '8px', fontSize: '0.88rem' }}
                  />
                </div>
              </>
            )}

            {otpError && (
              <div style={{ fontSize: '0.8rem', color: 'var(--critical-red)', backgroundColor: 'var(--critical-red-light)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                ⚠️ {otpError}
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
              }}
            >
              {isVerifying ? 'Mengirimkan OTP...' : 'Kirim OTP via WhatsApp →'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* VERIFIKASI OTP DENGAN BACKEND FASTAPI                          */}
        {/* ============================================================== */}
        {step === 3 && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>📱</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-dark)' }}>Verifikasi OTP WhatsApp</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Masukkan 6 digit kode OTP yang terkirim ke WhatsApp Anda
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
                ⚠️ {otpError}
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
              {isVerifying ? 'Memverifikasi ke Database...' : 'Verifikasi & Selesaikan Pendaftaran →'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* STATUS AKUN MENUNGGU VERIFIKASI ADMIN                          */}
        {/* ============================================================== */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#fffbe6',
              border: '2px solid #ffe58f',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              margin: '0 auto',
            }}>
              ⏳
            </div>

            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                color: '#92400e',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid #fde047',
                marginBottom: '0.5rem',
              }}>
                STATUS AKUN: MENUNGGU VERIFIKASI ADMIN
              </div>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                Data Berhasil Disimpan di Database!
              </h2>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Terima kasih, <strong>{registeredPayload?.company_name || 'Mitra Usaha'}</strong>.
                Akun Anda telah terdaftar dan menunggu audit fisik/persetujuan dari Tim Admin Bylink.
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
              <div style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓ Nomor WhatsApp Terverifikasi via OTP Backend</div>
              <div style={{ color: 'var(--primary-green)', fontWeight: 700 }}>✓ Data Usaha & Pin Geospasial Terdaftar</div>
              <div style={{ color: '#d97706', fontWeight: 700 }}>⏳ Verifikasi Kriteria Inklusif oleh Admin Bylink</div>
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
                backgroundColor: 'var(--primary-green)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Buka Portal {role === 'supplier' ? 'Pemasok' : 'Pembeli'} Anda →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
