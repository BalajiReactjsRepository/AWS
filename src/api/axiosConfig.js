import axios from "axios";
import { getAccessToken, clearTokens } from "./tokenService";
import { refreshAccessToken } from "./authService";

const api = axios.create({
  baseURL: process.env.REACT_APP_STAGE_URL,
  timeout: 15000, // ⏱ Prevent hanging requests
});

// 🔁 Refresh control
let isRefreshing = false;
let failedRequestsQueue = [];

// ====== REQUEST INTERCEPTOR ======
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ====== RESPONSE INTERCEPTOR ======
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    console.log(error);
    const originalRequest = error.config;

    // ❌ If refresh token itself fails → logout
    if (
      error.response?.status === 401 &&
      originalRequest?.url?.includes("/refresh-token")
    ) {
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 🔐 Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ⏳ If refresh already in progress, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest); // ✅ use same instance
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          throw new Error("Token refresh failed");
        }

        // 🔁 Retry all queued requests
        failedRequestsQueue.forEach((req) => req.resolve(newToken));
        failedRequestsQueue = [];

        // 🔁 Retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        failedRequestsQueue.forEach((req) => req.reject(err));
        failedRequestsQueue = [];
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
