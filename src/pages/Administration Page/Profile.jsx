import { useState, useEffect, useCallback } from "react";
import userService from "../../services/user-endpoints";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBuilding,
  FaMapMarkerAlt,
} from "react-icons/fa";
import UserProfileModal from "../../components/modals/UserProfileModal";

const Profile = () => {
  const { auth } = useStateContext();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log(auth);

  // Define fetchUserData outside useEffect so it can be called from multiple places
  // Wrap fetchUserData in useCallback
  const fetchUserData = useCallback(async () => {
    console.log("[Profile] Fetching user data for auth.id:", auth?.id);
    if (!auth || !auth.id) {
      console.warn(
        "[Profile] auth or auth.id is not available, skipping fetch."
      );
      setLoading(false); // Stop loading if auth.id is not available
      setUserData(null); // Ensure no stale data is shown
      return;
    }
    try {
      setLoading(true);
      // Use auth.id to fetch the profile of the currently logged-in user
      const data = await userService.getUserProfile(auth.id);
      console.log("[Profile] API response data:", data);
      setUserData(data.data);
      console.log("[Profile] UserData state after update:", data.data);
    } catch (err) {
      console.error("[Profile] Error fetching user data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [auth, userService]);

  useEffect(() => {
    // Call fetchUserData from useEffect on component mount or when auth.id changes
    fetchUserData();
    // Add fetchUserData and auth.id as dependencies
  }, [auth && auth.id, fetchUserData]); // Include fetchUserData in dependencies

  if (loading) {
    return (
      <div className="p-6 text-center dark:text-white">Loading profile...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading profile: {error.message}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-6 text-center dark:text-white">
        User profile not found.
      </div>
    );
  }

  const userProfile = userData;

  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle saving changes from the modal (mimics handleUpdateUser from UsersManagement)
  const handleSaveProfile = async (updatedData) => {
    console.log("[Profile] Saving profile changes from modal:", updatedData);
    if (!auth || !auth.id || !updatedData) {
      console.error("[Profile] Cannot save: auth or updatedData is missing.");
      return;
    }

    try {
      // Ensure userId is included in the updatedData for the service function
      // If your updateProfile service expects userId separately, adjust here
      // Based on UsersManagement, it seems it expects userId as the first argument
      // and the data object (without userId) as the second.
      const dataToSave = { ...updatedData };
      // Assuming updatedData from modal might contain an 'id' or 'userId'
      // specific to the profile object itself, we might need to clean it
      // depending on the exact structure your userService.updateProfile expects.
      // For now, let's pass the updatedData as received from the modal,
      // assuming userService.updateProfile handles the structure.

      const response = await userService.updateProfile(auth.id, dataToSave); // Use auth.id and updatedData from modal
      console.log("[Profile] Update successful from modal:", response);
      handleCloseModal(); // Close the modal on success
      // Optionally, show a success message here

      // Re-fetch user data to show the updated information
      fetchUserData();
    } catch (error) {
      console.error("[Profile] Error saving profile from modal:", error);
      // Optionally, show an error message to the user
      alert("Failed to update profile. Please try again."); // Simple alert for now
      // Modal will remain open or you might handle it differently on error
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FaUser
              className="text-primary-600 dark:text-primary-400"
              size={24}
            />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Personal Information
            </h2>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded-md shadow transition-colors"
          >
            Update Profile
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={userProfile.firstName || "N/A"}
                readOnly={true}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={userProfile.lastName || "N/A"}
                readOnly={true}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                value={userProfile.middleName || "N/A"}
                readOnly={true}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" size={16} />
                </div>
                <input
                  type="email"
                  name="emailAddress"
                  value={userProfile.emailAddress || "N/A"}
                  readOnly={true}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" size={16} />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userProfile.phoneNumber || "N/A"}
                  readOnly={true}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaIdCard className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="employeeId"
                  value={userProfile.employeeId || "N/A"}
                  readOnly={true}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                name="position"
                value={userProfile.position || "N/A"}
                readOnly={true}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  name="department"
                  value={userProfile.department || "N/A"}
                  readOnly={true}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Office
              </label>
              <input
                type="text"
                name="office"
                value={userProfile.office || "N/A"}
                readOnly={true}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FaMapMarkerAlt className="text-gray-400" size={16} />
                </div>
                <textarea
                  name="address"
                  value={userProfile.address || "N/A"}
                  readOnly={true}
                  rows="3"
                  className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render the UserProfileModal */}
      <UserProfileModal
        user={userProfile}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isEditing={true}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
