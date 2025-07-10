import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userService from "../../services/user-endpoints";
import { useStateContext } from "../../contexts/ContextProvider";

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useStateContext();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!email) {
    return (
      <div className="p-6 text-center">
        No email provided for OTP verification.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userService.verifyOtp(email, otp);
      if (res?.success && res.data?.user) {
        setAuth(res.data.user);
        localStorage.setItem("lrms-auth", JSON.stringify(res.data.user));
        if (res.data.user.role === "TEACHER") {
          navigate("/client-page");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Invalid OTP or verification failed.");
      }
    } catch (err) {
      setError(err?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Two-Factor Authentication
        </h2>
        <p className="mb-4 text-center text-gray-600 dark:text-gray-300">
          Please enter the OTP sent to <b>{email}</b>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
            maxLength={6}
            required
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
