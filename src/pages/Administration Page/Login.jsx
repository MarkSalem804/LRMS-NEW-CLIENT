/* eslint-disable no-unused-vars */
/* global __APP_VERSION__ */
import { useState } from "react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { string, object } from "yup";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSchool,
  FaBook,
} from "react-icons/fa";
import { FcAddDatabase } from "react-icons/fc";
import { useStateContext } from "../../contexts/ContextProvider";
import HeaderLogo from "../../assets/deped_logo.png";
import DepEdLogo from "../../assets/Logo-DepEd-1.png";
import PilipinasLogo from "../../assets/Bagong-Pilipinas-Logo.png";
import LoginBackground from "../../assets/LoginPageBackground.jpg";
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

  return (
    <div>
      <Toast
        message={toast.message}
        onClose={() => setToast({ message: "", type: "error" })}
        type={toast.type}
      />
      <div className="min-h-screen relative flex items-center justify-center p-2 sm:p-4 font-poppins">
        <div className="absolute inset-0 z-0">
          <img
            src={LoginBackground}
            alt="Background"
            className="w-full h-full object-cover brightness-10 contrast-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-gray-900/10" />
        </div>

        <div className="w-full max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-2 sm:p-6 md:p-10 border border-gray-200 min-h-[500px] md:min-h-[700px]"
          >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
              <div className="w-full md:w-2/5 space-y-8 md:space-y-12">
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <img
                    src={HeaderLogo}
                    alt="DepEd Logo"
                    className="h-14 w-auto mr-3 md:h-20 md:mr-4"
                  />
                  <div>
                    <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                      ILeaRN Portal
                    </h1>
                    <p className="text-xs md:text-base text-gray-600">
                      Imus Learning Resources Navigator
                    </p>
                  </div>
                </div>

                {/* Features section - only on md and up */}
                <div className="hidden md:block space-y-4 md:space-y-6">
                  <div className="flex items-center space-x-2 md:space-x-4 p-3 md:p-5 bg-blue-100 rounded-xl">
                    <div className="p-2 md:p-4 bg-primary-500/10 rounded-lg">
                      <FaSchool className="text-primary-500 text-lg md:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-base md:text-lg">
                        E-Resource Management
                      </h3>
                      <p className="text-xs md:text-gray-600">
                        Efficiently manage school resources and learning
                        materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 p-3 md:p-5 bg-green-300 rounded-xl">
                    <div className="p-2 md:p-4 bg-primary-500/10 rounded-lg">
                      <FaBook className="text-primary-500 text-lg md:text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-base md:text-lg">
                        Learning Resources
                      </h3>
                      <p className="text-xs md:text-gray-600">
                        Access comprehensive educational materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-4 p-3 md:p-5 bg-red-300 rounded-xl">
                    <div className="p-2 md:p-4 bg-primary-500/10 rounded-lg">
                      <FcAddDatabase className="text-primary-500 text-xl md:text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-base md:text-lg">
                        Repository for Materials
                      </h3>
                      <p className="text-xs md:text-gray-600">
                        One stop shop for all learning materials
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 md:mt-8 hidden md:block">
                    <Link
                      to="/about-us"
                      className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs md:text-base"
                    >
                      About Us
                    </Link>
                  </div>
                  <div className="flex justify-center mt-4 md:mt-8 hidden md:block">
                    <a
                      href="https://wp.depedimuscity.com/?page_id=70"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs md:text-base"
                    >
                      Citizen&apos;s Charter
                    </a>
                  </div>
                </div>

                {/* About Us and Citizen's Charter buttons below Sign In on mobile only */}
                {/* <div className="block md:hidden mt-4 space-y-2 max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
                  <Link
                    to="/about-us"
                    className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs"
                  >
                    About Us
                  </Link>
                  <a
                    href="https://wp.depedimuscity.com/?page_id=70"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs"
                  >
                    Citizen&apos;s Charter
                  </a>
                </div> */}
              </div>
              <div className="w-full md:w-3/5">
                <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-5 md:space-y-7 max-w-xs xs:max-w-sm sm:max-w-md mx-auto mt-10 md:mt-32"
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-left text-gray-800 mb-4 md:mb-8">
                    LOG IN
                  </h2>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm md:text-lg font-medium text-gray-700 mb-1 uppercase"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400 text-base md:text-lg" />
                      </div>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-xs md:text-base ${
                          formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your DepEd Official E-mail"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm md:text-lg font-medium text-gray-700 mb-1 uppercase"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400 text-base md:text-lg" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full pl-10 pr-10 py-2 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-xs md:text-base ${
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
                          <FaEyeSlash className="text-gray-400 hover:text-gray-500 text-base md:text-lg" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-500 text-base md:text-lg" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-xs md:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </motion.button>
                </form>
                {/* About Us and Citizen's Charter buttons below the form on mobile only */}
                <div className="block md:hidden mt-4 space-y-2 max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
                  <Link
                    to="/about-us"
                    className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs"
                  >
                    About Us
                  </Link>
                  <a
                    href="https://wp.depedimuscity.com/?page_id=70"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm text-xs"
                  >
                    Citizen&apos;s Charter
                  </a>
                </div>

                <div className="mt-4 text-center max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
                  <p className="text-xs md:text-sm text-gray-600">
                    Need help?{" "}
                    <Link
                      to="/support"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>

                <div className="mt-10 md:mt-28 pt-6 border-t border-gray-200 max-w-xs xs:max-w-sm sm:max-w-md mx-auto">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-4 md:space-x-8">
                      <img
                        src={HeaderLogo}
                        alt="DepEd Logo"
                        className="h-8 w-auto md:h-10 opacity-80 hover:opacity-100"
                      />
                      <img
                        src={DepEdLogo}
                        alt="DepEd Logo 2"
                        className="h-8 w-auto md:h-10 opacity-80 hover:opacity-100"
                      />
                      <img
                        src={PilipinasLogo}
                        alt="Bagong Pilipinas Logo"
                        className="h-12 w-auto md:h-16 opacity-80 hover:opacity-100 object-contain"
                      />
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 font-['Poppins']">
                      SDO - Imus City all rights reserved - Version{" "}
                      {__APP_VERSION__}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
