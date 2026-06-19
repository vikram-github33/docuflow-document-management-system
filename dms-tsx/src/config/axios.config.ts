import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.VITE_API_URL ?? 'http://localhost:7200';
// const BASE_URL = 'http://localhost:3000';
const TIMEOUT_MS = 30_000;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    const message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── Dedicated S3 client (no auth header, longer timeout) ─────────────────────
export const s3Client = axios.create({
  timeout: 5 * 60 * 1000, // 5 min for large file uploads
});

export default apiClient;
