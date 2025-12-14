import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardStats from "../../components/DashboardStats";
import DashboardActivityWidget from "../../components/DashboardActivityWidget";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { useStateContext } from "../../contexts/ContextProvider";
import userService from "../../services/user-endpoints";
import { getAllMaterials } from "../../services/lrms-endpoints";
import { Link } from "react-router-dom";
// Dashboard card icons
import cubesIcon from "../../assets/cubes.png";
import manuscriptIcon from "../../assets/manuscript.png";
import googleSheetsIcon from "../../assets/google-sheets.png";
import bookIcon from "../../assets/book.png";
import modelIcon from "../../assets/model.png";
import folderIcon from "../../assets/folder.png";

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
            else if (
              type.includes("worksheet") ||
              type.includes("learning activity sheet")
            ) {
              counts.worksheets++;
            } else if (type.includes("storybook")) counts.storybooks++;
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
    <div className="space-y-6">
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-xl p-4 shadow-lg"
          >
            <h2 className="text-xl font-bold mb-1">
              Welcome to ILeaRN Dashboard
            </h2>
            <p className="text-blue-100 text-sm">
              Sa serbisyong totoo at makatao, Bidang Imusenyo ang panalo
            </p>
          </motion.div>

          {/* Learning Materials Overview - Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Modules
                </h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {categoryCounts.modules}
                </p>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={cubesIcon}
                  alt="Modules"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Learning modules
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-200 to-cyan-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Manuscripts
                </h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {categoryCounts.manuscripts}
                </p>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={manuscriptIcon}
                  alt="Manuscripts"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Manuscript materials
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Worksheets
                </h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {categoryCounts.worksheets}
                </p>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={googleSheetsIcon}
                  alt="Worksheets"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Learning activity sheets
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-200 to-violet-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Storybooks
                </h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {categoryCounts.storybooks}
                </p>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={bookIcon}
                  alt="Storybooks"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Story materials
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-200 to-yellow-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Exemplars
                </h3>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  {categoryCounts.exemplars}
                </p>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={modelIcon}
                  alt="Exemplars"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Lesson exemplars
              </p>
            </div>
          </div>

          {/* Data Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Materials Metadata Uploaded
                </h4>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {categoryCounts.modules +
                    categoryCounts.manuscripts +
                    categoryCounts.worksheets +
                    categoryCounts.storybooks +
                    categoryCounts.exemplars}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
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
                  <div className="w-full bg-white/90 backdrop-blur-sm rounded-full h-2">
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
                </div>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={folderIcon}
                  alt="Folder"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Metadata records
              </p>
            </div>

            <div className="bg-gradient-to-r from-teal-200 to-cyan-200 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group relative overflow-hidden">
              {/* Card Content */}
              <div className="relative z-10">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Files Uploaded
                </h4>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {
                    allMaterials.filter(
                      (mat) => mat.fileName && mat.fileName.trim() !== ""
                    ).length
                  }{" "}
                  /{" "}
                  {categoryCounts.modules +
                    categoryCounts.manuscripts +
                    categoryCounts.worksheets +
                    categoryCounts.storybooks +
                    categoryCounts.exemplars}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
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
                        return targetCount > 0
                          ? Math.round((uploadedCount / targetCount) * 100)
                          : 0;
                      })()}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-white/90 backdrop-blur-sm rounded-full h-2">
                    <motion.div
                      className="bg-green-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(() => {
                          const targetCount =
                            categoryCounts.modules +
                            categoryCounts.manuscripts +
                            categoryCounts.worksheets +
                            categoryCounts.storybooks +
                            categoryCounts.exemplars;
                          const uploadedCount = allMaterials.filter(
                            (mat) => mat.fileName && mat.fileName.trim() !== ""
                          ).length;
                          return targetCount > 0
                            ? Math.min(
                                Math.round((uploadedCount / targetCount) * 100),
                                100
                              )
                            : 0;
                        })()}%`,
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* Icon in top-right corner */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 p-2">
                <img
                  src={folderIcon}
                  alt="Files"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Description text */}
              <p className="text-xs text-gray-600 mt-1.5 relative z-10">
                Uploaded documents
              </p>
            </div>
          </div>

          {/* Dashboard Stats and Activity Widget Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Chart - Takes 2/3 of the width */}
            <div className="lg:col-span-2">
              <DashboardStats />
            </div>

            {/* Activity Widget - Takes 1/3 of the width */}
            <div className="lg:col-span-1">
              <DashboardActivityWidget />
            </div>
          </div>

          {/* Most Recent Materials Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Most Recent Materials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Kindergarten",
                  color: "from-purple-200 to-violet-200",
                  icon: "🎨",
                },
                {
                  name: "Elementary",
                  color: "from-pink-200 to-rose-200",
                  icon: "📚",
                },
                {
                  name: "Junior High School",
                  color: "from-blue-200 to-cyan-200",
                  icon: "🎓",
                },
                {
                  name: "Senior High School",
                  color: "from-green-200 to-emerald-200",
                  icon: "🎯",
                },
              ].map((section) => {
                const recent = getRecentMaterialsByLevel(section.name);
                return (
                  <div
                    key={section.name}
                    className={`bg-gradient-to-r ${section.color} rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 group relative overflow-hidden`}
                  >
                    {/* Card Header */}
                    <div className="relative z-10 mb-4">
                      <h4 className="text-sm font-bold text-gray-800 mb-1">
                        {section.name}
                      </h4>
                      <div className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span className="text-lg">{section.icon}</span>
                        <span>{recent.length} materials</span>
                      </div>
                    </div>

                    {/* Materials List */}
                    <div className="relative z-10 space-y-2 max-h-56 overflow-y-auto">
                      {recent.length > 0 ? (
                        recent.slice(0, 5).map((mat) => (
                          <div
                            key={mat.id}
                            className="bg-white/90 backdrop-blur-sm p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                          >
                            <p className="font-semibold text-xs text-gray-900 truncate mb-1">
                              {mat.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <span className="truncate">
                                {mat.learningAreaName || mat.subjectTypeName}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {mat.uploadedAt
                                ? new Date(mat.uploadedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )
                                : ""}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-500">
                            No materials yet
                          </p>
                        </div>
                      )}
                    </div>

                    {/* View All Button */}
                    {recent.length > 5 && (
                      <div className="mt-4 relative z-10">
                        <Link
                          to="/admin/materials-management"
                          className="block w-full text-center bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 font-semibold text-xs py-2 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                          View All ({recent.length}) →
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
