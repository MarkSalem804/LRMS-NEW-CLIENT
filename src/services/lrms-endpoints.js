/* eslint-disable no-unused-vars */
import axios from "axios";
import axiosInstance from "./axios-config"; // Authenticated axios instance with JWT token support

const customError = new Error("Network error or no response");
const BASE_URL = "http://localhost:5001";
// const BASE_URL = "https://sdoic-ilearn.depedimuscity.com:5005";

// Function to upload material metadata (Excel file)
export const uploadMaterialsMetadata = async (excelFile) => {
  const formData = new FormData();
  formData.append("excelFile", excelFile); // 'excelFile' should match the server's upload field name

  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/upload-materials`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading material metadata:", error);
    throw error.response?.data || customError;
  }
};

// Function to upload a specific material file
export const uploadMaterialFile = async (materialId, materialFile) => {
  const formData = new FormData();
  formData.append("materialFile", materialFile); // 'materialFile' should match the server's upload field name

  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/upload-material-file/${materialId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error uploading material file for ID ${materialId}:`, error);
    throw error.response?.data || customError;
  }
};

// Function to fetch all materials
export const getAllMaterials = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/lrms/getAllMaterials`);
    return response.data;
  } catch (error) {
    console.error("Error fetching materials:", error);
    throw error.response?.data || customError;
  }
};

// View a material file
export const viewMaterialFile = (materialId, title) => {
  const encodedTitle = encodeURIComponent(title || "");
  // Add PDF viewer parameters to hide toolbar and download buttons
  return `${BASE_URL}/lrms/view-material/${materialId}?title=${encodedTitle}#toolbar=0&navpanes=0&scrollbar=0`;
};

// Download a material file
export const downloadMaterialFile = (materialId, title) => {
  const encodedTitle = encodeURIComponent(title || "");
  return `${BASE_URL}/lrms/download-material/${materialId}?title=${encodedTitle}`;
};

// Get material details
export const getMaterialDetails = async (materialId) => {
  const response = await axios.get(
    `${BASE_URL}/lrms/get-material/${materialId}`
  );
  return response.data;
};

// Increment material views
export const incrementMaterialViews = async (materialId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/increment-views/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error incrementing material views:", error);
    // Don't throw error - view counting should not break the app
    return { success: false };
  }
};

// Increment material downloads
export const incrementMaterialDownloads = async (materialId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/increment-downloads/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error incrementing material downloads:", error);
    // Don't throw error - download counting should not break the app
    return { success: false };
  }
};

// Get filter options for materials
export const getFilterOptions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/lrms/get-filter-options`);
    return response.data;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error.response?.data || customError;
  }
};

// CRUD operations for data management (kept for backward compatibility)
// NOTE: These use the old endpoints. The new RESTful endpoints are below.
// These are kept for any legacy code that might still reference them.

export const addCoreSubject = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/add-core-subject`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding core subject:", error);
    throw error.response?.data || customError;
  }
};

export const updateCoreSubject = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-core-subject/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating core subject:", error);
    throw error.response?.data || customError;
  }
};

export const deleteCoreSubject = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/lrms/delete-core-subject/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting core subject:", error);
    throw error.response?.data || customError;
  }
};

// Strands CRUD Functions
export const getAllStrands = async () => {
  try {
    const response = await axiosInstance.get("/lrms/strands");
    return response.data;
  } catch (error) {
    console.error("Error fetching strands:", error);
    throw error.response?.data || customError;
  }
};

export const addStrand = async (data) => {
  try {
    const response = await axiosInstance.post("/lrms/strands", data);
    return response.data;
  } catch (error) {
    console.error("Error adding strand:", error);
    throw error.response?.data || customError;
  }
};

export const updateStrand = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/lrms/strands/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating strand:", error);
    throw error.response?.data || customError;
  }
};

export const deleteStrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/strands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting strand:", error);
    throw error.response?.data || customError;
  }
};

export const addAppliedSubject = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/add-applied-subject`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding applied subject:", error);
    throw error.response?.data || customError;
  }
};

export const updateAppliedSubject = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-applied-subject/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating applied subject:", error);
    throw error.response?.data || customError;
  }
};

export const deleteAppliedSubject = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/lrms/delete-applied-subject/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting applied subject:", error);
    throw error.response?.data || customError;
  }
};

export const addSpecializedSubject = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/add-specialized-subject`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding specialized subject:", error);
    throw error.response?.data || customError;
  }
};

export const updateSpecializedSubject = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-specialized-subject/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating specialized subject:", error);
    throw error.response?.data || customError;
  }
};

