/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import LoadingDialog from "./LoadingDialog";
import { FaRedo } from "react-icons/fa";

const AdminResetPasswordModal = ({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setGeneratedPassword("");
      setError("");
    }
  }, [isOpen]);

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let result = "";
    const charsetLength = charset.length;
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charsetLength));
    }
    return result;
  };

  const handleGeneratePassword = () => {
    const randomPassword = generateRandomPassword();
    setGeneratedPassword(randomPassword);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!generatedPassword) {
      setError("Please generate a password first.");
      return;
    }

    onSave(generatedPassword);
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-normal mb-6 text-gray-900 dark:text-white text-center">
            ACCOUNT PASSWORD RESET
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-normal mb-2"
                htmlFor="generated-password"
              >
                Generated Password
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  id="generated-password"
                  value={generatedPassword}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                  title="Generate Password"
                >
                  <FaRedo size={18} />
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mb-4">{error}</p>
            )}
            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isLoading || !generatedPassword}
              >
                Reset Password
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-block align-baseline font-normal text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
      <LoadingDialog isOpen={isLoading} message="Resetting password..." />
    </AnimatePresence>
  );
};

AdminResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default AdminResetPasswordModal;
