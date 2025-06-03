/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FaStar,
  FaDownload,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaShare,
  FaTimes,
} from "react-icons/fa";
import MaterialsDetailsModal from "./modals/MaterialsDetailsModal";

const pastelColors = [
  "bg-red-300 dark:bg-red-200",
  "bg-blue-300 dark:bg-blue-200",
  "bg-green-300 dark:bg-green-200",
  "bg-yellow-300 dark:bg-yellow-200",
  "bg-purple-300 dark:bg-purple-200",
  "bg-pink-300 dark:bg-pink-200",
  "bg-indigo-300 dark:bg-indigo-200",
  "bg-teal-300 dark:bg-teal-200",
  "bg-orange-300 dark:bg-orange-200",
  "bg-lime-300 dark:bg-lime-200",
  "bg-emerald-300 dark:bg-emerald-200",
  "bg-cyan-300 dark:bg-cyan-200",
  "bg-sky-300 dark:bg-sky-200",
  "bg-violet-300 dark:bg-violet-200",
  "bg-fuchsia-300 dark:bg-fuchsia-200",
  "bg-rose-300 dark:bg-rose-200",
];

// Simple hash function for strings to get a somewhat consistent index
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const MaterialCard = ({ material, onView }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleDownload = () => {
    setShowDownloadPopup(true);
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Cleanup interval after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsDownloading(false);
      setDownloadProgress(0);
      setShowDownloadPopup(false);
    }, 2000);
  };

  const idString = String(material.id);
  const colorIndex = simpleHash(idString) % pastelColors.length;
  const cardColorClass = pastelColors[colorIndex];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className={`m-4 rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 ${cardColorClass}`}
      >
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-900 line-clamp-2">
              {material.title}
            </h3>
            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 text-xs font-medium rounded-full">
              {material.typeName || "N/A"}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-700 text-sm mb-4 line-clamp-2">
            {material.description}
          </p>

          {/* Grade and Area/Subject Info */}
          <div className="text-xs text-gray-600 dark:text-gray-700 mb-3 space-y-1">
            <p>
              <span className="font-semibold">Grade:</span>{" "}
              {material.gradeLevelName || "N/A"}
            </p>
            <p>
              {material.subjectTypeName ||
                material.trackName ||
                material.strandName ||
                material.learningAreaName ||
                material.componentName ||
                "N/A"}
            </p>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-700 mb-4">
            <FaUser className="mr-1 inline-block" />
            <span className="mr-3">{material.author || "N/A"}</span>
            <FaCalendarAlt className="mr-1 inline-block" />
            <span>{new Date(material.uploadedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <FaStar className="text-warning-500 mr-1 inline-block" />
                <span className="font-medium text-gray-700 dark:text-gray-800">
                  {material.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center">
                <FaDownload className="text-primary-500 mr-1 inline-block" />
                <span className="font-medium text-gray-700 dark:text-gray-800">
                  {material.downloads}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDetailsModal(true)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaEye
                  style={{ width: "16px", height: "16px", display: "block" }}
                />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaDownload
                  style={{ width: "16px", height: "16px", display: "block" }}
                />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaShare
                  style={{ width: "16px", height: "16px", display: "block" }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download Popup */}
      <AnimatePresence>
        {showDownloadPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Downloading {material.title}
                </h3>
                <button
                  onClick={() => setShowDownloadPopup(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-500"
                    initial={{ width: "0%" }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {downloadProgress}% Complete
                </p>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>File: {material.title}</p>
                <p>Type: {material.typeName || "N/A"}</p>
                <p>Size: {Math.floor(Math.random() * 10) + 1}MB</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {material.title} Details
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Type:</strong> {material.type}
                </p>
                <p>
                  <strong>Description:</strong> {material.description}
                </p>
                <p>
                  <strong>Author:</strong> {material.author}
                </p>
                <p>
                  <strong>Date Added:</strong>{" "}
                  {new Date(material.uploadedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Downloads:</strong> {material.downloads}
                </p>
                <p>
                  <strong>Rating:</strong> {material.rating.toFixed(1)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MaterialsDetailsModal
        material={material}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </>
  );
};

MaterialCard.propTypes = {
  material: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    typeName: PropTypes.string,
    subject: PropTypes.string,
    description: PropTypes.string.isRequired,
    dateAdded: PropTypes.string,
    downloads: PropTypes.number,
    rating: PropTypes.number,
    author: PropTypes.string,
    thumbnail: PropTypes.string,
    grade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    area: PropTypes.string,
    component: PropTypes.string,
    coreSubject: PropTypes.string,
    track: PropTypes.string,
    subTrack: PropTypes.string,
    appliedSubject: PropTypes.string,
    specializedSubject: PropTypes.string,
    gradeLevelName: PropTypes.string,
    uploadedAt: PropTypes.string,
    subjectTypeName: PropTypes.string,
    trackName: PropTypes.string,
    strandName: PropTypes.string,
    learningAreaName: PropTypes.string,
    componentName: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
};

export default MaterialCard;
