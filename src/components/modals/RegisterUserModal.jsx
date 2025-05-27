import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaTimes, FaUserPlus } from "react-icons/fa";
import { useState } from "react";
import userService from "../../services/user-endpoints"; // Import the user-endpoints service

const RegisterUserModal = ({
  isOpen,
  onClose,
  onUserRegistered,
  onRegistrationSuccess,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    role: "TEACHER", // Default role
    birthdate: "",
  });

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "";
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Calculate age if birthdate changes
      ...(name === "birthdate" && { age: calculateAge(value) }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let prismaBirthdate = null;
    if (formData.birthdate) {
      const dateObject = new Date(formData.birthdate);
      prismaBirthdate = dateObject.toISOString();
    }

    const userDataToRegister = {
      ...formData,
      birthdate: prismaBirthdate, // Use the converted birthdate
      age: parseInt(formData.age, 10) || null, // Ensure age is a number or null
    };

    try {
      // Call the registerUser service function
      const response = await userService.registerUser(userDataToRegister);
      console.log("User registered successfully:", response);

      // Notify parent on successful registration
      if (onRegistrationSuccess) {
        onRegistrationSuccess();
      }

      // Refresh user list in UsersManagement
      if (onUserRegistered) {
        onUserRegistered();
      }
    } catch (error) {
      console.error("Error registering user:", error);
      // TODO: Show error message to user
    }
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-2xl mx-4 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2">
              <FaUserPlus size={20} /> REGISTER NEW USER
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                readOnly // Made read-only
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2 bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="TEACHER">TEACHER</option>
              </select>
            </div>

            <div className="flex justify-end mt-4 md:col-span-2">
              <button
                type="submit"
                className="px-8 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              >
                Register
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    )
  );
};

RegisterUserModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserRegistered: PropTypes.func,
  onRegistrationSuccess: PropTypes.func,
};

export default RegisterUserModal;
