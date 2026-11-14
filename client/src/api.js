import axios from 'axios';

export const API_BASE_URL = (
  process.env.REACT_APP_API_URL || 'https://pro-health-backend.vercel.app'
).replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only broadcast expiry when an authenticated request fails. Login
    // failures return 401 too and must not wipe the session.
    if (
      error?.response?.status === 401 &&
      localStorage.getItem('token') &&
      !String(error?.config?.url || '').includes('/api/auth/login')
    ) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

/** Turn an axios/network error into a message that is safe to show users. */
export const getErrorMessage = (
  error,
  fallback = 'Something went wrong. Please try again.'
) => {
  const data = error?.response?.data;
  return (
    data?.msg ||
    data?.message ||
    data?.errors?.[0]?.message ||
    error?.message ||
    fallback
  );
};

/** API list endpoints may return `[...]` or `{ data: [...] }`. */
export const toList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export default api;
