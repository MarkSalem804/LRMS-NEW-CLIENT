import { useState } from "react";
import { FaLock, FaMobileAlt, FaHistory } from "react-icons/fa";

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate new password
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      newErrors.newPassword = passwordErrors;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    // Check if current password is provided
    if (!currentPassword) {
      newErrors.currentPassword = ["Current password is required"];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If validation passes, proceed with password change
    console.log("Password change submitted");
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Security Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account security settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Password Change Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaLock
              className="text-primary-600 dark:text-primary-400"
              size={24}
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Change Password
            </h2>
          </div>
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Password Requirements:
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    newPassword.length >= 8 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    /[A-Z]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                Contains at least one uppercase letter
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    /[0-9]/.test(newPassword) ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                Contains at least one number
              </li>
              <li className="flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-2 ${
                    /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></span>
                Contains at least one special character (!@#$%^&*(),.?&quot;:{}
                |&lt;&gt;)
              </li>
            </ul>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.currentPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                required
              />
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.currentPassword[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                required
              />
              {errors.newPassword && (
                <div className="mt-1">
                  {errors.newPassword.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                required
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword[0]}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaMobileAlt
              className="text-primary-600 dark:text-primary-400"
              size={24}
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Two-Factor Authentication
            </h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Add an extra layer of security to your account
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive a verification code via SMS or authenticator app
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Security History Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <FaHistory
              className="text-primary-600 dark:text-primary-400"
              size={24}
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Security History
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <p className="text-gray-800 dark:text-white font-medium">
                  Password Changed
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  March 15, 2024 - 10:30 AM
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                From IP: 192.168.1.1
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div>
                <p className="text-gray-800 dark:text-white font-medium">
                  New Login
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  March 14, 2024 - 2:15 PM
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                From IP: 192.168.1.1
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