export const deleteSpecializedSubject = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/lrms/delete-specialized-subject/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting specialized subject:", error);
    throw error.response?.data || customError;
  }
};

// Material Rating Endpoints
// Submit or update a material rating
// Protected route - JWT token is automatically added by axiosInstance
// userId is now obtained from the JWT token on the backend
export const submitMaterialRating = async (
  materialId,
  userId, // Keep for backward compatibility, but it's not sent to backend (backend uses JWT token)
  rating,
  suggestions
) => {
  try {
    // Use axiosInstance which automatically adds JWT token to Authorization header
    const response = await axiosInstance.post(
      `/lrms/submit-rating/${materialId}`,
      {
        // userId removed - backend gets it from JWT token
        rating,
        suggestions,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting material rating:", error);
    throw error.response?.data || customError;
  }
};

// Get all ratings for a material
export const getMaterialRatings = async (materialId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/lrms/get-ratings/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting material ratings:", error);
    throw error.response?.data || customError;
  }
};

// Get user's rating for a specific material
// Protected route - JWT token is automatically added by axiosInstance
// userId is now obtained from the JWT token on the backend
export const getUserRatingForMaterial = async (materialId, userId) => {
  try {
    // Use axiosInstance which automatically adds JWT token to Authorization header
    // Backend gets userId from JWT token, so we don't need to pass it in URL
    const response = await axiosInstance.get(
      `/lrms/get-user-rating/${materialId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting user rating:", error);
    throw error.response?.data || customError;
  }
};

// Update a material rating
// Protected route - JWT token is automatically added by axiosInstance
export const updateMaterialRating = async (ratingId, rating, suggestions) => {
  try {
    // Use axiosInstance which automatically adds JWT token to Authorization header
    const response = await axiosInstance.put(
      `/lrms/update-rating/${ratingId}`,
      {
        rating,
        suggestions,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating material rating:", error);
    throw error.response?.data || customError;
  }
};

// Delete a material rating
// Protected route - JWT token is automatically added by axiosInstance
export const deleteMaterialRating = async (ratingId) => {
  try {
    // Use axiosInstance which automatically adds JWT token to Authorization header
    const response = await axiosInstance.delete(
      `/lrms/delete-rating/${ratingId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting material rating:", error);
    throw error.response?.data || customError;
  }
};

// ==================== POSITIONS API ====================
export const getAllPositions = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/positions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error.response?.data || customError;
  }
};

export const addPosition = async (positionData) => {
  try {
    const response = await axiosInstance.post(`/lrms/positions`, positionData);
    return response.data;
  } catch (error) {
    console.error("Error adding position:", error);
    throw error.response?.data || customError;
  }
};

export const updatePosition = async (id, positionData) => {
  try {
    const response = await axiosInstance.put(
      `/lrms/positions/${id}`,
      positionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating position:", error);
    throw error.response?.data || customError;
  }
};

export const deletePosition = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/positions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting position:", error);
    throw error.response?.data || customError;
  }
};

// ==================== SCHOOLS API ====================
export const getAllSchools = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/schools`);
    return response.data;
  } catch (error) {
    console.error("Error fetching schools:", error);
    throw error.response?.data || customError;
  }
};

export const addSchool = async (schoolData) => {
  try {
    const response = await axiosInstance.post(`/lrms/schools`, schoolData);
    return response.data;
  } catch (error) {
    console.error("Error adding school:", error);
    throw error.response?.data || customError;
  }
};

export const updateSchool = async (id, schoolData) => {
  try {
    const response = await axiosInstance.put(`/lrms/schools/${id}`, schoolData);
    return response.data;
  } catch (error) {
    console.error("Error updating school:", error);
    throw error.response?.data || customError;
  }
};

export const deleteSchool = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/schools/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting school:", error);
    throw error.response?.data || customError;
  }
};

// ==================== OFFICES API ====================
export const getAllOffices = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/offices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching offices:", error);
    throw error.response?.data || customError;
  }
};

export const addOffice = async (officeData) => {
  try {
    const response = await axiosInstance.post(`/lrms/offices`, officeData);
    return response.data;
  } catch (error) {
    console.error("Error adding office:", error);
    throw error.response?.data || customError;
  }
};

export const updateOffice = async (id, officeData) => {
  try {
    const response = await axiosInstance.put(`/lrms/offices/${id}`, officeData);
    return response.data;
  } catch (error) {
    console.error("Error updating office:", error);
    throw error.response?.data || customError;
  }
};

export const deleteOffice = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/offices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting office:", error);
    throw error.response?.data || customError;
  }
};

// ==================== GRADE LEVELS API ====================
export const getAllGradeLevels = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/grade-levels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching grade levels:", error);
    throw error.response?.data || customError;
  }
};

export const addGradeLevel = async (gradeLevelData) => {
  try {
    const response = await axiosInstance.post(
      `/lrms/grade-levels`,
      gradeLevelData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding grade level:", error);
    throw error.response?.data || customError;
  }
};

export const updateGradeLevel = async (id, gradeLevelData) => {
  try {
    const response = await axiosInstance.put(
      `/lrms/grade-levels/${id}`,
      gradeLevelData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating grade level:", error);
    throw error.response?.data || customError;
  }
};

export const deleteGradeLevel = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/grade-levels/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting grade level:", error);
    throw error.response?.data || customError;
  }
};

// ==================== LEARNING AREAS API ====================
export const getAllLearningAreas = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/learning-areas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching learning areas:", error);
    throw error.response?.data || customError;
  }
};

export const addLearningArea = async (learningAreaData) => {
  try {
    const response = await axiosInstance.post(
      `/lrms/learning-areas`,
      learningAreaData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding learning area:", error);
    throw error.response?.data || customError;
  }
};

export const updateLearningArea = async (id, learningAreaData) => {
  try {
    const response = await axiosInstance.put(
      `/lrms/learning-areas/${id}`,
      learningAreaData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learning area:", error);
    throw error.response?.data || customError;
  }
};

export const deleteLearningArea = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/learning-areas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting learning area:", error);
    throw error.response?.data || customError;
  }
};

// ==================== COMPONENTS API ====================
export const getAllComponents = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/components`);
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    throw error.response?.data || customError;
  }
};

