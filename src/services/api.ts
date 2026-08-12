/* ─────────────────────────────────────────────
   Centralized API Client — Axios instance with
   auth interceptors, error normalization, and
   base URL from environment.
   ───────────────────────────────────────────── */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/* ── Token helpers ── */

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export const getToken = (): string | null => sessionStorage.getItem(TOKEN_KEY);
export const getRefreshToken = (): string | null => sessionStorage.getItem(REFRESH_KEY);
export const setTokens = (access: string, refresh: string) => {
  sessionStorage.setItem(TOKEN_KEY, access);
  sessionStorage.setItem(REFRESH_KEY, refresh);
};
export const clearTokens = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
};
export const isAuthenticated = (): boolean => !!getToken();

// Redirect to home if storage is cleared or token is missing while on a dashboard route
if (typeof window !== 'undefined') {
  const checkStorage = () => {
    const isDashboard = window.location.pathname.startsWith('/dashboard') || window.location.pathname === '/transactions';
    const hasToken = !!getToken();
    if (isDashboard && !hasToken) {
      window.location.href = '/';
    }
  };

  window.addEventListener('storage', (e) => {
    if (e.key === null || e.key === TOKEN_KEY) {
      checkStorage();
    }
  });

  const originalLSClear = localStorage.clear;
  localStorage.clear = function() {
    originalLSClear.apply(this);
    checkStorage();
  };
  const originalLSRemove = localStorage.removeItem;
  localStorage.removeItem = function(key) {
    originalLSRemove.apply(this, [key]);
    checkStorage();
  };

  const originalSSClear = sessionStorage.clear;
  sessionStorage.clear = function() {
    originalSSClear.apply(this);
    checkStorage();
  };
  const originalSSRemove = sessionStorage.removeItem;
  sessionStorage.removeItem = function(key) {
    originalSSRemove.apply(this, [key]);
    checkStorage();
  };

  setInterval(checkStorage, 1000);
}

/* ── Axios instance ── */

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request interceptor: attach Bearer token ── */

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor: handle 401 → logout ── */

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/* ── Typed convenience methods ── */

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<any>(url, config).then((res) => {
      const body = res.data;
      if (body && body.status === 'success' && 'data' in body) {
        return body.data as T;
      }
      return body as T;
    }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<any>(url, data, config).then((res) => {
      const body = res.data;
      if (body && body.status === 'success' && 'data' in body) {
        return body.data as T;
      }
      return body as T;
    }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<any>(url, data, config).then((res) => {
      const body = res.data;
      if (body && body.status === 'success' && 'data' in body) {
        return body.data as T;
      }
      return body as T;
    }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<any>(url, data, config).then((res) => {
      const body = res.data;
      if (body && body.status === 'success' && 'data' in body) {
        return body.data as T;
      }
      return body as T;
    }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<any>(url, config).then((res) => {
      const body = res.data;
      if (body && body.status === 'success' && 'data' in body) {
        return body.data as T;
      }
      return body as T;
    }),
};

export default apiClient;
