import { useState, useEffect } from "react";
import Footer from "../../components/Footer";
import heroImage from "../../assets/pngegg.png";
import ClientHeader from "../../components/ClientHeader";
import { getAllMaterials } from "../../services/lrms-endpoints";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";
import { useStateContext } from "../../contexts/ContextProvider";
import userService from "../../services/user-endpoints";
import { motion, AnimatePresence } from "framer-motion";

const Hero = () => {
  // (removed password modal logic, only keep Hero content)

  return (
    <div className="bg-white dark:bg-gray-800 min-h-[400px] sm:min-h-[500px] md:h-[600px] lg:h-[750px] flex items-center overflow-hidden relative py-8 sm:py-12 md:py-0">
      {/* Decorative Blobs - More visible and darker */}
      <svg
        className="absolute left-[-100px] top-[-100px] w-[400px] h-[400px] opacity-50 text-blue-800 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M41.3,-66.2C54.2,-59.7,65.2,-54.2,71.2,-44.7C77.2,-35.2,78.2,-21.7,77.7,-8.7C77.2,4.3,75.2,17,69.2,27.7C63.2,38.4,53.2,47.2,42.2,54.7C31.2,62.2,19.2,68.4,6.2,70.2C-6.8,72,-20.7,69.4,-32.2,62.7C-43.7,56,-52.7,45.2,-59.2,33.2C-65.7,21.2,-69.7,8,-70.2,-5.7C-70.7,-19.3,-67.7,-33.3,-59.7,-43.2C-51.7,-53.1,-38.7,-58.8,-25.2,-64.2C-11.7,-69.7,2.3,-74.8,16.2,-75.2C30.2,-75.7,54.2,-72.7,41.3,-66.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute right-[-120px] bottom-[-120px] w-[350px] h-[350px] opacity-40 text-blue-900 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M36.6,-62.2C48.2,-54.7,58.2,-48.2,65.2,-38.7C72.2,-29.2,76.2,-16.7,75.7,-4.2C75.2,8.3,70.2,20.7,62.2,30.7C54.2,40.7,43.2,48.2,31.2,54.7C19.2,61.2,6.2,66.7,-7.8,70.2C-21.8,73.7,-36.7,75.2,-48.2,68.2C-59.7,61.2,-67.7,45.7,-70.2,30.2C-72.7,14.7,-69.7,-0.8,-65.2,-15.2C-60.7,-29.7,-54.7,-43.2,-44.2,-51.7C-33.7,-60.2,-16.8,-63.7,-1.2,-62.2C14.3,-60.7,28.7,-54.7,36.6,-62.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute left-[30%] top-[20%] w-40 h-40 opacity-30 text-blue-700 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M47.6,-66.2C60.7,-57.7,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.3,60.2,20.2C53.7,34.1,45.7,46.9,34.2,54.7C22.7,62.5,7.7,65.3,-7.2,68.2C-22.1,71.1,-37,74.1,-48.2,66.2C-59.4,58.3,-67,39.5,-68.2,21.2C-69.4,2.9,-64.2,-14.9,-56.2,-28.7C-48.2,-42.5,-37.4,-52.3,-24.7,-60.2C-12,-68.1,2.6,-74.1,17.6,-74.7C32.6,-75.3,47.6,-70.7,47.6,-66.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4">
              ILeaRN Portal
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-blue-700 dark:text-blue-300 mb-3 sm:mb-4">
              Imus Learning Resource Management System
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Schools Division Office of Imus City Learning Resource Management
              System (LRMS) Portal named I LeaRN (Imus Learning Resources
              Navigator) supports effective implementation of the Learning
              Resource Management and Development System (LRMDS) to improve
              access to learning, teaching, and professional development
              resources by schools. It is a web-based repository of available
              learning materials in electronic copies, developed and quality
              assured in the National level, Regional level, and Division level.
            </p>
          </div>
          <div>
            <img
              src={heroImage}
              alt="Learning Resources"
              className="w-full h-auto rounded-lg max-w-md mx-auto md:max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMaterials();
        if (response.success) {
          setTotalMaterials(response.data.length);
          setMaterials(response.data.slice(0, 9));
        } else {
          console.error("Failed to fetch materials:", response.message);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div
      id="recent-materials"
      className="bg-primary-600 py-12 overflow-hidden relative"
    >
      {/* Decorative Blobs - More visible */}
      <svg
        className="absolute left-[-100px] top-[-100px] w-[400px] h-[400px] opacity-30 text-blue-300 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M41.3,-66.2C54.2,-59.7,65.2,-54.2,71.2,-44.7C77.2,-35.2,78.2,-21.7,77.7,-8.7C77.2,4.3,75.2,17,69.2,27.7C63.2,38.4,53.2,47.2,42.2,54.7C31.2,62.2,19.2,68.4,6.2,70.2C-6.8,72,-20.7,69.4,-32.2,62.7C-43.7,56,-52.7,45.2,-59.2,33.2C-65.7,21.2,-69.7,8,-70.2,-5.7C-70.7,-19.3,-67.7,-33.3,-59.7,-43.2C-51.7,-53.1,-38.7,-58.8,-25.2,-64.2C-11.7,-69.7,2.3,-74.8,16.2,-75.2C30.2,-75.7,54.2,-72.7,41.3,-66.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute right-[-120px] bottom-[-120px] w-[350px] h-[350px] opacity-30 text-blue-500 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M36.6,-62.2C48.2,-54.7,58.2,-48.2,65.2,-38.7C72.2,-29.2,76.2,-16.7,75.7,-4.2C75.2,8.3,70.2,20.7,62.2,30.7C54.2,40.7,43.2,48.2,31.2,54.7C19.2,61.2,6.2,66.7,-7.8,70.2C-21.8,73.7,-36.7,75.2,-48.2,68.2C-59.7,61.2,-67.7,45.7,-70.2,30.2C-72.7,14.7,-69.7,-0.8,-65.2,-15.2C-60.7,-29.7,-54.7,-43.2,-44.2,-51.7C-33.7,-60.2,-16.8,-63.7,-1.2,-62.2C14.3,-60.7,28.7,-54.7,36.6,-62.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute left-[30%] top-[20%] w-40 h-40 opacity-20 text-blue-400 pointer-events-none z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M47.6,-66.2C60.7,-57.7,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.3,60.2,20.2C53.7,34.1,45.7,46.9,34.2,54.7C22.7,62.5,7.7,65.3,-7.2,68.2C-22.1,71.1,-37,74.1,-48.2,66.2C-59.4,58.3,-67,39.5,-68.2,21.2C-69.4,2.9,-64.2,-14.9,-56.2,-28.7C-48.2,-42.5,-37.4,-52.3,-24.7,-60.2C-12,-68.1,2.6,-74.1,17.6,-74.7C32.6,-75.3,47.6,-70.7,47.6,-66.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="container mx-auto px-2 sm:px-4 flex flex-col relative z-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-white mb-4 sm:mb-6 md:mb-8 text-left">
          Most Recent Materials
        </h2>
        <div className="flex-1">
          {isLoading ? (
            <p className="text-center text-white w-full text-sm sm:text-base">
              Loading materials...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="bg-white/90 dark:bg-white/80 border border-blue-200 rounded-lg shadow-md overflow-hidden transition-all duration-200 cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:bg-blue-100/80 dark:hover:bg-blue-200/80"
                >
                  <div className="p-3 sm:p-4 md:p-6">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-primary-700 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    <div className="mb-2 flex flex-wrap gap-1 sm:gap-2">
                      <span className="inline-block text-xs sm:text-sm text-blue-700 bg-blue-100 rounded px-1.5 sm:px-2 py-0.5">
                        {material.gradeLevelName || "No Grade"}
                      </span>
                      {material.learningAreaName ? (
                        <span className="inline-block text-xs sm:text-sm text-green-700 bg-green-100 rounded px-1.5 sm:px-2 py-0.5">
                          {material.learningAreaName}
                        </span>
                      ) : (
                        <>
                          {material.trackName && (
                            <span className="inline-block text-xs sm:text-sm text-purple-700 bg-purple-100 rounded px-1.5 sm:px-2 py-0.5">
                              {material.trackName}
                            </span>
                          )}
                          {material.strandName && (
                            <span className="inline-block text-xs sm:text-sm text-pink-700 bg-pink-100 rounded px-1.5 sm:px-2 py-0.5">
                              {material.strandName}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700 font-normal line-clamp-3">
                      {material.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {totalMaterials > 9 && (
          <div className="text-center mt-8">
            <button
              onClick={() => (window.location.href = "/materials-directory")}
              className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              View Other Materials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ClientPage = () => {
  const { auth, setAuth } = useStateContext();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [showPasswordChangeSuccess, setShowPasswordChangeSuccess] =
    useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 font-poppins">
      <ClientHeader />
      <main className="flex-grow">
        <Hero />
        <RecentMaterials />
      </main>
      <Footer />
      <ChangePasswordModal
        user={userToChangePassword}
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
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

export default ClientPage;