export const addComponent = async (componentData) => {
  try {
    const response = await axiosInstance.post(
      `/lrms/components`,
      componentData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding component:", error);
    throw error.response?.data || customError;
  }
};

export const updateComponent = async (id, componentData) => {
  try {
    const response = await axiosInstance.put(
      `/lrms/components/${id}`,
      componentData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating component:", error);
    throw error.response?.data || customError;
  }
};

export const deleteComponent = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/components/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting component:", error);
    throw error.response?.data || customError;
  }
};

// ==================== TRACKS API ====================
export const getAllTracks = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/tracks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw error.response?.data || customError;
  }
};

export const addTrack = async (trackData) => {
  try {
    const response = await axiosInstance.post(`/lrms/tracks`, trackData);
    return response.data;
  } catch (error) {
    console.error("Error adding track:", error);
    throw error.response?.data || customError;
  }
};

export const updateTrack = async (id, trackData) => {
  try {
    const response = await axiosInstance.put(`/lrms/tracks/${id}`, trackData);
    return response.data;
  } catch (error) {
    console.error("Error updating track:", error);
    throw error.response?.data || customError;
  }
};

export const deleteTrack = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/tracks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error.response?.data || customError;
  }
};

// ==================== TYPES (MATERIALS TYPE) API ====================
export const getAllTypes = async () => {
  try {
    const response = await axiosInstance.get(`/lrms/types`);
    return response.data;
  } catch (error) {
    console.error("Error fetching types:", error);
    throw error.response?.data || customError;
  }
};

export const addType = async (typeData) => {
  try {
    const response = await axiosInstance.post(`/lrms/types`, typeData);
    return response.data;
  } catch (error) {
    console.error("Error adding type:", error);
    throw error.response?.data || customError;
  }
};

export const updateType = async (id, typeData) => {
  try {
    const response = await axiosInstance.put(`/lrms/types/${id}`, typeData);
    return response.data;
  } catch (error) {
    console.error("Error updating type:", error);
    throw error.response?.data || customError;
  }
};

export const deleteType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting type:", error);
    throw error.response?.data || customError;
  }
};

// Subject Types CRUD Functions
export const getAllSubjectTypes = async () => {
  try {
    const response = await axiosInstance.get("/lrms/subject-types");
    return response.data;
  } catch (error) {
    console.error("Error fetching subject types:", error);
    throw error.response?.data || customError;
  }
};

export const addSubjectType = async (subjectTypeData) => {
  try {
    const response = await axiosInstance.post(
      "/lrms/subject-types",
      subjectTypeData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding subject type:", error);
    throw error.response?.data || customError;
  }
};

export const updateSubjectType = async (id, subjectTypeData) => {
  try {
    const response = await axiosInstance.put(
      `/lrms/subject-types/${id}`,
      subjectTypeData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating subject type:", error);
    throw error.response?.data || customError;
  }
};

export const deleteSubjectType = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lrms/subject-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting subject type:", error);
    throw error.response?.data || customError;
  }
};
