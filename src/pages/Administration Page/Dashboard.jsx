import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardStats from "../../components/DashboardStats";
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

  // Define mock learningAreas data with material counts
  const learningAreas = [
    { id: 1, name: "Filipino", materialCount: 350 },
    { id: 2, name: "English", materialCount: 420 },
    { id: 3, name: "Mathematics", materialCount: 510 },
    { id: 4, name: "Science", materialCount: 380 },
    { id: 5, name: "Apan (Araling Panlipunan)", materialCount: 290 },
    {
      id: 6,
      name: "EPP (Edukasyong Pantahanan at Pangkabuhayan)",
      materialCount: 150,
    },
    {
      id: 7,
      name: "TLE (Technology and Livelihood Education)",
      materialCount: 220,
    },
    { id: 8, name: "EsP (Edukasyon sa Pagpapakatao)", materialCount: 180 },
    {
      id: 9,
      name: "MAPEH (Music, Arts, Physical Education, and Health)",
      materialCount: 310,
    },
  ];

  // Calculate total materials for progress bar
  const totalMaterials = learningAreas.reduce(
    (sum, area) => sum + (area.materialCount || 0),
    0
  );

  const handleChangePassword = async (userId, newPassword) => {
    try {
      await userService.changePassword(userId, { newPassword });
      setShowPasswordChangeSuccess(true);
      setTimeout(() => {
        setShowPasswordChangeSuccess(false);
      }, 3000);

      if (auth && auth.id) {
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
    if (auth && auth.isChanged === false) {
      setUserToChangePassword(auth);
      setIsChangePasswordModalOpen(true);
    } else {
      console.log(
        "Dashboard: Conditions not met to open modal or auth state is changed.",
        auth
      );
      if (isChangePasswordModalOpen) {
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

          {/* Add a grid container for Learning Areas and Recent Uploads */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Learning Areas with Progress Bars - Now in a grid column */}
            <div>
              {/* Add Learning Areas title inside the grid column */}
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
                Learning Areas
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="space-y-4">
                  {learningAreas.map((area) => (
                    <div key={area.id} className="flex flex-col space-y-2">
                      <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span>{area.name}</span>
                        <span>{area.materialCount || 0} materials</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        {/* Ensure totalMaterials is not zero to avoid division by zero */}
                        <div
                          className="bg-blue-600 h-2 rounded-full dark:bg-blue-500"
                          style={{
                            width: `${
                              totalMaterials > 0
                                ? ((area.materialCount || 0) / totalMaterials) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Most Recent Uploads Section - New grid column */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center space-x-2">
                <FaFileAlt
                  className="text-primary-600 dark:text-primary-400"
                  size={24}
                />
                <span>Most Recent Uploads</span>
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 h-full">
                {/* Placeholder for Recent Uploads List (replace with actual data fetching and mapping) */}
                <div className="space-y-3">
                  {/* Mock Data - Replace with actual fetched data */}
                  {Array.from({ length: 10 }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0 last:pb-0"
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Material Title {index + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uploaded on: 2023-10-27 | By: Uploader Name
                      </p>
                    </div>
                  ))}
                </div>
                {/* End Mock Data */}
              </div>
            </div>
          </div>

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
        </>
      )}
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
