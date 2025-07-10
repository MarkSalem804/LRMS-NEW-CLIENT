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
import { getAllMaterials } from "../../services/lrms-endpoints";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { auth, setAuth } = useStateContext();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [showPasswordChangeSuccess, setShowPasswordChangeSuccess] =
    useState(false);
  const [categoryCounts, setCategoryCounts] = useState({
    modules: 0,
    manuscripts: 0,
    worksheets: 0,
    storybooks: 0,
    exemplars: 0,
  });
  const [allMaterials, setAllMaterials] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMaterials();
        if (response.success && Array.isArray(response.data)) {
          // Count by materialType/category (assuming materialType or category field exists)
          const counts = {
            modules: 0,
            manuscripts: 0,
            worksheets: 0,
            storybooks: 0,
            exemplars: 0,
          };
          response.data.forEach((mat) => {
            // Use typeName field for resource type
            const type = (mat.typeName || "").toLowerCase();
            if (type.includes("module")) counts.modules++;
            else if (type.includes("manuscript")) counts.manuscripts++;
            else if (type.includes("worksheet")) counts.worksheets++;
            else if (type.includes("storybook")) counts.storybooks++;
            else if (type.includes("exemplar")) counts.exemplars++;
          });
          setCategoryCounts(counts);
          setAllMaterials(response.data); // Store all materials for Data Overview
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCounts();
  }, []);

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
    if (auth && auth.isChanged === false) {
      setUserToChangePassword(auth);
      setIsChangePasswordModalOpen(true);
    } else {
      if (isChangePasswordModalOpen) {
        setIsChangePasswordModalOpen(false);
      }
    }
  }, [auth, isChangePasswordModalOpen]);

  // Helper to filter and sort most recent materials by level
  const getRecentMaterialsByLevel = (levelName) => {
    return allMaterials
      .filter(
        (mat) =>
          mat.fileName &&
          mat.fileName.trim() !== "" &&
          ((levelName === "Elementary" &&
            [
              "Grade 1",
              "Grade 2",
              "Grade 3",
              "Grade 4",
              "Grade 5",
              "Grade 6",
            ].includes(mat.gradeLevelName)) ||
            (levelName === "Junior High School" &&
              ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
                mat.gradeLevelName
              )) ||
            (levelName === "Senior High School" &&
              ["Grade 11", "Grade 12"].includes(mat.gradeLevelName)) ||
            (levelName === "Kindergarten" &&
              ["Kindergarten"].includes(mat.gradeLevelName)))
      )
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  };

  return (
    <div className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white mb-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          SDO - IMUS CITY iLeaRN DASHBOARD
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sa serbisyong totoo at makatao, Bidang Imusenyo ang panalo
        </p>
      </motion.div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Quick Stats Card - Dynamic */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 mx-2">
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
              {/* Solid gradient color cards */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-pink-500 to-pink-700 text-white transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBook size={20} className="text-white" />
                    <span className="font-medium text-white">Modules</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {categoryCounts.modules}
                  </span>
                  <span className="text-sm opacity-75">materials</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaFileAlt size={20} className="text-white" />
                    <span className="font-medium text-white">Manuscripts</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {categoryCounts.manuscripts}
                  </span>
                  <span className="text-sm opacity-75">materials</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPencilAlt size={20} className="text-white" />
                    <span className="font-medium text-white">
                      Learning Worksheets
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {categoryCounts.worksheets}
                  </span>
                  <span className="text-sm opacity-75">materials</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBookReader size={20} className="text-white" />
                    <span className="font-medium text-white">Storybooks</span>
                  </div>
                  <span className="text-2xl font-bold">
                    {categoryCounts.storybooks}
                  </span>
                  <span className="text-sm opacity-75">materials</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-white transition-all duration-300 hover:shadow-md">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaChalkboardTeacher size={20} className="text-white" />
                    <span className="font-medium text-white">
                      Lesson Exemplars
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {categoryCounts.exemplars}
                  </span>
                  <span className="text-sm opacity-75">materials</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Overview Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 mx-2">
            <div className="flex items-center space-x-3 mb-4">
              <FaFileAlt
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Data Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="bg-[#002451] rounded-lg shadow p-4 flex flex-row items-center">
                <FaBook className="text-white mr-4" size={36} />
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-white font-semibold">
                    Materials Metadata Uploaded
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {categoryCounts.modules +
                      categoryCounts.manuscripts +
                      categoryCounts.worksheets +
                      categoryCounts.storybooks +
                      categoryCounts.exemplars}
                  </span>
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-white mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round(
                          ((categoryCounts.modules +
                            categoryCounts.manuscripts +
                            categoryCounts.worksheets +
                            categoryCounts.storybooks +
                            categoryCounts.exemplars) /
                            100) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            ((categoryCounts.modules +
                              categoryCounts.manuscripts +
                              categoryCounts.worksheets +
                              categoryCounts.storybooks +
                              categoryCounts.exemplars) /
                              100) *
                              100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-xs text-white mt-1">
                      Target: 100 materials
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-[#002451] rounded-lg shadow p-4 flex flex-row items-center">
                <FaFileAlt className="text-white mr-4" size={36} />
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-white font-semibold">
                    Metadata File Uploaded
                  </span>
                  {(() => {
                    const targetCount =
                      categoryCounts.modules +
                      categoryCounts.manuscripts +
                      categoryCounts.worksheets +
                      categoryCounts.storybooks +
                      categoryCounts.exemplars;
                    const uploadedCount = allMaterials.filter(
                      (mat) => mat.fileName && mat.fileName.trim() !== ""
                    ).length;
                    const percent =
                      targetCount > 0
                        ? Math.round((uploadedCount / targetCount) * 100)
                        : 0;
                    return (
                      <>
                        <span className="text-2xl font-bold text-white">
                          {uploadedCount} / {targetCount}
                        </span>
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-white mb-1">
                            <span>Progress</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <motion.div
                              className="bg-green-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(percent, 100)}%`,
                              }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-xs text-white mt-1">
                            Target: {targetCount} files
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <DashboardStats />

          {/* Most Recent Materials Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 mx-2">
            <div className="flex items-center space-x-3 mb-4">
              <FaBook
                className="text-primary-600 dark:text-primary-400"
                size={20}
              />
              <h2 className="text-lg font-semibold text-black">
                Most Recent Materials
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Kindergarten",
                  color: "bg-purple-100",
                  text: "text-white",
                  headerBg: "#9333ea",
                },
                {
                  name: "Elementary",
                  color: "bg-pink-100",
                  text: "text-white",
                  headerBg: "#db2777",
                },
                {
                  name: "Junior High School",
                  color: "bg-blue-100",
                  text: "text-white",
                  headerBg: "#2563eb",
                },
                {
                  name: "Senior High School",
                  color: "bg-green-100",
                  text: "text-white",
                  headerBg: "#16a34a",
                },
              ].map((section) => {
                const recent = getRecentMaterialsByLevel(section.name);
                return (
                  <div
                    key={section.name}
                    className={`rounded-lg shadow p-4 ${section.color}`}
                  >
                    <h3
                      className={`text-md font-bold mb-3 ${section.text} px-3 py-1 text-center w-full`}
                      style={{ backgroundColor: section.headerBg || undefined }}
                    >
                      {section.name}
                    </h3>
                    <ul className="space-y-2">
                      {recent.slice(0, 10).map((mat) => (
                        <li
                          key={mat.id}
                          className="flex flex-col border-b last:border-b-0 pb-2 text-black"
                        >
                          <span className="font-semibold truncate text-black">
                            {mat.title}
                          </span>
                          <span className="text-xs text-black">
                            {mat.gradeLevelName} &middot;{" "}
                            {mat.learningAreaName || mat.subjectTypeName}
                          </span>
                          <span className="text-xs text-black">
                            {mat.uploadedAt
                              ? new Date(mat.uploadedAt).toLocaleDateString()
                              : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {recent.length > 10 && (
                      <div className="mt-4 flex justify-center">
                        <Link
                          to="/admin/materials-management"
                          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                        >
                          Proceed to the Materials Management
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
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
