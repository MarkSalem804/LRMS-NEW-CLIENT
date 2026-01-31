/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn-components/ui/table";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import { Edit, Trash2, Eye, UserPlus, RotateCcw, Search } from "lucide-react";
import { toast } from "sonner";
import userService from "../../services/user-endpoints";
import { formatRoleDisplay } from "../../utils/roleFormatter";
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
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  // New state for admin password reset modal
  const [isAdminResetModalOpen, setIsAdminResetModalOpen] = useState(false);
  const [userToReset, setUserToReset] = useState(null);

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
    setSelectedUser(null);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // Function to handle successful registration
  const handleRegistrationSuccess = () => {
    setIsRegisterModalOpen(false);
    fetchUsers();
    toast.success("User registered successfully!", {
      description: "The new user has been added to the system.",
    });
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
        .deleteUser(userToDelete.id, auth?.id)
        .then(() => {
          fetchUsers();
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
          toast.success("User deleted successfully!", {
            description: `${userToDelete.email} has been removed from the system.`,
          });
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          toast.error("Failed to delete user", {
            description:
              error.response?.data?.message ||
              "An error occurred while deleting the user.",
          });
          setIsDeleteDialogOpen(false);
          setUserToDelete(null);
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
  const handleUpdateUser = async (updatedData, profilePictureFile) => {
    if (userToEdit && updatedData.userId) {
      try {
        const userId = updatedData.userId;
        delete updatedData.userId;

        let response;

        // If profile picture is present, use FormData
        if (profilePictureFile) {
          const formDataToSend = new FormData();

          // Append all profile data as individual fields
          Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] !== null && updatedData[key] !== undefined) {
              formDataToSend.append(key, updatedData[key]);
            }
          });

          // Append profile picture
          formDataToSend.append("profilePicture", profilePictureFile);

          response = await userService.updateProfileWithPicture(
            userId,
            formDataToSend
          );
        } else {
          // Call the updateProfile service function (existing method)
          response = await userService.updateProfile(userId, updatedData);
        }

        fetchUsers();
        closeEditModal();
        toast.success("Profile updated successfully!", {
          description: "The user profile has been updated.",
        });
      } catch (error) {
        console.error("Error updating user profile:", error);
        if (error.response && error.response.data) {
          console.error("Server Error Details:", error.response.data);
        }
        toast.error("Failed to update user profile", {
          description:
            error.response?.data?.message ||
            "An error occurred while updating the profile.",
        });
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
      toast.error("Error", {
        description: "User email not available for reset.",
      });
      return;
    }
    try {
      setIsResettingPassword(true);
      await userService.resetPassword(userToReset.email, newPassword);
      closeAdminResetModal();
      toast.success("Password reset successfully!", {
        description: `Password has been reset for ${userToReset.email}.`,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password", {
        description:
          error.response?.data?.message ||
          "An error occurred while resetting the password.",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error.message}</div>
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage system users and their permissions
          </p>
        </div>
        <Button onClick={openRegisterModal} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-[#191970] to-[#000080] rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-2">
              Total Users
            </h3>
            <p className="text-2xl font-bold text-white mb-2">
              {allUsers.length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <UserPlus className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-xs text-white/90 mt-1.5 relative z-10">
            All registered users
          </p>
        </div>

        {/* Admin Users Card */}
        <div className="bg-gradient-to-br from-[#191970] to-[#4B0082] rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-2">
              Admin Users
            </h3>
            <p className="text-2xl font-bold text-white mb-2">
              {allUsers.filter((u) => u.role === "Administrative").length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-purple-400"
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
          <p className="text-xs text-white/90 mt-1.5 relative z-10">
            Privileged access
          </p>
        </div>

        {/* Teacher Users Card */}
        <div className="bg-gradient-to-br from-[#191970] to-[#006400] rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 relative overflow-hidden group cursor-pointer">
          <div className="relative z-10">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-2">
              Teachers
            </h3>
            <p className="text-2xl font-bold text-white mb-2">
              {allUsers.filter((u) => u.role === "Teacher").length}
            </p>
          </div>
          <div className="absolute top-3 right-3 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
            <svg
              className="w-8 h-8 text-green-400"
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
          <p className="text-xs text-white/90 mt-1.5 relative z-10">
            Standard users
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by email, name, or role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstItem + 1}-
          {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
          {filteredUsers.length} user(s)
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "Administrative"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {formatRoleDisplay(user.role)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openViewModal(user)}
                        className="h-8 w-8"
                        title="View Profile"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(user)}
                        className="h-8 w-8"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openAdminResetModal(user)}
                        className="h-8 w-8 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                        title="Reset Password"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Render the UserProfileModal */}
      <UserProfileModal
        user={selectedUser}
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeViewModal();
          } else {
            setIsModalOpen(true);
          }
        }}
        isEditing={false}
      />

      {/* Render the RegisterUserModal */}
      <RegisterUserModal
        open={isRegisterModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeRegisterModal();
          } else {
            setIsRegisterModalOpen(true);
          }
        }}
        onUserRegistered={fetchUsers}
        onRegistrationSuccess={handleRegistrationSuccess}
        adminUserId={auth?.id}
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
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeEditModal();
          } else {
            setIsEditModalOpen(true);
          }
        }}
        isEditing={true}
        onSave={handleUpdateUser}
      />

      {/* Render the Admin Password Reset Modal */}
      <AdminResetPasswordModal
        user={userToReset}
        open={isAdminResetModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeAdminResetModal();
          } else {
            setIsAdminResetModalOpen(true);
          }
        }}
        onSave={handleAdminPasswordReset}
        isLoading={isResettingPassword}
      />
    </div>
  );
};

export default UsersManagement;
