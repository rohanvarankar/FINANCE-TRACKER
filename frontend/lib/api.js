import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Response Interceptor to handle globally common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401 (Unauthorized), it usually means the token expired or is invalid.
    // In such cases, we should clear the session and redirect to signin.
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Clear tokens from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Redirect to signin page if not already there
        if (!window.location.pathname.includes("/auth/signin")) {
            window.location.href = "/auth/signin?error=Session expired. Please log in again.";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
