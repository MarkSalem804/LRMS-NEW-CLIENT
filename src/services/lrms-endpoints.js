/* eslint-disable no-unused-vars */
import axios from "axios";

const customError = new Error("Network error or no response");
// const BASE_URL = "http://localhost:5001";
const BASE_URL = "https://ilearn-beta.depedimuscity.com:5001";

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
  return `${BASE_URL}/lrms/view-material/${materialId}?title=${encodedTitle}`;
};

// Get material details
export const getMaterialDetails = async (materialId) => {
  const response = await axios.get(
    `${BASE_URL}/lrms/get-material/${materialId}`
  );
  return response.data;
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

// CRUD operations for data management
export const addLearningArea = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/lrms/add-learning-area`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error adding learning area:", error);
    throw error.response?.data || customError;
  }
};

export const updateLearningArea = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-learning-area/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating learning area:", error);
    throw error.response?.data || customError;
  }
};

export const deleteLearningArea = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/lrms/delete-learning-area/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting learning area:", error);
    throw error.response?.data || customError;
  }
};

export const addComponent = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/lrms/add-component`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding component:", error);
    throw error.response?.data || customError;
  }
};

export const updateComponent = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-component/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating component:", error);
    throw error.response?.data || customError;
  }
};

export const deleteComponent = async (id) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/lrms/delete-component/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting component:", error);
    throw error.response?.data || customError;
  }
};

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

export const addTrack = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/lrms/add-track`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding track:", error);
    throw error.response?.data || customError;
  }
};

export const updateTrack = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-track/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating track:", error);
    throw error.response?.data || customError;
  }
};

export const deleteTrack = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/lrms/delete-track/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting track:", error);
    throw error.response?.data || customError;
  }
};

export const addStrand = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/lrms/add-strand`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding strand:", error);
    throw error.response?.data || customError;
  }
};

export const updateStrand = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-strand/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating strand:", error);
    throw error.response?.data || customError;
  }
};

export const deleteStrand = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/lrms/delete-strand/${id}`);
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

export const addType = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/lrms/add-type`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding type:", error);
    throw error.response?.data || customError;
  }
};

export const updateType = async (id, data) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/lrms/update-type/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating type:", error);
    throw error.response?.data || customError;
  }
};

export const deleteType = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/lrms/delete-type/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting type:", error);
    throw error.response?.data || customError;
  }
};
