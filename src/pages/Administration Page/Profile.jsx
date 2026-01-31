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
import { formatRoleDisplay } from "../../utils/roleFormatter";

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

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      userProfile.firstName,
      userProfile.lastName,
      userProfile.middleName,
      userProfile.emailAddress,
      userProfile.phoneNumber,
      userProfile.employeeId,
      userProfile.position,
      userProfile.department,
      userProfile.office,
      userProfile.address,
    ];
    const filledFields = fields.filter(
      (field) => field && field !== "N/A" && field.trim() !== ""
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();
  const avatarLetter = userProfile.firstName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl flex-shrink-0">
            <span className="text-blue-700 font-bold text-4xl">
              {avatarLetter}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {userProfile.firstName} {userProfile.middleName}{" "}
              {userProfile.lastName}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
              <span className="inline-flex items-center px-3 py-1 bg-blue-500 rounded-full text-sm font-medium">
                {formatRoleDisplay(userProfile.role) || "User"}
              </span>
              {userProfile.employeeId && userProfile.employeeId !== "N/A" && (
                <span className="inline-flex items-center px-3 py-1 bg-blue-500/50 rounded-full text-sm">
                  ID: {userProfile.employeeId}
                </span>
              )}
            </div>
            <p className="text-blue-100 text-sm">
              {userProfile.emailAddress || "No email provided"}
            </p>
          </div>

          {/* Update Button */}
          <button
            onClick={handleOpenModal}
            className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Update Profile
          </button>
        </div>

        {/* Profile Completion */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm font-bold">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-blue-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                First Name
              </label>
              <p className="text-base text-gray-900 font-medium">
                {userProfile.firstName || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Middle Name
              </label>
              <p className="text-base text-gray-900 font-medium">
                {userProfile.middleName || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Last Name
              </label>
              <p className="text-base text-gray-900 font-medium">
                {userProfile.lastName || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Address
              </label>
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-gray-400 mt-1" size={14} />
                <p className="text-base text-gray-900 font-medium">
                  {userProfile.address || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FaEnvelope className="text-green-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Contact Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400" size={14} />
                <p className="text-base text-gray-900 font-medium">
                  {userProfile.emailAddress || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Phone Number
              </label>
              <div className="flex items-center gap-2">
                <FaPhone className="text-gray-400" size={14} />
                <p className="text-base text-gray-900 font-medium">
                  {userProfile.phoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaBuilding className="text-purple-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Work Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Employee ID
              </label>
              <div className="flex items-center gap-2">
                <FaIdCard className="text-gray-400" size={14} />
                <p className="text-base text-gray-900 font-medium">
                  {userProfile.employeeId || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Position
              </label>
              <p className="text-base text-gray-900 font-medium">
                {userProfile.position || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Department
              </label>
              <div className="flex items-center gap-2">
                <FaBuilding className="text-gray-400" size={14} />
                <p className="text-base text-gray-900 font-medium">
                  {userProfile.department || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Office
              </label>
              <p className="text-base text-gray-900 font-medium">
                {userProfile.office || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-orange-600 text-lg" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleOpenModal}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors"
            >
              <FaUser size={16} />
              <span>Edit Profile</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span>Change Password</span>
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Security Settings</span>
            </button>
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
