import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaUser } from "react-icons/fa";

// Helper function to format date to YYYY-MM-DD
const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Return empty string for invalid dates
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UserProfileModal = ({ user, isOpen, onClose, isEditing, onSave }) => {
  const [editableUserData, setEditableUserData] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(
        "[UserProfileModal] Initializing with birthdate:",
        user.profile && user.profile.length > 0
          ? user.profile[0].birthdate
          : "N/A"
      );
      // Initialize editable data from the user prop
      setEditableUserData({
        firstName:
          user.profile && user.profile.length > 0
            ? user.profile[0].firstName
            : "",
        middleName:
          user.profile && user.profile.length > 0
            ? user.profile[0].middleName
            : "",
        lastName:
          user.profile && user.profile.length > 0
            ? user.profile[0].lastName
            : "",
        emailAddress:
          user.profile && user.profile.length > 0
            ? user.profile[0].emailAddress
            : "",
        role: user.role || "", // Assuming role is directly on the user object
        birthdate:
          user.profile && user.profile.length > 0
            ? formatDateToYYYYMMDD(user.profile[0].birthdate)
            : "",
        age: user.profile && user.profile.length > 0 ? user.profile[0].age : "",
        employeeId:
          user.profile && user.profile.length > 0
            ? user.profile[0].employeeId
            : "",
        phoneNumber:
          user.profile && user.profile.length > 0
            ? user.profile[0].phoneNumber
            : "",
        address:
          user.profile && user.profile.length > 0
            ? user.profile[0].address
            : "",
        // Include the user ID to be used for updating
        userId: user.id || null,
      });
    }
  }, [user]); // Re-initialize when the user prop changes

  if (!isOpen || !user) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUserData({
      ...editableUserData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (onSave && editableUserData) {
      console.log(
        "[UserProfileModal] Saving birthdate:",
        editableUserData.birthdate
      );

      // Convert birthdate back to ISO-8601 format before saving
      const dataToSave = { ...editableUserData };
      if (dataToSave.birthdate) {
        try {
          const dateObject = new Date(dataToSave.birthdate);
          if (!isNaN(dateObject.getTime())) {
            // Check if the date is valid
            dataToSave.birthdate = dateObject.toISOString();
          } else {
            console.error(
              "[UserProfileModal] Invalid birthdate format before saving:",
              dataToSave.birthdate
            );
            // Optionally alert user or handle this error
            return; // Stop the save process if date is invalid
          }
        } catch (e) {
          console.error(
            "[UserProfileModal] Error converting birthdate before saving:",
            dataToSave.birthdate,
            e
          );
          // Optionally alert user or handle this error
          return; // Stop the save process on error
        }
      }

      console.log(
        "[UserProfileModal] Sending birthdate (after conversion):",
        dataToSave.birthdate
      );
      onSave(dataToSave);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white dark:bg-gray-800 rounded-lg p-8 w-full max-w-4xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2">
                <FaUser size={20} /> {isEditing ? "EDIT USER" : "USER PROFILE"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="emailAddress"
                    value={editableUserData?.emailAddress || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].emailAddress || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={editableUserData?.firstName || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].firstName || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Middle Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="middleName"
                    value={editableUserData?.middleName || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].middleName || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={editableUserData?.lastName || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].lastName || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Employee ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="employeeId"
                    value={editableUserData?.employeeId || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].employeeId || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editableUserData?.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].phoneNumber || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Birthdate
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="birthdate"
                    value={editableUserData?.birthdate || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? formatDateToYYYYMMDD(user.profile[0].birthdate) ||
                          "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editableUserData?.age || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                ) : (
                  <input
                    type="text"
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].age || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editableUserData?.address || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                    rows="3"
                  />
                ) : (
                  <textarea
                    value={
                      user.profile && user.profile.length > 0
                        ? user.profile[0].address || "N/A"
                        : "N/A"
                    }
                    readOnly
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2"
                    rows="3"
                  />
                )}
              </div>
              {/* Add other profile details here as needed */}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              {isEditing ? (
                <button
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              ) : null}
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                {isEditing ? "Cancel" : "Close"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

UserProfileModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number, // User id
    role: PropTypes.string, // Add role to propTypes
    profile: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number, // Add profile id to propTypes
        emailAddress: PropTypes.string,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        middleName: PropTypes.string, // Add middleName to propTypes
        birthdate: PropTypes.string, // Add birthdate to propTypes
        age: PropTypes.number, // Add age to propTypes
        employeeId: PropTypes.string,
        phoneNumber: PropTypes.string,
        address: PropTypes.string,
        // Add other profile details here as needed
      })
    ),
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool, // Add isEditing propTypes
  onSave: PropTypes.func, // Add onSave propTypes
};

export default UserProfileModal;
