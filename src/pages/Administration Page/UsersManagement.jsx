/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaUser, FaRedo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import userService from "../../services/user-endpoints";
import UserProfileModal from "../../components/modals/UserProfileModal";
import RegisterUserModal from "../../components/modals/RegisterUserModal";
import ConfirmationDialog from "../../components/modals/ConfirmationDialog";
import { useStateContext } from "../../contexts/ContextProvider";
import AdminResetPasswordModal from "../../components/modals/AdminResetPasswordModal";

const UsersManagement = () => {
  const { auth } = useStateContext();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Calculate the index of the first and last item for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Slice the allUsers array to get only the users for the current page
  const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);

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

  return (
    <div className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white mb-0">
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
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FaUser size={32} /> USERS MANAGEMENT
          </h1>
          <button
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            onClick={openRegisterModal}
          >
            REGISTER
          </button>
        </div>

        {/* All Users Table */}
        <div className="bg-blue-50 text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow overflow-hidden mb-0 border border-blue-500 dark:border-gray-700">
          <div className="p-4 bg-blue-100 dark:bg-gray-700 text-center uppercase">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              All Users
            </h2>
          </div>
          <div className="overflow-x-auto h-[550px]">
            <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
              <thead className="bg-blue-500 dark:bg-blue-700 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
                {/* Use currentUsers for pagination */}
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.role}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        user.isActive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mr-3"
                        title="View Profile"
                        onClick={() => openViewModal(user)}
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        className="text-blue-600 dark:text-blue-500 hover:text-blue-900 dark:hover:text-blue-700 mr-3"
                        title="Edit User"
                        onClick={() => openEditModal(user)}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="text-yellow-600 dark:text-yellow-500 hover:text-yellow-900 dark:hover:text-yellow-700 mr-3"
                        title="Reset Password"
                        onClick={() => openAdminResetModal(user)}
                      >
                        <FaRedo size={16} />
                      </button>
                      <button
                        className="text-red-600 dark:text-red-500 hover:text-red-900 dark:hover:text-red-700"
                        title="Delete User"
                        onClick={() => handleDelete(user)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 flex justify-between items-center bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        {/* Currently Logged In Users - Still using static data for now */}
        {/* Inactive Users - Still using static data for now */}
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

        {/* Render the AdminResetPasswordModal */}
        <AdminResetPasswordModal
          user={userToReset}
          isOpen={isAdminResetModalOpen}
          onClose={closeAdminResetModal}
          onSave={handleAdminPasswordReset}
          isLoading={isResettingPassword}
        />
      </div>
    </div>
  );
};

export default UsersManagement;
