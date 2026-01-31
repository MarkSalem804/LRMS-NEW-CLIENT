import axios from "axios";

// const BASE_URL = "http://localhost:5001";
const BASE_URL = "https://sdoic-ilearn.depedimuscity.com:5005";

/**
 * Axios Instance with JWT Token Interceptor
 *
 * This creates a configured axios instance that automatically:
 * 1. Adds JWT token to Authorization header for authenticated requests
 * 2. Handles token expiration (401 errors) by logging out the user
 * 3. Provides a clean API for making requests
 */

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 *
 * This runs before every request is sent.
 * It automatically adds the JWT token from localStorage to the Authorization header.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem("lrms-token");

    // Debug logging - Enhanced
    console.log(
      "🔍 [Axios Interceptor] ========== REQUEST INTERCEPTOR =========="
    );
    console.log("🔍 [Axios Interceptor] Checking for token...");
    console.log(
      "🔍 [Axios Interceptor] Token from localStorage:",
      token ? "✅ Token exists" : "❌ No token found"
    );
    console.log("🔍 [Axios Interceptor] Request URL:", config.url);
    console.log(
      "🔍 [Axios Interceptor] Request Method:",
      config.method?.toUpperCase()
    );
    console.log(
      "🔍 [Axios Interceptor] Full URL:",
      config.baseURL + config.url
    );

    // Check all localStorage keys
    console.log(
      "🔍 [Axios Interceptor] All localStorage keys:",
      Object.keys(localStorage)
    );
    console.log(
      "🔍 [Axios Interceptor] lrms-token value:",
      token ? token.substring(0, 30) + "..." : "null/undefined"
    );
    console.log(
      "🔍 [Axios Interceptor] lrms-auth value:",
      localStorage.getItem("lrms-auth") ? "exists" : "null/undefined"
    );

    // If token exists, add it to Authorization header
    // Format: "Bearer <token>"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [Axios Interceptor] Token added to Authorization header");
      console.log(
        "🔍 [Axios Interceptor] Authorization header (first 30 chars):",
        config.headers.Authorization?.substring(0, 30) + "..."
      );
      console.log(
        "🔍 [Axios Interceptor] All headers being sent:",
        Object.keys(config.headers)
      );
    } else {
      console.warn(
        "⚠️ [Axios Interceptor] No token found in localStorage - request will fail if route requires auth"
      );
      console.warn(
        "⚠️ [Axios Interceptor] Make sure you are logged in and token is stored as 'lrms-token'"
      );
      console.warn(
        "⚠️ [Axios Interceptor] Check if token exists: localStorage.getItem('lrms-token')"
      );
    }
    console.log(
      "🔍 [Axios Interceptor] ============================================"
    );

    return config;
  },
  (error) => {
    // If request setup fails, return error
    console.error("❌ [Axios Interceptor] Request setup error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 *
 * This runs after every response is received.
 * It handles token expiration (401 errors) by automatically logging out the user.
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // If response is successful, return it as-is
    return response;
  },
  (error) => {
    // Check if error is due to invalid/expired token (401 Unauthorized)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid or expired
      // Clear token and user data from localStorage
      localStorage.removeItem("lrms-token");
      localStorage.removeItem("lrms-auth");
      sessionStorage.removeItem("lrms-auth");

      // Redirect to login page
      // Use window.location to force a hard reload and clear all state
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Return the error so calling code can handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;
