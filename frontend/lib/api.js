"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // important for cookies if you use them later
});

/* 
========================================
REQUEST INTERCEPTOR
========================================
Attach token to every request automatically
*/
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/* 
========================================
RESPONSE INTERCEPTOR
========================================
Handle global errors like token expiry
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // 🔥 Clear session
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // 🔥 Prevent infinite redirect loop
        if (!window.location.pathname.includes("/auth/signin")) {
          window.location.href =
            "/auth/signin?error=Session expired. Please log in again.";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
