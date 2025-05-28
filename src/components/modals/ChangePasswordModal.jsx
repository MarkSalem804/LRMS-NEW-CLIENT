/* eslint-disable no-useless-escape */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { FaLock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ChangePasswordModal = ({ user, isOpen, onClose, onSave }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);

  // Reset state when the modal is opened for a new user
  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      // Reset validation states
      setHasUppercase(false);
      setHasMinLength(false);
      setHasSpecialChar(false);
      setHasNumber(false);
    }
  }, [isOpen, user]);

  const validatePassword = (password) => {
    setHasUppercase(/[A-Z]/.test(password));
    setHasMinLength(password.length >= 6);
    setHasSpecialChar(/[!@#$%^&*()_+{};':"|,.<>\/?-]/.test(password));
    setHasNumber(/[0-9]/.test(password));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    validatePassword(password);
  };

  const handleSave = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!hasUppercase || !hasMinLength || !hasSpecialChar || !hasNumber) {
      setError("Password does not meet all requirements.");
      return;
    }

    setError(null);
    onSave(user.id, newPassword);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose} // Close modal when clicking outside
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }} // Start slightly smaller and lower
          animate={{ scale: 1, y: 0 }} // Animate to normal size and position
          exit={{ scale: 0.9, y: 50 }} // Animate back on exit
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <FaLock size={24} /> Change Password
          </h2>

          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>

          {/* Password Requirements Checklist */}
          <div className="mb-4 text-sm dark:text-gray-400">
            <p className="font-semibold mb-1">Password must contain:</p>
            <ul className="list-none p-0 m-0">
              <li
                className={`flex items-center ${
                  hasUppercase
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {hasUppercase ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <FaTimesCircle className="mr-2" />
                )}
                At least one uppercase letter
              </li>
              <li
                className={`flex items-center ${
                  hasMinLength
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {hasMinLength ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <FaTimesCircle className="mr-2" />
                )}
                At least 6 characters long
              </li>
              <li
                className={`flex items-center ${
                  hasSpecialChar
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {hasSpecialChar ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <FaTimesCircle className="mr-2" />
                )}
                At least one special character (!@#$%^&*...)
              </li>
              <li
                className={`flex items-center ${
                  hasNumber
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {hasNumber ? (
                  <FaCheckCircle className="mr-2" />
                ) : (
                  <FaTimesCircle className="mr-2" />
                )}
                At least one number
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-700 dark:hover:bg-blue-900"
              type="button"
              onClick={handleSave}
              disabled={
                !hasUppercase ||
                !hasMinLength ||
                !hasSpecialChar ||
                !hasNumber ||
                newPassword !== confirmPassword ||
                !newPassword
              }
            >
              Save Changes
            </button>
            <button
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

ChangePasswordModal.propTypes = {
  user: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
