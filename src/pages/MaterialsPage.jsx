/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaFilter, FaTimes } from "react-icons/fa";
import MaterialCard from "../components/MaterialCard";
import learningAreas from "../data/learningAreas";
import materials from "../data/materials";

const MaterialsPage = () => {
  const { subjectId } = useParams();
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewType, setViewType] = useState("card");

  const subject = learningAreas.find((area) => area.id === subjectId);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);

    const timer = setTimeout(() => {
      filterMaterials(selectedCategory);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [subjectId, selectedCategory]);

  const filterMaterials = (category) => {
    let filtered = materials.filter(
      (material) => material.subject === subjectId
    );

    if (category !== "All") {
      filtered = filtered.filter((material) => material.type === category);
    }

    setFilteredMaterials(filtered);
  };

  const materialTypes = [
    "All",
    ...new Set(
      materials.filter((m) => m.subject === subjectId).map((m) => m.type)
    ),
  ];

  if (!subject) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Subject not found
        </h2>
        <Link
          to="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <Link to="/" className="text-gray-500 hover:text-primary-600 mr-2">
              <FaArrowLeft size={18} />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {subject.name} Materials
            </h1>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => setViewType("card")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewType === "card"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewType === "list"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Mobile Filter Button */}
          <button
            className="md:hidden flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg"
            onClick={() => setIsFilterOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filter
          </button>

          {/* Desktop Filter */}
          <div className="hidden md:flex space-x-2">
            {materialTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCategory(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === type
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search materials..."
            className="border-4 border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
        </div>
      </div>

      {/* Mobile Filter Popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filter by Category
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="flex flex-col space-y-2">
              {materialTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedCategory(type);
                    setIsFilterOpen(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors text-left ${
                    selectedCategory === type
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80"
            ></div>
          ))}
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
            No materials found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            No {selectedCategory !== "All" ? selectedCategory : ""} materials
            available for {subject.name}.
          </p>
        </div>
      ) : (
        <div
          className={`grid ${
            viewType === "list"
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          } gap-6`}
        >
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {viewType === "card" ? (
                <MaterialCard material={material} />
              ) : (
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {material.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {material.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/materials/${material.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsPage;
