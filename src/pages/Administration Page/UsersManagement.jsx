/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaUser, FaRedo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../../services/user-endpoints";
import UserProfileModal from "../../components/modals/UserProfileModal";
import RegisterUserModal from "../../components/modals/RegisterUserModal";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminResetPasswordModal from "../../components/modals/AdminResetPasswordModal";
import {
  onOnlineUsersUpdate,
  offOnlineUsersUpdate,
} from "../../services/socket-service";

const UsersManagement = () => {
  const { auth } = useStateContext();
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  // New state for admin password reset modal
  const [isAdminResetModalOpen, setIsAdminResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [showAdminResetSuccess, setShowAdminResetSuccess] = useState(false);

  // New state for tracking password reset loading
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setAllUsers(data.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this effect runs once on mount

  // Fetch online users and listen for real-time updates
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await userService.getOnlineUsers();
        setOnlineUsers(response.data || []);
      } catch (err) {
        console.error("Error fetching online users:", err);
      }
    };

    // Initial fetch
    fetchOnlineUsers();

    // Listen for real-time updates
    onOnlineUsersUpdate((updatedOnlineUsers) => {
      console.log("📡 Online users updated:", updatedOnlineUsers);
      setOnlineUsers(updatedOnlineUsers || []);
    });

    // Cleanup listener on unmount
    return () => {
      offOnlineUsersUpdate();
    };
  }, []);

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to open the profile modal (now view modal)
  const openViewModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to close the profile modal (now view modal)
  const closeViewModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null); // Clear selected user when modal is closed
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // Function to handle successful registration
  const handleRegistrationSuccess = () => {
    setShowRegistrationSuccess(true);
    setIsRegisterModalOpen(false); // Close the registration modal
    fetchUsers(); // Refresh the user list
    setTimeout(() => {
      setShowRegistrationSuccess(false);
    }, 3000); // Hide success message after 3 seconds
  };

  // Function to handle user deletion
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm deletion from dialog
  const confirmDelete = () => {
    if (userToDelete) {
      userService
        .deleteUser(userToDelete.id)
        .then(() => {
          fetchUsers(); // Refresh the list after successful deletion
          setIsDeleteDialogOpen(false); // Close dialog
          setUserToDelete(null); // Clear user to delete
          setShowDeleteSuccess(true); // Show delete success snackbar
          setTimeout(() => {
            setShowDeleteSuccess(false);
          }, 3000); // Hide snackbar after 3 seconds
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user."); // Simple error feedback
          setIsDeleteDialogOpen(false); // Close dialog
          setUserToDelete(null); // Clear user to delete
        });
    }
  };

  // Function to cancel deletion from dialog
  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Function to open the edit modal
  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  // Function to handle updating user/profile
  const handleUpdateUser = async (updatedData) => {
    if (userToEdit && updatedData.userId) {
      try {
        // Call the updateProfile service function with user ID and updated data
        const userId = updatedData.userId;
        // Remove userId from updatedData as it's passed in the URL
        delete updatedData.userId;

        const response = await userService.updateProfile(userId, updatedData);
        // console.log("User profile updated successfully:", response);
        fetchUsers(); // Refresh the list after successful update
        closeEditModal(); // Close the edit modal
        setShowUpdateSuccess(true); // Show update success snackbar
        setTimeout(() => {
          setShowUpdateSuccess(false);
        }, 3000); // Hide snackbar after 3 seconds
      } catch (error) {
        console.error("Error updating user profile:", error);
        if (error.response && error.response.data) {
          console.error("Server Error Details:", error.response.data);
        }
        alert("Failed to update user profile."); // Simple error feedback
      }
    }
  };

  // Function to open the admin reset password modal
  const openAdminResetModal = (user) => {
    setUserToReset(user);
    setIsAdminResetModalOpen(true);
  };

  // Function to close the admin reset password modal
  const closeAdminResetModal = () => {
    setIsAdminResetModalOpen(false);
    setUserToReset(null);
  };

  // Function to handle admin password reset
  const handleAdminPasswordReset = async (newPassword) => {
    if (!userToReset || !userToReset.email) {
      console.error("User email not available for reset.");
      // Optionally show an error message to the admin
      return;
    }
    try {
      setIsResettingPassword(true); // Set loading to true
      await userService.resetPassword(userToReset.email, newPassword);
      // console.log("Password reset successfully for user:", userToReset.email);
      closeAdminResetModal();
      setShowAdminResetSuccess(true);
      setTimeout(() => {
        setShowAdminResetSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      // Handle error (e.g., display error message to admin)
      if (error.response && error.response.data) {
        alert("Failed to reset password: " + error.response.data.message);
      } else {
        alert("Failed to reset password.");
      }
    } finally {
      setIsResettingPassword(false); // Set loading to false regardless of success or failure
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center dark:text-white">Loading users...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading users: {error.message}
      </div>
    );
  }

  // Filter users based on search
  const filteredUsers = allUsers.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(search) ||
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    );
  });

  // Paginate filtered users
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Success Message Pop-up */}
      <AnimatePresence>
        {showRegistrationSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
              <p className="text-sm">User Registered Successfully!</p>
            </div>
          </motion.div>
        )}
        {showDeleteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
              <p className="text-sm">Account deleted successfully!</p>
            </div>
          </motion.div>
        )}
        {showUpdateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
              <p className="text-sm">Profile successfully updated!</p>
            </div>
          </motion.div>
        )}
        {showAdminResetSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
              <p className="text-sm">Password reset successfully!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600 text-sm mt-0.5">
            Manage system users and their permissions
          </p>
        </div>
        <button
          onClick={openRegisterModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users Card */}
        <div className="bg-gradient-to-r from-blue-200 to-purple-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {allUsers.length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            All registered users
          </p>
        </div>

        {/* Admin Users Card */}
        <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Admin Users
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {allUsers.filter((u) => u.role === "ADMIN").length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Privileged access
          </p>
        </div>

        {/* Teacher Users Card */}
        <div className="bg-gradient-to-r from-green-200 to-blue-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Teachers
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {allUsers.filter((u) => u.role === "TEACHER").length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Standard users
          </p>
        </div>

        {/* Active Users Card */}
        <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Active Users
            </h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {allUsers.filter((u) => u.isActive).length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-600 mt-1.5 relative z-10">
            Currently active
          </p>
        </div>
      </div>

      {/* Online Users Monitor */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Online Users</h3>
              <p className="text-xs text-gray-500">
                Currently active on the platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">
              {onlineUsers.length} Online
            </span>
          </div>
        </div>

        {/* Online Users List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {onlineUsers.slice(0, 6).map((user, index) => (
            <div
              key={user.userId || index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no online users */}
        {onlineUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-sm">No users currently online</p>
          </div>
        )}

        {/* View All Online Users Link */}
        {onlineUsers.length > 6 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              View All {onlineUsers.length} Online Users →
            </button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search users by email, name, or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 when searching
            }}
            className="flex-1 outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openViewModal(user)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="View Profile"
                          >
                            <FaEye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit User"
                          >
                            <FaEdit size={18} />
                          </button>
                          <button
                            onClick={() => openAdminResetModal(user)}
                            className="text-yellow-600 hover:text-yellow-900 transition-colors"
                            title="Reset Password"
                          >
                            <FaRedo size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete User"
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <span className="text-sm text-gray-500">
                  ({filteredUsers.length} users)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Render the UserProfileModal */}
      <UserProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeViewModal}
        isEditing={false}
      />

      {/* Render the RegisterUserModal */}
      <RegisterUserModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        onUserRegistered={fetchUsers}
        onRegistrationSuccess={handleRegistrationSuccess}
      />

      {/* Render the ConfirmationDialog */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        message={`Are you sure you want to delete ${userToDelete?.email}?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Render the UserProfileModal for editing */}
      <UserProfileModal
        user={userToEdit}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        isEditing={true}
        onSave={handleUpdateUser}
      />

      {/* Render the Admin Password Reset Modal */}
      <AdminResetPasswordModal
        user={userToReset}
        isOpen={isAdminResetModalOpen}
        onClose={closeAdminResetModal}
        onSave={handleAdminPasswordReset}
        isLoading={isResettingPassword}
      />
    </div>
  );
};

export default UsersManagement;
