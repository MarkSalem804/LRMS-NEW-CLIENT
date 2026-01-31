import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from "../../services/user-endpoints";
import { useStateContext } from "../../contexts/ContextProvider";
import PropTypes from "prop-types";

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        background: "#22c55e",
        color: "white",
        padding: "16px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        fontWeight: 500,
        fontSize: 16,
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 220,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: 16,
          color: "white",
          background: "transparent",
          border: "none",
          fontSize: 18,
          cursor: "pointer",
        }}
      >
        &times;
      </button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useStateContext();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [toast, setToast] = useState("");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Email Provided
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Please return to the login page and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userService.verifyOtp(email, otp);
      // Response structure: { success: true, message: "OTP verified successfully", data: { user: userData, token: token } }
      const userData = res?.data?.user || res?.user;
      const token = res?.data?.token || res?.token;

      console.log("🔍 [OTP Verification] Full response:", res);
      console.log("🔍 [OTP Verification] User data:", userData);
      console.log(
        "🔍 [OTP Verification] Token:",
        token ? token.substring(0, 30) + "..." : "No token found"
      );

      if (res?.success && userData) {
        setToast("Successfully Logged in");
        setTimeout(() => {
          // Store user data in localStorage
          setAuth(userData);
          localStorage.setItem("lrms-auth", JSON.stringify(userData));

          // Store JWT token securely in localStorage
          if (token) {
            localStorage.setItem("lrms-token", token);
            console.log(
              "✅ [OTP Verification] JWT token stored successfully after OTP verification"
            );
            console.log(
              "🔍 [OTP Verification] Token value (first 30 chars):",
              token.substring(0, 30) + "..."
            );
          } else {
            console.error(
              "❌ [OTP Verification] No JWT token received from server after OTP verification"
            );
            console.error(
              "❌ [OTP Verification] Response structure:",
              JSON.stringify(res, null, 2)
            );
          }

          if (userData.role === "Teacher") {
            navigate("/client-page");
          } else {
            navigate("/dashboard");
          }
        }, 1000);
      } else {
        setError("Invalid OTP or verification failed.");
      }
    } catch (err) {
      setError(err?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage("");
    setError("");
    try {
      const res = await userService.resendOtp(email);
      if (res?.success) {
        setResendMessage("New OTP sent successfully!");
        setResendCountdown(60); // Start 60 second countdown
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      setError(err?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Two-Factor Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Enter the 6-digit code sent to
            </p>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mt-1">
              {email.replace(/(.{1}).+(@.+)/, "$1****$2")}
            </p>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && index < 5) {
                        e.target.nextElementSibling?.focus();
                      }
                      const newOtp = otp.split("");
                      newOtp[index] = value;
                      setOtp(newOtp.join(""));
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !e.target.value &&
                        index > 0
                      ) {
                        e.target.previousElementSibling?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="sr-only"
                autoComplete="off"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-red-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span className="text-red-700 dark:text-red-400 text-sm">
                  {error}
                </span>
              </div>
            )}

            {/* Success Message */}
            {resendMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-700 dark:text-green-400 text-sm">
                  {resendMessage}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend OTP Link */}
            <div className="text-center">
              {resendCountdown > 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  Resend available in {resendCountdown} seconds
                </div>
              ) : (
                <button
                  type="button"
                  disabled={resendLoading}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleResendOtp}
                >
                  {resendLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Didn&apos;t receive the code? Resend"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm transition-colors duration-200"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
