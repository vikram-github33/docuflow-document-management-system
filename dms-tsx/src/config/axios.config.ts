import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL 

  console.log("BASE_URL",BASE_URL)

const TIMEOUT_MS = 30000;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// Request Interceptor
// =====================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// =====================
// Response Interceptor
// =====================
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Token expired / Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect if user is already on login page
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    }

    // Preserve the original axios error
    return Promise.reject(error);
  }
);

// =====================
// S3 Client
// =====================
export const s3Client = axios.create({
  timeout: 5 * 60 * 1000,
});

export default apiClient;