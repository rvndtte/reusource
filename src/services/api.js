/**
 * Central API Client for ReuSource / Bylink Frontend
 * Connects directly to Next.js API Routes at /api/v1 (or NEXT_PUBLIC_API_URL)
 */

const API_BASE_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1');

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('reusource_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

  verifyOtpRegister: (payload) =>
    request('/auth/verify-otp-register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyOtpLogin: (payload) =>
    request('/auth/verify-otp-login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  loginEmail: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerEmail: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (payload) =>
    request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};

// 2. SUPPLIER APIS (Prioritas 4)
export const supplierApi = {
  setorStok: (payload) =>
    request('/material-listings/setor-stok', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getClusterProgress: () => request('/material-listings/cluster-progress'),

  getMyListings: () => request('/material-listings/my-listings'),
};

// 3. BUYER APIS (Prioritas 5 & 6)
export const buyerApi = {
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/material-listings${query ? `?${query}` : ''}`);
  },

  createBuyingRequest: (companyId, payload) =>
    request(`/buying-requests?company_id=${companyId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getBuyingRequests: (companyId) =>
    request(`/buying-requests${companyId ? `?buyer_company_id=${companyId}` : ''}`),

  triggerMatching: (buyingRequestId, maxRadiusKm = 150) =>
    request('/smart-matching/trigger', {
      method: 'POST',
      body: JSON.stringify({
        buying_request_id: buyingRequestId,
        max_radius_km: maxRadiusKm,
      }),
    }),

  getAggregationsForRequest: (buyingRequestId) =>
    request(`/smart-matching/request/${buyingRequestId}`),

  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getOrders: (buyerCompanyId) =>
    request(`/orders${buyerCompanyId ? `?buyer_company_id=${buyerCompanyId}` : ''}`),
};

// 4. ADMIN & VERIFICATION APIS (Prioritas 7)
export const adminApi = {
  getPendingAccounts: () => request('/verifications/pending-accounts'),

  verifyAccount: (companyId, decision, adminNotes) =>
    request(`/verifications/accounts/${companyId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ decision, admin_notes: adminNotes }),
    }),

  getImpactDashboard: () => request('/impact/dashboard'),
};
