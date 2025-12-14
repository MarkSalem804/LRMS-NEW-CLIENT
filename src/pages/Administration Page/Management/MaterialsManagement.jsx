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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Materials Management</h1>
            <p className="text-blue-100 text-sm">
              Manage learning materials and resources
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsMetadataModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <FaFileExcel />
              <span>Upload Metadata</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Total Materials
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaDatabase className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                With Files
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {materials.filter((m) => m.fileName).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUpload className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Filtered Results
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredMaterials.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaFilter className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Current Page
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {currentPage} / {totalPages || 1}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl font-bold">#</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search materials by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
          </div>

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              isFilterOpen
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FaFilter />
            <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
            {(selectedGrade || selectedArea || selectedResourceType) && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="border-t border-gray-200 pt-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                Filter Options
              </h3>
              <button
                onClick={() => {
                  setSelectedGrade("");
                  setSelectedArea("");
                  setSelectedResourceType("");
                  setSelectedComponent("");
                  setSelectedCoreSubject("");
                  setSelectedTrack("");
                  setSelectedSubTrack("");
                  setSelectedAppliedSubject("");
                  setSelectedSpecializedSubject("");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Grade Level Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Resource Type
                </label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Module">Module</option>
                  <option value="Lesson Exemplar">Lesson Exemplar</option>
                  <option value="Activity Guide">Activity Guide</option>
                </select>
              </div>

              {/* Learning Area Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
                  Learning Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </div>

      {/* Materials Cards Grid */}
      <div>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading materials...</p>
          </div>
        ) : paginatedMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedMaterials.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">
                        {material.title}
                      </h3>
                      <p className="text-xs text-blue-100 truncate">
                        {material.description || "No description"}
                      </p>
                    </div>
                    {material.fileName && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Grade Level
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {material.gradeLevelName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Resource Type
                      </p>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {material.typeName || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Learning Area / Subject
                    </p>
                    <p className="text-sm text-gray-900 font-medium truncate">
                      {material.learningAreaName ||
                        material.subjectTypeName ||
                        "N/A"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleViewMaterial(material.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-lg transition-colors"
                      title="View Material"
                      disabled={!material.fileName}
                    >
                      <FaEye size={14} />
                      <span className="text-xs">View</span>
                    </button>
                    <Link
                      to={`/materials/edit/${material.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                      <span className="text-xs">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleUploadFile(material)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-medium rounded-lg transition-colors"
                      title="Upload File"
                    >
                      <FaUpload size={14} />
                      <span className="text-xs">Upload</span>
                    </button>
                    <button
                      // onClick={() => handleDelete(material.id)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                      disabled
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FaDatabase className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-lg text-gray-500 mb-2">No materials found</p>
            <p className="text-sm text-gray-400">
              {searchTerm ||
              selectedGrade ||
              selectedArea ||
              selectedResourceType
                ? "Try adjusting your search or filters"
                : "Upload metadata to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredMaterials.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(currentPage * itemsPerPage, filteredMaterials.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {filteredMaterials.length}
              </span>{" "}
              materials
            </div>
            <div>
              <div className="flex gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
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
                            <span className="px-3 py-2 text-gray-500">...</span>
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
