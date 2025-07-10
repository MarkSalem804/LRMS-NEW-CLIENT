/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUpload,
  FaFileExcel,
  FaDatabase,
  FaEye,
  // FaTimes,
  // FaDownload,
} from "react-icons/fa";
import {
  getAllMaterials,
  uploadMaterialFile,
  uploadMaterialsMetadata,
  viewMaterialFile,
  getMaterialDetails,
} from "../../../services/lrms-endpoints";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Modal from "react-modal";

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fixed number of items per page

  // Filter states for SHS
  const [selectedCoreSubject, setSelectedCoreSubject] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedSubTrack, setSelectedSubTrack] = useState("");
  const [selectedAppliedSubject, setSelectedAppliedSubject] = useState("");
  const [selectedSpecializedSubject, setSelectedSpecializedSubject] =
    useState("");

  // Add new state for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Add new state for metadata upload modal
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [metadataFile, setMetadataFile] = useState(null);
  const [isMetadataUploading, setIsMetadataUploading] = useState(false);
  const [metadataError, setMetadataError] = useState(null);

  // Add new state for view modal
  const [viewMaterialUrl, setViewMaterialUrl] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMaterialTitle, setViewMaterialTitle] = useState("");

  // Fetch materials on component mount
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const response = await getAllMaterials();
        if (response.success) {
          setMaterials(response.data);
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

  // Filter materials based on search term and filters
  const filteredMaterials = materials.filter((material) => {
    if (!material) return false;

    const matchesSearch =
      !searchTerm ||
      (material.title &&
        material.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.description &&
        material.description.toLowerCase().includes(searchTerm.toLowerCase()));

    if (searchTerm && !matchesSearch) return false;

    const matchesResourceType =
      !selectedResourceType ||
      (material.typeName && material.typeName === selectedResourceType);
    if (!matchesResourceType) return false;

    // Grade filtering
    if (selectedGrade) {
      if (selectedGrade === "Kindergarten") {
        if (material.gradeLevelName !== "Kindergarten") return false;
      } else {
        const materialGrade = parseInt(
          material.gradeLevelName?.replace("Grade ", "")
        );
        if (materialGrade !== parseInt(selectedGrade)) return false;
      }
    }

    // Learning Area filtering
    if (selectedArea && material.learningAreaName !== selectedArea)
      return false;

    // Component filtering
    if (selectedComponent && material.componentName !== selectedComponent)
      return false;

    // SHS specific filters
    if (selectedCoreSubject && material.subjectTypeName !== selectedCoreSubject)
      return false;
    if (selectedTrack && material.trackName !== selectedTrack) return false;
    if (selectedSubTrack && material.strandName !== selectedSubTrack)
      return false;
    if (
      selectedAppliedSubject &&
      material.subjectTypeName !== selectedAppliedSubject
    )
      return false;
    if (
      selectedSpecializedSubject &&
      material.subjectTypeName !== selectedSpecializedSubject
    )
      return false;

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // const handleDelete = async (id) => {
  //   // TODO: Implement delete functionality
  //   // console.log("Delete material with ID:", id);
  // };

  const handleUploadFile = (material) => {
    // console.log("Opening upload modal for material:", material);
    setSelectedMaterial(material);
    setIsUploadModalOpen(true);
    setUploadFile(null);
    setUploadError(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // console.log("File selected:", file?.name, "Size:", file?.size, "bytes");
    setUploadFile(file);
    setUploadError(null);
  };

  const handleMetadataFileChange = (event) => {
    const file = event.target.files[0];
    // console.log(
    //   "Metadata file selected:",
    //   file?.name,
    //   "Size:",
    //   file?.size,
    //   "bytes"
    // );
    setMetadataFile(file);
    setMetadataError(null);
  };

  const handleMetadataUpload = async () => {
    if (!metadataFile) {
      // console.log("[Metadata Upload] Upload attempted without file selection");
      setMetadataError("Please select an Excel file to upload");
      return;
    }

    // console.log("[Metadata Upload] Starting upload process");
    // console.log("[Metadata Upload] File details:", {
    //   name: metadataFile.name,
    //   size: metadataFile.size,
    //   type: metadataFile.type,
    //   lastModified: new Date(metadataFile.lastModified).toISOString(),
    // });

    setIsMetadataUploading(true);
    setMetadataError(null);

    try {
      // console.log("[Metadata Upload] Preparing FormData...");
      // console.log("[Metadata Upload] Calling uploadMaterialsMetadata API...");
      const response = await uploadMaterialsMetadata(metadataFile);
      // console.log("[Metadata Upload] API Response:", {
      //   success: response.success,
      //   message: response.message,
      //   totalUploaded: response.totalUploaded,
      //   totalDuplicates: response.totalDuplicates,
      //   duplicates: response.duplicates,
      // });

      if (response.success) {
        // console.log("[Metadata Upload] Upload successful");
        // Close modal and refresh materials list
        setIsMetadataModalOpen(false);
        setMetadataFile(null);

        // Refresh the materials list
        // console.log("[Metadata Upload] Refreshing materials list...");
        const updatedResponse = await getAllMaterials();
        // console.log("[Metadata Upload] Materials list refresh response:", {
        //   success: updatedResponse.success,
        //   count: updatedResponse.data?.length,
        // });

        if (updatedResponse.success) {
          // console.log(
          //   "[Metadata Upload] Materials list refreshed successfully"
          // );
          setMaterials(updatedResponse.data);

          // Show success notification with duplicate info if any
          if (response.duplicates && response.duplicates.length > 0) {
            // console.log(
            //   "[Metadata Upload] Showing warning notification for duplicates"
            // );
            Swal.fire({
              icon: "warning",
              title: "Upload Complete",
              text: `Successfully uploaded ${response.totalUploaded} materials. ${response.totalDuplicates} duplicates were skipped.`,
              toast: true,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 5000,
              timerProgressBar: true,
              background: "#FFA500",
              color: "#fff",
              iconColor: "#fff",
              customClass: {
                popup: "colored-toast",
                title: "colored-toast-title",
                htmlContainer: "colored-toast-content",
              },
            });
          } else {
            // console.log("[Metadata Upload] Showing success notification");
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Successfully uploaded ${response.totalUploaded} materials!`,
              toast: true,
              position: "bottom-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              background: "#4CAF50",
              color: "#fff",
              iconColor: "#fff",
              customClass: {
                popup: "colored-toast",
                title: "colored-toast-title",
                htmlContainer: "colored-toast-content",
              },
            });
          }
        } else {
          console.error(
            "[Metadata Upload] Failed to refresh materials list:",
            updatedResponse.message
          );
        }
      } else {
        console.error("[Metadata Upload] Upload failed:", response.message);
        setMetadataError(response.message || "Failed to upload metadata");
        // Show error notification
        // console.log("[Metadata Upload] Showing error notification");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.message || "Failed to upload metadata",
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#f44336",
          color: "#fff",
          iconColor: "#fff",
          customClass: {
            popup: "colored-toast",
            title: "colored-toast-title",
            htmlContainer: "colored-toast-content",
          },
        });
      }
    } catch (error) {
      console.error("[Metadata Upload] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setMetadataError(
        error.message || "An error occurred while uploading the metadata"
      );
      // Show error notification
      // console.log(
      //   "[Metadata Upload] Showing error notification for caught error"
      // );
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while uploading the metadata",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#f44336",
        color: "#fff",
        iconColor: "#fff",
        customClass: {
          popup: "colored-toast",
          title: "colored-toast-title",
          htmlContainer: "colored-toast-content",
        },
      });
    } finally {
      setIsMetadataUploading(false);
      // console.log("[Metadata Upload] Upload process completed");
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile) {
      // console.log("[File Upload] Upload attempted without file selection");
      setUploadError("Please select a file to upload");
      return;
    }

    // console.log(
    //   "[File Upload] Starting upload process for material:",
    //   selectedMaterial.id
    // );
    // console.log("[File Upload] Material details:", {
    //   id: selectedMaterial.id,
    //   title: selectedMaterial.title,
    //   gradeLevel: selectedMaterial.gradeLevelName,
    //   type: selectedMaterial.typeName,
    // });
    // console.log("[File Upload] File details:", {
    //   name: uploadFile.name,
    //   size: uploadFile.size,
    //   type: uploadFile.type,
    //   lastModified: new Date(uploadFile.lastModified).toISOString(),
    // });

    setIsUploading(true);
    setUploadError(null);

    try {
      // console.log("[File Upload] Preparing FormData...");
      // console.log("[File Upload] Calling uploadMaterialFile API...");
      const response = await uploadMaterialFile(
        selectedMaterial.id,
        uploadFile
      );
      // console.log("[File Upload] API Response:", {
      //   success: response.success,
      //   message: response.message,
      //   data: response.data,
      // });

      if (response.success) {
        // console.log("[File Upload] File upload successful");
        // Close modal and refresh materials list
        setIsUploadModalOpen(false);
        // Refresh the materials list
        // console.log("[File Upload] Refreshing materials list...");
        const updatedResponse = await getAllMaterials();
        // console.log("[File Upload] Materials list refresh response:", {
        //   success: updatedResponse.success,
        //   count: updatedResponse.data?.length,
        // });

        if (updatedResponse.success) {
          // console.log("[File Upload] Materials list refreshed successfully");
          setMaterials(updatedResponse.data);
          // Show success notification
          // console.log("[File Upload] Showing success notification");
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "File uploaded successfully!",
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: "#4CAF50",
            color: "#fff",
            iconColor: "#fff",
            customClass: {
              popup: "colored-toast",
              title: "colored-toast-title",
              htmlContainer: "colored-toast-content",
            },
          });
        } else {
          console.error(
            "[File Upload] Failed to refresh materials list:",
            updatedResponse.message
          );
        }
      } else {
        console.error("[File Upload] Upload failed:", response.message);
        setUploadError(response.message || "Failed to upload file");
        // Show error notification
        // console.log("[File Upload] Showing error notification");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.message || "Failed to upload file",
          toast: true,
          position: "bottom-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: "#f44336",
          color: "#fff",
          iconColor: "#fff",
          customClass: {
            popup: "colored-toast",
            title: "colored-toast-title",
            htmlContainer: "colored-toast-content",
          },
        });
      }
    } catch (error) {
      console.error("[File Upload] Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setUploadError(
        error.message || "An error occurred while uploading the file"
      );
      // Show error notification
      // console.log("[File Upload] Showing error notification for caught error");
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message || "An error occurred while uploading the file",
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: "#f44336",
        color: "#fff",
        iconColor: "#fff",
        customClass: {
          popup: "colored-toast",
          title: "colored-toast-title",
          htmlContainer: "colored-toast-content",
        },
      });
    } finally {
      setIsUploading(false);
      // console.log("[File Upload] Upload process completed");
    }
  };

  const handleViewMaterial = async (materialId) => {
    try {
      // Get material details first
      const materialDetails = await getMaterialDetails(materialId);
      const title = materialDetails.material.title;
      setViewMaterialTitle(title);

      // Set the view URL with title
      const url = viewMaterialFile(materialId, title);
      setViewMaterialUrl(url);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error getting material details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to get material details",
      });
    }
  };

  // Add cleanup function for blob URL
  useEffect(() => {
    return () => {
      if (viewMaterialUrl) {
        window.URL.revokeObjectURL(viewMaterialUrl);
      }
    };
  }, [viewMaterialUrl]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        <span className="flex items-center gap-2">
          <FaDatabase size={32} /> MATERIALS MANAGEMENT
        </span>
      </h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          onClick={() => setIsMetadataModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          <FaFileExcel />
          <span>Upload Metadata</span>
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <FaFilter />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Add your filter components here similar to Materials.jsx */}
            {/* Grade Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grade Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Grades</option>
                <option value="Kindergarten">Kindergarten</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Resource Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Resource Type
              </label>
              <select
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                <option value="Module">Module</option>
                <option value="Lesson Exemplar">Lesson Exemplar</option>
                <option value="Activity Guide">Activity Guide</option>
              </select>
            </div>

            {/* Learning Area Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Areas</option>
                <option value="MTB-MLE">MTB-MLE</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Filipino">Filipino</option>
                <option value="Araling Panlipunan">Araling Panlipunan</option>
                <option value="MAPEH">MAPEH</option>
                <option value="Edukasyon sa Pagpapakatao">
                  Edukasyon sa Pagpapakatao
                </option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Materials Table */}
      <div className="bg-blue-50 text-gray-800 dark:bg-gray-800 dark:text-white rounded-lg shadow overflow-hidden mb-0 border border-blue-500 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-400 dark:divide-gray-700">
          <thead className="bg-blue-500 dark:bg-blue-700 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Grade Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Learning Area
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Resource Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-400 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  Loading materials...
                </td>
              </tr>
            ) : paginatedMaterials.length > 0 ? (
              <>
                {paginatedMaterials.map((material) => (
                  <tr key={material.id} className="h-[73px]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {material.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {material.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {material.gradeLevelName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {material.learningAreaName ||
                          material.subjectTypeName ||
                          "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {material.typeName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewMaterial(material.id)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          title="View Material"
                        >
                          <FaEye size={16} />
                        </button>
                        <Link
                          to={`/materials/edit/${material.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <FaEdit size={16} />
                        </Link>
                        <button
                          // onClick={() => handleDelete(material.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <FaTrash size={16} />
                        </button>
                        <button
                          onClick={() => handleUploadFile(material)}
                          className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                        >
                          <FaUpload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Add empty rows if needed */}
                {Array.from({
                  length: Math.max(0, itemsPerPage - paginatedMaterials.length),
                }).map((_, index) => (
                  <tr key={`empty-${index}`} className="h-[73px]">
                    <td className="px-6 py-4 whitespace-nowrap" colSpan="5">
                      <div className="h-full"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No materials found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="bg-blue-500 px-4 py-3 flex items-center justify-between border-t border-blue-600 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-white">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredMaterials.length === 0
                      ? 0
                      : (currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredMaterials.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredMaterials.length}
                  </span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  {/* First Page Button */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-white bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">First</span>
                    &laquo;
                  </button>

                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 border border-white bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    &lsaquo;
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(currentPage - page) <= 1
                      );
                    })
                    .map((page, index, array) => {
                      if (index > 0 && array[index - 1] !== page - 1) {
                        return (
                          <React.Fragment key={`ellipsis-${page}`}>
                            <span className="relative inline-flex items-center px-4 py-2 border border-white bg-blue-500 text-sm font-medium text-white">
                              ...
                            </span>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? "z-10 bg-white border-white text-blue-500"
                                  : "bg-blue-500 border-white text-white hover:bg-blue-600"
                              }`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-white border-white text-blue-500"
                              : "bg-blue-500 border-white text-white hover:bg-blue-600"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 border border-white bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    &rsaquo;
                  </button>

                  {/* Last Page Button */}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-white bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata Upload Modal */}
      {isMetadataModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upload Materials Metadata
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Excel File
              </label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleMetadataFileChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isMetadataUploading}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Only Excel files (.xlsx, .xls) are accepted
              </p>
            </div>

            {metadataError && (
              <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
                {metadataError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsMetadataModalOpen(false);
                  setMetadataFile(null);
                  setMetadataError(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                disabled={isMetadataUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleMetadataUpload}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isMetadataUploading}
              >
                {isMetadataUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Upload File for {selectedMaterial?.title}
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                disabled={isUploading}
              />
            </div>

            {uploadError && (
              <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
                {uploadError}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Material Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => {
          setIsViewModalOpen(false);
          setViewMaterialUrl(null);
          setViewMaterialTitle("");
        }}
        contentLabel="View Material"
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 z-[9999]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
      >
        <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative z-[9999] p-0">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-6 pb-4 rounded-t-xl flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {viewMaterialTitle || "View Material"}
              </h2>
              <p className="text-sm text-blue-100">
                Learning Resource Material
              </p>
            </div>
            <button
              onClick={() => {
                setIsViewModalOpen(false);
                setViewMaterialUrl(null);
                setViewMaterialTitle("");
              }}
              className="text-white hover:text-blue-100 transition-colors duration-200 p-2 rounded-full hover:bg-blue-500"
              aria-label="Close"
            >
              <span className="text-3xl leading-none">&times;</span>
            </button>
          </div>
          {/* Content Section */}
          <div className="flex-1 bg-white rounded-b-xl p-6 overflow-hidden">
            {viewMaterialUrl ? (
              <iframe
                src={viewMaterialUrl}
                title={viewMaterialTitle}
                className="w-full h-full border-0 rounded-lg"
                aria-label={viewMaterialTitle}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">No material to display</p>
                  <p className="text-sm text-gray-400">
                    Please select a material to view
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MaterialsManagement;
