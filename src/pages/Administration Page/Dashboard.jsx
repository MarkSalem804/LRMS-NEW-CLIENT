import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SubjectCard from "../../components/SubjectCard";
import DashboardStats from "../../components/DashboardStats";
import learningAreas from "../../data/learningAreas";
import {
  FaBook,
  FaFileAlt,
  FaPencilAlt,
  FaChalkboardTeacher,
  FaBookReader,
} from "react-icons/fa";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { useStateContext } from "../../contexts/ContextProvider";
import userService from "../../services/user-endpoints";

const categories = [
  {
    id: "modules",
    name: "Modules",
    icon: FaBook,
    color: "bg-pink-200 border-pink-300",
    textColor: "text-pink-700",
    count: 245,
  },
  {
    id: "manuscripts",
    name: "Manuscripts",
    icon: FaFileAlt,
    color: "bg-blue-200 border-blue-300",
    textColor: "text-blue-700",
    count: 128,
  },
  {
    id: "worksheets",
    name: "Learning Worksheets",
    icon: FaPencilAlt,
    color: "bg-green-200 border-green-300",
    textColor: "text-green-700",
    count: 189,
  },
  {
    id: "storybooks",
    name: "Storybooks",
    icon: FaBookReader,
    color: "bg-purple-200 border-purple-300",
    textColor: "text-purple-700",
    count: 156,
  },
  {
    id: "exemplars",
    name: "Lesson Exemplars",
    icon: FaChalkboardTeacher,
    color: "bg-yellow-200 border-yellow-300",
    textColor: "text-yellow-700",
    count: 203,
  },
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, setAuth } = useStateContext();

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [showPasswordChangeSuccess, setShowPasswordChangeSuccess] =
    useState(false);

  const handleChangePassword = async (userId, newPassword) => {
    try {
      await userService.changePassword(userId, { newPassword });
      console.log("Password changed successfully for user:", userId);
      setShowPasswordChangeSuccess(true);
      setTimeout(() => {
        setShowPasswordChangeSuccess(false);
      }, 3000);

      if (auth && auth.id) {
        console.log("Dashboard: Updating auth context after password change.");
        const updatedAuth = { ...auth, isChanged: true };
        setAuth(updatedAuth);
        localStorage.setItem("lrms-auth", JSON.stringify(updatedAuth));
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response && error.response.data) {
        console.error("Server Error Details:", error.response.data);
      }
      alert("Failed to change password.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Dashboard useEffect running. Auth state:", auth);

    console.log("Dashboard: Checking condition:");
    console.log("  auth is", auth);
    console.log("  auth?.isChanged is", auth?.isChanged);
    console.log("  isChangePasswordModalOpen is", isChangePasswordModalOpen);

    if (auth && auth.isChanged === false) {
      console.log(
        "Dashboard: Conditions met to open change password modal.",
        auth
      );
      setUserToChangePassword(auth);
      console.log(
        "Dashboard: Setting userToChangePassword to auth object",
        auth
      );
      console.log("Dashboard: Calling setIsChangePasswordModalOpen(true)");
      setIsChangePasswordModalOpen(true);
    } else {
      console.log(
        "Dashboard: Conditions not met to open modal or auth state is changed.",
        auth
      );
      if (isChangePasswordModalOpen) {
        console.log("Dashboard: Auth state is changed, closing modal.");
        setIsChangePasswordModalOpen(false);
      }
    }
  }, [auth, isChangePasswordModalOpen]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          SDO - Imus City LRMS Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sa serbisyong totoo at makatao, Bidang Imusenyo ang panalo
        </p>
      </motion.div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Quick Stats Card - Moved to top */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FaBook
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Learning Materials Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border-2 ${category.color} ${category.textColor} transition-all duration-300 hover:shadow-md`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2 mb-2">
                      <category.icon size={20} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <span className="text-2xl font-bold">{category.count}</span>
                    <span className="text-sm opacity-75">materials</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DashboardStats />

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Learning Areas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {learningAreas.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <SubjectCard subject={subject} />
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Render the ChangePasswordModal */}
      <ChangePasswordModal
        user={userToChangePassword}
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
      />

      {/* Success Message Pop-up for password change */}
      <AnimatePresence>
        {showPasswordChangeSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 bg-opacity-90 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-2">
              <p className="text-sm">Password successfully changed!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"></div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-200 dark:bg-gray-700 rounded-xl h-24"
              ></div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
