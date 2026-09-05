/**
 * Central API Client for ReuSource / Bylink Frontend
 * Connects directly to Next.js API Routes at /api/v1 (or NEXT_PUBLIC_API_URL)
 * Includes persistent registry sync across Serverless / Cloud cold-starts.
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1');

const STORAGE_KEY_ACCOUNTS = 'reusource_registered_accounts';

export function getStoredAccounts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCOUNTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredAccount(acc) {
  if (typeof window === 'undefined' || !acc) return;
  try {
    const list = getStoredAccounts();
    const filtered = list.filter((item) => item.phone !== acc.phone && item.email !== acc.email);
    filtered.push(acc);
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to save account to localStorage:', e);
  }
}

export function updateStoredAccountStatus(companyId, status) {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredAccounts();
    const updated = list.map((item) => {
      if (item.company_id === companyId) {
        return { ...item, verification_status: status };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY_ACCOUNTS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to update account status in localStorage:', e);
  }
}

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('reusource_token') : null;
  const accountsHeader = typeof window !== 'undefined' ? JSON.stringify(getStoredAccounts()) : '[]';

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'X-Registered-Accounts': accountsHeader,
    ...options.headers,
  };

  try {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const res = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.detail || data?.error || `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

// 1. AUTHENTICATION & PROFILE APIS
export const authApi = {
  requestOtp: (phone) =>
    request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),

  verifyOtpRegister: async (payload) => {
    const res = await request('/auth/verify-otp-register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res && res.phone) {
      saveStoredAccount({
        phone: res.phone,
        email: res.email,
        full_name: res.full_name,
        role: res.role,
        company_id: res.company_id,
        company_name: res.company_name,
        address: payload.address || 'Indonesia',
        city: payload.city || 'Indonesia',
        province: payload.province || '',
        latitude: payload.latitude || -6.2088,
        longitude: payload.longitude || 106.8456,
        verification_status: res.verification_status || 'pending_verification',
        created_at: new Date().toISOString(),
      });
    }
    return res;
  },

  verifyOtpLogin: async (payload) => {
    const res = await request('/auth/verify-otp-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res;
  },

  loginEmail: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerEmail: async (payload) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res && res.email) {
      saveStoredAccount({
        phone: res.phone || payload.phone,
        email: res.email,
        full_name: res.full_name,
        role: res.role,
        company_id: res.company_id,
        company_name: res.company_name,
        address: payload.address || 'Indonesia',
        city: payload.city || 'Indonesia',
        province: payload.province || '',
        latitude: payload.latitude || -6.2088,
        longitude: payload.longitude || 106.8456,
        verification_status: res.verification_status || 'pending_verification',
        created_at: new Date().toISOString(),
      });
    }
    return res;
  },

  getMe: () => request('/auth/me'),

  updateProfile: (payload) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// 2. SUPPLIER APIS
export const supplierApi = {
  setorStok: (payload) =>
    request('/material-listings/setor-stok', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getClusterProgress: () => request('/material-listings/cluster-progress'),

  getMyListings: () => request('/material-listings/my-listings'),
};

// 3. BUYER APIS
export const buyerApi = {
  getListings: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/material-listings${q ? `?${q}` : ''}`);
  },

  getSmartMatches: (requestId) =>
    request(`/smart-matching/request/${requestId}`),

  submitBuyingRequest: (payload) =>
    request('/buying-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMyBuyingRequests: () => request('/buying-requests/my-requests'),

  getOrders: (buyerCompanyId) => {
    const q = buyerCompanyId ? `?buyer_company_id=${buyerCompanyId}` : '';
    return request(`/orders${q}`);
  },

  checkoutSupply: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// 4. ADMIN & VERIFIER APIS
export const adminApi = {
  getPendingAccounts: () => request('/verifications/pending-accounts'),

  verifyAccount: async (companyId, decision, adminNotes = '') => {
    const res = await request(`/verifications/accounts/${companyId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ decision, admin_notes: adminNotes }),
    });
    updateStoredAccountStatus(companyId, decision === 'approve' ? 'approved' : 'rejected');
    return res;
  },

  getImpactDashboard: () => request('/impact/dashboard'),

  verifyOrderStep: (orderId, targetStatus) =>
    request(`/verifications/order/${orderId}`, {
      method: 'POST',
      body: JSON.stringify({ target_status: targetStatus }),
    }),
};
