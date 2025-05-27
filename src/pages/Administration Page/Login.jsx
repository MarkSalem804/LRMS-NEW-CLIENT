/* eslint-disable no-unused-vars */
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

// Simple Toast component
function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        background: "#f87171",
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

const Login = () => {
  console.log("Login component loaded");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const { setAuth } = useStateContext();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: object().shape({
      email: string().required("Email Required!"),
      password: string().required("Password Required!"),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log("Formik onSubmit called with values:", values);
      // Basic console log
      console.log("Form submitted");

      try {
        setLoading(true);
        setToast("");

        // Log the values being sent
        console.log("Sending values:", values.email);

        // Call the authentication service
        const res = await userService.authenticate(values);
        console.log("Got response:", res);

        if (res?.success) {
          setAuth(res.data.user);
          localStorage.setItem("lrms-auth", JSON.stringify(res.data.user));
          navigate("/dashboard");
        } else {
          setToast("Authentication failed");
        }
      } catch (err) {
        console.error("Login error:", err);
        let message =
          err?.response?.status === 401
            ? "Invalid username or password."
            : err.message || "Login failed";
        setToast(message);
      } finally {
        setLoading(false);
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.email && !values.password) {
        setToast("Both fields must not be empty");
        errors.email = "Email Required!";
        errors.password = "Password Required!";
      } else {
        if (!values.email) {
          setToast("Email Required!");
          errors.email = "Email Required!";
        }
        if (!values.password) {
          setToast("Password Required!");
          errors.password = "Password Required!";
        }
      }
      return errors;
    },
  });

  return (
    <div>
      <Toast message={toast} onClose={() => setToast("")} />
      <div className="min-h-screen relative flex items-center justify-center p-4 font-poppins">
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
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 border border-gray-200 min-h-[700px]"
          >
            <div className="flex flex-col md:flex-row gap-12">
              <div className="w-full md:w-2/5 space-y-12">
                <div className="flex items-center">
                  <img
                    src={HeaderLogo}
                    alt="DepEd Logo"
                    className="h-20 w-auto mr-4"
                  />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      ILeaRN Portal
                    </h1>
                    <p className="text-gray-600">
                      Imus Learning Resources Navigator
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-5 bg-blue-100 rounded-xl">
                    <div className="p-4 bg-primary-500/10 rounded-lg">
                      <FaSchool className="text-primary-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-lg">
                        E-Resource Management
                      </h3>
                      <p className="text-gray-600">
                        Efficiently manage school resources and learning
                        materials
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-5 bg-green-300 rounded-xl">
                    <div className="p-4 bg-primary-500/10 rounded-lg">
                      <FaBook className="text-primary-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-lg">
                        Learning Resources
                      </h3>
                      <p className="text-gray-600">
                        Access comprehensive educational materials
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-5 bg-red-300 rounded-xl">
                    <div className="p-4 bg-primary-500/10 rounded-lg">
                      <FcAddDatabase className="text-primary-500 text-3xl" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-medium text-lg">
                        Repository for Materials
                      </h3>
                      <p className="text-gray-600">
                        One stop shop for all learning materials
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-8 md:mt-10">
                    <Link
                      to="/about-us"
                      className="inline-block px-40 py-2 border border-blue-600 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm"
                    >
                      About Us
                    </Link>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-3/5">
                <form
                  onSubmit={formik.handleSubmit}
                  className="space-y-7 max-w-md mx-auto mt-32"
                >
                  <h2 className="text-3xl font-bold text-left text-gray-800 mb-8">
                    LOG IN
                  </h2>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-lg font-medium text-gray-700 mb-1 uppercase"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
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
                      className="block text-lg font-medium text-gray-700 mb-1 uppercase"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
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
                          <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                        ) : (
                          <FaEye className="text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </motion.button>
                </form>

                <div className="mt-4 text-center max-w-md mx-auto">
                  <p className="text-sm text-gray-600">
                    Need help?{" "}
                    <Link
                      to="/support"
                      className="font-medium text-primary-600 hover:text-primary-500"
                    >
                      Contact Support
                    </Link>
                  </p>
                </div>

                <div className="mt-28 pt-6 border-t border-gray-200 max-w-md mx-auto">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-8">
                      <img
                        src={HeaderLogo}
                        alt="DepEd Logo"
                        className="h-10 w-auto opacity-80 hover:opacity-100"
                      />
                      <img
                        src={DepEdLogo}
                        alt="DepEd Logo 2"
                        className="h-10 w-auto opacity-80 hover:opacity-100"
                      />
                      <img
                        src={PilipinasLogo}
                        alt="Bagong Pilipinas Logo"
                        className="h-16 w-auto opacity-80 hover:opacity-100 object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-500 font-['Poppins']">
                      SDO - Imus City all rights reserved
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
