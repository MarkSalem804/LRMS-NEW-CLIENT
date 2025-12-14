/* global __APP_VERSION__ */
import { useState } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { string, object } from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useStateContext } from "../../contexts/ContextProvider";
import HeaderLogo from "../../assets/deped_logo.png";
import DepEdLogo from "../../assets/Logo-DepEd-1.png";
import PilipinasLogo from "../../assets/Bagong-Pilipinas-Logo.png";
import userService from "../../services/user-endpoints";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import "./sweetalert-custom.css";

// Simple Toast component
function Toast({ message, onClose, type = "error" }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: type === "success" ? "#22c55e" : "#f87171",
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
      className="hidden md:block" // only show on desktop
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
  type: PropTypes.string,
};

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "error" });
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const { setAuth, showSuccessMessage } = useStateContext();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: object().shape({
      email: string().required("Email Required!"),
      password: string().required("Password Required!"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setToast({ message: "", type: "error" });
        // Show SweetAlert2 loading popup immediately
        Swal.fire({
          title: "Signing in...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
          customClass: {
            title: "swal2-custom-title",
            popup: "swal2-custom-popup",
            htmlContainer: "swal2-custom-html",
          },
        });
        // Call the authentication service
        const res = await userService.authenticate(values);

        if (res?.requires2FA) {
          // Update SweetAlert2 popup for 2FA
          Swal.update({
            title:
              "OTP Verification enabled, proceeding to OTP Verification Page",
            timer: 1200,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
              title: "swal2-custom-title text-sm",
              popup: "swal2-custom-popup !w-64 !max-w-xs",
              htmlContainer: "swal2-custom-html text-sm",
            },
          });
          setTimeout(() => {
            Swal.close();
            navigate("/verify-otp", { state: { email: values.email } });
          }, 1200);
          return;
        }

        if (res?.success) {
          // Close the "Signing in..." popup first
          Swal.close();

          // Check if mobile
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            // Use SweetAlert for mobile
            Swal.fire({
              title: "Successfully Logged in",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                title: "swal2-custom-title text-sm",
                popup: "swal2-custom-popup !w-64 !max-w-xs",
                htmlContainer: "swal2-custom-html text-sm",
              },
            });
          } else {
            // Use global success message for desktop
            showSuccessMessage("Successfully Logged in");
          }
          setTimeout(() => {
            setAuth(res.data.user);
            localStorage.setItem("lrms-auth", JSON.stringify(res.data.user));
            // Redirect based on user role
            if (res.data.user.role === "TEACHER") {
              navigate("/client-page");
            } else {
              navigate("/dashboard");
            }
          }, 1000);
        } else {
          Swal.close();
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            Swal.fire({
              title: "Authentication failed",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                title: "swal2-custom-title text-sm",
                popup: "swal2-custom-popup !w-64 !max-w-xs",
                htmlContainer: "swal2-custom-html text-sm",
              },
            });
          } else {
            setToast({ message: "Authentication failed", type: "error" });
          }
        }
      } catch (err) {
        Swal.close();
        const isMobile = window.innerWidth < 768;
        const errorMessage =
          err?.response?.status === 401
            ? "Invalid username or password."
            : err.message || "Login failed";

        if (isMobile) {
          Swal.fire({
            title: errorMessage,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              title: "swal2-custom-title text-sm",
              popup: "swal2-custom-popup !w-64 !max-w-xs",
              htmlContainer: "swal2-custom-html text-sm",
            },
          });
        } else {
          setToast({ message: errorMessage, type: "error" });
        }
      } finally {
        setLoading(false);
      }
    },
    validate: (values) => {
      const errors = {};
      const isMobile = window.innerWidth < 768;

      if (!values.email && !values.password) {
        if (isMobile) {
          Swal.fire({
            title: "Both fields must not be empty",
            icon: "warning",
            timer: 2000,
            showConfirmButton: false,
            customClass: {
              title: "swal2-custom-title text-sm",
              popup: "swal2-custom-popup !w-64 !max-w-xs",
              htmlContainer: "swal2-custom-html text-sm",
            },
          });
        } else {
          setToast({
            message: "Both fields must not be empty",
            type: "warning",
          });
        }
        errors.email = "Email Required!";
        errors.password = "Password Required!";
      } else {
        if (!values.email) {
          if (isMobile) {
            Swal.fire({
              title: "Email Required!",
              icon: "warning",
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                title: "swal2-custom-title text-sm",
                popup: "swal2-custom-popup !w-64 !max-w-xs",
                htmlContainer: "swal2-custom-html text-sm",
              },
            });
          } else {
            setToast({ message: "Email Required!", type: "warning" });
          }
          errors.email = "Email Required!";
        }
        if (!values.password) {
          if (isMobile) {
            Swal.fire({
              title: "Password Required!",
              icon: "warning",
              timer: 2000,
              showConfirmButton: false,
              customClass: {
                title: "swal2-custom-title text-sm",
                popup: "swal2-custom-popup !w-64 !max-w-xs",
                htmlContainer: "swal2-custom-html text-sm",
              },
            });
          } else {
            setToast({ message: "Password Required!", type: "warning" });
          }
          errors.password = "Password Required!";
        }
      }
      return errors;
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerEmail) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        Swal.fire({
          title: "Email Required!",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            title: "swal2-custom-title text-sm",
            popup: "swal2-custom-popup !w-64 !max-w-xs",
            htmlContainer: "swal2-custom-html text-sm",
          },
        });
      } else {
        setToast({ message: "Email Required!", type: "warning" });
      }
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        Swal.fire({
          title: "Invalid Email Format",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            title: "swal2-custom-title text-sm",
            popup: "swal2-custom-popup !w-64 !max-w-xs",
            htmlContainer: "swal2-custom-html text-sm",
          },
        });
      } else {
        setToast({ message: "Invalid Email Format", type: "warning" });
      }
      return;
    }

    try {
      setRegisterLoading(true);

      Swal.fire({
        title: "Processing Registration...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        showConfirmButton: false,
        customClass: {
          title: "swal2-custom-title",
          popup: "swal2-custom-popup",
        },
      });

      const response = await userService.selfRegister(registerEmail);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          html: `
            <div class="text-left">
              <p class="text-gray-700 mb-2">A temporary password has been sent to:</p>
              <p class="text-blue-600 font-semibold mb-4">${registerEmail}</p>
              <p class="text-sm text-gray-600">Please check your email and use the temporary password to login.</p>
              <p class="text-sm text-amber-600 mt-2">⚠️ You will be required to change your password on first login.</p>
            </div>
          `,
          confirmButtonText: "OK, Got it!",
          customClass: {
            title: "swal2-custom-title",
            popup: "swal2-custom-popup",
            confirmButton: "bg-blue-600 hover:bg-blue-700",
          },
        });

        setShowRegisterModal(false);
        setRegisterEmail("");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Unable to complete registration",
        customClass: {
          title: "swal2-custom-title",
          popup: "swal2-custom-popup",
        },
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col p-4 font-poppins">
      <Toast
        message={toast.message}
        onClose={() => setToast({ message: "", type: "error" })}
        type={toast.type}
      />

      {/* Navigation Bar */}
      <div className="w-full px-4">
        <nav className="flex justify-end items-center gap-6 py-4 max-w-7xl ml-auto">
          <a
            href="https://wp.depedimuscity.com/?page_id=70"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Citizen&apos;s Charter
          </a>
          <Link
            to="/about-us"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/support"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Support
          </Link>
        </nav>
      </div>

      {/* Login Card - Centered */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Left Panel - Welcome Section */}
          <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <div className="space-y-6">
              <div className="space-y-2">
                <img
                  src={HeaderLogo}
                  alt="DepEd Logo"
                  className="h-16 w-auto object-contain mb-4"
                />
                <h1 className="text-4xl font-bold tracking-tight">
                  Welcome to ILeaRN Portal
                </h1>
                <p className="text-xl text-blue-200 font-medium">
                  Imus Learning Resources Navigator
                </p>
                <div className="h-1 w-20 bg-blue-300 rounded"></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg">
                      E-Resource Management
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Efficiently manage school resources and learning materials
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Learning Resources
                    </h3>
                    <p className="text-blue-100 text-sm">
                      Access comprehensive educational materials
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg
                    className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Repository for Materials
                    </h3>
                    <p className="text-blue-100 text-sm">
                      One stop shop for all learning materials
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* App Version - Bottom Left */}
            <div className="mt-auto">
              <p className="text-xs text-blue-200">
                App Version {__APP_VERSION__}
              </p>
            </div>
          </div>

          {/* Right Panel - Sign In Form */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex-1 flex items-center">
              <div className="w-full space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                  <p className="text-gray-600">
                    Access your learning resources dashboard
                  </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                        formik.errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="you@deped.gov.ph"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                          formik.errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <FaEyeSlash className="text-gray-400 hover:text-gray-500 text-lg" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-500 text-lg" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </motion.button>

                  {/* Register Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setShowRegisterModal(true)}
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Logos Section - Bottom */}
            <div className="pt-6">
              <div className="flex items-center justify-center gap-6">
                <img
                  src={PilipinasLogo}
                  alt="Bagong Pilipinas Logo"
                  className="h-16 w-auto object-contain"
                />
                <img
                  src={HeaderLogo}
                  alt="DepEd Logo"
                  className="h-12 w-auto object-contain"
                />
                <img
                  src={DepEdLogo}
                  alt="DepEd Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                SDO - Imus City 2025 All Rights Reserved
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowRegisterModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Register for ILeaRN
                </h3>
                <p className="text-sm text-gray-600">
                  Enter your email to create an account. A temporary password
                  will be sent to your email.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="registerEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="you@deped.gov.ph"
                    disabled={registerLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📧 A temporary password will be sent to this email
                  </p>
                </div>

                {/* Warning Notice */}
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-amber-800">
                        You&apos;ll need to change your password on first login
                        for security.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegisterModal(false);
                      setRegisterEmail("");
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={registerLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerLoading ? "Processing..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Login;
