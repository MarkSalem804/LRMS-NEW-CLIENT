/* eslint-disable no-unused-vars */
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import {
  getAllMaterials,
  viewMaterialFile,
  downloadMaterialFile,
  getMaterialDetails,
  incrementMaterialViews,
  incrementMaterialDownloads,
  submitMaterialRating,
  getUserRatingForMaterial,
} from "../../services/lrms-endpoints";
import ClientHeader from "../../components/ClientHeader";
import {
  FaThLarge,
  FaList,
  FaEye,
  FaDownload,
  FaTable,
  FaStar,
} from "react-icons/fa";
import Modal from "react-modal";
import whiteBg from "../../assets/withPencil.jpg";
import StarRating from "../../components/StarRating";
import { useStateContext } from "../../contexts/ContextProvider";
import AlertDialog from "../../components/modals/AlertDialog";

const JHSMaterials = () => {
  const { auth } = useStateContext();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [learningArea, setLearningArea] = useState("");
  const [component, setComponent] = useState("");
  const [resourceType, setResourceType] = useState("");

  // Options
  const [gradeLevels, setGradeLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [components, setComponents] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);

  const [view, setView] = useState("card");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMaterialUrl, setViewMaterialUrl] = useState("");
  const [viewMaterialTitle, setViewMaterialTitle] = useState("");
  const [viewMaterialId, setViewMaterialId] = useState(null);

  // Rating modal state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingMaterialId, setRatingMaterialId] = useState(null);
  const [ratingMaterialTitle, setRatingMaterialTitle] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [suggestions, setSuggestions] = useState("");
  const [userRating, setUserRating] = useState(null);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Alert dialog state
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    message: "",
    type: "success", // success, error, info
  });

  const [page, setPage] = useState(1);
  const itemsPerPage = 15;
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMaterials();
        if (response.success) {
          // Only JHS
          const jhs = response.data.filter((m) =>
            ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
              m.gradeLevelName
            )
          );
          setMaterials(jhs);
          setFilteredMaterials(jhs);
          // Extract unique filter options
          setGradeLevels([
            ...new Set(jhs.map((m) => m.gradeLevelName).filter(Boolean)),
          ]);
          setLearningAreas([
            ...new Set(jhs.map((m) => m.learningAreaName).filter(Boolean)),
          ]);
          setComponents([
            ...new Set(jhs.map((m) => m.componentName).filter(Boolean)),
          ]);
          setResourceTypes([
            ...new Set(jhs.map((m) => m.typeName).filter(Boolean)),
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    let filtered = materials;
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          (m.description &&
            m.description.toLowerCase().includes(search.toLowerCase()))
      );
    }
    if (gradeLevel)
      filtered = filtered.filter((m) => m.gradeLevelName === gradeLevel);
    if (learningArea)
      filtered = filtered.filter((m) => m.learningAreaName === learningArea);
    if (component)
      filtered = filtered.filter((m) => m.componentName === component);
    if (resourceType)
      filtered = filtered.filter((m) => m.typeName === resourceType);
    setFilteredMaterials(filtered);
  }, [search, gradeLevel, learningArea, component, resourceType, materials]);

  // Helper function to check if material has a viewable file
  const hasViewableFile = (material) => {
    return material.materialPath && material.fileName;
  };

  const handleView = async (material) => {
    // Don't proceed if no file available
    if (!hasViewableFile(material)) {
      setAlertDialog({
        isOpen: true,
        message: "This material does not have a viewable file.",
        type: "info",
      });
      return;
    }

    try {
      // Increment view count
      await incrementMaterialViews(material.id);

      // Optimistically update the view count in the UI
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, views: (m.views || 0) + 1 } : m
        )
      );

      // Also update filteredMaterials
      setFilteredMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, views: (m.views || 0) + 1 } : m
        )
      );

      const details = await getMaterialDetails(material.id);
      const title = details.material.title;
      setViewMaterialTitle(title);
      setViewMaterialId(material.id);
      const url = viewMaterialFile(material.id, title);
      setViewMaterialUrl(url);
      setIsViewModalOpen(true);
    } catch {
      setViewMaterialTitle("");
      setViewMaterialUrl("");
      setViewMaterialId(null);
      setIsViewModalOpen(false);
      setAlertDialog({
        isOpen: true,
        message: "Failed to load material.",
        type: "error",
      });
    }
  };

  const handleDownload = async (material) => {
    try {
      // Increment download count
      await incrementMaterialDownloads(material.id);

      // Optimistically update the download count in the UI
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, downloads: (m.downloads || 0) + 1 } : m
        )
      );

      // Also update filteredMaterials
      setFilteredMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id ? { ...m, downloads: (m.downloads || 0) + 1 } : m
        )
      );

      // Use the download endpoint which will trigger the download
      const url = downloadMaterialFile(material.id, material.title);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading material:", error);
      // Still try to download even if tracking fails
      const url = downloadMaterialFile(material.id, material.title);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleModalDownload = async () => {
    if (!viewMaterialId) return;

    try {
      // Increment download count
      await incrementMaterialDownloads(viewMaterialId);

      // Optimistically update the download count in the UI
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === viewMaterialId
            ? { ...m, downloads: (m.downloads || 0) + 1 }
            : m
        )
      );

      // Also update filteredMaterials
      setFilteredMaterials((prev) =>
        prev.map((m) =>
          m.id === viewMaterialId
            ? { ...m, downloads: (m.downloads || 0) + 1 }
            : m
        )
      );

      // Use the download endpoint
      const url = downloadMaterialFile(viewMaterialId, viewMaterialTitle);
      const link = document.createElement("a");
      link.href = url;
      link.download = viewMaterialTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading material:", error);
      // Still try to download even if tracking fails
      const url = downloadMaterialFile(viewMaterialId, viewMaterialTitle);
      const link = document.createElement("a");
      link.href = url;
      link.download = viewMaterialTitle;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle opening rating modal
  const handleOpenRatingModal = async (material) => {
    if (!auth || !auth.id) {
      setAlertDialog({
        isOpen: true,
        message: "Please log in to rate materials.",
        type: "info",
      });
      return;
    }

    setRatingMaterialId(material.id);
    setRatingMaterialTitle(material.title);
    setSelectedRating(0);
    setSuggestions("");
    setUserRating(null);

    // Check if user already rated this material
    try {
      const response = await getUserRatingForMaterial(material.id, auth.id);
      if (response.success && response.rating) {
        setUserRating(response.rating);
        setSelectedRating(response.rating.rating);
        setSuggestions(response.rating.suggestions || "");
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }

    setIsRatingModalOpen(true);
  };

  // Handle submitting rating
  const handleSubmitRating = async () => {
    if (!auth || !auth.id) {
      setAlertDialog({
        isOpen: true,
        message: "Please log in to rate materials.",
        type: "info",
      });
      return;
    }

    if (selectedRating === 0) {
      setAlertDialog({
        isOpen: true,
        message: "Please select a rating (1-5 stars).",
        type: "info",
      });
      return;
    }

    setIsSubmittingRating(true);
    try {
      const response = await submitMaterialRating(
        ratingMaterialId,
        auth.id,
        selectedRating,
        suggestions
      );

      if (response.success) {
        setAlertDialog({
          isOpen: true,
          message: userRating
            ? "Rating updated successfully!"
            : "Rating submitted successfully!",
          type: "success",
        });

        // Refresh materials to get updated average rating
        const materialsResponse = await getAllMaterials();
        if (materialsResponse.success) {
          const jhs = materialsResponse.data.filter((m) =>
            ["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(
              m.gradeLevelName
            )
          );
          setMaterials(jhs);
          setFilteredMaterials(jhs);
        }

        setIsRatingModalOpen(false);
        setSelectedRating(0);
        setSuggestions("");
        setUserRating(null);
      } else {
        setAlertDialog({
          isOpen: true,
          message: response.message || "Failed to submit rating.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      setAlertDialog({
        isOpen: true,
        message: "Failed to submit rating. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Set the app element for accessibility (only once)
  Modal.setAppElement("#root");

  return (
    <div className="relative flex flex-col min-h-screen font-poppins">
      {/* Background Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${whiteBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <ClientHeader />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10 gap-4">
            <button
              onClick={() => (window.location.href = "/materials-directory")}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-colors font-medium"
            >
              <span className="mr-2">&#8592;</span> Back
            </button>
            <div className="flex-1 flex justify-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white text-center">
                JUNIOR HIGH SCHOOL LEARNING RESOURCES
              </h2>
            </div>
            <div style={{ width: "96px" }}></div>{" "}
            {/* Spacer to balance layout */}
          </div>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8 bg-black border border-black rounded-lg shadow p-4">
            <input
              type="text"
              placeholder="Search materials..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Grade Levels</option>
              {gradeLevels.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={learningArea}
              onChange={(e) => setLearningArea(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Learning Areas</option>
              {learningAreas.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <select
              value={component}
              onChange={(e) => setComponent(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Components</option>
              {components.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300"
            >
              <option value="">All Resource Types</option>
              {resourceTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="min-h-[600px]">
              {/* View Toggle */}
              <div className="flex justify-end mb-4 gap-2">
                <button
                  className={`p-2 rounded ${
                    view === "card"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("card")}
                  title="Card View"
                >
                  <FaThLarge />
                </button>
                <button
                  className={`p-2 rounded ${
                    view === "list"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("list")}
                  title="List View"
                >
                  <FaList />
                </button>
                <button
                  className={`p-2 rounded ${
                    view === "table"
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setView("table")}
                  title="Table View"
                >
                  <FaTable />
                </button>
              </div>
              {view === "table" ? (
                <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white/80">
                  <div style={{ maxHeight: 480, overflowY: "auto" }}>
                    <table className="min-w-full text-sm">
                      <thead className="bg-gradient-to-r from-green-500 to-green-400">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Title
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Grade Level
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Learning Area
                          </th>
                          <th className="px-4 py-2 text-left font-medium text-black dark:text-white">
                            Component
                          </th>
                          <th className="px-4 py-2 text-center font-medium text-black dark:text-white">
                            Views
                          </th>
                          <th className="px-4 py-2 text-center font-medium text-black dark:text-white">
                            Downloads
                          </th>
                          <th className="px-4 py-2 text-center font-medium text-black dark:text-white">
                            Rating
                          </th>
                          <th className="px-4 py-2 text-center font-medium text-black dark:text-white">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMaterials.length === 0 ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="text-center text-gray-500 py-8"
                            >
                              No materials found.
                            </td>
                          </tr>
                        ) : (
                          paginatedMaterials.map((material) => (
                            <tr
                              key={material.id}
                              className="hover:bg-green-50 transition"
                            >
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 200 }}
                              >
                                {material.title}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 120 }}
                              >
                                {material.gradeLevelName}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 160 }}
                              >
                                {material.learningAreaName}
                              </td>
                              <td
                                className="px-4 py-2 truncate align-top"
                                style={{ maxWidth: 160 }}
                              >
                                {material.componentName}
                              </td>
                              <td className="px-4 py-2 text-center align-top">
                                <span className="inline-flex items-center gap-1 text-gray-700">
                                  <FaEye className="text-blue-600" />
                                  {material.views || 0}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center align-top">
                                <span className="inline-flex items-center gap-1 text-gray-700">
                                  <FaDownload className="text-green-600" />
                                  {material.downloads || 0}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center align-top">
                                {material.rating ? (
                                  <span className="inline-flex items-center gap-1 text-gray-700">
                                    <FaStar className="text-yellow-500" />
                                    {material.rating.toFixed(1)}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">
                                    Not rated
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2 text-center align-top">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    title={
                                      hasViewableFile(material)
                                        ? "View"
                                        : "No file available"
                                    }
                                    onClick={() => handleView(material)}
                                    disabled={!hasViewableFile(material)}
                                    className={`p-2 rounded-full shadow ${
                                      hasViewableFile(material)
                                        ? "bg-white hover:bg-green-100 text-green-700 cursor-pointer"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                    }`}
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    title="Rate Material"
                                    onClick={() =>
                                      handleOpenRatingModal(material)
                                    }
                                    className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow"
                                  >
                                    <FaStar />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-between items-center p-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 rounded bg-green-500 text-white disabled:bg-gray-300"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="px-3 py-1 rounded bg-green-500 text-white disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    view === "card"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                      : "flex flex-col gap-4"
                  }
                >
                  {filteredMaterials.map((material) =>
                    view === "card" ? (
                      <div
                        key={material.id}
                        className="bg-gradient-to-br from-green-100 to-green-300 rounded-lg shadow-md p-6 transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold text-green-700">
                            {material.title}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              title={
                                hasViewableFile(material)
                                  ? "View"
                                  : "No file available"
                              }
                              onClick={() => handleView(material)}
                              disabled={!hasViewableFile(material)}
                              className={`p-2 rounded-full shadow ${
                                hasViewableFile(material)
                                  ? "bg-white hover:bg-green-100 text-green-700 cursor-pointer"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                              }`}
                            >
                              <FaEye />
                            </button>
                            {/* <button
                              title="Download"
                              onClick={() => handleDownload(material)}
                              className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                            >
                              <FaDownload />
                            </button> */}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-1">
                          {material.gradeLevelName}
                        </p>
                        <p className="text-gray-600 mb-2">
                          {material.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <FaEye className="text-blue-600" />
                            <span>{material.views || 0} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaDownload className="text-green-600" />
                            <span>{material.downloads || 0} downloads</span>
                          </div>
                          {material.rating && (
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500" />
                              <span>{material.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleOpenRatingModal(material)}
                          className="w-full px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <FaStar />
                          Rate Material
                        </button>
                      </div>
                    ) : (
                      <div
                        key={material.id}
                        className="flex flex-col sm:flex-row items-start bg-gradient-to-br from-green-100 to-green-300 rounded-lg shadow-md p-2 sm:p-2.5 md:p-3 gap-2 sm:gap-3 hover:shadow-lg"
                      >
                        <div className="flex-1 w-full">
                          <div className="flex justify-between items-start mb-1 gap-1.5">
                            <h3 className="text-xs sm:text-sm md:text-base font-semibold text-green-700 flex-1 line-clamp-2">
                              {material.title}
                            </h3>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                title={
                                  hasViewableFile(material)
                                    ? "View"
                                    : "No file available"
                                }
                                onClick={() => handleView(material)}
                                disabled={!hasViewableFile(material)}
                                className={`p-1 sm:p-1.5 rounded-full shadow text-xs ${
                                  hasViewableFile(material)
                                    ? "bg-white hover:bg-green-100 text-green-700 cursor-pointer"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                                }`}
                              >
                                <FaEye />
                              </button>
                              {/* <button
                                title="Download"
                                onClick={() => handleDownload(material)}
                                className="p-2 rounded-full bg-white hover:bg-green-100 text-green-700 shadow"
                              >
                                <FaDownload />
                              </button> */}
                            </div>
                          </div>
                          <p className="text-xs text-gray-700 mb-0.5">
                            {material.gradeLevelName}
                          </p>
                          <p className="text-xs text-gray-600 mb-1.5 line-clamp-2">
                            {material.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600 mb-1.5">
                            <div className="flex items-center gap-0.5">
                              <FaEye className="text-blue-600 text-xs" />
                              <span>{material.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <FaDownload className="text-green-600 text-xs" />
                              <span>{material.downloads || 0}</span>
                            </div>
                            {material.rating && (
                              <div className="flex items-center gap-0.5">
                                <FaStar className="text-yellow-500 text-xs" />
                                <span>{material.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenRatingModal(material)}
                            className="w-full sm:w-auto px-2 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors flex items-center justify-center gap-1"
                          >
                            <FaStar className="text-xs" />
                            Rate
                          </button>
                        </div>
                      </div>
                    )
                  )}
                  {filteredMaterials.length === 0 && (
                    <p className="col-span-full text-center text-gray-500">
                      No materials found.
                    </p>
                  )}
                </div>
              )}
              {/* View Material Modal */}
              <Modal
                isOpen={isViewModalOpen}
                onRequestClose={() => {
                  setIsViewModalOpen(false);
                  setViewMaterialUrl("");
                  setViewMaterialTitle("");
                  setViewMaterialId(null);
                }}
                contentLabel="View Material"
                className="fixed inset-0 flex items-center justify-center p-2 z-[9999]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[9998]"
              >
                <div className="bg-white rounded-lg shadow-2xl w-full h-full max-w-[98vw] max-h-[98vh] flex flex-col">
                  {/* Header - Simple Title Bar */}
                  <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-base font-semibold text-white truncate">
                      {viewMaterialTitle || "PDF Document"}
                    </h3>
                  </div>

                  {/* PDF Viewer */}
                  <div className="flex-1 overflow-hidden bg-gray-800">
                    {viewMaterialUrl ? (
                      <embed
                        src={viewMaterialUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{ border: "none" }}
                        title={viewMaterialTitle || "PDF Viewer"}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                          <p className="text-lg mb-2">No material to display</p>
                          <p className="text-sm">
                            Please select a material to view
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer - Action Buttons */}
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={handleModalDownload}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
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
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setViewMaterialUrl("");
                        setViewMaterialTitle("");
                        setViewMaterialId(null);
                      }}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center gap-2"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Close
                    </button>
                  </div>
                </div>
              </Modal>
              {/* Rating Modal */}
              <Modal
                isOpen={isRatingModalOpen}
                onRequestClose={() => {
                  setIsRatingModalOpen(false);
                  setRatingMaterialId(null);
                  setRatingMaterialTitle("");
                  setSelectedRating(0);
                  setSuggestions("");
                  setUserRating(null);
                }}
                contentLabel="Rate Material"
                className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-[9999]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-[9998]"
              >
                <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-2 sm:mx-auto max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-yellow-600 sticky top-0 z-10">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
                      Rate Material
                    </h3>
                    <button
                      onClick={() => {
                        setIsRatingModalOpen(false);
                        setRatingMaterialId(null);
                        setRatingMaterialTitle("");
                        setSelectedRating(0);
                        setSuggestions("");
                        setUserRating(null);
                      }}
                      className="text-white hover:text-gray-200 p-1"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <h4 className="text-xs sm:text-sm md:text-base font-medium text-gray-800 mb-3 sm:mb-4 line-clamp-2">
                      {ratingMaterialTitle}
                    </h4>

                    {/* Star Rating */}
                    <div className="mb-3 sm:mb-4 md:mb-6">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        Your Rating (1-5 stars)
                      </label>
                      <div className="transform scale-90 sm:scale-100 origin-left">
                        <StarRating
                          rating={selectedRating}
                          onRatingChange={setSelectedRating}
                          readOnly={false}
                          size={20}
                        />
                      </div>
                    </div>

                    {/* Suggestions Field */}
                    <div className="mb-3 sm:mb-4 md:mb-6">
                      <label
                        htmlFor="suggestions"
                        className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                      >
                        Suggestions / Feedback (Optional)
                      </label>
                      <textarea
                        id="suggestions"
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Share your thoughts, suggestions, or feedback..."
                        className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                        rows="3"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setIsRatingModalOpen(false);
                          setRatingMaterialId(null);
                          setRatingMaterialTitle("");
                          setSelectedRating(0);
                          setSuggestions("");
                          setUserRating(null);
                        }}
                        className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        disabled={isSubmittingRating}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitRating}
                        disabled={isSubmittingRating || selectedRating === 0}
                        className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmittingRating ? (
                          <>
                            <svg
                              className="animate-spin h-3 w-3 sm:h-4 sm:w-4"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span className="text-xs sm:text-sm">
                              Submitting...
                            </span>
                          </>
                        ) : (
                          <>
                            <FaStar className="text-xs sm:text-sm" />
                            <span className="text-xs sm:text-sm">
                              {userRating ? "Update" : "Submit"}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
              {/* Alert Dialog */}
              <AlertDialog
                isOpen={alertDialog.isOpen}
                message={alertDialog.message}
                type={alertDialog.type}
                onClose={() =>
                  setAlertDialog({
                    isOpen: false,
                    message: "",
                    type: "success",
                  })
                }
              />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default JHSMaterials;
